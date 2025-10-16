// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// Grammar Index System - Section-Based Search
// ============================================================================
// หน้าที่: ค้นหาจาก grammar files โดยใช้ language และ type (ประเภท)
// Tokenizer ส่ง language + type มา  GrammarIndex ค้นหาจาก section + type  ส่งผลกลับ
// ไม่เก็บ hardcode grammar ใดๆ - ค้นหาจากไฟล์ JSON เท่านั้น
//============================================================================
// ! ══════════════════════════════════════════════════════════════════════════════
// ! FIX: หัวใจของไฟล์นี้คือ "Blank Paper" 100% และ "Binary Comparison" 100% เท่านั้น
// ! ห้ามแก้เป็น String Comparison เด็ดขาด! ทุกฟังก์ชันต้องใช้เลข Binary จาก grammar JSON
// ! หากพบจุดที่มีโอกาสแก้เป็น String ให้เตือนและตรวจสอบกับ Binary Purity Validator ก่อนทุกครั้ง
// ! ระบบนี้ถูกออกแบบและนำไปปฏิบัติ (implement) ตามหลักการนี้อย่างเคร่งครัด
// ! ══════════════════════════════════════════════════════════════════════════════

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import errorHandler from '../../error-handler/ErrorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function emitGrammarIndexEvent(message, method, severity = 'INFO', context = {}) {
    const normalizedSeverity = typeof severity === 'string'
        ? severity.toUpperCase()
        : 'INFO';
    const normalizedMessage = typeof message === 'string' && message.trim().length > 0
        ? message
        : 'GrammarIndex event emitted';

    const notice = new Error(normalizedMessage);
    notice.name = 'GrammarIndexNotice';
    notice.isOperational = true;

    errorHandler.handleError(notice, {
        source: 'GrammarIndex',
        method,
        severity: normalizedSeverity,
        context
    });
}

export class GrammarIndex {
    /**
     * Constructor - รับ grammar object โดยตรง (สำหรับ SmartParserEngine)
     * @param {Object} grammarData - Grammar object ที่โหลดมาแล้ว
     */
    constructor(grammarData = null) {
        if (grammarData) {
            // Store grammar data for instance methods
            this.grammar = grammarData;
            
            // ! NO_CONSOLE: ส่ง grammar sections info ไปยัง ErrorHandler แทน console.log
            const grammarInfo = new Error('GrammarIndex initialized with grammar data');
            grammarInfo.isOperational = true;
            errorHandler.handleError(grammarInfo, {
                source: 'GrammarIndex',
                method: 'constructor',
                severity: 'DEBUG',
                context: {
                    hasKeywords: !!grammarData.keywords,
                    keywordsCount: Object.keys(grammarData.keywords || {}).length,
                    hasOperators: !!grammarData.operators,
                    operatorsCount: Object.keys(grammarData.operators || {}).length,
                    hasPunctuation: !!grammarData.punctuation,
                    punctuationCount: Object.keys(grammarData.punctuation || {}).length,
                    hasLiterals: !!grammarData.literals,
                    hasComments: !!grammarData.comments
                }
            });
        }
        
        // ! โหลด Punctuation Binary Map จาก tokenizer-binary-config.json
        // ! Brain ต้องรู้ Binary ของ Punctuation ทั้งหมดเพื่อให้บริการ Parser
        this._loadPunctuationBinaryMap();
    }
    
    /**
     * โหลด Punctuation Binary Map จาก tokenizer-binary-config.json
     * Brain ต้องมีความรู้เรื่อง Binary ของ Punctuation เพื่อให้บริการ Worker
     * @private
     */
    _loadPunctuationBinaryMap() {
        try {
            const configPath = join(__dirname, 'tokenizer-binary-config.json');
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            
            // โหลด punctuationBinaryMap จาก config
            this.punctuationBinaryMap = config.punctuationBinaryMap?.map || {};
            
            // ! NO_CONSOLE: ส่ง punctuation map info ไปยัง ErrorHandler แทน console.log
            const mapInfo = new Error('Punctuation binary map loaded successfully');
            mapInfo.isOperational = true;
            errorHandler.handleError(mapInfo, {
                source: 'GrammarIndex',
                method: '_loadPunctuationBinaryMap',
                severity: 'DEBUG',
                context: {
                    itemsCount: Object.keys(this.punctuationBinaryMap).length,
                    configPath: configPath
                }
            });
        } catch (error) {
            // ! NO_CONSOLE: ส่ง load failure ไปยัง ErrorHandler แทน console.error
            error.isOperational = true;
            errorHandler.handleError(error, {
                source: 'GrammarIndex',
                method: '_loadPunctuationBinaryMap',
                severity: 'WARNING',
                context: {
                    configPath: configPath,
                    fallback: 'empty_map'
                }
            });
            this.punctuationBinaryMap = {};
        }
    }
    
