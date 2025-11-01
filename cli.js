#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-parser-.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
/**
 * Chahuadev Sentinel CLI
 * Universal Grammar System - Code Reader & Parser
 * Multi-language AST parsing with binary tokenization
 */

import { SecurityManager } from './src/security/security-manager.js';
import { report, setGlobalCollector } from './src/error-handler/universal-reporter.js';
import BinaryCodes from './src/error-handler/binary-codes.js';
import { ErrorCollector } from './src/error-handler/error-collector.js';
import { loadGrammarIndex, tokenize, createQuantumParser } from './src/grammars/index.js';

import fs from 'fs';
import path from 'path';

// Load CLI configuration from JSON 
const cliConfig = JSON.parse(
    fs.readFileSync(new URL('./cli-config.json', import.meta.url), 'utf8')
);

class ChahuadevCLI {
    constructor() {
        this.config = cliConfig;
        this.stats = {
            totalFiles: 0,
            totalViolations: 0,
            processedFiles: 0
        };
        this.securityManager = null;
        this.currentParseOptions = null;
        // Error Collector: Auto-capture errors during parsing
        this.errorCollector = new ErrorCollector({
            streamMode: true,
            throwOnCritical: false,
            maxErrors: 10000
        });
        
        // Register global collector for auto error reporting
        setGlobalCollector(this.errorCollector);
    }

