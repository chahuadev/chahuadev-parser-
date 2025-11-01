/**
 * Grammar Converter - แปลง External Grammar -> Chahuadev Binary Grammar
 * 
 * รับข้อมูล grammar จากภายนอก (Tree-sitter, ANTLR, etc.)
 * แปลงเป็น Chahuadev format พร้อม __section_XX metadata
 */

import { generateBinaryMapFromGrammar } from '../binary-generator.js';
import fs from 'fs';
import path from 'path';

/**
 * แปลง Tree-sitter Grammar -> Chahuadev Grammar
 * @param {Object} treeSitterGrammar - Grammar จาก tree-sitter (JSON format)
 * @param {string} language - ชื่อภาษา (javascript, python, java, etc.)
 * @returns {Object} Chahuadev Grammar format
 */
export function convertTreeSitterGrammar(treeSitterGrammar, language) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Converting Tree-sitter Grammar: ${language}`);
    console.log('='.repeat(70));
    
    const chahuaGrammar = {
        "__grammar_header": "═".repeat(78),
        "__grammar_language": capitalizeFirst(language),
        "__grammar_version": "1.0.0",
        "__grammar_title": `${capitalizeFirst(language)} Language Grammar Definition`,
        "__grammar_description": `Complete grammar rules for ${capitalizeFirst(language)} - Auto-converted from Tree-sitter`,
        "__grammar_purpose": `Grammar definition for ${capitalizeFirst(language)} language tokenization and parsing`,
        "__grammar_total_sections": 0, // จะอัพเดทภายหลัง
        "__grammar_sections": [],
        "__grammar_used_by": [
            "GrammarIndex",
            "BlankPaperTokenizer",
            "BinaryParser"
        ],
        "__grammar_footer": "═".repeat(78)
    };
    
    let sectionNumber = 0;
    
    // Section 01: Keywords
    if (treeSitterGrammar.rules && extractKeywords(treeSitterGrammar.rules).length > 0) {
        const keywords = extractKeywords(treeSitterGrammar.rules);
        sectionNumber++;
        
        addSection(chahuaGrammar, sectionNumber, 'keywords', {
            title: `【SECTION ${String(sectionNumber).padStart(2, '0')}】${capitalizeFirst(language)} Keywords`,
            description: `Reserved keywords in ${capitalizeFirst(language)}`,
            purpose: `Define all keywords for ${capitalizeFirst(language)} tokenization`,
            items: keywords.length,
            data: convertKeywordsToMap(keywords)
        });
    }
    
    // Section 02: Operators
    if (treeSitterGrammar.rules && extractOperators(treeSitterGrammar.rules).length > 0) {
        const operators = extractOperators(treeSitterGrammar.rules);
        sectionNumber++;
        
        addSection(chahuaGrammar, sectionNumber, 'operators', {
            title: `【SECTION ${String(sectionNumber).padStart(2, '0')}】${capitalizeFirst(language)} Operators`,
            description: `All operators in ${capitalizeFirst(language)}`,
            purpose: `Define operators for expression parsing`,
            items: operators.length,
            data: convertOperatorsToMap(operators)
        });
    }
    
    // Section 03: Punctuation
    if (treeSitterGrammar.rules && extractPunctuation(treeSitterGrammar.rules).length > 0) {
        const punctuation = extractPunctuation(treeSitterGrammar.rules);
        sectionNumber++;
        
        addSection(chahuaGrammar, sectionNumber, 'punctuation', {
            title: `【SECTION ${String(sectionNumber).padStart(2, '0')}】${capitalizeFirst(language)} Punctuation`,
            description: `Punctuation marks and separators`,
            purpose: `Define punctuation for code structure`,
            items: punctuation.length,
            data: convertPunctuationToMap(punctuation)
        });
    }
    
    // Section 04: Comments (auto-detect based on language)
    const comments = getCommentsForLanguage(language);
    if (comments && Object.keys(comments).length > 0) {
        sectionNumber++;
        
        addSection(chahuaGrammar, sectionNumber, 'comments', {
            title: `【SECTION ${String(sectionNumber).padStart(2, '0')}】${capitalizeFirst(language)} Comments`,
            description: `Comment syntax for ${capitalizeFirst(language)}`,
            purpose: `Define comment patterns for tokenizer to skip`,
            items: Object.keys(comments).length,
            data: comments
        });
    }
    
    // อัพเดท total sections
    chahuaGrammar.__grammar_total_sections = sectionNumber;
    
    console.log(` Converted ${sectionNumber} sections`);
    console.log(`  - Keywords: ${chahuaGrammar.keywords ? Object.keys(chahuaGrammar.keywords).length : 0}`);
    console.log(`  - Operators: ${chahuaGrammar.operators ? Object.keys(chahuaGrammar.operators).length : 0}`);
    console.log(`  - Punctuation: ${chahuaGrammar.punctuation ? Object.keys(chahuaGrammar.punctuation).length : 0}`);
    console.log(`  - Comments: ${chahuaGrammar.comments ? Object.keys(chahuaGrammar.comments).length : 0}`);
    
    return chahuaGrammar;
}

/**
 * เพิ่ม section ใหม่ลงใน grammar
 */
function addSection(grammar, number, name, config) {
    const sectionKey = `__section_${String(number).padStart(2, '0')}`;
    
    grammar[`${sectionKey}`] = "═".repeat(78);
    grammar[`${sectionKey}_number`] = String(number).padStart(2, '0');
    grammar[`${sectionKey}_name`] = name;
    grammar[`${sectionKey}_title`] = config.title;
    grammar[`${sectionKey}_language`] = grammar.__grammar_language;
    grammar[`${sectionKey}_total_items`] = config.items;
    grammar[`${sectionKey}_description`] = config.description;
    grammar[`${sectionKey}_purpose`] = config.purpose;
    grammar[`${sectionKey}_responsibility`] = config.responsibility || `Handle ${name} for tokenization`;
    grammar[`${sectionKey}_used_by`] = [
        "BlankPaperTokenizer",
        "GrammarIndex"
    ];
    grammar[`${sectionKey}_footer`] = "═".repeat(78);
    
    // เพิ่ม section name ลงใน __grammar_sections
    grammar.__grammar_sections.push(name);
    
    // เพิ่มข้อมูล section
    grammar[name] = config.data;
}

/**
 * Recursively walk Tree-sitter rules and collect STRING values
 */
function walkRules(node, collector) {
    if (!node || typeof node !== 'object') return;
    
    // Found a STRING token
    if (node.type === 'STRING' && node.value) {
        collector.push(node.value);
    }
    
    // Recursively walk members array
    if (Array.isArray(node.members)) {
        node.members.forEach(member => walkRules(member, collector));
    }
    
    // Recursively walk content
    if (node.content) {
        walkRules(node.content, collector);
    }
}

/**
 * Extract all STRING values from Tree-sitter grammar rules
 */
function extractAllStrings(rules) {
    const strings = [];
    
    if (rules) {
        Object.values(rules).forEach(rule => {
            walkRules(rule, strings);
        });
    }
    
    // Remove duplicates and sort
    return [...new Set(strings)].sort();
}

/**
 * Categorize strings into keywords, operators, punctuation
 */
function categorizeStrings(strings) {
    const keywords = [];
    const operators = [];
    const punctuation = [];
    
    const operatorChars = /^[+\-*/%=<>!&|^~?:]+$/;
    const punctuationChars = /^[.,;()[\]{}@#$`'"\\]+$/;
    
    strings.forEach(str => {
        if (!str) return;
        
        // Multi-character: check if all letters/digits (keyword) or symbols (operator)
        if (str.length > 1) {
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)) {
                keywords.push(str);
            } else if (operatorChars.test(str)) {
                operators.push(str);
            } else if (punctuationChars.test(str)) {
                punctuation.push(str);
            } else {
                // Mixed or special - put in keywords by default
                keywords.push(str);
            }
        } else {
            // Single character
            if (operatorChars.test(str)) {
                operators.push(str);
            } else if (punctuationChars.test(str)) {
                punctuation.push(str);
            } else if (/[a-zA-Z_]/.test(str)) {
                keywords.push(str);
            }
        }
    });
    
    return { keywords, operators, punctuation };
}

