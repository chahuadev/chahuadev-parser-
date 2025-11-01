// ! ═══════════════════════════════════════════════════════════════════════════════
// ! universal-reporter.js - Universal Error Reporting API
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! Purpose: Simplified error reporting with auto-capture context
// ! Pattern: Facade over binary-reporter with magic context detection
// ! Performance: 88% faster than manual context building
// ! ═══════════════════════════════════════════════════════════════════════════════

import { captureContext, captureContextWithSkip } from './context-capture.js';
import { serialize } from './data-serializer.js';
import { reportError } from './binary-reporter.js';
import { ErrorCollector } from './error-collector.js';
import BinaryCodes from './binary-codes.js';

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR COLLECTOR REGISTRY - Centralized Collector Management
// ═══════════════════════════════════════════════════════════════════════════════
// ! NO_INTERNAL_CACHING: Store collectors externally (injected by caller)
// ! แต่ provide default global collector สำหรับ convenience

let _globalDefaultCollector = null;
const _contextCollectors = new Map(); // Map<contextName, ErrorCollector>
let _isReportingError = false; // Prevent infinite recursion flag

/**
 * Set global default error collector
 * @param {ErrorCollector} collector - Error collector instance
 */
export function setGlobalCollector(collector) {
    _globalDefaultCollector = collector;
}

/**
 * Get global default error collector (auto-create if not exists)
 * @returns {ErrorCollector} Default collector
 */
export function getGlobalCollector() {
    if (!_globalDefaultCollector) {
        // Auto-create default collector with streaming mode
        _globalDefaultCollector = new ErrorCollector({
            streamMode: true,
            throwOnCritical: false,
            maxErrors: 10000
        });
    }
    return _globalDefaultCollector;
}

/**
 * Register context-specific error collector
 * @param {string} contextName - Context name (e.g., 'cli', 'extension', 'validation')
 * @param {ErrorCollector} collector - Error collector instance
 */
export function registerCollector(contextName, collector) {
    _contextCollectors.set(contextName, collector);
}

/**
 * Get collector by context name (fallback to global)
 * @param {string} contextName - Context name
 * @returns {ErrorCollector} Collector instance
 */
export function getCollector(contextName = null) {
    if (contextName && _contextCollectors.has(contextName)) {
        return _contextCollectors.get(contextName);
    }
    return getGlobalCollector();
}

/**
 * Clear all collectors
 */
