// ! Normalization helpers translate binary error payloads into rich metadata objects.
import {
    ERROR_SOURCE_CODES,
    ERROR_SOURCE_CATALOG,
    ERROR_CATEGORY_CODES,
    FALLBACK_RULE_METADATA,
    FALLBACK_ERROR_ENTRY,
    resolveErrorSourceMetadata,
    resolveCategoryMetadata,
    classifyErrorCode,
    describeRuleMetadata,
    resolveDomainMetadata
} from './error-catalog.js';
import {
    resolveDictionaryEntry,
    resolveRuleDictionaryEntry,
    resolveSystemDictionaryEntry,
    resolveErrorMessage as resolveDictionaryMessage,
    RULE_FALLBACK_ENTRY
} from './error-dictionary.js';
import { coerceRuleId } from '../constants/rule-constants.js';
import {
    RULE_SEVERITY_FLAGS,
    ERROR_SEVERITY_FLAGS,
    resolveRuleSeveritySlug,
    resolveErrorSeveritySlug,
    coerceRuleSeverity,
    coerceErrorSeverity
} from '../constants/severity-constants.js';

const DEFAULT_LANGUAGE = 'en';

const SOURCE_SLUG_LOOKUP = Object.freeze(
    Object.entries(ERROR_SOURCE_CATALOG).reduce((accumulator, [codeKey, meta]) => {
        if (meta?.slug) {
            accumulator[meta.slug] = Number(codeKey);
        }
        return accumulator;
    }, {})
);

function coerceCategoryDescriptor(categoryMetadata, entryMetadata = {}) {
    if (entryMetadata.category) {
        return entryMetadata.category;
    }
    if (!categoryMetadata) {
        return null;
    }
    return {
        code: categoryMetadata.code,
        slug: categoryMetadata.slug,
        label: categoryMetadata.label,
        description: categoryMetadata.description
    };
}

function coerceDomainDescriptor(dictionaryEntry, categoryMetadata) {
    const entryMetadata = dictionaryEntry?.metadata;
    if (entryMetadata?.domain) {
        return entryMetadata.domain;
    }

    const candidateCode = dictionaryEntry?.domainCode ?? categoryMetadata?.domainCode;
    const domainDescriptor = resolveDomainMetadata(candidateCode);

    return {
        code: domainDescriptor.code,
        slug: dictionaryEntry?.domainSlug || domainDescriptor.slug,
        label: dictionaryEntry?.domainLabel || domainDescriptor.label,
        description: domainDescriptor.description
    };
}

function coerceRuleSeverityDescriptor(normalizedSeverity, entryMetadata = {}) {
    const descriptor = {
        ...(entryMetadata.severity || {}),
        code: normalizedSeverity,
        label: resolveRuleSeveritySlug(normalizedSeverity)
    };
    return descriptor;
}

function coerceSystemSeverityDescriptor(normalizedSeverity, entryMetadata = {}) {
    const descriptor = {
        ...(entryMetadata.severity || {}),
        code: normalizedSeverity,
        label: resolveErrorSeveritySlug(normalizedSeverity)
    };
    return descriptor;
}

function sanitizeContext(rawContext) {
    if (!rawContext || typeof rawContext !== 'object') {
        return {};
    }
    const normalized = {};
    for (const [key, value] of Object.entries(rawContext)) {
        if (value !== undefined) {
            normalized[key] = value;
        }
    }
    return normalized;
}

