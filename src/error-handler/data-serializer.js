// ! ═══════════════════════════════════════════════════════════════════════════════
// ! data-serializer.js - Universal Data Serialization
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! Purpose: Serialize all JavaScript data types safely
// ! Handles: Error, Buffer, Circular refs, BigInt, Date, Functions, etc.
// ! ═══════════════════════════════════════════════════════════════════════════════

/**
 * Serialize any JavaScript value to JSON-safe format
 * Handles all edge cases: circular refs, special types, deep nesting
 * 
 * @param {any} data - Data to serialize
 * @param {object} options - Serialization options
 * @returns {any} Serialized data (JSON-safe)
 * 
 * @example
 * const obj = { error: new Error('test'), circular: null };
 * obj.circular = obj;
 * const result = serialize(obj);
 * // { error: { __type: 'Error', message: 'test' }, circular: '[Circular]' }
 */
export function serialize(data, options = {}) {
    const maxDepth = options.maxDepth || 10;
    const includeStack = options.includeStack !== false; // Default: true
    const bufferPreviewLength = options.bufferPreviewLength || 100;
    
    // Track circular references
    const seen = new WeakSet();
    
    function serializeValue(value, depth = 0) {
        // ═══════════════════════════════════════════════════════════════
        // Check: Max Depth
        // ═══════════════════════════════════════════════════════════════
        if (depth > maxDepth) {
            return '[Max Depth Exceeded]';
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Null & Undefined
        // ═══════════════════════════════════════════════════════════════
        if (value === null) return null;
        if (value === undefined) return undefined;
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Primitives
        // ═══════════════════════════════════════════════════════════════
        const type = typeof value;
        
        if (type === 'string') return value;
        if (type === 'number') return value;
        if (type === 'boolean') return value;
        
        // BigInt
        if (type === 'bigint') {
            return {
                __type: 'BigInt',
                value: value.toString() + 'n'
            };
        }
        
        // Function
        if (type === 'function') {
            return {
                __type: 'Function',
                name: value.name || 'anonymous'
            };
        }
        
        // Symbol
        if (type === 'symbol') {
            return {
                __type: 'Symbol',
                description: value.description
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Circular References (must check before recursion)
        // ═══════════════════════════════════════════════════════════════
        if (type === 'object') {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Error Objects
        // ═══════════════════════════════════════════════════════════════
        if (value instanceof Error) {
            return {
                __type: 'Error',
                name: value.name,
                message: value.message,
                stack: includeStack ? value.stack : undefined,
                code: value.code, // Error code (if present)
                ...serializeErrorDetails(value)
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Buffer
        // ═══════════════════════════════════════════════════════════════
        if (Buffer.isBuffer(value)) {
            return {
                __type: 'Buffer',
                length: value.length,
                preview: value.slice(0, bufferPreviewLength).toString('hex'),
                _note: value.length > bufferPreviewLength 
                    ? `Showing first ${bufferPreviewLength} bytes of ${value.length}`
                    : undefined
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Date
        // ═══════════════════════════════════════════════════════════════
        if (value instanceof Date) {
            return {
                __type: 'Date',
                iso: value.toISOString(),
                unix: value.getTime()
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: RegExp
        // ═══════════════════════════════════════════════════════════════
        if (value instanceof RegExp) {
            return {
                __type: 'RegExp',
                source: value.source,
                flags: value.flags
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Set
        // ═══════════════════════════════════════════════════════════════
        if (value instanceof Set) {
            return {
                __type: 'Set',
                size: value.size,
                values: Array.from(value).map(v => serializeValue(v, depth + 1))
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Map
        // ═══════════════════════════════════════════════════════════════
        if (value instanceof Map) {
            return {
                __type: 'Map',
                size: value.size,
                entries: Array.from(value.entries()).map(([k, v]) => [
                    serializeValue(k, depth + 1),
                    serializeValue(v, depth + 1)
                ])
            };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Array
        // ═══════════════════════════════════════════════════════════════
        if (Array.isArray(value)) {
            return value.map(item => serializeValue(item, depth + 1));
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Handle: Plain Objects
        // ═══════════════════════════════════════════════════════════════
        if (type === 'object') {
            const result = {};
            
            // Get own properties (not inherited)
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    try {
                        result[key] = serializeValue(value[key], depth + 1);
                    } catch (err) {
                        // If property accessor throws, mark as error
                        result[key] = `[Error accessing property: ${err.message}]`;
                    }
                }
            }
            
            return result;
        }
        
        // ═══════════════════════════════════════════════════════════════
        // Fallback: Convert to string
        // ═══════════════════════════════════════════════════════════════
        try {
            return String(value);
        } catch (err) {
            return '[Unserializable]';
        }
    }
    
    return serializeValue(data);
}

/**
 * Serialize Error object with all custom properties
 * Extracts common error properties and custom fields
 * 
 * @private
 */
function serializeErrorDetails(error) {
    const details = {};
    
    // Common error properties
    const commonProps = ['fileName', 'lineNumber', 'columnNumber', 'cause'];
    
    for (const prop of commonProps) {
        if (error[prop] !== undefined) {
            details[prop] = error[prop];
        }
    }
    
    // Custom properties (not in Error.prototype)
    for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
            // Skip standard properties
            if (['name', 'message', 'stack', 'code'].includes(key)) {
                continue;
            }
            details[key] = error[key];
        }
    }
    
    return details;
}

/**
 * Serialize with custom replacer function
 * Allows custom handling of specific types
 * 
 * @param {any} data - Data to serialize
 * @param {function} replacer - Custom replacer function (key, value) => newValue
 * @param {object} options - Serialization options
 * @returns {any} Serialized data
 * 
 * @example
 * const data = { user: userObject };
 * const result = serializeWithReplacer(data, (key, value) => {
 *     if (key === 'password') return '[REDACTED]';
 *     return value;
 * });
 */
export function serializeWithReplacer(data, replacer, options = {}) {
    const serialized = serialize(data, options);
    
    function applyReplacer(obj, path = []) {
        if (Array.isArray(obj)) {
            return obj.map((item, i) => applyReplacer(item, [...path, i]));
        }
        
        if (obj && typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                const newValue = replacer(key, value, path);
                result[key] = newValue === value 
                    ? applyReplacer(value, [...path, key])
                    : newValue;
            }
            return result;
        }
        
        return obj;
    }
    
    return applyReplacer(serialized);
}

/**
 * Serialize to JSON string with formatting
 * Safe wrapper around JSON.stringify
 * 
 * @param {any} data - Data to serialize
 * @param {object} options - Serialization options
 * @returns {string} JSON string
 * 
 * @example
 * const json = serializeToJSON({ error: new Error('test') }, { pretty: true });
 * console.log(json);
 */
export function serializeToJSON(data, options = {}) {
    const pretty = options.pretty || false;
    const space = pretty ? 2 : undefined;
    
    try {
        const serialized = serialize(data, options);
        return JSON.stringify(serialized, null, space);
    } catch (err) {
        // Fallback: Return error info
        return JSON.stringify({
            __serializationError: true,
            message: err.message,
            data: String(data)
        }, null, space);
    }
}

/**
 * Check if value is serializable
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if serializable
 */
export function isSerializable(value) {
    try {
        serialize(value);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Get serialization info (size, depth, circular refs)
 * Useful for debugging or validation
 * 
 * @param {any} data - Data to analyze
 * @returns {object} { size, depth, hasCircular, types }
 */
export function getSerializationInfo(data) {
    const info = {
        size: 0,
        maxDepth: 0,
        hasCircular: false,
        types: new Set()
    };
    
    const seen = new WeakSet();
    
    function analyze(value, depth = 0) {
        info.size++;
        info.maxDepth = Math.max(info.maxDepth, depth);
        
        if (value === null) {
            info.types.add('null');
            return;
        }
        
        const type = typeof value;
        info.types.add(type);
        
        if (type === 'object') {
            // Check circular
            if (seen.has(value)) {
                info.hasCircular = true;
                return;
            }
            seen.add(value);
            
            // Analyze nested
            if (Array.isArray(value)) {
                info.types.add('Array');
                value.forEach(item => analyze(item, depth + 1));
            } else if (value instanceof Error) {
                info.types.add('Error');
            } else if (Buffer.isBuffer(value)) {
                info.types.add('Buffer');
            } else if (value instanceof Date) {
                info.types.add('Date');
            } else {
                for (const key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        analyze(value[key], depth + 1);
                    }
                }
            }
        }
    }
    
    analyze(data);
    
    return {
        ...info,
        types: Array.from(info.types)
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export default
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    serialize,
    serializeWithReplacer,
    serializeToJSON,
    isSerializable,
    getSerializationInfo
};
