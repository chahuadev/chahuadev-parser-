// ! ═══════════════════════════════════════════════════════════════════════════════
// ! binary-reporter.js - ฟังก์ชันเดียวทั้งระบบสำหรับรายงาน Binary Error
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! ปรัชญา: รายงานแค่ Binary Code + Context ที่จำเป็น ให้ BinaryErrorParser สืบสวนต่อ
// ! ═══════════════════════════════════════════════════════════════════════════════

import binaryErrorParser from './BinaryErrorParser.js';
import { binaryErrorGrammar } from './binary-error.grammar.js';

// Export binary-code-utils สำหรับสร้าง Binary Code
export * from './binary-code-utils.js';

// Dynamic import to avoid circular dependency
let BinaryCodes;
async function loadBinaryCodes() {
    if (!BinaryCodes) {
        const module = await import('./binary-codes.js');
        BinaryCodes = module.default;
    }
    return BinaryCodes;
}

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

    // ! FIX BUG-002: ตรวจสอบ Binary Code (ต้องเป็น string ที่เป็นตัวเลขจริงๆ)
    if (typeof binaryErrorCode !== 'string' || !binaryErrorCode || binaryErrorCode.trim() === '') {
        reportError(META_INVALID_ERROR_CODE, {
            invalidCodeAttempted: binaryErrorCode,
            invalidCodeType: typeof binaryErrorCode,
            originalContext: minimalContext
        });
        return;
    }
    
    // ! FIX BUG-002: ทดสอบว่าแปลงเป็น BigInt ได้จริงหรือไม่ (ป้องกัน crash)
    try {
        BigInt(binaryErrorCode); // ทดสอบก่อน - ถ้าผิดจะโยน SyntaxError
    } catch (conversionError) {
        // FIX: Universal Reporter - Auto-collect
        const { report } = require('./universal-reporter.js');
        const BinaryCodes = require('./binary-codes.js').default;
        report(BinaryCodes.VALIDATOR.VALIDATION(8002));
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

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions - ทำให้การรายงาน Error สั้นและง่ายขึ้น
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Normalize Error Object - แปลง Error เป็น Context Object
 * @param {Error} error - Error object
 * @returns {object} - { error: string, stack: string }
 */
function normalizeError(error) {
    if (!error) return {};
    
    // ถ้าเป็น Error object แล้ว แยก message และ stack
    if (error instanceof Error) {
        return {
            error: error.message,
            stack: error.stack
        };
    }
    
    // ถ้าเป็น string ก็ใช้เลย
    if (typeof error === 'string') {
        return { error };
    }
    
    // ถ้าเป็น object ที่มี message
    if (error.message) {
        return {
            error: error.message,
            stack: error.stack
        };
    }
    
    // Fallback: แปลงเป็น string
    return { error: String(error) };
}

/**
 * Handle IO Error - จัดการ File/Path errors
 * @param {string} subcategory - RESOURCE_NOT_FOUND | RESOURCE_UNAVAILABLE | RESOURCE_EXHAUSTED
 * @param {number} offset - Unique error ID
 * @param {string} path - File path
 * @param {Error|string} [error] - Optional error object
 * @returns {object} - { violations: [], error: string }
 */
export function handleIOError(subcategory, offset, path, error = null) {
    const context = { path };
    
    if (error) {
        Object.assign(context, normalizeError(error));
    }
    
    reportError(BinaryCodes.IO[subcategory](offset), context);
    
    return { 
        violations: [], 
        error: error ? (error.message || String(error)) : 'IO Error'
    };
}

/**
 * Handle Validation Error - จัดการ Validator errors
 * @param {number} offset - Unique error ID
 * @param {string} path - File path
 * @param {Error} error - Error object
 * @returns {object} - { violations: [], error: string }
 */
export function handleValidationError(offset, path, error) {
    const context = { path, ...normalizeError(error) };
    
    reportError(BinaryCodes.VALIDATOR.VALIDATION(offset), context);
    
    return { violations: [], error: error.message };
}

/**
 * Handle System/Configuration Error - จัดการ System errors
 * @param {string} category - CONFIGURATION | RUNTIME | INTEGRITY
 * @param {number} offset - Unique error ID
 * @param {Error} error - Error object
 * @param {object} [extraContext] - Additional context
 */
export function handleSystemError(category, offset, error, extraContext = {}) {
    const context = { ...normalizeError(error), ...extraContext };
    
    reportError(BinaryCodes.SYSTEM[category](offset), context);
}

/**
 * Handle Security Error - จัดการ Security errors
 * @param {string} category - PERMISSION | VALIDATION | RUNTIME
 * @param {number} offset - Unique error ID
 * @param {string} path - Resource path
 * @param {Error|string} [error] - Optional error
 * @param {object} [extraContext] - Additional context
 */
export function handleSecurityError(category, offset, path, error = null, extraContext = {}) {
    const context = { path, ...extraContext };
    
    if (error) {
        Object.assign(context, normalizeError(error));
    }
    
    reportError(BinaryCodes.SECURITY[category](offset), context);
}
