import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const cliPath = path.resolve(repoRoot, 'cli.js');

async function runCliScan(targetPath) {
    const child = spawn(process.execPath, [cliPath, targetPath], {
        cwd: repoRoot,
        env: {
            ...process.env,
            NODE_ENV: 'test'
        },
        stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    child.stdout.on('data', chunk => {
        stdout += chunk;
    });

    child.stderr.on('data', chunk => {
        stderr += chunk;
    });

    const [exitCode] = await once(child, 'exit');

    return {
        exitCode,
        stdout,
        stderr
    };
}

test('CLI smoke run keeps telemetry off aggressive handler', { timeout: 120000 }, async () => {
    const result = await runCliScan('src');

    assert.strictEqual(result.exitCode, 0, `Expected exit code 0 but received ${result.exitCode}. stderr: ${result.stderr}`);

    const combined = `${result.stdout}\n${result.stderr}`;
    assert.ok(!combined.includes('Unknown error code'), 'Telemetry reroute should eliminate "Unknown error code" messages');
    assert.ok(!combined.includes('skipped_shebang'), 'Shebang skip telemetry must not surface via aggressive error handler');
    assert.ok(!combined.includes('skipped_bom'), 'BOM skip telemetry must not surface via aggressive error handler');
});
