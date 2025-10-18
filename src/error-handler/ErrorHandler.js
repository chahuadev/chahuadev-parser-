#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Centralized Error Handler
// ! ══════════════════════════════════════════════════════════════════════════════  
// ! ! NO_SILENT_FALLBACKS Compliance - "SILENCE IS A FORM OF DAMAGE"
 // ! ══════════════════════════════════════════════════════════════════════════════ 
// ! หลักการ:
// ! 1. ทุก Error ต้องถูกส่งมาที่นี่ (Single Point of Truth)
// ! 2. ทุก Error ต้องถูก Log (No Silent Failures)
// ! 3. ทุก Error ต้องมีการจัดประเภท (Operational vs Programming)
// ! 4. Error ที่เป็นบั๊ก (Non-Operational) ต้อง Crash Process ทันที
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Flow: Code  throw Error  ErrorHandler  Logger  Log File
// ! ══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { ERROR_HANDLER_CONFIG } from './error-handler-config.js';
import { streamErrorReport } from './error-log-stream.js';
import { renderErrorReport, formatCriticalLogEntry } from './error-renderer.js';
import { createSystemPayload } from './error-emitter.js';
import {
    FALLBACK_RULE_METADATA,
    FALLBACK_ERROR_ENTRY,
    RUNTIME_ERROR_CODES
} from './error-catalog.js';
import {
    normalizeRuleError,
    normalizeSystemError,
    enrichErrorContext,
    createFallbackError
} from './error-normalizer.js';
import { coerceRuleId } from '../constants/rule-constants.js';
import {
    RULE_SEVERITY_FLAGS,
    ERROR_SEVERITY_FLAGS,
    resolveErrorSeveritySlug,
    resolveRuleSeveritySlug,
    coerceRuleSeverity,
    coerceErrorSeverity
} from '../constants/severity-constants.js';

const CONTEXT_PROP_WHITELIST = Object.freeze([
    'source',
    'sourceCode',
    'method',
    'operation',
    'hint',
    'filePath',
    'file',
    'module',
    'ruleId',
    'ruleSlug',
    'ruleName',
    'errorCode',
    'statusCode',
    'severity',
    'severityCode',
    'severityLabel',
    'details',
    'metadata',
    'payload',
    'data',
    'input',
    'position',
    'location',
    'language',
    'type',
    'category',
    'contextTag',
    'originalMessage',
    'originalName',
    'stack'
]);

const FALLBACK_LANGUAGE = 'en';


// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════ Error Handler Class (Singleton)
// ! ══════════════════════════════════════════════════════════════════════════════
class ErrorHandler {
    constructor() {
        this.logDir = path.join(
            process.cwd(), 
            ERROR_HANDLER_CONFIG.LOG_BASE_DIR, 
            ERROR_HANDLER_CONFIG.LOG_ERROR_SUBDIR
        );
        this.errorLogPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_FILENAME);
        this.criticalErrorPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_CRITICAL_FILENAME);
        this.reportPath = path.resolve(process.cwd(), 'validation-report.md');
        this.hasIssues = false;
        // ! คิวงานเขียนไฟล์แบบ Async ป้องกันการ block event loop
        this.logWriteQueue = Promise.resolve();
        this.backgroundTasks = new Set();
        
        // สร้างโฟลเดอร์ logs ถ้ายังไม่มี
        this.initializeLogDirectory();
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! สร้างโฟลเดอร์สำหรับบันทึก Error
    // ! ══════════════════════════════════════════════════════════════════════════════
    initializeLogDirectory() {
        fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ฟังก์ชันหลักในการจัดการ Error
    // ! NO_SILENT_FALLBACKS: ทุก Error ต้องถูก Log และจัดการ
    // ! ══════════════════════════════════════════════════════════════════════════════
    handleError(payload = {}) {
        try {
            this.hasIssues = true;
            const errorInfo = this.normalizeErrorPayload(payload);

            this.scheduleBackgroundTask(this.logError(errorInfo));
            if (ERROR_HANDLER_CONFIG.STREAM_ERRORS !== false) {
                this.scheduleBackgroundTask(streamErrorReport(errorInfo));
            }

            this.decideProcessFate(errorInfo);

            if (errorInfo.isCritical) {
                this.alertCriticalError(errorInfo);
            }

            return errorInfo;

        } catch (handlerError) {
            console.error(ERROR_HANDLER_CONFIG.MSG_ERROR_HANDLER_FAILURE);
            console.error(ERROR_HANDLER_CONFIG.MSG_ORIGINAL_ERROR, payload);
            console.error(ERROR_HANDLER_CONFIG.MSG_HANDLER_ERROR, handlerError);

            if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
                process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
            } else {
                console.error('[TEST MODE] Process exit prevented for testing');
                throw handlerError;
            }
        }
    }

    normalizeErrorPayload(structuredPayload = {}) {
        if (!structuredPayload || typeof structuredPayload !== 'object') {
            throw new TypeError('ErrorHandler.handleError expects a structured payload object.');
        }

        const timestamp = structuredPayload.timestamp || new Date().toISOString();
        const contextInput = (structuredPayload.context && typeof structuredPayload.context === 'object')
            ? structuredPayload.context
            : {};
        const originalError = this.extractOriginalError(structuredPayload, contextInput);
        const mergedContext = this.mergeContextBlocks(structuredPayload, contextInput, originalError);
        const options = this.buildNormalizationOptions(structuredPayload, contextInput, mergedContext, timestamp);

        const normalizedPayload = structuredPayload.normalized || structuredPayload.payload || null;
        const kind = structuredPayload.kind || (normalizedPayload ? 'normalized' : null);

        let normalizedCore;

        if (kind === 'normalized' && normalizedPayload) {
            normalizedCore = enrichErrorContext(normalizedPayload, mergedContext);
            if (!normalizedCore.timestamp) {
                normalizedCore.timestamp = timestamp;
            }
        } else if (kind === 'rule') {
            const resolvedRuleId = coerceRuleId(structuredPayload.ruleId ?? structuredPayload.code)
                ?? FALLBACK_RULE_METADATA.id;
            const severity = coerceRuleSeverity(
                structuredPayload.severityCode,
                RULE_SEVERITY_FLAGS.ERROR
            );
            normalizedCore = normalizeRuleError(
                resolvedRuleId,
                severity,
                mergedContext,
                options
            );
        } else if (kind === 'system') {
            const numericCode = this.toFiniteNumber(structuredPayload.errorCode ?? structuredPayload.code);
            const resolvedErrorCode = Number.isFinite(numericCode) ? numericCode : FALLBACK_ERROR_ENTRY.code;
            const severity = coerceErrorSeverity(
                structuredPayload.severityCode,
                ERROR_SEVERITY_FLAGS.MEDIUM
            );
            normalizedCore = normalizeSystemError(
                resolvedErrorCode,
                severity,
                mergedContext,
                options
            );
        } else {
            const fallbackSeverity = coerceErrorSeverity(
                structuredPayload.severityCode,
                ERROR_SEVERITY_FLAGS.MEDIUM
            );
            normalizedCore = createFallbackError(
                {
                    kind: kind || 'unknown',
                    code: this.toFiniteNumber(structuredPayload.code) ?? null,
                    context: mergedContext
                },
                {
                    ...options,
                    kind: kind || 'unknown',
                    severityCode: fallbackSeverity
                }
            );
        }

        const enriched = enrichErrorContext(normalizedCore, mergedContext);

        return this.composeErrorInfo(enriched, {
            rawInput: structuredPayload,
            contextInput,
            originalError,
            timestamp
        });
    }

    toFiniteNumber(value) {
        const numeric = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    }

    extractOriginalError(rawInput, contextInput) {
        if (rawInput instanceof Error) {
            return rawInput;
        }
        if (contextInput instanceof Error) {
            return contextInput;
        }
        if (rawInput?.error instanceof Error) {
            return rawInput.error;
        }
        if (rawInput?.originalError instanceof Error) {
            return rawInput.originalError;
        }
        if (contextInput?.error instanceof Error) {
            return contextInput.error;
        }
        if (contextInput?.originalError instanceof Error) {
            return contextInput.originalError;
        }
        if (rawInput?.cause instanceof Error) {
            return rawInput.cause;
        }
        if (contextInput?.cause instanceof Error) {
            return contextInput.cause;
        }
        return null;
    }

    mergeContextBlocks(rawInput, contextInput, originalError) {
        const merged = {};

        const mergeCandidate = (candidate) => {
            if (!candidate || typeof candidate !== 'object') {
                return;
            }

            if (candidate.context && typeof candidate.context === 'object') {
                Object.assign(merged, candidate.context);
            }

            for (const key of CONTEXT_PROP_WHITELIST) {
                if (candidate[key] !== undefined && candidate[key] !== null && typeof candidate[key] !== 'function') {
                    merged[key] = candidate[key];
                }
            }
        };

        mergeCandidate(rawInput);
        mergeCandidate(contextInput);

        if (originalError) {
            merged.originalErrorName = originalError.name;
            merged.originalErrorMessage = originalError.message;
        }

        return merged;
    }

    buildNormalizationOptions(rawInput, contextInput, mergedContext, timestamp) {
        const language = this.resolveLanguageCandidate(rawInput, contextInput, mergedContext);
        const filePath = this.resolveFilePathCandidate(rawInput, contextInput, mergedContext);
        const location = this.resolveLocationOption(rawInput, contextInput, mergedContext);
        const sourceCode = rawInput?.sourceCode ?? contextInput?.sourceCode ?? mergedContext.sourceCode ?? null;

        const options = {
            language,
            sourceCode,
            filePath,
            location,
            timestamp
        };

        if (rawInput?.codeFrame) {
            options.codeFrame = rawInput.codeFrame;
        } else if (contextInput?.codeFrame) {
            options.codeFrame = contextInput.codeFrame;
        } else if (mergedContext.codeFrame) {
            options.codeFrame = mergedContext.codeFrame;
        }

        if (!options.position && contextInput?.position) {
            options.position = contextInput.position;
        }
        if (!options.position && rawInput?.position) {
            options.position = rawInput.position;
        }

        return options;
    }

    resolveLanguageCandidate(rawInput, contextInput, mergedContext) {
        if (typeof rawInput?.language === 'string') {
            return rawInput.language;
        }
        if (typeof contextInput?.language === 'string') {
            return contextInput.language;
        }
        if (typeof mergedContext.language === 'string') {
            return mergedContext.language;
        }
        return FALLBACK_LANGUAGE;
    }

    resolveFilePathCandidate(rawInput, contextInput, mergedContext) {
        return rawInput?.filePath || contextInput?.filePath || mergedContext.filePath || null;
    }

    resolveLocationOption(rawInput, contextInput, mergedContext) {
        return rawInput?.location ||
            rawInput?.position ||
            contextInput?.location ||
            contextInput?.position ||
            mergedContext.location ||
            null;
    }

    composeErrorInfo(normalized, meta) {
        const { rawInput, contextInput, originalError, timestamp } = meta;
        const finalTimestamp = normalized.timestamp || timestamp;
        const timestampLocal = this.formatLocalTimestamp(finalTimestamp);

        const severityCode = normalized.severityCode;
        const severityLabel = normalized.severityLabel || (
            normalized.kind === 'rule'
                ? resolveRuleSeveritySlug(severityCode)
                : resolveErrorSeveritySlug(severityCode)
        );

        const originalMessage = this.resolveOriginalMessage(rawInput, contextInput, originalError);
        const messageFromDictionary = normalized.message || null;
        const displayMessage = originalMessage && originalMessage.trim().length > 0
            ? originalMessage
            : (messageFromDictionary || ERROR_HANDLER_CONFIG.DEFAULT_ERROR_MESSAGE);

        const contextValue = (normalized.context && typeof normalized.context === 'object')
            ? normalized.context
            : {};

        const info = {
            kind: normalized.kind || 'unknown',
            code: normalized.code ?? null,
            errorCode: normalized.errorCode ?? normalized.code ?? null,
            ruleId: normalized.ruleId ?? null,
            ruleSlug: normalized.ruleSlug ?? null,
            severityCode,
            severityLabel,
            severity: severityLabel,
            message: displayMessage,
            originalMessage,
            normalizedMessage: messageFromDictionary,
            name: this.resolveErrorName(normalized, rawInput, originalError),
            stack: this.resolveStackTrace(rawInput, contextInput, originalError),
            statusCode: this.resolveStatusCode(rawInput, contextInput),
            timestamp: finalTimestamp,
            timestampLocal,
            processId: process.pid,
            filePath: normalized.filePath ?? normalized.location?.filePath ?? null,
            location: normalized.location ?? null,
            isOperational: normalized.kind === 'rule',
            isCritical: this.isCriticalSeverity(normalized.kind, severityCode),
            isKnownError: Boolean(normalized.dictionaryEntry),
            context: contextValue,
            normalized,
            sourceSlug: normalized.sourceSlug ?? normalized.metadata?.source?.slug ?? null,
            sourceLabel: normalized.sourceLabel ?? normalized.metadata?.source?.label ?? null,
            sourceCode: normalized.sourceCode ?? normalized.metadata?.source?.code ?? null,
            categorySlug: normalized.categorySlug ?? normalized.metadata?.category?.slug ?? null,
            categoryCode: normalized.categoryCode ?? normalized.metadata?.category?.code ?? null,
            explanation: normalized.explanation ?? null,
            fix: normalized.fix ?? null,
            dictionaryEntry: normalized.dictionaryEntry ?? null
        };

        info.originalError = originalError ? {
            name: originalError.name,
            message: originalError.message,
            stack: originalError.stack
        } : null;

        Object.defineProperty(info, 'rawOriginalError', {
            value: originalError || null,
            enumerable: false,
            configurable: false,
            writable: false
        });

        Object.defineProperty(info, 'rawPayload', {
            value: rawInput,
            enumerable: false,
            configurable: false,
            writable: false
        });

        return info;
    }

    resolveStatusCode(rawInput, contextInput) {
        const candidates = [
            rawInput?.statusCode,
            contextInput?.statusCode,
            rawInput?.context?.statusCode,
            contextInput?.context?.statusCode
        ];

        for (const candidate of candidates) {
            const numeric = this.toFiniteNumber(candidate);
            if (numeric !== null) {
                return numeric;
            }
        }

        return null;
    }

    resolveErrorName(normalized, rawInput, originalError) {
        if (originalError?.name) {
            return originalError.name;
        }
        if (typeof rawInput?.name === 'string' && rawInput.name.trim()) {
            return rawInput.name;
        }
        if (normalized.kind === 'rule' && normalized.ruleSlug) {
            return normalized.ruleSlug;
        }
        if (normalized.kind === 'system' && normalized.metadata?.category?.label) {
            return normalized.metadata.category.label;
        }
        return ERROR_HANDLER_CONFIG.DEFAULT_ERROR_NAME;
    }

    resolveOriginalMessage(rawInput, contextInput, originalError) {
        if (originalError?.message && originalError.message.trim()) {
            return originalError.message;
        }
        if (typeof rawInput?.message === 'string' && rawInput.message.trim()) {
            return rawInput.message;
        }
        if (typeof contextInput?.message === 'string' && contextInput.message.trim()) {
            return contextInput.message;
        }
        if (typeof rawInput?.context?.message === 'string' && rawInput.context.message.trim()) {
            return rawInput.context.message;
        }
        if (typeof contextInput?.context?.message === 'string' && contextInput.context.message.trim()) {
            return contextInput.context.message;
        }
        return null;
    }

    resolveStackTrace(rawInput, contextInput, originalError) {
        const candidates = [
            originalError?.stack,
            typeof rawInput?.stack === 'string' ? rawInput.stack : null,
            typeof contextInput?.stack === 'string' ? contextInput.stack : null,
            typeof rawInput?.context?.stack === 'string' ? rawInput.context.stack : null,
            typeof contextInput?.context?.stack === 'string' ? contextInput.context.stack : null
        ];

        for (const candidate of candidates) {
            if (candidate && candidate.trim().length > 0) {
                return candidate;
            }
        }

        return ERROR_HANDLER_CONFIG.DEFAULT_ERROR_STACK;
    }

    isCriticalSeverity(kind, severityCode) {
        if (!Number.isFinite(severityCode)) {
            return false;
        }

        if (kind === 'rule') {
            return severityCode === RULE_SEVERITY_FLAGS.CRITICAL;
        }

        return severityCode === ERROR_SEVERITY_FLAGS.CRITICAL;
    }

    formatLocalTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            if (Number.isNaN(date.getTime())) {
                return new Date().toLocaleString('th-TH');
            }
            return date.toLocaleString('th-TH');
        } catch (error) {
            return new Date().toLocaleString('th-TH');
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! บันทึก Error ลง Log File + โวยวายแบบไม่แกรงใจใคร 
    // ! NO_SILENT_FALLBACKS: ใช้คิว append แบบ Async เพื่อให้ Log ถูกเขียนครบก่อนปิดโปรเซส
    // ! AGGRESSIVE REPORTING: บอกชัดเจนว่าขาดอะไร ทำไมต้องใช้ แก้อย่างไร
    // ! ══════════════════════════════════════════════════════════════════════════════
    logError(errorInfo) {
        const logEntry = {
            timestamp: errorInfo.timestamp,
            timestampLocal: errorInfo.timestampLocal,
            processId: errorInfo.processId,
            level: 'ERROR',
            kind: errorInfo.kind,
            code: errorInfo.code,
            ruleId: errorInfo.ruleId,
            ruleSlug: errorInfo.ruleSlug,
            errorCode: errorInfo.errorCode,
            severityCode: errorInfo.severityCode,
            severityLabel: errorInfo.severityLabel,
            isOperational: errorInfo.isOperational,
            isCritical: errorInfo.isCritical,
            isKnownError: errorInfo.isKnownError,
            statusCode: errorInfo.statusCode,
            source: {
                code: errorInfo.sourceCode,
                slug: errorInfo.sourceSlug,
                label: errorInfo.sourceLabel
            },
            category: {
                code: errorInfo.categoryCode,
                slug: errorInfo.categorySlug
            },
            name: errorInfo.name,
            message: errorInfo.message,
            originalMessage: errorInfo.originalMessage,
            normalizedMessage: errorInfo.normalizedMessage,
            explanation: errorInfo.explanation,
            fix: errorInfo.fix,
            filePath: errorInfo.filePath,
            location: errorInfo.location,
            context: errorInfo.context,
            stack: errorInfo.stack
        };

        const logString = JSON.stringify(logEntry, null, 2) + '\n' + ERROR_HANDLER_CONFIG.LOG_SEPARATOR + '\n';

        renderErrorReport(errorInfo);

        let lastWritePromise = this.queueLogWrite(this.errorLogPath, logString);

        if (errorInfo.isCritical) {
            const criticalLog = formatCriticalLogEntry(logString);
            lastWritePromise = this.queueLogWrite(this.criticalErrorPath, criticalLog);
        }

        return lastWritePromise;
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ตัดสินใจว่าจะปิด Process หรือไม่
    // !  NO_SILENT_FALLBACKS: Error ที่เป็นบั๊กต้อง Crash ทันที
    // ! ══════════════════════════════════════════════════════════════════════════════
    decideProcessFate(errorInfo) {
        if (errorInfo.isCritical) {
            console.error('\n' + ERROR_HANDLER_CONFIG.MSG_CRITICAL_DETECTED);
            console.error('This is a non-operational error (likely a bug).');
            console.error('Application will shut down to prevent data corruption.');
            console.error('Process Manager (PM2/systemd) should restart the application.');
            console.error('\nShutting down in 1 second...\n');
            
            // ป้องกันการ exit ในโหมด test เพื่อให้ Jest เขียน log ได้
            if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
                // ให้เวลา 1 วินาที สำหรับ Log ถูกเขียนเสร็จ
                setTimeout(() => {
                    this.flushAsyncOperations().finally(() => {
                        process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
                    });
                }, ERROR_HANDLER_CONFIG.SHUTDOWN_DELAY_MS);
            } else {
                console.error('[TEST MODE] Process exit prevented for testing');
            }
        }
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! จัดการคิวงาน Async เพื่อป้องกัน unhandled rejection และติดตามสถานะ
    // ! ══════════════════════════════════════════════════════════════════════════════
    scheduleBackgroundTask(taskPromise) {
        if (!taskPromise || typeof taskPromise.then !== 'function') {
            return;
        }

        this.backgroundTasks.add(taskPromise);
        taskPromise.finally(() => {
            this.backgroundTasks.delete(taskPromise);
        });
    }

    queueLogWrite(targetPath, payload) {
        this.logWriteQueue = this.logWriteQueue
            .catch(() => undefined)
            .then(async () => {
                try {
                    await fsPromises.appendFile(targetPath, payload, 'utf8');
                } catch (writeError) {
                    console.error(ERROR_HANDLER_CONFIG.MSG_LOG_WRITE_FAILURE, writeError.message);
                    console.error('Target log path that failed:', targetPath);
                }
            });

        return this.logWriteQueue;
    }

    flushAsyncOperations() {
        const pending = Array.from(this.backgroundTasks);
        pending.push(this.logWriteQueue.catch(() => undefined));
        return Promise.allSettled(pending);
    }

    async handleViolations(violationsByFile, allRules = {}) {
        const hasViolations = violationsByFile && Object.keys(violationsByFile).length > 0;

        if (!hasViolations) {
            this.hasIssues = false;
            await this.clearValidationReport();
            return;
        }

        this.hasIssues = true;

        try {
            const markdownContent = await this.generateMarkdownReport(violationsByFile, allRules);

            this.logWriteQueue = this.logWriteQueue
                .catch(() => undefined)
                .then(async () => {
                    await fsPromises.writeFile(this.reportPath, markdownContent, 'utf8');
                });

            await this.logWriteQueue;
        } catch (reportError) {
            createSystemPayload(
                RUNTIME_ERROR_CODES.REPORT_GENERATION_FAILURE,
                reportError,
                {
                    source: 'ReportGenerator',
                    method: 'handleViolations',
                    isFatal: false
                },
                {
                    severityCode: ERROR_SEVERITY_FLAGS.MEDIUM
                }
            );
        }
    }

    async generateMarkdownReport(violationsByFile, allRules = {}) {
        const entries = Object.entries(violationsByFile)
            .map(([filePath, violations]) => [path.resolve(filePath), violations])
            .sort((a, b) => a[0].localeCompare(b[0]));

        const totalViolations = entries.reduce((acc, [, violations]) => acc + violations.length, 0);
        const totalFiles = entries.length;
        const generatedAt = new Date();

        const ruleCounts = new Map();
        for (const [, violations] of entries) {
            for (const violation of violations) {
                const ruleId = violation.ruleId || 'UNKNOWN_RULE';
                ruleCounts.set(ruleId, (ruleCounts.get(ruleId) || 0) + 1);
            }
        }

        let reportContent = '# Chahuadev Sentinel: Validation Report\n\n';
        reportContent += `สร้างเมื่อ: ${generatedAt.toLocaleString('th-TH')}\n\n`;
        reportContent += `##  พบ ${totalViolations} ความผิดกฎใน ${totalFiles} ไฟล์\n\n`;

        if (ruleCounts.size > 0) {
            reportContent += '### สรุปตามกฎ\n\n';
            reportContent += '| กฎ | จำนวน |\n| --- | ---: |\n';
            const sortedRuleCounts = Array.from(ruleCounts.entries())
                .sort((a, b) => {
                    if (b[1] === a[1]) {
                        return a[0].localeCompare(b[0]);
                    }
                    return b[1] - a[1];
                });

            for (const [ruleId, count] of sortedRuleCounts) {
                const ruleMeta = allRules?.[ruleId] || {};
                const ruleName = this.resolveLocalizedText(ruleMeta.name, ruleId);
                reportContent += `| ${ruleId} — ${ruleName} | ${count} |\n`;
            }

            reportContent += '\n';
        }

        for (const [filePath, violations] of entries) {
            const relativePath = path.relative(process.cwd(), filePath);
            const displayPath = relativePath.startsWith('..') ? filePath : relativePath;
            const sortedViolations = [...violations].sort((a, b) => {
                const lineA = typeof a.line === 'number' ? a.line : Number.MAX_SAFE_INTEGER;
                const lineB = typeof b.line === 'number' ? b.line : Number.MAX_SAFE_INTEGER;
                if (lineA === lineB) {
                    return (a.ruleId || '').localeCompare(b.ruleId || '');
                }
                return lineA - lineB;
            });

            reportContent += `###  ไฟล์: \`${displayPath}\`\n\n`;

            for (const violation of sortedViolations) {
                const ruleId = violation.ruleId || 'UNKNOWN_RULE';
                const ruleMeta = allRules?.[ruleId] || violation.ruleMetadata || {};
                const severity = (violation.severity || ruleMeta.severity || 'INFO').toString().toUpperCase();
                const ruleName = this.resolveLocalizedText(ruleMeta.name, ruleId);
                const description = this.resolveLocalizedText(ruleMeta.description, 'ไม่มีคำอธิบาย');
                const fix = this.resolveLocalizedText(ruleMeta.fix || violation.guidance?.how, 'ไม่มีคำแนะนำเพิ่มเติม');
                const message = violation.message || 'ไม่ระบุข้อความแจ้งเตือน';
                const lineInfo = typeof violation.line === 'number' ? violation.line : null;
                const columnInfo = typeof violation.column === 'number' ? violation.column : null;

                reportContent += `####  ${ruleId} — ${ruleName}\n`;
                reportContent += `* ระดับความรุนแรง: **${severity}**\n`;
                reportContent += `* ข้อความ: ${message}\n`;
                if (lineInfo !== null) {
                    const location = columnInfo !== null ? `${lineInfo}:${columnInfo}` : lineInfo;
                    reportContent += `* ตำแหน่ง: บรรทัด ${location}\n`;
                }
                reportContent += `* คำอธิบายกฎ: ${description}\n`;
                reportContent += `* วิธีแก้ไข:\n    > ${fix}\n`;

                const snippet = await this.getCodeSnippet(filePath, lineInfo);
                reportContent += `* บริบทโค้ด:\n\n${snippet}\n\n---\n\n`;
            }
        }

        reportContent += '\n> รายงานนี้สร้างโดย ErrorHandler ของ Chahuadev Sentinel';

        return reportContent;
    }

    async getCodeSnippet(filePath, lineNumber) {
        if (!filePath) {
            return '*ไม่พบข้อมูลไฟล์สำหรับสร้างบริบทโค้ด*\n';
        }

        try {
            const resolvedPath = path.resolve(filePath);
            const content = await fsPromises.readFile(resolvedPath, 'utf8');
            const lines = content.split(/\r?\n/);

            if (lines.length === 0) {
                return '*ไฟล์ไม่มีเนื้อหา*\n';
            }

            const index = typeof lineNumber === 'number' && !Number.isNaN(lineNumber)
                ? Math.max(0, Math.min(lineNumber - 1, lines.length - 1))
                : 0;

            const windowSize = 2;
            const start = Math.max(0, index - windowSize);
            const end = Math.min(lines.length - 1, index + windowSize);
            const snippetLines = [];

            for (let i = start; i <= end; i += 1) {
                const currentLine = i + 1;
                const indicator = (lineNumber && currentLine === lineNumber) ? '>' : ' ';
                snippetLines.push(`${indicator} ${String(currentLine).padStart(4, ' ')} | ${lines[i]}`);
            }

            const language = path.extname(resolvedPath).replace('.', '') || 'text';
            return ['```' + language, ...snippetLines, '```'].join('\n');
        } catch (error) {
            return '*ไม่สามารถอ่านโค้ดอ้างอิงได้*\n';
        }
    }

    async clearValidationReport() {
        try {
            await fsPromises.unlink(this.reportPath);
        } catch (error) {
            if (error?.code !== 'ENOENT') {
                process.stderr.write(`[REPORT] Failed to remove validation report: ${error.message}\n`);
            }
        }
    }

    resolveLocalizedText(value, fallback = '') {
        if (!value) {
            return fallback;
        }

        if (typeof value === 'string') {
            return value;
        }

        if (typeof value === 'object') {
            if (value.th) {
                return value.th;
            }
            if (value.en) {
                return value.en;
            }
            const [firstKey] = Object.keys(value);
            if (firstKey) {
                return value[firstKey];
            }
        }

        return fallback;
    }

    getReportPath() {
        return this.reportPath;
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! แจ้งเตือน Critical Error (สามารถเชื่อมต่อกับ Monitoring Service)
     // ! ══════════════════════════════════════════════════════════════════════════════
    alertCriticalError(errorInfo) {
        // ! ในอนาคตสามารถส่งไปที่:
        // ! - Slack/Discord Webhook
        // ! - Email
        // ! - SMS
        // ! - PagerDuty
        // ! - Sentry.io

        const alertMessage = `
${ERROR_HANDLER_CONFIG.MSG_CRITICAL_ALERT}
Time: ${errorInfo.timestampLocal}
Name: ${errorInfo.name}
Message: ${errorInfo.message}
Dictionary: ${errorInfo.normalizedMessage || 'N/A'}
Process: ${errorInfo.processId}

This error requires immediate attention!
        `.trim();
        
        console.error(alertMessage);
        
        // TODO: ส่ง alert ไปยัง monitoring service
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! ตรวจสอบว่า Error นี้เป็น Trusted Error หรือไม่
     // ! ══════════════════════════════════════════════════════════════════════════════
    isTrustedError(error) {
        return error.isOperational === true;
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! สร้าง Error Report สำหรับดูภาพรวม
     // ! ══════════════════════════════════════════════════════════════════════════════
    async generateErrorReport() {
        try {
            if (!fs.existsSync(this.errorLogPath)) {
                return {
                    totalErrors: 0,
                    criticalErrors: 0,
                    operationalErrors: 0,
                    message: ERROR_HANDLER_CONFIG.REPORT_NO_ERRORS
                };
            }
            
            const content = fs.readFileSync(this.errorLogPath, 'utf-8');
            const errors = content.split(ERROR_HANDLER_CONFIG.LOG_SEPARATOR).filter(e => e.trim());
            
            const critical = errors.filter(e => e.includes('"isCritical": true')).length;
            const operational = errors.filter(e => e.includes('"isOperational": true')).length;
            
            return {
                totalErrors: errors.length,
                criticalErrors: critical,
                operationalErrors: operational,
                nonOperationalErrors: errors.length - operational,
                logFilePath: this.errorLogPath,
                criticalLogPath: this.criticalErrorPath
            };
        } catch (error) {
            console.error('Failed to generate error report:', error.message);
            throw error;
        }
    }
}

// ! Export Singleton Instance
const errorHandler = new ErrorHandler();

 // ! ══════════════════════════════════════════════════════════════════════════════
 // ! Setup Global Error Handlers
 // ! NO_SILENT_FALLBACKS: ดักจับ Error ที่หลุดลอดมาได้ทุกอัน
 // ! ══════════════════════════════════════════════════════════════════════════════
export function setupGlobalErrorHandlers() {
    // ! 1. Uncaught Exception (Synchronous errors)
    process.on('uncaughtException', (error) => {
        console.error('\nUNCAUGHT EXCEPTION DETECTED');
        createSystemPayload(
            RUNTIME_ERROR_CODES.UNCAUGHT_EXCEPTION,
            error,
            {
                type: 'UNCAUGHT_EXCEPTION',
                contextTag: 'UNCAUGHT_EXCEPTION',
                fatal: true
            },
            {
                severityCode: ERROR_SEVERITY_FLAGS.CRITICAL
            }
        );
        // ! handleError จะจัดการการปิด Process เอง
    });
    
    // ! 2. Unhandled Promise Rejection (Async errors)
    process.on('unhandledRejection', (reason, promise) => {
        console.error('\nUNHANDLED PROMISE REJECTION DETECTED');
        
        // reason อาจไม่ใช่ Error object
        const error = reason instanceof Error ? reason : new Error(String(reason));
        error.isOperational = false; // Promise Rejection ที่ไม่ถูก Handle คือบั๊ก

        createSystemPayload(
            RUNTIME_ERROR_CODES.UNHANDLED_REJECTION,
            error,
            {
                type: 'UNHANDLED_REJECTION',
                contextTag: 'UNHANDLED_REJECTION',
                promise: promise.toString(),
                promiseInfo: promise.toString(),
                fatal: true
            },
            {
                severityCode: ERROR_SEVERITY_FLAGS.CRITICAL
            }
        );
    });
    
    // ! 3. Process Warning (สำหรับ deprecation warnings)
    process.on('warning', (warning) => {
        console.warn('\nPROCESS WARNING');
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
        
        // Warning ไม่ Fatal แต่ควร Log ไว้
        const warningError = new Error(warning.message);
        warningError.name = warning.name;
        warningError.isOperational = true; // Warning ไม่ใช่ Error ที่ต้อง Crash

        createSystemPayload(
            RUNTIME_ERROR_CODES.PROCESS_WARNING,
            warningError,
            {
                type: 'PROCESS_WARNING',
                contextTag: 'PROCESS_WARNING',
                fatal: false
            },
            {
                severityCode: ERROR_SEVERITY_FLAGS.LOW
            }
        );
    });
    
    console.log('Global error handlers initialized');
}

export default errorHandler;
