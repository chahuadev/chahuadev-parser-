// ═══════════════════════════════════════════════════════════════════════════════
// test-04-log-stream.js - ทดสอบ Binary Log Stream
// ═══════════════════════════════════════════════════════════════════════════════
// จุดประสงค์: ทดสอบว่า binary-log-stream.js เขียน log ไปยัง file descriptors ได้ถูกต้อง
// ═══════════════════════════════════════════════════════════════════════════════

import logStream from '../src/error-handler/binary-log-stream.js';
import BinaryCodes from '../src/error-handler/binary-codes.js';
import fs from 'fs';

console.log('🧪 TEST 04: Binary Log Stream');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.1: Initialize Log Streams
// ═══════════════════════════════════════════════════════════════════════════════
console.log('TEST 4.1: Initialize Log Streams');
console.log('───────────────────────────────────────────────────────────────');

try {
    logStream.initLogStreams();
    console.log('✅ Log streams initialized');
    passed++;
} catch (error) {
    console.error('❌ Failed to initialize log streams:', error.message);
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.2: Write Log for Each Severity
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.2: Write Logs for Each Severity');
console.log('───────────────────────────────────────────────────────────────');

const severities = ['TRACE', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL', 'FATAL', 'EMERGENCY'];

for (const severity of severities) {
    try {
        const code = BinaryCodes.SYSTEM.RUNTIME(severity, 'SYSTEM', 4000 + severities.indexOf(severity));
        const message = `Test ${severity} message at ${new Date().toISOString()}`;
        
        logStream.writeLog(code, message, { test: severity });
        console.log(`✅ ${severity} log written`);
        passed++;
    } catch (error) {
        console.error(`❌ ${severity} log failed:`, error.message);
        failed++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.3: Verify Log Files Created
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.3: Verify Log Files Created');
console.log('───────────────────────────────────────────────────────────────');

const expectedLogPaths = [
    'logs/telemetry/trace.log',
    'logs/telemetry/debug.log',
    'logs/telemetry/info.log',
    'logs/errors/warning.log',
    'logs/errors/error.log',
    'logs/errors/critical.log',
    'logs/errors/fatal.log',
    'logs/errors/security.log'
];

for (const logPath of expectedLogPaths) {
    try {
        if (fs.existsSync(logPath)) {
            const stats = fs.statSync(logPath);
            console.log(`✅ ${logPath} exists (${stats.size} bytes)`);
            passed++;
        } else {
            console.error(`❌ ${logPath} not found`);
            failed++;
        }
    } catch (error) {
        console.error(`❌ Error checking ${logPath}:`, error.message);
        failed++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST 4.4: Close Log Streams
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\nTEST 4.4: Close Log Streams');
console.log('───────────────────────────────────────────────────────────────');

try {
    logStream.closeLogStreams();
    console.log('✅ Log streams closed');
    passed++;
} catch (error) {
    console.error('❌ Failed to close log streams:', error.message);
    failed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// สรุปผล
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
