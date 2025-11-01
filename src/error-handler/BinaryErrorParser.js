// ! ═══════════════════════════════════════════════════════════════════════════════
// ! BinaryErrorParser.js - Binary Error Parser + Logger + Renderer
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! หน้าที่: แกะ Binary Code  ค้นหา Grammar  Render เป็นภาษามนุษย์  Log + Throw
// ! ═══════════════════════════════════════════════════════════════════════════════

import { binaryErrorGrammar } from './binary-error.grammar.js';
import { binaryErrorCatalog } from './binary-error-catalog.js';
import logStream from './binary-log-stream.js';

// Dynamic import to avoid circular dependency
let reportFunc, BinaryCodes;
async function loadDependencies() {
    if (!reportFunc) {
        const reporterModule = await import('./universal-reporter.js');
        reportFunc = reporterModule.report;
        const codesModule = await import('./binary-codes.js');
        BinaryCodes = codesModule.default;
    }
    return { report: reportFunc, BinaryCodes };
}

class BinaryErrorParser {
    constructor() {
        this.errorLog = [];
        
        // Initialize binary-log-stream (NO_HARDCODE: uses Grammar default)
        const initResult = logStream.initLogStreams();
        
        if (!initResult.success) {
            // FIX: Universal Reporter - Auto-collect
            const { report } = require('./universal-reporter.js');
            const BinaryCodes = require('./binary-codes.js').default;
            report(BinaryCodes.SYSTEM.INITIALIZATION(8003));
        }
        
        // Build Map Lookups for Performance (NO_LOOP_EVERY_TIME)
        this.domainMap = this.buildLookupMap(binaryErrorGrammar.domains);
        this.categoryMap = this.buildLookupMap(binaryErrorGrammar.categories);
        this.severityMap = this.buildLookupMap(binaryErrorGrammar.severities);
        this.sourceMap = this.buildLookupMap(binaryErrorGrammar.sources);
    }
    
    /**
     * สร้าง Map Lookup จาก Grammar Object สำหรับ Performance
     * @private
     */
    buildLookupMap(grammarSection) {
        const map = new Map();
        for (const [key, value] of Object.entries(grammarSection)) {
            if (key.startsWith('__')) continue; // Skip metadata fields
            if (value && typeof value.code === 'number') {
                map.set(value.code, { name: key, ...value });
            }
        }
        return map;
    }

    /**
     * แกะ Binary Code เป็น components (64-bit decomposition with BigInt)
     * Structure: Domain(16) | Category(16) | Severity(8) | Source(8) | Offset(16)
     */
    decomposeBinaryCode(code) {
        // Convert to BigInt for accurate 64-bit operations
        const bigCode = BigInt(code);
        
        // Extract components using BigInt bit shifting
        const domain = Number((bigCode >> 48n) & 0xFFFFn);
        const category = Number((bigCode >> 32n) & 0xFFFFn);
        const severity = Number((bigCode >> 24n) & 0xFFn);
        const source = Number((bigCode >> 16n) & 0xFFn);
        const offset = Number(bigCode & 0xFFFFn);

        return { domain, category, severity, source, offset };
    }

    /**
     * ค้นหา domain metadata จาก Map (O(1) instead of O(n))
     */
    findDomain(domainCode) {
        return this.domainMap.get(domainCode) || null;
    }

    /**
     * ค้นหา category metadata จาก Map (O(1) instead of O(n))
     */
    findCategory(categoryCode) {
        return this.categoryMap.get(categoryCode) || null;
    }

    /**
     * ค้นหา severity metadata จาก Map (O(1) instead of O(n))
     */
    findSeverity(severityCode) {
        return this.severityMap.get(severityCode) || null;
    }

    /**
     * ค้นหา source metadata จาก Map (O(1) instead of O(n))
     */
    findSource(sourceCode) {
        return this.sourceMap.get(sourceCode) || null;
    }

    /**
     * จัดการ Error Payload ที่เข้ามาจาก binary-reporter.js
     */
    handleError(payload) {
        // Pure Binary: ไม่มี kind field แล้ว - เป็น binary 100%
        const { code } = payload;
        // ! FIX BUG-003: ป้องกัน null context crash - ใช้ || แทน default parameter
        const context = payload.context || {};

        // แกะ Binary Code
        const components = this.decomposeBinaryCode(code);

        // ค้นหา metadata จาก grammar using Map Lookup (O(1))
        const domainInfo = this.findDomain(components.domain);
        const categoryInfo = this.findCategory(components.category);
        const severityInfo = this.findSeverity(components.severity);
        const sourceInfo = this.findSource(components.source);

        // สร้าง Error Object (Pure Binary - ไม่มี kind)
        const errorObject = {
            timestamp: new Date().toISOString(),
            binaryCode: code,
            components: {
                domain: components.domain,
                category: components.category,
                severity: components.severity,
                source: components.source,
                offset: components.offset
            },
            metadata: {
                domain: domainInfo,
                category: categoryInfo,
                severity: severityInfo,
                source: sourceInfo
            },
            context
        };

        // บันทึกลง memory log
        this.errorLog.push(errorObject);

        // Render เป็นภาษามนุษย์
        const humanReadable = this.renderHumanReadable(errorObject);

        // Log to binary-log-stream (auto-categorized by severity)
        const severityCode = components.severity;
        // ! FIX BUG-004: ไม่ spread context เพื่อป้องกัน circular reference crash
        // แทนที่จะเป็น ...context (spread operator) ให้ส่ง context เป็น nested object
        logStream.writeLog(severityCode, humanReadable, {
            binaryCode: code,
            domain: domainInfo?.label,
            category: categoryInfo?.label,
            source: sourceInfo?.label,
            context: context // ส่งเป็น nested object แทน spread
        });

        // ! NO_THROW: ไม่ throw error ออกไป - ให้เป็นหน้าที่ของ caller ตัดสินใจ
        // ! การันตี 100%: error ถูก log แล้วก่อนถึงจุดนี้ - จะไม่หายไปไหน
        // ! BinaryErrorParser เป็นเพียง "บริษัทรับเหมา" - รับ error เข้ามา log แล้ว return
        // ! ไม่ใช่หน้าที่ของเราที่จะ throw หรือหยุดระบบ
        
        return errorObject;
    }

