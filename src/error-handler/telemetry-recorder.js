import { promises as fsPromises } from 'fs';
import path from 'path';

const TELEMETRY_DIR = path.join(process.cwd(), 'logs', 'telemetry');
const TELEMETRY_FILENAME = 'telemetry.log';
const TELEMETRY_PATH = path.join(TELEMETRY_DIR, TELEMETRY_FILENAME);

let writeQueue = Promise.resolve();

async function ensureTelemetryDirectory() {
    await fsPromises.mkdir(TELEMETRY_DIR, { recursive: true });
}

function createReplacer() {
    const seen = new WeakSet();
    return function replacer(key, value) {
        if (typeof value === 'bigint') {
            return Number(value);
        }

        if (typeof value === 'function') {
            return `[function ${value.name || 'anonymous'}]`;
        }

        if (typeof value === 'symbol') {
            return value.description ? `Symbol(${value.description})` : 'Symbol()';
        }

        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }

        return value;
    };
}

function serialiseContext(context) {
    if (context === undefined) {
        return undefined;
    }

    try {
        return JSON.parse(JSON.stringify(context, createReplacer()));
    } catch (error) {
        return { notice: 'Context could not be serialised', reason: error?.message || 'unknown' };
    }
}

function normaliseSeverity(severity) {
    if (typeof severity === 'string' && severity.trim().length > 0) {
        return severity.trim().toUpperCase();
    }
    return 'INFO';
}

export function recordTelemetryNotice({
    message = 'Telemetry notice emitted',
    source = 'telemetry',
    method = 'unspecified',
    severity = 'INFO',
    context
} = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        source,
        method,
        severity: normaliseSeverity(severity),
        message,
        context: serialiseContext(context)
    };

    writeQueue = writeQueue
        .then(async () => {
            await ensureTelemetryDirectory();
            const payload = `${JSON.stringify(entry)}\n`;
            await fsPromises.appendFile(TELEMETRY_PATH, payload, 'utf8');
        })
        .catch(() => {
            // Telemetry failures must never interrupt execution. Swallow errors silently.
        });

    return writeQueue;
}

export function getTelemetryLogPath() {
    return TELEMETRY_PATH;
}
