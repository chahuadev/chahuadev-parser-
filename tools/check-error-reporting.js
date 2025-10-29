#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
/**
 * Error Reporting Migration Checker
 * ตรวจสอบไฟล์ที่ยังใช้ reportError แทน report (Universal Reporter)
 * และแสดงรายการไฟล์ที่ต้องแก้ไข
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ไฟล์ที่ยกเว้น (ไม่ต้องแก้ไข)
const EXCLUDED_FILES = [
    'binary-reporter.js',      // Core reporter - ใช้ reportError เป็น low-level API
    'universal-reporter.js',   // Core reporter - เป็นตัวที่ export report()
    'error-collector.js',      // Core - ใช้ internal reportError
    'BinaryErrorParser.js',    // Core - parser ของ error codes
    'binary-log-stream.js',    // Core - streaming logs
    'check-error-reporting.js' // ไฟล์นี้เอง
];

const EXCLUDED_DIRS = [
    'node_modules',
    '.git',
    'logs',
    'dist',
    'build',
    'docs'  // documentation ไม่ต้องใช้ error reporting
];

/**
 * ตรวจสอบว่าไฟล์ใช้ reportError หรือไม่
 */
function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const issues = {
            hasReportError: false,
            hasReport: false,
            hasUniversalReporterImport: false,
            hasBinaryReporterImport: false,
            hasBinaryCodesImport: false,
            reportErrorLines: [],
            importLines: []
        };

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            // ตรวจสอบ import statements
            if (line.includes("import") && line.includes("universal-reporter")) {
                issues.hasUniversalReporterImport = true;
                issues.importLines.push({ lineNum, line: line.trim() });
            }
            if (line.includes("import") && line.includes("binary-reporter")) {
                issues.hasBinaryReporterImport = true;
                issues.importLines.push({ lineNum, line: line.trim() });
            }
            if (line.includes("import") && line.includes("binary-codes")) {
                issues.hasBinaryCodesImport = true;
                issues.importLines.push({ lineNum, line: line.trim() });
            }
            if (line.includes("import") && line.includes("BinaryCodes")) {
                issues.hasBinaryCodesImport = true;
                issues.importLines.push({ lineNum, line: line.trim() });
            }
            
            // ตรวจสอบการเรียกใช้ functions
            if (line.includes('reportError(')) {
                issues.hasReportError = true;
                issues.reportErrorLines.push({ lineNum, line: line.trim() });
            }
            if (line.includes('report(') && !line.includes('reportError(')) {
                issues.hasReport = true;
            }
        });

        return issues;
    } catch (error) {
        console.error(`❌ Error reading ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * สแกนไฟล์ทั้งหมดใน directory
 */
function scanDirectory(dir, results = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(ROOT_DIR, fullPath);

        // ข้าม excluded directories
        if (entry.isDirectory()) {
            if (EXCLUDED_DIRS.includes(entry.name)) {
                continue;
            }
            scanDirectory(fullPath, results);
        } 
        // ตรวจสอบไฟล์ .js เท่านั้น
        else if (entry.isFile() && entry.name.endsWith('.js')) {
            // ข้าม excluded files
            if (EXCLUDED_FILES.includes(entry.name)) {
                continue;
            }

            const issues = checkFile(fullPath);
            if (issues) {
                results.push({
                    path: relativePath,
                    fullPath,
                    ...issues
                });
            }
        }
    }

    return results;
}

/**
 * แสดงผลการตรวจสอบ
 */
function displayResults(results) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('   Error Reporting Migration Status');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // แยกไฟล์ออกเป็นหมวดหมู่
    const needsMigration = [];
    const alreadyMigrated = [];
    const needsImports = [];

    results.forEach(file => {
        if (file.hasReportError && !file.hasUniversalReporterImport) {
            needsMigration.push(file);
        } else if (file.hasReport && file.hasUniversalReporterImport) {
            alreadyMigrated.push(file);
        } else if (!file.hasBinaryCodesImport && (file.hasReport || file.hasReportError)) {
            needsImports.push(file);
        }
    });

    // 1. ไฟล์ที่ต้อง migrate (ใช้ reportError อยู่)
    if (needsMigration.length > 0) {
        console.log(`🔴 ไฟล์ที่ต้องแก้ไข (${needsMigration.length} files):`);
        console.log('   ยังใช้ reportError จาก binary-reporter.js\n');
        
        needsMigration.forEach(file => {
            console.log(`   📄 ${file.path}`);
            
            // แสดง imports ปัจจุบัน
            if (file.importLines.length > 0) {
                console.log(`      Imports:`);
                file.importLines.forEach(imp => {
                    console.log(`        Line ${imp.lineNum}: ${imp.line}`);
                });
            }
            
            // แสดง reportError usage
            console.log(`      ⚠️  Found reportError() calls: ${file.reportErrorLines.length} occurrences`);
            file.reportErrorLines.slice(0, 3).forEach(call => {
                console.log(`        Line ${call.lineNum}: ${call.line.substring(0, 80)}...`);
            });
            
            if (file.reportErrorLines.length > 3) {
                console.log(`        ... และอีก ${file.reportErrorLines.length - 3} จุด`);
            }
            
            console.log('');
        });
    }

    // 2. ไฟล์ที่แก้ไขเรียบร้อยแล้ว
    if (alreadyMigrated.length > 0) {
        console.log(`\n✅ ไฟล์ที่แก้ไขเรียบร้อยแล้ว (${alreadyMigrated.length} files):`);
        alreadyMigrated.forEach(file => {
            console.log(`   ✓ ${file.path}`);
        });
    }

    // 3. ไฟล์ที่ขาด BinaryCodes import
    if (needsImports.length > 0) {
        console.log(`\n⚠️  ไฟล์ที่ขาด BinaryCodes import (${needsImports.length} files):`);
        needsImports.forEach(file => {
            console.log(`   📄 ${file.path}`);
        });
    }

    // สรุป
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('   Summary');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`   ✅ Migrated:        ${alreadyMigrated.length} files`);
    console.log(`   🔴 Need Migration:  ${needsMigration.length} files`);
    console.log(`   ⚠️  Need Imports:    ${needsImports.length} files`);
    console.log(`   📊 Total Scanned:   ${results.length} files`);
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // Export รายการไฟล์ที่ต้องแก้
    if (needsMigration.length > 0) {
        const outputPath = path.join(__dirname, 'files-to-migrate.json');
        const migrationData = needsMigration.map(file => ({
            path: file.path,
            fullPath: file.fullPath,
            reportErrorCount: file.reportErrorLines.length,
            hasUniversalImport: file.hasUniversalReporterImport,
            hasBinaryCodesImport: file.hasBinaryCodesImport
        }));
        
        fs.writeFileSync(outputPath, JSON.stringify(migrationData, null, 2), 'utf8');
        console.log(`💾 รายการไฟล์ที่ต้องแก้ถูกบันทึกที่: ${outputPath}\n`);
    }

    return {
        total: results.length,
        migrated: alreadyMigrated.length,
        needsMigration: needsMigration.length,
        needsImports: needsImports.length
    };
}

// Main execution
console.log('🔍 กำลังสแกนไฟล์...\n');

const srcResults = scanDirectory(path.join(ROOT_DIR, 'src'));
// Check cli.js separately as a single file
const cliPath = path.join(ROOT_DIR, 'cli.js');
if (fs.existsSync(cliPath)) {
    const cliIssues = checkFile(cliPath);
    if (cliIssues) {
        srcResults.push({
            path: 'cli.js',
            fullPath: cliPath,
            ...cliIssues
        });
    }
}

const allResults = [...srcResults];

const summary = displayResults(allResults);

// Exit code
if (summary.needsMigration > 0) {
    console.log('⚠️  พบไฟล์ที่ต้องแก้ไข กรุณาใช้ tools/migrate-error-reporting.js เพื่อแก้ไขอัตโนมัติ\n');
    process.exit(1);
} else {
    console.log('✅ ทุกไฟล์ใช้ Universal Reporter แล้ว!\n');
    process.exit(0);
}