    async initialize() {
        try {
            // Initialize security system
            console.log('[SECURITY] Initializing security protection...');
            
            const rateLimitStore = new Map();
            console.log('[SECURITY] Using in-memory rate limiting (suitable for CLI single-process)');
            
            this.securityManager = new SecurityManager({
                rateLimitStore: rateLimitStore
            });
            
            const securityReport = this.securityManager.generateSecurityReport();
            console.log(`[SECURITY] Protection Level: ${securityReport.securityLevel}`);
            console.log(`[SECURITY] Status: ${securityReport.status}`);
            
            if (securityReport.vulnerabilities && securityReport.vulnerabilities.length > 0) {
                console.log(`[WARNING] Found ${securityReport.vulnerabilities.length} potential security concerns:`);
                securityReport.vulnerabilities.forEach((vuln, index) => {
                    console.log(`  ${index + 1}. ${vuln.type}: ${vuln.description}`);
                });
            }
            
            // Grammar system ready
            console.log(cliConfig.messages.cliInitialized);
            return true;
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.CONFIGURATION(15001));
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
            // Parse/read file
            this.stats.processedFiles++;
            if (!options.quiet && options.verbose) {
                console.log(`[${this.stats.processedFiles}/${this.stats.totalFiles}] Parsing: ${filePath}`);
            }
            
            if (!fs.existsSync(filePath)) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.IO.RESOURCE_NOT_FOUND(15002));
                return { fileName: filePath, violations: [], success: false, error: 'File not found' };
            }

            const content = fs.readFileSync(filePath, 'utf8');
            
            // Detect language from file extension
            const ext = path.extname(filePath).toLowerCase();
            const languageMap = {
                '.js': 'javascript',
                '.jsx': 'javascript',
                '.ts': 'typescript',
                '.tsx': 'typescript',
                '.py': 'python',
                '.java': 'java',
                '.go': 'go',
                '.rb': 'ruby',
                '.php': 'php',
                '.rs': 'rust',
                '.swift': 'swift',
                '.kt': 'kotlin',
                '.c': 'c',
                '.cpp': 'cpp',
                '.cs': 'csharp'
            };
            
            const language = languageMap[ext] || 'javascript';
            
            // Use grammar system to tokenize and parse
            const tokens = await tokenize(content, language);
            
            // Create parser and parse tokens to AST
            const parser = createQuantumParser(language);
            const ast = parser ? parser.parse(tokens, content) : null;
            
            // Return parsed structure
            const results = { 
                fileName: filePath, 
                language: language,
                tokens: tokens.length,
                ast: ast ? 'generated' : 'not-available',
                violations: [], 
                success: true 
            };

            if (!options.quiet && options.verbose) {
                console.log(`[PARSED] ${filePath} (${language}, ${tokens.length} tokens, AST: ${ast ? 'OK' : 'N/A'})`);
            }

            return results;
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.PARSER.SYNTAX(15003));
            return { fileName: filePath, violations: [], success: false, error: error.message };
        }
    }

    getSeverityLabel(severity) {
        return 'INFO';
    }

    async parsePattern(pattern, options = {}) {
        this.currentParseOptions = options;
        // ! ERROR COLLECTOR: Reset before new parse session
        this.errorCollector.clear();
        
        try {
            // Use configured patterns with fallback
            const parsePattern = pattern || cliConfig.defaultPatterns.include;
            const files = await this.findFilesRecursive(parsePattern);

            if (files.length === 0) {
                console.log(`${cliConfig.messages.noFilesFound} ${parsePattern}`);
                return [];
            }

            this.stats.totalFiles += files.length;
            
            if (!options.quiet && options.verbose) {
                console.log(`\n${cliConfig.messages.scanningFiles} (${files.length} files)`);
                console.log(`\nCentral Error Reporting System:`);
                console.log(`  - Errors are automatically captured and logged`);
                console.log(`  - Check 'logs/errors/*.log' for detailed error information`);
                console.log(`  - Non-throwing mode: Parser continues on errors\n`);
            }
            
            const results = [];
            // ! NON-THROWING: Parse all files without stopping on errors
            for (const file of files) {
                try {
                    const result = await this.scanFile(file, options);
                    results.push({ file, ...result });
                } catch (fileError) {
                    // FIX: Universal Reporter - Auto-collect
                    report(BinaryCodes.VALIDATOR.LOGIC(15004));
                }
            }

            // Show error collector stats summary
            if (!options.quiet && options.verbose) {
                const report = this.errorCollector.generateReport();
                console.log(`\n========================================`);
                console.log(`CENTRAL ERROR SYSTEM - SUMMARY`);
                console.log(`========================================`);
                console.log(`Total Errors:   ${report.summary.totalErrors}`);
                console.log(`Total Warnings: ${report.summary.totalWarnings}`);
                console.log(`Duration:       ${report.summary.duration}`);
                console.log(`========================================`);
                console.log(`\nDetailed logs: logs/errors/*.log`);
                console.log(`Error files are auto-categorized by severity\n`);
            }

            return results;
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.RUNTIME(15005));
        } finally {
            this.currentParseOptions = null;
        }
    }

    aggregateViolations(results) {
        return {};
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
        return Boolean(this.currentParseOptions) && this.currentParseOptions.verbose && !this.currentParseOptions.quiet;
    }

    /**
     * Find files recursively using robust discovery logic.
     * (IMPROVED VERSION - NO EXTERNAL LIBRARIES)
     * FIX: ปรับปรุง Logic ให้สแกนได้ครบทุกไฟล์โดยไม่พลาด
     */
    async findFilesRecursive(pattern) {
        const files = [];
        const discoveredDirs = new Set();
        let totalDiscovered = 0;
        let errorCount = 0;

        // FIX: ใช้ extensions และ ignore patterns จาก config
        const extensionsToScan = this.config.fileExtensions || ['.js', '.ts', '.jsx', '.tsx'];
        const ignoreDirs = new Set(this.config.ignoreDirectories || ['node_modules', '.git', '.vscode']);

        if (this.shouldLogVerbose()) {
            console.log(`Discovering files with extensions: [${extensionsToScan.join(', ')}]`);
            console.log(`Ignoring directories: [${Array.from(ignoreDirs).join(', ')}]`);
        }

        const discover = (dir) => {
            // FIX: Check already discovered paths and ignore patterns
            const resolvedDir = path.resolve(dir);
            const dirName = path.basename(resolvedDir);

            // Skip if already discovered, ignored directory, or starts with .
            if (discoveredDirs.has(resolvedDir) || ignoreDirs.has(dirName) || dirName.startsWith('.')) {
                return;
            }
            discoveredDirs.add(resolvedDir);

            let entries;
            try {
                entries = fs.readdirSync(resolvedDir, { withFileTypes: true });
            } catch (error) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.IO.RESOURCE_UNAVAILABLE(15006));
            }

            for (const entry of entries) {
                const fullPath = path.join(resolvedDir, entry.name);
                
                try {
                    if (entry.isDirectory()) {
                        discover(fullPath); // Recursive call
                    } else if (entry.isFile()) {
                        const ext = path.extname(entry.name);
                        if (extensionsToScan.includes(ext)) {
                            totalDiscovered++;
                            files.push(fullPath);
                        }
                    }
                } catch (itemError) {
                    // FIX: Universal Reporter - Auto-collect
                    report(BinaryCodes.IO.RESOURCE_UNAVAILABLE(15007));
                }
            }
        };

        // FIX: Improved logic for finding the "start point" of discovery
        const startPath = pattern ? path.resolve(process.cwd(), pattern) : process.cwd();
        
        if (this.shouldLogVerbose()) {
            console.log(` Starting discovery from: "${startPath}"`);
        }

        if (fs.existsSync(startPath)) {
            const stat = fs.statSync(startPath);
            if (stat.isDirectory()) {
                discover(startPath);
            } else if (stat.isFile()) {
                // User specified a single file directly
                if (extensionsToScan.includes(path.extname(startPath))) {
                    files.push(startPath);
                    totalDiscovered++;
                }
            }
        } else {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.IO.RESOURCE_NOT_FOUND(15008));
        }

        if (this.shouldLogVerbose()) {
            console.log(`\n✓ Discovered ${totalDiscovered} files (${errorCount} errors skipped)`);
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
                reportPath: 'logs/parse-report.md',
                hasViolations,
                hasErrors: hasCollectedErrors
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
        } else {
            if (!options.quiet) {
                console.log('\n' + '='.repeat(70));
                console.log(' PARSE SUMMARY');
                console.log('='.repeat(70));
                console.log(`Files Read:        ${this.stats.processedFiles}/${this.stats.totalFiles}`);
                console.log(`Violations Found:  ${this.stats.totalViolations}`);
                console.log(`Errors Collected:  ${errorReport.summary.totalErrors}`);
                console.log(`Warnings:          ${errorReport.summary.totalWarnings}`);
                console.log(`Duration:          ${errorReport.summary.duration}`);
                console.log('='.repeat(70));
                
                if (hasViolations || hasCollectedErrors) {
                    console.log('\nParsing completed with errors');
                    console.log('\nCentral Error System Information:');
                    console.log('  - All errors are automatically logged to logs/errors/*.log');
                    console.log('  - Logs are categorized by severity (critical, error, warning)');
                    console.log('  - Each error includes full context and stack trace');
                    
                    if (hasCollectedErrors) {
                        console.log(`\nTop 5 Files with Most Errors:`);
                        const byFile = errorReport.byFile;
                        const topFiles = Object.entries(byFile)
                            .sort((a, b) => b[1].length - a[1].length)
                            .slice(0, 5);
                        
                        topFiles.forEach(([file, errors]) => {
                            console.log(`   ${file}: ${errors.length} errors`);
                        });
                    }
                } else {
                    console.log('\nParsing completed successfully - No errors detected');
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
            const defaultResults = await cli.parsePattern(undefined, options);
            results.push(...defaultResults);
        } else {
            for (const pattern of patterns) {
                const patternResults = await cli.parsePattern(pattern, options);
                results.push(...patternResults);
            }
        }

        const aggregatedViolations = cli.aggregateViolations(results);
        
        // FIX: Violations will be reported through reportError() automatically

        const exitCode = cli.showSummary(results, options, aggregatedViolations);
        return exitCode;
        
    } catch (error) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.SYSTEM.RUNTIME(15009));
    }
}

// Run CLI if called directly
async function flushAndExit(code) {
    // FIX: Binary Reporter handles flush automatically
    process.exit(code);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/cli.js') || 
    process.argv[1].endsWith('cli.js')) {
    main().then(exitCode => {
        return flushAndExit(exitCode ?? 0);
    }).catch(async error => {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.SYSTEM.RUNTIME(15010));
    });
}

export { ChahuadevCLI };