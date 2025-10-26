// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
/**
 * Rate Limit Store Factory
 * 
 * ! NO_INTERNAL_CACHING Compliance
 * Factory สำหรับสร้าง Rate Limit Store ที่ถูกต้องตามกฎ
 * 
 * USAGE:
 * 
 * // Development/Testing:
 * const store = createRateLimitStore('memory');
 * const securityManager = new SecurityManager({ rateLimitStore: store });
 * 
 * // Production (Single Instance):
 * const store = createRateLimitStore('memory');  // OK for single server
 * 
 * // Production (Multi-Instance):
 * const store = createRateLimitStore('redis', { url: 'redis://localhost:6379' });
 * const securityManager = new SecurityManager({ rateLimitStore: store });
 */

import { reportError } from '../error-handler/binary-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';
import { OFFSETS } from '../error-handler/offset-registry.js';

function emitRateLimitNotice(message, method, severity, context) {
    // FIX: Binary Error Pattern - Use reportError instead of Error + errorHandler
    reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.MEMORY_STORE_NOTICE), {
        method: `RateLimitStoreFactory.${method}`,
        message: message,
        severity: severity,
        context: context
    });
}

/**
 * Create rate limit store based on type
 * 
 * @param {string} type - 'memory', 'redis', or 'memcached'
 * @param {object} config - Configuration for the store
 * @returns {object} Store instance with get/set/has/delete methods
 */


function createRateLimitStore(type = 'memory', config = {}) {
    switch (type) {
        case 'memory':
            return createMemoryStore();
        
        case 'redis':
            return createRedisStore(config);
        
        case 'memcached':
            return createMemcachedStore(config);
        
        default:
            // FIX: Binary Error Pattern - Replace throw with reportError
            reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.UNKNOWN_STORE_TYPE), {
                method: 'createRateLimitStore',
                message: `Unknown rate limit store type`,
                requestedType: type,
                supportedTypes: 'memory, redis, memcached'
            });
            // Return memory store as fallback
            return createMemoryStore();
    }
}

/**
 * Create in-memory Map store
 *   WARNING: Only for development or single-instance deployments
 */
function createMemoryStore() {
    emitRateLimitNotice(
        'Creating in-memory rate limit store (development-only fallback)',
        'createMemoryStore',
        'WARNING',
        'Use Redis or Memcached for production rate limiting across instances'
    );
    
    return new Map();
}

/**
 * Create Redis store adapter
 *  RECOMMENDED for production multi-instance deployments
 */
function createRedisStore(config) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const redis = require('redis');
        
        const client = redis.createClient({
            url: config.url || 'redis://localhost:6379',
            socket: {
                connectTimeout: config.connectTimeout || 5000
            },
            ...config
        });
        
           // FIX: Binary Error Pattern - Replace throw with reportError
           client.connect().catch(err => {
           reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.REDIS_CONNECTION_FAILED), { // <--- ใช้ Offset ใหม่
                 method: 'createRedisStore.connect',
                 message: `Failed to connect to Redis server: ${err.message}`,
                 errorType: err.constructor?.name,
                 errorCode: err.code
        });
                // ไม่ต้อง throw err; ปล่อยให้มันทำงานต่อ (เดี๋ยวจะ fallback ไป memory store เอง)
           });
        // Adapter to match Map interface
        return {
            async get(key) {
                const value = await client.get(key);
                if (value === null) {
                    return undefined;
                }
                return parseInt(value, 10);
            },
            
            async set(key, value) {
                // Set with TTL of 5 minutes (rate limit window)
                await client.setEx(key, 300, value.toString());
                return this;
            },
            
            async has(key) {
                const exists = await client.exists(key);
                return exists === 1;
            },
            
            async delete(key) {
                await client.del(key);
                return true;
            },
            
            // Optional: Get size (Redis doesn't have direct equivalent)
            size: undefined,
            
            // Cleanup method
            async disconnect() {
                await client.quit();
            }
        };
        
    } catch (error) {
        // FIX: Binary Error Pattern - Replace errorHandler with reportError
        const errorType = error?.constructor?.name || 'Error';
        const stackPreview = error?.stack ? error.stack.split('\n').slice(0, 3).join('\n') : 'No stack';
        
        reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.REDIS_CREATION_FAILED), {
            method: 'createRedisStore',
            message: 'Redis store creation failed',
            errorCode: error.code || 'UNKNOWN',
            errorType: errorType,
            errorMessage: error.message,
            stackPreview: stackPreview
        });
        
        if (error.code === 'MODULE_NOT_FOUND') {
            reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.REDIS_MODULE_NOT_FOUND), {
                method: 'createRedisStore',
                message: 'Redis module not found',
                suggestion: 'Install: npm install redis OR use memory store for development'
            });
            // Return memory store as fallback
            return createMemoryStore();
        }
        // Return memory store as fallback for any error
        return createMemoryStore();
    }
}

