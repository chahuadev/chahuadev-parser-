// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════

import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from '../constants/severity-constants.js';
import { patternBasedCheck } from './rule-checker.js';

const RULE_ID = RULE_IDS.STRICT_COMMENT_STYLE;
const RULE_SLUG = resolveRuleSlug(RULE_ID);
const RULE_SEVERITY_ERROR = RULE_SEVERITY_FLAGS.ERROR;
const RULE_SEVERITY_CRITICAL = RULE_SEVERITY_FLAGS.CRITICAL;

// ! ══════════════════════════════════════════════════════════════════════════════
// ! ABSOLUTE RULE: STRICT_COMMENT_STYLE (กฎข้อที่ 9)
// ! บังคับใช้รูปแบบคอมเมนต์ที่ขึ้นต้นด้วย "// !" และห้ามใช้ block comment อื่น
// ! ══════════════════════════════════════════════════════════════════════════════

const ABSOLUTE_RULES = {
    [RULE_ID]: {
        id: RULE_ID,
        slug: RULE_SLUG,
        name: {
            en: 'Strict Comment Signature Enforcement',
            th: 'บังคับใช้รูปแบบคอมเมนต์แบบเข้มงวด'
        },
        description: {
            en: 'Every comment must start with "// !" and block comments are forbidden. Ensures reviewers see intent instantly.',
            th: 'ทุกคอมเมนต์ต้องขึ้นต้นด้วย "// !" และห้ามใช้ block comment เพื่อให้ผู้ตรวจทานเห็นเจตนาอย่างชัดเจน'
        },
        explanation: {
            en: 'RATIONALE: Chahuadev Sentinel relies on aggressively curated inline documentation. Mixing legacy comment styles ("//" or "/* */") hides signals used in audits and automation. This rule detects any double-slash comment that is missing the required bang marker and bans block comments entirely. Violations indicate developers forgot to document changes using the approved signature, which undermines review discipline and forensic tooling.',
            th: 'เหตุผล: ระบบ Chahuadev Sentinel ต้องการเอกสารประกอบโค้ดที่ชัดเจนและตรวจสอบได้ ถ้าใช้สไตล์คอมเมนต์เดิม ("//" หรือ "/* */") จะทำให้สัญญาณที่ใช้ในงานตรวจสอบสูญหาย กฎนี้ตรวจจับทุกคอมเมนต์ที่ไม่ขึ้นต้นด้วย "// !" และห้าม block comment โดยเด็ดขาด ถ้าละเมิดแสดงว่านักพัฒนาลืมจัดคอมเมนต์ตามมาตรฐาน ซึ่งจะกระทบทั้งการรีวิวและระบบ forensic'
        },
        patterns: [
            {
                // ! จับคอมเมนต์ที่ใช้ "//" แต่ไม่มี "!" ทันทีหลังช่องว่าง
                regex: /(?<!:)\/\/(?!\s*!)/g,
                name: 'Missing strict // ! signature',
                severity: RULE_SEVERITY_ERROR
            },
            {
                // ! จับ block comment ทุกชนิดทั้งเปิดและปิด
                regex: /\/\*|\*\//g,
                name: 'Block comment detected',
                severity: RULE_SEVERITY_CRITICAL
            }
        ],
        severity: RULE_SEVERITY_ERROR,
        violationExamples: {
            en: [
                '// bad comment without bang',
                '/* legacy block comment */'
            ],
            th: [
                '// คอมเมนต์แบบเดิมที่ไม่มีเครื่องหมาย !',
                '/* คอมเมนต์บล็อคที่ไม่อนุญาต */'
            ]
        },
        correctExamples: {
            en: [
                '// ! Describes why this branch exists',
                '// ! RULE:STRICT_COMMENT_STYLE - Explains enforcement'
            ],
            th: [
                '// ! อธิบายเหตุผลของโค้ดส่วนนี้',
                '// ! RULE:STRICT_COMMENT_STYLE - ใช้ลิงก์ไปยัง requirement'
            ]
        },
        fix: {
            en: 'Rewrite comments using the approved "// !" signature or remove unsupported block comments entirely.',
            th: 'แก้ไขคอมเมนต์ให้ขึ้นต้นด้วย "// !" หรือถอด block comment ที่ไม่ผ่านมาตรฐานออก'
        },
        
        // ! CHECK FUNCTION: Use shared pattern-based checker
        check(ast, code, fileName) {
            return patternBasedCheck(this, ast, code, fileName);
        }
    }
};

export { ABSOLUTE_RULES };
