// ! Central catalogue describing binary error metadata for the redesigned ErrorHandler.
import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import {
    RULE_SEVERITY_FLAGS,
    ERROR_SEVERITY_FLAGS,
    resolveRuleSeveritySlug,
    resolveErrorSeveritySlug,
    coerceErrorSeverity,
    coerceRuleSeverity
} from '../constants/severity-constants.js';

const RULE_ID_LIST = Object.freeze(Object.values(RULE_IDS));

export const ERROR_SOURCE_CODES = Object.freeze({
    UNKNOWN: 0b00000000,
    VALIDATOR: 0b00000001,
    PARSER: 0b00000010,
    CLI: 0b00000100,
    SYSTEM: 0b00001000,
    SECURITY: 0b00010000,
    EXTENSION: 0b00100000
});

export const ERROR_SOURCE_CATALOG = Object.freeze({
    [ERROR_SOURCE_CODES.UNKNOWN]: {
        slug: 'UNKNOWN_SOURCE',
        label: 'Unknown Source',
        description: 'Error source was not provided or could not be inferred.'
    },
    [ERROR_SOURCE_CODES.VALIDATOR]: {
        slug: 'VALIDATOR',
        label: 'Validator Pipeline',
        description: 'Raised while running rule validations against the AST.'
    },
    [ERROR_SOURCE_CODES.PARSER]: {
        slug: 'PARSER',
        label: 'Parser Engine',
        description: 'Raised by tokenizer or parser components during source analysis.'
    },
    [ERROR_SOURCE_CODES.CLI]: {
        slug: 'CLI',
        label: 'Command Line Interface',
        description: 'Raised while executing CLI workflows or report generation.'
    },
    [ERROR_SOURCE_CODES.SYSTEM]: {
        slug: 'SYSTEM',
        label: 'System Runtime',
        description: 'Raised by shared infrastructure layers such as IO and configuration.'
    },
    [ERROR_SOURCE_CODES.SECURITY]: {
        slug: 'SECURITY',
        label: 'Security Layer',
        description: 'Raised by intrusion detection, rate limiting, or policy enforcement modules.'
    },
    [ERROR_SOURCE_CODES.EXTENSION]: {
        slug: 'EXTENSION',
        label: 'VS Code Extension',
        description: 'Raised by the editor integration or its messaging bridge.'
    }
});

const CATEGORY_DESCRIPTIONS = {
    RULE: 'Binary rule violations emitted by validator checks.',
    SYNTAX: 'Syntactic issues detected by the tokenizer or parser.',
    TYPE: 'Type system violations such as invalid operations on values.',
    REFERENCE: 'Errors triggered when identifiers cannot be resolved safely.',
    RUNTIME: 'Runtime failures that interrupt program execution.',
    LOGICAL: 'Logical defects that produce incorrect behaviour without crashing.',
    FILE_SYSTEM: 'File system and IO level failures.',
    SECURITY: 'Security enforcement issues, policy violations, and intrusion alerts.',
    UNKNOWN: 'Errors that do not fit any registered category.'
};

const DOMAIN_DESCRIPTIONS = {
    UNKNOWN: 'Errors without a classified operating domain.',
    VALIDATION: 'Validator and rule intake responsibilities.',
    PARSER: 'Tokenizer and parser domain responsible for syntax analysis.',
    TYPE_SYSTEM: 'Static or runtime type system operations.',
    REFERENCE: 'Identifier binding and scope resolution.',
    RUNTIME: 'Execution failures encountered while running analysed code.',
    LOGIC: 'Behavioural logic issues reported by heuristics.',
    FILE_SYSTEM: 'Filesystem, IO and operating system boundary failures.',
    NETWORK: 'HTTP/HTTPS and general networking failures.',
    SECURITY: 'Security, policy enforcement and intrusion responses.',
    OBSERVABILITY: 'Telemetry, logging and instrumentation notices.'
};

export const ERROR_DOMAIN_CODES = Object.freeze({
    UNKNOWN: -1000,
    VALIDATION: 0,
    PARSER: 1000,
    TYPE_SYSTEM: 2000,
    REFERENCE: 3000,
    RUNTIME: 4000,
    LOGIC: 5000,
    FILE_SYSTEM: 6000,
    NETWORK: 7000,
    SECURITY: 8000,
    OBSERVABILITY: 9000
});

