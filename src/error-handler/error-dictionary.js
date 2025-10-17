// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Error Dictionary - Master Decoder for Error Codes
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Purpose: "พจนานุกรมแปลรหัส Error"
// ! Maps binary error codes  human-readable messages, explanations, and fixes
// ! Supports bilingual output (Thai/English)
// ! ══════════════════════════════════════════════════════════════════════════════

import { RULE_IDS } from '../constants/rule-constants.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! System Error Codes (Non-Rule Errors)
// ! ══════════════════════════════════════════════════════════════════════════════
export const SYSTEM_ERROR_CODES = Object.freeze({
    UNKNOWN_ERROR: 0,
    FILE_NOT_FOUND: 1,
    FILE_READ_ERROR: 2,
    FILE_WRITE_ERROR: 3,
    PARSE_ERROR: 4,
    INVALID_SYNTAX: 5,
    MISSING_TRY_CATCH: 6,
    UNEXPECTED_TOKEN: 7,
    VALIDATION_FAILED: 8,
    SECURITY_VIOLATION: 9,
    CONFIGURATION_ERROR: 10
});

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Rule Error Dictionary - Maps RULE_IDS to human-readable content
// ! ══════════════════════════════════════════════════════════════════════════════
export const RULE_ERROR_DICTIONARY = Object.freeze({
    [RULE_IDS.NO_MOCKING]: {
        message: {
            th: "พบการใช้ Mock/Stub/Spy ที่ต้องห้าม",
            en: "Forbidden Mock/Stub/Spy usage detected"
        },
        explanation: {
            th: "การใช้ jest.mock(), sinon.stub() หรือ mocking libraries อื่นๆ ละเมิดกฎ NO_MOCKING ซึ่งบังคับให้ใช้ Dependency Injection แทน เพื่อให้ทดสอบกับ component จริง ไม่ใช่ mock ปลอม",
            en: "Using jest.mock(), sinon.stub() or other mocking libraries violates NO_MOCKING rule which enforces Dependency Injection instead, ensuring tests run against real components, not fake mocks"
        },
        fix: {
            th: "ลบ jest.mock(), sinon.stub() ออก และปรับโค้ดให้ใช้ Dependency Injection โดยส่ง dependencies ผ่าน constructor หรือ function parameters แทน",
            en: "Remove jest.mock(), sinon.stub() and refactor code to use Dependency Injection by passing dependencies through constructor or function parameters instead"
        }
    },

    [RULE_IDS.NO_HARDCODE]: {
        message: {
            th: "พบค่าคงที่ที่ Hardcode ในโค้ด",
            en: "Hardcoded values detected in code"
        },
        explanation: {
            th: "การ hardcode URL, API keys, configuration values หรือค่าคงที่ใดๆ ละเมิดกฎ NO_HARDCODE ซึ่งบังคับให้แยก configuration ออกจาก code เพื่อความยืดหยุ่นและความปลอดภัย",
            en: "Hardcoding URLs, API keys, configuration values or any constants violates NO_HARDCODE rule which enforces separation of configuration from code for flexibility and security"
        },
        fix: {
            th: "ย้ายค่าคงที่ไปเก็บใน config file (.env, config.json) หรือรับผ่าน environment variables และโหลดเข้ามาใช้แทน",
            en: "Move constants to config files (.env, config.json) or receive via environment variables and load them instead"
        }
    },

    [RULE_IDS.NO_SILENT_FALLBACKS]: {
        message: {
            th: "พบการใช้ Fallback ที่เงียบเกินไป",
            en: "Silent fallback detected"
        },
        explanation: {
            th: "การ return ค่า default ใน catch block โดยไม่มีการ log error ละเมิดกฎ NO_SILENT_FALLBACKS ซึ่งบังคับให้ทุก error ต้องถูก log หรือ throw ต่อไป ไม่ให้ซ่อนปัญหา",
            en: "Returning default values in catch blocks without logging errors violates NO_SILENT_FALLBACKS rule which enforces all errors must be logged or thrown, never silently hidden"
        },
        fix: {
            th: "เพิ่ม errorHandler.handleError(error) ใน catch block ก่อน return ค่า default หรือ throw error ต่อไปแทน",
            en: "Add errorHandler.handleError(error) in catch block before returning default value or throw the error instead"
        }
    },

    [RULE_IDS.NO_INTERNAL_CACHING]: {
        message: {
            th: "พบการสร้าง Cache ภายในฟังก์ชัน",
            en: "Internal caching detected in function"
        },
        explanation: {
            th: "การสร้าง internal cache หรือ memoization ภายในฟังก์ชันละเมิดกฎ NO_INTERNAL_CACHING ซึ่งบังคับให้ฟังก์ชันเป็น pure function และให้ caching เป็นหน้าที่ของ external layer",
            en: "Creating internal cache or memoization inside functions violates NO_INTERNAL_CACHING rule which enforces functions to be pure and delegates caching to external layers"
        },
        fix: {
            th: "ลบตัวแปร cache ภายในฟังก์ชันออก และใช้ external caching layer (Decorator Pattern, Redis) แทน",
            en: "Remove internal cache variables and use external caching layer (Decorator Pattern, Redis) instead"
        }
    },

    [RULE_IDS.NO_EMOJI]: {
        message: {
            th: "พบการใช้ Emoji ในโค้ด",
            en: "Emoji usage detected in code"
        },
        explanation: {
            th: "การใช้ emoji characters ในซอร์สโค้ดละเมิดกฎ NO_EMOJI ซึ่งบังคับให้ใช้ plain text เท่านั้น เพื่อป้องกันปัญหา encoding, searchability และ portability",
            en: "Using emoji characters in source code violates NO_EMOJI rule which enforces plain text only to prevent encoding, searchability and portability issues"
        },
        fix: {
            th: "แทนที่ emoji ด้วยคำอธิบายแบบ plain text เช่น แทนที่  ด้วย 'SUCCESS' หรือ 'PASSED'",
            en: "Replace emoji with plain text descriptions e.g. replace  with 'SUCCESS' or 'PASSED'"
        }
    },

    [RULE_IDS.NO_STRING]: {
        message: {
            th: "พบการเปรียบเทียบ String ในตรรกะหลัก",
            en: "String comparison detected in core logic"
        },
        explanation: {
            th: "การเปรียบเทียบ string ใน tokenizer/parser/analyzer ละเมิดกฎ NO_STRING ซึ่งบังคับให้ใช้ binary flags และ numeric identifiers แทน เพื่อประสิทธิภาพและความแม่นยำ",
            en: "String comparison in tokenizer/parser/analyzer violates NO_STRING rule which enforces binary flags and numeric identifiers instead for performance and accuracy"
        },
        fix: {
            th: "แทนที่การเปรียบเทียบ string ด้วย binary/numeric comparison โดยใช้ constants จาก constants.js",
            en: "Replace string comparison with binary/numeric comparison using constants from constants.js"
        }
    },

    [RULE_IDS.NO_CONSOLE]: {
        message: {
            th: "พบการใช้ console.log/error/warn",
            en: "console.log/error/warn usage detected"
        },
        explanation: {
            th: "การใช้ console.* โดยตรงละเมิดกฎ NO_CONSOLE ซึ่งบังคับให้ใช้ centralized error handler แทน เพื่อให้ log มีมาตรฐานและควบคุมได้",
            en: "Direct console.* usage violates NO_CONSOLE rule which enforces centralized error handler instead for standardized and controllable logging"
        },
        fix: {
            th: "แทนที่ console.* ด้วย errorHandler.handleError() สำหรับ errors และใช้ logger module สำหรับ info/debug",
            en: "Replace console.* with errorHandler.handleError() for errors and use logger module for info/debug"
        }
    },

    [RULE_IDS.BINARY_AST_ONLY]: {
        message: {
            th: "พบการใช้ Object AST แทน Binary AST",
            en: "Object AST usage detected instead of Binary AST"
        },
        explanation: {
            th: "การใช้ parser.parse() ที่คืน object AST หรือการเข้าถึง node.children/.type โดยตรงละเมิดกฎ BINARY_AST_ONLY ซึ่งบังคับให้ใช้ binary AST buffer แทน เพื่อประสิทธิภาพหน่วยความจำ",
            en: "Using parser.parse() that returns object AST or accessing node.children/.type directly violates BINARY_AST_ONLY rule which enforces binary AST buffer instead for memory efficiency"
        },
        fix: {
            th: "แทนที่ parser.parse() ด้วย binary AST helpers (decodeNodeTable, iterateBinaryAst) และใช้ binary operations แทนการ dot-access",
            en: "Replace parser.parse() with binary AST helpers (decodeNodeTable, iterateBinaryAst) and use binary operations instead of dot-access"
        }
    },

    [RULE_IDS.STRICT_COMMENT_STYLE]: {
        message: {
            th: "พบคอมเมนต์ที่ไม่ตรงมาตรฐาน",
            en: "Non-standard comment style detected"
        },
        explanation: {
            th: "คอมเมนต์ที่ไม่ขึ้นต้นด้วย '// !' หรือการใช้ block comment ละเมิดกฎ STRICT_COMMENT_STYLE ซึ่งบังคับให้ทุกคอมเมนต์ใช้รูปแบบมาตรฐาน เพื่อให้ตรวจสอบและ audit ได้ง่าย",
            en: "Comments not starting with '// !' or using block comments violate STRICT_COMMENT_STYLE rule which enforces standard comment format for easy review and auditing"
        },
        fix: {
            th: "แก้ไขคอมเมนต์ให้ขึ้นต้นด้วย '// !' และลบ block comment (/* */) ออกทั้งหมด",
            en: "Modify comments to start with '// !' and remove all block comments (/* */)"
        }
    },

    [RULE_IDS.MUST_HANDLE_ERRORS]: {
        message: {
            th: "พบฟังก์ชัน async ที่ไม่มี error handling",
            en: "Async function without error handling detected"
        },
        explanation: {
            th: "ฟังก์ชัน async ที่ไม่มี try...catch ละเมิดกฎ MUST_HANDLE_ERRORS ซึ่งบังคับให้ทุก async function ต้องมี error handling เพื่อป้องกัน unhandled promise rejection",
            en: "Async functions without try...catch violate MUST_HANDLE_ERRORS rule which enforces all async functions must have error handling to prevent unhandled promise rejections"
        },
        fix: {
            th: "ครอบโค้ดทั้งหมดด้วย try...catch และส่ง error ไปยัง errorHandler.handleError() ในบล็อก catch",
            en: "Wrap all code with try...catch and forward errors to errorHandler.handleError() in catch block"
        }
    }
});

