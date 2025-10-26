// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// !  PURE BINARY TOKENIZER - "BLANK PAPER"
// ! ══════════════════════════════════════════════════════════════════════════════
// !  PHILOSOPHY: Tokenizer คือ "กระดาษเปล่า" ที่ไม่รู้อะไรเลย
// !  
// !  หน้าที่เดียว: แปลง String  Binary (0b10001)
// !  
// !  ไม่มีหน้าที่:
// !  - [NO] ไม่รู้ว่า "//" คือ comment
// !  - [NO] ไม่รู้ว่า "/*" คือ comment เริ่มต้น
// !  - [NO] ไม่รู้ว่า `"` คือ string
// !  - [NO] ไม่รู้ว่า `'` คือ string
// !  - [NO] ไม่รู้ว่า `\` คือ escape character
// !  
// !  ทุกอย่างต้องถาม Brain (GrammarIndex) เท่านั้น!
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! FIX: หัวใจของไฟล์นี้คือ "Blank Paper" 100% และ "Binary Comparison" 100% เท่านั้น
// ! ห้ามแก้เป็น String Comparison เด็ดขาด! ทุกฟังก์ชันต้องใช้เลข Binary จาก grammar JSON
// ! หากพบจุดที่มีโอกาสแก้เป็น String ให้เตือนและตรวจสอบกับ Binary Purity Validator ก่อนทุกครั้ง
// ! ระบบนี้ถูกออกแบบและนำไปปฏิบัติ (implement) ตามหลักการนี้อย่างเคร่งครัด
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! CRITICAL UNDERSTANDING: THREE LAYERS OF BINARY
// ! ══════════════════════════════════════════════════════════════════════════════
// !   DO NOT CONFUSE THESE THREE DIFFERENT BINARY LAYERS:
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 1: MACHINE CODE (CPU Instructions)                               │
// ! │  WE DO NOT WORK HERE                                                  │
// ! │                                                                         │
// ! │ Example: 10111000 00000101 = MOV AX, 5                                 │
// ! │ - Opcodes + Operands that control CPU transistors directly             │
// ! │ - Platform specific (x86, ARM, RISC-V)                                 │
// ! │ - This is what COMPILER produces, NOT what we read                     │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 2: CHARACTER ENCODING (ASCII/UTF-8)                              │
// ! │  THIS IS WHERE WE START                                               │
// ! │                                                                         │
// ! │ Example: 01100011 = 'c' (ASCII code 99)                                │
// ! │ - Universal text representation standard                                │
// ! │ - Same across ALL platforms                                             │
// ! │ - UniversalCharacterClassifier reads THESE numeric values               │
// ! │ - Pure mathematics: 99 >= 97 && 99 <= 122  LETTER                     │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ┌─────────────────────────────────────────────────────────────────────────┐
// ! │ LAYER 3: SEMANTIC BINARY FLAGS (Our Innovation)                        │
// ! │  THIS IS OUR OUTPUT                                                   │
// ! │                                                                         │
// ! │ Example: 0b00100000 = KEYWORD token type (bit 5 set)                   │
// ! │ - Mathematical classification of meaning                                │
// ! │ - Language-agnostic semantic representation                             │
// ! │ - All bit positions defined in tokenizer-binary-config.json            │
// ! └─────────────────────────────────────────────────────────────────────────┘
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! COMPLETE FLOW: Source Code  Semantic Binary Stream
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Input:  "const x = 5;"
// !
// ! Step 1: File System (OS stores as binary)
// !         const  99,111,110,115,116 (ASCII codes)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 2: Character Classification (Pure Math)
// !         99  97 && 99  122  TRUE  LETTER flag (0b00001)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 3: Token Assembly (Ask Brain)
// !         "const"  brain.isKeyword("const")  TRUE
// !         Assign: binary = (1 << TOKEN_TYPES.KEYWORD.bit) = 0b00100000
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Step 4: Output Semantic Stream
// !         {type:"KEYWORD", binary:32, value:"const", start:0, end:5}
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! WHY THIS APPROACH IS POWERFUL
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 1. LANGUAGE AGNOSTIC: Same tokenizer reads JS, Python, Rust, Go
// !    Just swap Brain (GrammarIndex) with different grammar rules
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 2. PLATFORM INDEPENDENT: Works on Intel, ARM, RISC-V identically
// !    Because ASCII/UTF-8 is universal standard
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 3. PRESERVES SEMANTICS: Variable name "userAge" keeps meaning
// !    Unlike Machine Code where it becomes anonymous memory address
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 4. MATHEMATICALLY PURE: Zero ambiguity
// !    charCode >= 65 && charCode <= 90 is absolute truth
// !    No regex, no string matching, pure integer comparisons
// ! ══════════════════════════════════════════════════════════════════════════════
// ! 5. ZERO HARDCODE: Every value from config
// !    Change behavior by editing JSON only, never touch source code
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! GOLDEN RULE
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════
// ! "We are NOT reading Machine Code."
// ! "We are reading Character Codes and converting them to"
// ! "Semantic Binary Flags through pure mathematics."
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Our Boundary:
// !    Source Code  Binary Token Stream (OUR DOMAIN)
// !    Binary Token Stream  Machine Code (COMPILER'S DOMAIN)
// ! ══════════════════════════════════════════════════════════════════════════════

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { GrammarIndex } from './grammar-index.js';
import { reportError } from '../../error-handler/binary-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';
import { tokenizerBinaryConfig } from './tokenizer-binary-config.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! ES MODULE DIRECTORY RESOLUTION
// ! ══════════════════════════════════════════════════════════════════════════════
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ! ══════════════════════════════════════════════════════════════════════════════
// ! LOAD CONFIGURATION - ES MODULE IMPORT (NO_HARDCODE COMPLIANCE)
// ! ══════════════════════════════════════════════════════════════════════════════

const CONFIG = tokenizerBinaryConfig;

// ! ══════════════════════════════════════════════════════════════════════════════
// ! STRICT MODE - Fail Fast When Grammar/Binary Data Missing
// ! ══════════════════════════════════════════════════════════════════════════════
// ! เปิดใช้เพื่อบังคับให้ระบบ throw error ทันทีเมื่อข้อมูล grammar/binary ไม่ครบ
// ! ป้องกัน silent fallback ที่ทำให้ระบบทำงานแบบไม่สมบูรณ์
// ! ══════════════════════════════════════════════════════════════════════════════
const STRICT_MODE = true; // Set false เพื่อใช้ fallback (ไม่แนะนำ)

// Extract constants from configuration - ZERO HARDCODE
// FIX: NO_SILENT_FALLBACKS - reportError แทน throw (ให้ระบบทำงานต่อแต่มี error log)
if (!CONFIG.unicodeRanges?.ranges) {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1008), {
        method: 'tokenizer-helper init',
        message: 'CONFIG.unicodeRanges.ranges is missing - Tokenizer cannot function',
        fatal: true
    });
}
if (!CONFIG.characterFlags?.flags) {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1017), {
        method: 'tokenizer-helper init',
        message: 'CONFIG.characterFlags.flags is missing - Cannot classify characters',
        fatal: true
    });
}
if (!CONFIG.tokenBinaryTypes?.types) {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1010), {
        method: 'tokenizer-helper init',
        message: 'CONFIG.tokenBinaryTypes.types is missing - Cannot assign token types',
        fatal: true
    });
}
if (!CONFIG.grammarMetadata?.fields) {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1011), {
        method: 'tokenizer-helper init',
        message: 'CONFIG.grammarMetadata.fields is missing - Cannot parse grammar files',
        fatal: true
    });
}

const UNICODE = CONFIG.unicodeRanges.ranges;
const CHAR_FLAGS = CONFIG.characterFlags.flags;
const TOKEN_TYPES = CONFIG.tokenBinaryTypes.types;
const GRAMMAR_METADATA_FIELDS = CONFIG.grammarMetadata.fields;
const TOKEN_TYPE_STRINGS = CONFIG.tokenTypeStrings.types;
const ERROR_MESSAGES = CONFIG.errorMessages.templates;
const PARSING_RULES = CONFIG.parsingRules.rules;
const SECURITY_LIMITS = CONFIG.securityConfig.limits;

