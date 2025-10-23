// ═══════════════════════════════════════════════════════════════════════════════
// binary-code-utils.js - Binary Error Code Composer & Utilities
// ═══════════════════════════════════════════════════════════════════════════════
// หน้าที่: ประกอบ Binary Code จาก Domain/Category/Severity/Source/Offset
// ═══════════════════════════════════════════════════════════════════════════════

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
        throw new Error(`Invalid domainCode: ${domainCode} (must be 0-65535)`);
    }
    if (!Number.isInteger(categoryCode) || categoryCode < 0 || categoryCode > 0xFFFF) {
        throw new Error(`Invalid categoryCode: ${categoryCode} (must be 0-65535)`);
    }
    if (!Number.isInteger(severityCode) || severityCode < 0 || severityCode > 0xFF) {
        throw new Error(`Invalid severityCode: ${severityCode} (must be 0-255)`);
    }
    if (!Number.isInteger(sourceCode) || sourceCode < 0 || sourceCode > 0xFF) {
        throw new Error(`Invalid sourceCode: ${sourceCode} (must be 0-255)`);
    }
    if (!Number.isInteger(offset) || offset < 0 || offset > 0xFFFF) {
        throw new Error(`Invalid offset: ${offset} (must be 0-65535)`);
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
        throw new Error(`Domain not found in grammar: ${domainName}`);
    }
    if (!category) {
        throw new Error(`Category not found in grammar: ${categoryName}`);
    }
    if (!severity) {
        throw new Error(`Severity not found in grammar: ${severityName}`);
    }
    if (!source) {
        throw new Error(`Source not found in grammar: ${sourceName}`);
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
 * @returns {function} Builder function(severity, source, offset)
 * 
 * @example
 * const tokenizerSyntaxError = createErrorCodeBuilder(
 *   binaryErrorGrammar,
 *   'TOKENIZER',
 *   'SYNTAX'
 * );
 * 
 * const code = tokenizerSyntaxError('ERROR', 'PARSER', 1001);
 */
export function createErrorCodeBuilder(binaryErrorGrammar, domainName, categoryName) {
    const domain = binaryErrorGrammar.domains[domainName];
    const category = binaryErrorGrammar.categories[categoryName];

    if (!domain) {
        throw new Error(`Domain not found: ${domainName}`);
    }
    if (!category) {
        throw new Error(`Category not found: ${categoryName}`);
    }

    return function(severityName, sourceName, offset) {
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

export default {
    composeBinaryCode,
    composeBinaryCodeByName,
    toHexString,
    toBinaryString,
    createErrorCodeBuilder
};
