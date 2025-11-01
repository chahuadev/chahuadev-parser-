#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
//  Apple Tree Philosophy Scanner - ตรวจสอบต้นแอปเปิ้ลที่พยายามโกง
// ═══════════════════════════════════════════════════════════════════════════════
// Purpose: หาทุกรูปแบบที่ต้นแอปเปิ้ลพยายามพูด/โกง/หลอกลวง
// Philosophy: ต้นแอปเปิ้ลแค่ออกผล - คนงานมาเก็บและจัดการเอง
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════════════════════════════
//  Violation Patterns - ตรวจจับทุกรูปแบบการโกง
// ═══════════════════════════════════════════════════════════════════════════════

const PATTERNS = {
    //  report() ที่ถูกต้อง - ต้องเป็นบรรทัดเดียวพอดี
    correctReport: /^[\s]*report\s*\(\s*BinaryCodes\.[A-Z_]+\.[A-Z_]+\s*\(\s*\d+\s*\)\s*\)\s*;[\s]*$/,
    
    //  report() ที่ผิด - มี comma ตามหลัง (มี context)
    wrongReportContext: /report\s*\(\s*BinaryCodes\.[A-Z_]+\.[A-Z_]+\s*\(\s*\d+\s*\)\s*,/,
    
    //  report() ที่ผิด - ไม่มี semicolon ท้ายบรรทัด
    wrongReportNoSemicolon: /report\s*\(\s*BinaryCodes\.[A-Z_]+\.[A-Z_]+\s*\(\s*\d+\s*\)\s*\)\s*$/,
    
    //  report() ที่ผิด - มีอะไรต่อท้าย (ยกเว้น comment)
    wrongReportExtra: /report\s*\(\s*BinaryCodes\.[A-Z_]+\.[A-Z_]+\s*\(\s*\d+\s*\)\s*\)\s*;(?!\s*(?:\/\/|$)).+/,
    
    //  ต้นแอปเปิ้ลกำหนดสถานะ
    setOperational: /error\.isOperational\s*=/,
    
    //  catch เงียบ
    silentCatch: /catch\s*\([^)]*\)\s*\{\s*\}/,
    
    //  console แทน report
    useConsole: /console\.(log|error|warn|info|debug|trace)\s*\(/,
    
    //  process write
    processWrite: /process\.(stdout|stderr)\.write\s*\(/,
    
    //  throw Error
    throwError: /throw\s+new\s+Error\s*\(/,
    
    //  ป้ายถูกต้อง
    correctLabel: /\/\/\s*FIX:\s*Universal\s*Reporter\s*-\s*Auto-collect/
};

// ═══════════════════════════════════════════════════════════════════════════════
//  Files Configuration
// ═══════════════════════════════════════════════════════════════════════════════

const IGNORE = [
    'node_modules', '.git', 'logs', 'docs', 'test',
    'binary-codes.js', 'universal-reporter.js', 
    'error-collector.js', 'data-serializer.js',
    'add-language.js', 'grammar-converter.js'
];

function getAllJsFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !IGNORE.includes(file)) {
            getAllJsFiles(fullPath, files);
        } else if (file.endsWith('.js')) {
            const relPath = path.relative(projectRoot, fullPath);
            if (!IGNORE.some(ig => relPath.includes(ig))) {
                files.push(fullPath);
            }
        }
    });
    
    return files;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Scanner Class
// ═══════════════════════════════════════════════════════════════════════════════

class Scanner {
    constructor() {
        this.stats = {
            totalFiles: 0,
            filesWithViolations: 0,
            totalViolations: 0,
            correctReports: 0,
            correctLabels: 0,
            violations: {
                wrongReportContext: 0,
                wrongReportNoSemicolon: 0,
                wrongReportExtra: 0,
                codeAfterReport: 0,
                setOperational: 0,
                silentCatch: 0,
                catchNoReport: 0,
                useConsole: 0,
                processWrite: 0,
                throwError: 0
            }
        };
        this.fileResults = [];
    }
    
