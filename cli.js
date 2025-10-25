#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
/**
 * Chahuadev Sentinel CLI
 * Command-line interface for code quality checking
 * WITH SECURITY PROTECTION + CONSOLE FALLBACK LOGGER (กล้องวงจรปิด)
 */

import { ABSOLUTE_RULES, ValidationEngine } from './src/rules/validator.js';
import { SecurityManager } from './src/security/security-manager.js';
import { coerceRuleId, resolveRuleSlug } from './src/constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS, coerceRuleSeverity, resolveRuleSeveritySlug } from './src/constants/severity-constants.js';
import { handleSystemError, handleValidationError, handleIOError, reportError } from './src/error-handler/binary-reporter.js';
import BinaryCodes from './src/error-handler/binary-codes.js';
import { ErrorCollector } from './src/error-handler/error-collector.js';

import fs from 'fs';
import path from 'path';// Load CLI configuration from JSON 
const cliConfig = JSON.parse(
    fs.readFileSync(new URL('./cli-config.json', import.meta.url), 'utf8')
);

class ChahuadevCLI {
    constructor() {
        this.engine = null;
        this.config = cliConfig; // WHY: Store config reference for use in methods (NO_HARDCODE)
        this.stats = {
            totalFiles: 0,
            totalViolations: 0,
            processedFiles: 0
        };
        this.securityManager = null;
        this.currentScanOptions = null;
        // ! ERROR COLLECTOR: เก็บ error แบบ streaming (ไม่หยุดการทำงาน)
        this.errorCollector = new ErrorCollector({
            streamMode: true,        // เขียน log ทันที
            throwOnCritical: false,  // ไม่ throw แม้เจอ critical error (เก็บต่อไป)
            maxErrors: 10000         // จำกัด 10k errors เพื่อป้องกัน infinite loop
        });
    }

    async initialize() {
        try {
            // Initialize security system
            console.log('[SECURITY] Initializing security protection...');
            
            // ! NO_INTERNAL_CACHING: Create rate limit store and inject it
            const rateLimitStore = new Map();
            console.log('[SECURITY] Using in-memory rate limiting (suitable for CLI single-process)');
            
            // Create SecurityManager with injected store
            this.securityManager = new SecurityManager({
                rateLimitStore: rateLimitStore
            });
            
            // Show security status
            const securityReport = this.securityManager.generateSecurityReport();
            console.log(`[SECURITY] Protection Level: ${securityReport.securityLevel}`);
            console.log(`[SECURITY] Status: ${securityReport.status}`);
            
            // Show vulnerabilities if any
            if (securityReport.vulnerabilities && securityReport.vulnerabilities.length > 0) {
                console.log(`[WARNING] Found ${securityReport.vulnerabilities.length} potential security concerns:`);
                securityReport.vulnerabilities.forEach((vuln, index) => {
                    console.log(`  ${index + 1}. ${vuln.type}: ${vuln.description}`);
                });
            }
            
            // อ่านกฎจาก validator.js (หนังสือ) และส่งต่อให้ ValidationEngine
            this.rules = ABSOLUTE_RULES;
            this.engine = new ValidationEngine();
            await this.engine.initializeParserStudy();
            console.log(cliConfig.messages.cliInitialized);
            return true;
        } catch (error) {
            // FIX: Binary Error Pattern
            handleSystemError('CONFIGURATION', 1001, error);
            return false;
        }
    }

    showProjectInfo() {
        console.log(`
======================================================================
${cliConfig.projectInfo.author}
Repository: ${cliConfig.projectInfo.repository}
Version: ${cliConfig.projectInfo.version}
License: ${cliConfig.projectInfo.license}
Contact: ${cliConfig.projectInfo.contact}
======================================================================
`);
    }

    showHelp() {
        this.showProjectInfo();
        console.log(`
${cliConfig.helpText.header}

${cliConfig.helpText.usage}

Options:`);
        cliConfig.helpText.options.forEach(option => console.log(`  ${option}`));
        console.log(`
Examples:`);
        cliConfig.helpText.examples.forEach(example => console.log(`  ${example}`));
        console.log(`
${cliConfig.helpText.footer}`);
    }

