// ═══════════════════════════════════════════════════════════════════════════════
// test-04-log-stream.js - ทดสอบ Binary Log Stream (BRUTAL EDITION)
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า binary-log-stream.js เขียน "เนื้อหา" log ได้ถูกต้อง
// ═══════════════════════════════════════════════════════════════════════════════

import logStream from '../src/error-handler/binary-log-stream.js';
import { binaryErrorGrammar } from '../src/error-handler/binary-error.grammar.js';
import fs from 'fs';
import path from 'path';

console.log('🧪 TEST 04: Binary Log Stream (BRUTAL EDITION)');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;
const bugs = [];

const LOG_DIR = 'logs';

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥 SETUP: Clean Log Directory 🔥
// ═══════════════════════════════════════════════════════════════════════════════
console.log('SETUP: Cleaning log directory...');
try {
    if (fs.existsSync(LOG_DIR)) {
        // ปิด stream เก่า (ถ้ามี) ก่อนลบ
        logStream.closeAllStreams();
        fs.rmSync(LOG_DIR, { recursive: true, force: true });
        console.log('✅ Log directory cleaned');
    } else {
        console.log('ℹ️  Log directory not found, skipping clean.');
    }
} catch (e) {
    console.error('❌ FAILED TO CLEAN LOG DIRECTORY:', e.message);
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.1: Initialize Log Streams
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.1: Initialize Log Streams');
console.log('───────────────────────────────────────────────────────────────');

let initResult;
try {
    initResult = logStream.initLogStreams();
    if (!initResult.success) throw new Error(initResult.message);
    console.log(`✅ Log streams initialized (${initResult.streams} streams)`);
    passed++;
} catch (error) {
    console.error('❌ Failed to initialize log streams:', error.message);
    failed++;
    bugs.push({ id: 'LOG-001', issue: 'initLogStreams failed' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.2: Write Log for Each Severity
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.2: Write Logs for Each Severity');
console.log('───────────────────────────────────────────────────────────────');

const severities = ['TRACE', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL', 'FATAL', 'EMERGENCY'];
const testMessages = {};

for (const severity of severities) {
    try {
        // 💥 เราต้องการ severity code ไม่ใช่ binary code เต็มๆ
        const severityInfo = Object.values(binaryErrorGrammar.severities).find(s => s.label === severity);
        if (!severityInfo) throw new Error(`Severity ${severity} not in grammar`);
        
        const severityCode = severityInfo.code;
        const message = `Test message for ${severity} at ${new Date().toISOString()}`;
        testMessages[severity] = message; // เก็บข้อความไว้เช็ก
        
        logStream.writeLog(severityCode, message, { test: severity });
        console.log(`✅ ${severity} log written`);
        passed++;
    } catch (error) {
        console.error(`❌ ${severity} log failed:`, error.message);
        failed++;
        bugs.push({ id: 'LOG-002', issue: `${severity} log failed` });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 NEW BRUTAL TEST 4.3 🔥🔥🔥
// TEST 4.3: Test Fallback Logging (Invalid Severity Code)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.3: Test Fallback Logging (Invalid Severity Code)');
console.log('───────────────────────────────────────────────────────────────');

try {
    const invalidSeverityCode = 999;
    const fallbackMessage = `Test fallback message for code ${invalidSeverityCode}`;
    testMessages['FALLBACK'] = fallbackMessage; // เก็บข้อความไว้เช็ก

    logStream.writeLog(invalidSeverityCode, fallbackMessage, { test: 'fallback' });
    console.log(`✅ Fallback log written (should go to ERROR log)`);
    passed++;
} catch (error) {
    console.error(`❌ Fallback log failed:`, error.message);
    failed++;
    bugs.push({ id: 'LOG-003', issue: 'Fallback log failed' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.4: Verify Log Files Created (Quick Check)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.4: Verify Log Files Created');
console.log('───────────────────────────────────────────────────────────────');

const stats = logStream.getStreamStats();
if (Object.keys(stats).length >= severities.length) {
    console.log(`✅ ${Object.keys(stats).length} log files/streams created`);
    passed++;
} else {
    console.error(`❌ Expected ${severities.length} streams, found ${Object.keys(stats).length}`);
    failed++;
    bugs.push({ id: 'LOG-004', issue: 'Not all log files created' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔥🔥🔥 NEW BRUTAL TEST 4.5 🔥🔥🔥
// TEST 4.5: Verify Log Content
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.5: Verify Log Content');
console.log('───────────────────────────────────────────────────────────────');

// ปิด stream ก่อนเพื่อ flush ข้อมูลลง disk
logStream.closeAllStreams();

const streamStats = initResult.streamsByName; // (สมมติว่า initResult คืนค่านี้)
// 💥 ถ้า initResult ไม่ได้คืนค่า path มา เราต้องสร้าง path เองจาก grammar
// 💥 นี่คือจุดบกพร่องของ logStream.js (มันควรคืนค่า path ที่มันสร้าง)
// 💥 Hardcode path ชั่วคราวตาม Grammar (ซึ่งไม่ดี แต่จำเป็นสำหรับเทสนี้)

const pathsToVerify = {
    'TRACE': path.join(LOG_DIR, 'telemetry', `trace-${initResult.sessionTimestamp}.log`),
    'DEBUG': path.join(LOG_DIR, 'telemetry', `debug-${initResult.sessionTimestamp}.log`),
    'INFO': path.join(LOG_DIR, 'telemetry', `info-${initResult.sessionTimestamp}.log`),
    'WARNING': path.join(LOG_DIR, 'errors', `warnings-${initResult.sessionTimestamp}.log`),
    'ERROR': path.join(LOG_DIR, 'errors', `syntax-errors-${initResult.sessionTimestamp}.log`), // ชื่อจาก Grammar
    'CRITICAL': path.join(LOG_DIR, 'errors', `critical-${initResult.sessionTimestamp}.log`),
    'FATAL': path.join(LOG_DIR, 'errors', `fatal-${initResult.sessionTimestamp}.log`),
    'EMERGENCY': path.join(LOG_DIR, 'errors', `security-${initResult.sessionTimestamp}.log`),
};


for (const severity in pathsToVerify) {
    const logPath = pathsToVerify[severity];
    const message = testMessages[severity];
    
    try {
        if (!fs.existsSync(logPath)) {
             console.error(`❌ ${severity} log file not found at: ${logPath}`);
             failed++;
             bugs.push({ id: 'LOG-005', issue: `${severity} log file missing` });
             continue;
        }

        const content = fs.readFileSync(logPath, 'utf8');
        
        if (content.includes(message)) {
            console.log(`✅ ${severity} content verified in ${logPath}`);
            passed++;
        } else {
            console.error(`❌ ${severity} content NOT FOUND in ${logPath}`);
            console.error(`   Expected: ${message}`);
            failed++;
            bugs.push({ id: 'LOG-006', issue: `${severity} content missing` });
        }
        
        // ตรวจสอบพิเศษสำหรับ ERROR log
        if (severity === 'ERROR') {
            const fallbackMsg = testMessages['FALLBACK'];
            if (content.includes(fallbackMsg)) {
                console.log(`✅ Fallback content verified in ERROR log`);
                passed++;
            } else {
                console.error(`❌ Fallback content NOT FOUND in ERROR log`);
                console.error(`   Expected: ${fallbackMsg}`);
                failed++;
                bugs.push({ id: 'LOG-007', issue: 'Fallback content missing' });
            }
        }

    } catch (error) {
        console.error(`❌ Error reading ${logPath}:`, error.message);
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