    scan(filePath) {
        this.stats.totalFiles++;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const relPath = path.relative(projectRoot, filePath);
        
        const result = {
            file: relPath,
            issues: [],
            correctReports: 0,
            correctLabels: 0
        };
        
        // Scan line by line
        lines.forEach((line, idx) => {
            const num = idx + 1;
            const nextLine = lines[idx + 1];
            
            // Check correct pattern FIRST
            const isCorrect = PATTERNS.correctReport.test(line);
            
            if (isCorrect) {
                // ตรวจสอบบรรทัดถัดไป - ต้องเป็น }, }); หรือว่างเท่านั้น
                if (nextLine !== undefined) {
                    const trimmedNext = nextLine.trim();
                    const validNext = trimmedNext === '' || 
                                    trimmedNext === '}' ||
                                    trimmedNext === '});' ||
                                    trimmedNext === '})' ||
                                    trimmedNext.startsWith('//') ||
                                    trimmedNext.startsWith('/*') ||
                                    /^[\s]*report\s*\(/.test(trimmedNext);
                    
                    if (!validNext && trimmedNext !== '') {
                        result.issues.push({ 
                            line: num, 
                            type: 'code-after-report', 
                            code: `${line.trim()} [NEXT: ${trimmedNext.substring(0, 40)}]` 
                        });
                        this.stats.violations.codeAfterReport = (this.stats.violations.codeAfterReport || 0) + 1;
                        return;
                    }
                }
                
                result.correctReports++;
                this.stats.correctReports++;
                return; // ถูกต้อง ข้ามไป
            }
            
            // ตรวจสอบ report() ที่ผิด
            if (PATTERNS.wrongReportContext.test(line)) {
                result.issues.push({ line: num, type: 'wrong-report-context', code: line.trim() });
                this.stats.violations.wrongReportContext++;
            } else if (line.includes('report(') && line.includes('BinaryCodes.')) {
                // มี report() แต่ไม่ตรง pattern ถูกต้อง
                if (!line.trim().endsWith(');')) {
                    result.issues.push({ line: num, type: 'wrong-report-no-semicolon', code: line.trim() });
                    this.stats.violations.wrongReportNoSemicolon++;
                } else if (PATTERNS.wrongReportExtra.test(line)) {
                    result.issues.push({ line: num, type: 'wrong-report-extra', code: line.trim() });
                    this.stats.violations.wrongReportExtra++;
                }
            }
            
            // Violations อื่นๆ
            if (PATTERNS.setOperational.test(line)) {
                result.issues.push({ line: num, type: 'set-operational', code: line.trim() });
                this.stats.violations.setOperational++;
            }
            if (PATTERNS.silentCatch.test(line)) {
                result.issues.push({ line: num, type: 'silent-catch', code: line.trim() });
                this.stats.violations.silentCatch++;
            }
            if (PATTERNS.useConsole.test(line)) {
                result.issues.push({ line: num, type: 'use-console', code: line.trim() });
                this.stats.violations.useConsole++;
            }
            if (PATTERNS.processWrite.test(line)) {
                result.issues.push({ line: num, type: 'process-write', code: line.trim() });
                this.stats.violations.processWrite++;
            }
            if (PATTERNS.throwError.test(line)) {
                result.issues.push({ line: num, type: 'throw-error', code: line.trim() });
                this.stats.violations.throwError++;
            }
            
            // Correct patterns
            if (PATTERNS.correctLabel.test(line)) {
                result.correctLabels++;
                this.stats.correctLabels++;
            }
        });
        
        // Scan multi-line catch blocks without report
        this.scanCatchBlocks(content, result);
        
        if (result.issues.length > 0) {
            this.stats.filesWithViolations++;
            this.stats.totalViolations += result.issues.length;
            this.fileResults.push(result);
        }
    }
    
    scanCatchBlocks(content, result) {
        // Find catch blocks that don't have report inside
        const regex = /catch\s*\([^)]*\)\s*\{[^}]*\}/gs;
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            const block = match[0];
            const hasReport = /report\s*\(/.test(block);
            const isEmpty = /catch\s*\([^)]*\)\s*\{\s*\}/.test(block);
            
            if (!isEmpty && !hasReport) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                const code = block.substring(0, 60).replace(/\n/g, ' ') + '...';
                
                // Check not duplicate
                const exists = result.issues.some(i => 
                    i.line === lineNum && i.type === 'catch-no-report'
                );
                
