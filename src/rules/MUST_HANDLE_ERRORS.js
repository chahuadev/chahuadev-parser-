// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================
// ! ABSOLUTE RULES CONFIGURATION - MUST_HANDLE_ERRORS
// ! ปรัชญา: "ฟังก์ชัน async ที่ไร้ try/catch คือระเบิดเวลาที่รอวันปะทุ"
// ! ======================================================================

import errorHandler from '../error-handler/ErrorHandler.js';

function hasTryStatement(block) {
    if (!block || block.type !== 'BlockStatement' || !Array.isArray(block.body)) {
        return false;
    }

    return block.body.some(statement => statement?.type === 'TryStatement');
}

function extractLocation(node) {
    if (node?.loc?.start) {
        return {
            line: node.loc.start.line,
            column: node.loc.start.column + 1 // เปลี่ยนเป็นฐาน 1 เพื่อความคุ้นเคย
        };
    }

    if (typeof node?.startLine === 'number') {
        return {
            line: node.startLine,
            column: typeof node.startColumn === 'number' ? node.startColumn + 1 : 1
        };
    }

    return { line: null, column: null };
}

function getFunctionName(node) {
    if (!node) {
        return 'anonymous';
    }

    if (node.type === 'FunctionDeclaration' && node.id?.name) {
        return node.id.name;
    }

    if (node.type === 'MethodDefinition' && node.key?.name) {
        return node.key.name;
    }

    if (node.type === 'FunctionExpression' && node.id?.name) {
        return node.id.name;
    }

    return 'anonymous';
}

function collectAsyncFunctionViolations(ast, code, filePath) {
    const violations = [];

    const visit = (node, parent = null) => {
        if (!node || typeof node !== 'object') {
            return;
        }

        const nodeType = node.type;

        let isAsyncFunction = false;
        let functionBody = null;

        switch (nodeType) {
            case 'FunctionDeclaration':
            case 'FunctionExpression':
                isAsyncFunction = node.async === true;
                functionBody = node.body;
                break;
            case 'ArrowFunctionExpression':
                isAsyncFunction = node.async === true;
                functionBody = node.body;
                break;
            case 'MethodDefinition':
                if (node.value && typeof node.value === 'object') {
                    isAsyncFunction = node.value.async === true;
                    functionBody = node.value.body;
                }
                break;
            default:
                break;
        }

        if (isAsyncFunction) {
            const hasTry = hasTryStatement(functionBody);
            // Arrow function ที่ไม่มี block statement ก็ถือว่าไม่มี try/catch
            if (!hasTry) {
                const location = extractLocation(node);
                const functionName = getFunctionName(node);

                violations.push({
                    ruleId: 'MUST_HANDLE_ERRORS',
                    message: `ฟังก์ชัน async "${functionName}" ต้องมี try...catch ครอบแกนหลักของการทำงาน`,
                    severity: 'ERROR',
                    line: location.line,
                    column: location.column,
                    context: {
                        filePath,
                        functionName,
                        hasBlockBody: functionBody?.type === 'BlockStatement'
                    }
                });
            }
        }

        for (const value of Object.values(node)) {
            if (!value || typeof value !== 'object') {
                continue;
            }

            if (Array.isArray(value)) {
                value.forEach(child => visit(child, node));
            } else {
                visit(value, node);
            }
        }
    };

    visit(ast, null);
    return violations;
}

const ABSOLUTE_RULES = {
    MUST_HANDLE_ERRORS: {
        id: 'MUST_HANDLE_ERRORS',
        name: {
            th: 'ฟังก์ชัน/เมธอดต้องมีการจัดการ Error'
        },
        description: {
            th: 'ทุก async function หรือ method ต้องมี try...catch ครอบ เพื่อป้องกัน unhandled promise rejection'
        },
        explanation: {
            th: 'ปรัชญา: "ฟังก์ชันที่ไม่มีการดักจับ Error คือระเบิดเวลา" กฎนี้บังคับให้ทุกฟังก์ชันหรือเมธอดที่มีโอกาสเกิดข้อผิดพลาด (โดยเฉพาะ async) ต้องมีการจัดการ Error อย่างชัดเจน การปล่อยให้ Error หลุดไปจะทำให้แอปพลิเคชันพังและดีบักได้ยากมาก'
        },
        severity: 'ERROR',
        fix: {
            th: 'ครอบโค้ดภายในฟังก์ชัน/เมธอดด้วยบล็อก try...catch และเรียก errorHandler.handleError ภายใน catch เพื่อบันทึกเหตุการณ์'
        },
        check(ast, code, filePath) {
            try {
                return collectAsyncFunctionViolations(ast, code, filePath);
            } catch (ruleError) {
                errorHandler.handleError(ruleError, {
                    source: 'MUST_HANDLE_ERRORS_RULE',
                    method: 'check',
                    severity: 'MEDIUM',
                    context: { filePath }
                });
                return [];
            }
        }
    }
};

export { ABSOLUTE_RULES };