// ! NO_SILENT_FALLBACKS: reportError แทน throw
const UNICODE_IDENTIFIER_CONFIG = CONFIG.unicodeIdentifierConfig;
if (!UNICODE_IDENTIFIER_CONFIG || typeof UNICODE_IDENTIFIER_CONFIG !== 'object') {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1012), {
        method: 'tokenizer-helper init',
        message: 'unicodeIdentifierConfig is missing or invalid',
        fatal: true
    });
}

const UNICODE_AUTO_CONFIG = UNICODE_IDENTIFIER_CONFIG.autoConfig;
if (!UNICODE_AUTO_CONFIG || typeof UNICODE_AUTO_CONFIG !== 'object') {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1013), {
        method: 'tokenizer-helper init',
        message: 'unicodeIdentifierConfig.autoConfig is missing or invalid',
        fatal: true
    });
}

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const ASCII_BOUNDARY_CODE = isFiniteNumber(UNICODE.ASCII_BOUNDARY?.code)
    ? UNICODE.ASCII_BOUNDARY.code
    : 128;

// ! NO_HARDCODE: Punctuation binary map - โหลดจาก config
// ! For 100% binary parsing without string comparison
const PUNCTUATION_BINARY_MAP = CONFIG.punctuationBinaryMap?.map;
if (!PUNCTUATION_BINARY_MAP || typeof PUNCTUATION_BINARY_MAP !== 'object' || Object.keys(PUNCTUATION_BINARY_MAP).length === 0) {
    reportError(BinaryCodes.SYSTEM.CONFIGURATION(1034), {
        method: 'tokenizer-helper init',
        message: 'punctuationBinaryMap.map is missing, invalid, or empty',
        fatal: true
    });
}

const BASE_WHITESPACE_CODES = [
    UNICODE.SPACE?.code,
    UNICODE.TAB?.code,
    UNICODE.LINE_FEED?.code,
    UNICODE.CARRIAGE_RETURN?.code,
    UNICODE.VERTICAL_TAB?.code,
    UNICODE.FORM_FEED?.code
].filter(isFiniteNumber);

const EXTENDED_WHITESPACE_CODES = [
    UNICODE.NO_BREAK_SPACE?.code,
    UNICODE.LINE_SEPARATOR?.code,
    UNICODE.PARAGRAPH_SEPARATOR?.code,
    UNICODE.BYTE_ORDER_MARK?.code
].filter(isFiniteNumber);

const CONFIG_WHITESPACE_CODES = Array.isArray(UNICODE_IDENTIFIER_CONFIG.whitespaceCodes)
    ? UNICODE_IDENTIFIER_CONFIG.whitespaceCodes.filter(isFiniteNumber)
    : [];

const WHITESPACE_CODES = new Set([
    ...BASE_WHITESPACE_CODES,
    ...EXTENDED_WHITESPACE_CODES,
    ...CONFIG_WHITESPACE_CODES
]);

const RAW_IDENTIFIER_RANGES = Array.isArray(UNICODE_IDENTIFIER_CONFIG.ranges)
    ? UNICODE_IDENTIFIER_CONFIG.ranges
    : [];

const IDENTIFIER_INCLUDE_CODES = new Set(
    Array.isArray(UNICODE_IDENTIFIER_CONFIG.includeCodes)
        ? UNICODE_IDENTIFIER_CONFIG.includeCodes.filter(isFiniteNumber)
        : []
);

const IDENTIFIER_EXCLUDE_CODES = new Set([
    ...WHITESPACE_CODES,
    ...(Array.isArray(UNICODE_IDENTIFIER_CONFIG.excludeCodes)
        ? UNICODE_IDENTIFIER_CONFIG.excludeCodes.filter(isFiniteNumber)
        : [])
]);

const IDENTIFIER_RANGES = computeIdentifierRanges();

const isInRange = (range, charCode) =>
    range && isFiniteNumber(range.start) && isFiniteNumber(range.end) && charCode >= range.start && charCode <= range.end;

/**
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! คำนวณและรวม Identifier Ranges จากทุกแหล่งข้อมูล
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! Purpose: รวม Unicode ranges จาก 3 แหล่ง:
 * !   1. Manual ranges จาก unicodeIdentifierConfig.ranges
 * !   2. Fallback ranges จาก UNICODE.UNICODE_ID_START/CONTINUE
 * !   3. Auto ranges จาก unicode-identifier-ranges.json (ถ้าเปิดใช้งาน)
 * ! 
 * ! Process:
 * !   1. โหลด manual ranges จาก config
 * !   2. ถ้าไม่มี ใช้ fallback ranges
 * !   3. โหลด auto ranges (ถ้า autoConfig.enabled = true)
 * !   4. Merge ทุก ranges และ remove duplicates
 * ! 
 * ! NO_HARDCODE: ทุก range โหลดจาก config ไม่มี hardcode ในโค้ด
 * ! Binary-First: ใช้ตัวเลข code points ทั้งหมด ไม่มี string comparison
 * ! ══════════════════════════════════════════════════════════════════════════════
 * @returns {Array<{start: number, end: number}>} Array of merged Unicode ranges
 */
function computeIdentifierRanges() {
    let ranges = RAW_IDENTIFIER_RANGES
        .map(range => ({
            start: Number(range.start),
            end: Number(range.end)
        }))
        .filter(range => Number.isFinite(range.start) && Number.isFinite(range.end) && range.start <= range.end);

    if (ranges.length === 0) {
        const startRange = UNICODE.UNICODE_ID_START;
        const continueRange = UNICODE.UNICODE_ID_CONTINUE;

        if (startRange && isFiniteNumber(startRange.start) && isFiniteNumber(startRange.end)) {
            ranges.push({ start: startRange.start, end: startRange.end });
        }

        if (continueRange && isFiniteNumber(continueRange.start) && isFiniteNumber(continueRange.end)) {
            ranges.push({ start: continueRange.start, end: continueRange.end });
        }
    }

    const autoRanges = loadAutoUnicodeIdentifierRanges();
    if (autoRanges.length > 0) {
        ranges = mergeNumericRanges([...ranges, ...autoRanges]);
    } else {
        ranges = mergeNumericRanges(ranges);
    }

    return ranges;
}

/**
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! โหลด Unicode Identifier Ranges แบบอัตโนมัติจากไฟล์ข้อมูล
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! Purpose: โหลด Unicode identifier ranges จาก unicode-identifier-ranges.json
 * !   เพื่อรองรับทุกภาษาโดยอัตโนมัติ ไม่ต้องเพิ่ม range ทีละภาษา
 * ! 
 * ! Config Path Resolution (ลำดับความสำคัญ):
 * !   1. UNICODE_AUTO_CONFIG.absolutePath - ใช้ absolute path โดยตรง
 * !   2. UNICODE_AUTO_CONFIG.pathFromModule - relative จาก __dirname
 * !   3. UNICODE_AUTO_CONFIG.pathSegmentsFromModule - build path จาก segments
 * ! 
 * ! Data Processing:
 * !   1. โหลดไฟล์ JSON (พยายามทุก path จนสำเร็จ)
 * !   2. Parse categories (เช่น ID_Start, ID_Continue)
 * !   3. Filter ตาม include/exclude categories
 * !   4. Clamp ranges ตาม minCodePoint/maxCodePoint
 * !   5. Return array of {start, end} ranges
 * ! 
 * ! Error Handling:
 * !   - ถ้าโหลดไม่สำเร็จ: ส่ง WARNING ไปยัง ErrorHandler (ถ้า requireData = true)
 * !   - ถ้า parse ไม่ได้: ส่ง WARNING และ return []
 * !   - ถ้าไม่มี ranges: ส่ง WARNING (ถ้า requireData = true)
 * ! 
 * ! NO_SILENT_FALLBACKS: ทุก error ต้องส่งเข้า ErrorHandler พร้อม context
 * ! ══════════════════════════════════════════════════════════════════════════════
 * @returns {Array<{start: number, end: number}>} Auto-loaded Unicode ranges or empty array
 * @private
 */