function toFiniteNumber(value) {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function normalizeLocationCandidate(candidate, fallbackFilePath) {
    if (!candidate || typeof candidate !== 'object') {
        return null;
    }

    const directFilePath = candidate.filePath || candidate.path || candidate.source || candidate.file || fallbackFilePath || null;

    const startLine = toFiniteNumber(
        candidate.start?.line ??
        candidate.startLine ??
        candidate.line ??
        candidate.loc?.start?.line
    );
    const startColumn = toFiniteNumber(
        candidate.start?.column ??
        candidate.startColumn ??
        candidate.column ??
        candidate.loc?.start?.column
    );

    const endLine = toFiniteNumber(
        candidate.end?.line ??
        candidate.endLine ??
        candidate.loc?.end?.line
    );
    const endColumn = toFiniteNumber(
        candidate.end?.column ??
        candidate.endColumn ??
        candidate.loc?.end?.column
    );

    const hasStart = startLine !== null || startColumn !== null;
    const hasEnd = endLine !== null || endColumn !== null;

    if (!hasStart && !hasEnd) {
        return null;
    }

    const normalizedStart = hasStart ? { line: startLine, column: startColumn } : null;
    const normalizedEnd = hasEnd ? { line: endLine, column: endColumn } : null;

    return {
        filePath: directFilePath,
        start: normalizedStart,
        end: normalizedEnd
    };
}

function resolveLocation(context = {}, options = {}) {
    const fallbackFilePath = options.filePath || context.filePath || context.path || null;
    const candidates = [
        options.location,
        options.position,
        options.codeFrame?.location,
        context.location,
        context.position,
        context.loc,
        context.node?.loc,
        context
    ];

    for (const candidate of candidates) {
        const normalized = normalizeLocationCandidate(candidate, fallbackFilePath);
        if (normalized) {
            if (!normalized.filePath) {
                normalized.filePath = fallbackFilePath;
            }
            return normalized;
        }
    }

    if (fallbackFilePath) {
        return {
            filePath: fallbackFilePath,
            start: null,
            end: null
        };
    }

    return null;
}

function normalizeSourceCode(sourceCode) {
    if (typeof sourceCode === 'number' && ERROR_SOURCE_CATALOG[sourceCode]) {
        return sourceCode;
    }

    if (typeof sourceCode === 'string') {
        const candidate = sourceCode.trim().toUpperCase();
        if (SOURCE_SLUG_LOOKUP[candidate]) {
            return SOURCE_SLUG_LOOKUP[candidate];
        }
        for (const [codeKey, meta] of Object.entries(ERROR_SOURCE_CATALOG)) {
            const label = meta?.label ? meta.label.toUpperCase() : null;
            if (label === candidate) {
                return Number(codeKey);
            }
        }
    }

    return ERROR_SOURCE_CODES.UNKNOWN;
}

function resolveLanguage(options) {
    if (options && typeof options.language === 'string') {
        return options.language;
    }
    return DEFAULT_LANGUAGE;
}

export function resolveErrorSource(sourceCode) {
    const code = normalizeSourceCode(sourceCode);
    const metadata = resolveErrorSourceMetadata(code);
    return {
        code,
        slug: metadata.slug,
        label: metadata.label,
        description: metadata.description
    };
}

export function resolveErrorMessage(errorCode, options = {}) {
    if (options && typeof options === 'object') {
        return resolveDictionaryMessage(errorCode, {
            language: options.language,
            kind: options.kind || options.type || null
        });
    }
    return resolveDictionaryMessage(errorCode, options);
}

export function normalizeRuleError(ruleId, severityCode, context = {}, options = {}) {
    const language = resolveLanguage(options);
    const resolvedRuleId = coerceRuleId(ruleId);
    const effectiveRuleId = resolvedRuleId ?? FALLBACK_RULE_METADATA.id;
    const dictionaryEntry = resolvedRuleDictionaryEntry(effectiveRuleId) || RULE_FALLBACK_ENTRY;

    const requestedSeverity = severityCode ?? dictionaryEntry.severity ?? RULE_SEVERITY_FLAGS.ERROR;
    const normalizedSeverity = coerceRuleSeverity(requestedSeverity, RULE_SEVERITY_FLAGS.ERROR);
    const ruleDescriptor = describeRuleMetadata(effectiveRuleId, normalizedSeverity);

    const sourceCode = normalizeSourceCode(options.sourceCode ?? ERROR_SOURCE_CODES.VALIDATOR);
    const sourceMetadata = resolveErrorSourceMetadata(sourceCode);
    const categoryMetadata = resolveCategoryMetadata(ERROR_CATEGORY_CODES.RULE);

    const filePath = options.filePath || context.filePath || context.path || null;
    const location = resolveLocation(context, { ...options, filePath });

    const messageBundle = resolveDictionaryMessage(effectiveRuleId, {
        kind: 'rule',
        language
    });

    const entryMetadata = dictionaryEntry.metadata || {};
    const categoryDescriptor = coerceCategoryDescriptor(categoryMetadata, entryMetadata);
    const domainDescriptor = coerceDomainDescriptor(dictionaryEntry, categoryMetadata);
    const severityDescriptor = coerceRuleSeverityDescriptor(normalizedSeverity, entryMetadata);
    const recommendedAction = entryMetadata.recommendedAction ?? null;
    const canRetry = entryMetadata.canRetry ?? false;
    const isFatal = entryMetadata.isFatal ?? (normalizedSeverity === RULE_SEVERITY_FLAGS.CRITICAL);

    return {
        kind: 'rule',
        code: effectiveRuleId,
        ruleId: effectiveRuleId,
        ruleSlug: dictionaryEntry.ruleSlug || ruleDescriptor.slug,
        severityCode: normalizedSeverity,
        severityLabel: severityDescriptor.label,
        message: messageBundle.message,
        explanation: messageBundle.explanation,
        fix: messageBundle.fix,
        categoryCode: categoryDescriptor?.code ?? categoryMetadata.code,
        categorySlug: categoryDescriptor?.slug ?? categoryMetadata.slug,
        domainCode: domainDescriptor.code,
        domainSlug: domainDescriptor.slug,
        domainLabel: domainDescriptor.label,
        sourceCode,
        sourceSlug: sourceMetadata.slug,
        sourceLabel: sourceMetadata.label,
        filePath,
        location,
        context: sanitizeContext(context),
        language,
        timestamp: options.timestamp || new Date().toISOString(),
        dictionaryEntry,
        metadata: {
            rule: {
                id: effectiveRuleId,
                slug: dictionaryEntry.ruleSlug || ruleDescriptor.slug,
                severity: severityDescriptor.code,
                severityLabel: severityDescriptor.label
            },
            domain: domainDescriptor,
            category: categoryDescriptor || categoryMetadata,
            severity: severityDescriptor,
            source: sourceMetadata,
            recommendedAction,
            canRetry,
            isFatal,
            dictionary: dictionaryEntry.metadata || null
        }
    };
}

export function normalizeSystemError(errorCode, severityCode, context = {}, options = {}) {
    const language = resolveLanguage(options);
    const numericCode = typeof errorCode === 'number' && Number.isFinite(errorCode)
        ? errorCode
        : Number(errorCode);
    const effectiveCode = Number.isFinite(numericCode) ? numericCode : FALLBACK_ERROR_ENTRY.code;

    const dictionaryEntry = resolveSystemDictionaryEntry(effectiveCode) || FALLBACK_ERROR_ENTRY;
    const dictionaryRecord = resolveDictionaryEntry(effectiveCode);

    const requestedSeverity = severityCode ?? dictionaryEntry.severity ?? ERROR_SEVERITY_FLAGS.MEDIUM;
    const normalizedSeverity = coerceErrorSeverity(requestedSeverity, dictionaryEntry.severity ?? ERROR_SEVERITY_FLAGS.MEDIUM);
    const entryMetadata = dictionaryEntry.metadata || {};
    const categoryDescriptor = coerceCategoryDescriptor(categoryMetadata, entryMetadata);
    const domainDescriptor = coerceDomainDescriptor(dictionaryEntry, categoryMetadata);
    const severityDescriptor = coerceSystemSeverityDescriptor(normalizedSeverity, entryMetadata);
    const recommendedAction = entryMetadata.recommendedAction ?? null;
    const canRetry = entryMetadata.canRetry ?? false;
    const isFatal = entryMetadata.isFatal ?? (normalizedSeverity >= ERROR_SEVERITY_FLAGS.CRITICAL);

    const sourceCode = normalizeSourceCode(options.sourceCode ?? ERROR_SOURCE_CODES.SYSTEM);
    const sourceMetadata = resolveErrorSourceMetadata(sourceCode);
    const categoryMetadata = dictionaryRecord.category || resolveCategoryMetadata(ERROR_CATEGORY_CODES.UNKNOWN);

    const filePath = options.filePath || context.filePath || context.path || null;
    const location = resolveLocation(context, { ...options, filePath });

    const messageBundle = resolveDictionaryMessage(effectiveCode, {
        kind: 'system',
        language
    });

    return {
        kind: 'system',
        code: effectiveCode,
        errorCode: effectiveCode,
        severityCode: normalizedSeverity,
        severityLabel: severityDescriptor.label,
        message: messageBundle.message,
        explanation: messageBundle.explanation,
        fix: messageBundle.fix,
    categoryCode: categoryDescriptor?.code ?? categoryMetadata.code,
    categorySlug: categoryDescriptor?.slug ?? categoryMetadata.slug,
    domainCode: domainDescriptor.code,
    domainSlug: domainDescriptor.slug,
    domainLabel: domainDescriptor.label,
        sourceCode,
        sourceSlug: sourceMetadata.slug,
        sourceLabel: sourceMetadata.label,
        filePath,
        location,
        context: sanitizeContext(context),
        language,
        timestamp: options.timestamp || new Date().toISOString(),
        dictionaryEntry,
        metadata: {
            domain: domainDescriptor,
            category: categoryDescriptor || categoryMetadata,
            severity: severityDescriptor,
            source: sourceMetadata,
            recommendedAction,
            canRetry,
            isFatal,
            dictionary: dictionaryEntry.metadata || null
        }
    };
}

export function enrichErrorContext(normalizedError, extraContext = {}) {
    if (!normalizedError || typeof normalizedError !== 'object') {
        return normalizedError;
    }
    const combinedContext = {
        ...sanitizeContext(normalizedError.context),
        ...sanitizeContext(extraContext)
    };
    return {
        ...normalizedError,
        context: combinedContext
    };
}

export function createFallbackError(unknownError = {}, options = {}) {
    const language = resolveLanguage(options);
    const categoryCode = typeof options.categoryCode === 'number'
        ? options.categoryCode
        : ERROR_CATEGORY_CODES.UNKNOWN;
    const categoryMetadata = resolveCategoryMetadata(categoryCode);
    const sourceCode = normalizeSourceCode(options.sourceCode ?? unknownError.sourceCode);
    const sourceMetadata = resolveErrorSourceMetadata(sourceCode);

    const severityCode = coerceErrorSeverity(
        options.severityCode,
        FALLBACK_ERROR_ENTRY.severity ?? ERROR_SEVERITY_FLAGS.MEDIUM
    );
    const severityLabel = resolveErrorSeveritySlug(severityCode);
    const domainDescriptor = coerceDomainDescriptor(FALLBACK_ERROR_ENTRY, categoryMetadata);

    const filePath = options.filePath || unknownError.filePath || unknownError.path || null;
    const location = resolveLocation(unknownError.context || {}, { ...options, filePath });

    const messageBundle = resolveDictionaryMessage(FALLBACK_ERROR_ENTRY.code, {
        kind: options.kind || unknownError.kind,
        language
    });

    return {
        kind: options.kind || unknownError.kind || 'unknown',
        code: unknownError.code ?? FALLBACK_ERROR_ENTRY.code,
        severityCode,
        severityLabel,
        message: messageBundle.message,
        explanation: messageBundle.explanation,
        fix: messageBundle.fix,
    categoryCode: categoryMetadata.code,
    categorySlug: categoryMetadata.slug,
    domainCode: domainDescriptor.code,
    domainSlug: domainDescriptor.slug,
    domainLabel: domainDescriptor.label,
        sourceCode,
        sourceSlug: sourceMetadata.slug,
        sourceLabel: sourceMetadata.label,
        filePath,
        location,
        context: sanitizeContext(unknownError.context),
        language,
        timestamp: options.timestamp || new Date().toISOString(),
        dictionaryEntry: FALLBACK_ERROR_ENTRY,
        metadata: {
            domain: domainDescriptor,
            category: coerceCategoryDescriptor(categoryMetadata),
            severity: {
                code: severityCode,
                label: severityLabel
            },
            source: sourceMetadata,
            recommendedAction: null,
            canRetry: false,
            isFatal: severityCode >= ERROR_SEVERITY_FLAGS.CRITICAL,
            dictionary: FALLBACK_ERROR_ENTRY.metadata || null
        }
    };
}

export default {
    normalizeRuleError,
    normalizeSystemError,
    resolveErrorSource,
    resolveErrorMessage,
    enrichErrorContext,
    createFallbackError
};
