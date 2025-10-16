#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Professional Scan Logger Module
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Professional Scan Logger Module - ระบบบันทึกผลการสแกนแบบมืออาชีพ
// ! ══════════════════════════════════════════════════════════════════════════════
// ! โมดูลนี้จะรัน Chahuadev Sentinel และสร้าง log files แบบมืออาชีพ:
// !  - Raw output log (ผลการสแกนดิบ)
// !  - Violation logs แยกตาม rule (การละเมิดแต่ละประเภท)
// !  - Error log (บันทึกข้อผิดพลาด)
// !  - Summary report (รายงานสรุป)
// !  - Performance metrics (ข้อมูลประสิทธิภาพ)
// !  - Security report (รายงานความปลอดภัย)
// ! ══════════════════════════════════════════════════════════════════════════════


import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SecurityManager } from '../../security/security-manager.js';
import errorHandler from '../../error-handler/ErrorHandler.js';
import { GrammarIndex } from './grammar-index.js';



function emitLoggerEvent(message, method, severity = 'INFO', context = {}) {
    const normalizedSeverity = typeof severity === 'string'
        ? severity.toUpperCase()
        : 'INFO';
    const normalizedMessage = typeof message === 'string' && message.trim().length > 0
        ? message
        : 'Professional scan logger event emitted';

    const notice = new Error(normalizedMessage);
    notice.name = 'ProfessionalScanLoggerNotice';
    notice.isOperational = true;

    errorHandler.handleError(notice, {
        source: 'logger.js',
        method,
        severity: normalizedSeverity,
        context
    });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load parser configuration
const configPath = path.join(__dirname, 'parser-config.json');
let PARSER_CONFIG;
try {
    PARSER_CONFIG = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
    errorHandler.handleError(error, {
        source: 'Logger',
        method: 'initialization',
        severity: 'CRITICAL',
        context: `Failed to load parser configuration from ${configPath}`
    });
    throw new Error(`Failed to load parser configuration from ${configPath}: ${error.message}`);
}

// ============================================================================
// Professional Logging System - ระบบบันทึกมืออาชีพ
// ============================================================================

class ProfessionalScanLogger {
    constructor() {
        this.projectName = 'Chahuadev-Sentinel';
        this.logsDir = path.join(process.cwd(), 'logs');

        // Initialize security manager
        emitLoggerEvent('[SECURITY] Initializing security protection for logging...', 'constructor', 'INFO');

        // ! NO_INTERNAL_CACHING: Inject rate limit store
        const rateLimitStore = new Map();
        emitLoggerEvent('[SECURITY] Using in-memory rate limiting for logger. For production, inject Redis.', 'constructor', 'WARNING', {
            rateLimitStore: 'memory'
        });
        
        this.securityManager = new SecurityManager({
            rateLimitStore: rateLimitStore
        });

        try {
            // สร้างโฟลเดอร์ logs หลักถ้ายังไม่มี
            fs.mkdirSync(this.logsDir, { recursive: true });

            // สร้างโฟลเดอร์ย่อยสำหรับโปรเจกต์นี้
            this.projectLogsDir = path.join(this.logsDir, this.projectName);
            fs.mkdirSync(this.projectLogsDir, { recursive: true });

            // สร้างโฟลเดอร์ session ตามวันเวลา
            const now = new Date();
            const dateFolder = now.toISOString().slice(0, 10); // 2025-10-09
            const timeFolder = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // 14-30-45
            this.sessionFolder = `${dateFolder}_${timeFolder}`;
            this.sessionLogsDir = path.join(this.projectLogsDir, this.sessionFolder);

            fs.mkdirSync(this.sessionLogsDir, { recursive: true });
        } catch (err) {
            emitLoggerEvent('Failed to create logging directory structure', 'constructor', 'CRITICAL', {
                errorMessage: err.message
            });
            // WHY: Cannot proceed without logging infrastructure - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Logging system initialization failed: Unable to create directories - ${err.message}`);
            error.isOperational = false; // Infrastructure failure = bug
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'constructor',
                action: 'directory_creation'
            });
            throw error;
        }

        this.startTime = Date.now();
        this.timestamp = this.getTimestamp();

        this.logFiles = {
            rawOutput: path.join(this.sessionLogsDir, `raw-output-${this.timestamp}.log`),
            errors: path.join(this.sessionLogsDir, `errors-${this.timestamp}.log`),
            summary: path.join(this.sessionLogsDir, `SUMMARY-${this.timestamp}.log`),
            performance: path.join(this.sessionLogsDir, `performance-${this.timestamp}.log`),
            audit: path.join(this.sessionLogsDir, `audit-${this.timestamp}.log`),
            security: path.join(this.sessionLogsDir, `SECURITY-${this.timestamp}.log`)
        };
        // ! คิวเขียนไฟล์แบบ Async ต่อไฟล์ เพื่อไม่ให้ I/O บล็อกกันเอง
        this.fileWriteQueues = new Map();
        this.pendingWrites = new Set();
    }

    // ! Helper สำหรับสร้าง instance พร้อมทำ Async initialization (โหลด header/security)
    static async create() {
        const logger = new ProfessionalScanLogger();
        await logger.initialize();
        return logger;
    }

    async initialize() {
        await this.writeSessionHeader();
        await this.writeSecurityReport();
    }

    // ! ================================================================
    // ! ระบบคิวเขียนไฟล์ Async รายไฟล์เพื่อป้องกัน race condition
    // ! ================================================================
    queueFileAppend(targetPath, content, method, context = {}) {
        const previous = this.fileWriteQueues.get(targetPath) || Promise.resolve();

        const nextWrite = previous
            .catch(() => undefined)
            .then(() => fsPromises.appendFile(targetPath, content, 'utf8'))
            .catch(error => {
                emitLoggerEvent('Failed to append log entry', method, 'CRITICAL', {
                    ...context,
                    logFile: targetPath,
                    errorMessage: error.message
                });
                throw error;
            });

        this.fileWriteQueues.set(targetPath, nextWrite);
        this.trackPendingWrite(nextWrite);

        return nextWrite;
    }

    trackPendingWrite(promise) {
        this.pendingWrites.add(promise);
        promise.finally(() => this.pendingWrites.delete(promise));
    }

    async flushWrites() {
        if (this.pendingWrites.size === 0) {
            return;
        }
        await Promise.allSettled(Array.from(this.pendingWrites));
    }

    async writeSessionHeader() {
        const timestamp = new Date().toISOString();
        const header = `\n${'='.repeat(80)}\nSESSION START: ${timestamp} | Project: ${this.projectName}\n${'='.repeat(80)}\n`;

        try {
            await Promise.all(
                Object.values(this.logFiles).map(logFile =>
                    this.queueFileAppend(logFile, header, 'writeSessionHeader', {
                        logFile
                    })
                )
            );
        } catch (err) {
            const error = new Error(`Logging system initialization failed: ${err.message}`);
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'writeSessionHeader'
            });
            throw error;
        }
    }

    async writeSecurityReport() {
        const report = this.securityManager.generateSecurityReport();
        const timestamp = new Date().toISOString();
        
        let securityLog = `\n${'='.repeat(80)}\n`;
        securityLog += `SECURITY REPORT - ${timestamp}\n`;
        securityLog += `${'='.repeat(80)}\n\n`;
        securityLog += `Configuration Level: ${report.securityLevel || 'STANDARD'}\n`;
        securityLog += `Status: ${report.status}\n`;
        securityLog += `Timestamp: ${report.timestamp}\n`;
        securityLog += `\nStatistics:\n`;
        securityLog += `  - Total Events: ${report.statistics?.totalEvents || 0}\n`;
        securityLog += `  - Recent Events: ${report.statistics?.recentEvents || 0}\n`;
        securityLog += `  - Violations: ${report.statistics?.violations || 0}\n`;
        
        if (report.recentViolations && report.recentViolations.length > 0) {
            securityLog += `\n${'='.repeat(80)}\n`;
            securityLog += `RECENT VIOLATIONS\n`;
            securityLog += `${'='.repeat(80)}\n\n`;
            
            report.recentViolations.forEach((violation, index) => {
                securityLog += `${index + 1}. Type: ${violation.type}\n`;
                securityLog += `   Message: ${violation.message}\n`;
                securityLog += `   Timestamp: ${violation.timestamp}\n\n`;
            });
        } else {
            securityLog += `\nNo recent violations detected.\n`;
        }
        
        securityLog += `\n${'='.repeat(80)}\n\n`;
        
        try {
            await this.queueFileAppend(this.logFiles.security, securityLog, 'writeSecurityReport', {
                securityLogPath: this.logFiles.security
            });
            emitLoggerEvent('Security report written', 'writeSecurityReport', 'INFO', {
                securityLogPath: this.logFiles.security
            });
            
            // ส่งรายงานความเปราะบางไปยัง ErrorHandler เพื่อความโปร่งใส
            if (report.vulnerabilities && report.vulnerabilities.length > 0) {
                emitLoggerEvent('Security transparency report generated', 'writeSecurityReport', 'WARNING', {
                    vulnerabilityCount: report.vulnerabilities.length,
                    securityLevel: report.config?.level
                });
                report.vulnerabilities.forEach((vuln, index) => {
                    emitLoggerEvent(`Security vulnerability #${index + 1}`, 'writeSecurityReport', 'WARNING', {
                        type: vuln.type,
                        description: vuln.description
                    });
                });
            }
        } catch (err) {
            emitLoggerEvent('Failed to write security report', 'writeSecurityReport', 'CRITICAL', {
                errorMessage: err.message
            });
            // WHY: Security logging is critical for transparency - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Security report logging failed: ${err.message}`);
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'writeSecurityReport'
            });
            throw error;
        }
    }

    formatLogEntry(level, category, message, data = null) {
        const timestamp = new Date().toISOString();
        let entry = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;

        if (data) {
            entry += `\n  Data: ${JSON.stringify(data, null, 2)}`;
        }

        entry += '\n';
        return entry;
    }

    getTimestamp() {
        const now = new Date();
        return now.toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .replace(/\..+/, '');
    }

    async audit(action, details = null) {
        const entry = this.formatLogEntry('AUDIT', 'SCAN_OPERATION', action, details);
        try {
            await this.queueFileAppend(this.logFiles.audit, entry, 'audit', {
                action,
                details
            });
            emitLoggerEvent('Audit log entry recorded', 'audit', 'INFO', {
                logFile: this.logFiles.audit,
                action,
                details
            });
        } catch (err) {
            emitLoggerEvent('Failed to write audit log entry', 'audit', 'CRITICAL', {
                logFile: this.logFiles.audit,
                action,
                errorMessage: err.message
            });
            // WHY: Audit trail is critical for compliance and debugging - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Audit logging failed: ${err.message}`);
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'audit',
                action: action
            });
            throw error;
        }
    }

    async performance(operation, duration, details = null) {
        const entry = this.formatLogEntry('PERFORMANCE', operation, `Duration: ${duration}ms`, details);
        try {
            await this.queueFileAppend(this.logFiles.performance, entry, 'performance', {
                operation,
                duration,
                details
            });
            emitLoggerEvent('Performance log entry recorded', 'performance', 'INFO', {
                logFile: this.logFiles.performance,
                operation,
                duration,
                details
            });
        } catch (err) {
            emitLoggerEvent('Failed to write performance log entry', 'performance', 'CRITICAL', {
                logFile: this.logFiles.performance,
                operation,
                duration,
                errorMessage: err.message
            });
            // WHY: Performance metrics are essential for system monitoring - must fail loudly (NO_SILENT_FALLBACKS)
            const error = new Error(`Performance logging failed: ${err.message}`);
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'logger.js',
                method: 'performance',
                operation: operation
            });
            throw error;
        }
    }

    async error(category, message, errorObj = null) {
        const data = errorObj ? {
            message: errorObj.message,
            stack: errorObj.stack,
            name: errorObj.name
        } : null;

        const entry = this.formatLogEntry('ERROR', category, message, data);

        const stackPreview = errorObj?.stack ? errorObj.stack.split('\n').slice(0, 5) : undefined;
        emitLoggerEvent('Logger captured error event', 'error', 'ERROR', {
            category,
            message,
            errorName: errorObj?.name,
            errorMessage: errorObj?.message,
            stackPreview
        });

        try {
            await this.queueFileAppend(this.logFiles.errors, entry, 'error', {
                category
            });
            emitLoggerEvent('Error log entry recorded', 'error', 'INFO', {
                logFile: this.logFiles.errors,
                category
            });
        } catch (err) {
            emitLoggerEvent('Failed to write error log entry', 'error', 'CRITICAL', {
                logFile: this.logFiles.errors,
                category,
                errorMessage: err.message
            });
            errorHandler.handleError(err, {
                source: 'Logger',
                method: 'error',
                severity: 'CRITICAL',
                context: `Failed to write error log to ${this.logFiles.errors}`
            });
            // WHY: Error logging failure is catastrophic - if we can't log errors, system is unreliable (NO_SILENT_FALLBACKS)
            throw new Error(`Error logging failed: ${err.message}`);
        }
    }

    getSessionPath() {
        return this.sessionLogsDir;
    }
}

