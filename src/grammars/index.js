//======================================================================
// บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// Version: 1.0.0
// License: MIT
// Contact: chahuadev@gmail.com
//======================================================================
// Grammar Entry/Exit Point - NO LOGIC, ONLY ROUTING
// ============================================================================
// หน้าที่: ทางเข้า-ทางออกเท่านั้น ไม่มีโลจิกใดๆ
// ส่งต่อ request ไปยัง grammar-index.js และรอรับ response กลับมา
// ============================================================================

import { GrammarIndex } from './shared/grammar-index.js';
import { PureBinaryParser } from './shared/pure-binary-parser.js';
import EnhancedBinaryParser from './shared/enhanced-binary-parser.js';
import { BinaryComputationTokenizer } from './shared/tokenizer-helper.js';
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';
import { ERROR_SEVERITY_FLAGS } from '../constants/severity-constants.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { quantumArchitectureConfig } from './shared/configs/quantum-architecture.js';
import { parserConfig } from './shared/parser-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_QUANTUM_CONFIG = {
    enabled: true,
    scout: {
        enabled: true,
        cacheStructures: true,
        maxDepth: 50
    },
    architect: {
        useScout: true,
        quantumJumps: true,
        preAllocation: true,
        complexityThreshold: 10
    },
    prophet: {
        enabled: false,
        maxUniverses: 6,
        timeoutMs: 100,
        minConfidence: 60,
        adaptiveLearning: true
    },
    fallback: {
        onProphetFailure: 'traditional',
        onScoutFailure: 'continue',
        maxRetries: 3
    },
    monitoring: {
        collectMetrics: true,
        logLevel: 'info',
        telemetry: false
    }
};

const mergeSection = (baseSection, overrideSection) => {
    const base = (baseSection && typeof baseSection === 'object') ? baseSection : {};
    if (!overrideSection || typeof overrideSection !== 'object') {
        return { ...base };
    }
    return { ...base, ...overrideSection };
};

/**
 * Create Parser instance (Factory Function) - Production Parser (NO_MOCKING compliant)
 * @param {Object} rules - Validation rules
 * @param {Object} options - Parser options (quantum: boolean หรือ object สำหรับปรับแต่ง Quantum Architecture)
 * @returns {Promise<Object>} Parser factory with parse method
 */
export async function createParser(rules, options = {}) {
    const grammarCandidate = await GrammarIndex.loadGrammar('javascript');
    const grammarIndex = (grammarCandidate instanceof GrammarIndex)
        ? grammarCandidate
        : new GrammarIndex(grammarCandidate);
    
    // ! MIGRATION: JSON → ES Module for Parser Config
    // ! OLD: readFileSync('parser-config.json') + JSON.parse()
    // ! NEW: import parserConfig from ES module (top-level import)

    // ! MIGRATION: JSON → ES Module for Quantum Architecture Config
    // ! OLD: readFileSync('quantum-architecture.json') + JSON.parse()
    // ! NEW: import quantumArchitectureConfig from ES module (top-level import)
    let fileQuantumConfig = DEFAULT_QUANTUM_CONFIG;

    try {
        // ใช้ config ที่ import มาจาก quantum-architecture.js (ES Module)
        if (quantumArchitectureConfig && typeof quantumArchitectureConfig === 'object' && quantumArchitectureConfig.quantum) {
            fileQuantumConfig = {
                ...DEFAULT_QUANTUM_CONFIG,
                ...quantumArchitectureConfig.quantum,
                enabled: true
            };
        }
    } catch (configError) {
        // FIX: Binary Error Pattern
        report(
            BinaryCodes.SYSTEM.CONFIGURATION(10001),
            { 
                error: configError,
                configFile: 'shared/configs/quantum-architecture.js'
            }
        );
        fileQuantumConfig = { ...DEFAULT_QUANTUM_CONFIG };
    }

    const optionQuantum = (options.quantum && typeof options.quantum === 'object') ? options.quantum : {};

    const resolvedQuantum = {
        ...fileQuantumConfig,
        enabled: true,
        scout: mergeSection(fileQuantumConfig.scout, optionQuantum.scout),
        architect: mergeSection(fileQuantumConfig.architect, optionQuantum.architect),
        prophet: mergeSection(fileQuantumConfig.prophet, optionQuantum.prophet),
        fallback: mergeSection(fileQuantumConfig.fallback, optionQuantum.fallback),
        monitoring: mergeSection(fileQuantumConfig.monitoring, optionQuantum.monitoring)
    };

    Object.keys(optionQuantum).forEach((key) => {
        if (!['enabled', 'scout', 'architect', 'prophet', 'fallback', 'monitoring'].includes(key)) {
            resolvedQuantum[key] = optionQuantum[key];
        }
    });

    resolvedQuantum.scout = {
        ...resolvedQuantum.scout,
        enabled: true
    };

    resolvedQuantum.architect = {
        ...resolvedQuantum.architect,
        useScout: true,
        quantumJumps: true,
        preAllocation: true
    };

    resolvedQuantum.prophet = {
        ...resolvedQuantum.prophet,
        enabled: true
    };

    const architectOverrides = (options.architect && typeof options.architect === 'object') ? options.architect : {};
    const userOptionOverrides = { ...options };
    delete userOptionOverrides.quantum;
    delete userOptionOverrides.architect;
    
    const fullConfig = {
        ...parserConfig,
        rules: rules,
        quantum: resolvedQuantum
    };
    
    // Choose parser based on quantum option
    const ParserClass = EnhancedBinaryParser;
    
    // Return factory that creates parser with tokens + source + grammarIndex
    return {
        parse: (tokens, source = '') => {
            const runtimeOptions = {
                ...resolvedQuantum.architect,
                ...architectOverrides,
                ...userOptionOverrides,
                scoutConfig: resolvedQuantum.scout,
                prophetConfig: resolvedQuantum.prophet,
                fallbackConfig: resolvedQuantum.fallback,
                monitoringConfig: resolvedQuantum.monitoring
            };

            return new ParserClass(tokens, source, grammarIndex, runtimeOptions);
        },
        config: fullConfig,
        grammarIndex,
        quantum: true,
        quantumConfig: resolvedQuantum
    };
}

