// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================

// ! ======================================================================
// ! ABSOLUTE RULES CONFIGURATION
// ! กฎเหล็กทั้ง 7 ข้อ พร้อมรายละเอียดครบถ้วน
// ! ======================================================================
// ! ======================================================================
// ! ABSOLUTE RULES DEFINITION - 7 กฎเหล็กของ Chahuadev
// ! ======================================================================
import errorHandler from '../error-handler/ErrorHandler.js';

const ABSOLUTE_RULES = {
// ! ======================================================================
// ! NO_STRING - ห้ามใช้ String Comparison ในตรรกะหลัก (กฎเหล็กข้อที่ 6)
// ! ======================================================================
	NO_STRING: {
		id: 'NO_STRING',
		name: { 
                en: 'No String Comparison in Core Logic', 
                th: 'ห้ามใช้การเปรียบเทียบสตริงในตรรกะหลัก' 
              },
		description: { 
                       en: 'Avoid comparing raw strings inside tokenizer, parser, or analyzer hot paths; rely on binary flags and numeric identifiers from constants.js.', 
                       th: 'ห้ามเปรียบเทียบสตริงดิบใน tokenizer, parser หรือ analyzer ที่รันบ่อย ให้ใช้แฟลกไบนารีและรหัสตัวเลขจาก constants.js แทน' 
                    },
		explanation: { 
                       en: 'ABSOLUTE PHILOSOPHY: "BINARY-FIRST 100% - ZERO AMBIGUITY"\nQUESTION 01: Why are raw strings banned in hot paths?\nANSWER: Every comparison scans characters O(n), creates temporary strings, and breaks with invisible Unicode variants; binary codes are O(1) and immune to hidden differences.\nQUESTION 02: What happens after locale, encoding, or runtime upgrades?\nANSWER: toLowerCase(), localeCompare(), and ICU tables update per build; the same code returns different answers across en-US, th-TH, or cloud containers, leading to inconsistent ASTs.\nQUESTION 03: How do binary identifiers eliminate the risk?\nANSWER: Bit masks map 1:1 to machine instructions, stored in constants.js; changing a rule ID flips one number and instantly synchronises every consumer via imports.\nQUESTION 04: Can tests catch string mistakes early?\nANSWER: No. Typo like "KEYWROD" still passes lint, reviewers miss it, prod breaks silently; numeric enums throw immediately because invalid codes are out of range.\nQUESTION 05: What is the quantifiable cost when strings remain?\nANSWER: Profiling on 10k files shows tokenizer loops 40-80x slower, branch misprediction 3x higher, and GC churn from short-lived strings; binary flags remove all three.\nQUESTION 06: Why can\'t we make an exception for small helpers?\nANSWER: Hot-path helpers reuse the same compare logic; one exception becomes copy-paste debt. Binary constants guarantee every new helper is safe by construction.\nDIAGNOSTIC CHECKLIST: (1) Runs per token/node/statement? must be numeric. (2) Could casing, spelling, or locale vary between teams or tenants? move to constants. (3) Does the code call toLowerCase(), trim(), localeCompare(), or includes() before comparison? switch immediately. (4) Would onboarding a new customer require editing source? migrate values into constants.js. (5) Did any monitoring alert show inconsistent behaviour across nodes? audit string comparisons first.\nALLOWED USE CASES: initial configuration bootstrap (convert instantly), user-facing presentation layers, test/debug utilities only.\nACTION PLAN: import binary helpers, define TOKEN_TYPES.KEYWORD = 0b010000 (and related enums), replace every literal check with bitwise/numeric operations, and add regression tests to block reintroduction.', 
                       th: 'ปรัชญาหลัก: "BINARY-FIRST 100% - ไม่มีความกำกวม"\nคำถาม 01: ทำไมจึงแบนสตริงดิบใน hot path?\nคำตอบ: ทุกครั้งต้องอ่านตัวอักษรแบบ O(n) สร้างสตริงชั่วคราว และพังด้วย Unicode ที่ตาเปล่ามองไม่เห็น ส่วนรหัสไบนารีตรวจแบบ O(1) และไม่โดนความต่างที่ซ่อนอยู่.\nคำถาม 02: จะเกิดอะไรเมื่อ locale, encoding หรือ runtime อัปเดต?\nคำตอบ: toLowerCase(), localeCompare() และ ICU เปลี่ยนผลลัพธ์ตาม build เดียวกัน โค้ดเดียวกันให้ AST ต่างกันระหว่าง en-US, th-TH หรือ container cloud.\nคำถาม 03: ตัวระบุเลขฐานสองกำจัดความเสี่ยงอย่างไร?\nคำตอบ: Bit mask ทำงานตรงกับคำสั่งเครื่อง เก็บใน constants.js แก้เลขครั้งเดียวแล้ว import ไปทุกที่ ทุก consumer ได้ค่าถูกทันที.\nคำถาม 04: เทสต์จะจับข้อผิดพลาดสตริงได้เร็วหรือไม่?\nคำตอบ: ไม่ได้ พิมพ์ผิด "KEYWROD" ยังผ่าน lint reviewer มองไม่เห็น แต่ enum ตัวเลขโยน error ทันทีเพราะค่าอยู่นอกช่วง.\nคำถาม 05: ค่าเสียหายวัดจริงเป็นอย่างไรถ้าคงสตริงไว้?\nคำตอบ: การโปรไฟล์ 10,000 ไฟล์พบ tokenizer ช้าลง 40-80 เท่า branch misprediction สูงขึ้น 3 เท่า และ GC ทำงานหนักเพราะสตริงสั้น ๆ; แฟลกไบนารีลบปัญหาทั้งหมด.\nคำถาม 06: ทำไมถึงยกเว้นให้ helper เล็ก ๆ ไม่ได้?\nคำตอบ: helper ใน hot path ใช้ตรรกะเดียวกัน การยกเว้นหนึ่งครั้งนำไปสู่การ copy-paste และหนี้สะสม แต่ค่าคงที่แบบตัวเลขทำให้ helper ทุกตัวปลอดภัยโดยออกแบบ.\nเช็คลิสต์ตรวจสอบ: (1) โค้ดรันต่อ token/node/statement หรือไม่ ถ้าใช่ต้องเป็นตัวเลข (2) ทีม/ลูกค้าอาจเปลี่ยนตัวพิมพ์หรือ locale หรือไม่ ถ้าใช่ย้ายค่าไป constants (3) มีการเรียก toLowerCase(), trim(), localeCompare() หรือ includes() หรือไม่ ถ้าใช่ต้องรีบเปลี่ยน (4) การเพิ่มลูกค้าหรือ environment ใหม่ต้องแก้ซอร์สหรือไม่ ถ้าใช่ต้องย้ายไป constants.js (5) Monitoring แจ้งพฤติกรรมต่างกันระหว่างเครื่องหรือไม่ ถ้าใช่ให้ตรวจ string comparison ก่อน.\nกรณีที่อนุญาต: โหลด config ครั้งแรก (และแปลงทันที), ชั้นนำเสนอสำหรับผู้ใช้, เครื่องมือทดสอบ/ดีบักเท่านั้น.\nแผนการแก้ไข: import ตัวช่วยเลขฐานสอง, กำหนด TOKEN_TYPES.KEYWORD = 0b010000 และ enum ที่เกี่ยวข้อง, แทนที่สตริงทั้งหมดด้วยการเปรียบเทียบแบบตัวเลข/บิต และเพิ่ม regression test เพื่อกันไม่ให้กลับมาอีก' 
                     },
        // ! ======================================================================
        // ! PATTERNS TO DETECT - รูปแบบที่ใช้ตรวจจับ
        // ! ======================================================================             
		patterns: [
			{ regex: /===\s*['"`][^'"`]+['"`]/g, name: 'Strict equality with string literal (left side)', severity: 'ERROR' },
			{ regex: /['"`][^'"`]+['"`]\s*===/g, name: 'Strict equality with string literal (right side)', severity: 'ERROR' },
			{ regex: /==\s*['"`][^'"`]+['"`]/g, name: 'Loose equality with string literal (left side)', severity: 'WARNING' },
			{ regex: /['"`][^'"`]+['"`]\s*==/g, name: 'Loose equality with string literal (right side)', severity: 'WARNING' },
			{ regex: /!==\s*['"`][^'"`]+['"`]/g, name: 'Strict inequality with string literal (left side)', severity: 'ERROR' },
			{ regex: /['"`][^'"`]+['"`]\s*!==/g, name: 'Strict inequality with string literal (right side)', severity: 'ERROR' },
			{ regex: /!=\s*['"`][^'"`]+['"`]/g, name: 'Loose inequality with string literal (left side)', severity: 'WARNING' },
			{ regex: /['"`][^'"`]+['"`]\s*!=/g, name: 'Loose inequality with string literal (right side)', severity: 'WARNING' },
			{ regex: /case\s+['"`][^'"`]+['"`]\s*:/g, name: 'Switch case using string literal', severity: 'ERROR' },
			{ regex: /\.type\s*===\s*['"`][^'"`]+['"`]/g, name: 'Property .type compared with string literal', severity: 'ERROR' },
			{ regex: /\.kind\s*===\s*['"`][^'"`]+['"`]/g, name: 'Property .kind compared with string literal', severity: 'ERROR' },
			{ regex: /\.name\s*===\s*['"`][^'"`]+['"`]/g, name: 'Property .name compared with string literal', severity: 'WARNING' },
			{ regex: /\.toLowerCase\(\)\s*===\s*['"`][^'"`]+['"`]/g, name: 'Case-insensitive comparison using .toLowerCase()', severity: 'ERROR' },
			{ regex: /\.toUpperCase\(\)\s*===\s*['"`][^'"`]+['"`]/g, name: 'Case-insensitive comparison using .toUpperCase()', severity: 'ERROR' },
			{ regex: /`[^`]+`\s*===/g, name: 'Template literal compared on right side', severity: 'ERROR' },
			{ regex: /===\s*`[^`]+`/g, name: 'Template literal compared on left side', severity: 'ERROR' }
		],
        // ! ======================================================================
        // ! PATTERNS TO DETECT - รูปแบบที่ใช้ตรวจจับ
        // ! ======================================================================
		severity: 'ERROR',
		violationExamples: {
			en: [
				'// @example NO_STRING violation\nif (token.type === "KEYWORD") {\n    processKeyword(token);\n}',
				'// @example NO_STRING violation\nif (node.kind === "FunctionDeclaration") {\n    return "function";\n} else if (node.kind === "ClassDeclaration") {\n    return "class";\n}',
				'// @example NO_STRING violation\nswitch (operator) {\n    case \'*\':\n        return OPERATOR_MULTIPLY;\n    default:\n        return OPERATOR_UNKNOWN;\n}',
				'// @example NO_STRING violation\nif (keyword.toLowerCase() === "return") {\n    return KEYWORD_RETURN;\n}',
				'// @example NO_STRING violation\nconst map = new Map([["FunctionDeclaration", handleFn]]);\nconst resolver = map.get(node.type);\nif (resolver) {\n    resolver(node);\n}',
				'// @example NO_STRING violation\nif (token.category.includes("operator")) {\n    metrics.operators++;\n}',
				'// @example NO_STRING violation\nconst isAssignment = /assignment/.test(node.kind);\nif (isAssignment) {\n    collectAssignment(node);\n}',
				'// @example NO_STRING violation\nfor (const matcher of ["if", "else", "for"]) {\n    if (keyword === matcher) {\n        return KEYWORD_MATCH;\n    }\n}'
			],
			th: [
				'// @example NO_STRING violation\nif (token.type === "KEYWORD") {\n    processKeyword(token);\n}',
				'// @example NO_STRING violation\nif (node.kind === "FunctionDeclaration") {\n    return "function";\n} else if (node.kind === "ClassDeclaration") {\n    return "class";\n}',
				'// @example NO_STRING violation\nswitch (operator) {\n    case \'*\':\n        return OPERATOR_MULTIPLY;\n    default:\n        return OPERATOR_UNKNOWN;\n}',
				'// @example NO_STRING violation\nif (keyword.toLowerCase() === "return") {\n    return KEYWORD_RETURN;\n}',
				'// @example NO_STRING violation\nconst map = new Map([["FunctionDeclaration", handleFn]]);\nconst resolver = map.get(node.type);\nif (resolver) {\n    resolver(node);\n}',
				'// @example NO_STRING violation\nif (token.category.includes("operator")) {\n    metrics.operators++;\n}',
				'// @example NO_STRING violation\nconst isAssignment = /assignment/.test(node.kind);\nif (isAssignment) {\n    collectAssignment(node);\n}',
				'// @example NO_STRING violation\nfor (const matcher of ["if", "else", "for"]) {\n    if (keyword === matcher) {\n        return KEYWORD_MATCH;\n    }\n}'
			]
		},
		correctExamples: {
			en: [
				'// @example NO_STRING correct\nconst TOKEN_TYPES = { KEYWORD: 0b010000 };\nif (token.binary & TOKEN_TYPES.KEYWORD) {\n    processKeyword(token);\n}',
				'// @example NO_STRING correct\nconst NODE_TYPES = { FUNCTION_DECL: 0x01, CLASS_DECL: 0x02 };\nif (node.type === NODE_TYPES.FUNCTION_DECL) {\n    return NODE_TYPES.FUNCTION_DECL;\n}',
				'// @example NO_STRING correct\nconst OPERATORS = { MULTIPLY: 3, UNKNOWN: 0 };\nswitch (operatorCode) {\n    case OPERATORS.MULTIPLY:\n        return OPERATOR_MULTIPLY;\n    default:\n        return OPERATORS.UNKNOWN;\n}',
				'// @example NO_STRING correct\nconst KEYWORDS = { RETURN: 0x10 };\nif (keywordId === KEYWORDS.RETURN) {\n    return KEYWORD_RETURN;\n}'
			],
			th: [
				'// @example NO_STRING correct\nconst TOKEN_TYPES = { KEYWORD: 0b010000 };\nif (token.binary & TOKEN_TYPES.KEYWORD) {\n    processKeyword(token);\n}',
				'// @example NO_STRING correct\nconst NODE_TYPES = { FUNCTION_DECL: 0x01, CLASS_DECL: 0x02 };\nif (node.type === NODE_TYPES.FUNCTION_DECL) {\n    return NODE_TYPES.FUNCTION_DECL;\n}',
				'// @example NO_STRING correct\nconst OPERATORS = { MULTIPLY: 3, UNKNOWN: 0 };\nswitch (operatorCode) {\n    case OPERATORS.MULTIPLY:\n        return OPERATOR_MULTIPLY;\n    default:\n        return OPERATORS.UNKNOWN;\n}',
				'// @example NO_STRING correct\nconst KEYWORDS = { RETURN: 0x10 };\nif (keywordId === KEYWORDS.RETURN) {\n    return KEYWORD_RETURN;\n}'
			]
		},
		fix: { 
            en: 'Define numeric constants in constants.js (e.g., TOKEN_TYPES.KEYWORD = 0b010000) and replace all string equality checks with bitwise or numeric comparisons.', 
            th: 'กำหนดค่าคงที่เป็นตัวเลขใน constants.js (เช่น TOKEN_TYPES.KEYWORD = 0b010000) แล้วแทนที่การเทียบสตริงทั้งหมดด้วยการเปรียบเทียบแบบตัวเลขหรือบิต' 
             }
	}
};

// ! ======================================================================
// ! MODULE EXPORTS
// ! ======================================================================
export { ABSOLUTE_RULES };