// ============================================================================
// Configuration & Constants
// ============================================================================

const RULES = [
    'NO_EMOJI',
    'NO_HARDCODE',
    'NO_SILENT_FALLBACKS',
    'NO_INTERNAL_CACHING',
    'NO_MOCKING'
];

const COLORS = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    gray: '\x1b[90m'
};

// ============================================================================
// Utility Functions
// ============================================================================

function colorLog(message, color = 'reset', method = 'colorLog') {
    const severityMap = {
        red: 'ERROR',
        yellow: 'WARNING',
        green: 'INFO',
        cyan: 'INFO',
        gray: 'INFO',
        reset: 'INFO'
    };

    const severity = severityMap[color] || 'INFO';
    const colorCode = COLORS[color] || COLORS.reset;
    console.log(`${colorCode}${message}${COLORS.reset}`);
    emitLoggerEvent(message, method, severity, {
        displayColor: color
    });
}

function createHeader(title, count, timestamp) {
    const separator = '='.repeat(80);
    return [
        separator,
        `${title} - Found ${count} instances`,
        separator,
        `Timestamp: ${timestamp}`,
        `Source: src/ directory`,
        separator,
        ''
    ].join('\n');
}

// ============================================================================
// Scan Execution & Processing
// ============================================================================

class ScanProcessor {
    constructor(logger) {
        this.logger = logger;
    }