/**
 * ดึง keywords จาก tree-sitter rules
 */
function extractKeywords(rules) {
    const strings = extractAllStrings(rules);
    const { keywords } = categorizeStrings(strings);
    return keywords;
}

/**
 * ดึง operators จาก tree-sitter rules
 */
function extractOperators(rules) {
    const strings = extractAllStrings(rules);
    const { operators } = categorizeStrings(strings);
    return operators;
}

/**
 * ดึง punctuation จาก tree-sitter rules
 */
function extractPunctuation(rules) {
    const strings = extractAllStrings(rules);
    const { punctuation } = categorizeStrings(strings);
    return punctuation;
}

/**
 * แปลง keywords array -> object map
 */
function convertKeywordsToMap(keywords) {
    const map = {};
    
    keywords.forEach(keyword => {
        map[keyword] = {
            category: detectKeywordCategory(keyword),
            source: "tree-sitter",
            description: `${keyword} keyword`
        };
    });
    
    return map;
}

/**
 * ตรวจจับประเภทของ keyword (เดาจากชื่อ)
 */
function detectKeywordCategory(keyword) {
    // Control flow
    if (['if', 'else', 'elif', 'switch', 'case', 'default'].includes(keyword)) return 'control';
    // Loops
    if (['for', 'while', 'do', 'break', 'continue'].includes(keyword)) return 'iteration';
    // Functions
    if (['def', 'function', 'return', 'yield', 'lambda'].includes(keyword)) return 'function';
    // Classes
    if (['class', 'interface', 'extends', 'implements', 'new'].includes(keyword)) return 'class';
    // Exception
    if (['try', 'catch', 'finally', 'throw', 'raises', 'except'].includes(keyword)) return 'exception';
    // Modifiers
    if (['public', 'private', 'protected', 'static', 'final', 'abstract', 'async', 'await'].includes(keyword)) return 'modifier';
    // Boolean/Null
    if (['true', 'false', 'True', 'False', 'null', 'None', 'nil', 'undefined'].includes(keyword)) return 'literal';
    // Import/Export
    if (['import', 'from', 'export', 'module', 'package', 'require'].includes(keyword)) return 'module';
    // Variable
    if (['var', 'let', 'const', 'global', 'nonlocal', 'del'].includes(keyword)) return 'variable';
    // Type
    if (['type', 'typedef', 'struct', 'enum', 'union'].includes(keyword)) return 'type';
    
    return 'keyword';
}

