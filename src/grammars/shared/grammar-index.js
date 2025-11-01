// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-parser-.git
// !  Version: 3.0.0 - SMART GRAMMAR INDEX
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// Smart Grammar Index - AI-Powered Grammar Brain  
// ============================================================================
//  BINARY BRAIN - ค้นหาแกรมม่าด้วย Binary Comparison 100%
//  SMART DETECTION - Auto-detect language, type, category
//  RUNTIME GENERATION - Binary values generated on-demand
//  ZERO MAINTENANCE - แก้ grammar  Binary auto-update
//  MULTI-LANGUAGE - รองรับทุกภาษาที่มี .grammar.js
// ============================================================================
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ARCHITECTURE: Blank Paper + Binary-First + Smart Caching
// ! - NO HARDCODE: ทุกอย่างมาจาก grammar files
// ! - NO STRING COMPARISON: Binary only
// ! - NO MANUAL CONFIG: Auto-load ทุกภาษา
// ! ══════════════════════════════════════════════════════════════════════════════

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';
import { generateBinaryMapFromGrammar } from './binary-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Smart Grammar Index - Binary Brain สำหรับ Multi-Language Grammar
 * 
 * FEATURES:
 *  Auto-load grammar files (.grammar.js)
 *  Runtime binary generation & caching
 *  Smart type detection (keyword/operator/punctuation)
 *  Category-based search (control/iteration/function/etc.)
 *  Binary-first comparison (no string matching)
 *  Zero-maintenance (grammar changes  binary auto-updates)
 * 
 * USAGE:
 * ```javascript
 * const index = new SmartGrammarIndex('javascript');
 * await index.loadGrammar();
 * 
 * // Binary-based lookup
 * const binary = index.getBinary('if', 'keyword');
 * const info = index.getKeywordInfo('const');
 * 
 * // Smart detection
 * const token = index.identifyToken('async');
 * //  { type: 'keyword', category: 'async', binary: 0x0123 }
 * ```
 */
export class SmartGrammarIndex {
    /**
     * สร้าง SmartGrammarIndex สำหรับภาษาใดภาษาหนึ่ง
     * @param {string} language - ชื่อภาษา (javascript, python, java, etc.)
     */
    constructor(language) {
        this.language = language;
        this.grammar = null;
        this.binaryCache = new Map(); // Cache: 'keyword:if'  0x0001
        this.reverseCache = new Map(); // Reverse: 0x0001  { type: 'keyword', value: 'if' }
        this.loaded = false;
    }

    /**
     * โหลด grammar file และ generate binary map
     * @returns {Promise<boolean>} สำเร็จหรือไม่
     */
    async loadGrammar() {
        if (this.loaded) {
            return true; // Already loaded
        }

        try {
            // Construct grammar file path
            const grammarPath = join(__dirname, 'grammars', `${this.language}.grammar.js`);
            const grammarURL = pathToFileURL(grammarPath).href;
            
            // Dynamic import
            const module = await import(grammarURL);
            
            // Auto-detect export name (javascriptGrammar, pythonGrammar, etc.)
            const exportName = `${this.language}Grammar`;
            this.grammar = module[exportName];
            
            if (!this.grammar) {
                // Try alternative export names
                const altNames = [
                    this.language, // 'javascript'
                    `${this.language}_grammar`, // 'javascript_grammar'
                    'grammar', // 'grammar'
                    'default' // default export
                ];
                
                for (const name of altNames) {
                    if (module[name]) {
                        this.grammar = module[name];
                        break;
                    }
                }
            }
            
            if (!this.grammar) {
                report(BinaryCodes.PARSER.CONFIGURATION(20001));
                return false;
            }
            
            // Generate binary map from grammar (metadata  binary)
            this.grammar = generateBinaryMapFromGrammar(this.grammar);
            
            // Build binary cache
            this._buildBinaryCache();
            
            this.loaded = true;
            return true;
            
        } catch (error) {
            report(BinaryCodes.PARSER.CONFIGURATION(20002));
            return false;
        }
    }

