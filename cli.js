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
 * WITH SECURITY PROTECTION
 */

import { ABSOLUTE_RULES, ValidationEngine } from './src/rules/validator.js';
import { SecurityManager } from './src/security/security-manager.js';
import errorHandler from './src/error-handler/ErrorHandler.js';

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
            console.error(`${cliConfig.messages.initializationFailed} ${error.message}`);
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
                throw new Error(`${cliConfig.messages.fileNotFound} ${filePath}`);
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
            console.error(`${cliConfig.messages.errorScanning} ${filePath}: ${error.message}`);
            return { violations: [], error: error.message };
        }
    }

    getSeverityLabel(severity) {
        const level = severity?.toUpperCase() || 'INFO';
        return cliConfig.severityLabels[level] || cliConfig.severityLabels.INFO;
    }

    async scanPattern(pattern, options = {}) {
        this.currentScanOptions = options;
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
            }

            const results = [];
            for (const file of files) {
                try {
                    const result = await this.scanFile(file, options);
                    results.push({ file, ...result });
                } catch (fileError) {
                    // !  NO_SILENT_FALLBACKS: Log error but continue to next file
                    console.error(`\nError processing ${file}:`);
                    console.error(`   ${fileError.message}`);
                    results.push({ 
                        file, 
                        violations: [], 
                        error: fileError.message 
                    });
                    // Continue to next file
                }
            }

            return results;
        } catch (error) {
            console.error(`${cliConfig.messages.errorScanning}: ${error.message}`);
            throw error;
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

                grouped[fileKey].push({
                    ruleId: violation.ruleId,
                    message: violation.message,
                    severity: violation.severity || violation.ruleMetadata?.severity || 'INFO',
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
                // !  NO_SILENT_FALLBACKS - ทำให้ชัดเจนว่าอ่านโฟลเดอร์ไม่ได้ แต่ยังทำงานต่อ
                console.warn(` Warning: Could not read directory ${resolvedDir}. Skipping. Error: ${error.message}`);
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
                    // !  NO_SILENT_FALLBACKS: Log error but continue
                    console.warn(` Warning: Cannot access ${fullPath}: ${itemError.message}`);
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
            throw new Error(`The specified path or pattern "${pattern}" does not exist.`);
        }

        if (this.shouldLogVerbose()) {
            console.log(`\n✓ Scanned ${totalScanned} files (${errorCount} errors skipped)`);
        }
        return files;
    }

    showSummary(results, options = {}, aggregatedViolations = {}) {
        const hasViolations = this.stats.totalViolations > 0;
        
        if (options.json) {
            const jsonOutput = {
                summary: {
                    totalFiles: this.stats.totalFiles,
                    processedFiles: this.stats.processedFiles,
                    totalViolations: this.stats.totalViolations
                },
                results: results,
                aggregatedViolations,
                reportPath: errorHandler.getReportPath(),
                hasViolations
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
        } else {
            if (!options.quiet) {
                if (hasViolations) {
                    console.log('\nValidation FAILED. ดูรายละเอียดได้ที่ validation-report.md');
                } else {
                    console.log('\nValidation PASSED. ไม่พบการผิดกฎ');
                }
            }
        }
        
        return hasViolations ? 1 : 0; // Exit code
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
        await errorHandler.handleViolations(aggregatedViolations, cli.rules);

        const exitCode = cli.showSummary(results, options, aggregatedViolations);
        return exitCode;
        
    } catch (error) {
        console.error(`${cliConfig.messages.cliExecutionFailed} ${error.message}`);
        return 1;
    }
}

// Run CLI if called directly
async function flushAndExit(code) {
    // ! Ensure async error-handler writes finish before terminating (NO_SILENT_FALLBACKS)
    try {
        if (typeof errorHandler.flushAsyncOperations === 'function') {
            await errorHandler.flushAsyncOperations();
        }
    } catch (flushError) {
        console.error('[WARN] Failed to flush error handler queues before exit:', flushError.message);
    }

    process.exit(code);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/cli.js') || 
    process.argv[1].endsWith('cli.js')) {
    main().then(exitCode => {
        return flushAndExit(exitCode ?? 0);
    }).catch(async error => {
        console.error(`${cliConfig.messages.fatalError}`, error);
        await flushAndExit(1);
    });
}

export { ChahuadevCLI };