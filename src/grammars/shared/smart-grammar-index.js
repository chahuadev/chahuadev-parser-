// ! ══════════════════════════════════════════════════════════════════════════════
// !  Smart Grammar Index - AI-Powered Multi-Language Support
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// ! ══════════════════════════════════════════════════════════════════════════════
// 
// Architecture: Metadata-First + Runtime Binary Generation
// - Grammar files: METADATA ONLY (category, type, description)
// - Binary values: GENERATED AT RUNTIME (no pre-calculation)
// - Zero Maintenance: Edit grammar → Binary auto-updates
//
// ! ══════════════════════════════════════════════════════════════════════════════

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { generateBinary } from './binary-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SmartGrammarIndex {
    constructor(language = null) {
        this.language = language;
        this.grammar = null;
        this.binaryCache = new Map(); // Cache runtime-generated binaries
        
        if (language) {
            this.loadGrammar(language);
        }
    }
    
    /**
     * โหลด grammar แบบ synchronous (สำหรับ constructor)
     */
    async loadGrammar(language) {
        try {
            const grammarPath = join(__dirname, 'grammars', `${language}.grammar.js`);
            const grammarURL = pathToFileURL(grammarPath).href;
            const module = await import(grammarURL);
            
            // Auto-detect export name: pythonGrammar, goGrammar, rustGrammar, etc.
            const grammarExportName = `${language}Grammar`;
            this.grammar = module[grammarExportName];
            
            if (!this.grammar) {
                throw new Error(`Grammar export '${grammarExportName}' not found in ${language}.grammar.js`);
            }
            
            this.language = language;
            return this.grammar;
            
        } catch (error) {
            console.error(`Failed to load grammar for ${language}:`, error.message);
            return null;
        }
    }
    
    /**
     * สร้าง GrammarIndex instance สำหรับภาษาที่ระบุ
     */
    static async create(language) {
        const index = new SmartGrammarIndex();
        await index.loadGrammar(language);
        return index;
    }
    
    /**
     * ดึง binary value (generate runtime + cache)
     */
    getBinary(token, category) {
        const cacheKey = `${category}:${token}`;
        
        // Check cache first
        if (this.binaryCache.has(cacheKey)) {
            return this.binaryCache.get(cacheKey);
        }
        
        // Generate and cache
        const binary = generateBinary(token, category);
        this.binaryCache.set(cacheKey, binary);
        return binary;
    }
    
    /**
     * ตรวจสอบว่าเป็น keyword หรือไม่
     */
    isKeyword(word) {
        return this.grammar?.keywords?.[word] !== undefined;
    }
    
    /**
     * ตรวจสอบว่าเป็น operator หรือไม่
     */
    isOperator(op) {
        return this.grammar?.operators?.[op] !== undefined;
    }
    
    /**
     * ตรวจสอบว่าเป็น punctuation หรือไม่
     */
    isPunctuation(punct) {
        return this.grammar?.punctuation?.[punct] !== undefined;
    }
    
    /**
     * ดึงข้อมูล keyword พร้อม binary
     */
    getKeywordInfo(keyword) {
        const metadata = this.grammar?.keywords?.[keyword];
        if (!metadata) return null;
        
        return {
            token: keyword,
            ...metadata,
            binary: this.getBinary(keyword, 'keywords')
        };
    }
    
    /**
     * ดึงข้อมูล operator พร้อม binary
     */
    getOperatorInfo(operator) {
        const metadata = this.grammar?.operators?.[operator];
        if (!metadata) return null;
        
        return {
            token: operator,
            ...metadata,
            binary: this.getBinary(operator, 'operators')
        };
    }
    
    /**
     * ดึงข้อมูล punctuation พร้อม binary
     */
    getPunctuationInfo(punct) {
        const metadata = this.grammar?.punctuation?.[punct];
        if (!metadata) return null;
        
        return {
            token: punct,
            ...metadata,
            binary: this.getBinary(punct, 'punctuation')
        };
    }
    
    /**
     * ค้นหา token type อัตโนมัติ
     */
    identifyToken(token) {
        if (this.isKeyword(token)) {
            return { type: 'KEYWORD', info: this.getKeywordInfo(token) };
        }
        if (this.isOperator(token)) {
            return { type: 'OPERATOR', info: this.getOperatorInfo(token) };
        }
        if (this.isPunctuation(token)) {
            return { type: 'PUNCTUATION', info: this.getPunctuationInfo(token) };
        }
        return { type: 'UNKNOWN', info: null };
    }
    
    /**
     * ตรวจสอบ keyword category
     */
    getKeywordCategory(keyword) {
        return this.grammar?.keywords?.[keyword]?.category;
    }
    
    /**
     * ตรวจสอบ operator type
     */
    getOperatorType(operator) {
        return this.grammar?.operators?.[operator]?.type;
    }
    
    /**
     * ตรวจสอบว่าเป็น assignment operator หรือไม่
     */
    isAssignmentOperator(operator) {
        const type = this.getOperatorType(operator);
        return type === 'assignment';
    }
    
    /**
     * ตรวจสอบว่าเป็น comparison operator หรือไม่
     */
    isComparisonOperator(operator) {
        const type = this.getOperatorType(operator);
        return type === 'comparison';
    }
    
    /**
     * ตรวจสอบว่าเป็น logical operator หรือไม่
     */
    isLogicalOperator(operator) {
        const type = this.getOperatorType(operator);
        return type === 'logical';
    }
    
    /**
     * ตรวจสอบว่าเป็น arithmetic operator หรือไม่
     */
    isArithmeticOperator(operator) {
        const type = this.getOperatorType(operator);
        return type === 'arithmetic';
    }
    
    /**
     * ดึงรายการ keywords ทั้งหมด
     */
    getAllKeywords() {
        return Object.keys(this.grammar?.keywords || {});
    }
    
    /**
     * ดึงรายการ operators ทั้งหมด
     */
    getAllOperators() {
        return Object.keys(this.grammar?.operators || {});
    }
    
    /**
     * ดึงรายการ punctuation ทั้งหมด
     */
    getAllPunctuation() {
        return Object.keys(this.grammar?.punctuation || {});
    }
    
    /**
     * ดึง grammar metadata
     */
    getGrammarInfo() {
        if (!this.grammar) return null;
        
        return {
            language: this.grammar.__grammar_language,
            version: this.grammar.__grammar_version,
            title: this.grammar.__grammar_title,
            description: this.grammar.__grammar_description,
            totalSections: this.grammar.__grammar_total_sections,
            sections: this.grammar.__grammar_sections
        };
    }
    
    /**
     * ดึง section metadata
     */
    getSectionInfo(sectionNumber) {
        const prefix = `__section_${String(sectionNumber).padStart(2, '0')}`;
        
        return {
            number: this.grammar?.[`${prefix}_number`],
            name: this.grammar?.[`${prefix}_name`],
            title: this.grammar?.[`${prefix}_title`],
            language: this.grammar?.[`${prefix}_language`],
            totalItems: this.grammar?.[`${prefix}_total_items`],
            description: this.grammar?.[`${prefix}_description`],
            purpose: this.grammar?.[`${prefix}_purpose`],
            responsibility: this.grammar?.[`${prefix}_responsibility`],
            usedBy: this.grammar?.[`${prefix}_used_by`]
        };
    }
    
    /**
     * สถิติ grammar
     */
    getStatistics() {
        return {
            language: this.language,
            keywords: Object.keys(this.grammar?.keywords || {}).length,
            operators: Object.keys(this.grammar?.operators || {}).length,
            punctuation: Object.keys(this.grammar?.punctuation || {}).length,
            cacheSize: this.binaryCache.size
        };
    }
}

// Export singleton factory
export async function createGrammarIndex(language) {
    return await SmartGrammarIndex.create(language);
}

export default SmartGrammarIndex;