// ! ══════════════════════════════════════════════════════════════════════════════
// ! System Error Dictionary - Maps SYSTEM_ERROR_CODES to human-readable content
// ! ══════════════════════════════════════════════════════════════════════════════
export const SYSTEM_ERROR_DICTIONARY = Object.freeze({
    [SYSTEM_ERROR_CODES.UNKNOWN_ERROR]: {
        message: {
            th: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
            en: "Unknown error occurred"
        },
        explanation: {
            th: "ระบบพบข้อผิดพลาดที่ไม่สามารถระบุประเภทได้ อาจเป็น error ที่ไม่ได้ถูกจัดหมวดหมู่ไว้",
            en: "System encountered an error that cannot be categorized, possibly an uncategorized error type"
        },
        fix: {
            th: "ตรวจสอบ stack trace และเพิ่ม error type ใหม่ใน error dictionary ถ้าจำเป็น",
            en: "Check stack trace and add new error type to error dictionary if needed"
        }
    },

    [SYSTEM_ERROR_CODES.FILE_NOT_FOUND]: {
        message: {
            th: "ไม่พบไฟล์ที่ระบุ",
            en: "File not found"
        },
        explanation: {
            th: "ระบบไม่สามารถค้นหาไฟล์ที่ระบุได้ อาจเป็นเพราะไฟล์ถูกลบ ย้าย หรือ path ไม่ถูกต้อง",
            en: "System cannot locate the specified file, possibly because it was deleted, moved, or path is incorrect"
        },
        fix: {
            th: "ตรวจสอบว่าไฟล์มีอยู่จริงและ path ถูกต้อง หรือสร้างไฟล์ใหม่ถ้าจำเป็น",
            en: "Verify that file exists and path is correct, or create new file if needed"
        }
    },

    [SYSTEM_ERROR_CODES.FILE_READ_ERROR]: {
        message: {
            th: "ไม่สามารถอ่านไฟล์ได้",
            en: "Cannot read file"
        },
        explanation: {
            th: "ระบบไม่สามารถอ่านข้อมูลจากไฟล์ได้ อาจเป็นเพราะไม่มีสิทธิ์ หรือไฟล์เสียหาย",
            en: "System cannot read data from file, possibly due to permission issues or corrupted file"
        },
        fix: {
            th: "ตรวจสอบสิทธิ์การเข้าถึงไฟล์และความสมบูรณ์ของไฟล์",
            en: "Check file access permissions and file integrity"
        }
    },

    [SYSTEM_ERROR_CODES.FILE_WRITE_ERROR]: {
        message: {
            th: "ไม่สามารถเขียนไฟล์ได้",
            en: "Cannot write file"
        },
        explanation: {
            th: "ระบบไม่สามารถเขียนข้อมูลลงไฟล์ได้ อาจเป็นเพราะไม่มีสิทธิ์ หรือพื้นที่เต็ม",
            en: "System cannot write data to file, possibly due to permission issues or disk full"
        },
        fix: {
            th: "ตรวจสอบสิทธิ์การเขียนและพื้นที่ว่างบน disk",
            en: "Check write permissions and available disk space"
        }
    },

    [SYSTEM_ERROR_CODES.PARSE_ERROR]: {
        message: {
            th: "ไม่สามารถ parse โค้ดได้",
            en: "Cannot parse code"
        },
        explanation: {
            th: "Parser ไม่สามารถแปลง source code เป็น AST ได้ อาจเป็นเพราะ syntax error",
            en: "Parser cannot convert source code to AST, possibly due to syntax errors"
        },
        fix: {
            th: "ตรวจสอบ syntax ของโค้ดและแก้ไข syntax errors",
            en: "Check code syntax and fix syntax errors"
        }
    },

    [SYSTEM_ERROR_CODES.INVALID_SYNTAX]: {
        message: {
            th: "ไวยากรณ์ไม่ถูกต้อง",
            en: "Invalid syntax"
        },
        explanation: {
            th: "โค้ดมี syntax ที่ไม่ถูกต้องตามไวยากรณ์ของภาษา",
            en: "Code contains syntax that violates language grammar rules"
        },
        fix: {
            th: "แก้ไข syntax ให้ถูกต้องตามมาตรฐานของภาษา",
            en: "Fix syntax to comply with language standards"
        }
    },

    [SYSTEM_ERROR_CODES.MISSING_TRY_CATCH]: {
        message: {
            th: "ฟังก์ชัน async ไม่มี try...catch ครอบ",
            en: "Async function missing try...catch block"
        },
        explanation: {
            th: "ทุก async function หรือ method ต้องมี try...catch ครอบ เพื่อป้องกัน unhandled promise rejection ที่เป็นระเบิดเวลา",
            en: "All async functions or methods must have try...catch blocks to prevent unhandled promise rejections that are time bombs"
        },
        fix: {
            th: "ครอบโค้ดทั้งหมดภายในฟังก์ชันด้วยบล็อก try...catch และส่งต่อไปยัง errorHandler.handleError ในบล็อก catch",
            en: "Wrap all code inside function with try...catch block and forward to errorHandler.handleError in catch block"
        }
    },

    [SYSTEM_ERROR_CODES.UNEXPECTED_TOKEN]: {
        message: {
            th: "พบ token ที่ไม่คาดคิด",
            en: "Unexpected token found"
        },
        explanation: {
            th: "Parser พบ token ที่ไม่คาดหวังในตำแหน่งนี้ อาจเป็นเพราะขาดเครื่องหมาย semicolon, bracket หรือมีตัวอักษรผิด",
            en: "Parser encountered a token that was not expected at this position, possibly due to missing semicolons, brackets or typos"
        },
        fix: {
            th: "ตรวจสอบ syntax หา typo หรือเครื่องหมายที่หายไป เช่น semicolons หรือ brackets",
            en: "Check syntax for typos or missing characters like semicolons or brackets"
        }
    },

    [SYSTEM_ERROR_CODES.VALIDATION_FAILED]: {
        message: {
            th: "การตรวจสอบล้มเหลว",
            en: "Validation failed"
        },
        explanation: {
            th: "โค้ดไม่ผ่านการตรวจสอบตามกฎที่กำหนด",
            en: "Code failed validation against defined rules"
        },
        fix: {
            th: "ตรวจสอบและแก้ไขตามข้อความ error ที่ระบุ",
            en: "Review and fix issues according to error messages"
        }
    },

    [SYSTEM_ERROR_CODES.SECURITY_VIOLATION]: {
        message: {
            th: "พบการละเมิดความปลอดภัย",
            en: "Security violation detected"
        },
        explanation: {
            th: "โค้ดมีส่วนที่อาจเป็นอันตรายต่อความปลอดภัย",
            en: "Code contains potentially dangerous security issues"
        },
        fix: {
            th: "ลบหรือแก้ไขโค้ดที่เป็นอันตรายตามคำแนะนำ",
            en: "Remove or fix dangerous code according to recommendations"
        }
    },

    [SYSTEM_ERROR_CODES.CONFIGURATION_ERROR]: {
        message: {
            th: "การตั้งค่าไม่ถูกต้อง",
            en: "Configuration error"
        },
        explanation: {
            th: "ไฟล์ config หรือการตั้งค่ามีปัญหา",
            en: "Configuration file or settings have issues"
        },
        fix: {
            th: "ตรวจสอบและแก้ไขไฟล์ config ให้ถูกต้อง",
            en: "Review and fix configuration file"
        }
    }
});

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Helper function to resolve error message by code and language
// ! ══════════════════════════════════════════════════════════════════════════════
export function resolveErrorMessage(errorCode, errorType = 'rule', language = 'en') {
    const dictionary = errorType === 'rule' ? RULE_ERROR_DICTIONARY : SYSTEM_ERROR_DICTIONARY;
    const entry = dictionary[errorCode];
    
    if (!entry) {
        return {
            message: language === 'th' ? 'ไม่พบข้อมูล error นี้' : 'Error information not found',
            explanation: language === 'th' ? 'ระบบไม่มีข้อมูลสำหรับ error code นี้' : 'System has no information for this error code',
            fix: language === 'th' ? 'ติดต่อทีมพัฒนา' : 'Contact development team'
        };
    }
    
    return {
        message: entry.message[language] || entry.message.en,
        explanation: entry.explanation[language] || entry.explanation.en,
        fix: entry.fix[language] || entry.fix.en
    };
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Export all for easy access
// ! ══════════════════════════════════════════════════════════════════════════════
export default {
    SYSTEM_ERROR_CODES,
    RULE_ERROR_DICTIONARY,
    SYSTEM_ERROR_DICTIONARY,
    resolveErrorMessage
};