    /**
     * แปลง Binary Error เป็นภาษามนุษย์ที่อ่านง่าย
     */
    renderHumanReadable(errorObject) {
        const { binaryCode, timestamp, components, metadata, context } = errorObject;
        const { domain, category, severity, source } = metadata;

        const lines = [];
        
        lines.push('');
        lines.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
        lines.push('║                          BINARY ERROR DETECTED                                ║');
        lines.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
        lines.push('');
        
        // Binary Code Information
        lines.push(`[Binary Code]    ${binaryCode}`);
        lines.push(`[Timestamp]      ${timestamp}`);
        lines.push('');
        
        // Human-Readable Explanation from Catalog (แยกค้นหา domain และ category)
        const domainCatalog = domain?.name ? binaryErrorCatalog.domains?.[domain.name] : null;
        const categoryCatalog = category?.name ? binaryErrorCatalog.categories?.[category.name] : null;
        
        // แสดง Domain Explanation
        if (domainCatalog && domainCatalog.humanReadable) {
            const hr = domainCatalog.humanReadable;
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ DOMAIN EXPLANATION                                                          │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            if (hr.when) lines.push(`│ WHEN:   ${hr.when}`);
            if (hr.what) lines.push(`│ WHAT:   ${hr.what}`);
            if (hr.why) lines.push(`│ WHY:    ${hr.why}`);
            if (hr.where) lines.push(`│ WHERE:  ${hr.where}`);
            if (hr.impact) lines.push(`│ IMPACT: ${hr.impact}`);
            if (hr.examples && hr.examples.length > 0) {
                lines.push(`│ EXAMPLES:`);
                hr.examples.forEach(ex => lines.push(`│   - ${ex}`));
            }
            if (hr.developerAction) lines.push(`│ FIX:    ${hr.developerAction}`);
            if (hr.userAction) lines.push(`│ USER:   ${hr.userAction}`);
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }
        
        // แสดง Category Explanation
        if (categoryCatalog && categoryCatalog.humanReadable) {
            const hr = categoryCatalog.humanReadable;
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ CATEGORY EXPLANATION                                                        │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            if (hr.what) lines.push(`│ WHAT:   ${hr.what}`);
            if (hr.commonScenarios && hr.commonScenarios.length > 0) {
                lines.push(`│ COMMON SCENARIOS:`);
                hr.commonScenarios.forEach(s => lines.push(`│   - ${s}`));
            }
            if (hr.howToFix && hr.howToFix.length > 0) {
                lines.push(`│ HOW TO FIX:`);
                hr.howToFix.forEach(f => lines.push(`│   - ${f}`));
            }
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }
        
        // Components (Decomposed)
        lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
        lines.push('│ BINARY CODE COMPONENTS                                                      │');
        lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
        lines.push(`│ Domain:          0x${components.domain.toString(16).toUpperCase().padStart(4, '0')} (${components.domain})   ${domain?.label || 'Unknown'}`);
        lines.push(`│ Category:        0x${components.category.toString(16).toUpperCase().padStart(4, '0')} (${components.category})   ${category?.label || 'Unknown'}`);
        lines.push(`│ Severity:        0x${components.severity.toString(16).toUpperCase().padStart(2, '0')} (${components.severity})     ${severity?.label || 'Unknown'} ${severity?.icon || ''}`);
        lines.push(`│ Source:          0x${components.source.toString(16).toUpperCase().padStart(2, '0')} (${components.source})     ${source?.label || 'Unknown'}`);
        lines.push(`│ Offset:          ${components.offset}`);
        lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
        lines.push('');
        
        // Metadata Information
        if (domain) {
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ DOMAIN INFORMATION                                                          │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            lines.push(`│ Name:            ${domain.label}`);
            lines.push(`│ Description:     ${domain.description}`);
            lines.push(`│ Priority:        ${domain.priority}`);
            lines.push(`│ Should Throw:    ${domain.shouldThrow ? 'YES' : 'NO'}`);
            lines.push(`│ Can Retry:       ${domain.canRetry ? 'YES' : 'NO'}`);
            lines.push(`│ Is Recoverable:  ${domain.isRecoverable ? 'YES' : 'NO'}`);
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }

        if (category) {
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ CATEGORY INFORMATION                                                        │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            lines.push(`│ Name:            ${category.label}`);
            lines.push(`│ Description:     ${category.description}`);
            lines.push(`│ Default Severity: ${category.defaultSeverity}`);
            if (category.commonCauses && category.commonCauses.length > 0) {
                lines.push(`│ Common Causes:   `);
                category.commonCauses.forEach(cause => {
                    lines.push(`│   - ${cause}`);
                });
            }
            if (category.fixSuggestions && category.fixSuggestions.length > 0) {
                lines.push(`│ Fix Suggestions: `);
                category.fixSuggestions.forEach(fix => {
                    lines.push(`│   - ${fix}`);
                });
            }
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }

        if (severity) {
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ SEVERITY INFORMATION                                                        │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            lines.push(`│ Level:           ${severity.label} ${severity.icon}`);
            lines.push(`│ Description:     ${severity.description}`);
            lines.push(`│ Should Throw:    ${severity.shouldThrow ? 'YES' : 'NO'}`);
            lines.push(`│ Exit Code:       ${severity.exitCode}`);
            lines.push(`│ Log Level:       ${severity.logLevel.toUpperCase()}`);
            lines.push(`│ Priority:        ${severity.priority}/7`);
            lines.push(`│ Is Recoverable:  ${severity.isRecoverable ? 'YES' : 'NO'}`);
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }

        if (source) {
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ SOURCE INFORMATION                                                          │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            lines.push(`│ Origin:          ${source.label}`);
            lines.push(`│ Description:     ${source.description}`);
            lines.push(`│ Accountability:  ${source.accountability}`);
            lines.push(`│ Logging Level:   ${source.loggingLevel.toUpperCase()}`);
            lines.push(`│ Stack Trace:     ${source.requiresStackTrace ? 'REQUIRED' : 'NOT REQUIRED'}`);
            lines.push(`│ Should Alert:    ${source.shouldAlert ? 'YES' : 'NO'}`);
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }

        // Context Information
        if (Object.keys(context).length > 0) {
            lines.push('┌─────────────────────────────────────────────────────────────────────────────┐');
            lines.push('│ CONTEXT DETAILS                                                             │');
            lines.push('├─────────────────────────────────────────────────────────────────────────────┤');
            Object.entries(context).forEach(([key, value]) => {
                // ! FIX BUG-004: Protect against circular references in context
                let valueStr;
                if (typeof value === 'object') {
                    try {
                        valueStr = JSON.stringify(value);
                    } catch (circularError) {
                        // FIX: Universal Reporter - Auto-collect
                        const { report } = require('./universal-reporter.js');
                        const BinaryCodes = require('./binary-codes.js').default;
                        report(BinaryCodes.SERIALIZER.CIRCULAR_REFERENCE(8004));
                    }
                } else {
                    valueStr = String(value);
                }
                lines.push(`│ ${key.padEnd(16)} ${valueStr}`);
            });
            lines.push('└─────────────────────────────────────────────────────────────────────────────┘');
            lines.push('');
        }

        lines.push('═══════════════════════════════════════════════════════════════════════════════');
        lines.push('');

        return lines.join('\n');
    }