    /**
     * สร้าง binary cache สำหรับ fast lookup
     * Cache Structure:
     * - Forward: 'keyword:if'  0x0001
     * - Reverse: 0x0001  { type: 'keyword', value: 'if', data: {...} }
     * @private
     */
    _buildBinaryCache() {
        if (!this.grammar) return;
        
        // Cache keywords
        if (this.grammar.keywords) {
            for (const [keyword, data] of Object.entries(this.grammar.keywords)) {
                if (data.binary) {
                    const cacheKey = `keyword:${keyword}`;
                    this.binaryCache.set(cacheKey, data.binary);
                    this.reverseCache.set(data.binary, {
                        type: 'keyword',
                        value: keyword,
                        data: data
                    });
                }
            }
        }
        
        // Cache operators
        if (this.grammar.operators) {
            for (const [operator, data] of Object.entries(this.grammar.operators)) {
                if (data.binary) {
                    const cacheKey = `operator:${operator}`;
                    this.binaryCache.set(cacheKey, data.binary);
                    this.reverseCache.set(data.binary, {
                        type: 'operator',
                        value: operator,
                        data: data
                    });
                }
            }
        }
        
        // Cache punctuation
        if (this.grammar.punctuation) {
            for (const [punct, data] of Object.entries(this.grammar.punctuation)) {
                if (data.binary) {
                    const cacheKey = `punctuation:${punct}`;
                    this.binaryCache.set(cacheKey, data.binary);
                    this.reverseCache.set(data.binary, {
                        type: 'punctuation',
                        value: punct,
                        data: data
                    });
                }
            }
        }
    }

    /**
     * ดึงค่า binary ของ token (with cache)
     * @param {string} token - Token value (e.g., 'if', '+', '(')
     * @param {string} type - Token type ('keyword', 'operator', 'punctuation')
     * @returns {number|null} Binary value หรือ null
     */
    getBinary(token, type) {
        const cacheKey = `${type}:${token}`;
        
        // Try cache first
        if (this.binaryCache.has(cacheKey)) {
            return this.binaryCache.get(cacheKey);
        }
        
        // Fallback: direct lookup
        if (!this.grammar) return null;
        
        const section = this._getSection(type);
        if (section && section[token]) {
            return section[token].binary || null;
        }
        
        return null;
    }

    /**
     * ค้นหา token จาก binary value (reverse lookup)
     * @param {number} binary - Binary value
     * @returns {Object|null} { type, value, data } หรือ null
     */
    getTokenFromBinary(binary) {
        return this.reverseCache.get(binary) || null;
    }

    /**
     * ตรวจสอบว่าเป็น keyword หรือไม่
     * @param {string} word - คำที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isKeyword(word) {
        if (!this.grammar || !this.grammar.keywords) return false;
        return this.grammar.keywords.hasOwnProperty(word);
    }

    /**
     * ตรวจสอบว่าเป็น operator หรือไม่
     * @param {string} op - Operator ที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isOperator(op) {
        if (!this.grammar || !this.grammar.operators) return false;
        return this.grammar.operators.hasOwnProperty(op);
    }

    /**
     * ตรวจสอบว่าเป็น punctuation หรือไม่
     * @param {string} punct - Punctuation ที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isPunctuation(punct) {
        if (!this.grammar || !this.grammar.punctuation) return false;
        return this.grammar.punctuation.hasOwnProperty(punct);
    }

    /**
     * ดึงข้อมูล keyword
     * @param {string} keyword - Keyword name
     * @returns {Object|null} Keyword data หรือ null
     */
    getKeywordInfo(keyword) {
        if (!this.grammar || !this.grammar.keywords) return null;
        return this.grammar.keywords[keyword] || null;
    }

    /**
     * ดึงข้อมูล operator
     * @param {string} operator - Operator symbol
     * @returns {Object|null} Operator data หรือ null
     */
    getOperatorInfo(operator) {
        if (!this.grammar || !this.grammar.operators) return null;
        return this.grammar.operators[operator] || null;
    }

    /**
     * ดึงข้อมูล punctuation
     * @param {string} punct - Punctuation symbol
     * @returns {Object|null} Punctuation data หรือ null
     */
    getPunctuationInfo(punct) {
        if (!this.grammar || !this.grammar.punctuation) return null;
        return this.grammar.punctuation[punct] || null;
    }

    /**
     * ดึงค่า binary ของ keyword
     * @param {string} keyword - Keyword name
     * @returns {number|null} Binary value หรือ null
     */
    getKeywordBinary(keyword) {
        return this.getBinary(keyword, 'keyword');
    }

    /**
     * ดึงค่า binary ของ operator
     * @param {string} operator - Operator symbol
     * @returns {number|null} Binary value หรือ null
     */
    getOperatorBinary(operator) {
        return this.getBinary(operator, 'operator');
    }