const DOMAIN_FACTORY = (slug, label, code) => ({
    slug,
    label,
    code,
    description: DOMAIN_DESCRIPTIONS[slug] || 'Undocumented error domain.',
    range: {
        start: code === ERROR_DOMAIN_CODES.UNKNOWN ? Number.MIN_SAFE_INTEGER : code + 1,
        end: code === ERROR_DOMAIN_CODES.UNKNOWN ? Number.MAX_SAFE_INTEGER : code + 999
    }
});

export const ERROR_DOMAIN_CATALOG = Object.freeze({
    [ERROR_DOMAIN_CODES.UNKNOWN]: DOMAIN_FACTORY('UNKNOWN', 'Unknown Domain', ERROR_DOMAIN_CODES.UNKNOWN),
    [ERROR_DOMAIN_CODES.VALIDATION]: DOMAIN_FACTORY('VALIDATION', 'Validator Domain', ERROR_DOMAIN_CODES.VALIDATION),
    [ERROR_DOMAIN_CODES.PARSER]: DOMAIN_FACTORY('PARSER', 'Parser & Tokenizer Domain', ERROR_DOMAIN_CODES.PARSER),
    [ERROR_DOMAIN_CODES.TYPE_SYSTEM]: DOMAIN_FACTORY('TYPE_SYSTEM', 'Type System Domain', ERROR_DOMAIN_CODES.TYPE_SYSTEM),
    [ERROR_DOMAIN_CODES.REFERENCE]: DOMAIN_FACTORY('REFERENCE', 'Reference Resolution Domain', ERROR_DOMAIN_CODES.REFERENCE),
    [ERROR_DOMAIN_CODES.RUNTIME]: DOMAIN_FACTORY('RUNTIME', 'Runtime Execution Domain', ERROR_DOMAIN_CODES.RUNTIME),
    [ERROR_DOMAIN_CODES.LOGIC]: DOMAIN_FACTORY('LOGIC', 'Logic & Heuristic Domain', ERROR_DOMAIN_CODES.LOGIC),
    [ERROR_DOMAIN_CODES.FILE_SYSTEM]: DOMAIN_FACTORY('FILE_SYSTEM', 'File System Domain', ERROR_DOMAIN_CODES.FILE_SYSTEM),
    [ERROR_DOMAIN_CODES.NETWORK]: DOMAIN_FACTORY('NETWORK', 'Network Domain', ERROR_DOMAIN_CODES.NETWORK),
    [ERROR_DOMAIN_CODES.SECURITY]: DOMAIN_FACTORY('SECURITY', 'Security Domain', ERROR_DOMAIN_CODES.SECURITY),
    [ERROR_DOMAIN_CODES.OBSERVABILITY]: DOMAIN_FACTORY('OBSERVABILITY', 'Observability Domain', ERROR_DOMAIN_CODES.OBSERVABILITY)
});

export function resolveDomainMetadata(domainCode) {
    if (ERROR_DOMAIN_CATALOG[domainCode]) {
        return ERROR_DOMAIN_CATALOG[domainCode];
    }
    return ERROR_DOMAIN_CATALOG[ERROR_DOMAIN_CODES.UNKNOWN];
}

const composeDomainRange = (domainCode, span = 999) => ({
    start: domainCode === ERROR_DOMAIN_CODES.UNKNOWN ? Number.MIN_SAFE_INTEGER : domainCode + 1,
    end: domainCode === ERROR_DOMAIN_CODES.UNKNOWN ? Number.MAX_SAFE_INTEGER : domainCode + span
});

const composeErrorCode = (domainCode, offset) => domainCode + offset;

const STRING_DOMAIN_HINTS = [
    { pattern: /^E(?:NOENT|EXIST|ISDIR|NOTDIR|ACCES|PERM|BUSY|ROFS|MFILE|LOOP)$/, domain: ERROR_DOMAIN_CODES.FILE_SYSTEM },
    { pattern: /^E(?:PIPE|CONN|ADDR|HOST|NETWORK|NET|PROTO|REMOTE|TIMEDOUT|SHUT|RESET)/, domain: ERROR_DOMAIN_CODES.NETWORK },
    { pattern: /^E(?:AUTH|SEC|ILLEGAL|PROHIBITED)/, domain: ERROR_DOMAIN_CODES.SECURITY }
];

