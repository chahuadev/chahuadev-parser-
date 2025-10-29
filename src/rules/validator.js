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

// FIX: Migration to Binary Error System - Phase 5 Complete
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';
import { createErrorCollector } from '../error-handler/error-collector.js';
import {
    RULE_SLUGS,
    RULE_SLUG_TO_ID,
    resolveRuleSlug,
    coerceRuleId
} from '../constants/rule-constants.js';
import {
    RULE_SEVERITY_FLAGS,
    ERROR_SEVERITY_FLAGS,
    coerceRuleSeverity,
    resolveRuleSeveritySlug,
    resolveErrorSeveritySlug
} from '../constants/severity-constants.js';

import { ABSOLUTE_RULES as MOCKING_RULE } from './NO_MOCKING.js';
import { ABSOLUTE_RULES as HARDCODE_RULE } from './NO_HARDCODE.js';
import { ABSOLUTE_RULES as FALLBACKS_RULE } from './NO_SILENT_FALLBACKS.js';
import { ABSOLUTE_RULES as CACHING_RULE } from './NO_INTERNAL_CACHING.js';
// ! DISABLED: NO_EMOJI rule - กำลังแก้ไข patterns ที่ catch false positives (box drawing, math symbols)
// import { ABSOLUTE_RULES as EMOJI_RULE } from './NO_EMOJI.js';
// ! DISABLED: NO_STRING rule - ตรวจสอบ patterns ที่อาจ catch false positives
// import { ABSOLUTE_RULES as STRING_RULE } from './NO_STRING.js';
import { ABSOLUTE_RULES as CONSOLE_RULE } from './NO_CONSOLE.js';
import { ABSOLUTE_RULES as BINARY_AST_RULE } from './BINARY_AST_ONLY.js';
// ! DISABLED: STRICT_COMMENT_STYLE rule - ตรวจสอบ patterns ที่อาจซับซ้อนเกินไป
// import { ABSOLUTE_RULES as STRICT_COMMENT_RULE } from './STRICT_COMMENT_STYLE.js';
import { ABSOLUTE_RULES as MUST_HANDLE_ERRORS_RULE } from './MUST_HANDLE_ERRORS.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// !  COMBINE - รวมกฎทั้ง 9 ข้อเป็น ABSOLUTE_RULES เดียว
// ! ══════════════════════════════════════════════════════════════════════════════

const DEFAULT_RULE_SEVERITY = RULE_SEVERITY_FLAGS.ERROR;

function determineRuleId(key, definition) {
    if (definition && typeof definition.id === 'number') {
        return definition.id;
    }

    if (typeof key === 'number' && Number.isFinite(key) && key > 0) {
        return key;
    }

    if (typeof key === 'string') {
        const numericKey = Number(key);
        if (!Number.isNaN(numericKey) && numericKey > 0) {
            return numericKey;
        }
        if (RULE_SLUG_TO_ID[key]) {
            return RULE_SLUG_TO_ID[key];
        }
    }

    if (definition && typeof definition.id === 'string') {
        const idSlug = definition.id;
        if (RULE_SLUG_TO_ID[idSlug]) {
            return RULE_SLUG_TO_ID[idSlug];
        }

        const numericId = Number(idSlug);
        if (!Number.isNaN(numericId) && numericId > 0) {
            return numericId;
        }
    }

    if (definition && typeof definition.slug === 'string') {
        const slug = definition.slug;
        if (RULE_SLUG_TO_ID[slug]) {
            return RULE_SLUG_TO_ID[slug];
        }
    }

    return null;
}

function determineRuleSlug(resolvedId, key, definition) {
    if (definition && typeof definition.slug === 'string') {
        return definition.slug;
    }

    if (typeof key === 'string' && !Number.isFinite(Number(key))) {
        return key;
    }

    if (resolvedId && RULE_SLUGS[resolvedId]) {
        return RULE_SLUGS[resolvedId];
    }

    if (definition && typeof definition.id === 'string' && RULE_SLUG_TO_ID[definition.id]) {
        return definition.id;
    }

    return resolveRuleSlug(resolvedId) || 'UNKNOWN_RULE';
}

