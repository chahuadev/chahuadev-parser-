// ═══════════════════════════════════════════════════════════════════════════════
// binary-code-utils.js - Binary Error Code Composer & Utilities
// ═══════════════════════════════════════════════════════════════════════════════
// หน้าที่: ประกอบ Binary Code จาก Domain/Category/Severity/Source/Offset
// ═══════════════════════════════════════════════════════════════════════════════

import { binaryErrorGrammar } from './binary-error.grammar.js';
import { report } from './universal-reporter.js';
import BinaryCodes from './binary-codes.js';

/**
 * ประกอบ 64-bit Binary Error Code จาก Components
 * Structure: Domain(16) | Category(16) | Severity(8) | Source(8) | Offset(16)
 * 
 * @param {number} domainCode - Domain code (16-bit)
 * @param {number} categoryCode - Category code (16-bit)
 * @param {number} severityCode - Severity code (8-bit)
 * @param {number} sourceCode - Source code (8-bit)
 * @param {number} offset - Unique offset ID (16-bit)
 * @returns {string} Binary code as string (for safe 64-bit handling)
 * 
 * @example
 * const code = composeBinaryCode(1, 1, 16, 1, 1001);
 * // Returns: "281479288520681" (0x0001000110000003E9)
 */
export function composeBinaryCode(domainCode, categoryCode, severityCode, sourceCode, offset) {
    // Validate inputs
    if (!Number.isInteger(domainCode) || domainCode < 0 || domainCode > 0xFFFF) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7001));
    }
    if (!Number.isInteger(categoryCode) || categoryCode < 0 || categoryCode > 0xFFFF) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7002));
    }
    if (!Number.isInteger(severityCode) || severityCode < 0 || severityCode > 0xFF) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7003));
    }
    if (!Number.isInteger(sourceCode) || sourceCode < 0 || sourceCode > 0xFF) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7004));
    }
    if (!Number.isInteger(offset) || offset < 0 || offset > 0xFFFF) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7005));
    }

    // Use BigInt for 64-bit composition
    const domain = BigInt(domainCode) << 48n;
    const category = BigInt(categoryCode) << 32n;
    const severity = BigInt(severityCode) << 24n;
    const source = BigInt(sourceCode) << 16n;
    const off = BigInt(offset);

    // Combine all components with bitwise OR
    const binaryCode = domain | category | severity | source | off;

    // Return as string to preserve 64-bit precision
    return binaryCode.toString();
}

/**
 * ประกอบ Binary Code โดยใช้ชื่อจาก Grammar (สะดวกกว่า)
 * 
 * @param {object} binaryErrorGrammar - Grammar object
 * @param {string} domainName - Domain name (e.g., 'TOKENIZER')
 * @param {string} categoryName - Category name (e.g., 'SYNTAX')
 * @param {string} severityName - Severity name (e.g., 'ERROR')
 * @param {string} sourceName - Source name (e.g., 'PARSER')
 * @param {number} offset - Unique offset ID
 * @returns {string} Binary code as string
 * 
 * @example
 * import { binaryErrorGrammar } from './binary-error.grammar.js';
 * const code = composeBinaryCodeByName(
 *   binaryErrorGrammar,
 *   'TOKENIZER', 'SYNTAX', 'ERROR', 'PARSER', 1001
 * );
 */
export function composeBinaryCodeByName(
    binaryErrorGrammar,
    domainName,
    categoryName,
    severityName,
    sourceName,
    offset
) {
    // Lookup codes from grammar
    const domain = binaryErrorGrammar.domains[domainName];
    const category = binaryErrorGrammar.categories[categoryName];
    const severity = binaryErrorGrammar.severities[severityName];
    const source = binaryErrorGrammar.sources[sourceName];

    // Validate lookup results
    if (!domain) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7006));
    }
    if (!category) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7007));
    }
    if (!severity) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7008));
    }
    if (!source) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7009));
    }

    // Compose using codes
    return composeBinaryCode(
        domain.code,
        category.code,
        severity.code,
        source.code,
        offset
    );
}

/**
 * แปลง Binary Code กลับเป็น Hex String สำหรับ Debug
 * 
 * @param {string|number} binaryCode - Binary code
 * @returns {string} Hex string (e.g., "0x0001000110000003E9")
 * 
 * @example
 * const hex = toHexString("281479288520681");
 * // Returns: "0x0001000110000003E9"
 */
export function toHexString(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return '0x' + bigCode.toString(16).toUpperCase().padStart(16, '0');
}