/**
 * Create Memcached store adapter
 *  Alternative to Redis for production
 */
function createMemcachedStore(config) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Memcached = require('memcached');
        
        const client = new Memcached(config.servers || 'localhost:11211', {
            timeout: config.timeout || 5000,
            retries: config.retries || 3,
            ...config
        });
        
        // Adapter to match Map interface
        return {
            async get(key) {
                return new Promise((resolve, reject) => {
                    client.get(key, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            },
            
            async set(key, value) {
                return new Promise((resolve, reject) => {
                    // TTL of 300 seconds (5 minutes)
                    client.set(key, value, 300, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(this);
                    });
                });
            },
            
            async has(key) {
                const value = await this.get(key);
                return value !== undefined;
            },
            
            async delete(key) {
                return new Promise((resolve, reject) => {
                    client.del(key, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                });
            },
            
            // Optional: Cleanup
            async disconnect() {
                client.end();
            }
        };
        
    } catch (error) {
        // FIX: Binary Error Pattern - Replace errorHandler with reportError
        const errorType = error?.constructor?.name || 'Error';
        const stackPreview = error?.stack ? error.stack.split('\n').slice(0, 3).join('\n') : 'No stack';
        
        reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.MEMCACHED_CREATION_FAILED), {
            method: 'createMemcachedStore',
            message: 'Memcached store creation failed',
            errorCode: error.code || 'UNKNOWN',
            errorType: errorType,
            errorMessage: error.message,
            stackPreview: stackPreview
        });
        
        if (error.code === 'MODULE_NOT_FOUND') {
            reportError(BinaryCodes.SECURITY.RATELIMIT(OFFSETS.SECURITY.RATELIMIT.MEMCACHED_MODULE_NOT_FOUND), {
                method: 'createMemcachedStore',
                message: 'Memcached module not found',
                suggestion: 'Install: npm install memcached OR use memory store for development'
            });
            // Return memory store as fallback
            return createMemoryStore();
        }
        // Return memory store as fallback for any error
        return createMemoryStore();
    }
}

/**
 * Detect best store based on environment
 */
function createAutoStore() {
    // Check environment variables
    const redisUrl = process.env.REDIS_URL;
    const memcachedServers = process.env.MEMCACHED_SERVERS;
    
    if (redisUrl) {
        emitRateLimitNotice(
            'Auto-detected Redis configuration from REDIS_URL',
            'createAutoStore',
            'INFO',
            { redisUrl: redisUrl ? 'provided' : 'missing' }
        );
        return createRateLimitStore('redis', { url: redisUrl });
    }
    
    if (memcachedServers) {
        emitRateLimitNotice(
            'Auto-detected Memcached configuration from MEMCACHED_SERVERS',
            'createAutoStore',
            'INFO',
            { memcachedServers: memcachedServers ? 'provided' : 'missing' }
        );
        return createRateLimitStore('memcached', { servers: memcachedServers });
    }
    
    // Default to memory (with warning)
    emitRateLimitNotice(
        'No external cache configured. Using in-memory rate limit store',
        'createAutoStore',
        'WARNING',
        'Set REDIS_URL or MEMCACHED_SERVERS for production deployments'
    );
    return createMemoryStore();
}

module.exports = {
    createRateLimitStore,
    createMemoryStore,
    createRedisStore,
    createMemcachedStore,
    createAutoStore
};