    /**
     * ค้นหาจาก language และ type (สำหรับ Tokenizer)
     * @param {string} language - ภาษา (javascript, typescript, java, jsx)
     * @param {string} type - ประเภท (keyword, operator, punctuation, literal, etc.)
     * @param {string} itemName - ชื่อ item ที่ต้องการค้นหา
     * @returns {Promise<Object>} ผลลัพธ์การค้นหา
     */
    static async searchByType(language, type, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        // ค้นหา section ที่ตรงกับ type
        const sectionName = GrammarIndex._mapTypeToSection(type);
        
        if (!sectionName || !grammar[sectionName]) {
            emitGrammarIndexEvent('Grammar section not found for type lookup', 'searchByType', 'WARNING', {
                language,
                requestedType: type,
                resolvedSection: sectionName || 'undefined'
            });
            return {
                found: false,
                error: `Section for type '${type}' not found in ${language} grammar`
            };
        }

        const section = grammar[sectionName];
        if (section[itemName]) {
            return {
                found: true,
                language,
                type,
                section: sectionName,
                item: itemName,
                data: section[itemName],
                metadata: await GrammarIndex.getSectionMetadata(language, sectionName)
            };
        }

        emitGrammarIndexEvent('Grammar item missing during type lookup', 'searchByType', 'WARNING', {
            language,
            type,
            section: sectionName,
            item: itemName
        });
        return {
            found: false,
            language,
            type,
            section: sectionName,
            item: itemName,
            error: `Item '${itemName}' not found in section '${sectionName}'`
        };
    }

    /**
     * แปลง type เป็น section name
     * @param {string} type - ประเภท (keyword, operator, etc.)
     * @returns {string} section name
     * @private
     */
    static _mapTypeToSection(type) {
        const typeMapping = {
            // JavaScript/TypeScript
            'keyword': 'keywords',
            'reserved': 'keywords',
            'operator': 'operators',
            'punctuation': 'punctuation',
            'literal': 'literals',
            'separator': 'punctuation',
            
            // Java
            'modifier': 'modifiers',
            'primitiveType': 'primitiveTypes',
            'annotation': 'annotations',
            
            // JSX
            'element': 'elements',
            'expression': 'expressions',
            'attribute': 'attributes',
            'component': 'builtInComponents',
            
            // TypeScript
            'typeKeyword': 'typeKeywords',
            'typeOperator': 'typeOperators',
            'declaration': 'declarations',
            'moduleKeyword': 'moduleKeywords'
        };

        return typeMapping[type] || type;
    }

    static async loadGrammar(language) {
        try {
            const grammarPath = join(__dirname, 'grammars', `${language}.grammar.json`);
            const grammarData = JSON.parse(readFileSync(grammarPath, 'utf8'));
            
            // ! CRITICAL FIX: Flatten nested operators and punctuation structures
            // ! WHY: javascript.grammar.json has nested structure (binaryOperators, unaryOperators, etc.)
            // ! BUT: Tokenizer expects flat objects like { "+": {...}, "-": {...} }
            if (grammarData.operators && typeof grammarData.operators === 'object') {
                const flatOperators = {};
                for (const category in grammarData.operators) {
                    if (typeof grammarData.operators[category] === 'object') {
                        Object.assign(flatOperators, grammarData.operators[category]);
                    }
                }
                grammarData.operators = flatOperators;
            }
            
            // Note: punctuation seems to be flat already, but check anyway
            // If needed, we can apply same flattening logic here
            
            // ! NO_CONSOLE: ส่ง grammar load info ไปยัง ErrorHandler แทน console.log
            const loadInfo = new Error(`Grammar loaded successfully for ${language}`);
            loadInfo.isOperational = true;
            errorHandler.handleError(loadInfo, {
                source: 'GrammarIndex',
                method: 'loadGrammar',
                severity: 'DEBUG',
                context: {
                    language: language,
                    grammarPath: grammarPath,
                    keywordsCount: Object.keys(grammarData.keywords || {}).length,
                    operatorsCount: Object.keys(grammarData.operators || {}).length,
                    punctuationCount: Object.keys(grammarData.punctuation || {}).length,
                    hasLiterals: !!grammarData.literals,
                    hasComments: !!grammarData.comments
                }
            });
            
            return grammarData;
            
            return new GrammarIndex(grammarData);
        } catch (error) {
            // ! NO_SILENT_FALLBACKS: ใช้ ErrorHandler กลาง - ห้าม throw new Error โดยตรง
            error.isOperational = false; // Grammar file not found = Programming error
            errorHandler.handleError(error, {
                source: 'GrammarIndex',
                method: 'loadGrammar',
                severity: 'CRITICAL',
                context: `Failed to load grammar for ${language} - Grammar file not found or invalid JSON format`
            });
            // ErrorHandler จะจัดการ process.exit() เองถ้าเป็น critical error
            throw error; // Re-throw after logging
        }
    }