/**
 * แปลง Binary Code เป็น Binary String สำหรับ Debug
 * 
 * @param {string|number} binaryCode - Binary code
 * @returns {string} Binary string (e.g., "0b00000001...")
 * 
 * @example
 * const bin = toBinaryString("281479288520681");
 * // Returns: "0b0000000000000001000000000000000100010000000000000000001111101001"
 */
export function toBinaryString(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return '0b' + bigCode.toString(2).padStart(64, '0');
}

/**
 * สร้าง Error Code Builder สำหรับ Domain/Category เฉพาะ (Factory Pattern)
 * 
 * @param {object} binaryErrorGrammar - Grammar object
 * @param {string} domainName - Fixed domain name
 * @param {string} categoryName - Fixed category name
 * @returns {function} Builder function(offset, severity?, source?)
 * 
 * @example
 * const tokenizerSyntaxError = createErrorCodeBuilder(
 *   binaryErrorGrammar,
 *   'TOKENIZER',
 *   'SYNTAX'
 * );
 * 
 * // Simple: ใช้ default severity และ auto-infer source จาก domain
 * const code1 = tokenizerSyntaxError(1001);
 * 
 * // Override severity
 * const code2 = tokenizerSyntaxError(1002, 'WARNING');
 * 
 * // Override ทั้ง severity และ source
 * const code3 = tokenizerSyntaxError(1003, 'ERROR', 'USER');
 */