/**
 * แปลง operators array -> object map
 */
function convertOperatorsToMap(operators) {
    const map = {};
    
    operators.forEach(op => {
        map[op] = {
            type: detectOperatorType(op),
            source: "tree-sitter",
            description: `${op} operator`
        };
    });
    
    return map;
}

/**
 * แปลง punctuation array -> object map
 */
function convertPunctuationToMap(punctuation) {
    const map = {};
    
    punctuation.forEach(punct => {
        map[punct] = {
            type: detectPunctuationType(punct),
            source: "tree-sitter",
            description: `${punct} punctuation`
        };
    });
    
    return map;
}

/**
 * ตรวจจับประเภทของ operator
 */
function detectOperatorType(op) {
    if (['+', '-', '*', '/', '%'].includes(op)) return 'arithmetic';
    if (['==', '!=', '<', '>', '<=', '>='].includes(op)) return 'comparison';
    if (['&&', '||', '!'].includes(op)) return 'logical';
    if (['=', '+=', '-=', '*=', '/='].includes(op)) return 'assignment';
    return 'other';
}

/**
 * ตรวจจับประเภทของ punctuation
 */
function detectPunctuationType(punct) {
    if (['(', ')'].includes(punct)) return 'paren';
    if (['{', '}'].includes(punct)) return 'brace';
    if (['[', ']'].includes(punct)) return 'bracket';
    if (punct === ';') return 'statement-end';
    if (punct === ',') return 'separator';
    if (punct === '.') return 'accessor';
    return 'other';
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * บันทึก grammar เป็นไฟล์ .grammar.js
 */
export function saveGrammarFile(grammar, language, outputPath) {
    const filename = path.join(outputPath, `${language}.grammar.js`);
    
    const content = `// ${capitalizeFirst(language)} Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const ${language}Grammar = ${JSON.stringify(grammar, null, 2)};

export default ${language}Grammar;
`;
    
    fs.writeFileSync(filename, content, 'utf8');
    console.log(` Grammar saved: ${filename}`);
    
    return filename;
}

/**
 * ตัวอย่างการใช้งาน
 */
export async function convertFromTreeSitter(languageName, treeSitterGrammarPath) {
    console.log(`\nConverting ${languageName} grammar from Tree-sitter...`);
    
    // 1. อ่าน tree-sitter grammar (JSON)
    const treeSitterGrammar = JSON.parse(fs.readFileSync(treeSitterGrammarPath, 'utf8'));
    
    // 2. แปลงเป็น Chahuadev format
    const chahuaGrammar = convertTreeSitterGrammar(treeSitterGrammar, languageName);
    
    // 3. Generate binary values
    const grammarWithBinary = generateBinaryMapFromGrammar(chahuaGrammar);
    
    // 4. บันทึกเป็นไฟล์
    const outputPath = path.join(process.cwd(), 'src/grammars/shared/grammars');
    const savedFile = saveGrammarFile(grammarWithBinary, languageName, outputPath);
    
    console.log(` Conversion complete: ${savedFile}`);
    
    return grammarWithBinary;
}

/**
 * Get comment syntax for each language
 */
function getCommentsForLanguage(language) {
    const commentPatterns = {
        // C-style languages (JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, Swift, Kotlin, PHP)
        javascript: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        typescript: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        jsx: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" },
            "{/*": { type: "jsx", pattern: "{/*", description: "JSX comment", endPattern: "*/}" }
        },
        java: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        c: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        cpp: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        csharp: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        go: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        rust: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        swift: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        kotlin: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        php: {
            "//": { type: "line", pattern: "//", description: "Single-line comment", endPattern: "\\n" },
            "#": { type: "line", pattern: "#", description: "Shell-style comment", endPattern: "\\n" },
            "/*": { type: "block", pattern: "/*", description: "Multi-line comment", endPattern: "*/" }
        },
        // Python-style (Python)
        python: {
            "#": { type: "line", pattern: "#", description: "Single-line comment", endPattern: "\\n" },
            '"""': { type: "block", pattern: '"""', description: "Multi-line string/docstring", endPattern: '"""' },
            "'''": { type: "block", pattern: "'''", description: "Multi-line string/docstring", endPattern: "'''" }
        },
        // Ruby
        ruby: {
            "#": { type: "line", pattern: "#", description: "Single-line comment", endPattern: "\\n" },
            "=begin": { type: "block", pattern: "=begin", description: "Multi-line comment", endPattern: "=end" }
        }
    };
    
    return commentPatterns[language] || {};
}
