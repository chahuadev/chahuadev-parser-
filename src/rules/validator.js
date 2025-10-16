// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0 - Modular Architecture
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Chahuadev Sentinel - Rules Validator (Modular Version)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! This file combines all 9 ABSOLUTE RULES from separate files.
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Architecture:
// !   BEFORE: All rules in one 5,191-line file
// !  AFTER:  Each rule in its own file (NO_*.js)
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Rule Files:
// !  - NO_MOCKING.js
// !  - NO_HARDCODE.js
// !  - NO_SILENT_FALLBACKS.js
// !  - NO_INTERNAL_CACHING.js
// !  - NO_EMOJI.js
// !  - NO_STRING.js
// !  - NO_CONSOLE.js
// !  - BINARY_AST_ONLY.js
// !  - STRICT_COMMENT_STYLE.js
// ! ══════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════
// !  IMPORTS - นำเข้ากฎทั้ง 8 ข้อจากไฟล์แยก
// ! ══════════════════════════════════════════════════════════════════════════════

import errorHandler from '../error-handler/ErrorHandler.js';

import { ABSOLUTE_RULES as MOCKING_RULE } from './NO_MOCKING.js';
import { ABSOLUTE_RULES as HARDCODE_RULE } from './NO_HARDCODE.js';
import { ABSOLUTE_RULES as FALLBACKS_RULE } from './NO_SILENT_FALLBACKS.js';
import { ABSOLUTE_RULES as CACHING_RULE } from './NO_INTERNAL_CACHING.js';
import { ABSOLUTE_RULES as EMOJI_RULE } from './NO_EMOJI.js';
import { ABSOLUTE_RULES as STRING_RULE } from './NO_STRING.js';
import { ABSOLUTE_RULES as CONSOLE_RULE } from './NO_CONSOLE.js';
import { ABSOLUTE_RULES as BINARY_AST_RULE } from './BINARY_AST_ONLY.js';
import { ABSOLUTE_RULES as STRICT_COMMENT_RULE } from './STRICT_COMMENT_STYLE.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// !  COMBINE - รวมกฎทั้ง 9 ข้อเป็น ABSOLUTE_RULES เดียว
// ! ══════════════════════════════════════════════════════════════════════════════

export const ABSOLUTE_RULES = {
    ...MOCKING_RULE,
    ...HARDCODE_RULE,
    ...FALLBACKS_RULE,
    ...CACHING_RULE,
    ...EMOJI_RULE,
    ...STRING_RULE,
    ...CONSOLE_RULE,
    // RULE:BINARY_AST_ONLY - รวมกฎข้อที่ 8 เพื่อบังคับ Binary AST
    ...BINARY_AST_RULE,
    // RULE:STRICT_COMMENT_STYLE - รวมกฎข้อที่ 9 บังคับใช้รูปแบบคอมเมนต์
    ...STRICT_COMMENT_RULE
};

// ! ══════════════════════════════════════════════════════════════════════════════
// !  VALIDATION ENGINE CLASS
// ! ══════════════════════════════════════════════════════════════════════════════

import { createParser, tokenize } from '../grammars/index.js';

export class ValidationEngine {
    constructor() {
        this.rules = ABSOLUTE_RULES;
        this.parser = null;
    }

    async initializeParserStudy() {
        try {
            this.parser = await createParser(ABSOLUTE_RULES);
            const initNotice = new Error('ValidationEngine initialized successfully');
            initNotice.name = 'ValidationEngineStatus';
            initNotice.isOperational = true;
            errorHandler.handleError(initNotice, {
                source: 'ValidationEngine',
                method: 'initializeParserStudy',
                severity: 'INFO',
                context: 'Parser and rules loaded for validation'
            });
            return true;
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'ValidationEngine',
                method: 'initializeParserStudy',
                severity: 'CRITICAL',
                context: 'ValidationEngine initialization failed - Parser engine creation error'
            });
            throw new Error(`ValidationEngine initialization failed: ${error.message}`);
        }
    }

    async validateCode(code, fileName = 'unknown') {
        if (!this.parser) {
            throw new Error('ValidationEngine not initialized. Call initializeParserStudy() first.');
        }

        try {
            // Tokenize and parse using production parser (NO_MOCKING compliant)
            const tokens = tokenize(code, this.parser.grammarIndex);
            const ast = this.parser.parse(tokens);
            
            // Detect violations based on ABSOLUTE_RULES
            const violations = this.detectViolations(ast, code, fileName);
            
            return {
                fileName,
                violations: violations || [],
                success: (violations || []).length === 0
            };
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'ValidationEngine',
                method: 'validateCode',
                severity: 'HIGH',
                context: `Validation failed for ${fileName} - Code analysis error`
            });
            throw new Error(`Validation failed for ${fileName}: ${error.message}`);
        }
    }
    
    detectViolations(ast, code, fileName) {
        const violations = [];
        
        // Check each rule against the AST
        for (const [ruleId, rule] of Object.entries(this.rules)) {
            if (!rule.enabled) continue;
            
            try {
                // Each rule should have a check function
                if (typeof rule.check === 'function') {
                    const ruleViolations = rule.check(ast, code, fileName);
                    if (ruleViolations && ruleViolations.length > 0) {
                        violations.push(...ruleViolations);
                    }
                }
            } catch (ruleError) {
                errorHandler.handleError(ruleError, {
                    source: 'ValidationEngine',
                    method: 'detectViolations',
                    severity: 'MEDIUM',
                    context: `Rule ${ruleId} check failed for ${fileName}`
                });
            }
        }
        
        return violations;
    }

    getRules() {
        return this.rules;
    }

    getRule(ruleId) {
        if (!this.rules[ruleId]) {
            throw new Error(`Rule '${ruleId}' not found. Available: ${Object.keys(this.rules).join(', ')}`);
        }
        return this.rules[ruleId];
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
// !  EXPORTS SUMMARY
// ! ══════════════════════════════════════════════════════════════════════════════
// !  ABSOLUTE_RULES - กฎทั้ง 9 ข้อ (รวมจากไฟล์แยก)
// !  ValidationEngine - Class สำหรับ validate โค้ด
// !  
// !  Usage (เหมือนเดิม):
// !    import { ABSOLUTE_RULES } from './src/rules/validator.js';
// !    import { ValidationEngine } from './src/rules/validator.js';
// ! ══════════════════════════════════════════════════════════════════════════════