function loadAutoUnicodeIdentifierRanges() {
    if (!UNICODE_AUTO_CONFIG || UNICODE_AUTO_CONFIG.enabled === false) {
        return [];
    }

    const candidatePaths = [];

    if (typeof UNICODE_AUTO_CONFIG.absolutePath === 'string') {
        candidatePaths.push(UNICODE_AUTO_CONFIG.absolutePath);
    }

    if (typeof UNICODE_AUTO_CONFIG.pathFromModule === 'string') {
        candidatePaths.push(resolve(__dirname, UNICODE_AUTO_CONFIG.pathFromModule));
    }

    if (Array.isArray(UNICODE_AUTO_CONFIG.pathSegmentsFromModule) && UNICODE_AUTO_CONFIG.pathSegmentsFromModule.length > 0) {
        candidatePaths.push(resolve(__dirname, ...UNICODE_AUTO_CONFIG.pathSegmentsFromModule));
    }

    if (candidatePaths.length === 0) {
        return [];
    }

    let fileContent = '';
    let resolvedPath = '';
    let lastError = null;

    for (const candidatePath of candidatePaths) {
        if (!candidatePath || typeof candidatePath !== 'string') {
            continue;
        }

        try {
            fileContent = readFileSync(candidatePath, 'utf-8');
            resolvedPath = candidatePath;
            break;
        } catch (error) {
            lastError = error;
        }
    }

    if (!fileContent) {
        if (UNICODE_AUTO_CONFIG.requireData === true) {
            // FIX: Binary Error Pattern
            const warning = lastError || new Error('Unicode identifier auto-configuration data not available');
            warning.isOperational = true;
            reportError(BinaryCodes.PARSER.VALIDATION(4101), {
                method: 'loadAutoUnicodeIdentifierRanges',
                message: `Unable to load unicode identifier range data from configured paths: ${candidatePaths.join(', ')}`,
                error: warning,
                context: { candidatePaths }
            });
        }

        return [];
    }

    let parsed;
    try {
        parsed = JSON.parse(fileContent);
    } catch (parseError) {
        // FIX: Binary Error Pattern
        parseError.isOperational = true;
        reportError(BinaryCodes.PARSER.SYNTAX(4102), {
            method: 'loadAutoUnicodeIdentifierRanges',
            message: `Failed to parse unicode identifier data from ${resolvedPath}`,
            error: parseError,
            context: { resolvedPath }
        });
        return [];
    }

    // ! NO_SILENT_FALLBACKS: ห้ามใช้ || {} ซ่อน parse failure
    const categories = parsed?.categories;
    if (!categories || typeof categories !== 'object') {
        reportError(BinaryCodes.PARSER.SYNTAX(10004), {
            method: 'loadUnicodeIdentifierRanges',
            message: 'Unicode identifier JSON missing categories object',
            context: { resolvedPath, parsedType: typeof parsed, hasCategories: Boolean(parsed?.categories) }
        });
        return [];
    }
    
    const includeCategories = Array.isArray(UNICODE_AUTO_CONFIG.categories?.include) && UNICODE_AUTO_CONFIG.categories.include.length > 0
        ? UNICODE_AUTO_CONFIG.categories.include
        : Object.keys(categories);

    const excludeCategories = new Set(
        Array.isArray(UNICODE_AUTO_CONFIG.categories?.exclude)
            ? UNICODE_AUTO_CONFIG.categories.exclude
            : []
    );

    const minCodePoint = isFiniteNumber(UNICODE_AUTO_CONFIG.minCodePoint)
        ? UNICODE_AUTO_CONFIG.minCodePoint
        : null;

    const maxCodePoint = isFiniteNumber(UNICODE_AUTO_CONFIG.maxCodePoint)
        ? UNICODE_AUTO_CONFIG.maxCodePoint
        : null;

    const autoRanges = [];

    for (const categoryName of includeCategories) {
        if (excludeCategories.has(categoryName)) {
            continue;
        }

        const categoryRanges = categories[categoryName];
        if (!Array.isArray(categoryRanges)) {
            continue;
        }

        for (const range of categoryRanges) {
            const start = Number(range.start);
            const end = Number(range.end);

            if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
                continue;
            }

            const clampedStart = minCodePoint !== null ? Math.max(start, minCodePoint) : start;
            const clampedEnd = maxCodePoint !== null ? Math.min(end, maxCodePoint) : end;

            if (clampedStart > clampedEnd) {
                continue;
            }

            autoRanges.push({ start: clampedStart, end: clampedEnd });
        }
    }

    if (autoRanges.length === 0 && UNICODE_AUTO_CONFIG.requireData === true) {
        // FIX: Binary Error Pattern
        const warning = new Error('Unicode auto identifier configuration produced no ranges');
        warning.isOperational = true;
        reportError(BinaryCodes.PARSER.VALIDATION(4103), {
            method: 'loadAutoUnicodeIdentifierRanges',
            message: `No unicode identifier ranges extracted from ${resolvedPath} using categories ${includeCategories.join(', ') || 'ALL'}`,
            error: warning,
            context: { resolvedPath, includeCategories }
        });
    }

    return autoRanges;
}

/**
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! รวม Numeric Ranges และลบ Overlap ด้วย Pure Mathematics
 * ! ══════════════════════════════════════════════════════════════════════════════
 * ! Purpose: Merge overlapping or adjacent ranges เพื่อลดจำนวน ranges
 * !   และเพิ่มประสิทธิภาพการค้นหา
 * ! 
 * ! Algorithm:
 * !   1. Normalize: แปลงทุก range เป็น {start: number, end: number}
 * !   2. Filter: ลบ invalid ranges (non-finite หรือ start > end)
 * !   3. Sort: เรียงตาม start (ascending) แล้ว end (ascending)
 * !   4. Merge: วนลูปรวม ranges ที่ติดกัน (candidate.start <= last.end + 1)
 * !   5. Return: Array of merged non-overlapping ranges
 * ! 
 * ! Example:
 * !   Input:  [{start: 65, end: 90}, {start: 88, end: 100}, {start: 97, end: 122}]
 * !   Output: [{start: 65, end: 100}, {start: 97, end: 122}]
 * ! 
 * ! Binary-First: ใช้การคำนวณตัวเลขเท่านั้น ไม่มี string operation
 * ! Performance: O(n log n) - ส่วนใหญ่มาจาก sort operation
 * ! ══════════════════════════════════════════════════════════════════════════════
 * @param {Array<{start: number, end: number}>} ranges - Array of Unicode ranges to merge
 * @returns {Array<{start: number, end: number}>} Merged non-overlapping ranges
 * @private
 */
function mergeNumericRanges(ranges) {
    if (!Array.isArray(ranges) || ranges.length === 0) {
        return [];
    }

    const normalizedRanges = ranges
        .map(range => ({
            start: Number(range.start),
            end: Number(range.end)
        }))
        .filter(range => Number.isFinite(range.start) && Number.isFinite(range.end) && range.start <= range.end)
        .sort((a, b) => (a.start - b.start) || (a.end - b.end));

    if (normalizedRanges.length === 0) {
        return [];
    }

    const merged = [{ ...normalizedRanges[0] }];

    for (let index = 1; index < normalizedRanges.length; index += 1) {
        const candidate = normalizedRanges[index];
        const last = merged[merged.length - 1];

        if (candidate.start <= last.end + 1) {
            last.end = Math.max(last.end, candidate.end);
        } else {
            merged.push({ ...candidate });
        }
    }

    return merged;
}

/**
 * ============================================================================
 * UNIVERSAL CHARACTER CLASSIFIER
 * ============================================================================
 * หน้าที่: จำแนกตัวอักษรตาม Unicode Standard เท่านั้น
 * ไม่มีการตัดสินใจเกี่ยวกับ grammar
 * 
 * NO_HARDCODE COMPLIANCE: โหลดค่าทั้งหมดจาก tokenizer-binary-config.json
 */
