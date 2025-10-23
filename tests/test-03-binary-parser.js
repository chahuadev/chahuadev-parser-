// ═══════════════════════════════════════════════════════════════════════════════
// test-03-binary-parser.js - ทดสอบ BinaryErrorParser (BRUTAL EDITION)
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า BinaryErrorParser แยก Binary Code และ render ได้ถูกต้อง
// ═══════════════════════════════════════════════════════════════════════════════

import binaryErrorParser from '../src/error-handler/BinaryErrorParser.js';
import { binaryErrorGrammar } from '../src/error-handler/binary-error.grammar.js';
import BinaryCodes from '../src/error-handler/binary-codes.js';

console.log('🧪 TEST 03: Binary Error Parser (BRUTAL EDITION)');
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

let components = null;
try {
    const code = BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001);
    
    // 💥 FIX: decomposeBinaryCode ไม่ได้ return metadata, มัน return แค่ codes
    // 💥 เราต้องเรียก findDomain, findCategory ฯลฯ เอง
    const rawComponents = parser.decomposeBinaryCode(code);
    
    components = {
        domain: parser.findDomain(rawComponents.domain),
        category: parser.findCategory(rawComponents.category),
        severity: parser.findSeverity(rawComponents.severity),
        source: parser.findSource(rawComponents.source),
        offset: rawComponents.offset
    };

    console.log('Binary Code:', code);
    console.log('Decomposed:');
    console.log('  Domain:', components.domain?.name || 'N/A');
    console.log('  Category:', components.category?.name || 'N/A');
    console.log('  Severity:', components.severity?.name || 'N/A');
    console.log('  Source:', components.source?.name || 'N/A');
    console.log('  Offset:', components.offset);
    
    const missingComponents = [];
    if (!components.domain) missingComponents.push('domain');
    if (!components.category) missingComponents.push('category');
    if (!components.severity) missingComponents.push('severity');
    if (!components.source) missingComponents.push('source');
    
    if (missingComponents.length > 0) {
        throw new Error(`Incomplete Decomposition! Missing: ${missingComponents.join(', ')}`);
    } else {
        console.log('✅ Successfully decomposed binary code');
        passed++;
    }
} catch (error) {
    console.error(`\n❌❌❌ BUG: Decomposition Crashed! ❌❌❌`);
    console.error(`   🐛 Error: ${error.message}`);
    failed++;
    bugs.push({ id: 'BUG-PARSER-001', issue: error.message });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 UPGRADED BRUTAL TEST 3.2 🔥🔥🔥
// TEST 3.2: Render Human-Readable Error (Test Catalog Lookup)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.2: Render Human-Readable Error (Testing Catalog Lookup)');
console.log('───────────────────────────────────────────────────────────────');

try {
    // 💥 TEST 3.2 เก่ามันโกง! มันเช็กแค่ 'SYSTEM'
    // 💥 เราจะเช็ก "ข้อความเฉพาะ" จาก catalog ที่ส่วน Human-Readable
    
    const code = BinaryCodes.PARSER.SYNTAX('CRITICAL', 'PARSER', 1001);
    
    // 💥 เราต้องสร้าง errorObject จำลองที่ handleError() สร้างขึ้น
    const rawComps = parser.decomposeBinaryCode(code);
    const errorObject = {
        binaryCode: code,
        timestamp: new Date().toISOString(),
        components: rawComps,
        metadata: {
            domain: parser.findDomain(rawComps.domain),
            category: parser.findCategory(rawComps.category),
            severity: parser.findSeverity(rawComps.severity),
            source: parser.findSource(rawComps.source)
        },
        context: { file: 'test.js', line: 1 }
    };

    const rendered = parser.renderHumanReadable(errorObject);
    
    // 💥 ข้อความนี้มาจาก 'binary-error-catalog.js' -> domains.PARSER.humanReadable.what
    const expectedCatalogString_Domain = "Grammar/Syntax Parser errors";
    
    // 💥 ข้อความนี้มาจาก 'binary-error-catalog.js' -> categories.SYNTAX.humanReadable.what
    const expectedCatalogString_Category = "Syntax/Grammar violations - code structure ผิดกฎ grammar";

    if (rendered.includes(expectedCatalogString_Domain) && rendered.includes(expectedCatalogString_Category)) {
        console.log('✅ Successfully rendered human-readable (Catalog OK)');
        console.log(rendered); // แสดงผลลัพธ์
        passed++;
    } else {
        console.error(`\n❌❌❌ BUG: Catalog Lookup FAILED! ❌❌❌`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(`📁 File: src/error-handler/BinaryErrorParser.js`);
        console.error(`⚙️  Method: renderHumanReadable()`);
        console.error(`🐛 Issue: ไม่พบข้อความจาก 'binary-error-catalog.js' ในผลลัพธ์`);
        console.error(`📋 Expected: ต้องมี "${expectedCatalogString_Domain}"`);
        console.error(`📋 Expected: ต้องมี "${expectedCatalogString_Category}"`);
        console.error(`❌ Actual: ไม่พบข้อความ (ดูผลลัพธ์ข้างล่าง)`);
        console.log(rendered); // แสดงผลลัพธ์ที่ล้มเหลว
        console.error(`\n🔍 Root Cause Analysis:`);
        console.error(`   ⚠️  CRITICAL BUG (ที่ผมเตือนคุณแล้ว 😜):`);
        console.error(`   - L:189: const catalogKey = \`\${domain?.name}.\${category?.name}\`;`);
        console.error(`   - โค้ดนี้สร้าง "PARSER.SYNTAX"`);
        console.error(`   - แต่ catalog.js มีโครงสร้างเป็น 'domains.PARSER' และ 'categories.SYNTAX'`);
        console.error(`   - มันไม่เคยค้นเจอเลย!`);
        console.error(`💡 Fix: แก้ L:189-192 ให้ค้นหาแยกส่วน:`);
        console.error(`   const domainCatalog = domain ? binaryErrorCatalog.domains[domain.name] : null;`);
        console.error(`   const categoryCatalog = category ? binaryErrorCatalog.categories[category.name] : null;`);
        console.error(`   if (domainCatalog && domainCatalog.humanReadable) { ... }`);
        console.error(`   if (categoryCatalog && categoryCatalog.humanReadable) { ... }`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        failed++;
        bugs.push({ id: 'BUG-PARSER-002', issue: 'Catalog lookup failed' });
    }
} catch (error) {
    console.error('❌ Rendering failed:', error.message, error.stack);
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 3.3: Handle Invalid Binary Code (สันนิษฐานว่าแก้ BUG-002 แล้ว)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.3: Handle Invalid Binary Code');
console.log('───────────────────────────────────────────────────────────────');

try {
    parser.decomposeBinaryCode('INVALID_CODE');
    console.error(`\n❌❌❌ BUG: Invalid Code NOT Rejected in Parser! ❌❌❌`);
    failed++;
    bugs.push({ id: 'BUG-PARSER-003', issue: 'Parser invalid code' });
} catch (error) {
    console.log('✅ Correctly rejected invalid binary code:', error.message);
    passed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 UPGRADED TEST 3.4 🔥🔥🔥
// TEST 3.4: Test shouldThrow Logic (อัปเดตตาม Logic ใหม่)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 3.4: Test shouldThrow Logic');
console.log('───────────────────────────────────────────────────────────────');

// 💥 อัปเดต expected logic!
// 💥 FATAL, EMERGENCY ควรสั่ง throw
// 💥 CRITICAL, ERROR, WARNING, INFO, DEBUG, TRACE ไม่ควร throw
const testSeverities = [
    { severity: 'FATAL', shouldThrow: true },
    { severity: 'EMERGENCY', shouldThrow: true },
    { severity: 'CRITICAL', shouldThrow: false }, // <--- แก้ไขตาม BUG-001
    { severity: 'ERROR', shouldThrow: false },    // <--- แก้ไข (ถ้าคุณใช้ cli.js เป็นหลัก)
    { severity: 'WARNING', shouldThrow: false },
    { severity: 'INFO', shouldThrow: false },
];

for (const test of testSeverities) {
    try {
        const code = BinaryCodes.SYSTEM.RUNTIME(test.severity, 'SYSTEM', 3001);
        const rawComps = parser.decomposeBinaryCode(code);
        const severityInfo = parser.findSeverity(rawComps.severity);
        
        if (severityInfo.shouldThrow === test.shouldThrow) {
            console.log(`✅ ${test.severity}: shouldThrow = ${test.shouldThrow}`);
            passed++;
        } else {
            console.error(`❌ ${test.severity}: expected shouldThrow = ${test.shouldThrow}, got ${severityInfo.shouldThrow}`);
            failed++;
        }
    } catch (error) {
        console.error(`❌ ${test.severity} test failed:`, error.message);
        failed++;
    }
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
}
process.exit(failed > 0 ? 1 : 0);
