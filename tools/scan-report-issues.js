#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// Scan Report Issues - Find all report() calls with manual context
// ═══════════════════════════════════════════════════════════════════════════════
// Purpose: Scan codebase for report() calls that send manual context
// Reason: Error Handler auto-captures - manual context is redundant/wrong
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════════════════════════════
// Files to scan
// ═══════════════════════════════════════════════════════════════════════════════
const filesToScan = [
    'src/security/security-middleware.js',
    'src/security/security-manager.js',
    'src/security/security-config.js',
    'src/security/rate-limit-store-factory.js',
    'src/rules/validator.js',
    'src/grammars/shared/pure-binary-parser.js',
    'src/grammars/shared/grammar-index.js',
    'src/grammars/shared/enhanced-binary-parser.js',
    'src/grammars/shared/constants.js',
    'src/grammars/shared/binary-scout.js',
    'src/grammars/shared/binary-prophet.js',
    'src/grammars/index.js',
    'src/extension.js'
];

// ═══════════════════════════════════════════════════════════════════════════════
// Scan patterns
// ═══════════════════════════════════════════════════════════════════════════════
const patterns = {
    // 1. report(BinaryCodes.XXX.YYY(offset), {...})
    reportWithContext: /report\(BinaryCodes\.[A-Z_]+\.[A-Z_]+\(\d+\),\s*\{/g,
    
    // 2. console.log(), console.error(), etc.
    consoleUsage: /console\.(log|error|warn|info|debug|trace)\(/g,
    
    // 3. process.stderr.write(), process.stdout.write()
    processWrite: /process\.(stderr|stdout)\.write\(/g,
    
    // 4. throw new Error() - ห้ามใช้ในไฟล์ทั่วไป
    throwError: /throw\s+new\s+Error\(/g,
    
    // 5. errorHandler.report() - รูปแบบเก่า
    errorHandlerDirect: /errorHandler\.report\(/g,
    
    // 6. การสร้าง Error object แล้วไม่ได้ส่งไป report
    createErrorNotReport: /const\s+\w+\s*=\s*new\s+Error\([^)]+\);(?!\s*report)/g,
    
    // 7. report() ที่ถูกต้อง
    correctReport: /report\(BinaryCodes\.[A-Z_]+\.[A-Z_]+\(\d+\)\);/g
};

// Issue types
const IssueType = {
    MANUAL_CONTEXT: 'manual-context',
    CONSOLE_LOG: 'console-log',
    PROCESS_WRITE: 'process-write',
    THROW_ERROR: 'throw-error',
    ERROR_HANDLER_DIRECT: 'errorhandler-direct',
    ERROR_NOT_REPORTED: 'error-not-reported'
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scan Results
// ═══════════════════════════════════════════════════════════════════════════════
const results = {
    totalFiles: 0,
    filesWithIssues: 0,
    totalIssues: 0,
    correctCalls: 0,
    issues: []
};

// ═══════════════════════════════════════════════════════════════════════════════
// Scan File
// ═══════════════════════════════════════════════════════════════════════════════
function scanFile(filePath) {
    const fullPath = path.join(projectRoot, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }

    results.totalFiles++;
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    
    // Find issues by type
    const issuesByType = {
        [IssueType.MANUAL_CONTEXT]: [],
        [IssueType.CONSOLE_LOG]: [],
        [IssueType.PROCESS_WRITE]: [],
        [IssueType.THROW_ERROR]: [],
        [IssueType.ERROR_HANDLER_DIRECT]: [],
        [IssueType.ERROR_NOT_REPORTED]: [],
        correct: []
    };
    
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // 1. report() with manual context - WRONG
        if (patterns.reportWithContext.test(line)) {
            issuesByType[IssueType.MANUAL_CONTEXT].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 2. console.* usage - FORBIDDEN
        if (patterns.consoleUsage.test(line)) {
            issuesByType[IssueType.CONSOLE_LOG].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 3. process.*.write() - FORBIDDEN
        if (patterns.processWrite.test(line)) {
            issuesByType[IssueType.PROCESS_WRITE].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 4. throw new Error() - FORBIDDEN in most files
        if (patterns.throwError.test(line)) {
            issuesByType[IssueType.THROW_ERROR].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 5. errorHandler.report() - OLD PATTERN
        if (patterns.errorHandlerDirect.test(line)) {
            issuesByType[IssueType.ERROR_HANDLER_DIRECT].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 6. Error created but not reported
        if (patterns.createErrorNotReport.test(line)) {
            issuesByType[IssueType.ERROR_NOT_REPORTED].push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // 7. Correct report() pattern
        if (patterns.correctReport.test(line)) {
            issuesByType.correct.push({
                line: lineNumber,
                code: line.trim()
            });
        }
        
        // Reset all regex lastIndex
        Object.values(patterns).forEach(pattern => pattern.lastIndex = 0);
    });
    
    // Count total issues
    const totalIssues = 
        issuesByType[IssueType.MANUAL_CONTEXT].length +
        issuesByType[IssueType.CONSOLE_LOG].length +
        issuesByType[IssueType.PROCESS_WRITE].length +
        issuesByType[IssueType.THROW_ERROR].length +
        issuesByType[IssueType.ERROR_HANDLER_DIRECT].length +
        issuesByType[IssueType.ERROR_NOT_REPORTED].length;
    
    const correctCount = issuesByType.correct.length;
    results.correctCalls += correctCount;
    
    if (totalIssues > 0) {
        results.filesWithIssues++;
        results.totalIssues += totalIssues;
        
        results.issues.push({
            file: filePath,
            issueCount: totalIssues,
            correctCount: correctCount,
            issuesByType: issuesByType
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Display Results
// ═══════════════════════════════════════════════════════════════════════════════
function displayResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('ERROR LOGGING PATTERN SCAN RESULTS');
    console.log('═'.repeat(80));
    console.log(`\nFiles scanned: ${results.totalFiles}`);
    console.log(`Files with issues: ${results.filesWithIssues}`);
    console.log(`Total violations found: ${results.totalIssues}`);
    console.log(`Correct report() calls: ${results.correctCalls}`);
    
    if (results.issues.length === 0) {
        console.log('\n✅ No issues found - all error logging patterns are correct!');
        return;
    }
    
    console.log('\n' + '─'.repeat(80));
    console.log('VIOLATIONS BY FILE:');
    console.log('─'.repeat(80));
    
    results.issues.forEach(fileResult => {
        console.log(`\n📄 ${fileResult.file}`);
        console.log(`   Total violations: ${fileResult.issueCount} | Correct calls: ${fileResult.correctCount}`);
        console.log('   ─'.repeat(76));
        
        const types = fileResult.issuesByType;
        
        // 1. Manual context in report()
        if (types[IssueType.MANUAL_CONTEXT].length > 0) {
            console.log(`\n   ❌ MANUAL CONTEXT (${types[IssueType.MANUAL_CONTEXT].length}):`);
            types[IssueType.MANUAL_CONTEXT].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
        
        // 2. Console usage
        if (types[IssueType.CONSOLE_LOG].length > 0) {
            console.log(`\n   ❌ CONSOLE USAGE (${types[IssueType.CONSOLE_LOG].length}):`);
            types[IssueType.CONSOLE_LOG].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
        
        // 3. Process write
        if (types[IssueType.PROCESS_WRITE].length > 0) {
            console.log(`\n   ❌ PROCESS WRITE (${types[IssueType.PROCESS_WRITE].length}):`);
            types[IssueType.PROCESS_WRITE].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
        
        // 4. Throw errors
        if (types[IssueType.THROW_ERROR].length > 0) {
            console.log(`\n   ❌ THROW ERROR (${types[IssueType.THROW_ERROR].length}):`);
            types[IssueType.THROW_ERROR].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
        
        // 5. Old errorHandler.report()
        if (types[IssueType.ERROR_HANDLER_DIRECT].length > 0) {
            console.log(`\n   ❌ OLD ERROR HANDLER (${types[IssueType.ERROR_HANDLER_DIRECT].length}):`);
            types[IssueType.ERROR_HANDLER_DIRECT].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
        
        // 6. Error not reported
        if (types[IssueType.ERROR_NOT_REPORTED].length > 0) {
            console.log(`\n   ⚠️  ERROR NOT REPORTED (${types[IssueType.ERROR_NOT_REPORTED].length}):`);
            types[IssueType.ERROR_NOT_REPORTED].forEach(issue => {
                console.log(`      Line ${issue.line}: ${issue.code}`);
            });
        }
    });
    
    console.log('\n' + '═'.repeat(80));
    console.log('SUMMARY BY VIOLATION TYPE');
    console.log('═'.repeat(80));
    
    const summary = {
        [IssueType.MANUAL_CONTEXT]: 0,
        [IssueType.CONSOLE_LOG]: 0,
        [IssueType.PROCESS_WRITE]: 0,
        [IssueType.THROW_ERROR]: 0,
        [IssueType.ERROR_HANDLER_DIRECT]: 0,
        [IssueType.ERROR_NOT_REPORTED]: 0
    };
    
    results.issues.forEach(fileResult => {
        Object.keys(summary).forEach(type => {
            summary[type] += fileResult.issuesByType[type].length;
        });
    });
    
    console.log(`\n❌ Manual Context in report():     ${summary[IssueType.MANUAL_CONTEXT]}`);
    console.log(`❌ Console Usage:                  ${summary[IssueType.CONSOLE_LOG]}`);
    console.log(`❌ Process Write:                  ${summary[IssueType.PROCESS_WRITE]}`);
    console.log(`❌ Throw Error:                    ${summary[IssueType.THROW_ERROR]}`);
    console.log(`❌ Old errorHandler.report():      ${summary[IssueType.ERROR_HANDLER_DIRECT]}`);
    console.log(`⚠️  Error Object Not Reported:     ${summary[IssueType.ERROR_NOT_REPORTED]}`);
    console.log(`✅ Correct report() Calls:         ${results.correctCalls}`);
    
    console.log('\n' + '─'.repeat(80));
    console.log('RECOMMENDED FIXES');
    console.log('─'.repeat(80));
    console.log('\n1. Manual Context:');
    console.log('   ❌ report(BinaryCodes.PARSER.SYNTAX(1008), { error, data });');
    console.log('   ✅ report(BinaryCodes.PARSER.SYNTAX(1008));');
    console.log('\n2. Console Usage:');
    console.log('   ❌ console.log("debug info");');
    console.log('   ✅ report(BinaryCodes.SYSTEM.DEBUG(offset));');
    console.log('\n3. Process Write:');
    console.log('   ❌ process.stderr.write("error");');
    console.log('   ✅ report(BinaryCodes.SYSTEM.ERROR(offset));');
    console.log('\n4. Throw Error:');
    console.log('   ❌ throw new Error("Something failed");');
    console.log('   ✅ report(BinaryCodes.SYSTEM.FAILURE(offset)); return;');
    console.log('\n💡 Note: Error Handler auto-captures context from stack trace');
    console.log('   - File path, method name, line number');
    console.log('   - No need to manually send context');
    console.log('\n' + '═'.repeat(80));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════
console.log('Scanning report() calls for manual context issues...\n');

filesToScan.forEach(scanFile);
displayResults();

// Exit with error code if issues found
process.exit(results.totalIssues > 0 ? 1 : 0);
