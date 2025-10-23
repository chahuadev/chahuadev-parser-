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
// TEST 2.1: Report Valid Error Codes (สันนิษฐานว่าแก้ BUG-001 แล้ว)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('TEST 2.1: Report Valid Error Codes');
console.log('───────────────────────────────────────────────────────────────');

const testCases = [
    {
        name: 'Parser Syntax Error (CRITICAL)',
        code: () => BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001),
        context: { file: 'test.js', line: 42, token: '!' }
    },
    {
        name: 'System Configuration Error (ERROR)',
        code: () => BinaryCodes.SYSTEM.CONFIGURATION('ERROR', 'SYSTEM', 2001),
        context: { configFile: 'app.json', missingKey: 'database.host' }
    },
    {
        name: 'Validator Warning (WARNING)',
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
        // (Bug Report Logic... ถ้ายังแก้ไม่ผ่าน)
        console.error(`\n❌❌❌ BUG DETECTED: ${test.name} ❌❌❌`);
        console.error(`   🐛 Error: ${error.message}`);
        console.error(`   💡 Fix: CRITICAL/ERROR/FATAL/EMERGENCY 'shouldThrow' = false?`);
        failed++;
        bugs.push({ id: 'BUG-001', issue: `${test.name} still throwing` });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 2.2: Report Invalid Error Code (สันนิษฐานว่าแก้ BUG-002 แล้ว)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 2.2: Report Invalid Error Code');
console.log('───────────────────────────────────────────────────────────────');

try {
    reportError('INVALID_CODE_12345', { reason: 'Testing invalid code handling' });
    console.log('✅ Invalid code handled (triggered META_INVALID_ERROR_CODE)');
    passed++;
} catch (error) {
    console.error(`\n❌❌❌ BUG DETECTED: Invalid Code Handling ❌❌❌`);
    console.error(`   🐛 Error: ${error.message}`);
    console.error(`   💡 Fix: เพิ่ม try-catch(BigInt(code)) ใน binary-reporter.js`);
    failed++;
    bugs.push({ id: 'BUG-002', issue: 'Invalid string code crashed' });
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
// TEST 2.4: Report with Null Context (สันนิษฐานว่าแก้ BUG-003 แล้ว)
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
    console.error(`   🐛 Error: ${error.message}`);
    console.error(`   💡 Fix: ใช้ const context = payload.context || {} ใน BinaryErrorParser.js`);
    failed++;
    bugs.push({ id: 'BUG-003', issue: 'Null context crashed' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 NEW BRUTAL TEST 2.5 🔥🔥🔥
// TEST 2.5: Report with Circular Context
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 2.5: Report with Circular Context');
console.log('───────────────────────────────────────────────────────────────');

try {
    const code = BinaryCodes.RUNTIME.LOGIC('WARNING', 'RUNTIME', 6001);
    const circularContext = {};
    circularContext.a = { b: circularContext }; // Circular reference
    
    reportError(code, circularContext);
    
    console.log('✅ Circular context handled (should log <unserializable>)');
    passed++;
} catch (error) {
    console.error(`\n❌❌❌ BUG DETECTED: Circular Context Crash ❌❌❌`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📁 File: src/error-handler/binary-log-stream.js`);
    console.error(`⚙️  Method: writeToStream()`);
    console.error(`🐛 Error Type: ${error.name}`);
    console.error(`💬 Error Message: ${error.message}`);
    console.error(`\n🔍 Root Cause Analysis:`);
    console.error(`   ⚠️  CRITICAL BUG #4: JSON.stringify(metadata) พังเพราะ Circular Reference!`);
    console.error(`   📋 Expected: ควร Log META=<unserializable>`);
    console.error(`   ❌ Actual: Crash`);
    console.error(`   💡 Fix: ตรวจสอบ try-catch รอบ JSON.stringify ใน 'writeToStream'`);
    
    bugs.push({
        id: 'BUG-004',
        severity: 'HIGH',
        file: 'binary-log-stream.js',
        method: 'writeToStream()',
        issue: 'JSON.stringify crashed on circular context',
        rootCause: 'No try-catch or faulty try-catch for JSON.stringify(metadata)',
        fix: 'Ensure JSON.stringify is wrapped in try-catch'
    });
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// สรุปผล
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('═══════════════════════════════════════════════════════════════');

if (bugs.length > 0) {
    console.log(`\n🐛🐛🐛 ${bugs.length} BUGS DETECTED 🐛🐛🐛\n`);
    bugs.forEach((bug, index) => {
        console.log(`BUG #${index + 1}: ${bug.id}`);
        console.log(`  Issue: ${bug.issue}`);
        if (bug.rootCause) console.log(`  Root Cause: ${bug.rootCause}`);
        if (bug.fix) console.log(`  Fix: ${bug.fix}`);
        console.log('');
    });
}

process.exit(failed > 0 ? 1 : 0);
