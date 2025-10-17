// ! ======================================================================
// ! Centralized severity flags for rule engine and error handler
// ! ======================================================================

export const RULE_SEVERITY_FLAGS = Object.freeze({
    INFO:     0b0001,
    WARNING:  0b0010,
    ERROR:    0b0100,
    CRITICAL: 0b1000
});

export const RULE_SEVERITY_SLUGS = Object.freeze({
    [RULE_SEVERITY_FLAGS.INFO]: 'INFO',
    [RULE_SEVERITY_FLAGS.WARNING]: 'WARNING',
    [RULE_SEVERITY_FLAGS.ERROR]: 'ERROR',
    [RULE_SEVERITY_FLAGS.CRITICAL]: 'CRITICAL'
});

export const RULE_SEVERITY_SLUG_TO_FLAG = Object.freeze({
    INFO: RULE_SEVERITY_FLAGS.INFO,
    WARNING: RULE_SEVERITY_FLAGS.WARNING,
    ERROR: RULE_SEVERITY_FLAGS.ERROR,
    CRITICAL: RULE_SEVERITY_FLAGS.CRITICAL
});

export const ERROR_SEVERITY_FLAGS = Object.freeze({
    LOW:      0b0001,
    MEDIUM:   0b0010,
    HIGH:     0b0100,
    CRITICAL: 0b1000
});

export const ERROR_SEVERITY_SLUGS = Object.freeze({
    [ERROR_SEVERITY_FLAGS.LOW]: 'LOW',
    [ERROR_SEVERITY_FLAGS.MEDIUM]: 'MEDIUM',
    [ERROR_SEVERITY_FLAGS.HIGH]: 'HIGH',
    [ERROR_SEVERITY_FLAGS.CRITICAL]: 'CRITICAL'
});

export const ERROR_SEVERITY_SLUG_TO_FLAG = Object.freeze({
    LOW: ERROR_SEVERITY_FLAGS.LOW,
    MEDIUM: ERROR_SEVERITY_FLAGS.MEDIUM,
    HIGH: ERROR_SEVERITY_FLAGS.HIGH,
    CRITICAL: ERROR_SEVERITY_FLAGS.CRITICAL
});

export function resolveRuleSeveritySlug(code) {
    return RULE_SEVERITY_SLUGS[code] || 'UNKNOWN_SEVERITY';
}

export function resolveErrorSeveritySlug(code) {
    return ERROR_SEVERITY_SLUGS[code] || 'UNKNOWN_SEVERITY';
}

export function coerceRuleSeverity(value, fallback = RULE_SEVERITY_FLAGS.ERROR) {
    if (typeof value === 'number' && RULE_SEVERITY_SLUGS[value]) {
        return value;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toUpperCase();
        if (RULE_SEVERITY_SLUG_TO_FLAG[normalized]) {
            return RULE_SEVERITY_SLUG_TO_FLAG[normalized];
        }
    }
    return fallback;
}

export function coerceErrorSeverity(value, fallback = ERROR_SEVERITY_FLAGS.MEDIUM) {
    if (typeof value === 'number' && ERROR_SEVERITY_SLUGS[value]) {
        return value;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toUpperCase();
        if (ERROR_SEVERITY_SLUG_TO_FLAG[normalized]) {
            return ERROR_SEVERITY_SLUG_TO_FLAG[normalized];
        }
    }
    return fallback;
}
