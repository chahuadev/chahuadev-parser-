// ═══════════════════════════════════════════════════════════════════════════════
// test-02-binary-reporter.js - ทดสอบ reportError() Function (BRUTAL EDITION)
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า reportError() รับ Binary Code และ log ได้ถูกต้อง
// ═══════════════════════════════════════════════════════════════════════════════

import { reportError } from '../src/error-handler/binary-reporter.js';
import BinaryCodes from '../src/error-handler/binary-codes.js';

console.log('🧪 TEST 02: Binary Reporter (BRUTAL EDITION)');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;
const bugs = [];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2.1: Report Valid Error Codes
// ═══════════════════════════════════════════════════════════════════════════════
console.log('TEST 2.1: Report Valid Error Codes');
console.log('───────────────────────────────────────────────────────────────');

const testCases = [
    {
        name: 'Parser Syntax Error',
        code: () => BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001),
        context: { file: 'test.js', line: 42, token: '!' }
    },
    {
        name: 'System Configuration Error',
        code: () => BinaryCodes.SYSTEM.CONFIGURATION('ERROR', 'SYSTEM', 2001),
        context: { configFile: 'app.json', missingKey: 'database.host' }
    },
    {
        name: 'Validator Warning',
        code: () => BinaryCodes.VALIDATOR.VALIDATION('WARNING', 'VALIDATOR', 3001),
        context: { rule: 'NO_CONSOLE', file: 'app.js', line: 100 }
    },
];