    static async loadAllGrammars() {
        const [javascript, typescript, java, jsx] = await Promise.all([
            GrammarIndex.loadGrammar('javascript'),
            GrammarIndex.loadGrammar('typescript'),
            GrammarIndex.loadGrammar('java'),
            GrammarIndex.loadGrammar('jsx')
        ]);
        return { javascript, typescript, java, jsx };
    }

    static async searchBySection(language, sectionNumber, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        const sectionKey = `__section_${String(sectionNumber).padStart(2, '0')}_name`;
        const sectionName = grammar[sectionKey];
        
        if (!sectionName) {
            emitGrammarIndexEvent('Grammar section number not found', 'searchBySection', 'WARNING', {
                language,
                sectionNumber
            });
            return {
                found: false,
                error: `Section ${sectionNumber} not found in ${language} grammar`
            };
        }
        return await GrammarIndex.search(language, sectionName, itemName);
    }

    static async search(language, sectionName, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        if (!grammar[sectionName]) {
            emitGrammarIndexEvent('Requested grammar section missing', 'search', 'WARNING', {
                language,
                section: sectionName,
                item: itemName
            });
            return {
                found: false,
                error: `Section '${sectionName}' not found in ${language} grammar`
            };
        }

        const section = grammar[sectionName];
        if (section[itemName]) {
            return {
                found: true,
                language,
                section: sectionName,
                item: itemName,
                data: section[itemName],
                metadata: await GrammarIndex.getSectionMetadata(language, sectionName)
            };
        }

        emitGrammarIndexEvent('Grammar item missing during section search', 'search', 'WARNING', {
            language,
            section: sectionName,
            item: itemName
        });
        return {
            found: false,
            language,
            section: sectionName,
            item: itemName,
            error: `Item '${itemName}' not found in section '${sectionName}'`
        };
    }

    static async getSectionMetadata(language, sectionName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        let sectionNumber = null;
        for (let i = 1; i <= 20; i++) {
            const numKey = `__section_${String(i).padStart(2, '0')}_number`;
            const nameKey = `__section_${String(i).padStart(2, '0')}_name`;
            
            if (grammar[nameKey] === sectionName) {
                sectionNumber = i;
                break;
            }
        }

        if (!sectionNumber) {
            emitGrammarIndexEvent('Requested section metadata missing', 'getSectionMetadata', 'WARNING', {
                language,
                section: sectionName
            });
            return null;
        }

        const prefix = `__section_${String(sectionNumber).padStart(2, '0')}`;
        
        return {
            number: grammar[`${prefix}_number`],
            name: grammar[`${prefix}_name`],
            title: grammar[`${prefix}_title`],
            language: grammar[`${prefix}_language`],
            total_items: grammar[`${prefix}_total_items`],
            description: grammar[`${prefix}_description`],
            purpose: grammar[`${prefix}_purpose`],
            responsibility: grammar[`${prefix}_responsibility`],
            used_by: grammar[`${prefix}_used_by`],
            footer: grammar[`${prefix}_footer`]
        };
    }

