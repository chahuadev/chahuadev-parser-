import errorHandler from './ErrorHandler.js';
import {
    SYSTEM_ERROR_CODES,
    SECURITY_ERROR_CODES,
    ERROR_SOURCE_CODES
} from './error-catalog.js';
import {
    ERROR_SEVERITY_FLAGS,
    coerceErrorSeverity
} from '../constants/severity-constants.js';

const DEFAULT_SYSTEM_SOURCE = ERROR_SOURCE_CODES.SYSTEM;
const DEFAULT_SECURITY_CONTEXT_TAG = 'SECURITY';

function ensureErrorInstance(candidate) {
    if (candidate instanceof Error) {
        return candidate;
    }

    if (candidate && typeof candidate === 'object' && candidate.error instanceof Error) {
        return candidate.error;
    }

    const message = candidate === undefined || candidate === null
        ? 'Unknown error'
        : String(candidate);
    const fallbackError = new Error(message);
    fallbackError.name = 'SystemError';
    return fallbackError;
}

function sanitizeContextBlock(context = {}) {
    if (!context || typeof context !== 'object') {
        return {};
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(context)) {
        if (value === undefined || typeof value === 'function') {
            continue;
        }
        sanitized[key] = value;
    }
    return sanitized;
}

function resolveSeverityCode(candidate, fallback) {
    return coerceErrorSeverity(candidate, fallback);
}

export function createSystemPayload(errorCode, originalError, context = {}, options = {}) {
    const {
        severityCode: contextSeverity,
        severity: contextSeverityLabel,
        sourceCode: contextSourceCode,
        ...contextRest
    } = context || {};

    const severityCandidate = options.severityCode ?? contextSeverity ?? contextSeverityLabel;
    const severityCode = resolveSeverityCode(
        severityCandidate,
        options.defaultSeverity ?? ERROR_SEVERITY_FLAGS.MEDIUM
    );

    const payload = {
        kind: options.kind || 'system',
        code: errorCode ?? SYSTEM_ERROR_CODES.UNKNOWN_RUNTIME_FAILURE,
        severityCode,
        sourceCode: options.sourceCode ?? contextSourceCode ?? DEFAULT_SYSTEM_SOURCE,
        originalError: ensureErrorInstance(originalError),
        context: sanitizeContextBlock(contextRest)
    };

    if (options.timestamp) {
        payload.timestamp = options.timestamp;
    }

    if (options.normalized && typeof options.normalized === 'object') {
        payload.normalized = { ...options.normalized };
    }

    if (options.metadata && typeof options.metadata === 'object') {
        payload.metadata = { ...options.metadata };
    }

    return errorHandler.handleError(payload);
}

export function emitSecurityNotice(errorCode, originalError, context = {}, options = {}) {
    const {
        severityCode: contextSeverity,
        severity: contextSeverityLabel,
        ...contextRest
    } = context || {};

    const severityCandidate = options.severityCode ?? contextSeverity ?? contextSeverityLabel;
    const severityCode = resolveSeverityCode(
        severityCandidate,
        options.defaultSeverity ?? ERROR_SEVERITY_FLAGS.HIGH
    );

    const payload = {
        kind: 'system',
        code: errorCode ?? SECURITY_ERROR_CODES.UNKNOWN_VIOLATION,
        severityCode,
        sourceCode: ERROR_SOURCE_CODES.SECURITY,
        originalError: ensureErrorInstance(originalError),
        context: sanitizeContextBlock({
            category: DEFAULT_SECURITY_CONTEXT_TAG,
            ...contextRest
        })
    };

    if (options.metadata && typeof options.metadata === 'object') {
        payload.metadata = { ...options.metadata };
    }

    return errorHandler.handleError(payload);
}