    async runValidation(targetDir = 'src') {
        colorLog('[STEP 2] Running validation on source files...', 'yellow', 'runValidation');
        colorLog(`  -> Analyzing directory: ${targetDir}`, 'gray', 'runValidation');

        const startTime = Date.now();
        await this.logger.audit('SCAN_START', { targetDirectory: targetDir });

        try {
            // NEW: Direct import and function call (NO execSync!)
            // Load all grammar files
            colorLog('  -> Loading grammar files...', 'gray', 'runValidation');
            const [javascript, typescript, java, jsx] = await Promise.all([
                GrammarIndex.loadGrammar('javascript'),
                GrammarIndex.loadGrammar('typescript'),
                GrammarIndex.loadGrammar('java'),
                GrammarIndex.loadGrammar('jsx')
            ]);

            // Combine grammars
            const combinedGrammar = {
                ...javascript,
                ...typescript,
                ...java,
                ...jsx
            };

            // Initialize ValidationEngine (Production - NO_MOCKING compliant)
            colorLog('  -> Initializing ValidationEngine...', 'gray', 'runValidation');
            const { ValidationEngine } = await import('../../rules/validator.js');
            const validator = new ValidationEngine();
            await validator.initializeParserStudy();

            // Scan files in target directory
            const files = this.getFilesToScan(targetDir);
            colorLog(`  -> Found ${files.length} files to analyze`, 'gray', 'runValidation');

            let allViolations = [];
            let totalErrors = 0;

            for (const filePath of files) {
                try {
                    const code = fs.readFileSync(filePath, 'utf8');
                    colorLog(`  -> Analyzing: ${filePath}`, 'gray', 'runValidation');

                    // Use ValidationEngine for code analysis
                    const result = await validator.validateCode(code, filePath);

                    if (result.violations && result.violations.length > 0) {
                        result.violations.forEach(v => {
                            v.file = filePath; // Add file path to violation
                            allViolations.push(v);
                        });
                        totalErrors += result.violations.length;
                    }
                } catch (fileError) {
                    errorHandler.handleError(fileError, {
                        source: 'ScanProcessor',
                        method: 'runValidation',
                        severity: 'HIGH',
                        context: `Error analyzing file: ${filePath}`
                    });
                    emitLoggerEvent('Error analyzing file during runValidation', 'runValidation', 'ERROR', {
                        filePath,
                        errorMessage: fileError.message
                    });
                    await this.logger.error('FILE_ANALYSIS_ERROR', fileError.message, fileError);
                }
            }

            const duration = Date.now() - startTime;
            await this.logger.performance('SCAN_EXECUTION', duration, {
                targetDirectory: targetDir,
                filesScanned: files.length,
                violationsFound: totalErrors,
                exitCode: totalErrors > 0 ? 1 : 0
            });

            // Format output similar to CLI format
            const output = this.formatViolationsOutput(allViolations);

            const exitCode = totalErrors > 0 ? 1 : 0;
            colorLog(`  [OK] Validation completed with exit code: ${exitCode}`, exitCode === 0 ? 'green' : 'yellow', 'runValidation');
            colorLog(`  -> Found ${totalErrors} violations in ${files.length} files`, 'gray', 'runValidation');

            return { output, exitCode, violations: allViolations };

        } catch (error) {
            errorHandler.handleError(error, {
                source: 'ScanProcessor',
                method: 'runValidation',
                severity: 'CRITICAL',
                context: `Validation execution failed for directory: ${targetDir}`
            });
            const duration = Date.now() - startTime;
            await this.logger.performance('SCAN_EXECUTION', duration, {
                targetDirectory: targetDir,
                exitCode: 1,
                error: error.message
            });

            await this.logger.error('SCAN_ERROR', error.message, error);

            const operationalError = new Error(`Scan failed: ${error.message}`);
            operationalError.isOperational = true;
            errorHandler.handleError(operationalError, {
                source: 'logger.js',
                method: 'runValidation',
                targetDir: targetDir
            });

            throw error;
        }
    }