    /**
     * ค้นหาหลายรายการพร้อมกัน (Batch search สำหรับ Tokenizer)
     * @param {string} language - ภาษา
     * @param {Array<{type: string, itemName: string}>} requests - รายการคำขอ
     * @returns {Promise<Array<Object>>} ผลลัพธ์ทั้งหมด
     */
    static async batchSearch(language, requests) {
        const results = await Promise.all(
            requests.map(req => GrammarIndex.searchByType(language, req.type, req.itemName))
        );
        return results;
    }

    /**
     * ตรวจสอบว่า item เป็นประเภทใดในภาษานั้นๆ
     * @param {string} language - ภาษา
     * @param {string} itemName - ชื่อ item
     * @returns {Promise<Object>} { found, type, section, data }
     */
    static async identifyType(language, itemName) {
        const grammar = await GrammarIndex.loadGrammar(language);
        
        // ลอง search ในทุก section
        const possibleSections = [
            'keywords', 'operators', 'punctuation', 'literals',
            'modifiers', 'primitiveTypes', 'annotations',
            'typeKeywords', 'typeOperators', 'declarations', 'moduleKeywords',
            'elements', 'expressions', 'attributes'
        ];

        for (const sectionName of possibleSections) {
            if (grammar[sectionName] && grammar[sectionName][itemName]) {
                return {
                    found: true,
                    language,
                    type: GrammarIndex._reverseMapSection(sectionName),
                    section: sectionName,
                    item: itemName,
                    data: grammar[sectionName][itemName]
                };
            }
        }

        emitGrammarIndexEvent('Unable to identify grammar type for item', 'identifyType', 'WARNING', {
            language,
            item: itemName
        });
        return {
            found: false,
            language,
            item: itemName,
            error: `Item '${itemName}' not found in any section of ${language} grammar`
        };
    }

    /**
     * แปลง section name กลับเป็น type
     * @param {string} sectionName - ชื่อ section
     * @returns {string} type
     * @private
     */
    static _reverseMapSection(sectionName) {
        const reverseMapping = {
            'keywords': 'keyword',
            'operators': 'operator',
            'punctuation': 'punctuation',
            'literals': 'literal',
            'modifiers': 'modifier',
            'primitiveTypes': 'primitiveType',
            'annotations': 'annotation',
            'typeKeywords': 'typeKeyword',
            'typeOperators': 'typeOperator',
            'declarations': 'declaration',
            'moduleKeywords': 'moduleKeyword',
            'elements': 'element',
            'expressions': 'expression',
            'attributes': 'attribute',
            'builtInComponents': 'component'
        };

        return reverseMapping[sectionName] || sectionName;
    }

    /**
     * ค้นหาข้อมูล keyword จาก grammar (instance method - ไม่ hardcode)
     * @param {string} keyword - ชื่อ keyword (เช่น 'if', 'for', 'const')
     * @returns {Object|null} ข้อมูล keyword จาก grammar หรือ null ถ้าไม่เจอ
     */
    getKeywordInfo(keyword) {
        if (!this.grammar || !this.grammar.keywords) {
            emitGrammarIndexEvent('Keyword lookup attempted without keyword section', 'getKeywordInfo', 'WARNING', {
                keyword,
                hasGrammar: !!this.grammar
            });
            return null;
        }

        const keywordData = this.grammar.keywords[keyword];
        if (!keywordData) {
            emitGrammarIndexEvent('Keyword not found in grammar', 'getKeywordInfo', 'WARNING', {
                keyword
            });
            return null;
        }

        // คืนค่าข้อมูลจาก Grammar โดยตรง (ไม่ hardcode)
        return keywordData;
    }

    /**
     * ตรวจสอบว่า keyword มี subcategory ตรงกับที่ระบุหรือไม่ (section-based)
     * @param {string} keyword - ชื่อ keyword
     * @param {string} subcategory - subcategory ที่ต้องการตรวจสอบ (เช่น 'variableDeclaration', 'functionDeclaration', 'ifStatement')
     * @returns {boolean}
     */
    isKeywordSubcategory(keyword, subcategory) {
        const keywordInfo = this.getKeywordInfo(keyword);
        if (!keywordInfo) {
            return false;
        }
        return keywordInfo.subcategory === subcategory;
    }

    /**
     * ดึง subcategory ของ keyword (section-based)
     * @param {string} keyword - ชื่อ keyword
     * @returns {string|null}
     */
    getKeywordSubcategory(keyword) {
        const keywordInfo = this.getKeywordInfo(keyword);
        return keywordInfo ? keywordInfo.subcategory : null;
    }

