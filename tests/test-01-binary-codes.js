// ═══════════════════════════════════════════════════════════════════════════════
// test-01-binary-codes.js - ทดสอบ BinaryCodes Factory
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า binary-codes.js สร้าง Error Builder ได้ถูกต้องทุก Domain/Category
// ═══════════════════════════════════════════════════════════════════════════════

import BinaryCodes from '../src/error-handler/binary-codes.js';

console.log('🧪 TEST 01: BinaryCodes Factory');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;
const bugs = [];
const warnings = [];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1.1: ตรวจสอบว่า BinaryCodes มี Domains ที่ต้องการ
// ═══════════════════════════════════════════════════════════════════════════════
console.log('TEST 1.1: Available Domains');
console.log('───────────────────────────────────────────────────────────────');
const domains = Object.keys(BinaryCodes);
console.log('Domains:', domains);
console.log('Total Domains:', domains.length);

const expectedDomains = ['SYSTEM', 'PARSER', 'TYPE_SYSTEM', 'VALIDATOR', 'SECURITY', 'RUNTIME', 'IO', 'NETWORK', 'DATABASE', 'EXTENSION'];
const missingDomains = expectedDomains.filter(d => !domains.includes(d));
if (missingDomains.length > 0) {
    console.error('\n❌❌❌ CRITICAL: Missing Domains! ❌❌❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('📁 File: src/error-handler/binary-codes.js');
    console.error('🐛 Issue: BinaryCodes Factory ไม่สร้าง Builder สำหรับ Domains ต่อไปนี้:');
    console.error('   Missing:', missingDomains.join(', '));
    console.error('🔍 Root Cause: binary-error.grammar.js อาจไม่มี domains เหล่านี้');
    console.error('💡 Fix: เพิ่ม domains ที่ขาดไปใน binary-error.grammar.js');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    bugs.push({
        id: 'BUG-DOMAIN-001',
        severity: 'CRITICAL',
        file: 'binary-codes.js',
        issue: `Missing domains: ${missingDomains.join(', ')}`,
        fix: 'Add missing domains to binary-error.grammar.js'
    });
    failed++;
} else {
    console.log('✅ All expected domains present');
    passed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1.2: ทดสอบสร้าง Binary Code สำหรับแต่ละ Domain
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 1.2: Generate Binary Codes');
console.log('───────────────────────────────────────────────────────────────');

const testCases = [
    { domain: 'PARSER', category: 'SYNTAX', severity: 'CRITICAL', source: 'PARSER', offset: 1001 },
    { domain: 'SYSTEM', category: 'CONFIGURATION', severity: 'ERROR', source: 'SYSTEM', offset: 2001 },
    { domain: 'VALIDATOR', category: 'VALIDATION', severity: 'WARNING', source: 'VALIDATOR', offset: 3001 },
    { domain: 'RUNTIME', category: 'RUNTIME', severity: 'ERROR', source: 'RUNTIME', offset: 4001 },
];

for (const test of testCases) {
    try {
        const code = BinaryCodes[test.domain][test.category](test.severity, test.source, test.offset);
        console.log(`✅ ${test.domain}.${test.category}:`, code);
        
        // Validate code is a string number
        if (typeof code !== 'string' || isNaN(code)) {
            console.error('\n⚠️  WARNING: Invalid Code Format');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error(`📁 File: src/error-handler/binary-code-utils.js`);
            console.error(`⚙️  Method: composeBinaryCode() or createErrorCodeBuilder()`);
            console.error(`🐛 Issue: Generated code is not a valid string number`);
            console.error(`   Type: ${typeof code}, Value: ${code}`);
            console.error(`💡 Fix: composeBinaryCode() should return String(bigIntCode)`);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            warnings.push({
                id: 'WARN-001',
                file: 'binary-code-utils.js',
                issue: 'Invalid code format returned'
            });
        }
        passed++;
    } catch (error) {
        console.error(`\n❌❌❌ BUG: ${test.domain}.${test.category} Failed ❌❌❌`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(`📁 File: src/error-handler/binary-code-utils.js`);
        console.error(`⚙️  Method: createErrorCodeBuilder()`);
        console.error(`🐛 Error: ${error.message}`);
        console.error(`🔍 Test Case:`);
        console.error(`   Domain: ${test.domain}`);
        console.error(`   Category: ${test.category}`);
        console.error(`   Severity: ${test.severity}`);
        console.error(`   Source: ${test.source}`);
        console.error(`💡 Possible Causes:`);
        console.error(`   1. Grammar ไม่มี ${test.domain} domain`);
        console.error(`   2. Grammar ไม่มี ${test.category} category`);
        console.error(`   3. Grammar ไม่มี ${test.severity} severity`);
        console.error(`   4. Grammar ไม่มี ${test.source} source`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        bugs.push({
            id: `BUG-CODE-${test.domain}`,
            severity: 'HIGH',
            file: 'binary-code-utils.js',
            issue: `Cannot generate code for ${test.domain}.${test.category}`,
            rootCause: error.message
        });
        failed++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 1.3: ทดสอบ Error Handling สำหรับ Invalid Parameters
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 1.3: Error Handling for Invalid Parameters');
console.log('───────────────────────────────────────────────────────────────');

// Test invalid severity
try {
    const code = BinaryCodes.SYSTEM.CONFIGURATION('INVALID_SEVERITY', 'SYSTEM', 1);
    console.error('\n❌❌❌ BUG: Invalid Severity NOT Rejected! ❌❌❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📁 File: src/error-handler/binary-code-utils.js`);
    console.error(`⚙️  Method: composeBinaryCodeByName()`);
    console.error(`🐛 Issue: Invalid severity 'INVALID_SEVERITY' was accepted!`);
    console.error(`❌ Expected: Should throw error`);
    console.error(`✅ Actual: Returned code: ${code}`);
    console.error(`💡 Fix: Add validation in composeBinaryCodeByName() to check severity exists`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    bugs.push({
        id: 'BUG-VALIDATION-001',
        severity: 'HIGH',
        file: 'binary-code-utils.js',
        method: 'composeBinaryCodeByName()',
        issue: 'Invalid severity not rejected',
        fix: 'Add severity validation'
    });
    failed++;
} catch (error) {
    console.log('✅ Correctly rejected invalid severity:', error.message);
    passed++;
}

// Test invalid source
try {
    const code = BinaryCodes.SYSTEM.CONFIGURATION('ERROR', 'INVALID_SOURCE', 1);
    console.error('\n❌❌❌ BUG: Invalid Source NOT Rejected! ❌❌❌');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`📁 File: src/error-handler/binary-code-utils.js`);
    console.error(`⚙️  Method: composeBinaryCodeByName()`);
    console.error(`🐛 Issue: Invalid source 'INVALID_SOURCE' was accepted!`);
    console.error(`❌ Expected: Should throw error`);
    console.error(`✅ Actual: Returned code: ${code}`);
    console.error(`💡 Fix: Add validation in composeBinaryCodeByName() to check source exists`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    bugs.push({
        id: 'BUG-VALIDATION-002',
        severity: 'HIGH',
        file: 'binary-code-utils.js',
        method: 'composeBinaryCodeByName()',
        issue: 'Invalid source not rejected',
        fix: 'Add source validation'
    });
    failed++;
} catch (error) {
    console.log('✅ Correctly rejected invalid source:', error.message);
    passed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// สรุปผล + Bug Report
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('═══════════════════════════════════════════════════════════════');

if (warnings.length > 0) {
    console.log('\n⚠️⚠️⚠️  WARNINGS ⚠️⚠️⚠️');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    warnings.forEach((warn, index) => {
        console.log(`${index + 1}. ${warn.id}: ${warn.issue}`);
        console.log(`   📁 File: ${warn.file}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

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
        console.log(`   💡 Fix: ${bug.fix}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n⚠️  Total Bugs Found: ${bugs.length}`);
    console.log('⚠️  ต้องแก้ไฟล์: binary-codes.js, binary-code-utils.js, binary-error.grammar.js\n');
}

if (bugs.length === 0 && warnings.length === 0) {
    console.log('\n🎉🎉🎉 PERFECT! No bugs or warnings found! 🎉🎉🎉\n');
}

process.exit(failed > 0 ? 1 : 0);
