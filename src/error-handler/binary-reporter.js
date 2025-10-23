// ! ═══════════════════════════════════════════════════════════════════════════════
// ! binary-reporter.js - ฟังก์ชันเดียวทั้งระบบสำหรับรายงาน Binary Error
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! ปรัชญา: รายงานแค่ Binary Code + Context ที่จำเป็น ให้ BinaryErrorParser สืบสวนต่อ
// ! ═══════════════════════════════════════════════════════════════════════════════

import binaryErrorParser from './BinaryErrorParser.js';
import { binaryErrorGrammar } from './binary-error.grammar.js';

// Export binary-code-utils สำหรับสร้าง Binary Code
export * from './binary-code-utils.js';

// Meta Error Code (NO_HARDCODE: อ่านจาก Grammar)
const META_INVALID_ERROR_CODE = binaryErrorGrammar.meta.META_INVALID_ERROR_CODE;

/**
 * รายงานการเกิด Error โดยใช้ Binary Code เฉพาะตัว และ Context ที่จำเป็นขั้นต่ำ
 * นี่คือฟังก์ชัน **เดียว** ที่ควรใช้ทั้งระบบในการรายงาน Error
 * ฟังก์ชันนี้ **ไม่ throw** เอง แค่ **"รายงาน"** Code ไปให้ BinaryErrorParser กลาง
 *
 * @param {string} binaryErrorCode - Binary Code เฉพาะตัว (string สำหรับ 64-bit precision)
 * @param {object} [minimalContext={}] - Context ที่จำเป็น (เช่น { position, character })
 */
function reportError(binaryErrorCode, minimalContext = {}) {
    // ! ป้องกัน Infinite Loop (ถ้า META_CODE เองก็ผิด ก็หยุดเลย)
    if (binaryErrorCode === META_INVALID_ERROR_CODE) {
        // Absolute last resort: ไม่ทำอะไรเลยเพื่อป้องกัน infinite recursion
        return;
    }

    // ! ตรวจสอบ Binary Code (ต้องเป็น string ที่ไม่ว่าง)
    if (typeof binaryErrorCode !== 'string' || !binaryErrorCode || binaryErrorCode.trim() === '') {
        // ! นี่คือจุดสำคัญ: แทนที่จะสร้าง kind: 'system'
        // ! เรา "รายงาน" Binary Error Code ใหม่ที่มีความหมายว่า "Invalid Code"
        reportError(META_INVALID_ERROR_CODE, {
            invalidCodeAttempted: binaryErrorCode,
            invalidCodeType: typeof binaryErrorCode,
            originalContext: minimalContext
        });
        return;
    }

    // ! เตรียม Payload แบบ Pure Binary (ไม่มี kind แล้ว - เป็น binary 100%)
    const payload = {
        code: binaryErrorCode,
        context: minimalContext
    };

    // ! ส่งรายงานให้ BinaryErrorParser กลางไปสืบสวนต่อ
    binaryErrorParser.handleError(payload);
}

// ! Export ฟังก์ชันนี้ **ตัวเดียว** สำหรับการรายงาน Error
export { reportError };