    showVersion() {
        this.showProjectInfo();
        const packageJson = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
        console.log(`${packageJson.displayName} v${packageJson.version}`);
    }

    async scanFile(filePath, options = {}) {
        try {
            // Log progress for each file
            this.stats.processedFiles++;
            if (!options.quiet && options.verbose) {
                console.log(`[${this.stats.processedFiles}/${this.stats.totalFiles}] Scanning: ${filePath}`);
            }
            
            if (!fs.existsSync(filePath)) {
                // ! ERROR COLLECTOR: เก็บ error แต่ไม่ throw (ทำงานต่อไป)
                this.errorCollector.collect(
                    BinaryCodes.IO.RESOURCE_NOT_FOUND(2001),
                    { 
                        method: 'scanFile',
                        message: `File not found: ${filePath}`,
                        fileName: filePath
                    }
                );
                return { fileName: filePath, violations: [], success: false, error: 'FILE_NOT_FOUND' };
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const results = await this.engine.validateCode(content, filePath);
            this.stats.totalViolations += results.violations.length;

            if (!options.quiet && options.verbose) {
                const prefix = results.violations.length > 0 ? '[VIOLATIONS]' : '[PASS]';
                console.log(`${prefix} ${filePath}`);
            }

            return results;
        } catch (error) {
            // ! ERROR COLLECTOR: เก็บ error แทน throw
            this.errorCollector.collect(
                BinaryCodes.VALIDATOR.LOGIC(3001),
                {
                    method: 'scanFile',
                    message: `Failed to scan file: ${error.message}`,
                    fileName: filePath,
                    error: error
                }
            );
            
            // ! NO_SILENT_FALLBACKS: Return error result แทน throw
            return { 
                fileName: filePath, 
                violations: [], 
                success: false, 
                error: error.message 
            };
        }
    }

    getSeverityLabel(severity) {
        const severityCode = coerceRuleSeverity(severity, RULE_SEVERITY_FLAGS.INFO);
        const level = resolveRuleSeveritySlug(severityCode);
        return cliConfig.severityLabels[level] || cliConfig.severityLabels.INFO;
    }

    async scanPattern(pattern, options = {}) {
        this.currentScanOptions = options;
        // ! ERROR COLLECTOR: Reset ก่อนเริ่มสแกนใหม่
        this.errorCollector.clear();
        
        try {
            // Use configured patterns with fallback
            const scanPattern = pattern || cliConfig.defaultPatterns.include;
            const files = await this.findFilesRecursive(scanPattern);

            if (files.length === 0) {
                console.log(`${cliConfig.messages.noFilesFound} ${scanPattern}`);
                return [];
            }

            this.stats.totalFiles += files.length;
            
            if (!options.quiet && options.verbose) {
                console.log(`\n${cliConfig.messages.scanningFiles} (${files.length} files)`);
                console.log(`📊 Error Collector: Streaming mode enabled (non-throwing)`);
            }
            
            const results = [];
            // ! NON-THROWING SCAN: สแกนทุกไฟล์ไม่หยุด แม้เจอ error
            for (const file of files) {
                try {
                    const result = await this.scanFile(file, options);
                    results.push({ file, ...result });
                } catch (fileError) {
                    // ! ERROR COLLECTOR: เก็บ error แต่ทำงานต่อ
                    this.errorCollector.collect(
                        BinaryCodes.VALIDATOR.LOGIC(4001),
                        {
                            method: 'scanPattern',
                            message: `Critical error scanning file: ${fileError.message}`,
                            fileName: file,
                            error: fileError
                        }
                    );
                    
                    // เพิ่ม error result แต่ไม่หยุด
                    results.push({ 
                        file, 
                        fileName: file,
                        violations: [], 
                        success: false, 
                        error: fileError.message 
                    });
                }
            }

            // ! SUMMARY: Show error collector stats
            if (!options.quiet && options.verbose) {
                const report = this.errorCollector.generateReport();
                console.log(`\n📊 Error Collection Summary:`);
                console.log(`   Total Errors: ${report.summary.totalErrors}`);
                console.log(`   Total Warnings: ${report.summary.totalWarnings}`);
                console.log(`   Duration: ${report.summary.duration}`);
                console.log(`   Check logs/errors/*.log for details`);
            }

            return results;
        } catch (error) {
            // ! ERROR COLLECTOR: เก็บ critical error
            this.errorCollector.collect(
                BinaryCodes.SYSTEM.RUNTIME(5001),
                {
                    method: 'scanPattern',
                    message: `Pattern scan failed: ${error.message}`,
                    pattern,
                    error: error
                }
            );
            
            // Return empty results แทน throw
            return [];
        } finally {
            this.currentScanOptions = null;
        }
    }

    aggregateViolations(results) {
        const grouped = {};

        for (const entry of results) {
            if (!entry || !entry.violations || entry.violations.length === 0) {
                continue;
            }

            const fileKey = entry.file || entry.filePath || entry.fileName || 'unknown-file';
            if (!grouped[fileKey]) {
                grouped[fileKey] = [];
            }

            for (const violation of entry.violations) {
                if (!violation) {
                    continue;
                }

                const line = this.extractLineNumber(violation);
                const column = this.extractColumnNumber(violation);
                const ruleId = coerceRuleId(violation.ruleId) ?? coerceRuleId(violation.ruleMetadata?.id) ?? null;
                const ruleSlug = violation.ruleMetadata?.slug || resolveRuleSlug(ruleId);
                const severityCode = coerceRuleSeverity(
                    violation.severity ?? violation.ruleMetadata?.severity,
                    RULE_SEVERITY_FLAGS.ERROR
                );
                const severityLabel = resolveRuleSeveritySlug(severityCode);

                grouped[fileKey].push({
                    ruleId,
                    ruleSlug,
                    message: violation.message,
                    severity: severityCode,
                    severityLabel,
                    line,
                    column,
                    ruleMetadata: violation.ruleMetadata || null,
                    guidance: violation.guidance || null
                });
            }
        }

        return grouped;
    }

    extractLineNumber(violation) {
        if (!violation) {
            return null;
        }

        if (typeof violation.line === 'number') {
            return violation.line;
        }

        if (violation.location) {
            if (typeof violation.location.line === 'number') {
                return violation.location.line;
            }
            if (violation.location.start && typeof violation.location.start.line === 'number') {
                return violation.location.start.line;
            }
        }

        return null;
    }

    extractColumnNumber(violation) {
        if (!violation) {
            return null;
        }

        if (typeof violation.column === 'number') {
            return violation.column;
        }

        if (violation.location) {
            if (typeof violation.location.column === 'number') {
                return violation.location.column;
            }
            if (violation.location.start && typeof violation.location.start.column === 'number') {
                return violation.location.start.column;
            }
        }

        return null;
    }

    shouldLogVerbose() {
        return Boolean(this.currentScanOptions) && this.currentScanOptions.verbose && !this.currentScanOptions.quiet;
    }

    /**
     * Find files recursively using our own robust scanning logic.
     * (IMPROVED VERSION - NO EXTERNAL LIBRARIES)
     * FIX: ปรับปรุง Logic ให้สแกนได้ครบทุกไฟล์โดยไม่พลาด
     */
    async findFilesRecursive(pattern) {
        const files = [];
        const scannedDirs = new Set();
        let totalScanned = 0;
        let errorCount = 0;

        // FIX: ใช้ extensions และ ignore patterns จาก config
        const extensionsToScan = this.config.fileExtensions || ['.js', '.ts', '.jsx', '.tsx'];
        const ignoreDirs = new Set(this.config.ignoreDirectories || ['node_modules', '.git', '.vscode']);

        if (this.shouldLogVerbose()) {
            console.log(`Scanning for extensions: [${extensionsToScan.join(', ')}]`);
            console.log(`Ignoring directories: [${Array.from(ignoreDirs).join(', ')}]`);
        }

        const scan = (dir) => {
            // FIX: ตรวจสอบ path ที่เคยสแกนและ path ที่ต้อง ignore ให้แม่นยำขึ้น
            const resolvedDir = path.resolve(dir);
            const dirName = path.basename(resolvedDir);

            // ข้ามถ้าสแกนแล้ว หรือเป็น ignored directory หรือขึ้นต้นด้วย .
            if (scannedDirs.has(resolvedDir) || ignoreDirs.has(dirName) || dirName.startsWith('.')) {
                return;
            }
            scannedDirs.add(resolvedDir);

            let entries;
            try {
                entries = fs.readdirSync(resolvedDir, { withFileTypes: true });
            } catch (error) {
                // ! ERROR COLLECTOR: เก็บ error แต่ทำงานต่อ
                this.errorCollector.warn(
                    BinaryCodes.IO.RESOURCE_UNAVAILABLE(6001),
                    {
                        method: 'findFilesRecursive',
                        message: `Cannot read directory: ${resolvedDir}`,
                        directory: resolvedDir,
                        error: error
                    }
                );
                errorCount++;
                return; // หยุดการทำงานใน path นี้ แต่ไม่หยุดทั้งโปรแกรม
            }

            for (const entry of entries) {
                const fullPath = path.join(resolvedDir, entry.name);
                
                try {
                    if (entry.isDirectory()) {
                        scan(fullPath); // Recursive call
                    } else if (entry.isFile()) {
                        const ext = path.extname(entry.name);
                        if (extensionsToScan.includes(ext)) {
                            totalScanned++;
                            files.push(fullPath);
                        }
                    }
                } catch (itemError) {
                    // ! ERROR COLLECTOR: เก็บ error แต่ทำงานต่อ
                    this.errorCollector.warn(
                        BinaryCodes.IO.RESOURCE_UNAVAILABLE(7001),
                        {
                            method: 'findFilesRecursive',
                            message: `Cannot access: ${fullPath}`,
                            filePath: fullPath,
                            error: itemError
                        }
                    );
                    errorCount++;
                }
            }
        };

        // FIX: ปรับปรุง Logic การหา "จุดเริ่มต้น" ของการสแกนให้ฉลาดขึ้น
        const startPath = pattern ? path.resolve(process.cwd(), pattern) : process.cwd();
        
        if (this.shouldLogVerbose()) {
            console.log(` Starting scan from: "${startPath}"`);
        }

        if (fs.existsSync(startPath)) {
            const stat = fs.statSync(startPath);
            if (stat.isDirectory()) {
                scan(startPath);
            } else if (stat.isFile()) {
                // กรณีที่ผู้ใช้ระบุไฟล์เดียวโดยตรง
                if (extensionsToScan.includes(path.extname(startPath))) {
                    files.push(startPath);
                    totalScanned++;
                }
            }
        } else {
            // ! ERROR COLLECTOR: เก็บ error แต่ไม่ throw
            this.errorCollector.warn(
                BinaryCodes.IO.RESOURCE_NOT_FOUND(8001),
                {
                    method: 'findFilesRecursive',
                    message: `Path not found: ${pattern}`,
                    pattern
                }
            );
            return files;
        }

        if (this.shouldLogVerbose()) {
            console.log(`\n✓ Scanned ${totalScanned} files (${errorCount} errors skipped)`);
        }
        return files;
    }

    showSummary(results, options = {}, aggregatedViolations = {}) {
        const hasViolations = this.stats.totalViolations > 0;
        const errorReport = this.errorCollector.generateReport();
        const hasCollectedErrors = this.errorCollector.hasErrors();
        
        if (options.json) {
            const jsonOutput = {
                summary: {
                    totalFiles: this.stats.totalFiles,
                    processedFiles: this.stats.processedFiles,
                    totalViolations: this.stats.totalViolations
                },
                errorCollector: errorReport,
                results: results,
                aggregatedViolations,
                reportPath: 'logs/validation-report.md',
                hasViolations,
                hasErrors: hasCollectedErrors
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
        } else {
            if (!options.quiet) {
                console.log('\n' + '='.repeat(70));
                console.log('📊 SCAN SUMMARY');
                console.log('='.repeat(70));
                console.log(`Files Scanned:     ${this.stats.processedFiles}/${this.stats.totalFiles}`);
                console.log(`Violations Found:  ${this.stats.totalViolations}`);
                console.log(`Errors Collected:  ${errorReport.summary.totalErrors}`);
                console.log(`Warnings:          ${errorReport.summary.totalWarnings}`);
                console.log(`Duration:          ${errorReport.summary.duration}`);
                console.log('='.repeat(70));
                
                if (hasViolations || hasCollectedErrors) {
                    console.log('\n❌ Validation FAILED');
                    console.log('   Check logs/errors/*.log for detailed error information');
                    
                    if (hasCollectedErrors) {
                        console.log(`\n🔍 Top Errors by File:`);
                        const byFile = errorReport.byFile;
                        const topFiles = Object.entries(byFile)
                            .sort((a, b) => b[1].length - a[1].length)
                            .slice(0, 5);
                        
                        topFiles.forEach(([file, errors]) => {
                            console.log(`   ${file}: ${errors.length} errors`);
                        });
                    }
                } else {
                    console.log('\n✅ Validation PASSED - No violations found');
                }
            }
        }
        
        // Exit code: 1 if violations OR collected errors
        return (hasViolations || hasCollectedErrors) ? 1 : 0;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const options = {
        quiet: args.includes('--quiet') || args.includes('-q'),
        verbose: args.includes('--verbose'),
        json: args.includes('--json'),
        help: args.includes('--help') || args.includes('-h'),
        version: args.includes('--version') || args.includes('-v')
    };

    const cli = new ChahuadevCLI();

    cli.stats = {
        totalFiles: 0,
        totalViolations: 0,
        processedFiles: 0
    };
    cli.currentScanOptions = null;

    if (options.help) {
        cli.showHelp();
        return 0;
    }

    if (options.version) {
        cli.showVersion();
        return 0;
    }

    // Show project info at startup (unless quiet mode)
    if (!options.quiet) {
        cli.showProjectInfo();
    }

    // Initialize the engine
    const initialized = await cli.initialize();
    if (!initialized) {
        return 1;
    }

    // Get file patterns (remove flags from args)
    const patterns = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
    
    try {
        let results = [];

        if (patterns.length === 0) {
            const defaultResults = await cli.scanPattern(undefined, options);
            results.push(...defaultResults);
        } else {
            for (const pattern of patterns) {
                const patternResults = await cli.scanPattern(pattern, options);
                results.push(...patternResults);
            }
        }

        const aggregatedViolations = cli.aggregateViolations(results);
        
        // FIX: ลบ errorHandler.handleViolations() ออก - ใช้ Binary Pattern แทน
        // Violations จะถูก report ผ่าน reportError() โดยอัตโนมัติแล้ว

        const exitCode = cli.showSummary(results, options, aggregatedViolations);
        return exitCode;
        
    } catch (error) {
        // FIX: Binary Error Pattern
        handleSystemError('RUNTIME', 9001, error);
        return 1;
    }
}

// Run CLI if called directly
async function flushAndExit(code) {
    // FIX: ลบ errorHandler.flushAsyncOperations() ออก - Binary Reporter จัดการ flush เอง
    process.exit(code);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/cli.js') || 
    process.argv[1].endsWith('cli.js')) {
    main().then(exitCode => {
        return flushAndExit(exitCode ?? 0);
    }).catch(async error => {
        // FIX: Binary Error Pattern
        handleSystemError('RUNTIME', 9999, error);
        await flushAndExit(1);
    });
}

export { ChahuadevCLI };