const inferDomainFromExternalCode = (code) => {
    if (typeof code === 'string') {
        const normalized = code.trim().toUpperCase();
        if (/^HTTP_?\d{3}$/.test(normalized) || /^\d{3}$/.test(normalized)) {
            return ERROR_DOMAIN_CODES.NETWORK;
        }
        for (const hint of STRING_DOMAIN_HINTS) {
            if (hint.pattern.test(normalized)) {
                return hint.domain;
            }
        }
        return ERROR_DOMAIN_CODES.UNKNOWN;
    }

    if (Number.isFinite(code)) {
        if (code >= 100 && code <= 599) {
            return ERROR_DOMAIN_CODES.NETWORK;
        }
        return ERROR_DOMAIN_CODES.UNKNOWN;
    }

    return ERROR_DOMAIN_CODES.UNKNOWN;
};

export const ERROR_CATEGORY_CODES = Object.freeze({
    UNKNOWN: -1,
    RULE: 0,
    SYNTAX: 1000,
    TYPE: 2000,
    REFERENCE: 3000,
    RUNTIME: 4000,
    LOGICAL: 5000,
    FILE_SYSTEM: 6000,
    SECURITY: 7000
});

const CATEGORY_FACTORY = (slug, label, code, domainCode, range, defaultSeverity) => {
    const domain = resolveDomainMetadata(domainCode);
    return {
        slug,
        label,
        description: CATEGORY_DESCRIPTIONS[slug] || 'Unspecified error category.',
        code,
        domainCode: domain.code,
        domainSlug: domain.slug,
        domainLabel: domain.label,
        domainDescription: domain.description,
        range: range || composeDomainRange(domain.code),
        defaultSeverity,
        defaultSeverityLabel: resolveErrorSeveritySlug(defaultSeverity)
    };
};

export const ERROR_CATEGORY_CATALOG = Object.freeze({
    [ERROR_CATEGORY_CODES.UNKNOWN]: CATEGORY_FACTORY(
        'UNKNOWN_CATEGORY',
        'Unknown Category',
        ERROR_CATEGORY_CODES.UNKNOWN,
        ERROR_DOMAIN_CODES.UNKNOWN,
        composeDomainRange(ERROR_DOMAIN_CODES.UNKNOWN),
        ERROR_SEVERITY_FLAGS.MEDIUM
    ),
    [ERROR_CATEGORY_CODES.RULE]: CATEGORY_FACTORY(
        'RULE_ERROR',
        'Rule Violation',
        ERROR_CATEGORY_CODES.RULE,
        ERROR_DOMAIN_CODES.VALIDATION,
        { start: 1, end: 999 },
        ERROR_SEVERITY_FLAGS.MEDIUM
    ),
    [ERROR_CATEGORY_CODES.SYNTAX]: CATEGORY_FACTORY(
        'SYNTAX_ERROR',
        'Syntax Error',
        ERROR_CATEGORY_CODES.SYNTAX,
        ERROR_DOMAIN_CODES.PARSER,
        { start: 1001, end: 1099 },
        ERROR_SEVERITY_FLAGS.HIGH
    ),
    [ERROR_CATEGORY_CODES.TYPE]: CATEGORY_FACTORY(
        'TYPE_ERROR',
        'Type Error',
        ERROR_CATEGORY_CODES.TYPE,
        ERROR_DOMAIN_CODES.TYPE_SYSTEM,
        { start: 2001, end: 2099 },
        ERROR_SEVERITY_FLAGS.HIGH
    ),
    [ERROR_CATEGORY_CODES.REFERENCE]: CATEGORY_FACTORY(
        'REFERENCE_ERROR',
        'Reference Error',
        ERROR_CATEGORY_CODES.REFERENCE,
        ERROR_DOMAIN_CODES.REFERENCE,
        { start: 3001, end: 3099 },
        ERROR_SEVERITY_FLAGS.HIGH
    ),
    [ERROR_CATEGORY_CODES.RUNTIME]: CATEGORY_FACTORY(
        'RUNTIME_ERROR',
        'Runtime Error',
        ERROR_CATEGORY_CODES.RUNTIME,
        ERROR_DOMAIN_CODES.RUNTIME,
        { start: 4001, end: 4099 },
        ERROR_SEVERITY_FLAGS.CRITICAL
    ),
    [ERROR_CATEGORY_CODES.LOGICAL]: CATEGORY_FACTORY(
        'LOGICAL_ERROR',
        'Logical Error',
        ERROR_CATEGORY_CODES.LOGICAL,
        ERROR_DOMAIN_CODES.LOGIC,
        { start: 5001, end: 5099 },
        ERROR_SEVERITY_FLAGS.MEDIUM
    ),
    [ERROR_CATEGORY_CODES.FILE_SYSTEM]: CATEGORY_FACTORY(
        'FILE_SYSTEM_ERROR',
        'File System Error',
        ERROR_CATEGORY_CODES.FILE_SYSTEM,
        ERROR_DOMAIN_CODES.FILE_SYSTEM,
        { start: 6001, end: 6099 },
        ERROR_SEVERITY_FLAGS.HIGH
    ),
    [ERROR_CATEGORY_CODES.SECURITY]: CATEGORY_FACTORY(
        'SECURITY_ENFORCEMENT',
        'Security Enforcement',
        ERROR_CATEGORY_CODES.SECURITY,
        ERROR_DOMAIN_CODES.SECURITY,
        composeDomainRange(ERROR_DOMAIN_CODES.SECURITY),
        ERROR_SEVERITY_FLAGS.HIGH
    )
});

