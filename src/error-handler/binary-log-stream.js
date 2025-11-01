// Binary Log Stream - Pure ES Module
// High-Performance Real-Time Log Streaming System
// Zero Console - Zero Hardcode - Pure File Descriptor Streaming
// Auto-categorization by Severity from Grammar

import fs from 'fs';
import path from 'path';
import { binaryErrorGrammar } from './binary-error.grammar.js';
import { report } from './universal-reporter.js';
import BinaryCodes from './binary-codes.js';

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STATE - File Descriptors & Stream Configuration
// ═══════════════════════════════════════════════════════════════════════════════

let _logStreams = {};
let _isInitialized = false;
let _baseLogDir = null;
let _sessionTimestamp = null;
let _severityPaths = null; // Built dynamically from Grammar
let _emergencyFd = null; // Emergency log for logger's own errors

// ═══════════════════════════════════════════════════════════════════════════════
// SEVERITY PATH BUILDER - NO_HARDCODE COMPLIANCE (100% Pure from Grammar)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build severity-to-path mapping from Grammar (Single Source of Truth)
 * Logger is now 100% "dumb" about path logic - it just reads from Grammar
 * @returns {object} Mapping of severity codes to relative paths
 */
function buildSeverityPathsFromGrammar() {
    if (!binaryErrorGrammar || !binaryErrorGrammar.severities) {
        // ZERO CONSOLE - write to emergency log instead
        writeEmergencyLog('[FATAL] binary-error.grammar.js not loaded - cannot build severity paths\n');
        return {};
    }

    const pathMap = {};
    
    // Convert Object to Array before forEach (Grammar uses Object structure)
    Object.values(binaryErrorGrammar.severities).forEach(severity => {
        const { code, logPath } = severity;
        
        if (!logPath) {
            // ZERO CONSOLE - write to emergency log
            writeEmergencyLog(`[WARNING] Severity code ${code} missing logPath property in Grammar\n`);
            return;
        }
        
        pathMap[code] = logPath;
    });
    
    return pathMap;
}

// Performance Optimization - Pre-allocate buffer
const BUFFER_SIZE = 8192;
const _writeBuffer = Buffer.allocUnsafe(BUFFER_SIZE);

// ═══════════════════════════════════════════════════════════════════════════════
// EMERGENCY LOGGING - For Logger's Own Errors (ZERO CONSOLE Compliance)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Write to emergency log when logger itself has errors
 * This replaces ALL process.stderr.write and console.* calls
 * @private
 */