export function createErrorCodeBuilder(binaryErrorGrammar, domainName, categoryName) {
    const domain = binaryErrorGrammar.domains[domainName];
    const category = binaryErrorGrammar.categories[categoryName];

    if (!domain) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7010));
    }
    if (!category) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7011));
    }

    // Determine default source from domain name
    // PARSER domain  PARSER source, VALIDATOR domain  VALIDATOR source, etc.
    const defaultSource = binaryErrorGrammar.sources[domainName] 
        ? domainName 
        : 'SYSTEM'; // Fallback to SYSTEM source

    // Get default severity from category
    const defaultSeverity = category.defaultSeverity || 'ERROR';

    return function(offset, severityName = defaultSeverity, sourceName = defaultSource) {
        return composeBinaryCodeByName(
            binaryErrorGrammar,
            domainName,
            categoryName,
            severityName,
            sourceName,
            offset
        );
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BITWISE EXTRACTION UTILITIES - Extract Components from 64-bit Binary Code
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Bitwise Masks for Component Extraction (from Grammar)
 * Structure: Domain(16) | Category(16) | Severity(8) | Source(8) | Offset(16)
 */
export const DOMAIN_MASK = BigInt(binaryErrorGrammar.masks.DOMAIN_MASK);
export const CATEGORY_MASK = BigInt(binaryErrorGrammar.masks.CATEGORY_MASK);
export const SEVERITY_MASK = BigInt(binaryErrorGrammar.masks.SEVERITY_MASK);
export const SOURCE_MASK = BigInt(binaryErrorGrammar.masks.SOURCE_MASK);
export const OFFSET_MASK = BigInt(binaryErrorGrammar.masks.OFFSET_MASK);

/**
 * Extract Domain (16-bit) from Binary Code
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {number} Domain code (0-65535)
 * 
 * @example
 * const domain = extractDomain("281479288520681");
 * // Returns: 1 (SECURITY domain)
 */
export function extractDomain(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return Number((bigCode >> 48n) & 0xFFFFn);
}

/**
 * Extract Category (16-bit) from Binary Code
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {number} Category code (0-65535)
 * 
 * @example
 * const category = extractCategory("281479288520681");
 * // Returns: 4 (PERMISSION category)
 */
export function extractCategory(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return Number((bigCode >> 32n) & 0xFFFFn);
}

/**
 * Extract Severity (8-bit) from Binary Code
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {number} Severity code (0-255)
 * 
 * @example
 * const severity = extractSeverity("281479288520681");
 * // Returns: 16 (ERROR severity)
 */
export function extractSeverity(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return Number((bigCode >> 24n) & 0xFFn);
}

/**
 * Extract Source (8-bit) from Binary Code
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {number} Source code (0-255)
 * 
 * @example
 * const source = extractSource("281479288520681");
 * // Returns: 1 (SYSTEM source)
 */
export function extractSource(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return Number((bigCode >> 16n) & 0xFFn);
}

/**
 * Extract Offset (16-bit) from Binary Code
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {number} Offset code (0-65535)
 * 
 * @example
 * const offset = extractOffset("281479288520681");
 * // Returns: 5001
 */
export function extractOffset(binaryCode) {
    const bigCode = typeof binaryCode === 'string' ? BigInt(binaryCode) : BigInt(binaryCode);
    return Number(bigCode & 0xFFFFn);
}

/**
 * Decompose Binary Code into All Components
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @returns {object} All components { domain, category, severity, source, offset }
 * 
 * @example
 * const parts = decomposeBinaryCode("281479288520681");
 * // Returns: { domain: 1, category: 4, severity: 16, source: 1, offset: 5001 }
 */
export function decomposeBinaryCode(binaryCode) {
    return {
        domain: extractDomain(binaryCode),
        category: extractCategory(binaryCode),
        severity: extractSeverity(binaryCode),
        source: extractSource(binaryCode),
        offset: extractOffset(binaryCode)
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN MATCHING - Instant Error Filtering with Bitwise Operations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Match Binary Code against Domain/Category/Severity Pattern
 * Uses bitwise comparison for instant O(1) filtering
 * 
 * @param {string|bigint} binaryCode - Binary error code to match
 * @param {string} domainName - Domain name to match (e.g., 'SECURITY')
 * @param {string} categoryName - Category name to match (optional)
 * @param {string} severityName - Severity name to match (optional)
 * @returns {boolean} True if matches pattern
 * 
 * @example
 * // Filter by domain only
 * if (matchBinaryCode(errorCode, 'SECURITY')) {
 *     // Handle SECURITY error
 * }
 * 
 * // Filter by domain + category
 * if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION')) {
 *     // Handle SECURITY.PERMISSION error
 * }
 * 
 * // Filter by domain + category + severity
 * if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION', 'ERROR')) {
 *     // Handle SECURITY.PERMISSION.ERROR
 * }
 */
export function matchBinaryCode(binaryCode, domainName, categoryName = null, severityName = null) {
    const actualDomain = extractDomain(binaryCode);
    
    // Match domain
    const expectedDomain = binaryErrorGrammar?.domains?.[domainName];
    if (!expectedDomain || actualDomain !== expectedDomain.code) {
        return false;
    }
    
    // Match category (if specified)
    if (categoryName !== null) {
        const actualCategory = extractCategory(binaryCode);
        const expectedCategory = binaryErrorGrammar?.categories?.[categoryName];
        if (!expectedCategory || actualCategory !== expectedCategory.code) {
            return false;
        }
    }
    
    // Match severity (if specified)
    if (severityName !== null) {
        const actualSeverity = extractSeverity(binaryCode);
        const expectedSeverity = binaryErrorGrammar?.severities?.[severityName];
        if (!expectedSeverity || actualSeverity !== expectedSeverity.code) {
            return false;
        }
    }
    
    return true;
}

/**
 * Filter Multiple Binary Codes by Pattern
 * Batch filtering with bitwise operations - instant for large datasets
 * 
 * @param {Array<string|bigint>} binaryCodes - Array of binary error codes
 * @param {object} pattern - Pattern to match { domain?, category?, severity? }
 * @returns {Array<string|bigint>} Filtered codes matching pattern
 * 
 * @example
 * const allErrors = [code1, code2, code3, code4];
 * 
 * // Get all SECURITY errors
 * const securityErrors = filterByPattern(allErrors, { domain: 'SECURITY' });
 * 
 * // Get all SECURITY.PERMISSION errors
 * const permErrors = filterByPattern(allErrors, {
 *     domain: 'SECURITY',
 *     category: 'PERMISSION'
 * });
 * 
 * // Get all critical SECURITY errors
 * const criticalErrors = filterByPattern(allErrors, {
 *     domain: 'SECURITY',
 *     severity: 'CRITICAL'
 * });
 */
export function filterByPattern(binaryCodes, pattern) {
    return binaryCodes.filter(code => {
        return matchBinaryCode(
            code,
            pattern.domain,
            pattern.category || null,
            pattern.severity || null
        );
    });
}

export default {
    composeBinaryCode,
    composeBinaryCodeByName,
    toHexString,
    toBinaryString,
    createErrorCodeBuilder,
    // Bitwise extraction
    extractDomain,
    extractCategory,
    extractSeverity,
    extractSource,
    extractOffset,
    decomposeBinaryCode,
    // Pattern matching
    matchBinaryCode,
    filterByPattern,
    // Masks
    DOMAIN_MASK,
    CATEGORY_MASK,
    SEVERITY_MASK,
    SOURCE_MASK,
    OFFSET_MASK
};