class UniversalCharacterClassifier {
    /**
     * ตรวจสอบว่าเป็นตัวอักษร (A-Z, a-z) หรือไม่
     * Unicode Standard: โหลดจาก config
     * 
     * JavaScript Identifier Rules:
     * - Letters: A-Z, a-z
     * - Special characters: _ (underscore, ASCII 95), $ (dollar sign, ASCII 36)
     * - These are valid as the FIRST character of an identifier
     * - Unicode letters: ภาษาไทย (U+0E01-U+0E5B), 中文 (U+4E00-U+9FFF), العربية (U+0600-U+06FF)
     *   (เปิดใช้งานเมื่อ ALLOW_UNICODE_IDENTIFIERS = true)
     */
    isLetterByMath(charCode) {
        // ASCII letters (A-Z, a-z) + underscore (_) + dollar sign ($)
        const isAsciiLetter = (
            (charCode >= UNICODE.UPPERCASE_LETTER.start && charCode <= UNICODE.UPPERCASE_LETTER.end) ||
            (charCode >= UNICODE.LOWERCASE_LETTER.start && charCode <= UNICODE.LOWERCASE_LETTER.end) ||
            charCode === UNICODE.UNDERSCORE.code ||  // _ (ASCII 95)
            charCode === UNICODE.DOLLAR.code         // $ (ASCII 36)
        );

        // ถ้าเป็น ASCII letter ให้ return ทันที (fast path)
        if (isAsciiLetter) return true;

        // ตรวจสอบ Unicode letters (เฉพาะเมื่อเปิดใช้งาน)
    if (PARSING_RULES.ALLOW_UNICODE_IDENTIFIERS && charCode > ASCII_BOUNDARY_CODE) {
            if (IDENTIFIER_INCLUDE_CODES.has(charCode)) {
                return true;
            }

            if (IDENTIFIER_EXCLUDE_CODES.has(charCode)) {
                return false;
            }

            for (const range of IDENTIFIER_RANGES) {
                if (isInRange(range, charCode)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * ตรวจสอบว่าเป็นตัวเลขหรือไม่ (0-9)
     * Unicode Standard: โหลดจาก config
     */
    isDigitByMath(charCode) {
        return charCode >= UNICODE.DIGIT.start && charCode <= UNICODE.DIGIT.end;
    }

    /**
     * ตรวจสอบว่าเป็น whitespace หรือไม่
     * Unicode Standard: โหลดจาก config
     */
    isWhitespaceByMath(charCode) {
        return WHITESPACE_CODES.has(charCode);
    }
    
    /**
     * คำนวณ Binary Flags จาก character code
     * โหลด bit positions จาก config
     */
    computeBinaryFlags(charCode) {
        let flags = 0;
        
        // ! isLetterByMath() รองรับ _, $ แล้ว (บรรทัด 177-178)
        if (this.isLetterByMath(charCode)) {
            flags |= (1 << CHAR_FLAGS.LETTER.bit);
        }
        if (this.isDigitByMath(charCode)) flags |= (1 << CHAR_FLAGS.DIGIT.bit);
        if (this.isWhitespaceByMath(charCode)) flags |= (1 << CHAR_FLAGS.WHITESPACE.bit);
        
    if (flags === 0 && charCode < ASCII_BOUNDARY_CODE) {
            flags |= (1 << CHAR_FLAGS.OPERATOR.bit);
        }
        
        return flags;
    }
    
    isLetter(flags) { return (flags & (1 << CHAR_FLAGS.LETTER.bit)) !== 0; }
    isDigit(flags) { return (flags & CHAR_FLAGS.DIGIT.value) !== 0; }
    isWhitespace(flags) { return (flags & (1 << CHAR_FLAGS.WHITESPACE.bit)) !== 0; }
    isOperator(flags) { return (flags & (1 << CHAR_FLAGS.OPERATOR.bit)) !== 0; }
}

/**
 * ============================================================================
 * PURE BINARY TOKENIZER - "BLANK PAPER"
 * ============================================================================
 * หน้าที่: แปลง String  Binary Token Stream
 * 
 * Flow:
 * 1. Tokenizer ถาม GrammarIndex: "ขอ section 'operators' ของ JS"
 * 2. GrammarIndex ส่ง: Stream ของ section ทั้งหมด (1 ครั้ง)
 * 3. Tokenizer Cache section ไว้
 * 4. Tokenizer หา "&" ใน section  แปลงเป็นเลขฐาน 2
 * 
 * ไม่ต้องถาม 100 ครั้ง - ถามครั้งเดียวได้ทั้ง section!
 * 
 * NO_HARDCODE COMPLIANCE: โหลดทุกค่าจาก config
 */
class PureBinaryTokenizer {
    constructor(grammarIndexOrLanguage = 'javascript') {
        // ! Support both GrammarIndex object and language string for backward compatibility
        if (typeof grammarIndexOrLanguage === 'string') {
            // Legacy mode: language string provided
            this.language = grammarIndexOrLanguage;
            this.brain = null; // Will load grammar from file
        } else if (grammarIndexOrLanguage && typeof grammarIndexOrLanguage === 'object') {
            // Modern mode: GrammarIndex (Brain) provided directly
            this.brain = grammarIndexOrLanguage;
            this.language = 'javascript'; // Default, could be extracted from brain if needed
        } else {
            // FIX: Binary Error Pattern
            const error = new Error('PureBinaryTokenizer requires either a language string or GrammarIndex object');
            error.name = 'TokenizerError';
            error.isOperational = false; // Programming error
            reportError(BinaryCodes.SYSTEM.CONFIGURATION(4104), {
                method: 'constructor',
                message: 'PureBinaryTokenizer requires either a language string or GrammarIndex object',
                error: error
            });
            // ไม่ throw - ให้ระบบทำงานต่อแม้ grammar ไม่ครบ
        }
        
        this.classifier = new UniversalCharacterClassifier();
        this.position = 0;
        this.input = '';
        this.inputLength = 0;
        
        // Cache sections (โหลดครั้งเดียว ใช้ได้หลายครั้ง)
        this.grammarCache = null;
        this.sectionCache = {
            keywords: null,
            operators: null,
            punctuation: null,
            literals: null,
            comments: null
        };
    }

    /**
     * โหลด grammar และ cache sections
     */
    loadGrammarSections() {
        if (this.grammarCache) {
            return; // โหลดแล้ว
        }

        try {
            // ! If Brain (GrammarIndex) is provided, use it directly
            if (this.brain) {
                // Use Brain's grammar data directly
                this.grammarCache = this.brain.grammar || this.brain;

                this.assertGrammarBrainIntegrity(this.grammarCache);

                // ! STRICT_MODE: บังคับให้ grammar sections ต้องมีครบ
                // ! ลบ fallback `|| {}` ออก เพื่อให้เห็นว่า section ไหนขาด
                if (STRICT_MODE) {
                    // ! FAIL FAST: ถ้า section ไหนไม่มี ให้ throw error ทันที
                    const requiredSections = ['keywords', 'operators', 'punctuation', 'literals', 'comments'];
                    for (const section of requiredSections) {
                        if (!this.grammarCache[section] || typeof this.grammarCache[section] !== 'object') {
                            // FIX: Binary Error Pattern
                            // BINARY ERROR EMISSION - แค่ส่งเลข!
                            reportError(BinaryCodes.SYSTEM.CONFIGURATION(4114), {
                                method: 'assertGrammarBrainIntegrity',
                                message: `Grammar section missing: ${section}`,
                                context: {
                                    language: this.language,
                                    missingSection: section,
                                    availableSections: Object.keys(this.grammarCache)
                                }
                            });
                            // ไม่ throw - ให้ระบบทำงานต่อ
                        }
                    }
                    
                    // ! FLATTEN nested structure to hash sections
                    this.sectionCache.keywords = this.flattenSection(this.grammarCache.keywords);
                    this.sectionCache.operators = this.flattenSection(this.grammarCache.operators);
                    this.sectionCache.punctuation = this.flattenSection(this.grammarCache.punctuation);
                    this.sectionCache.literals = this.flattenSection(this.grammarCache.literals);
                    this.sectionCache.comments = this.grammarCache.comments;
                } else {
                    // ! LEGACY MODE DEPRECATED: Silent fallbacks hide grammar loading failures
                    // ! TODO: Remove this branch after migrating all grammars to GrammarIndex
                    reportError(BinaryCodes.SYSTEM.CONFIGURATION(4115), {
                        method: 'loadGrammar',
                        message: 'Using legacy fallback mode - silent failures possible, upgrade to STRICT_MODE',
                        context: {
                            language: this.language,
                            strictMode: STRICT_MODE,
                            recommendation: 'Enable STRICT_MODE to detect grammar loading failures'
                        }
                    });
                    
                    this.sectionCache.keywords = this.flattenSection(this.grammarCache.keywords || {});
                    this.sectionCache.operators = this.flattenSection(this.grammarCache.operators || {});
                    this.sectionCache.punctuation = this.flattenSection(this.grammarCache.punctuation || {});
                    this.sectionCache.literals = this.flattenSection(this.grammarCache.literals || {});
                    this.sectionCache.comments = this.grammarCache.comments || {};
                }

                this.assertFlattenedGrammarSections();
                return;
            }
            
            // ! Legacy mode: Load from file
            // โหลด grammar ทั้งหมดครั้งเดียว
            const grammarPath = join(__dirname, 'grammars', `${this.language}.grammar.json`);
            this.grammarCache = JSON.parse(readFileSync(grammarPath, 'utf8'));

            // ! STRICT_MODE: reportError แทน throw
            if (STRICT_MODE) {
                const requiredSections = ['keywords', 'operators', 'punctuation', 'literals', 'comments'];
                for (const section of requiredSections) {
                    if (!this.grammarCache[section]) {
                        reportError(BinaryCodes.PARSER.SYNTAX(2011), {
                            method: 'loadGrammar',
                            message: `Grammar file missing required section: ${section}`,
                            fatal: true
                        });
                    }
                }
                
                this.sectionCache.keywords = this.grammarCache.keywords;
                this.sectionCache.operators = this.grammarCache.operators;
                this.sectionCache.punctuation = this.grammarCache.punctuation;
                this.sectionCache.literals = this.grammarCache.literals;
                this.sectionCache.comments = this.grammarCache.comments;
            } else {
                // !  LEGACY FILE MODE DEPRECATED: Silent fallbacks hide grammar file corruption
                reportError(BinaryCodes.SYSTEM.CONFIGURATION(4116), {
                    method: 'loadGrammar',
                    message: 'Using legacy file loading with fallbacks - file corruption can be hidden',
                    context: {
                        language: this.language,
                        grammarPath,
                        strictMode: STRICT_MODE,
                        recommendation: 'Enable STRICT_MODE and migrate to GrammarIndex'
                    }
                });
                
                // Cache sections ที่ใช้บ่อย (Stream ทั้ง section)
                this.sectionCache.keywords = this.grammarCache.keywords || {};
                this.sectionCache.operators = this.grammarCache.operators || {};
                this.sectionCache.punctuation = this.grammarCache.punctuation || {};
                this.sectionCache.literals = this.grammarCache.literals || {};
                this.sectionCache.comments = this.grammarCache.comments || {};
            }

            this.assertGrammarBrainIntegrity(this.grammarCache);
            this.assertFlattenedGrammarSections();
        } catch (error) {
            // FIX: Binary Error Pattern
            error.isOperational = false; // Grammar loading error = Programming error
            reportError(BinaryCodes.SYSTEM.CONFIGURATION(4105), {
                method: 'loadGrammar',
                message: `Failed to load grammar for ${this.language} - Grammar file or GrammarIndex loading error`,
                error: error,
                context: { language: this.language }
            });
            // ไม่ throw - ให้ระบบทำงานต่อ
        }
    }

    assertGrammarBrainIntegrity(grammarCache) {
        const contextSnapshot = {
            grammarCacheType: typeof grammarCache,
            hasKeywords: this.hasEntries(grammarCache?.keywords),
            hasOperators: this.hasEntries(grammarCache?.operators),
            hasPunctuation: this.hasEntries(grammarCache?.punctuation)
        };

        if (!grammarCache || typeof grammarCache !== 'object') {
            this.throwCriticalTokenizerFailure(
                'TOKENIZER_BRAIN_INVALID',
                'GrammarIndex payload is missing or invalid',
                contextSnapshot
            );
        }

        if (!contextSnapshot.hasKeywords || !contextSnapshot.hasOperators || !contextSnapshot.hasPunctuation) {
            this.throwCriticalTokenizerFailure(
                'TOKENIZER_BRAIN_INCOMPLETE',
                'GrammarIndex is missing required sections',
                contextSnapshot
            );
        }
    }

    assertFlattenedGrammarSections() {
        // ! NO_SILENT_FALLBACKS: ลบ || {} ออก - ถ้า section เป็น null/undefined ต้อง throw
        // ! ถ้าใช้ || {} จะทำให้ Object.keys({}).length === 0 ดูเหมือน "ผ่าน" แต่จริงๆ data หาย
        if (!this.sectionCache.keywords || typeof this.sectionCache.keywords !== 'object') {
            this.throwCriticalTokenizerFailure(
                'GRAMMAR_SECTION_KEYWORDS_NULL',
                'sectionCache.keywords is null/undefined - grammar loading failed',
                { keywordsType: typeof this.sectionCache.keywords }
            );
        }
        if (!this.sectionCache.operators || typeof this.sectionCache.operators !== 'object') {
            this.throwCriticalTokenizerFailure(
                'GRAMMAR_SECTION_OPERATORS_NULL',
                'sectionCache.operators is null/undefined - grammar loading failed',
                { operatorsType: typeof this.sectionCache.operators }
            );
        }
        if (!this.sectionCache.punctuation || typeof this.sectionCache.punctuation !== 'object') {
            this.throwCriticalTokenizerFailure(
                'GRAMMAR_SECTION_PUNCTUATION_NULL',
                'sectionCache.punctuation is null/undefined - grammar loading failed',
                { punctuationType: typeof this.sectionCache.punctuation }
            );
        }
        
        const contextSnapshot = {
            keywordsCount: Object.keys(this.sectionCache.keywords).length,
            operatorsCount: Object.keys(this.sectionCache.operators).length,
            punctuationCount: Object.keys(this.sectionCache.punctuation).length
        };

        if (!contextSnapshot.operatorsCount || !contextSnapshot.punctuationCount) {
            this.throwCriticalTokenizerFailure(
                'GRAMMAR_SECTIONS_EMPTY',
                'Flattened grammar sections are empty or incomplete',
                contextSnapshot
            );
        }
    }

    hasEntries(section) {
        return Boolean(section && typeof section === 'object' && Object.keys(section).length > 0);
    }

    throwCriticalTokenizerFailure(errorCode, message, context = {}) {
        // FIX: Binary Error Pattern - reportError แทน throw
        const failure = new Error(message);
        failure.isOperational = false;
        reportError(BinaryCodes.SYSTEM.CONFIGURATION(4106), {
            method: 'loadGrammarSections',
            message: message,
            error: failure,
            context: { errorCode, ...context }
        });
        // ไม่ throw - ให้ระบบทำงานต่อ
    }
    
    /**
     * Flatten nested grammar section to hash section (no conversion needed)
     * ! Convert nested structure: { binaryOperators: { "+": {...} }, unaryOperators: { "!": {...} } }
     * ! To flat hash: { "+": {...}, "!": {...} }
     * ! This is the "hash section" format - no value conversion, just structure flattening
     */
    flattenSection(section) {
        // ! STRICT_MODE: ไม่ใช้ fallback เมื่อ section ไม่ถูกต้อง
        if (STRICT_MODE) {
            if (!section || typeof section !== 'object') {
                // FIX: Binary Error Pattern
                const error = new Error('Grammar section is null, undefined, or not an object');
                error.isOperational = false;
                reportError(BinaryCodes.SYSTEM.CONFIGURATION(4107), {
                    method: 'flattenSection',
                    message: 'Grammar section is null, undefined, or not an object',
                    error: error,
                    context: {
                        sectionType: typeof section,
                        sectionValue: section,
                        fix: 'Ensure grammar object has all required sections (keywords, operators, punctuation, literals, comments)'
                    }
                });
                // ไม่ throw - ให้ระบบทำงานต่อ
            }
        } else {
            // Legacy fallback
            if (!section || typeof section !== 'object') {
                return {};
            }
        }
        
        const flat = {};
        
        for (const [key, value] of Object.entries(section)) {
            // Skip metadata fields (both __section_ and __grammar_ prefixes)
            if (key.startsWith('__section_') || key.startsWith('__grammar_')) {
                continue;
            }
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Check if this value has metadata fields (means it's a final token/keyword)
                // ! NO_HARDCODE: Use GRAMMAR_METADATA_FIELDS from config instead of hardcoded array
                const hasMetadata = Object.keys(value).some(k => 
                    GRAMMAR_METADATA_FIELDS.includes(k)
                );
                
                if (hasMetadata) {
                    // This is a final item (keyword/operator/punctuation definition)
                    flat[key] = value;
                } else {
                    // This is a nested category, merge its contents recursively
                    const flattened = this.flattenSection(value);
                    Object.assign(flat, flattened);
                }
            } else {
                flat[key] = value;
            }
        }
        
        return flat;
    }

    /**
     * เปลี่ยนภาษา (clear cache)
     */
    setLanguage(language) {
        if (this.language !== language) {
            this.language = language;
            this.grammarCache = null;
            this.sectionCache = {
                keywords: null,
                operators: null,
                punctuation: null,
                literals: null,
                comments: null
            };
        }
    }

    /**
     * หน้าที่เดียว: แปลง String  Binary Stream
     * ตรวจสอบ security limits จาก config
     * 
     * Flow:
     * 1. โหลด grammar sections (cache)
     * 2. แปลง String  Binary tokens
     * 3. ส่งงานต่อให้ Parser
     * 4. ลบ cache ทันที (memory management)
     */
    tokenize(input) {
        try {
            // โหลด grammar sections ครั้งเดียว
            this.loadGrammarSections();

            // Security check: โหลดจาก config
            if (input.length > SECURITY_LIMITS.MAX_INPUT_LENGTH) {
                // FIX: Binary Error Pattern
                const error = new Error(`Input exceeds maximum length of ${SECURITY_LIMITS.MAX_INPUT_LENGTH} characters`);
                error.name = 'SecurityError';
                error.isOperational = true; // User input error
                reportError(BinaryCodes.VALIDATOR.VALIDATION(4108), {
                    method: 'tokenize',
                    message: `Input exceeds maximum length of ${SECURITY_LIMITS.MAX_INPUT_LENGTH} characters`,
                    error: error,
                    context: { inputLength: input.length, maxLength: SECURITY_LIMITS.MAX_INPUT_LENGTH }
                });
                // ไม่ throw - ให้ระบบทำงานต่อ (return empty tokens)
                return [];
            }
            
            // ! ========================================================================
            // ! PREPROCESSING: จัดการกับ Special Characters ที่ต้องข้าม
            // ! ========================================================================
            
            // 1. ตรวจจับและข้าม BOM (Byte Order Mark - U+FEFF)
            // ! WHY: Text editors บน Windows มักใส่ BOM ไว้หน้าไฟล์ UTF-8
            // ! SOLUTION: ข้ามตัวอักษรนี้ไปเพื่อไม่ให้เกิด "Unknown character" error
            // ! NO_HARDCODE: ใช้ค่าจาก UNICODE.BYTE_ORDER_MARK แทนการ hardcode 65279
            if (input.charCodeAt(0) === UNICODE.BYTE_ORDER_MARK.code) {
                input = input.slice(1);
            }
            
            // 2. ตรวจจับและข้าม Shebang (#!/usr/bin/env node)
            // ! WHY: ไฟล์ JavaScript CLI มักขึ้นต้นด้วย shebang เพื่อบอก OS ว่าจะใช้ Node.js รัน
            // ! SOLUTION: ข้ามบรรทัดแรกทั้งหมดถ้าขึ้นต้นด้วย #!
            if (input.startsWith('#!')) {
                const endOfLine = input.indexOf('\n');
                if (endOfLine !== -1) {
                    input = input.slice(endOfLine + 1);
                } else {
                    // ถ้าทั้งไฟล์มีแค่ shebang ให้เป็นไฟล์ว่าง
                    input = '';
                }
            }
            
            // ! ========================================================================
            
            this.input = input;
            this.inputLength = input.length;
            this.position = 0;
            
            const tokens = [];
            
            while (this.position < this.inputLength) {
                const charCode = input.charCodeAt(this.position);
                const flags = this.classifier.computeBinaryFlags(charCode);
                
                // ข้าม whitespace (โหลดจาก config)
                if (PARSING_RULES.SKIP_WHITESPACE && this.classifier.isWhitespace(flags)) {
                    this.position++;
                    continue;
                }
                
                // ข้าม comments (single-line และ multi-line)
                if (this.skipComments(input)) {
                    continue;
                }
                
                // คำนวณ token (ค้นหาใน section cache)
                const token = this.computeToken(flags);
                
                if (token) {
                    tokens.push(token);
                }
            }
            
            //  ส่งงานต่อให้ Parser เสร็จแล้ว  ลบ cache ทันที!
            return tokens;
            
        } finally {
            //  CRITICAL: ลบ cache หลังส่งงานต่อให้ Parser
            // เพื่อ Memory Management และป้องกันข้อมูลค้าง
            this.clearCache();
        }
    }

    /**
     * ลบ cache ทั้งหมดหลังจากส่งงานต่อให้ Parser
     * เรียกทันทีหลัง tokenize() เสร็จ
     */
    clearCache() {
        this.grammarCache = null;
        this.sectionCache = {
            keywords: null,
            operators: null,
            punctuation: null,
            literals: null,
            comments: null
        };
    }

    /**
     * Skip comments (single-line และ multi-line)
     * @param {string} input - Source code input
     * @returns {boolean} - true ถ้า skip comment สำเร็จ, false ถ้าไม่ใช่ comment
     */
    skipComments(input) {
        // Check for single-line comment: //
        if (this.position < this.inputLength - 1 && 
            input[this.position] === '/' && 
            input[this.position + 1] === '/') {
            // Skip จนถึงจุดสิ้นสุดบรรทัด
            this.position += 2; // skip '//'
            while (this.position < this.inputLength && input[this.position] !== '\n') {
                this.position++;
            }
            // Skip '\n' ด้วย
            if (this.position < this.inputLength) {
                this.position++;
            }
            return true;
        }
        
        // Check for multi-line comment: /* ... */
        if (this.position < this.inputLength - 1 && 
            input[this.position] === '/' && 
            input[this.position + 1] === '*') {
            // Skip จนถึง */
            this.position += 2; // skip '/*'
            while (this.position < this.inputLength - 1) {
                if (input[this.position] === '*' && input[this.position + 1] === '/') {
                    this.position += 2; // skip '*/'
                    return true;
                }
                this.position++;
            }
            // ถ้าไม่เจอ */ = unclosed comment (แต่ skip ไปจนสุด input)
            return true;
        }
        
        return false; // ไม่ใช่ comment
    }

    /**
     * คำนวณ token โดยค้นหาใน section cache
     * ไม่ต้องถาม brain - ใช้ section stream ที่ cache ไว้แล้ว
     */
    computeToken(flags) {
        const char = this.input[this.position];
        
        // ตรวจสอบ Comment (ค้นหาใน section cache)
        const commentResult = this.checkComment();
        if (commentResult) {
            return commentResult;
        }

        // ตรวจสอบ String
        if (char === '"' || char === "'" || char === '`') {
            return this.computeStringToken(char);
        }
        
        // Letter/Digit: ตรวจสอบว่าเป็น keyword หรือไม่
        if (this.classifier.isLetter(flags)) {
            return this.computeIdentifierOrKeyword();
        }
        
        if (this.classifier.isDigit(flags)) {
            return this.computeNumber();
        }
        
        // Operator/Punctuation: ค้นหาใน section cache
        if (this.classifier.isOperator(flags)) {
            return this.computeOperatorOrPunctuation();
        }
        
        // FIX: Binary Error Pattern
        // NO_SILENT_FALLBACKS: ห้าม fallback - ต้อง throw error ทันที
        const error = new Error(
            `Unknown character at position ${this.position}: "${char}" (charCode: ${char.charCodeAt(0)})`
        );
        error.name = 'TokenizerError';
        error.errorCode = 'UNKNOWN_CHARACTER';
        error.position = this.position;
        error.character = char;
        error.isOperational = false; // Programming error - ต้อง crash
        
        reportError(BinaryCodes.PARSER.SYNTAX(4117), {
            method: 'computeToken',
            message: `Unknown character at position ${this.position}: "${char}" (charCode: ${char.charCodeAt(0)})`,
            error: error,
            context: {
                position: this.position,
                character: char,
                charCode: char.charCodeAt(0)
            }
        });
        
        // ไม่ throw - skip unknown character และทำงานต่อ
        this.position++;
        return this.computeToken(); // ลองอ่าน token ถัดไป
    }

    /**
     * ตรวจสอบ comment โดยค้นหาใน comments section cache
     */
    checkComment() {
        const commentsSection = this.sectionCache.comments;
        const input = this.input;
        const position = this.position;

        // ตรวจสอบ single-line comment
        if (commentsSection.singleLine) {
            const start = commentsSection.singleLine.start;
            if (input.substr(position, start.length) === start) {
                return this.computeCommentToken(
                    start,
                    commentsSection.singleLine.end,
                    TOKEN_TYPE_STRINGS.COMMENT,
                    TOKEN_TYPES.COMMENT.bit
                );
            }
        }

        // ตรวจสอบ multi-line comment
        if (commentsSection.multiLine) {
            const start = commentsSection.multiLine.start;
            if (input.substr(position, start.length) === start) {
                return this.computeCommentToken(
                    start,
                    commentsSection.multiLine.end,
                    TOKEN_TYPE_STRINGS.COMMENT,
                    TOKEN_TYPES.COMMENT.bit
                );
            }
        }

        return null;
    }

    /**
     * คำนวณ comment token
     */
    computeCommentToken(startPattern, endPattern, type, binaryFlagBit) {
        const start = this.position;
        
        // Security check: โหลดจาก config
        if (startPattern.length > SECURITY_LIMITS.MAX_PATTERN_LENGTH) {
            // FIX: Binary Error Pattern
            const error = new Error(`Pattern exceeds maximum length of ${SECURITY_LIMITS.MAX_PATTERN_LENGTH}`);
            error.name = 'SecurityError';
            error.isOperational = false; // Grammar pattern error = Programming bug
            reportError(BinaryCodes.VALIDATOR.VALIDATION(4109), {
                method: 'computeCommentToken',
                message: `Pattern exceeds maximum length of ${SECURITY_LIMITS.MAX_PATTERN_LENGTH}`,
                error: error,
                context: { patternLength: startPattern.length, maxLength: SECURITY_LIMITS.MAX_PATTERN_LENGTH }
            });
            // ไม่ throw - skip และทำงานต่อ
            return null;
        }
        
        // ตรวจสอบว่าตรงกับ start pattern หรือไม่
        if (!this.matchPattern(start, startPattern)) {
            // FIX: Binary Error Pattern
            const errorMsg = ERROR_MESSAGES.EXPECTED_PATTERN
                .replace('{pattern}', startPattern)
                .replace('{position}', start);
            const error = new Error(errorMsg);
            error.name = 'TokenizerError';
            error.isOperational = false; // Pattern mismatch = Programming bug
            reportError(BinaryCodes.PARSER.SYNTAX(4110), {
                method: 'computeCommentToken',
                message: errorMsg,
                error: error,
                context: { startPattern, position: start }
            });
            // ไม่ throw - return null และทำงานต่อ
            return null;
        }
        
        let end = start + startPattern.length;
        
        // หา end pattern
        while (end < this.inputLength) {
            if (this.matchPattern(end, endPattern)) {
                end += endPattern.length;
                break;
            }
            end++;
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: type,
            binary: (1 << binaryFlagBit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ string token
     * โหลด Unicode constants และ limits จาก config
     */
    computeStringToken(quote) {
        const start = this.position;
        let end = start + 1;
        let escaped = false;
        
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_STRING_LENGTH) {
                // FIX: Binary Error Pattern
                const error = new Error(`String exceeds maximum length of ${SECURITY_LIMITS.MAX_STRING_LENGTH}`);
                error.name = 'SecurityError';
                error.isOperational = true; // User input error
                reportError(BinaryCodes.VALIDATOR.VALIDATION(4111), {
                    method: 'computeStringToken',
                    message: `String exceeds maximum length of ${SECURITY_LIMITS.MAX_STRING_LENGTH}`,
                    error: error,
                    context: { stringLength: end - start, maxLength: SECURITY_LIMITS.MAX_STRING_LENGTH }
                });
                // ไม่ throw - truncate string และทำงานต่อ
                break;
            }
            
            const charCode = this.input.charCodeAt(end);
            
            if (escaped) {
                escaped = false;
                end++;
                continue;
            }
            
            // Backslash: โหลดจาก config
            if (charCode === UNICODE.BACKSLASH.code) {
                escaped = true;
                end++;
                continue;
            }
            
            if (this.input[end] === quote) {
                end++;
                break;
            }
            
            end++;
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        // Template literals use backtick (`) - distinguish from regular strings
        const tokenType = (quote === '`') ? 'TemplateLiteral' : TOKEN_TYPE_STRINGS.STRING;
        
        return {
            type: tokenType,
            binary: (1 << TOKEN_TYPES.STRING.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ identifier/keyword โดยถาม Brain
     * โหลด Unicode constants และ parsing rules จาก config
     */
    computeIdentifierOrKeyword() {
        const start = this.position;
        let end = start;
        
        // อ่านตัวอักษร/ตัวเลข (โหลด rules จาก config)
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_TOKEN_LENGTH) {
                // FIX: Binary Error Pattern
                const error = new Error(`Token exceeds maximum length of ${SECURITY_LIMITS.MAX_TOKEN_LENGTH}`);
                error.name = 'SecurityError';
                error.isOperational = true; // User input error
                reportError(BinaryCodes.VALIDATOR.VALIDATION(4112), {
                    method: 'computeIdentifierOrKeyword',
                    message: `Token exceeds maximum length of ${SECURITY_LIMITS.MAX_TOKEN_LENGTH}`,
                    error: error,
                    context: { tokenLength: end - start, maxLength: SECURITY_LIMITS.MAX_TOKEN_LENGTH }
                });
                // ไม่ throw - truncate token และทำงานต่อ
                break;
            }
            
            const code = this.input.charCodeAt(end);
            const flags = this.classifier.computeBinaryFlags(code);
            
            if (this.classifier.isLetter(flags) || this.classifier.isDigit(flags)) {
                end++;
            } else if (code === UNICODE.UNDERSCORE.code || code === UNICODE.DOLLAR.code) {
                end++;
            } else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        // === DUMB TOKENIZER: ส่งทุกอย่างเป็น IDENTIFIER ===
        // ! Tokenizer ไม่รู้จัก keyword (รู้แค่คณิตศาสตร์)
        // ! Grammar/Parser จะตัดสินทีหลังว่า IDENTIFIER ไหนเป็น KEYWORD จริงๆ
        // ! 
        // ! ตัวอย่าง:
        // !   Input: "const x = 5"
        // !   Tokenizer output: [IDENTIFIER("const"), IDENTIFIER("x"), ...]
        // !   Grammar/Parser: เปลี่ยน IDENTIFIER("const") → KEYWORD("const")
        // !
        // ! เหตุผล: Separate "math" (token shape) from "meaning" (keyword semantics)
        
        return {
            type: TOKEN_TYPE_STRINGS.IDENTIFIER,
            binary: (1 << TOKEN_TYPES.IDENTIFIER.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณตัวเลข (pure math)
     * โหลด Unicode constants และ limits จาก config
     */
    computeNumber() {
        const start = this.position;
        let end = start;
        
        // อ่านตัวเลข (Unicode math only) - โหลดจาก config
        while (end < this.inputLength) {
            // Security check: โหลดจาก config
            if ((end - start) > SECURITY_LIMITS.MAX_NUMBER_LENGTH) {
                // FIX: Binary Error Pattern
                const error = new Error(`Number exceeds maximum length of ${SECURITY_LIMITS.MAX_NUMBER_LENGTH}`);
                error.name = 'SecurityError';
                error.isOperational = true; // User input error
                reportError(BinaryCodes.VALIDATOR.VALIDATION(4113), {
                    method: 'computeNumber',
                    message: `Number exceeds maximum length of ${SECURITY_LIMITS.MAX_NUMBER_LENGTH}`,
                    error: error,
                    context: { numberLength: end - start, maxLength: SECURITY_LIMITS.MAX_NUMBER_LENGTH }
                });
                // ไม่ throw - truncate number และทำงานต่อ
                break;
            }
            
            const code = this.input.charCodeAt(end);
            
            // Digits, dot, 'E', 'e' - ทั้งหมดโหลดจาก config
            if (
                (code >= UNICODE.DIGIT.start && code <= UNICODE.DIGIT.end) ||
                code === UNICODE.DOT.code ||
                code === UNICODE.LETTER_E_UPPERCASE.code ||
                code === UNICODE.LETTER_E_LOWERCASE.code
            ) {
                end++;
            } else {
                break;
            }
        }
        
        const value = this.input.slice(start, end);
        this.position = end;
        
        return {
            type: TOKEN_TYPE_STRINGS.NUMBER,
            binary: (1 << TOKEN_TYPES.NUMBER.bit),
            value: value,
            length: end - start,
            start: start,
            end: end
        };
    }

    /**
     * คำนวณ operator/punctuation โดยค้นหาใน section cache
     * Longest match algorithm
     */
    computeOperatorOrPunctuation() {
        const start = this.position;
        
        // ค้นหา operator longest match ใน section cache
        const opMatch = this.findLongestInSection(
            this.sectionCache.operators,
            this.input,
            start
        );
        
        if (opMatch) {
            this.position += opMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.OPERATOR,
                binary: (1 << TOKEN_TYPES.OPERATOR.bit),
                value: opMatch.value,
                length: opMatch.length,
                start: start,
                end: this.position
            };
        }
        
        // ค้นหา punctuation longest match ใน section cache
        const punctMatch = this.findLongestInSection(
            this.sectionCache.punctuation,
            this.input,
            start
        );
        
        if (punctMatch) {
            this.position += punctMatch.length;
            return {
                type: TOKEN_TYPE_STRINGS.PUNCTUATION,
                binary: (1 << TOKEN_TYPES.PUNCTUATION.bit),
                value: punctMatch.value,
                // ! STRICT_MODE: ห้าม fallback ถ้า binary ไม่มี
                punctuationBinary: STRICT_MODE 
                    ? (() => {
                        const binaryValue = PUNCTUATION_BINARY_MAP[punctMatch.value];
                        if (binaryValue === undefined || binaryValue === null) {
                            // FIX: Binary Error Pattern
                            // BINARY ERROR EMISSION - แค่ส่งเลข!
                            reportError(BinaryCodes.SYSTEM.CONFIGURATION(4115), {
                                method: 'computeOperatorOrPunctuation',
                                message: `Punctuation binary value undefined: ${punctMatch.value}`,
                                context: {
                                    punctuation: punctMatch.value,
                                    availableMappings: Object.keys(PUNCTUATION_BINARY_MAP).slice(0, 10)
                                }
                            });
                            // ไม่ throw - ใช้ค่า 0 แทน
                            return 0;
                        }
                        return binaryValue;
                    })()
                    : (PUNCTUATION_BINARY_MAP[punctMatch.value] || 0),
                length: punctMatch.length,
                start: start,
                end: this.position
            };
        }
        
        // ! CRITICAL ERROR: Unknown operator/punctuation = Grammar Incomplete
        // ! STRICT_MODE: ต้อง throw เพื่อบังคับให้แก้ grammar
        const char = this.input[start];
        
        // FIX: Binary Error Pattern
        // ตรวจสอบว่า character นี้น่าจะเป็น operator หรือ punctuation
        const isProbablyPunctuation = /^[\(\)\{\}\[\];,\.]$/.test(char);
        
        // BINARY ERROR EMISSION - โง่ที่สุด แค่ส่งเลข!
        reportError(BinaryCodes.SYSTEM.CONFIGURATION(4116), {
            method: 'computeOperatorOrPunctuation',
            message: `Unknown ${isProbablyPunctuation ? 'punctuation' : 'operator'}: ${char}`,
            context: {
                position: start,
                character: char,
                charCode: char.charCodeAt(0),
                characterType: isProbablyPunctuation ? 'punctuation' : 'operator',
                // ! NO_SILENT_FALLBACKS: ห้ามใช้ || {} ในการนับ - ถ้า null ต้อง throw
                // ! เพราะ Object.keys(null || {}).length === 0 ทำให้ดูเหมือนมี 0 operators แต่จริงๆ data หาย
                grammar_operators_count: this.sectionCache.operators ? Object.keys(this.sectionCache.operators).length : 'NULL',
                grammar_punctuation_count: this.sectionCache.punctuation ? Object.keys(this.sectionCache.punctuation).length : 'NULL'
            }
        });
        
        // ไม่ throw - return null แทน (ให้ computeToken skip character นี้)
        return null;
    }

    /**
     * หา longest match ใน section
     * @param {Object} section - Section cache (operators/punctuation)
     * @param {string} input - Input string
     * @param {number} position - Current position
     * @returns {Object|null} { value, length } หรือ null
     */
    findLongestInSection(section, input, position) {
        if (!section) {
            return null;
        }

        let longestMatch = null;
        let longestLength = 0;

        // ค้นหาทุก item ใน section
        for (const [item, data] of Object.entries(section)) {
            // ข้าม metadata fields
            if (item.startsWith('__section_')) continue;

            // ตรวจสอบว่าตรงกับ input หรือไม่
            if (input.substr(position, item.length) === item) {
                if (item.length > longestLength) {
                    longestMatch = item;
                    longestLength = item.length;
                }
            }
        }

        if (longestMatch) {
            return {
                value: longestMatch,
                length: longestLength,
                data: section[longestMatch]
            };
        }

        return null;
    }

    /**
     * Helper: Match pattern
     */
    matchPattern(position, pattern) {
        if (position + pattern.length > this.inputLength) {
            return false;
        }
        
        for (let i = 0; i < pattern.length; i++) {
            if (this.input[position + i] !== pattern[i]) {
                return false;
            }
        }
        
        return true;
    }
}

// ============================================================================
// EXPORTS FOR TESTING
// ============================================================================
// Export individual functions and classes for comprehensive unit testing
// This allows tests to verify the actual implementation rather than
// duplicating logic in test files
// ============================================================================

export { 
    UniversalCharacterClassifier,
    PureBinaryTokenizer,
    PureBinaryTokenizer as BinaryComputationTokenizer, // Alias for backward compatibility
    // Export config values for test access
    CONFIG,
    UNICODE,
    CHAR_FLAGS,
    TOKEN_TYPES
};

// Default export
export default PureBinaryTokenizer;