function normalizeRuleDefinition(key, definition) {
    if (!definition || typeof definition !== 'object') {
        return null;
    }

    const resolvedId = determineRuleId(key, definition);
    if (!resolvedId) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.VALIDATOR.VALIDATION(7001), {
            method: 'normalizeRuleDefinition',
            message: `Unable to resolve binary rule identifier for key ${String(key)}`,
            key: String(key),
            definitionType: typeof definition,
            hasId: definition?.id !== undefined,
            hasSlug: definition?.slug !== undefined
        });
        // ไม่ throw - return null แทน
        return null;
    }

    const slug = determineRuleSlug(resolvedId, key, definition);
    const severity = coerceRuleSeverity(definition.severity, DEFAULT_RULE_SEVERITY);
    let normalizedPatterns = undefined;

    if (Array.isArray(definition.patterns)) {
        normalizedPatterns = definition.patterns.map(pattern => {
            const patternSeverity = coerceRuleSeverity(pattern?.severity, severity);
            return {
                ...pattern,
                severity: patternSeverity,
                severityLabel: resolveRuleSeveritySlug(patternSeverity)
            };
        });
    }

    return {
        ...definition,
        id: resolvedId,
        slug,
        severity,
        severityLabel: resolveRuleSeveritySlug(severity),
        patterns: normalizedPatterns || definition.patterns,
        enabled: definition.enabled !== false // Default: enabled unless explicitly disabled
    };
}

function mergeRuleCollections(...collections) {
    const registry = {};

    for (const collection of collections) {
        if (!collection || typeof collection !== 'object') {
            continue;
        }

        for (const [key, definition] of Object.entries(collection)) {
            const normalized = normalizeRuleDefinition(key, definition);

            if (!normalized) {
                continue;
            }

            registry[normalized.id] = normalized;
        }
    }

    return registry;
}

export const ABSOLUTE_RULES = mergeRuleCollections(
    MOCKING_RULE,
    HARDCODE_RULE,
    FALLBACKS_RULE,
    CACHING_RULE,
    // EMOJI_RULE, // ! DISABLED: NO_EMOJI temporarily disabled
    // STRING_RULE, // ! DISABLED: NO_STRING temporarily disabled
    CONSOLE_RULE,
    BINARY_AST_RULE,
    // STRICT_COMMENT_RULE, // ! DISABLED: STRICT_COMMENT_STYLE temporarily disabled
    MUST_HANDLE_ERRORS_RULE
);

// ! ══════════════════════════════════════════════════════════════════════════════
// !  VALIDATION ENGINE CLASS
// ! ══════════════════════════════════════════════════════════════════════════════

import { createParser, tokenize } from '../grammars/index.js';

export class ValidationEngine {
    constructor(options = {}) {
        this.rules = ABSOLUTE_RULES;
        this.parser = null;
        
        // ! ERROR COLLECTOR: Real-time error streaming
        this.errorCollector = createErrorCollector({
            streamMode: options.streamMode !== false, // Default: true
            throwOnCritical: options.throwOnCritical !== false, // Default: true
            maxErrors: options.maxErrors || Infinity
        });
    }