    /**
     * Get list of JavaScript/TypeScript files to scan
     */
    getFilesToScan(targetDir) {
        const files = [];
        const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];

        const scanDirectory = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Skip node_modules, .git, etc.
                    if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                        scanDirectory(fullPath);
                    }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        };

        scanDirectory(targetDir);
        return files;
    }

    /**
     * Format violations output similar to CLI format
     */
    formatViolationsOutput(violations) {
        if (!violations || violations.length === 0) {
            return 'No violations found.';
        }

        let output = '';
        let currentFile = '';

        violations.forEach(violation => {
            // Group by file
            if (violation.file !== currentFile) {
                if (currentFile) output += '\n';
                output += `\n${violation.file}:\n`;
                currentFile = violation.file;
            }

            // Format violation line
            const line = violation.location?.line || '?';
            const col = violation.location?.column || '?';
            const rule = violation.ruleId || 'unknown';
            const severity = violation.severity || 'error';
            const message = violation.message || 'No message';

            output += `  ${line}:${col}  ${severity}  ${message}  ${rule}\n`;
        });

        output += `\n[x] ${violations.length} problem${violations.length > 1 ? 's' : ''}\n`;

        return output;
    }

    async classifyViolations(output, timestamp) {
        colorLog('[STEP 3] Classifying violations by rule...', 'yellow', 'classifyViolations');

        const violationCounts = {};
        const violationFiles = {};
        const sessionDir = this.logger.getSessionPath();

        for (const rule of RULES) {
            colorLog(`  -> Processing ${rule} violations...`, 'gray', 'classifyViolations');

            const violationLines = [];
            const lines = output.split('\n');

            for (const line of lines) {
                if (line.includes(rule)) {
                    violationLines.push(line);
                }
            }

            const count = violationLines.length;
            violationCounts[rule] = count;

            // สร้างไฟล์ log
            const filename = `violations-${rule}.log`;
            const filepath = path.join(sessionDir, filename);
            violationFiles[rule] = filename;

            let content = createHeader(`${rule} VIOLATIONS`, count, timestamp);

            if (count > 0) {
                content += violationLines.join('\n');
            } else {
                content += 'No violations found.';
            }

            try {
                await fsPromises.writeFile(filepath, content, 'utf8');
            } catch (err) {
                errorHandler.handleError(err, {
                    source: 'ScanProcessor',
                    method: 'saveViolationsByRule',
                    severity: 'CRITICAL',
                    context: `Failed to write violation log: ${filepath}`
                });
                emitLoggerEvent('Failed to write violation log', 'saveViolationsByRule', 'CRITICAL', {
                    filepath,
                    rule,
                    errorMessage: err.message
                });
                // WHY: Cannot continue without proper violation logging - must fail loudly (NO_SILENT_FALLBACKS)
                const error = new Error(`Failed to create violation log for ${rule}: ${err.message}`);
                error.isOperational = false;
                errorHandler.handleError(error, {
                    source: 'logger.js',
                    method: 'classifyViolations',
                    rule: rule,
                    filepath: filepath
                });
                throw error;
            }
            
            await this.logger.audit('VIOLATION_LOG_CREATED', { rule, count, filepath });

            const color = count === 0 ? 'green' : 'red';
            colorLog(`    [INFO] Found ${count} violations`, color, 'classifyViolations');
        }

        return { violationCounts, violationFiles };
    }

    async extractErrors(output, timestamp) {
        colorLog('[STEP 4] Extracting errors...', 'yellow', 'extractErrors');

        const errorPatterns = [
            /Error/i,
            /ERROR/,
            /SyntaxError/,
            /TypeError/,
            /ReferenceError/
        ];

        const errorLines = [];
        const lines = output.split('\n');

        lines.forEach(line => {
            if (errorPatterns.some(pattern => pattern.test(line))) {
                errorLines.push(line);
            }
        });

        const errorCount = errorLines.length;
        const filename = `errors-${timestamp}.log`;
        const filepath = path.join(this.logger.getSessionPath(), filename);

        const separator = '='.repeat(80);
        let content = [
            `ERRORS DETECTED - Found ${errorCount} error lines`,
            separator,
            `Timestamp: ${timestamp}`,
            `Source: src/ directory`,
            separator,
            ''
        ].join('\n');

        if (errorCount > 0) {
            content += errorLines.join('\n');
            colorLog(`  [WARN] Found ${errorCount} error lines`, 'red', 'extractErrors');
            await this.logger.error('SCAN_ERRORS', `Detected ${errorCount} error lines during scan`);
        } else {
            content += 'No errors detected';
            colorLog('  [OK] No errors detected', 'green', 'extractErrors');
        }

        try {
            await fsPromises.writeFile(filepath, content, 'utf8');
        } catch (err) {
            errorHandler.handleError(err, {
                source: 'ScanProcessor',
                method: 'saveErrorLog',
                severity: 'CRITICAL',
                context: `Failed to write error log: ${filepath}`
            });
            emitLoggerEvent('Failed to write extracted error log', 'saveErrorLog', 'CRITICAL', {
                filepath,
                errorMessage: err.message
            });
            // WHY: Error log is essential for debugging - failure to write must be reported (NO_SILENT_FALLBACKS)
            throw new Error(`Failed to create error log: ${err.message}`);
        }

        await this.logger.audit('ERROR_LOG_CREATED', { errorCount, filepath });

        return { errorCount, filename };
    }

    async generateSummary(exitCode, violationCounts, errorCount, violationFiles, timestamp) {
        colorLog('[STEP 5] Generating summary report...', 'yellow', 'generateSummary');

        const totalViolations = Object.values(violationCounts).reduce((sum, count) => sum + count, 0);
        const filename = `SUMMARY-${timestamp}.log`;
        const filepath = path.join(this.logger.getSessionPath(), filename);

        const separator = '='.repeat(80);
        const divider = '-'.repeat(20);

        let content = [
            separator,
            '              CHAHUADEV SENTINEL - SCAN SUMMARY',
            separator,
            `Timestamp: ${timestamp}`,
            `Test Target: src/ directory`,
            `Exit Code: ${exitCode}`,
            separator,
            '',
            'VIOLATION BREAKDOWN:',
            divider
        ];

        // เพิ่มข้อมูลการละเมิดแต่ละ rule
        RULES.sort().forEach(rule => {
            const count = violationCounts[rule] || 0;
            const status = count === 0 ? '[PASS]' : '[FAIL]';
            content.push(`  ${status} | ${rule} : ${count} violations`);
        });

        content.push('');
        content.push(`TOTAL VIOLATIONS: ${totalViolations}`);
        content.push('');
        content.push('ERROR SUMMARY:');
        content.push('-'.repeat(14));
        content.push(`  Total Error Lines: ${errorCount}`);
        content.push(`  Status: ${errorCount === 0 ? '[CLEAN]' : '[NEEDS ATTENTION]'}`);
        content.push('');
        content.push('FILES GENERATED:');
        content.push('-'.repeat(16));
        content.push(`  1. Raw Output: raw-output-${timestamp}.log`);
        
        let fileIndex = 2;
        RULES.forEach(rule => {
            content.push(`  ${fileIndex}. ${rule} Violations: ${violationFiles[rule]}`);
            fileIndex++;
        });
        
        content.push(`  ${fileIndex}. Errors: errors-${timestamp}.log`);
        content.push(`  ${fileIndex + 1}. Summary: ${filename}`);
        content.push(`  ${fileIndex + 2}. Performance: performance-${timestamp}.log`);
        content.push(`  ${fileIndex + 3}. Audit Trail: audit-${timestamp}.log`);
        content.push('');
        content.push(separator);
        content.push('                       END OF REPORT');
        content.push(separator);

        try {
            await fsPromises.writeFile(filepath, content.join('\n'), 'utf8');
        } catch (err) {
            errorHandler.handleError(err, {
                source: 'ScanProcessor',
                method: 'saveSummaryReport',
                severity: 'CRITICAL',
                context: `Failed to write summary report: ${filepath}`
            });
            emitLoggerEvent('Failed to write summary report', 'saveSummaryReport', 'CRITICAL', {
                filepath,
                errorMessage: err.message
            });
            // WHY: Summary report is the primary deliverable - failure must be visible (NO_SILENT_FALLBACKS)
            throw new Error(`Failed to create summary report: ${err.message}`);
        }
        
        await this.logger.audit('SUMMARY_REPORT_CREATED', { totalViolations, errorCount, filepath });
        colorLog('  [OK] Summary report generated', 'green', 'generateSummary');

        return { filename, totalViolations };
    }

    displaySummary(violationCounts, totalViolations, errorCount, sessionDir) {
        console.log('');
        colorLog('================================================', 'cyan', 'displaySummary');
        colorLog('              SCAN RESULTS SUMMARY', 'cyan', 'displaySummary');
        colorLog('================================================', 'cyan', 'displaySummary');
        console.log('');

        RULES.sort().forEach(rule => {
            const count = violationCounts[rule] || 0;
            const color = count === 0 ? 'green' : 'red';
            const symbol = count === 0 ? '[OK]' : '[X]';

            colorLog(`  ${symbol} ${rule} : ${count} violations`, color, 'displaySummary');
        });

        console.log('');
        colorLog(`  Total Violations: ${totalViolations}`, totalViolations === 0 ? 'green' : 'red', 'displaySummary');
        colorLog(`  Total Errors: ${errorCount}`, errorCount === 0 ? 'green' : 'red', 'displaySummary');

        console.log('');
        colorLog(`  All logs saved to: ${sessionDir}`, 'cyan', 'displaySummary');
        console.log('');
        colorLog('================================================', 'cyan', 'displaySummary');
        console.log('');

        const severity = totalViolations === 0 && errorCount === 0 ? 'INFO' : 'WARNING';
        emitLoggerEvent('Scan results summary generated', 'displaySummary', severity, {
            totalViolations,
            errorCount,
            sessionDirectory: sessionDir,
            violationBreakdown: violationCounts
        });
    }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
    colorLog('================================================', 'cyan', 'main');
    colorLog('  CHAHUADEV SENTINEL - PROFESSIONAL SCAN LOGGER', 'cyan', 'main');
    colorLog('================================================', 'cyan', 'main');

    colorLog('[STEP 1] Initializing professional logging system...', 'yellow', 'main');
    const logger = await ProfessionalScanLogger.create();
    colorLog(`  [OK] Logs session created: ${logger.sessionLogsDir}`, 'green', 'main');

    // ! ติดตาม exit code หลังขั้นตอนหลัก เพื่อเรียกใช้หลังการ flush
    let plannedExitCode = null;

    try {
        const processor = new ScanProcessor(logger);
        const { output, exitCode } = await processor.runValidation('src');
        plannedExitCode = exitCode;

        const timestamp = logger.timestamp;
        try {
            await fsPromises.writeFile(logger.logFiles.rawOutput, output, 'utf8');
            emitLoggerEvent('Raw validation output written', 'main', 'INFO', {
                rawOutputPath: logger.logFiles.rawOutput
            });
        } catch (err) {
            emitLoggerEvent('Failed to write raw validation output', 'main', 'CRITICAL', {
                rawOutputPath: logger.logFiles.rawOutput,
                errorMessage: err.message
            });
            errorHandler.handleError(err, {
                source: 'Logger',
                method: 'main',
                severity: 'CRITICAL',
                context: `Failed to write raw output: ${logger.logFiles.rawOutput}`
            });
            throw new Error(`Failed to save raw scan output: ${err.message}`);
        }

        await logger.audit('RAW_OUTPUT_SAVED', { filepath: logger.logFiles.rawOutput });
        colorLog('  [OK] Raw output saved', 'green', 'main');

        const { violationCounts, violationFiles } = await processor.classifyViolations(output, timestamp);
        const { errorCount } = await processor.extractErrors(output, timestamp);
        const { filename: summaryFile, totalViolations } = await processor.generateSummary(
            exitCode,
            violationCounts,
            errorCount,
            violationFiles,
            timestamp
        );

        processor.displaySummary(violationCounts, totalViolations, errorCount, logger.sessionLogsDir);

        const totalDuration = Date.now() - logger.startTime;
        await logger.performance('TOTAL_SCAN_PROCESS', totalDuration, {
            totalViolations,
            errorCount,
            exitCode
        });

        if (totalViolations > 0 || errorCount > 0) {
            colorLog('[WARNING] Issues detected. Check the logs for details.', 'yellow', 'main');
            colorLog(`  Session directory: ${logger.sessionLogsDir}`, 'cyan', 'main');
            colorLog(`  Summary file: ${summaryFile}`, 'cyan', 'main');
        }

        colorLog('[OK] Scan completed successfully!', 'green', 'main');
        colorLog(`[INFO] Session folder: ${logger.sessionFolder}`, 'cyan', 'main');
        colorLog(`[INFO] Total execution time: ${totalDuration}ms`, 'cyan', 'main');

        await logger.audit('SESSION_END', {
            totalDuration,
            totalViolations,
            errorCount,
            exitCode,
            sessionFolder: logger.sessionFolder
        });
    } finally {
        // ! รับประกันว่าคิวการเขียนแบบ Async ถูกระบายก่อนจบโปรเซส
        try {
            await logger.flushWrites();
        } catch (flushError) {
            emitLoggerEvent('Failed to flush logger writes', 'main', 'WARNING', {
                errorMessage: flushError.message
            });
        }
    }

    if (plannedExitCode !== null) {
        process.exit(plannedExitCode);
    }
}

// ============================================================================
// Execute if run directly
// ============================================================================

const isMainModule = import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
    main().catch(error => {
        emitLoggerEvent('Fatal error encountered in main execution', 'main', 'CRITICAL', {
            errorMessage: error.message,
            stackPreview: error.stack ? error.stack.split('\n').slice(0, 5) : undefined
        });
        errorHandler.handleError(error, {
            source: 'Logger',
            method: 'main',
            severity: 'CRITICAL',
            context: 'Fatal error in main execution'
        });
        process.exit(1);
    });
}

export {
    ProfessionalScanLogger,
    ScanProcessor,
    main
};
