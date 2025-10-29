// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════

// FIX: Updated import - ErrorHandler.js ไม่มีแล้ว ใช้ binary-reporter แทน
import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// !  BINARY-FIRST CONSTANTS - Central Repository (NO_HARDCODE Enforcement)
// ! ══════════════════════════════════════════════════════════════════════════════
// !  PURPOSE: Single source of truth for all numeric rule metadata
// !  GOAL: Provide bitmasks for enforcement and logging without hardcoding
// ! ══════════════════════════════════════════════════════════════════════════════


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 01】RULE IDS - Binary Encoded (8-bit system)
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Absolute Rule IDs - 8 กฎเหล็กของ Chahuadev (Binary Encoded)
 * 
 * Binary Encoding Strategy:
 * - Each rule has unique bit position (0-4)
 * - Allows bitwise operations for rule combination checks
 * - Binary value = (1 << bit position)
 */
export const RULE_IDS = {
    // Binary: 0b00000001 = 1
    NO_MOCKING: {
        id: 'NO_MOCKING',
        binary: 0b00000001,      // Bit 0
        bit: 0,
        hex: 0x01,
        code: 1,
        name: 'NO_MOCKING',
        description: 'No mock data allowed in production code'
    },
    
    // Binary: 0b00000010 = 2
    NO_HARDCODE: {
        id: 'NO_HARDCODE',
        binary: 0b00000010,      // Bit 1
        bit: 1,
        hex: 0x02,
        code: 2,
        name: 'NO_HARDCODE',
        description: 'No hardcoded values - use constants/config'
    },
    
    // Binary: 0b00000100 = 4
    NO_SILENT_FALLBACKS: {
        id: 'NO_SILENT_FALLBACKS',
        binary: 0b00000100,      // Bit 2
        bit: 2,
        hex: 0x04,
        code: 4,
        name: 'NO_SILENT_FALLBACKS',
        description: 'No silent fallbacks - always report errors'
    },
    
    // Binary: 0b00001000 = 8
    NO_INTERNAL_CACHING: {
        id: 'NO_INTERNAL_CACHING',
        binary: 0b00001000,      // Bit 3
        bit: 3,
        hex: 0x08,
        code: 8,
        name: 'NO_INTERNAL_CACHING',
        description: 'No internal caching - use external cache systems'
    },
    
    // Binary: 0b00010000 = 16
    NO_EMOJI: {
        id: 'NO_EMOJI',
        binary: 0b00010000,      // Bit 4
        bit: 4,
        hex: 0x10,
        code: 16,
        name: 'NO_EMOJI',
        description: 'No emoji in production code - use unicode codes'
    },

    // ! Binary: 0b00100000 = 32
    NO_STRING: {
        id: 'NO_STRING',
        binary: 0b00100000,      // Bit 5
        bit: 5,
        hex: 0x20,
        code: 32,
        name: 'NO_STRING',
        description: 'No string comparisons in core logic'
    },

    // ! Binary: 0b01000000 = 64
    NO_CONSOLE: {
        id: 'NO_CONSOLE',
        binary: 0b01000000,      // Bit 6
        bit: 6,
        hex: 0x40,
        code: 64,
        name: 'NO_CONSOLE',
        description: 'No console.* usage in production logic'
    },

    // ! RULE:BINARY_AST_ONLY - Track binary pipeline enforcement bit (bit 7)
    // ! Binary: 0b10000000 = 128
    BINARY_AST_ONLY: {
        id: 'BINARY_AST_ONLY',
        binary: 0b10000000,      // Bit 7
        bit: 7,
        hex: 0x80,
        code: 128,
        name: 'BINARY_AST_ONLY',
        description: 'Binary AST pipeline must be used in production analyzers'
    },

    // ! RULE:STRICT_COMMENT_STYLE - Enforce comment signature rule (bit 8)
    // ! Binary: 0b100000000 = 256
    STRICT_COMMENT_STYLE: {
        id: 'STRICT_COMMENT_STYLE',
        binary: 0b100000000,      // Bit 8
        bit: 8,
        hex: 0x100,
        code: 256,
        name: 'STRICT_COMMENT_STYLE',
        description: 'All source comments must follow the // ! signature and approved block format'
    }
};

/**
 * Rule Combinations (Bitwise OR operations)
 */
const RULE_MASK_FROM_IDS = Object.values(RULE_IDS).reduce((mask, rule) => mask | rule.binary, 0);