                if (!exists) {
                    result.issues.push({ 
                        line: lineNum, 
                        type: 'catch-no-report', 
                        code 
                    });
                    this.stats.violations.catchNoReport++;
                }
            }
        }
    }
    
    report() {
        console.log('\n' + '═'.repeat(80));
        console.log(' APPLE TREE SCANNER - ตรวจสอบต้นแอปเปิ้ลที่พยายามโกง');
        console.log('═'.repeat(80));
        console.log(`\n สถิติ:`);
        console.log(`   ไฟล์สแกน:          ${this.stats.totalFiles}`);
        console.log(`   ไฟล์มีปัญหา:       ${this.stats.filesWithViolations}`);
        console.log(`   การฝ่าฝืนทั้งหมด:   ${this.stats.totalViolations}`);
        console.log(`   report() ถูกต้อง:   ${this.stats.correctReports}`);
        console.log(`   ป้ายถูกต้อง:        ${this.stats.correctLabels}`);
        
        if (this.stats.totalViolations === 0) {
            console.log('\n' + '═'.repeat(80));
            console.log(' ไม่พบการฝ่าฝืน - ต้นแอปเปิ้ลทุกต้นทำหน้าที่ถูกต้อง!');
            console.log('═'.repeat(80) + '\n');
            return;
        }
        
        console.log('\n' + '─'.repeat(80));
        console.log(' รายละเอียดการฝ่าฝืน:');
        console.log('─'.repeat(80));
        
        this.fileResults.forEach(file => {
            console.log(`\n ${file.file}`);
            console.log(`   ปัญหา: ${file.issues.length} | ถูกต้อง: ${file.correctReports} | ป้าย: ${file.correctLabels}`);
            
            const critical = file.issues.filter(i => 
                ['code-after-report', 'wrong-report-context', 'wrong-report-no-semicolon', 'wrong-report-extra', 
                 'set-operational', 'silent-catch', 'catch-no-report'].includes(i.type)
            );
            const high = file.issues.filter(i => 
                ['use-console', 'process-write', 'throw-error'].includes(i.type)
            );
            
            if (critical.length > 0) {
                console.log(`\n    CRITICAL (${critical.length}):`);
                critical.forEach(v => {
                    const msg = this.getMessage(v.type);
                    console.log(`      Line ${v.line}: ${msg}`);
                    console.log(`             ${v.code}`);
                });
            }
            
            if (high.length > 0) {
                console.log(`\n     HIGH (${high.length}):`);
                high.forEach(v => {
                    const msg = this.getMessage(v.type);
                    console.log(`      Line ${v.line}: ${msg}`);
                    console.log(`             ${v.code}`);
                });
            }
        });
        
        console.log('\n' + '═'.repeat(80));
        console.log(' สรุปตามประเภท:');
        console.log('═'.repeat(80));
        
        const v = this.stats.violations;
        console.log('\n CRITICAL:');
        console.log(`      โค้ดหลัง report():       ${v.codeAfterReport || 0}`);
        console.log(`    report() มี context:        ${v.wrongReportContext}`);
        console.log(`    report() ไม่มี semicolon:   ${v.wrongReportNoSemicolon}`);
        console.log(`    report() มีอะไรต่อท้าย:     ${v.wrongReportExtra}`);
        console.log(`    กำหนด isOperational:        ${v.setOperational}`);
        console.log(`    catch เงียบ:                ${v.silentCatch}`);
        console.log(`    catch ไม่ report:           ${v.catchNoReport}`);
        
        console.log('\n  HIGH:');
        console.log(`    ใช้ console:               ${v.useConsole}`);
        console.log(`    ใช้ process write:         ${v.processWrite}`);
        console.log(`    throw Error:               ${v.throwError}`);
        
        console.log('\n ถูกต้อง:');
        console.log(`    report():                  ${this.stats.correctReports}`);
        console.log(`     ป้าย:                     ${this.stats.correctLabels}`);
        
        console.log('\n' + '═'.repeat(80));
        console.log(' Apple Tree Philosophy');
        console.log('═'.repeat(80));
        console.log('\n ผิด:');
        console.log('   report(BinaryCodes.XXX.YYY(123), { ... });  // พูดเกินหน้าที่');
        console.log('   error.isOperational = true;                 // กำหนดเอง');
        console.log('   catch(e) {}                                 // โกง - เงียบ');
        console.log('\n ถูก:');
        console.log('   // FIX: Universal Reporter - Auto-collect');
        console.log('   report(BinaryCodes.XXX.YYY(123));');
        console.log('\n คนงานทำให้อัตโนมัติ:');
        console.log('    เก็บ context จาก stack');
        console.log('    กำหนด isOperational');
        console.log('    แยกประเภท severity/domain');
        console.log('    เขียน log');
        console.log('\n ต้นแอปเปิ้ลแค่ออกผล - ห้ามพูด ห้ามโกง!');
        console.log('═'.repeat(80) + '\n');
    }
    
    getMessage(type) {
        const messages = {
            'code-after-report': '  มีโค้ดหลัง report() - บรรทัดถัดไปต้องเป็น } เท่านั้น!',
            'wrong-report-context': ' report() มี context object',
            'wrong-report-no-semicolon': ' report() ไม่มี semicolon',
            'wrong-report-extra': ' report() มีอะไรต่อท้าย',
            'set-operational': ' กำหนด isOperational',
            'silent-catch': ' catch เงียบ',
            'catch-no-report': ' catch ไม่ report',
            'use-console': ' ใช้ console',
            'process-write': ' ใช้ process write',
            'throw-error': ' throw Error'
        };
        return messages[type] || type;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n สแกนต้นแอปเปิ้ล...');

const scanner = new Scanner();
const files = getAllJsFiles(path.join(projectRoot, 'src'));

// Add root files
['cli.js', 'extension.js', 'extension-wrapper.js'].forEach(f => {
    const p = path.join(projectRoot, f);
    if (fs.existsSync(p)) files.push(p);
});

files.forEach(f => scanner.scan(f));
scanner.report();

process.exit(scanner.stats.totalViolations > 0 ? 1 : 0);