function writeEmergencyLog(message) {
    try {
        if (!_emergencyFd) {
            // Initialize emergency log on first error (NO_HARDCODE: from Grammar)
            const emergencyPath = path.resolve(binaryErrorGrammar.config.emergencyLogPath);
            const emergencyDir = path.dirname(emergencyPath);
            
            if (!fs.existsSync(emergencyDir)) {
                fs.mkdirSync(emergencyDir, { recursive: true });
            }
            _emergencyFd = fs.openSync(emergencyPath, 'a');
        }
        
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}\n`;
        const buffer = Buffer.from(logLine, 'utf8');
        fs.writeSync(_emergencyFd, buffer, 0, buffer.length);
    } catch (err) {
        // FIX: Universal Reporter - Auto-collect
        const { report } = require('./universal-reporter.js');
        const BinaryCodes = require('./binary-codes.js').default;
        report(BinaryCodes.IO.WRITE_FAILED(8001));
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION - Setup All Log Streams at Once
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize all log streams - creates directories and file descriptors
 * @param {string} baseDir - Base directory for logs (default from Grammar)
 * @returns {object} Stream configuration
 */
function initLogStreams(baseDir = binaryErrorGrammar.config.baseLogDir) {
    if (_isInitialized) {
        return {
            success: true,
            message: 'Log streams already initialized',
            streams: Object.keys(_logStreams).length
        };
    }

    _baseLogDir = path.resolve(baseDir);
    _sessionTimestamp = generateTimestamp();
    
    // Build severity paths from Grammar (NO_HARDCODE)
    _severityPaths = buildSeverityPathsFromGrammar();

    try {
        // Create base directory
        if (!fs.existsSync(_baseLogDir)) {
            fs.mkdirSync(_baseLogDir, { recursive: true });
        }

        // Initialize all severity streams
        for (const [severityCode, relativePath] of Object.entries(_severityPaths)) {
            const fullPath = path.join(_baseLogDir, relativePath);
            const dirPath = path.dirname(fullPath);

            // Create subdirectory if needed
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            // ! NO_TIMESTAMP: Use fixed filename for easier error tracking
            // ! เขียนทับไฟล์เดิมทุกครั้ง (overwrite mode) แทนการ append ด้วย timestamp
            const filename = path.basename(relativePath);
            const logFilePath = path.join(dirPath, filename);

            // Open file descriptor in WRITE mode (overwrite existing file)
            const fd = fs.openSync(logFilePath, 'w');

            _logStreams[severityCode] = {
                fd: fd,
                path: logFilePath,
                relativePath: relativePath,
                severityCode: parseInt(severityCode),
                bytesWritten: 0,
                linesWritten: 0
            };

            // Write initialization marker
            const initMarker = `[INIT] Log stream initialized at ${new Date().toISOString()} | Severity: ${severityCode}\n`;
            fs.writeSync(fd, initMarker);
        }

        _isInitialized = true;

        // Register cleanup on process exit
        registerCleanupHandlers();

        return {
            success: true,
            message: 'Log streams initialized successfully',
            baseDir: _baseLogDir,
            sessionTimestamp: _sessionTimestamp,
            streams: Object.keys(_logStreams).length
        };

    } catch (error) {
        // ! CRITICAL: Cannot use report() here - circular dependency with BinaryErrorParser
        // Use writeEmergencyLog directly instead
        writeEmergencyLog(`[INIT-FAILED] Failed to initialize log streams: ${error.message}\n`);
        return {
            success: false,
            message: `Failed to initialize log streams: ${error.message}`,
            error: error
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE STREAMING - High-Performance Write Operations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Write log entry to appropriate stream based on severity code
 * @param {number} severityCode - Binary severity code (1, 2, 4, 8, 16, 32, 64, 128)
 * @param {string} message - Log message
 * @param {object} metadata - Optional metadata
 */
function writeLog(severityCode, message, metadata = null) {
    if (!_isInitialized) {
        // Auto-initialize on first write
        initLogStreams();
    }

    const stream = _logStreams[severityCode];
    if (!stream) {
        // Fallback to ERROR stream (NO_HARDCODE: lookup from Grammar)
        const fallbackSeverityLabel = binaryErrorGrammar.config.defaultFallbackSeverity;
        const fallbackSeverityCode = getSeverityCodeByLabel(fallbackSeverityLabel);
        const fallbackStream = _logStreams[fallbackSeverityCode];
        
        if (fallbackStream) {
            const fallbackMsg = `[FALLBACK] Unknown severity ${severityCode}: ${message}`;
            writeToStream(fallbackStream, fallbackMsg, metadata);
        } else {
            // Absolute fallback: write to emergency log
            writeEmergencyLog(`[CRITICAL-FALLBACK] No stream found for severity ${severityCode} or fallback ${fallbackSeverityLabel}: ${message}\n`);
        }
        return;
    }

    writeToStream(stream, message, metadata);
}

/**
 * Low-level write to file descriptor - optimized for performance
 * Uses pre-allocated buffer for maximum speed
 * @private
 */
function writeToStream(stream, message, metadata) {
    const timestamp = new Date().toISOString();
    let logLine = `[${timestamp}] ${message}`;

    // Append metadata if provided
    if (metadata && Object.keys(metadata).length > 0) {
        try {
            const metaStr = JSON.stringify(metadata);
            logLine += ` META=${metaStr}`;
        } catch (err) {
            // ! CRITICAL: Cannot use report() here - circular dependency
            writeEmergencyLog(`[JSON-SERIALIZE-ERROR] Failed to serialize metadata: ${err.message}\n`);
            logLine += ` META=<unserializable>`;
        }
    }

    logLine += '\n';

    try {
        // Convert to Buffer for performance (faster than writeSync with string)
        const logBuffer = Buffer.from(logLine, 'utf8');
        
        // Direct write using file descriptor - zero buffering
        const bytesWritten = fs.writeSync(stream.fd, logBuffer, 0, logBuffer.length);
        stream.bytesWritten += bytesWritten;
        stream.linesWritten += 1;
    } catch (error) {
        // ! CRITICAL: Cannot use report() here - circular dependency
        writeEmergencyLog(`[WRITE-STREAM-ERROR] Failed to write log: ${error.message}\n`);
        // Write to emergency log if critical
        if (stream.severityCode >= 32) {
            writeEmergencyLog(`[LOG-STREAM-ERROR] Failed to write to ${stream.path}: ${error.message}\n`);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BINARY ERROR INTEGRATION - Parse & Route Binary Error Codes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Log binary error - decompose code and route to correct stream
 * @param {string} binaryCode - 64-bit binary error code (string for BigInt precision)
 * @param {object} context - Error context
 */
function logBinaryError(binaryCode, context = {}) {
    // Extract severity from binary code (bits 32-39)
    const severityCode = extractSeverity(binaryCode);
    
    // Extract other components for metadata
    const domain = extractDomain(binaryCode);
    const category = extractCategory(binaryCode);
    const source = extractSource(binaryCode);

    const metadata = {
        binaryCode: binaryCode,
        domain: domain,
        category: category,
        severity: severityCode,
        source: source,
        ...context
    };

    const message = context.message || `Binary Error: ${binaryCode}`;
    writeLog(severityCode, message, metadata);
}

/**
 * Extract severity code from 64-bit binary error code (BigInt support)
 * Binary structure: Domain(16) | Category(16) | Severity(8) | Source(8) | Offset(16)
 */
function extractSeverity(binaryCode) {
    // Severity is bits 24-31 (8 bits)
    const bigCode = BigInt(binaryCode);
    return Number((bigCode >> 24n) & 0xFFn);
}

function extractDomain(binaryCode) {
    const bigCode = BigInt(binaryCode);
    return Number((bigCode >> 48n) & 0xFFFFn);
}

function extractCategory(binaryCode) {
    const bigCode = BigInt(binaryCode);
    return Number((bigCode >> 32n) & 0xFFFFn);
}

function extractSource(binaryCode) {
    const bigCode = BigInt(binaryCode);
    return Number((bigCode >> 16n) & 0xFFn);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEVERITY CODE LOOKUP - NO_HARDCODE COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get severity code by label from Grammar (Single Source of Truth)
 * @param {string} label - Severity label (TRACE, DEBUG, INFO, etc.) - case-insensitive
 * @returns {number} Severity code or null if not found
 */
function getSeverityCodeByLabel(label) {
    if (!binaryErrorGrammar || !binaryErrorGrammar.severities) {
        writeEmergencyLog(`[FATAL] Cannot lookup severity code for ${label} - Grammar not loaded\n`);
        return null;
    }
    
    // FIX BUG-005: Case-insensitive lookup (Grammar ใช้ "Critical" แต่ code ใช้ "CRITICAL")
    const labelLower = label.toLowerCase();
    const severity = Object.values(binaryErrorGrammar.severities).find(
        s => s.label.toLowerCase() === labelLower
    );
    return severity ? severity.code : null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECT SEVERITY LOGGING - Convenience Functions
// ═══════════════════════════════════════════════════════════════════════════════

function trace(message, metadata) {
    const code = getSeverityCodeByLabel('TRACE');
    if (code !== null) writeLog(code, `[TRACE] ${message}`, metadata);
}

function debug(message, metadata) {
    const code = getSeverityCodeByLabel('DEBUG');
    if (code !== null) writeLog(code, `[DEBUG] ${message}`, metadata);
}

function info(message, metadata) {
    const code = getSeverityCodeByLabel('INFO');
    if (code !== null) writeLog(code, `[INFO] ${message}`, metadata);
}

function warn(message, metadata) {
    const code = getSeverityCodeByLabel('WARNING');
    if (code !== null) writeLog(code, `[WARN] ${message}`, metadata);
}

function error(message, metadata) {
    const code = getSeverityCodeByLabel('ERROR');
    if (code !== null) writeLog(code, `[ERROR] ${message}`, metadata);
}

function critical(message, metadata) {
    const code = getSeverityCodeByLabel('CRITICAL');
    if (code !== null) writeLog(code, `[CRITICAL] ${message}`, metadata);
}

function fatal(message, metadata) {
    const code = getSeverityCodeByLabel('FATAL');
    if (code !== null) writeLog(code, `[FATAL] ${message}`, metadata);
}

function emergency(message, metadata) {
    const code = getSeverityCodeByLabel('EMERGENCY');
    if (code !== null) writeLog(code, `[EMERGENCY] ${message}`, metadata);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STREAM MANAGEMENT - Query, Flush, Close
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get stream statistics
 */
function getStreamStats() {
    const stats = {};
    for (const [severityCode, stream] of Object.entries(_logStreams)) {
        stats[severityCode] = {
            path: stream.path,
            relativePath: stream.relativePath,
            bytesWritten: stream.bytesWritten,
            linesWritten: stream.linesWritten,
            severityCode: stream.severityCode
        };
    }
    return stats;
}

/**
 * Flush all streams to disk
 */
function flushAll() {
    for (const stream of Object.values(_logStreams)) {
        try {
            fs.fsyncSync(stream.fd);
        } catch (error) {
            // ! CRITICAL: Cannot use report() here - circular dependency
            writeEmergencyLog(`[FLUSH-ERROR] Failed to flush stream: ${error.message}\n`);
        }
    }
}

/**
 * Close all log streams - called on process exit
 */
function closeAllStreams() {
    if (!_isInitialized) return;

    // Write termination markers
    const terminationTime = new Date().toISOString();
    for (const stream of Object.values(_logStreams)) {
        try {
            const marker = `[TERMINATE] Log stream closed at ${terminationTime} | Lines: ${stream.linesWritten} | Bytes: ${stream.bytesWritten}\n`;
            fs.writeSync(stream.fd, marker);
            fs.closeSync(stream.fd);
        } catch (error) {
            // ! CRITICAL: Cannot use report() here - circular dependency
            writeEmergencyLog(`[CLOSE-STREAM-ERROR] Failed to close stream: ${error.message}\n`);
        }
    }

    _logStreams = {};
    _isInitialized = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS LIFECYCLE - Cleanup Handlers
// ═══════════════════════════════════════════════════════════════════════════════

function registerCleanupHandlers() {
    // Normal exit
    process.on('exit', () => {
        closeAllStreams();
    });

    // SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
        closeAllStreams();
        process.exit(0);
    });

    // SIGTERM (kill)
    process.on('SIGTERM', () => {
        closeAllStreams();
        process.exit(0);
    });

    // Uncaught exception
    process.on('uncaughtException', (error) => {
        emergency(`Uncaught Exception: ${error.message}`, { stack: error.stack });
        flushAll();
        closeAllStreams();
        process.exit(1);
    });

    // Unhandled promise rejection
    process.on('unhandledRejection', (reason, promise) => {
        emergency(`Unhandled Rejection: ${reason}`, { promise: promise });
        flushAll();
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES - Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

function generateTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
}

/**
 * Check if log streams are initialized
 */
function isInitialized() {
    return _isInitialized;
}

/**
 * Get base log directory
 */
function getBaseLogDir() {
    return _baseLogDir;
}

/**
 * Get session timestamp
 */
function getSessionTimestamp() {
    return _sessionTimestamp;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS - Pure ES Module
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    // Initialization
    initLogStreams,
    isInitialized,
    getBaseLogDir,
    getSessionTimestamp,

    // Core streaming
    writeLog,
    logBinaryError,

    // Convenience functions
    trace,
    debug,
    info,
    warn,
    error,
    critical,
    fatal,
    emergency,

    // Stream management
    getStreamStats,
    flushAll,
    closeAllStreams,

    // Binary code extraction (exported for testing)
    extractSeverity,
    extractDomain,
    extractCategory,
    extractSource
};
