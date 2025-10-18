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
import { recordTelemetryNotice } from '../error-handler/telemetry-recorder.js';
import {
    ERROR_SOURCE_CODES,
    RUNTIME_ERROR_CODES
} from '../error-handler/error-catalog.js';
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
import { ABSOLUTE_RULES as EMOJI_RULE } from './NO_EMOJI.js';
import { ABSOLUTE_RULES as STRING_RULE } from './NO_STRING.js';
import { ABSOLUTE_RULES as CONSOLE_RULE } from './NO_CONSOLE.js';
import { ABSOLUTE_RULES as BINARY_AST_RULE } from './BINARY_AST_ONLY.js';
import { ABSOLUTE_RULES as STRICT_COMMENT_RULE } from './STRICT_COMMENT_STYLE.js';
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
        throw new Error(`Unable to resolve binary rule identifier for key ${String(key)}`);
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
        patterns: normalizedPatterns || definition.patterns
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
    EMOJI_RULE,
    STRING_RULE,
    CONSOLE_RULE,
    BINARY_AST_RULE,
    STRICT_COMMENT_RULE,
    MUST_HANDLE_ERRORS_RULE
);

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
            recordTelemetryNotice({
                message: 'ValidationEngine initialized successfully',
                source: 'ValidationEngine',
                method: 'initializeParserStudy',
                severity: resolveErrorSeveritySlug(ERROR_SEVERITY_FLAGS.LOW),
                context: {
                    status: 'parser_ready',
                    parser: this.parser?.constructor?.name || 'PureBinaryParser'
                }
            });
            return true;
        } catch (error) {
            const severity = ERROR_SEVERITY_FLAGS.CRITICAL;
            errorHandler.handleError({
                error,
                source: 'ValidationEngine',
                method: 'initializeParserStudy',
                errorCode: RUNTIME_ERROR_CODES.PARSE_FAILURE,
                severityCode: severity,
                sourceCode: ERROR_SOURCE_CODES.VALIDATOR,
                context: {
                    status: 'parser_boot_failure',
                    message: error?.message || 'ValidationEngine initialization failed',
                    stack: error?.stack || null
                }
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
                filePath: fileName,
                violations: violations || [],
                success: (violations || []).length === 0
            };
        } catch (error) {
            const severity = ERROR_SEVERITY_FLAGS.HIGH;
            errorHandler.handleError({
                error,
                source: 'ValidationEngine',
                method: 'validateCode',
                errorCode: RUNTIME_ERROR_CODES.PARSE_FAILURE,
                severityCode: severity,
                sourceCode: ERROR_SOURCE_CODES.VALIDATOR,
                filePath: fileName,
                context: {
                    status: 'validation_failure',
                    fileName,
                    message: error?.message || 'Validation failure during code analysis'
                }
            });
            throw new Error(`Validation failed for ${fileName}: ${error.message}`);
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
                    }
                }
            } catch (ruleError) {
                const severity = ERROR_SEVERITY_FLAGS.MEDIUM;
                const ruleIdentifier = rule?.slug || rule?.id || '<unknown-rule>';
                errorHandler.handleError({
                    error: ruleError,
                    source: 'ValidationEngine',
                    method: 'detectViolations',
                    errorCode: RUNTIME_ERROR_CODES.PARSE_FAILURE,
                    severityCode: severity,
                    sourceCode: ERROR_SOURCE_CODES.VALIDATOR,
                    filePath: fileName,
                    context: {
                        status: 'rule_evaluation_failure',
                        rule: ruleIdentifier,
                        message: ruleError?.message || 'Rule evaluation failed'
                    }
                });
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

        throw new Error(`Rule '${ruleId}' not found. Available: ${Object.values(this.rules)
            .map(rule => rule.slug || rule.id)
            .join(', ')}`);
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