    /**
     * Get log stream stats
     */
    getLogStreamStats() {
        return logStream.getStreamStats();
    }

    /**
     * Get log base directory
     */
    getLogBaseDir() {
        return logStream.getBaseLogDir();
    }

    /**
     * สร้าง Error object สำหรับ throw
     */
    createError(errorObject, humanReadable) {
        const { binaryCode, metadata } = errorObject;
        
        const message = metadata.category 
            ? `[${metadata.severity?.label || 'ERROR'}] ${metadata.category.label}: ${metadata.category.description}`
            : `Binary Error Code: ${binaryCode}`;

        const error = new Error(message);
        error.binaryCode = binaryCode;
        error.errorObject = errorObject;
        error.humanReadable = humanReadable;
        // FIX: Workers set isOperational automatically - trees don't touch it
        error.severity = metadata.severity?.label || 'UNKNOWN';
        error.exitCode = metadata.severity?.exitCode || 1;

        return error;
    }

    /**
     * ดึง error log ทั้งหมด
     */
    getErrorLog() {
        return this.errorLog;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
    }

    /**
     * Flush all log streams to disk
     */
    flushLogs() {
        logStream.flushAll();
    }

    /**
     * Close all log streams
     */
    closeLogStreams() {
        logStream.closeAllStreams();
    }
}

// ! Export singleton instance
const binaryErrorParser = new BinaryErrorParser();

// Cleanup on process exit (binary-log-stream handles this automatically)
// But we also flush explicitly to ensure all data is written
process.on('exit', () => {
    binaryErrorParser.flushLogs();
});

process.on('SIGINT', () => {
    binaryErrorParser.flushLogs();
    process.exit(0);
});

export default binaryErrorParser;
