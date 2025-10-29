/**
 * Error Collector - Real-Time Streaming Error Collection System
 * 
 * วัตถุประสงค์:
 * - เก็บ error ทั้งหมดแบบ non-throwing (ไม่หยุดการทำงาน)
 * - Stream ลง log ทันทีที่เจอ error (real-time)
 * - สรุปยอดรวมเมื่อสแกนเสร็จ
 * 
 * Architecture:
 * 1. Scout (เสก๊า) → กวาดหา error
 * 2. ErrorCollector → เก็บ + stream to log
 * 3. BinaryErrorParser → เขียน log ทันที
 * 4. Summary Report → สรุปท้ายสุด
 * 
 * NO_SILENT_FALLBACKS: ทุก error ต้องถูกเก็บและ report
 */

import { reportError } from './binary-reporter.js';
import BinaryCodes from './binary-codes.js';

export class ErrorCollector {
    constructor(options = {}) {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.streamMode = options.streamMode !== false; // Default: true
        this.throwOnCritical = options.throwOnCritical !== false; // Default: true
        this.maxErrors = options.maxErrors || Infinity;
        this.startTime = Date.now();
    }

    /**
     * Collect error และ stream ลง log ทันที
     * @param {object} binaryCode - Binary error code from BinaryCodes
     * @param {object} context - Error context
     * @param {object} options - Collection options
     */
    collect(binaryCode, context = {}, options = {}) {
        const errorEntry = {
            binaryCode: binaryCode.toString(),
            context,
            timestamp: Date.now(),
            file: context.fileName || context.filePath || 'unknown',
            method: context.method || 'unknown'
        };

        // ! STREAM MODE: Write to log immediately
        // FIX: Binary Error Pattern - Collector uses binary-reporter directly to avoid circular deps
        if (this.streamMode) {
            reportError(binaryCode, context);
        }

        // Categorize by severity
        const severity = this.extractSeverity(binaryCode);
        
        if (severity >= 32) {
            // CRITICAL, FATAL, EMERGENCY
            this.errors.push(errorEntry);
            
            // ! THROW ON CRITICAL: Stop immediately for critical errors (optional)
            if (this.throwOnCritical && !options.nonThrowing) {
                const error = new Error(context.message || 'Critical error detected');
                error.binaryCode = binaryCode;
                error.context = context;
                throw error;
            }
        } else if (severity >= 8) {
            // WARNING, ERROR
            this.errors.push(errorEntry);
        } else {
            // TRACE, DEBUG, INFO
            this.info.push(errorEntry);
        }

        // ! MAX ERRORS: Stop collection if limit reached
        if (this.errors.length >= this.maxErrors) {
            const limitError = new Error(`Maximum error limit reached: ${this.maxErrors}`);
            limitError.isLimitReached = true;
            throw limitError;
        }

        return errorEntry;
    }

    /**
     * Collect warning (non-blocking)
     */
    warn(binaryCode, context = {}) {
        const warningEntry = {
            binaryCode: binaryCode.toString(),
            context,
            timestamp: Date.now(),
            severity: 'WARNING'
        };

        this.warnings.push(warningEntry);

        // FIX: Binary Error Pattern - Collector uses binary-reporter directly to avoid circular deps
        if (this.streamMode) {
            reportError(binaryCode, context);
        }

        return warningEntry;
    }

    /**
     * Collect info (non-blocking, non-error)
     */
    log(binaryCode, context = {}) {
        const infoEntry = {
            binaryCode: binaryCode.toString(),
            context,
            timestamp: Date.now(),
            severity: 'INFO'
        };

        this.info.push(infoEntry);

        // FIX: Binary Error Pattern - Collector uses binary-reporter directly to avoid circular deps
        if (this.streamMode) {
            reportError(binaryCode, context);
        }

        return infoEntry;
    }

    /**
     * Extract severity from binary code
     */
    extractSeverity(binaryCode) {
        const bigCode = BigInt(binaryCode);
        return Number((bigCode >> 24n) & 0xFFn);
    }

    /**
     * Check if any errors collected
     */
    hasErrors() {
        return this.errors.length > 0;
    }

    /**
     * Check if any warnings collected
     */
    hasWarnings() {
        return this.warnings.length > 0;
    }

    /**
     * Get total count
     */
    getTotalCount() {
        return this.errors.length + this.warnings.length + this.info.length;
    }

    /**
     * Get error count by severity
     */
    getCountBySeverity() {
        const counts = {
            critical: 0,
            error: 0,
            warning: 0,
            info: 0
        };

        for (const error of this.errors) {
            const severity = this.extractSeverity(error.binaryCode);
            if (severity >= 32) {
                counts.critical++;
            } else if (severity >= 16) {
                counts.error++;
            } else if (severity >= 8) {
                counts.warning++;
            }
        }

        counts.info = this.info.length;
        counts.warning += this.warnings.length;

        return counts;
    }

    /**
     * Get errors grouped by file
     */
    getErrorsByFile() {
        const byFile = {};

        for (const error of this.errors) {
            const file = error.file || 'unknown';
            if (!byFile[file]) {
                byFile[file] = [];
            }
            byFile[file].push(error);
        }

        return byFile;
    }

    /**
     * Generate summary report
     */
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;

        return {
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                totalInfo: this.info.length,
                totalCount: this.getTotalCount(),
                duration: `${duration}ms`,
                startTime: new Date(this.startTime).toISOString(),
                endTime: new Date(endTime).toISOString()
            },
            bySeverity: this.getCountBySeverity(),
            byFile: this.getErrorsByFile(),
            errors: this.errors,
            warnings: this.warnings,
            info: this.info
        };
    }

    /**
     * Clear all collected errors
     */
    clear() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.startTime = Date.now();
    }

    /**
     * Export to JSON
     */
    toJSON() {
        return this.generateReport();
    }
}

/**
 * Create error collector with default options
 */
export function createErrorCollector(options = {}) {
    return new ErrorCollector(options);
}

export default ErrorCollector;