export const SYNTAX_ERROR_CODES = Object.freeze({
    UNEXPECTED_TOKEN: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 1),
    MISSING_SEMICOLON: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 2),
    UNMATCHED_BRACKETS: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 3),
    INVALID_ASSIGNMENT: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 4),
    DUPLICATE_PARAMETER: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 5),
    UNEXPECTED_END_OF_INPUT: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 6),
    GRAMMAR_RULE_MISSING: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 7),
    TOKENIZER_BRAIN_INITIALIZED: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 8),
    GRAMMAR_SECTIONS_FLATTENED: composeErrorCode(ERROR_DOMAIN_CODES.PARSER, 9)
});

export const TYPE_ERROR_CODES = Object.freeze({
    IS_NOT_A_FUNCTION: composeErrorCode(ERROR_DOMAIN_CODES.TYPE_SYSTEM, 1),
    CANNOT_READ_PROPERTY_OF_NULL_OR_UNDEFINED: composeErrorCode(ERROR_DOMAIN_CODES.TYPE_SYSTEM, 2),
    INVALID_TYPE_ARGUMENT: composeErrorCode(ERROR_DOMAIN_CODES.TYPE_SYSTEM, 3),
    OPERATOR_CANNOT_BE_APPLIED: composeErrorCode(ERROR_DOMAIN_CODES.TYPE_SYSTEM, 4)
});

export const REFERENCE_ERROR_CODES = Object.freeze({
    IS_NOT_DEFINED: composeErrorCode(ERROR_DOMAIN_CODES.REFERENCE, 1),
    TEMPORAL_DEAD_ZONE_ACCESS: composeErrorCode(ERROR_DOMAIN_CODES.REFERENCE, 2)
});

export const RUNTIME_ERROR_CODES = Object.freeze({
    STACK_OVERFLOW: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 1),
    OUT_OF_MEMORY: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 2),
    NULL_POINTER_EXCEPTION: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 3),
    PARSE_FAILURE: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 4),
    UNCAUGHT_EXCEPTION: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 5),
    UNHANDLED_REJECTION: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 6),
    PROCESS_WARNING: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 7),
    REPORT_GENERATION_FAILURE: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 8),
    UNKNOWN_RUNTIME_FAILURE: composeErrorCode(ERROR_DOMAIN_CODES.RUNTIME, 9)
});

export const LOGICAL_ERROR_CODES = Object.freeze({
    UNHANDLED_PROMISE_REJECTION: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 1),
    INFINITE_LOOP: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 2),
    UNREACHABLE_CODE: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 3),
    VARIABLE_SHADOWING: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 4),
    USE_BEFORE_DEFINE: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 5),
    MAGIC_NUMBER: composeErrorCode(ERROR_DOMAIN_CODES.LOGIC, 6)
});