    /**
     * ตรวจสอบว่า keyword เป็น unary keyword หรือไม่ (section-based)
     * @param {string} keyword - ชื่อ keyword (เช่น 'typeof', 'void', 'delete')
     * @returns {boolean}
     */
    isUnaryKeyword(keyword) {
        const keywordInfo = this.getKeywordInfo(keyword);
        if (!keywordInfo) {
            return false;
        }
        // ตรวจสอบจาก subcategory, category, isPrefix หรือ usage
        // ! await มี category = 'operator' และ isPrefix = true ดังนั้นต้องตรวจสอบ isPrefix ด้วย
        return keywordInfo.subcategory === 'unaryOperator' || 
               keywordInfo.category === 'unary' ||
               keywordInfo.isPrefix === true ||  // เพิ่มการตรวจสอบ isPrefix สำหรับ await
               (keywordInfo.usage && keywordInfo.usage.includes('unary'));
    }

    /**
     * ตรวจสอบว่า operator เป็น assignment operator หรือไม่ (อ่านจาก isAssign field ใน Grammar - NO_HARDCODE)
     * @param {string} operator - ตัว operator (เช่น '=', '+=', '-=')
     * @returns {boolean}
     */
    isAssignmentOperator(operator) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Assignment operator lookup without operator section', 'isAssignmentOperator', 'WARNING', {
                operator,
                hasGrammar: !!this.grammar
            });
            return false;
        }

        const operatorData = this.grammar.operators[operator];
        if (!operatorData) {
            emitGrammarIndexEvent('Assignment operator not found', 'isAssignmentOperator', 'WARNING', {
                operator
            });
            return false;
        }

        // ตรวจสอบจาก isAssign field (assignment operators ใช้ isAssign แทน category)
        return operatorData.isAssign === true || operatorData.category === 'assignment';
    }

    /**
     * ตรวจสอบว่า operator เป็น logical operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '&&', '||', '??')
     * @returns {boolean}
     */
    isLogicalOperator(operator) {
        return this._isOperatorCategory(operator, 'logical');
    }

    /**
     * ตรวจสอบว่า operator เป็น equality operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '===', '!==', '==', '!=')
     * @returns {boolean}
     */
    isEqualityOperator(operator) {
        return this._isOperatorCategory(operator, 'equality');
    }

    /**
     * ตรวจสอบว่า operator เป็น relational operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '<', '>', '<=', '>=')
     * @returns {boolean}
     */
    isRelationalOperator(operator) {
        return this._isOperatorCategory(operator, 'relational');
    }

    /**
     * ตรวจสอบว่า operator เป็น additive operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '+', '-')
     * @returns {boolean}
     */
    isAdditiveOperator(operator) {
        return this._isOperatorCategory(operator, 'additive');
    }

    /**
     * ตรวจสอบว่า operator เป็น multiplicative operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '*', '/', '%')
     * @returns {boolean}
     */
    isMultiplicativeOperator(operator) {
        return this._isOperatorCategory(operator, 'multiplicative');
    }

    /**
     * ตรวจสอบว่า operator เป็น unary operator หรือไม่
     * @param {string} operator - ตัว operator (เช่น '!', '-', '+', 'typeof')
     * @returns {boolean}
     */
    isUnaryOperator(operator) {
        if (!this.grammar || !this.grammar.operators) {
            return false;
        }

        const operatorData = this.grammar.operators[operator];
        if (!operatorData) {
            return false;
        }

        // ตรวจสอบจาก category หรือ isPrefix field
        return operatorData.category === 'unary' || operatorData.isPrefix === true;
    }

    /**
     * ฟังก์ชันช่วยตรวจสอบ operator category จาก Grammar (NO_HARDCODE)
     * @param {string} operator - ตัว operator
     * @param {string} category - category ที่ต้องการตรวจสอบ
     * @returns {boolean}
     * @private
     */
    _isOperatorCategory(operator, category) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Operator category lookup without operator section', '_isOperatorCategory', 'WARNING', {
                operator,
                category,
                hasGrammar: !!this.grammar
            });
            return false;
        }

        const operatorData = this.grammar.operators[operator];
        if (!operatorData) {
            emitGrammarIndexEvent('Operator not found for category comparison', '_isOperatorCategory', 'WARNING', {
                operator,
                category
            });
            return false;
        }

        return operatorData.category === category;
    }

    /**
     * ดึงค่า binary ของ punctuation จาก binary map
     * @param {string} punctuation - ตัว punctuation (เช่น '(', ')', '{', '}')
     * @returns {number|undefined} - binary constant หรือ undefined ถ้าไม่พบ
     */
    getPunctuationBinary(punctuation) {
        // ! โหลดจาก punctuationBinaryMap ที่ Brain มีอยู่แล้ว
        // ! Brain รู้ Binary ของ Punctuation ทั้งหมดจาก tokenizer-binary-config.json
        if (this.punctuationBinaryMap && this.punctuationBinaryMap[punctuation]) {
            return this.punctuationBinaryMap[punctuation];
        }
        
        // Fallback: ถ้ามีใน grammar.punctuation (แต่ส่วนใหญ่จะไม่มี)
        if (this.grammar && this.grammar.punctuation) {
            const punctData = this.grammar.punctuation[punctuation];
            if (punctData && punctData.binary) {
                emitGrammarIndexEvent('Punctuation binary resolved via grammar fallback', 'getPunctuationBinary', 'INFO', {
                    punctuation,
                    resolution: 'grammarFallback'
                });
                return punctData.binary;
            }
        }
        
        // Fallback สุดท้าย: ใช้ charCode
        emitGrammarIndexEvent('Punctuation binary fallback to charCode', 'getPunctuationBinary', 'WARNING', {
            punctuation,
            reason: 'missingInMaps'
        });
        return punctuation.charCodeAt(0);
    }

    /**
     * แปลง binary constant กลับเป็น punctuation character
     * @param {number} binary - binary constant
     * @returns {string|null} - punctuation character หรือ null ถ้าไม่พบ
     */
    getPunctuationFromBinary(binary) {
        // ! ค้นหาจาก punctuationBinaryMap ที่ Brain มีอยู่
        if (this.punctuationBinaryMap) {
            for (const [punct, binaryValue] of Object.entries(this.punctuationBinaryMap)) {
                if (binaryValue === binary) {
                    return punct;
                }
            }
        }
        
        // Fallback: ค้นหาจาก grammar.punctuation (ถ้ามี)
        if (this.grammar && this.grammar.punctuation) {
            for (const [punct, data] of Object.entries(this.grammar.punctuation)) {
                const punctBinary = data.binary || punct.charCodeAt(0);
                if (punctBinary === binary) {
                    return punct;
                }
            }
        }
        
        emitGrammarIndexEvent('Unable to resolve punctuation from binary', 'getPunctuationFromBinary', 'WARNING', {
            binary
        });
        return null;
    }

    /**
     * ดึงค่า binary ของ keyword จาก grammar
     * @param {string} keyword - ชื่อ keyword (เช่น 'if', 'for', 'const')
     * @returns {number|undefined} - binary value หรือ undefined ถ้าไม่พบ
     */
    getKeywordBinary(keyword) {
        if (!this.grammar || !this.grammar.keywords) {
            emitGrammarIndexEvent('Keyword binary lookup without keyword section', 'getKeywordBinary', 'WARNING', {
                keyword,
                hasGrammar: !!this.grammar
            });
            return undefined;
        }
        
        const keywordData = this.grammar.keywords[keyword];
        if (!keywordData) {
            emitGrammarIndexEvent('Keyword binary not found in grammar', 'getKeywordBinary', 'WARNING', {
                keyword
            });
            return undefined;
        }
        
        // อ่าน binary จาก grammar (ถ้ามี) หรือสร้างจาก hash
        return keywordData.binary || this._generateKeywordBinary(keyword);
    }

    /**
     * ดึงค่า binary ของ operator จาก grammar
     * @param {string} operator - ตัว operator (เช่น '+', '-', '===')
     * @returns {number|undefined} - binary value หรือ undefined ถ้าไม่พบ
     */
    getOperatorBinary(operator) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Operator binary lookup without operator section', 'getOperatorBinary', 'WARNING', {
                operator,
                hasGrammar: !!this.grammar
            });
            return undefined;
        }
        
        const operatorData = this.grammar.operators[operator];
        if (!operatorData) {
            emitGrammarIndexEvent('Operator binary not found in grammar', 'getOperatorBinary', 'WARNING', {
                operator
            });
            return undefined;
        }
        
        // อ่าน binary จาก grammar (ถ้ามี) หรือสร้างจาก hash
        return operatorData.binary || this._generateOperatorBinary(operator);
    }

    /**
     * ตรวจสอบว่าเป็น keyword หรือไม่ (ใช้ Section-Based Search)
     * @param {string} word - คำที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isKeyword(word) {
        if (!this.grammar || !this.grammar.keywords) {
            emitGrammarIndexEvent('Keyword presence check without keyword section', 'isKeyword', 'WARNING', {
                word,
                hasGrammar: !!this.grammar
            });
            return false;
        }
        
        // ค้นหาใน Section 01: keywords
        const exists = this.grammar.keywords.hasOwnProperty(word);
        if (!exists) {
            emitGrammarIndexEvent('Keyword not registered in grammar', 'isKeyword', 'WARNING', {
                word
            });
        }
        return exists;
    }

    /**
     * ตรวจสอบว่าเป็น operator หรือไม่ (ใช้ Section-Based Search)
     * @param {string} op - operator ที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isOperator(op) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Operator presence check without operator section', 'isOperator', 'WARNING', {
                operator: op,
                hasGrammar: !!this.grammar
            });
            return false;
        }
        
        // ค้นหาใน Section 03: operators
        const exists = this.grammar.operators.hasOwnProperty(op);
        if (!exists) {
            emitGrammarIndexEvent('Operator not registered in grammar', 'isOperator', 'WARNING', {
                operator: op
            });
        }
        return exists;
    }

    /**
     * ตรวจสอบว่าเป็น punctuation หรือไม่ (ใช้ Section-Based Search)
     * @param {string} punct - punctuation ที่ต้องการตรวจสอบ
     * @returns {boolean}
     */
    isPunctuation(punct) {
        if (!this.grammar || !this.grammar.punctuation) {
            emitGrammarIndexEvent('Punctuation presence check without punctuation section', 'isPunctuation', 'WARNING', {
                punctuation: punct,
                hasGrammar: !!this.grammar
            });
            return false;
        }
        
        // ค้นหาใน Section 04: punctuation
        const exists = this.grammar.punctuation.hasOwnProperty(punct);
        if (!exists) {
            emitGrammarIndexEvent('Punctuation not registered in grammar', 'isPunctuation', 'WARNING', {
                punctuation: punct
            });
        }
        return exists;
    }

    /**
     * ดึงข้อมูล punctuation จาก Section 04 (Section-Based Search)
     * @param {string} punct - ตัว punctuation
     * @returns {Object|null} - ข้อมูล punctuation หรือ null ถ้าไม่พบ
     */
    getPunctuationInfo(punct) {
        if (!this.grammar || !this.grammar.punctuation) {
            emitGrammarIndexEvent('Punctuation info requested without punctuation section', 'getPunctuationInfo', 'WARNING', {
                punctuation: punct,
                hasGrammar: !!this.grammar
            });
            return null;
        }
        
        // ค้นหาใน Section 04: punctuation
        const punctData = this.grammar.punctuation[punct];
        if (!punctData) {
            emitGrammarIndexEvent('Punctuation info not found in grammar', 'getPunctuationInfo', 'WARNING', {
                punctuation: punct
            });
            return null;
        }
        
        // คืนค่าข้อมูลจาก Section โดยตรง (NO HARDCODE)
        return {
            punctuation: punct,
            type: punctData.type || 'unknown',
            precedence: punctData.precedence || null,
            associativity: punctData.associativity || null,
            binary: this.getPunctuationBinary(punct),
            ...punctData
        };
    }

    /**
     * ดึงข้อมูล operator จาก Section 03 (Section-Based Search)
     * @param {string} operator - ตัว operator
     * @returns {Object|null} - ข้อมูล operator หรือ null ถ้าไม่พบ
     */
    getOperatorInfo(operator) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Operator info requested without operator section', 'getOperatorInfo', 'WARNING', {
                operator,
                hasGrammar: !!this.grammar
            });
            return null;
        }
        
        // ค้นหาใน Section 03: operators
        const operatorData = this.grammar.operators[operator];
        if (!operatorData) {
            emitGrammarIndexEvent('Operator info not found in grammar', 'getOperatorInfo', 'WARNING', {
                operator
            });
            return null;
        }
        
        // คืนค่าข้อมูลจาก Section โดยตรง (NO HARDCODE)
        return {
            operator: operator,
            category: operatorData.category || 'unknown',
            precedence: operatorData.precedence || 0,
            associativity: operatorData.associativity || 'left',
            binary: operatorData.binary || this._generateOperatorBinary(operator),
            ...operatorData
        };
    }

    /**
     * สร้างค่า binary สำหรับ keyword (fallback method)
     * @param {string} keyword - ชื่อ keyword
     * @returns {number}
     * @private
     */
    _generateKeywordBinary(keyword) {
        let hash = 0;
        for (let i = 0; i < keyword.length; i++) {
            hash = ((hash << 5) - hash) + keyword.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * สร้างค่า binary สำหรับ operator (fallback method)
     * @param {string} operator - ตัว operator
     * @returns {number}
     * @private
     */
    _generateOperatorBinary(operator) {
        let hash = 0;
        for (let i = 0; i < operator.length; i++) {
            hash = ((hash << 5) - hash) + operator.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * ค้นหา keyword จาก binary value (100% Binary Lookup - NO STRING COMPARISON)
     * @param {number} keywordBinary - binary value ของ keyword
     * @returns {Object|null} - ข้อมูล keyword หรือ null
     */
    getKeywordByBinary(keywordBinary) {
        if (!this.grammar || !this.grammar.keywords) {
            emitGrammarIndexEvent('Keyword binary reverse lookup without keyword section', 'getKeywordByBinary', 'WARNING', {
                keywordBinary,
                hasGrammar: !!this.grammar
            });
            return null;
        }

        // ค้นหา keyword ที่มี binary ตรงกัน
        for (const [keyword, data] of Object.entries(this.grammar.keywords)) {
            const binary = data.binary || this._generateKeywordBinary(keyword);
            if (binary === keywordBinary) {
                return {
                    keyword: keyword,
                    binary: binary,
                    ...data
                };
            }
        }

        emitGrammarIndexEvent('Keyword binary not found in grammar', 'getKeywordByBinary', 'WARNING', {
            keywordBinary
        });
        return null;
    }

    /**
     * ค้นหา operator จาก binary value (100% Binary Lookup)
     * @param {number} operatorBinary - binary value ของ operator
     * @returns {Object|null} - ข้อมูล operator หรือ null
     */
    getOperatorByBinary(operatorBinary) {
        if (!this.grammar || !this.grammar.operators) {
            emitGrammarIndexEvent('Operator binary reverse lookup without operator section', 'getOperatorByBinary', 'WARNING', {
                operatorBinary,
                hasGrammar: !!this.grammar
            });
            return null;
        }

        // ค้นหา operator ที่มี binary ตรงกัน
        for (const [operator, data] of Object.entries(this.grammar.operators)) {
            const binary = data.binary || this._generateOperatorBinary(operator);
            if (binary === operatorBinary) {
                return {
                    operator: operator,
                    binary: binary,
                    ...data
                };
            }
        }

        emitGrammarIndexEvent('Operator binary not found in grammar', 'getOperatorByBinary', 'WARNING', {
            operatorBinary
        });
        return null;
    }

    /**
     * ตรวจสอบว่า keyword binary นี้เป็น assignment operator หรือไม่ (Binary-based)
     * @param {number} operatorBinary - binary value ของ operator
     * @returns {boolean}
     */
    isAssignmentOperatorByBinary(operatorBinary) {
        const operatorData = this.getOperatorByBinary(operatorBinary);
        if (!operatorData) {
            return false;
        }

        return operatorData.isAssign === true || operatorData.category === 'assignment';
    }

    /**
     * ตรวจสอบว่า operator binary เป็น simple assignment (=) หรือไม่
     * @param {number} operatorBinary - binary value ของ operator
     * @returns {boolean}
     */
    isSimpleAssignmentByBinary(operatorBinary) {
        const operatorData = this.getOperatorByBinary(operatorBinary);
        if (!operatorData) {
            return false;
        }

        return operatorData.isAssign === true && operatorData.type === 'simple';
    }

    /**
     * ดึง category ของ keyword จาก binary (Binary-based)
     * @param {number} keywordBinary - binary value ของ keyword
     * @returns {string|null} - category หรือ null
     */
    getKeywordCategoryByBinary(keywordBinary) {
        const keywordData = this.getKeywordByBinary(keywordBinary);
        return keywordData ? keywordData.category : null;
    }
}

