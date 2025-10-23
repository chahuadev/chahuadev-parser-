// ═══════════════════════════════════════════════════════════════════════════════
// run-all-tests.js - Test Runner สำหรับทดสอบ Binary Error System
// ═══════════════════════════════════════════════════════════════════════════════

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tests = [
    'test-01-binary-codes.js',
    'test-02-binary-reporter.js',
    'test-03-binary-parser.js',
    'test-04-log-stream.js'
];

console.log('🚀 ═══════════════════════════════════════════════════════════════');
console.log('🚀 Binary Error System - Test Runner');
console.log('🚀 ═══════════════════════════════════════════════════════════════\n');

let totalPassed = 0;
let totalFailed = 0;

async function runTest(testFile) {
    return new Promise((resolve) => {
        const testPath = path.join(__dirname, testFile);
        const proc = spawn('node', [testPath], {
            stdio: 'inherit',
            shell: true
        });

        proc.on('close', (code) => {
            resolve(code);
        });
    });
}

async function runAllTests() {
    for (const test of tests) {
        console.log(`\n${'='.repeat(67)}`);
        console.log(`Running: ${test}`);
        console.log('='.repeat(67));
        
        const exitCode = await runTest(test);
        
        if (exitCode === 0) {
            console.log(`✅ ${test} PASSED`);
            totalPassed++;
        } else {
            console.log(`❌ ${test} FAILED (exit code: ${exitCode})`);
            totalFailed++;
        }
    }

    console.log('\n🚀 ═══════════════════════════════════════════════════════════════');
    console.log('🚀 Test Summary');
    console.log('🚀 ═══════════════════════════════════════════════════════════════');
    console.log(`✅ Passed: ${totalPassed}/${tests.length}`);
    console.log(`❌ Failed: ${totalFailed}/${tests.length}`);
    console.log('🚀 ═══════════════════════════════════════════════════════════════\n');

    process.exit(totalFailed > 0 ? 1 : 0);
}

runAllTests();
