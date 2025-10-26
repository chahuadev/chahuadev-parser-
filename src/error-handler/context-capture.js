// ! ═══════════════════════════════════════════════════════════════════════════════
// ! context-capture.js - Auto-capture Context from Stack Trace
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! Purpose: Automatically capture file, method, and line number from call stack
// ! Magic: Uses Error().stack to detect caller without manual input
// ! ═══════════════════════════════════════════════════════════════════════════════

/**
 * Auto-capture context from stack trace
 * Finds the first caller outside error-handler/ directory
 * 
 * @returns {object} { file, method, line, column }
 * 
 * @example
 * function myFunction() {
 *     const ctx = captureContext();
 *     // { file: 'my-file.js', method: 'myFunction', line: 42, column: 10 }
 * }
 */
export function captureContext() {
    try {
        // Create error to get stack trace
        const error = new Error();
        const stack = error.stack;
        
        if (!stack) {
            return createUnknownContext('No stack trace available');
        }
        
        const lines = stack.split('\n');
        
        // Skip first 2 lines:
        // Line 0: "Error"
        // Line 1: "at captureContext (context-capture.js:xx:xx)"
        // Line 2+: Actual callers
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip error-handler internal calls
            if (shouldSkipLine(line)) {
                continue;
            }
            
            // Parse stack trace line
            const parsed = parseStackLine(line);
            if (parsed) {
                return parsed;
            }
        }
        
        // Fallback: No valid caller found
        return createUnknownContext('No valid caller in stack trace');
        
    } catch (error) {
        // Fallback: Error during capture
        return createUnknownContext(`Capture failed: ${error.message}`);
    }
}

/**
 * Check if stack trace line should be skipped
 * Skip lines from error-handler/ directory to find real caller
 * 
 * @private
 */
function shouldSkipLine(line) {
    // Skip error-handler internal files
    if (line.includes('error-handler/')) return true;
    if (line.includes('error-handler\\')) return true;
    
    // Skip universal-reporter calls
    if (line.includes('universal-reporter')) return true;
    
    // Skip context-capture itself
    if (line.includes('context-capture')) return true;
    
    // Skip data-serializer
    if (line.includes('data-serializer')) return true;
    
    // Skip Node.js internals
    if (line.includes('node:internal')) return true;
    if (line.includes('node_modules')) return true;
    
    return false;
}

/**
 * Parse stack trace line to extract file, method, line, column
 * Handles multiple stack trace formats
 * 
 * @private
 */
function parseStackLine(line) {
    // Format 1: "at functionName (path/file.js:line:column)"
    let match = line.match(/at\s+(\w+)\s+\((.+):(\d+):(\d+)\)/);
    if (match) {
        return {
            method: match[1],
            file: extractFileName(match[2]),
            filePath: match[2],
            line: parseInt(match[3], 10),
            column: parseInt(match[4], 10)
        };
    }
    
    // Format 2: "at path/file.js:line:column" (anonymous function)
    match = line.match(/at\s+(.+):(\d+):(\d+)/);
    if (match) {
        return {
            method: 'anonymous',
            file: extractFileName(match[1]),
            filePath: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10)
        };
    }
    
    // Format 3: "at Object.<anonymous> (path/file.js:line:column)"
    match = line.match(/at\s+Object\.<anonymous>\s+\((.+):(\d+):(\d+)\)/);
    if (match) {
        return {
            method: 'module',
            file: extractFileName(match[1]),
            filePath: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10)
        };
    }
    
    return null;
}

/**
 * Extract filename from full path
 * Handles both Unix (/) and Windows (\) paths
 * 
 * @private
 */
function extractFileName(fullPath) {
    // Remove query string or hash if present
    const cleanPath = fullPath.split('?')[0].split('#')[0];
    
    // Extract basename (handle both / and \)
    const parts = cleanPath.split(/[\\/]/);
    const fileName = parts[parts.length - 1];
    
    // Remove file:// protocol if present
    return fileName.replace('file://', '');
}

/**
 * Create unknown context object (fallback)
 * 
 * @private
 */
function createUnknownContext(reason) {
    return {
        method: 'unknown',
        file: 'unknown',
        filePath: 'unknown',
        line: 0,
        column: 0,
        _captureReason: reason
    };
}

/**
 * Capture context with custom skip depth
 * Useful when calling from wrapper functions
 * 
 * @param {number} skipFrames - Number of additional frames to skip
 * @returns {object} Context object
 * 
 * @example
 * function wrapper() {
 *     // Skip wrapper frame to get real caller
 *     return captureContextWithSkip(1);
 * }
 */
export function captureContextWithSkip(skipFrames = 0) {
    try {
        const error = new Error();
        const stack = error.stack;
        
        if (!stack) {
            return createUnknownContext('No stack trace available');
        }
        
        const lines = stack.split('\n');
        const startIndex = 2 + skipFrames;
        
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            
            if (shouldSkipLine(line)) {
                continue;
            }
            
            const parsed = parseStackLine(line);
            if (parsed) {
                return parsed;
            }
        }
        
        return createUnknownContext('No valid caller in stack trace');
        
    } catch (error) {
        return createUnknownContext(`Capture failed: ${error.message}`);
    }
}

/**
 * Get full stack trace as array of context objects
 * Useful for debugging or detailed error analysis
 * 
 * @returns {array} Array of context objects
 * 
 * @example
 * const stack = captureFullStack();
 * // [
 * //   { method: 'funcA', file: 'a.js', line: 10 },
 * //   { method: 'funcB', file: 'b.js', line: 20 },
 * //   ...
 * // ]
 */
export function captureFullStack() {
    try {
        const error = new Error();
        const stack = error.stack;
        
        if (!stack) {
            return [];
        }
        
        const lines = stack.split('\n');
        const contexts = [];
        
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            
            // Don't skip any lines - capture full stack
            const parsed = parseStackLine(line);
            if (parsed) {
                contexts.push(parsed);
            }
        }
        
        return contexts;
        
    } catch (error) {
        return [];
    }
}

/**
 * Validate if captured context is valid
 * 
 * @param {object} context - Context object
 * @returns {boolean} True if valid
 */
export function isValidContext(context) {
    if (!context || typeof context !== 'object') {
        return false;
    }
    
    // Must have at least method and file
    if (!context.method || !context.file) {
        return false;
    }
    
    // Unknown context is invalid
    if (context.method === 'unknown' || context.file === 'unknown') {
        return false;
    }
    
    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export default
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    captureContext,
    captureContextWithSkip,
    captureFullStack,
    isValidContext
};