export const RULE_COMBINATIONS = {
    ALL_RULES: RULE_MASK_FROM_IDS,
    // ! RULE:BINARY_AST_ONLY & RULE:STRICT_COMMENT_STYLE - Critical mask includes binary enforcement and comment discipline
    CRITICAL_RULES: RULE_IDS.NO_HARDCODE.binary |
        RULE_IDS.NO_SILENT_FALLBACKS.binary |
        RULE_IDS.NO_INTERNAL_CACHING.binary |
        RULE_IDS.NO_CONSOLE.binary |
        RULE_IDS.BINARY_AST_ONLY.binary |
        RULE_IDS.STRICT_COMMENT_STYLE.binary,
    DATA_RULES: RULE_IDS.NO_MOCKING.binary |
        RULE_IDS.NO_HARDCODE.binary |
        RULE_IDS.NO_STRING.binary,
    SAFETY_RULES: RULE_IDS.NO_SILENT_FALLBACKS.binary |
        RULE_IDS.NO_INTERNAL_CACHING.binary |
        RULE_IDS.NO_CONSOLE.binary |
        RULE_IDS.BINARY_AST_ONLY.binary |
        RULE_IDS.STRICT_COMMENT_STYLE.binary,
    DOCUMENTATION_RULES: RULE_IDS.STRICT_COMMENT_STYLE.binary
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 02】ERROR TYPES - Binary Encoded (6-bit system)
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * System Error Types (Binary Encoded)
 * 
 * Binary Encoding Strategy:
 * - 6-bit system supports up to 64 error types
 * - Grouped by category for bitwise filtering
 */
export const ERROR_TYPES = {
    // Syntax Errors (0-7)
    SYNTAX_ERROR: {
        id: 'SYNTAX_ERROR',
        binary: 0b000001,  // 1
        code: 1,
        hex: 0x01,
        category: 'syntax',
        severity: 0b11,  // CRITICAL
        name: 'SYNTAX_ERROR',
        description: 'Invalid syntax detected'
    },
    
    // Parser Errors (8-15)
    PARSER_ERROR: {
        id: 'PARSER_ERROR',
        binary: 0b001000,  // 8
        code: 8,
        hex: 0x08,
        category: 'parser',
        severity: 0b11,  // CRITICAL
        name: 'PARSER_ERROR',
        description: 'Parser failed to process code'
    },
    
    PARSER_LEARNING_NEEDED: {
        id: 'PARSER_LEARNING_NEEDED',
        binary: 0b001001,  // 9
        code: 9,
        hex: 0x09,
        category: 'parser',
        severity: 0b01,  // INFO
        name: 'PARSER_LEARNING_NEEDED',
        description: 'Parser encountered unknown syntax'
    },
    
    // Tokenizer Errors (16-23)
    TOKENIZER_ERROR: {
        id: 'TOKENIZER_ERROR',
        binary: 0b010000,  // 16
        code: 16,
        hex: 0x10,
        category: 'tokenizer',
        severity: 0b11,  // CRITICAL
        name: 'TOKENIZER_ERROR',
        description: 'Tokenizer failed to process input'
    },
    
    // AST Errors (24-31)
    AST_ERROR: {
        id: 'AST_ERROR',
        binary: 0b011000,  // 24
        code: 24,
        hex: 0x18,
        category: 'ast',
        severity: 0b10,  // ERROR
        name: 'AST_ERROR',
        description: 'AST generation or validation failed'
    },
    
    // Memory Errors (32-39)
    MEMORY_ERROR: {
        id: 'MEMORY_ERROR',
        binary: 0b100000,  // 32
        code: 32,
        hex: 0x20,
        category: 'memory',
        severity: 0b11,  // CRITICAL
        name: 'MEMORY_ERROR',
        description: 'Memory limit exceeded or allocation failed'
    }
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 03】SEVERITY LEVELS - Binary Encoded (2-bit system)
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Violation Severity Levels (Binary Encoded)
 * 
 * Binary Encoding Strategy:
 * - 2-bit system (0-3) for 4 severity levels
 * - Higher value = more severe
 * - Enables numeric comparison: if (severity >= SEVERITY_LEVELS.ERROR.code)
 */
export const SEVERITY_LEVELS = {
    // Binary: 0b00 = 0
    DEBUG: {
        id: 'DEBUG',
        binary: 0b00,
        code: 0,
        hex: 0x00,
        name: 'DEBUG',
        description: 'Debug information only',
        priority: 0
    },
    
    // Binary: 0b01 = 1
    INFO: {
        id: 'INFO',
        binary: 0b01,
        code: 1,
        hex: 0x01,
        name: 'INFO',
        description: 'Informational message',
        priority: 1
    },
    
    // Binary: 0b10 = 2
    WARNING: {
        id: 'WARNING',
        binary: 0b10,
        code: 2,
        hex: 0x02,
        name: 'WARNING',
        description: 'Warning - should be addressed',
        priority: 2
    },
    
    // Binary: 0b11 = 3
    ERROR: {
        id: 'ERROR',
        binary: 0b11,
        code: 3,
        hex: 0x03,
        name: 'ERROR',
        description: 'Error - must be fixed',
        priority: 3
    },
    
    // Binary: 0b11 (same as ERROR but different context)
    CRITICAL: {
        id: 'CRITICAL',
        binary: 0b11,
        code: 3,
        hex: 0x03,
        name: 'CRITICAL',
        description: 'Critical error - system failure',
        priority: 3
    }
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 04】TOKEN TYPES - Binary Encoded (6-bit system)
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Token Types for Tokenizer (Binary Encoded)
 * 
 * Binary Encoding Strategy:
 * - Matches tokenizer-binary-config.json bit positions
 * - Allows bitwise operations for token classification
 * - 6-bit system supports up to 64 token types
 */
export const TOKEN_TYPES = {
    COMMENT: {
        id: 'COMMENT',
        binary: 0b000001,  // Bit 0
        bit: 0,
        code: 1,
        hex: 0x01,
        name: 'COMMENT',
        description: 'Comment token'
    },
    
    STRING: {
        id: 'STRING',
        binary: 0b000010,  // Bit 1
        bit: 1,
        code: 2,
        hex: 0x02,
        name: 'STRING',
        description: 'String literal'
    },
    
    NUMBER: {
        id: 'NUMBER',
        binary: 0b000100,  // Bit 2
        bit: 2,
        code: 4,
        hex: 0x04,
        name: 'NUMBER',
        description: 'Numeric literal'
    },
    
    IDENTIFIER: {
        id: 'IDENTIFIER',
        binary: 0b001000,  // Bit 3
        bit: 3,
        code: 8,
        hex: 0x08,
        name: 'IDENTIFIER',
        description: 'Variable/function identifier'
    },
    
    KEYWORD: {
        id: 'KEYWORD',
        binary: 0b010000,  // Bit 4
        bit: 4,
        code: 16,
        hex: 0x10,
        name: 'KEYWORD',
        description: 'Language keyword'
    },
    
    OPERATOR: {
        id: 'OPERATOR',
        binary: 0b100000,  // Bit 5
        bit: 5,
        code: 32,
        hex: 0x20,
        name: 'OPERATOR',
        description: 'Operator symbol'
    },
    
    PUNCTUATION: {
        id: 'PUNCTUATION',
        binary: 0b1000000,  // Bit 6
        bit: 6,
        code: 64,
        hex: 0x40,
        name: 'PUNCTUATION',
        description: 'Punctuation character'
    },
    
    WHITESPACE: {
        id: 'WHITESPACE',
        binary: 0b10000000,  // Bit 7
        bit: 7,
        code: 128,
        hex: 0x80,
        name: 'WHITESPACE',
        description: 'Whitespace character'
    }
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 05】ENGINE MODES - Binary Encoded (2-bit system)
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Engine Operation Modes (Binary Encoded)
 */
export const ENGINE_MODES = {
    FULL_PERFORMANCE: {
        id: 'FULL_PERFORMANCE',
        binary: 0b00,
        code: 0,
        hex: 0x00,
        name: 'FULL_PERFORMANCE',
        description: 'Maximum performance mode'
    },
    
    NO_FALLBACK_MODE: {
        id: 'NO_FALLBACK_MODE',
        binary: 0b01,
        code: 1,
        hex: 0x01,
        name: 'NO_FALLBACK_MODE',
        description: 'Strict mode - no fallbacks'
    },
    
    LEGACY_MODE: {
        id: 'LEGACY_MODE',
        binary: 0b10,
        code: 2,
        hex: 0x02,
        name: 'LEGACY_MODE',
        description: 'Legacy compatibility mode'
    }
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 06】NUMERIC CONSTANTS - Pure Binary Values
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Default Locations for Error Reporting (Binary Values)
 */
export const DEFAULT_LOCATION = { 
    line: 0, 
    column: 0,
    binary: 0b00  // 0,0 position encoded as binary
};

/**
 * Memory Protection Limits (Pure Numeric)
 */
export const MEMORY_LIMITS = {
    MAX_TOKENS: 50000,      // 0xC350
    MAX_AST_NODES: 10000,   // 0x2710
    MAX_FILE_SIZE: 500000,  // 0x7A120
    CHUNK_SIZE: 10000       // 0x2710
};

/**
 * Validation Thresholds (Pure Numeric)
 */
export const VALIDATION_THRESHOLDS = {
    MIN_HARDCODE_LENGTH: 10,    // Minimum string length to consider as hardcoded
    MIN_CREDENTIAL_LENGTH: 20,  // Minimum length for credential detection
    MAX_NESTING_DEPTH: 20,      // Maximum allowed nesting depth
    MAX_LINE_LENGTH: 1000       // Maximum line length
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 07】HELPER FUNCTIONS - Binary Operations
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Check if rule is enabled in a binary rule mask
 * @param {number} mask - Binary mask of enabled rules
 * @param {Object} rule - Rule object from RULE_IDS
 * @returns {boolean} True if rule is enabled
 * 
 * Example:
 *   const mask = 0b00110; // NO_HARDCODE | NO_SILENT_FALLBACKS
 *   isRuleEnabled(mask, RULE_IDS.NO_HARDCODE); // true
 *   isRuleEnabled(mask, RULE_IDS.NO_MOCKING);  // false
 */
export function isRuleEnabled(mask, rule) {
    return (mask & rule.binary) !== 0;
}

/**
 * Get severity code by name (for backward compatibility)
 * @param {string} severityName - 'CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'
 * @returns {number} Binary severity code
 */
export function getSeverityCode(severityName) {
    const severity = SEVERITY_LEVELS[severityName];
    if (!severity) {
        // FIX: Use Binary Reporter instead of errorHandler
        report(BinaryCodes.PARSER.VALIDATION(20001), {
            error: new Error(`Unknown severity: ${severityName}`),
            source: 'constants.js',
            method: 'getSeverityCode',
            severityName
        });
        return SEVERITY_LEVELS.INFO.code;
    }
    return severity.code;
}

/**
 * Get rule ID string by binary code (for backward compatibility)
 * @param {number} code - Binary rule code
 * @returns {string} Rule ID string
 */
export function getRuleIdByCode(code) {
    for (const [key, rule] of Object.entries(RULE_IDS)) {
        if (rule.binary === code) {
            return rule.id;
        }
    }
    // FIX: Use Binary Reporter instead of errorHandler
    report(BinaryCodes.PARSER.VALIDATION(20002), {
        error: new Error(`Unknown rule code: ${code}`),
        source: 'constants.js',
        method: 'getRuleIdByCode',
        code
    });
    return 'UNKNOWN_RULE';
}

/**
 * Get token type by binary code (for backward compatibility)
 * @param {number} code - Binary token code
 * @returns {string} Token type name
 */
export function getTokenTypeByCode(code) {
    for (const [key, token] of Object.entries(TOKEN_TYPES)) {
        if (token.binary === code) {
            return token.id;
        }
    }
    return 'UNKNOWN_TOKEN';
}


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 08】BACKWARD COMPATIBILITY LAYER
// ! ══════════════════════════════════════════════════════════════════════════════

/**
 * Legacy string-based constants for backward compatibility
 *  DEPRECATED: Use binary constants instead
 *  These will be removed after full refactor
 */
export const RULE_IDS_LEGACY = {
    NO_MOCKING: 'NO_MOCKING',
    NO_HARDCODE: 'NO_HARDCODE',
    NO_SILENT_FALLBACKS: 'NO_SILENT_FALLBACKS',
    NO_INTERNAL_CACHING: 'NO_INTERNAL_CACHING',
    NO_EMOJI: 'NO_EMOJI'
};

export const SEVERITY_LEVELS_LEGACY = {
    CRITICAL: 'CRITICAL',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

export const ERROR_TYPES_LEGACY = {
    SYNTAX_ERROR: 'SYNTAX_ERROR',
    PARSER_ERROR: 'PARSER_ERROR',
    TOKENIZER_ERROR: 'TOKENIZER_ERROR',
    AST_ERROR: 'AST_ERROR',
    MEMORY_ERROR: 'MEMORY_ERROR',
    PARSER_LEARNING_NEEDED: 'PARSER_LEARNING_NEEDED'
};


// ! ══════════════════════════════════════════════════════════════════════════════
// ! 【SECTION 09】FREEZE PROTECTION
// ! ══════════════════════════════════════════════════════════════════════════════

// Freeze all objects to prevent modification
Object.freeze(RULE_IDS);
Object.freeze(RULE_COMBINATIONS);
Object.freeze(ERROR_TYPES);
Object.freeze(SEVERITY_LEVELS);
Object.freeze(TOKEN_TYPES);
Object.freeze(ENGINE_MODES);
Object.freeze(DEFAULT_LOCATION);
Object.freeze(MEMORY_LIMITS);
Object.freeze(VALIDATION_THRESHOLDS);

// Freeze legacy objects
Object.freeze(RULE_IDS_LEGACY);
Object.freeze(SEVERITY_LEVELS_LEGACY);
Object.freeze(ERROR_TYPES_LEGACY);