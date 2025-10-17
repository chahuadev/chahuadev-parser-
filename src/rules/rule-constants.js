// ! ======================================================================
// ! Binary Rule Identifiers centralized for Chahuadev Sentinel
// ! ======================================================================

/**
 * RULE_BITMASKS exposes the raw bit representation for each rule. Use these
 * values when you need to compose bitwise rule sets or perform low-level
 * comparisons. All values are expressed using binary literals to make the
 * underlying bit positions explicit.
 */
export const RULE_BITMASKS = Object.freeze({
    NO_MOCKING:        0b0000000000000001,
    NO_HARDCODE:       0b0000000000000010,
    NO_SILENT_FALLBACKS: 0b0000000000000100,
    NO_INTERNAL_CACHING: 0b0000000000001000,
    NO_EMOJI:          0b0000000000010000,
    NO_STRING:         0b0000000000100000,
    NO_CONSOLE:        0b0000000001000000,
    BINARY_AST_ONLY:   0b0000000010000000,
    STRICT_COMMENT_STYLE: 0b0000000100000000,
    MUST_HANDLE_ERRORS:   0b0000001000000000
});

/**
 * RULE_IDS wraps the bitmasks in a friendlier abstraction so other modules can
 * reference rules via semantic property names instead of repeating the binary
 * literal. These numbers remain powers of two, therefore callers can use them
 * both as identifiers and as bit flags.
 */
export const RULE_IDS = Object.freeze({
    NO_MOCKING: RULE_BITMASKS.NO_MOCKING,
    NO_HARDCODE: RULE_BITMASKS.NO_HARDCODE,
    NO_SILENT_FALLBACKS: RULE_BITMASKS.NO_SILENT_FALLBACKS,
    NO_INTERNAL_CACHING: RULE_BITMASKS.NO_INTERNAL_CACHING,
    NO_EMOJI: RULE_BITMASKS.NO_EMOJI,
    NO_STRING: RULE_BITMASKS.NO_STRING,
    NO_CONSOLE: RULE_BITMASKS.NO_CONSOLE,
    BINARY_AST_ONLY: RULE_BITMASKS.BINARY_AST_ONLY,
    STRICT_COMMENT_STYLE: RULE_BITMASKS.STRICT_COMMENT_STYLE,
    MUST_HANDLE_ERRORS: RULE_BITMASKS.MUST_HANDLE_ERRORS
});

/**
 * RULE_SLUGS maps numeric identifiers back to the canonical slug string.
 * ErrorHandler remains responsible for turning these into verbose
 * descriptions, but having a reversible mapping lets clients attach the slug
 * only when they truly need it (for example: generating human-readable
 * summaries).
 */
export const RULE_SLUGS = Object.freeze({
    [RULE_IDS.NO_MOCKING]: 'NO_MOCKING',
    [RULE_IDS.NO_HARDCODE]: 'NO_HARDCODE',
    [RULE_IDS.NO_SILENT_FALLBACKS]: 'NO_SILENT_FALLBACKS',
    [RULE_IDS.NO_INTERNAL_CACHING]: 'NO_INTERNAL_CACHING',
    [RULE_IDS.NO_EMOJI]: 'NO_EMOJI',
    [RULE_IDS.NO_STRING]: 'NO_STRING',
    [RULE_IDS.NO_CONSOLE]: 'NO_CONSOLE',
    [RULE_IDS.BINARY_AST_ONLY]: 'BINARY_AST_ONLY',
    [RULE_IDS.STRICT_COMMENT_STYLE]: 'STRICT_COMMENT_STYLE',
    [RULE_IDS.MUST_HANDLE_ERRORS]: 'MUST_HANDLE_ERRORS'
});

/**
 * Utility helper that ensures callers always receive a string slug back even
 * if the identifier is unknown. Keeping the fallback handled here prevents
 * downstream modules from accidentally reintroducing hard-coded strings.
 */
export function resolveRuleSlug(ruleId) {
    if (RULE_SLUGS[ruleId]) {
        return RULE_SLUGS[ruleId];
    }
    return 'UNKNOWN_RULE';
}