export const FILE_SYSTEM_ERROR_CODES = Object.freeze({
    FILE_NOT_FOUND: composeErrorCode(ERROR_DOMAIN_CODES.FILE_SYSTEM, 1),
    FILE_READ_ERROR: composeErrorCode(ERROR_DOMAIN_CODES.FILE_SYSTEM, 2),
    FILE_WRITE_ERROR: composeErrorCode(ERROR_DOMAIN_CODES.FILE_SYSTEM, 3),
    PERMISSION_DENIED: composeErrorCode(ERROR_DOMAIN_CODES.FILE_SYSTEM, 4)
});

export const SECURITY_ERROR_CODES = Object.freeze({
    UNKNOWN_VIOLATION: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 1),
    SUSPICIOUS_PATTERN: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 2),
    RATE_LIMIT_TRIGGERED: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 3),
    PATH_TRAVERSAL_BLOCKED: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 4),
    UNAUTHORIZED_MODULE_ACCESS: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 5),
    SECURITY_MODULE_FAILURE: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 6),
    SECURITY_NOTICE: composeErrorCode(ERROR_DOMAIN_CODES.SECURITY, 7)
});

export const ERROR_CODE_FAMILIES = Object.freeze({
    [ERROR_CATEGORY_CODES.SYNTAX]: SYNTAX_ERROR_CODES,
    [ERROR_CATEGORY_CODES.TYPE]: TYPE_ERROR_CODES,
    [ERROR_CATEGORY_CODES.REFERENCE]: REFERENCE_ERROR_CODES,
    [ERROR_CATEGORY_CODES.RUNTIME]: RUNTIME_ERROR_CODES,
    [ERROR_CATEGORY_CODES.LOGICAL]: LOGICAL_ERROR_CODES,
    [ERROR_CATEGORY_CODES.FILE_SYSTEM]: FILE_SYSTEM_ERROR_CODES,
    [ERROR_CATEGORY_CODES.SECURITY]: SECURITY_ERROR_CODES
});

export const SYSTEM_ERROR_CODES = Object.freeze({
    ...SYNTAX_ERROR_CODES,
    ...TYPE_ERROR_CODES,
    ...REFERENCE_ERROR_CODES,
    ...RUNTIME_ERROR_CODES,
    ...LOGICAL_ERROR_CODES,
    ...FILE_SYSTEM_ERROR_CODES,
    ...SECURITY_ERROR_CODES
});

const RULE_ID_LOOKUP = Object.freeze(
    RULE_ID_LIST.reduce((acc, value) => {
        acc[value] = true;
        return acc;
    }, {})
);

export const FALLBACK_RULE_METADATA = Object.freeze({
    id: 0,
    slug: 'UNKNOWN_RULE',
    name: {
        en: 'Unknown Rule',
        th: 'กฎไม่ทราบชื่อ'
    },
    description: {
        en: 'The validator reported a rule that is not registered in rule-constants.js.',
        th: 'ตัวตรวจสอบรายงานรหัสกฎที่ไม่ได้ลงทะเบียนใน rule-constants.js'
    },
    severity: RULE_SEVERITY_FLAGS.WARNING,
    severityLabel: resolveRuleSeveritySlug(RULE_SEVERITY_FLAGS.WARNING)
});

const FALLBACK_DOMAIN_METADATA = resolveDomainMetadata(ERROR_DOMAIN_CODES.UNKNOWN);

export const FALLBACK_ERROR_ENTRY = Object.freeze({
    code: 0,
    slug: 'UNKNOWN_ERROR',
    categoryCode: ERROR_CATEGORY_CODES.UNKNOWN,
    domainCode: FALLBACK_DOMAIN_METADATA.code,
    domainSlug: FALLBACK_DOMAIN_METADATA.slug,
    domainLabel: FALLBACK_DOMAIN_METADATA.label,
    message: {
        en: 'Unknown error code',
        th: 'รหัสข้อผิดพลาดไม่ทราบที่มา'
    },
    explanation: {
        en: 'The error handler did not recognise this error code. Add it to the catalogue.',
        th: 'ตัวจัดการข้อผิดพลาดไม่รู้จักรหัสนี้ โปรดเพิ่มในแคตตาล็อก'
    },
    fix: {
        en: 'Review the call site and register the code inside error-catalog.js and error-dictionary.js.',
        th: 'ตรวจสอบตำแหน่งที่เรียกใช้และลงทะเบียนรหัสใน error-catalog.js และ error-dictionary.js'
    },
    severity: ERROR_SEVERITY_FLAGS.MEDIUM,
    severityLabel: resolveErrorSeveritySlug(ERROR_SEVERITY_FLAGS.MEDIUM)
});