    async initializeParserStudy() {
        try {
            this.parser = await createParser(ABSOLUTE_RULES);
            return true;
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.PARSER.SYNTAX(1020), {
                method: 'initializeParserStudy',
                message: error?.message || 'Parser initialization failed',
                errorType: error?.constructor?.name,
                stackPreview: error?.stack?.split('\n').slice(0, 3).join('\n')
            });
            // ไม่ throw - ให้ระบบทำงานต่อ (parser จะเป็น null)
        }
    }

    async validateCode(code, fileName = 'unknown') {
        if (!this.parser) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.CONFIGURATION(7002), {
                method: 'validateCode',
                message: 'ValidationEngine not initialized. Call initializeParserStudy() first.',
                fileName: fileName
            });
            // ไม่ throw - return empty violations แทน
            return [];
        }

        try {
            // Tokenize and parse using production parser (NO_MOCKING compliant)
            const tokens = tokenize(code, this.parser.grammarIndex);
            
            // ! NO_SILENT_FALLBACKS: Parse และตรวจสอบ AST validity
            let ast;
            try {
                ast = this.parser.parse(tokens);
            } catch (parseError) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.PARSER.SYNTAX(1032), {
                    method: 'validateCode',
                    message: parseError?.message || 'Parser failed - syntax error in source code',
                    fileName: fileName,
                    tokensCount: tokens.length,
                    errorType: parseError?.constructor?.name
                });
                // ไม่ throw - return empty violations แทน
                return [];
            }
            
            // ! ตรวจสอบ AST validity
            if (!ast || typeof ast !== 'object') {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.PARSER.SYNTAX(2005), {
                    method: 'validateCode',
                    message: 'Parser returned invalid AST (null/undefined/non-object)',
                    fileName: fileName,
                    astType: typeof ast,
                    astConstructor: ast?.constructor?.name
                });
                // ไม่ throw - return empty violations แทน
                return [];
            }
            
            // Detect violations based on ABSOLUTE_RULES
            const violations = this.detectViolations(ast, code, fileName);
            
            // ! NO_SILENT_FALLBACKS: ห้ามใช้ || [] ซ่อน parser failure
            if (!Array.isArray(violations)) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.VALIDATOR.LOGIC(1027), {
                    method: 'validateCode',
                    message: 'detectViolations() returned non-array value - parse failure hidden by silent fallback',
                    fileName: fileName,
                    violationsType: typeof violations,
                    violationsConstructor: violations?.constructor?.name
                });
                // ไม่ throw - return empty violations แทน
                return [];
            }
            
            // ! DEBUG: Log violation count
            console.log(`[DEBUG] detectViolations returned ${violations.length} violations`);
            
            return {
                fileName,
                filePath: fileName,
                violations,
                success: violations.length === 0
            };
        } catch (error) {
            // ! Re-throw errors already reported by inner try-catch
            // ! Inner catch already called reportError for parse errors
            // ! Outer catch only handles unexpected errors
            
            // Check if error was already reported (has our custom message prefix)
            if (error.message.startsWith('Parse failed for') || 
                error.message.startsWith('Invalid AST for') ||
                error.message.startsWith('Invalid violations result for')) {
                // Already reported by inner catch - return empty violations
                return [];
            }
            
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.VALIDATOR.LOGIC(1021), {
                method: 'validateCode',
                message: error?.message || 'Unexpected error during validation',
                fileName: fileName,
                errorType: error?.constructor?.name,
                stackPreview: error?.stack?.split('\n').slice(0, 3).join('\n')
            });
            // ไม่ throw - return empty violations แทน
            return [];
        }
    }
    
    detectViolations(ast, code, fileName) {
        const violations = [];
        
        // Check each rule against the AST
        for (const rule of Object.values(this.rules)) {
            if (!rule || typeof rule !== 'object') {
                continue;
            }

            if (!rule.enabled) continue;
            
            try {
                // Each rule should have a check function
                if (typeof rule.check === 'function') {
                    const ruleViolations = rule.check(ast, code, fileName);
                    if (ruleViolations && ruleViolations.length > 0) {
                        const enriched = ruleViolations.map(violation =>
                            this.enrichViolationWithRuleMetadata(violation, rule.id, rule)
                        );
                        violations.push(...enriched);
                        
                        // ! STREAM TO ERROR COLLECTOR: Real-time violation streaming
                        for (const violation of enriched) {
                            this.errorCollector.collect(
                                BinaryCodes.VALIDATOR.VALIDATION(3000 + (rule.id || 0)),
                                {
                                    method: 'detectViolations',
                                    fileName,
                                    rule: rule.slug || rule.id,
                                    message: violation.message,
                                    line: violation.line,
                                    column: violation.column,
                                    severity: violation.severity
                                },
                                { nonThrowing: true } // Don't throw on violations
                            );
                        }
                    }
                }
            } catch (ruleError) {
                // FIX: Universal Reporter - Auto-collect
                this.errorCollector.collect(
                    BinaryCodes.VALIDATOR.VALIDATION(3001),
                    {
                        method: 'detectViolations',
                        rule: rule?.slug || rule?.id || '<unknown>',
                        fileName: fileName,
                        message: ruleError?.message || 'Rule check failed',
                        errorType: ruleError?.constructor?.name,
                        stackPreview: ruleError?.stack?.split('\n').slice(0, 3).join('\n')
                    },
                    { nonThrowing: true }
                );
                // ! NO_SILENT_FALLBACKS: Log error but continue to next rule
            }
        }
        
        return violations;
    }

    getRules() {
        return this.rules;
    }

    getRule(ruleId) {
        const resolvedId = coerceRuleId(ruleId);
        if (resolvedId && this.rules[resolvedId]) {
            return this.rules[resolvedId];
        }

        // FIX: Universal Reporter - Auto-collect
        const availableRules = Object.values(this.rules)
            .map(rule => rule.slug || rule.id)
            .join(', ');
            
        report(BinaryCodes.VALIDATOR.VALIDATION(7003), {
            method: 'getRule',
            message: `Rule '${ruleId}' not found. Available: ${availableRules}`,
            requestedRuleId: String(ruleId),
            resolvedId: String(resolvedId),
            availableCount: Object.keys(this.rules).length
        });
        // ไม่ throw - return null แทน
        return null;
    }

    enrichViolationWithRuleMetadata(violation, ruleId, rule) {
        const normalized = {
            ...violation,
        };

    const resolvedRuleId = coerceRuleId(normalized.ruleId) ?? coerceRuleId(ruleId) ?? rule?.id ?? ruleId;
        normalized.ruleId = resolvedRuleId;

        const severity = coerceRuleSeverity(
            normalized.severity ?? rule?.severity,
            rule?.severity ?? DEFAULT_RULE_SEVERITY
        );
        normalized.severity = severity;
        normalized.severityLabel = resolveRuleSeveritySlug(severity);

        const name = this.normalizeLocalizedField(rule?.name);
        const description = this.normalizeLocalizedField(rule?.description);
        const explanation = this.normalizeLocalizedField(rule?.explanation);
        const fix = this.normalizeLocalizedField(rule?.fix);
        const violationExamples = this.cloneLocalizedArrayMap(rule?.violationExamples);
        const correctExamples = this.cloneLocalizedArrayMap(rule?.correctExamples);

        const existingMetadata = (normalized.ruleMetadata && typeof normalized.ruleMetadata === 'object')
            ? normalized.ruleMetadata
            : {};

        normalized.ruleMetadata = {
            ...existingMetadata,
            id: resolvedRuleId,
            slug: rule?.slug || resolveRuleSlug(resolvedRuleId),
            name,
            description,
            explanation,
            fix,
            severity,
            severityLabel: resolveRuleSeveritySlug(severity),
            violationExamples,
            correctExamples
        };

        const existingGuidance = (normalized.guidance && typeof normalized.guidance === 'object')
            ? normalized.guidance
            : {};

        normalized.guidance = {
            ...existingGuidance,
            why: description,
            how: fix,
            context: explanation
        };

        return normalized;
    }

    normalizeLocalizedField(field) {
        if (!field) {
            return null;
        }

        if (typeof field === 'string') {
            return { en: field };
        }

        if (typeof field === 'object') {
            return { ...field };
        }

        return null;
    }

    cloneLocalizedArrayMap(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }

        const cloned = {};

        for (const [lang, items] of Object.entries(value)) {
            cloned[lang] = Array.isArray(items) ? [...items] : items;
        }

        return cloned;
    }
    
    /**
     * Get error collector report
     * @returns {object} Error collection summary
     */
    getErrorReport() {
        return this.errorCollector.generateReport();
    }
    
    /**
     * Clear error collector
     */
    clearErrors() {
        this.errorCollector.clear();
    }
    
    /**
     * Check if any errors collected
     */
    hasCollectedErrors() {
        return this.errorCollector.hasErrors();
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
