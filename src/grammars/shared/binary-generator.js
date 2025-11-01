/**
 * Binary Generator - Runtime Binary Map Generation from Grammar
 * 
 * ZERO-MAINTENANCE SYSTEM:
 * - แก้แค่ grammar files
 * - Binary auto-generate ทันที
 * - ไม่ต้อง maintain tokenizer-binary-config.js อีกเลย
 * 
 * ARCHITECTURE:
 * Grammar File  Binary Generator  Runtime Binary Map
 * 
 * DETERMINISTIC ALGORITHM:
 * - Same grammar = Same binary (always)
 * - Collision-free (different items = different binary)
 * - Predictable range per category
 */

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

/**
 * Binary Range Allocation (16-bit space)
 * ================================
 * Keywords:     0x0001 - 0x0FFF (4095 slots)
 * Operators:    0x1000 - 0x1FFF (4095 slots)
 * Punctuation:  0x2000 - 0x2FFF (4095 slots)
 * Literals:     0x3000 - 0x3FFF (4095 slots)
 * Reserved:     0x4000 - 0xFFFF (reserved for future)
 */
const BINARY_RANGES = {
    keywords: { start: 0x0001, end: 0x0FFF },
    operators: { start: 0x1000, end: 0x1FFF },
    punctuation: { start: 0x2000, end: 0x2FFF },
    literals: { start: 0x3000, end: 0x3FFF }
};

/**
 * Generate deterministic hash from string
 * FNV-1a algorithm (Fast, collision-resistant)
 */
function hashString(str) {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619; // FNV prime
    }
    return hash >>> 0; // Convert to unsigned 32-bit
}

/**
 * Generate binary value for a token
 * @param {string} token - The token string (e.g., 'if', '+', '(')
 * @param {string} category - Category: 'keywords', 'operators', 'punctuation', 'literals'
 * @returns {number} - 16-bit binary value
 */
export function generateBinary(token, category) {
    const range = BINARY_RANGES[category];
    if (!range) {
        report(BinaryCodes.SYSTEM.CONFIGURATION(5100));

    }
    
    // Generate hash and map to range
    const hash = hashString(token);
    const rangeSize = range.end - range.start + 1;
    const offset = hash % rangeSize;
    const binary = range.start + offset;
    
    return binary;
}

/**
 * Generate complete binary map from grammar object
 * @param {Object} grammar - Grammar object (e.g., javascriptGrammar)
 * @returns {Object} - Binary map with all metadata + binary values
 */
export function generateBinaryMapFromGrammar(grammar) {
    // Clone grammar to preserve all metadata (__grammar_*, __section_*)
    const binaryMap = { ...grammar };
    
    // Generate binary for keywords (PRESERVE METADATA)
    if (binaryMap.keywords) {
        const keywordsWithBinary = {};
        for (const [keyword, metadata] of Object.entries(binaryMap.keywords)) {
            keywordsWithBinary[keyword] = {
                ...metadata, // Keep all metadata (category, type, description, etc.)
                binary: generateBinary(keyword, 'keywords') // Add binary value
            };
        }
        binaryMap.keywords = keywordsWithBinary;
    }
    
    // Generate binary for operators (PRESERVE METADATA)
    if (binaryMap.operators) {
        const operatorsWithBinary = {};
        for (const [operator, metadata] of Object.entries(binaryMap.operators)) {
            operatorsWithBinary[operator] = {
                ...metadata, // Keep all metadata
                binary: generateBinary(operator, 'operators') // Add binary value
            };
        }
        binaryMap.operators = operatorsWithBinary;
    }
    
    // Generate binary for punctuation (PRESERVE METADATA)
    if (binaryMap.punctuation) {
        const punctuationWithBinary = {};
        for (const [punct, metadata] of Object.entries(binaryMap.punctuation)) {
            punctuationWithBinary[punct] = {
                ...metadata, // Keep all metadata
                binary: generateBinary(punct, 'punctuation') // Add binary value
            };
        }
        binaryMap.punctuation = punctuationWithBinary;
    }
    
    // Generate binary for literals (PRESERVE METADATA)
    if (binaryMap.literals) {
        const literalsWithBinary = {};
        for (const [literal, metadata] of Object.entries(binaryMap.literals)) {
            literalsWithBinary[literal] = {
                ...metadata, // Keep all metadata
                binary: generateBinary(literal, 'literals') // Add binary value
            };
        }
        binaryMap.literals = literalsWithBinary;
    }
    
    return binaryMap;
}

/**
 * Get binary value for a specific token
 * @param {string} token - Token string
 * @param {string} category - Category
 * @param {Object} grammar - Grammar object (optional, for validation)
 * @returns {number} - Binary value
 */
export function getBinaryFor(token, category, grammar = null) {
    // Validate token exists in grammar (if grammar provided)
    if (grammar && grammar[category] && !grammar[category][token]) {
        report(BinaryCodes.PARSER.VALIDATION(5101));

    }
    
    return generateBinary(token, category);
}

/**
 * Create punctuation binary map (for backward compatibility)
 * @param {Object} grammar - Grammar object
 * @returns {Object} - Punctuation binary map
 */
export function createPunctuationBinaryMap(grammar) {
    const map = {};
    
    if (grammar.punctuation) {
        for (const punct of Object.keys(grammar.punctuation)) {
            map[punct] = generateBinary(punct, 'punctuation');
        }
    }
    
    return map;
}

/**
 * USAGE EXAMPLE:
 * 
 * import { javascriptGrammar } from './grammars/javascript.grammar.js';
 * import { generateBinaryMapFromGrammar } from './binary-generator.js';
 * 
 * // Auto-generate binary map from grammar
 * const binaryMap = generateBinaryMapFromGrammar(javascriptGrammar);
 * 
 * // Use binary values
 * const ifBinary = binaryMap.keywords['if'];
 * const plusBinary = binaryMap.operators['+'];
 * const parenBinary = binaryMap.punctuation['('];
 * 
 * // Or get directly
 * import { getBinaryFor } from './binary-generator.js';
 * const ifBinary = getBinaryFor('if', 'keywords');
 */

export default {
    generateBinary,
    generateBinaryMapFromGrammar,
    getBinaryFor,
    createPunctuationBinaryMap,
    BINARY_RANGES
};
