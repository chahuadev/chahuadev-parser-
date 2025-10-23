// ═══════════════════════════════════════════════════════════════════════════════
// test-03-binary-parser.js - ทดสอบ BinaryErrorParser
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า BinaryErrorParser แยก Binary Code และ render ได้ถูกต้อง
// ═══════════════════════════════════════════════════════════════════════════════

import binaryErrorParser from '../src/error-handler/BinaryErrorParser.js';
import { binaryErrorGrammar } from '../src/error-handler/binary-error.grammar.js';
import BinaryCodes from '../src/error-handler/binary-codes.js';

console.log('🧪 TEST 03: Binary Error Parser');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;
const bugs = [];

const parser = binaryErrorParser;

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3.1: Decompose Binary Code
// ═══════════════════════════════════════════════════════════════════════════════
console.log('TEST 3.1: Decompose Binary Code');
console.log('───────────────────────────────────────────────────────────────');

try {
    const code = BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001);
    const components = parser.decomposeBinaryCode(code);
    
    console.log('Binary Code:', code);
    console.log('Decomposed:');
    console.log('  Domain:', components.domain?.name || 'N/A');
    console.log('  Category:', components.category?.name || 'N/A');
    console.log('  Severity:', components.severity?.name || 'N/A');
    console.log('  Source:', components.source?.name || 'N/A');
    console.log('  Offset:', components.offset);
    
    // Validate all components exist
    const missingComponents = [];
    if (!components.domain) missingComponents.push('domain');
    if (!components.category) missingComponents.push('category');
    if (!components.severity) missingComponents.push('severity');
    if (!components.source) missingComponents.push('source');
    if (components.offset === undefined) missingComponents.push('offset');
    
    if (missingComponents.length > 0) {
        console.error('\n❌❌❌ BUG: Incomplete Decomposition! ❌❌❌');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('📁 File: src/error-handler/BinaryErrorParser.js');
        console.error('⚙️  Method: decomposeBinaryCode()');
        console.error('🐛 Issue: Missing components:', missingComponents.join(', '));
        console.error('🔍 Root Cause:');
        console.error('   - Bitwise operations ไม่ถูกต้อง');
        console.error('   - Map lookup ไม่เจอ component');
        console.error('   - BigInt conversion ผิดพลาด');
        console.error('💡 Fix: ตรวจสอบ decomposeBinaryCode() logic และ Map construction');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        bugs.push({
            id: 'BUG-PARSER-001',
            severity: 'CRITICAL',
            file: 'BinaryErrorParser.js',
            method: 'decomposeBinaryCode()',
            issue: `Missing components: ${missingComponents.join(', ')}`,
            fix: 'Fix bitwise operations and Map lookups'
        });
        failed++;
    } else {
        console.log('✅ Successfully decomposed binary code');
        passed++;
    }
} catch (error) {
    console.error('\n❌❌❌ BUG: Decomposition Crashed! ❌❌❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('📁 File: src/error-handler/BinaryErrorParser.js');
    console.error('⚙️  Method: decomposeBinaryCode()');
    console.error('🐛 Error:', error.message);
    console.error('📍 Stack:', error.stack.split('\n').slice(0, 3).join('\n'));
    console.error('💡 Fix: Handle errors gracefully in decomposeBinaryCode()');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    bugs.push({
        id: 'BUG-PARSER-002',
        severity: 'CRITICAL',
        file: 'BinaryErrorParser.js',
        method: 'decomposeBinaryCode()',
        issue: 'Decomposition crashed',
        rootCause: error.message
    });
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3.2: Render Human-Readable Error
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.2: Render Human-Readable Error');
console.log('───────────────────────────────────────────────────────────────');

try {
    const code = BinaryCodes.SYSTEM.CONFIGURATION('ERROR', 'SYSTEM', 2001);
    const rendered = parser.renderHumanReadable(code, {
        configFile: 'app.json',
        missingKey: 'database.host'
    });
    
    console.log('Rendered Error:');
    console.log(rendered);
    
    if (rendered.includes('SYSTEM') && rendered.includes('CONFIGURATION')) {
        console.log('✅ Successfully rendered human-readable error');
        passed++;
    } else {
        console.error('❌ Rendered output missing key information');
        failed++;
    }
} catch (error) {
    console.error('❌ Rendering failed:', error.message);
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3.3: Handle Invalid Binary Code
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.3: Handle Invalid Binary Code');
console.log('───────────────────────────────────────────────────────────────');

try {
    const components = parser.decomposeBinaryCode('INVALID_CODE');
    console.error('\n❌❌❌ BUG: Invalid Code NOT Rejected in Parser! ❌❌❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('📁 File: src/error-handler/BinaryErrorParser.js');
    console.error('⚙️  Method: decomposeBinaryCode()');
    console.error('🐛 Issue: Invalid code did not throw error');
    console.error('❌ Expected: Should throw SyntaxError or return META_INVALID_ERROR_CODE');
    console.error('✅ Actual: Returned components:', JSON.stringify(components, null, 2));
    console.error('💡 Fix: Add try-catch around BigInt() OR validate code format first');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    bugs.push({
        id: 'BUG-PARSER-003',
        severity: 'CRITICAL',
        file: 'BinaryErrorParser.js',
        method: 'decomposeBinaryCode()',
        issue: 'Invalid code not rejected',
        fix: 'Add validation or try-catch'
    });
    failed++;
} catch (error) {
    console.log('✅ Correctly rejected invalid binary code:', error.message);
    passed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3.4: Test shouldThrow Logic
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.4: Test shouldThrow Logic');
console.log('───────────────────────────────────────────────────────────────');

const testSeverities = [
    { severity: 'CRITICAL', shouldThrow: true },
    { severity: 'FATAL', shouldThrow: true },
    { severity: 'ERROR', shouldThrow: true },
    { severity: 'WARNING', shouldThrow: false },
    { severity: 'INFO', shouldThrow: false },
];

for (const test of testSeverities) {
    try {
        const code = BinaryCodes.SYSTEM.RUNTIME(test.severity, 'SYSTEM', 3001);
        const components = parser.decomposeBinaryCode(code);
        
        if (components.severity.shouldThrow === test.shouldThrow) {
            console.log(`✅ ${test.severity}: shouldThrow = ${test.shouldThrow}`);
            passed++;
        } else {
            console.error(`❌ ${test.severity}: expected shouldThrow = ${test.shouldThrow}, got ${components.severity.shouldThrow}`);
            failed++;
        }
    } catch (error) {
        console.error(`❌ ${test.severity} test failed:`, error.message);
        failed++;
    }
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
        if (bug.rootCause) console.log(`   🔍 Root Cause: ${bug.rootCause}`);
        if (bug.fix) console.log(`   💡 Fix: ${bug.fix}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n⚠️  Total Bugs Found: ${bugs.length}`);
    console.log('⚠️  ต้องแก้ไฟล์: BinaryErrorParser.js\n');
} else {
    console.log('\n🎉🎉🎉 PERFECT! Binary Parser works correctly! 🎉🎉🎉\n');
}

process.exit(failed > 0 ? 1 : 0);
