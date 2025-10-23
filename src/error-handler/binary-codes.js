// ═══════════════════════════════════════════════════════════════════════════════
// binary-codes.js - Pre-built Binary Error Code Factory
// ═══════════════════════════════════════════════════════════════════════════════
// หน้าที่: อ่าน Grammar และสร้าง Error Builder ทุกตัวที่เป็นไปได้ล่วงหน้า
// Purpose: Read Grammar and build all possible Error Builders ahead of time
// Pattern: BinaryCodes.DOMAIN.CATEGORY(severity, source, offset) → binaryCode
// ═══════════════════════════════════════════════════════════════════════════════

import { binaryErrorGrammar } from './binary-error.grammar.js';
import { createErrorCodeBuilder } from './binary-code-utils.js';

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD PHASE: วนลูป Grammar และสร้าง Builders ทั้งหมด
// ═══════════════════════════════════════════════════════════════════════════════

const BinaryCodes = {};

// 1. วนลูปทุก Domain ที่มีใน Grammar
for (const domainName in binaryErrorGrammar.domains) {
    if (domainName.startsWith('__')) continue; // ข้าม metadata เช่น __comment

    // 2. สร้าง Namespace ให้ Domain (เช่น BinaryCodes.SYSTEM = {})
    BinaryCodes[domainName] = {};

    // 3. วนลูปทุก Category ที่มีใน Grammar
    for (const categoryName in binaryErrorGrammar.categories) {
        if (categoryName.startsWith('__')) continue; // ข้าม metadata

        // 4. สร้าง Builder ที่ Fix Domain และ Category ไว้ล่วงหน้า
        // เช่น BinaryCodes.SYSTEM.INTEGRITY = createErrorCodeBuilder(grammar, 'SYSTEM', 'INTEGRITY')
        // ฟังก์ชันนี้จะ return function(severity, source, offset) ที่พร้อมใช้งาน
        BinaryCodes[domainName][categoryName] = createErrorCodeBuilder(
            binaryErrorGrammar,
            domainName,
            categoryName
        );
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT: Single Source of Truth สำหรับทุก Parser
// ═══════════════════════════════════════════════════════════════════════════════
// Pattern ที่ได้:
// - BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001)
// - BinaryCodes.VALIDATOR.VALIDATION('ERROR', 'USER', 2005)
// - BinaryCodes.SYSTEM.RUNTIME('FATAL', 'SYSTEM', 3010)
// - BinaryCodes.RUNTIME.LOGIC('ERROR', 'RUNTIME', 4001)
// ═══════════════════════════════════════════════════════════════════════════════

export default BinaryCodes;