    /**
     * ดึงค่า binary ของ punctuation
     * @param {string} punct - Punctuation symbol
     * @returns {number|null} Binary value หรือ null
     */
    getPunctuationBinary(punct) {
        return this.getBinary(punct, 'punctuation');
    }

    /**
     * ค้นหา punctuation จาก binary value (reverse lookup)
     * @param {number} binary - Binary value
     * @returns {string|null} Punctuation symbol หรือ null
     */
    getPunctuationFromBinary(binary) {
        const result = this.getTokenFromBinary(binary);
        return result && result.type === 'punctuation' ? result.value : null;
    }

    /**
     * Smart Detection - ตรวจจับว่า token เป็นอะไร
     * @param {string} token - Token to identify
     * @returns {Object|null} { type, category, binary, data } หรือ null
     */
    identifyToken(token) {
        // Try keyword first
        if (this.isKeyword(token)) {
            const data = this.getKeywordInfo(token);
            return {
                type: 'keyword',
                category: data.category || 'unknown',
                binary: data.binary,
                data: data
            };
        }
        
        // Try operator
        if (this.isOperator(token)) {
            const data = this.getOperatorInfo(token);
            return {
                type: 'operator',
                category: data.category || 'unknown',
                binary: data.binary,
                data: data
            };
        }
        
        // Try punctuation
        if (this.isPunctuation(token)) {
            const data = this.getPunctuationInfo(token);
            return {
                type: 'punctuation',
                category: data.type || 'unknown',
                binary: data.binary,
                data: data
            };
        }
        
        return null; // Unknown token
    }

    /**
     * ค้นหา keyword ตาม category
     * @param {string} category - Category name (control, iteration, function, etc.)
     * @returns {Array<Object>} Array of { keyword, data }
     */
    findKeywordsByCategory(category) {
        if (!this.grammar || !this.grammar.keywords) return [];
        
        const results = [];
        for (const [keyword, data] of Object.entries(this.grammar.keywords)) {
            if (data.category === category) {
                results.push({ keyword, data });
            }
        }
        return results;
    }

    /**
     * ค้นหา operator ตาม type
     * @param {string} type - Operator type (arithmetic, comparison, logical, etc.)
     * @returns {Array<Object>} Array of { operator, data }
     */
    findOperatorsByType(type) {
        if (!this.grammar || !this.grammar.operators) return [];
        
        const results = [];
        for (const [operator, data] of Object.entries(this.grammar.operators)) {
            if (data.type === type) {
                results.push({ operator, data });
            }
        }
        return results;
    }

    /**
     * ดึง section ตาม type
     * @param {string} type - Type name
     * @returns {Object|null} Section object หรือ null
     * @private
     */
    _getSection(type) {
        if (!this.grammar) return null;
        
        const sectionMap = {
            'keyword': 'keywords',
            'operator': 'operators',
            'punctuation': 'punctuation',
            'literal': 'literals'
        };
        
        const sectionName = sectionMap[type] || type;
        return this.grammar[sectionName] || null;
    }

    /**
     * ตรวจสอบว่า keyword เป็น unary keyword หรือไม่
     * @param {string} keyword - Keyword name
     * @returns {boolean}
     */
    isUnaryKeyword(keyword) {
        const data = this.getKeywordInfo(keyword);
        if (!data) return false;
        
        return data.category === 'unary' || 
               data.isPrefix === true ||
               (data.usage && data.usage.includes('unary'));
    }

    /**
     * ตรวจสอบว่า operator เป็น assignment operator หรือไม่
     * @param {string} operator - Operator symbol
     * @returns {boolean}
     */
    isAssignmentOperator(operator) {
        const data = this.getOperatorInfo(operator);
        if (!data) return false;
        
        return data.isAssign === true || data.category === 'assignment';
    }

    /**
     * ตรวจสอบว่า operator เป็น logical operator หรือไม่
     * @param {string} operator - Operator symbol
     * @returns {boolean}
     */
    isLogicalOperator(operator) {
        return this._isOperatorCategory(operator, 'logical');
    }

    /**
     * ตรวจสอบว่า operator เป็น comparison operator หรือไม่
     * @param {string} operator - Operator symbol
     * @returns {boolean}
     */
    isComparisonOperator(operator) {
        const data = this.getOperatorInfo(operator);
        if (!data) return false;
        
        return data.category === 'comparison' || 
               data.type === 'comparison' ||
               data.category === 'equality' ||
               data.category === 'relational';
    }