for (const test of testCases) {
    try {
        const code = test.code();
        reportError(code, test.context);
        console.log(`✅ ${test.name} reported successfully`);
        passed++;
    } catch (error) {
        console.error(`\n❌❌❌ BUG DETECTED: ${test.name} ❌❌❌`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(`📁 File: src/error-handler/binary-reporter.js หรือ BinaryErrorParser.js`);
        console.error(`🐛 Error Type: ${error.name}`);
        console.error(`💬 Error Message: ${error.message}`);
        console.error(`📍 Stack Trace:`);
        
        // Extract ไฟล์และบรรทัดจาก stack trace
        const stackLines = error.stack.split('\n');
        stackLines.slice(1, 6).forEach(line => {
            const match = line.match(/at .+ \((.*):(\d+):(\d+)\)/);
            if (match) {
                const [, file, lineNum, col] = match;
                const fileName = file.split('/').pop() || file.split('\\').pop();
                console.error(`   📄 ${fileName}:${lineNum}:${col}`);
            } else {
                console.error(`   ${line.trim()}`);
            }
        });
        
        console.error(`\n🔍 Root Cause Analysis:`);
        if (test.name.includes('Parser Syntax')) {
            console.error(`   ⚠️  CRITICAL BUG #1: PARSER.SYNTAX กำลัง THROW ERROR!`);
            console.error(`   📋 Expected: ควร LOG ไปที่ logs/errors/critical.log`);
            console.error(`   ❌ Actual: THROW Error object แทน`);
            console.error(`   📁 ต้องแก้ที่: BinaryErrorParser.js → handleError() method`);
            console.error(`   🔧 สาเหตุ: severity.shouldThrow = true ทำให้ throw Error`);
            console.error(`   💡 วิธีแก้: CRITICAL severity ไม่ควร throw ควรแค่ log`);
            bugs.push({
                id: 'BUG-001',
                severity: 'CRITICAL',
                file: 'BinaryErrorParser.js',
                method: 'handleError()',
                issue: 'PARSER.SYNTAX throws instead of logging',
                rootCause: 'severity.shouldThrow = true for CRITICAL',
                fix: 'Change CRITICAL severity to shouldThrow: false OR handle differently in handleError()'
            });
        }
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        failed++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2.2: Report Invalid Error Code (Should trigger META_INVALID_ERROR_CODE)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 2.2: Report Invalid Error Code');
console.log('───────────────────────────────────────────────────────────────');

try {
    reportError('INVALID_CODE_12345', { reason: 'Testing invalid code handling' });
    console.log('✅ Invalid code handled (should trigger META_INVALID_ERROR_CODE)');
    passed++;
} catch (error) {
    console.error(`\n❌❌❌ BUG DETECTED: Invalid Code Handling ❌❌❌`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📁 File: src/error-handler/BinaryErrorParser.js`);
    console.error(`📍 Method: decomposeBinaryCode()`);
    console.error(`🐛 Error Type: ${error.name}`);
    console.error(`💬 Error Message: ${error.message}`);
    
    // Extract exact line
    const stackLines = error.stack.split('\n');
    stackLines.slice(1, 4).forEach(line => {
        const match = line.match(/at .+ \((.*):(\d+):(\d+)\)/);
        if (match) {
            const [, file, lineNum, col] = match;
            const fileName = file.split('/').pop() || file.split('\\').pop();
            console.error(`   📄 ${fileName} → Line ${lineNum}, Column ${col}`);
        }
    });
    
    console.error(`\n🔍 Root Cause Analysis:`);
    console.error(`   ⚠️  CRITICAL BUG #2: Invalid Code ไม่ trigger META_INVALID_ERROR_CODE!`);
    console.error(`   📋 Expected: ตรวจสอบ binaryCode ก่อน BigInt(), ถ้าผิด → ใช้ META_INVALID_ERROR_CODE`);
    console.error(`   ❌ Actual: BigInt('INVALID_CODE_12345') โยน SyntaxError ทันที`);
    console.error(`   📁 ต้องแก้ที่: BinaryErrorParser.js → decomposeBinaryCode() Line ~51`);
    console.error(`   🔧 สาเหตุ: ไม่มี try-catch รอบ BigInt() conversion`);
    console.error(`   💡 วิธีแก้:`);
    console.error(`      1. เพิ่ม try-catch ใน decomposeBinaryCode()`);
    console.error(`      2. ถ้า BigInt() fail → return components with META_INVALID_ERROR_CODE`);
    console.error(`      3. หรือ validate binaryCode format ก่อน BigInt()`);
    
    bugs.push({
        id: 'BUG-002',
        severity: 'CRITICAL',
        file: 'BinaryErrorParser.js',
        method: 'decomposeBinaryCode()',
        line: '~51',
        issue: 'BigInt conversion crashes on invalid code',
        rootCause: 'No try-catch around BigInt(binaryCode)',
        fix: 'Add try-catch, return META_INVALID_ERROR_CODE components on error'
    });
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2.3: Report Empty Context
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 2.3: Report with Empty Context');
console.log('───────────────────────────────────────────────────────────────');

try {
    const code = BinaryCodes.SYSTEM.RUNTIME('INFO', 'SYSTEM', 5001);
    reportError(code, {});
    console.log('✅ Empty context handled');
    passed++;
} catch (error) {
    console.error('❌ Empty context crashed:', error.message);
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2.4: Report with Null Context
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 2.4: Report with Null Context');
console.log('───────────────────────────────────────────────────────────────');

try {
    const code = BinaryCodes.SYSTEM.RUNTIME('INFO', 'SYSTEM', 5002);
    reportError(code, null);
    console.log('✅ Null context handled');
    passed++;
} catch (error) {
    console.error(`\n❌❌❌ BUG DETECTED: Null Context Crash ❌❌❌`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📁 File: src/error-handler/binary-reporter.js หรือ BinaryErrorParser.js`);
    console.error(`🐛 Error Type: ${error.name}`);
    console.error(`💬 Error Message: ${error.message}`);
    
    const stackLines = error.stack.split('\n');
    stackLines.slice(1, 4).forEach(line => {
        const match = line.match(/at .+ \((.*):(\d+):(\d+)\)/);
        if (match) {
            const [, file, lineNum, col] = match;
            const fileName = file.split('/').pop() || file.split('\\').pop();
            console.error(`   📄 ${fileName} → Line ${lineNum}, Column ${col}`);
        }
    });
    
    console.error(`\n🔍 Root Cause Analysis:`);
    console.error(`   ⚠️  CRITICAL BUG #3: Null Context ทำให้ Crash!`);
    console.error(`   📋 Expected: ควร handle null/undefined context gracefully`);
    console.error(`   ❌ Actual: "Cannot convert undefined or null to object"`);
    console.error(`   📁 ต้องแก้ที่: binary-reporter.js หรือ BinaryErrorParser.js`);
    console.error(`   🔧 สาเหตุ: พยายาม spread operator {...context} กับ null`);
    console.error(`   💡 วิธีแก้:`);
    console.error(`      1. ตรวจสอบ context ก่อนใช้: context = context || {}`);
    console.error(`      2. หรือใช้ context = { ...(context || {}) }`);
    console.error(`      3. Validate context parameter ตั้งแต่ reportError()`);
    
    bugs.push({
        id: 'BUG-003',
        severity: 'HIGH',
        file: 'binary-reporter.js OR BinaryErrorParser.js',
        issue: 'Null context causes crash',
        rootCause: 'No null check before spreading context object',
        fix: 'Add context = context || {} OR {...(context || {})}'
    });
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// สรุปผล + Bug Report
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('═══════════════════════════════════════════════════════════════');

if (bugs.length > 0) {
    console.log('\n🐛🐛🐛 BUG REPORT SUMMARY 🐛🐛🐛');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    bugs.forEach((bug, index) => {
        console.log(`\n${index + 1}. ${bug.id} [${bug.severity}]`);
        console.log(`   📁 File: ${bug.file}`);
        if (bug.method) console.log(`   ⚙️  Method: ${bug.method}`);
        if (bug.line) console.log(`   📍 Line: ${bug.line}`);
        console.log(`   🐛 Issue: ${bug.issue}`);
        console.log(`   🔍 Root Cause: ${bug.rootCause}`);
        console.log(`   💡 Fix: ${bug.fix}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n⚠️  Total Bugs Found: ${bugs.length}`);
    console.log('⚠️  ต้องแก้ไฟล์: BinaryErrorParser.js, binary-reporter.js');
    console.log('⚠️  Priority: CRITICAL - ระบบ Error Handling ยังไม่พร้อมใช้งาน!\n');
}

process.exit(failed > 0 ? 1 : 0);