/**
 * Request JavaScript Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJavaScriptGrammar() {
    return await GrammarIndex.loadGrammar('javascript');
}

/**
 * Request TypeScript Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getTypeScriptGrammar() {
    return await GrammarIndex.loadGrammar('typescript');
}

/**
 * Request Java Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJavaGrammar() {
    return await GrammarIndex.loadGrammar('java');
}

/**
 * Request JSX Grammar - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object|null>}
 */
export async function getJSXGrammar() {
    return await GrammarIndex.loadGrammar('jsx');
}

/**
 * Request Complete Grammar Set - ส่งต่อไป grammar-index.js
 * @returns {Promise<Object>}
 */
export async function getCompleteGrammar() {
    return await GrammarIndex.loadAllGrammars();
}

/**
 * Search in grammar by section and name - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา (javascript, typescript, java, jsx)
 * @param {string} sectionName - ชื่อ section (keywords, operators, etc.)
 * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
 * @returns {Promise<Object>}
 */
export async function searchGrammar(language, sectionName, itemName) {
    return await GrammarIndex.search(language, sectionName, itemName);
}

/**
 * Search by section number - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {number} sectionNumber - หมายเลข section
 * @param {string} itemName - ชื่อ item
 * @returns {Promise<Object>}
 */
export async function searchBySectionNumber(language, sectionNumber, itemName) {
    return await GrammarIndex.searchBySection(language, sectionNumber, itemName);
}

/**
 * Get section info - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {string} sectionName - ชื่อ section
 * @returns {Promise<Object>}
 */
export async function getSectionInfo(language, sectionName) {
    return await GrammarIndex.getSectionMetadata(language, sectionName);
}

/**
 * Search by type (สำหรับ Tokenizer) - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา (javascript, typescript, java, jsx)
 * @param {string} type - ประเภท (keyword, operator, punctuation, etc.)
 * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
 * @returns {Promise<Object>} ผลลัพธ์การค้นหา
 */
export async function searchByType(language, type, itemName) {
    return await GrammarIndex.searchByType(language, type, itemName);
}

/**
 * Batch search (ค้นหาหลายรายการพร้อมกัน) - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {Array<{type: string, itemName: string}>} requests - รายการคำขอ
 * @returns {Promise<Array<Object>>} ผลลัพธ์ทั้งหมด
 */
export async function batchSearch(language, requests) {
    return await GrammarIndex.batchSearch(language, requests);
}

/**
 * Identify type of item - ส่งต่อไป grammar-index.js
 * @param {string} language - ภาษา
 * @param {string} itemName - ชื่อ item
 * @returns {Promise<Object>} { found, type, section, data }
 */
export async function identifyType(language, itemName) {
    return await GrammarIndex.identifyType(language, itemName);
}

/**
 * Tokenize source code - ส่งต่อไป BinaryComputationTokenizer
 * @param {string} code - Source code to tokenize
 * @param {Object} grammarIndex - Optional GrammarIndex instance (if not provided, will use default)
 * @returns {Array<Object>} Array of tokens with binary values
 */
export function tokenize(code, grammarIndex = null) {
    const tokenizer = new BinaryComputationTokenizer(grammarIndex || 'javascript');
    return tokenizer.tokenize(code);
}

/**
 * Load GrammarIndex instance - ส่งต่อไป GrammarIndex
 * @param {string} language - ภาษา (javascript, typescript, java, jsx)
 * @returns {Promise<Object>} GrammarIndex instance
 */
export async function loadGrammarIndex(language) {
    return await GrammarIndex.loadGrammar(language);
}

/**
 * Create PureBinaryParser instance - ส่งต่อไป PureBinaryParser
 * @param {Array<Object>} tokens - Array of tokens
 * @param {string} source - Source code
 * @param {Object} grammarIndex - GrammarIndex instance
 * @returns {Object} PureBinaryParser instance
 */
export function createPureBinaryParser(tokens, source, grammarIndex) {
    return new PureBinaryParser(tokens, source, grammarIndex);
}

/**
 * Create Enhanced Binary Parser with Quantum Architecture
 * @param {Array<Object>} tokens - Array of tokens
 * @param {string} source - Source code
 * @param {Object} grammarIndex - GrammarIndex instance
 * @param {Object} options - Parser options
 * @returns {Object} EnhancedBinaryParser instance
 */
export function createQuantumParser(tokens, source, grammarIndex, options = {}) {
    return new EnhancedBinaryParser(tokens, source, grammarIndex, {
        useScout: true,
        quantumJumps: true,
        preAllocation: true,
        ...options
    });
}

// ============================================================================
// NO RE-EXPORTS - ทุก request ต้องผ่าน functions ข้างบนเท่านั้น
// ห้ามเข้าถึง GrammarIndex, PureBinaryParser, BinaryComputationTokenizer โดยตรง
// ============================================================================