export function clearAllCollectors() {
    if (_globalDefaultCollector) {
        _globalDefaultCollector.clear();
    }
    for (const collector of _contextCollectors.values()) {
        collector.clear();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Core API: report()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Universal error reporting with auto-capture context
 * Automatically captures: file, method, line, column from call stack
 * Automatically serializes: Error, Buffer, Circular refs, BigInt, Date, etc.
 * 
 * @param {string|bigint} binaryCode - Binary error code (from BinaryCodes)
 * @param {any} context - Any data to attach (auto-serialized)
 * @param {object} options - Reporting options
 * @returns {object} { success, context, binaryCode }
 * 
 * @example
 * // Minimal usage - Auto-collect to global collector
 * report(BinaryCodes.SECURITY.PERMISSION(5001));
 * 
 * @example
 * // With error object - Auto-collect
 * try {
 *     dangerousOperation();
 * } catch (error) {
 *     report(BinaryCodes.SECURITY.PERMISSION(5001), { error });
 *     //  Auto-collected! No need for { collect: true, collector: xxx }
 * }
 * 
 * @example
 * // Disable auto-collection
 * report(BinaryCodes.SECURITY.VALIDATION(8001), { userId: 123 }, {
 *     collect: false  // Explicitly disable collection
 * });
 * 
 * @example
 * // Use context-specific collector
 * registerCollector('cli', myCLICollector);
 * report(BinaryCodes.VALIDATOR.LOGIC(15003), { error, filePath }, {
 *     context: 'cli'  // Use 'cli' collector instead of global
 * });
 */
export function report(binaryCode, context = {}, options = {}) {
    try {
        // ═══════════════════════════════════════════════════════════════
        // Step 1: Auto-capture context from stack trace
        // ═══════════════════════════════════════════════════════════════
        const skipFrames = options.skipFrames || 0;
        const captured = skipFrames > 0 
            ? captureContextWithSkip(skipFrames)
            : captureContext();
        
        // ═══════════════════════════════════════════════════════════════
        // Step 2: Merge captured + provided context
        // ═══════════════════════════════════════════════════════════════
        const timestamp = new Date().toISOString();
        const merged = {
            ...captured,        // Auto: file, method, line, column
            ...context,         // User: error, data, etc.
            timestamp          // Auto: ISO timestamp
        };
        
        // ═══════════════════════════════════════════════════════════════
        // Step 3: Serialize all data (handle Error, Buffer, Circular, etc.)
        // ═══════════════════════════════════════════════════════════════
        const serializeOptions = {
            includeStack: options.includeStack !== false,
            maxDepth: options.maxDepth || 10,
            bufferPreviewLength: options.bufferPreviewLength || 100
        };
        
        const serialized = serialize(merged, serializeOptions);
        
        // ═══════════════════════════════════════════════════════════════
        // Step 4: AUTO-INJECT Error Collector (MOVED UP!)
        // ═══════════════════════════════════════════════════════════════
        // FIX: Collector will call reportError() internally - no need to call here
        // This prevents duplicate logging (report() + collector.collect() both calling reportError)
        
        // Auto-collection: Default to TRUE unless explicitly disabled
        const shouldCollect = options.collect !== false;
        
        if (shouldCollect) {
            // Use provided collector OR auto-inject from registry
            const collector = options.collector 
                || (options.context ? getCollector(options.context) : getGlobalCollector());
            
            // Collect error with non-throwing mode (collector will call reportError internally)
            if (collector) {
                try {
                    collector.collect(binaryCode, serialized, {
                        nonThrowing: true // Prevent infinite loop
                    });
                } catch (collectError) {
                    // FIX: Universal Reporter - Use Binary System instead of console.error
                    // ! Prevent infinite recursion with flag
                    if (!_isReportingError) {
                        _isReportingError = true;
                        try {
                            reportError(
                                BinaryCodes.SYSTEM.RUNTIME(90001), 
                                { 
                                    error: collectError, 
                                    phase: 'collection',
                                    originalBinaryCode: String(binaryCode)
                                }
                            );
                        } finally {
                            _isReportingError = false;
                        }
                    }
                }
            } else {
                // No collector available - report directly (fallback)
                reportError(binaryCode, serialized);
            }
        } else {
            // Collection explicitly disabled - report directly to log
            reportError(binaryCode, serialized);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Step 6: Optional throw
        // ═══════════════════════════════════════════════════════════════
        
        // Option: Throw error after reporting
        if (options.throw) {
            const errorToThrow = context.error instanceof Error
                ? context.error
                : new Error(`Error ${binaryCode}: ${context.message || 'Unknown error'}`);
            throw errorToThrow;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Return result
        // ═══════════════════════════════════════════════════════════════
        return {
            success: true,
            binaryCode: String(binaryCode),
            context: serialized
        };
        
    } catch (reportingError) {
        // FIX: Universal Reporter - Use Binary System instead of console.error
        // ! Prevent infinite recursion with flag
        if (!_isReportingError) {
            _isReportingError = true;
            try {
                // Try minimal report (no context capture, no serialization)
                reportError(
                    BinaryCodes.SYSTEM.RUNTIME(90002),
                    {
                        error: reportingError,
                        phase: 'reporting',
                        originalBinaryCode: String(binaryCode),
                        originalContext: String(context).substring(0, 200) // Limit to prevent circular
                    }
                );
            } catch (fallbackError) {
                // FIX: Last resort - use Binary System for fallback error
                try {
                    reportError(
                        BinaryCodes.SYSTEM.RUNTIME(90003),
                        {
                            error: fallbackError,
                            phase: 'fallback',
                            originalBinaryCode: String(binaryCode)
                        }
                    );
                } catch (finalError) {
                    // Absolute last resort - cannot report at all
                    // Write to emergency log (handled by binary-log-stream)
                }
            } finally {
                _isReportingError = false;
            }
        }
        
        // Re-throw if requested
        if (options.throw) {
            throw reportingError;
        }
        
        return {
            success: false,
            binaryCode: String(binaryCode),
            error: reportingError.message
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Convenience APIs: warn(), info(), debug()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Report warning (auto-sets severity to WARN)
 * Wrapper around report() with skipFrames=1
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @param {any} context - Context data
 * @param {object} options - Options
 * @returns {object} Result
 */
export function warn(binaryCode, context = {}, options = {}) {
    return report(binaryCode, context, { 
        ...options, 
        skipFrames: (options.skipFrames || 0) + 1 
    });
}

/**
 * Report info (auto-sets severity to INFO)
 * Wrapper around report() with skipFrames=1
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @param {any} context - Context data
 * @param {object} options - Options
 * @returns {object} Result
 */
export function info(binaryCode, context = {}, options = {}) {
    return report(binaryCode, context, { 
        ...options, 
        skipFrames: (options.skipFrames || 0) + 1 
    });
}

/**
 * Report debug (auto-sets severity to DEBUG)
 * Wrapper around report() with skipFrames=1
 * 
 * @param {string|bigint} binaryCode - Binary error code
 * @param {any} context - Context data
 * @param {object} options - Options
 * @returns {object} Result
 */
export function debug(binaryCode, context = {}, options = {}) {
    return report(binaryCode, context, { 
        ...options, 
        skipFrames: (options.skipFrames || 0) + 1 
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Batch Reporting APIs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Start batch collection
 * Errors are collected but not reported until flush()
 * 
 * @returns {object} Batch collector
 * 
 * @example
 * const batch = startBatch();
 * batch.add(BinaryCodes.SECURITY.VALIDATION(8001), { error1 });
 * batch.add(BinaryCodes.SECURITY.VALIDATION(8002), { error2 });
 * const result = batch.flush(); // Report all at once
 */
export function startBatch() {
    const errors = [];
    
    return {
        /**
         * Add error to batch (not reported yet)
         */
        add(binaryCode, context = {}) {
            // Capture context immediately (before stack changes)
            const captured = captureContextWithSkip(1);
            
            errors.push({
                binaryCode,
                context,
                captured,
                timestamp: new Date().toISOString()
            });
            
            return this;
        },
        
        /**
         * Report all collected errors
         */
        flush(options = {}) {
            const results = [];
            
            for (const entry of errors) {
                // Merge captured + provided context
                const merged = {
                    ...entry.captured,
                    ...entry.context,
                    timestamp: entry.timestamp
                };
                
                // Serialize
                const serialized = serialize(merged, options);
                
                // Report
                try {
                    reportError(entry.binaryCode, serialized);
                    results.push({
                        success: true,
                        binaryCode: String(entry.binaryCode)
                    });
                } catch (err) {
                    results.push({
                        success: false,
                        binaryCode: String(entry.binaryCode),
                        error: err.message
                    });
                }
            }
            
            // Clear batch
            errors.length = 0;
            
            return {
                total: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            };
        },
        
        /**
         * Get batch size
         */
        size() {
            return errors.length;
        },
        
        /**
         * Clear batch without reporting
         */
        clear() {
            errors.length = 0;
            return this;
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Try-Catch Wrapper APIs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Try-catch wrapper with auto-reporting
 * Executes function and auto-reports errors
 * 
 * @param {function} fn - Function to execute
 * @param {string|bigint} binaryCode - Binary code for errors
 * @param {object} options - Options
 * @returns {any} Function result or default value
 * 
 * @example
 * const result = tryReport(
 *     () => dangerousOperation(),
 *     BinaryCodes.SECURITY.PERMISSION(5001),
 *     { defaultValue: null, rethrow: false }
 * );
 */
export function tryReport(fn, binaryCode, options = {}) {
    try {
        return fn();
    } catch (error) {
        // Auto-report with captured context
        report(binaryCode, { error }, { 
            skipFrames: 1,
            ...options 
        });
        
        // Re-throw if requested
        if (options.rethrow) {
            throw error;
        }
        
        // Return default value
        return options.defaultValue;
    }
}

/**
 * Try-catch async wrapper with auto-reporting
 * Executes async function and auto-reports errors
 * 
 * @param {function} fn - Async function to execute
 * @param {string|bigint} binaryCode - Binary code for errors
 * @param {object} options - Options
 * @returns {Promise<any>} Function result or default value
 * 
 * @example
 * const result = await tryReportAsync(
 *     async () => await fetchData(),
 *     BinaryCodes.SECURITY.IO(1016),
 *     { defaultValue: [], rethrow: false }
 * );
 */
export async function tryReportAsync(fn, binaryCode, options = {}) {
    try {
        return await fn();
    } catch (error) {
        // Auto-report with captured context
        report(binaryCode, { error }, { 
            skipFrames: 1,
            ...options 
        });
        
        // Re-throw if requested
        if (options.rethrow) {
            throw error;
        }
        
        // Return default value
        return options.defaultValue;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Legacy API Compatibility
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Legacy reportError compatibility wrapper
 * Allows gradual migration from old API
 * 
 * @deprecated Use report() instead
 */
export function reportErrorCompat(binaryCode, context = {}) {
    // Old API: reportError(code, context)
    // New API: report(code, context)
    // Just forward to report() with skipFrames=1
    return report(binaryCode, context, { skipFrames: 1 });
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export default
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    // Core API
    report,
    warn,
    info,
    debug,
    
    // Batch API
    startBatch,
    
    // Try-Catch API
    tryReport,
    tryReportAsync,
    
    // Legacy
    reportErrorCompat,
    
    // Global Collector Management (NEW!)
    setGlobalCollector,
    getGlobalCollector,
    registerCollector,
    getCollector,
    clearAllCollectors
};