    /**
     * ตรวจสอบ operator category
     * @param {string} operator - Operator symbol
     * @param {string} category - Category to check
     * @returns {boolean}
     * @private
     */
    _isOperatorCategory(operator, category) {
        const data = this.getOperatorInfo(operator);
        if (!data) return false;
        
        return data.category === category || data.type === category;
    }

    /**
     * ดึงสถิติของ grammar
     * @returns {Object} Statistics object
     */
    getStatistics() {
        if (!this.grammar) {
            return {
                language: this.language,
                loaded: false
            };
        }
        
        return {
            language: this.language,
            loaded: true,
            keywords: Object.keys(this.grammar.keywords || {}).length,
            operators: Object.keys(this.grammar.operators || {}).length,
            punctuation: Object.keys(this.grammar.punctuation || {}).length,
            cacheSize: this.binaryCache.size,
            reverseCacheSize: this.reverseCache.size
        };
    }

    /**
     * Clear cache (สำหรับ reload grammar)
     */
    clearCache() {
        this.binaryCache.clear();
        this.reverseCache.clear();
        this.grammar = null;
        this.loaded = false;
    }
}

/**
 * Multi-Language Grammar Manager - จัดการหลายภาษาพร้อมกัน
 * 
 * USAGE:
 * ```javascript
 * const manager = new MultiLanguageGrammarManager();
 * await manager.loadLanguage('javascript');
 * await manager.loadLanguage('python');
 * 
 * const jsIndex = manager.getIndex('javascript');
 * const binary = jsIndex.getBinary('if', 'keyword');
 * ```
 */
export class MultiLanguageGrammarManager {
    constructor() {
        this.indices = new Map(); // language  SmartGrammarIndex
        this.availableLanguages = this._scanAvailableGrammars();
    }

    /**
     * สแกนหา grammar files ที่มีอยู่
     * @returns {Array<string>} Array of language names
     * @private
     */
    _scanAvailableGrammars() {
        try {
            const grammarsDir = join(__dirname, 'grammars');
            const files = readdirSync(grammarsDir);
            
            return files
                .filter(file => file.endsWith('.grammar.js'))
                .map(file => file.replace('.grammar.js', ''));
                
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.IO.RUNTIME(10001));
            return [];
        }
    }

    /**
     * โหลดภาษาเข้า manager
     * @param {string} language - Language name
     * @returns {Promise<boolean>} สำเร็จหรือไม่
     */
    async loadLanguage(language) {
        // Check if already loaded
        if (this.indices.has(language)) {
            return true;
        }
        
        // Create and load index
        const index = new SmartGrammarIndex(language);
        const success = await index.loadGrammar();
        
        if (success) {
            this.indices.set(language, index);
            return true;
        }
        
        return false;
    }

    /**
     * ดึง SmartGrammarIndex สำหรับภาษาที่ต้องการ
     * @param {string} language - Language name
     * @returns {SmartGrammarIndex|null} Index instance หรือ null
     */
    getIndex(language) {
        return this.indices.get(language) || null;
    }

    /**
     * โหลดทุกภาษาที่มี
     * @returns {Promise<Array<string>>} Array of loaded languages
     */
    async loadAllLanguages() {
        const loaded = [];
        
        for (const language of this.availableLanguages) {
            const success = await this.loadLanguage(language);
            if (success) {
                loaded.push(language);
            }
        }
        
        return loaded;
    }

    /**
     * ดึงรายการภาษาที่โหลดแล้ว
     * @returns {Array<string>} Array of loaded languages
     */
    getLoadedLanguages() {
        return Array.from(this.indices.keys());
    }

    /**
     * ดึงรายการภาษาที่มีอยู่ทั้งหมด
     * @returns {Array<string>} Array of available languages
     */
    getAvailableLanguages() {
        return [...this.availableLanguages];
    }

    /**
     * ดึงสถิติของทุกภาษา
     * @returns {Object} Statistics object
     */
    getAllStatistics() {
        const stats = {};
        
        for (const [language, index] of this.indices.entries()) {
            stats[language] = index.getStatistics();
        }
        
        return stats;
    }
}

// Export convenience functions
export async function createGrammarIndex(language) {
    const index = new SmartGrammarIndex(language);
    await index.loadGrammar();
    return index;
}

export async function createMultiLanguageManager() {
    const manager = new MultiLanguageGrammarManager();
    await manager.loadAllLanguages();
    return manager;
}
 