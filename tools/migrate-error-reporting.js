#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
/**
 * Error Reporting Migration Tool
 * แก้ไขไฟล์จาก reportError (binary-reporter) เป็น report (universal-reporter)
 * แบบปลอดภัย ทีละไฟล์ ไม่ใช้ PowerShell
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * สำรอง (backup) ไฟล์ก่อนแก้ไข
 */
function backupFile(filePath) {
    const backupPath = filePath + '.backup';
    try {
        fs.copyFileSync(filePath, backupPath);
        return backupPath;
    } catch (error) {
        console.error(`❌ ไม่สามารถสำรองไฟล์: ${error.message}`);
        return null;
    }
}

/**
 * แก้ไข imports ในไฟล์
 */
function migrateImports(content) {
    let modified = content;
    let changes = [];

    // แทนที่ import { reportError } จาก binary-reporter
    // เป็น import { report } จาก universal-reporter
    const importPattern = /import\s*\{\s*reportError\s*\}\s*from\s*['"]([^'"]*binary-reporter[^'"]*)['"]/g;
    
    if (importPattern.test(content)) {
        modified = content.replace(
            importPattern,
            (match, path) => {
                const newPath = path.replace('binary-reporter', 'universal-reporter');
                changes.push({
                    type: 'import',
                    old: match,
                    new: `import { report } from '${newPath}'`
                });
                return `import { report } from '${newPath}'`;
            }
        );
    }

    return { modified, changes };
}

/**
 * แก้ไขการเรียกใช้ reportError() เป็น report()
 */
function migrateFunctionCalls(content) {
    let modified = content;
    let changes = [];

    // นับจำนวน reportError() ที่พบ
    const reportErrorMatches = content.match(/reportError\s*\(/g);
    if (reportErrorMatches) {
        modified = content.replace(/reportError\s*\(/g, 'report(');
        changes.push({
            type: 'function_call',
            count: reportErrorMatches.length,
            description: `แทนที่ reportError() เป็น report() จำนวน ${reportErrorMatches.length} จุด`
        });
    }

    return { modified, changes };
}

/**
 * แก้ไขไฟล์ทีละไฟล์
 */
function migrateFile(filePath) {
    console.log(`\n📝 กำลังแก้ไข: ${path.relative(ROOT_DIR, filePath)}`);

    try {
        // อ่านไฟล์
        const original = fs.readFileSync(filePath, 'utf8');
        
        // Backup ก่อน
        const backupPath = backupFile(filePath);
        if (!backupPath) {
            console.log(`   ⚠️  ข้าม (ไม่สามารถ backup ได้)`);
            return { success: false, reason: 'backup_failed' };
        }

        // แก้ไข imports
        const { modified: step1, changes: importChanges } = migrateImports(original);
        
        // แก้ไขการเรียกใช้ functions
        const { modified: step2, changes: callChanges } = migrateFunctionCalls(step1);

        const allChanges = [...importChanges, ...callChanges];

        // ถ้าไม่มีการเปลี่ยนแปลง
        if (allChanges.length === 0) {
            console.log(`   ℹ️  ไม่มีการเปลี่ยนแปลง (ไม่พบ reportError)`);
            fs.unlinkSync(backupPath); // ลบ backup
            return { success: true, reason: 'no_changes' };
        }

        // เขียนไฟล์ใหม่
        fs.writeFileSync(filePath, step2, 'utf8');

        // แสดงการเปลี่ยนแปลง
        console.log(`   ✅ แก้ไขสำเร็จ:`);
        allChanges.forEach(change => {
            if (change.type === 'import') {
                console.log(`      📦 Import: binary-reporter → universal-reporter`);
            } else if (change.type === 'function_call') {
                console.log(`      🔧 ${change.description}`);
            }
        });
        console.log(`   💾 สำรองไฟล์ไว้ที่: ${path.basename(backupPath)}`);

        return { 
            success: true, 
            changes: allChanges.length,
            backup: backupPath
        };

    } catch (error) {
        console.log(`   ❌ เกิดข้อผิดพลาด: ${error.message}`);
        return { success: false, reason: error.message };
    }
}

/**
 * ตรวจสอบว่าไฟล์ใช้งานได้หลังแก้ไข (syntax check)
 */
async function validateFile(filePath) {
    try {
        // พยายาม import ไฟล์เพื่อตรวจสอบ syntax
        await import(`file:///${filePath}`);
        return { valid: true };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// Main execution
async function main() {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('   Error Reporting Migration Tool');
    console.log('   reportError (binary-reporter) → report (universal-reporter)');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // อ่านรายการไฟล์จาก files-to-migrate.json
    const listPath = path.join(__dirname, 'files-to-migrate.json');
    
    if (!fs.existsSync(listPath)) {
        console.log('❌ ไม่พบ files-to-migrate.json');
        console.log('   กรุณารัน: node tools/check-error-reporting.js ก่อน\n');
        process.exit(1);
    }

    const filesToMigrate = JSON.parse(fs.readFileSync(listPath, 'utf8'));
    
    console.log(`📋 พบ ${filesToMigrate.length} ไฟล์ที่ต้องแก้ไข\n`);
    console.log('⚠️  กรุณายืนยัน:');
    console.log('   - ไฟล์จะถูก backup ก่อนแก้ไข (.backup)');
    console.log('   - ไฟล์ต้นฉบับจะถูกแก้ไขโดยตรง');
    console.log('   - สามารถ restore จาก backup ได้ภายหลัง\n');

    // รายการไฟล์ที่จะแก้ไข
    filesToMigrate.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.path} (${file.reportErrorCount} occurrences)`);
    });

    console.log('\n');

    // แก้ไขทีละไฟล์
    const results = {
        success: [],
        failed: [],
        noChanges: []
    };

    for (const file of filesToMigrate) {
        const result = migrateFile(file.fullPath);
        
        if (result.success) {
            if (result.reason === 'no_changes') {
                results.noChanges.push(file.path);
            } else {
                results.success.push({
                    path: file.path,
                    changes: result.changes,
                    backup: result.backup
                });
            }
        } else {
            results.failed.push({
                path: file.path,
                reason: result.reason
            });
        }
    }

    // สรุปผล
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('   Migration Summary');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`   ✅ สำเร็จ:          ${results.success.length} files`);
    console.log(`   ℹ️  ไม่มีการเปลี่ยนแปลง: ${results.noChanges.length} files`);
    console.log(`   ❌ ล้มเหลว:        ${results.failed.length} files`);
    console.log('═══════════════════════════════════════════════════════════════════\n');

    if (results.success.length > 0) {
        console.log('✅ ไฟล์ที่แก้ไขสำเร็จ:');
        results.success.forEach(file => {
            console.log(`   ✓ ${file.path} (${file.changes} changes)`);
        });
        console.log('');
    }

    if (results.failed.length > 0) {
        console.log('❌ ไฟล์ที่ล้มเหลว:');
        results.failed.forEach(file => {
            console.log(`   ✗ ${file.path} (${file.reason})`);
        });
        console.log('');
    }

    console.log('📝 ขั้นตอนต่อไป:');
    console.log('   1. ตรวจสอบไฟล์ที่แก้ไขแล้ว');
    console.log('   2. รัน: node cli.js --help (ทดสอบว่าระบบทำงาน)');
    console.log('   3. รัน: node tools/check-error-reporting.js (ยืนยันว่าแก้ไขครบแล้ว)');
    console.log('   4. ถ้าผ่าน ลบไฟล์ .backup ได้เลย\n');

    process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
