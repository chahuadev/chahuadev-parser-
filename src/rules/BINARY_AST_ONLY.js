// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================

// ! ======================================================================
// ! ABSOLUTE RULES CONFIGURATION
// ! กฎเหล็กข้อที่ 8 - Binary AST Only
// ! ======================================================================
// ! ปรัชญา: "ถ้า AST ยังเป็น Object แสดงว่าระบบยังไม่ได้ Binary-First จริง"
// ! ======================================================================

import errorHandler from '../error-handler/ErrorHandler.js';

const ABSOLUTE_RULES = {
    // RULE:BINARY_AST_ONLY - หัวใจของการบังคับใช้ Binary AST ใน production
    BINARY_AST_ONLY: {
        id: 'BINARY_AST_ONLY',
        name: {
            en: 'Binary AST Pipeline Required',
            th: 'ระบบวิเคราะห์ต้องใช้ Binary AST เท่านั้น'
        },
        description: {
            en: 'Any production analyzer must consume the binary AST buffer instead of legacy object graphs.',
            th: 'ระบบวิเคราะห์ในสภาพแวดล้อมจริงต้องอ่าน Binary AST buffer ห้าม fallback ไปใช้ AST แบบ object เดิม'
        },
        explanation: {
            en: 'GOAL: enforce the binary-first architecture. When parsers return object graphs, large projects explode memory usage. With binary AST, analyzers stream nodes without allocating nested objects. This rule blocks accidental regression to legacy `parser.parse(...);` flows or direct `.children` traversal. Triggering this rule means the module leaks classic AST operations in production path. Fix it by decoding through the binary adapters (`decodeNodeTable`, `iterateBinaryAst`) and by working with typed records instead of dynamic dot-accessors.',
            th: 'เป้าหมาย: บังคับใช้สถาปัตยกรรม binary-first จริง ๆ เมื่อ parser คืนค่า object แบบเดิม โปรเจกต์ใหญ่จะกินแรมจนพัง การใช้ Binary AST ทำให้วิเคราะห์แบบสตรีมได้ ไม่ต้องสร้าง object ย่อย ๆ ซ้ำ ๆ กฎนี้จะป้องกันการย้อนกลับไปใช้ `parser.parse(...)` หรือ `node.children` โดยตรง ซึ่งเป็นสัญญาณว่าระบบยังไม่ใช้งาน buffer. เมื่อโดนกฎนี้ให้แก้โดยใช้ตัวถอดรหัส Binary AST (`decodeNodeTable`, `iterateBinaryAst`) และทำงานกับข้อมูลแบบบันทึกไบนารีแทนการ dot-access แบบเดิม.'
        },
        patterns: [
            {
                // RULE:BINARY_AST_ONLY - กันการเรียก parser.parse ที่คืน AST object
                regex: /\bparser\s*\.\s*parse\s*\(/g,
                name: 'Legacy parser.parse usage',
                severity: 'CRITICAL'
            },
            {
                // RULE:BINARY_AST_ONLY - กันการเข้าถึง node.children ที่บ่งบอกว่าเป็น object AST
                regex: /\.children\b/g,
                name: 'Direct AST children traversal',
                severity: 'ERROR'
            },
            {
                // RULE:BINARY_AST_ONLY - กันการเข้าถึง node.type โดยตรง
                regex: /\.type\b/g,
                name: 'Direct AST type inspection',
                severity: 'ERROR'
            }
        ],
        severity: 'CRITICAL',
        violationExamples: {
            en: [
                '// @example BINARY_AST_ONLY violation\nconst ast = parser.parse(tokens);\nfor (const child of ast.body) {\n    console.log(child.type);\n}',
                '// @example BINARY_AST_ONLY violation\nfunction walk(node) {\n    if (!node) return;\n    node.children.forEach(walk);\n}'
            ],
            th: [
                '// @example BINARY_AST_ONLY violation\nconst ast = parser.parse(tokens);\nfor (const child of ast.body) {\n    console.log(child.type);\n}',
                '// @example BINARY_AST_ONLY violation\nfunction walk(node) {\n    if (!node) return;\n    node.children.forEach(walk);\n}'
            ]
        },
        correctExamples: {
            en: [
                '// @example BINARY_AST_ONLY correct\nconst buffer = encodeAst(tokens);\nfor (const node of iterateBinaryAst(buffer)) {\n    handle(node.typeId, node.loc);\n}',
                '// @example BINARY_AST_ONLY correct\nconst nodes = decodeNodeTable(binaryAstBuffer);\nnodes.forEach(node => processBinaryNode(node));'
            ],
            th: [
                '// @example BINARY_AST_ONLY correct\nconst buffer = encodeAst(tokens);\nfor (const node of iterateBinaryAst(buffer)) {\n    handle(node.typeId, node.loc);\n}',
                '// @example BINARY_AST_ONLY correct\nconst nodes = decodeNodeTable(binaryAstBuffer);\nnodes.forEach(node => processBinaryNode(node));'
            ]
        },
        fix: {
            en: 'Refactor modules to consume binary AST helpers (`decodeNodeTable`, `iterateBinaryAst`) and remove direct AST object access.',
            th: 'ปรับโมดูลให้ใช้ตัวช่วย Binary AST (`decodeNodeTable`, `iterateBinaryAst`) และเลิกเข้าถึง AST object โดยตรง'
        }
    }
};

export { ABSOLUTE_RULES };