export function resolveErrorSourceMetadata(sourceCode) {
    if (ERROR_SOURCE_CATALOG[sourceCode]) {
        return ERROR_SOURCE_CATALOG[sourceCode];
    }
    return ERROR_SOURCE_CATALOG[ERROR_SOURCE_CODES.UNKNOWN];
}

export function resolveCategoryMetadata(categoryCode) {
    if (ERROR_CATEGORY_CATALOG[categoryCode]) {
        return ERROR_CATEGORY_CATALOG[categoryCode];
    }
    return ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.UNKNOWN];
}

export function classifyErrorCode(errorCode) {
    if (RULE_ID_LOOKUP[errorCode]) {
        return {
            ...ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.RULE],
            code: ERROR_CATEGORY_CODES.RULE
        };
    }

    if (typeof errorCode === 'string' && errorCode.trim().length > 0) {
        const inferredDomain = inferDomainFromExternalCode(errorCode);
        const domain = resolveDomainMetadata(inferredDomain);
        const base = ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.UNKNOWN];
        if (base.domainCode === domain.code) {
            return base;
        }
        return {
            ...base,
            domainCode: domain.code,
            domainSlug: domain.slug,
            domainLabel: domain.label,
            domainDescription: domain.description,
            inferred: true,
            inferredFrom: 'string_code',
            originalCode: errorCode
        };
    }

    const numericCode = typeof errorCode === 'number' ? errorCode : Number(errorCode);
    if (!Number.isFinite(numericCode)) {
        return ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.UNKNOWN];
    }

    for (const category of Object.values(ERROR_CATEGORY_CATALOG)) {
        if (!category.range || category.code === ERROR_CATEGORY_CODES.UNKNOWN) {
            continue;
        }
        if (numericCode >= category.range.start && numericCode <= category.range.end) {
            return category;
        }
    }

    const inferredDomain = inferDomainFromExternalCode(numericCode);
    if (inferredDomain !== ERROR_DOMAIN_CODES.UNKNOWN) {
        const domain = resolveDomainMetadata(inferredDomain);
        const base = ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.UNKNOWN];
        if (base.domainCode === domain.code) {
            return base;
        }
        return {
            ...base,
            domainCode: domain.code,
            domainSlug: domain.slug,
            domainLabel: domain.label,
            domainDescription: domain.description,
            inferred: true,
            inferredFrom: 'numeric_external_code',
            originalCode: numericCode
        };
    }

    return ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.UNKNOWN];
}

export function describeRuleMetadata(ruleId, requestedSeverity) {
    const normalizedId = RULE_ID_LOOKUP[ruleId] ? ruleId : FALLBACK_RULE_METADATA.id;
    const slug = normalizedId ? resolveRuleSlug(normalizedId) : FALLBACK_RULE_METADATA.slug;
    const severity = coerceRuleSeverity(requestedSeverity, FALLBACK_RULE_METADATA.severity);
    return {
        id: normalizedId,
        slug,
        severity,
        severityLabel: resolveRuleSeveritySlug(severity)
    };
}

export function describeErrorSeverity(code) {
    const severity = coerceErrorSeverity(code, ERROR_SEVERITY_FLAGS.MEDIUM);
    return {
        code: severity,
        label: resolveErrorSeveritySlug(severity)
    };
}

export default {
    ERROR_SOURCE_CODES,
    ERROR_SOURCE_CATALOG,
    ERROR_CATEGORY_CODES,
    ERROR_CATEGORY_CATALOG,
    ERROR_CODE_FAMILIES,
    SYSTEM_ERROR_CODES,
    SYNTAX_ERROR_CODES,
    TYPE_ERROR_CODES,
    REFERENCE_ERROR_CODES,
    RUNTIME_ERROR_CODES,
    LOGICAL_ERROR_CODES,
    FILE_SYSTEM_ERROR_CODES,
    SECURITY_ERROR_CODES,
    FALLBACK_RULE_METADATA,
    FALLBACK_ERROR_ENTRY,
    resolveErrorSourceMetadata,
    resolveCategoryMetadata,
    classifyErrorCode,
    describeRuleMetadata,
    describeErrorSeverity
};
