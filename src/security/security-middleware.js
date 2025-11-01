// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-parser-.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// @description Security middleware for VS Code extension operations
// ! ======================================================================

// Note: vscode module handling for both extension and test environments
// FIX: Updated imports - use correct error-handler files
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';
let vscode;

// Initialize vscode module
async function initializeVSCode() {
    if (vscode) return vscode;
    
    try {
        // Try to import vscode module (only available in VS Code extension context)
        const vscodeModule = await import('vscode');
        // ! NO_SILENT_FALLBACKS: Explicit check for module structure
        if (vscodeModule.default) {
            vscode = vscodeModule.default;
        } else if (vscodeModule) {
            vscode = vscodeModule;
        } else {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.CONFIGURATION(1052));
            // ไม่ throw - ใช้ mock vscode object แทน
            vscode = null;
        }
    } catch (e) {
        // FIX: Universal Reporter - Auto-collect
        report(BinaryCodes.SECURITY.RUNTIME(3014));
        // Running outside VS Code environment (e.g., during testing)
        vscode = {
            // Mock vscode objects for testing
            DiagnosticSeverity: {
                Error: 0,
                Warning: 1,
                Information: 2,
                Hint: 3
            },
            Diagnostic: class {
                constructor(range, message, severity) {
                    this.range = range;
                    this.message = message;
                    this.severity = severity;
                }
            },
            Range: class {
                constructor(startLine, startChar, endLine, endChar) {
                    this.start = { line: startLine, character: startChar };
                    this.end = { line: endLine, character: endChar };
                }
            },
            window: {
                showInformationMessage: (msg) => Promise.resolve(),
                showWarningMessage: (msg) => Promise.resolve(),
                showErrorMessage: (msg) => Promise.resolve()
            },
            workspace: {
                openTextDocument: (options) => Promise.resolve({ uri: { fsPath: 'test' } }),
                showTextDocument: (doc) => Promise.resolve()
            }
        };
    }
    
    return vscode;
}

import { 
    SecurityManager, 
    SecurityError, 
    PathTraversalError, 
    AccessDeniedError, 
    FileValidationError 
} from './security-manager.js';

/**
 * Security Middleware Class
 * Provides security wrappers for VS Code extension operations
 */
function emitSecurityNotice(messageOrError, method, severity, context, errorCode = SECURITY_ERROR_CODES.SECURITY_NOTICE) {
    const baselineSeverity = severity || 'HIGH';
    const originalError = messageOrError instanceof Error
        ? messageOrError
        : new Error(String(messageOrError));

    if (!(messageOrError instanceof Error)) {
        originalError.name = 'SecurityMiddlewareNotice';
        originalError.isOperational = true;
    }

    const normalizedContext = (context && typeof context === 'object' && !Array.isArray(context))
        ? { ...context }
        : { detail: context };

    emitSecurityPayload(
        errorCode,
        originalError,
        {
            source: 'SecurityMiddleware',
            method,
            severity: baselineSeverity,
            ...normalizedContext
        },
        {
            severityCode: baselineSeverity
        }
    );
}

class SecurityMiddleware {
    constructor(options = {}) {
        // ! NO_INTERNAL_CACHING: Inject rate limit store
        // ! For production: Pass Redis client
        // ! For testing/development: Pass Map instance
        if (!options.rateLimitStore) {
            // Default to in-memory Map for development
            // Production should override this with Redis
            options.rateLimitStore = new Map();
            emitSecurityNotice(
                'Using in-memory rate limiting store (development fallback)',
                'constructor',
                'WARNING',
                'Provide a distributed rateLimitStore (Redis/Memcached) for production deployments'
            );
        }
        
        this.securityManager = new SecurityManager(options);
        this.isEnabled = true;
        this.vscode = null;
        this.initializeVSCode();
    }
    
    async initializeVSCode() {
        this.vscode = await initializeVSCode();
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Document Security Operations
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure document reading with validation
     */
    async secureReadDocument(document) {
        try {
            if (!document || !document.uri) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SYSTEM.RUNTIME(1045));
                // ไม่ throw - return error result แทน
                return { success: false, error: 'Invalid document object' };
            }
            
            // Validate document path
            const filePath = document.uri.fsPath;
            await this.securityManager.validateFile(filePath, 'READ');
            
            // Rate limiting check
            await this.securityManager.checkRateLimit(`read_${filePath}`);
            
            // Get document content safely
            const content = document.getText();
            
            // ตรวจสอบ content size
            if (content && content.length > MAX_DOCUMENT_SIZE) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SECURITY.VALIDATION(2006));
            }
            
            return {
                success: true,
                content,
                filePath,
                size: content.length
            };
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.RUNTIME(3015));
        }
    }
    
    /**
     * Secure workspace file operations
     */
    async secureWorkspaceOperation(operation, targetPath, content = null) {
        try {
            // Validate the operation
            const validOperations = ['READ', 'WRITE', 'DELETE', 'SCAN'];
            if (!validOperations.includes(operation)) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SECURITY.VALIDATION(2007));
                // ไม่ throw - return error result แทน
                return { success: false, error: `Invalid operation: ${operation}` };
            }
            
            // Validate target path
            const validatedPath = await this.securityManager.validateFile(targetPath, operation);
            
            // Rate limiting
            await this.securityManager.checkRateLimit(`workspace_${operation}`);
            
            switch (operation) {
                case 'READ':
                    return await this.secureFileRead(validatedPath);
                case 'WRITE':
                    return await this.secureFileWrite(validatedPath, content);
                case 'SCAN':
                    return await this.secureFileScan(validatedPath);
                default:
                    // FIX: Universal Reporter - Auto-collect
                    report(BinaryCodes.SECURITY.VALIDATION(2008));
                    // ไม่ throw - return error result แทน
                    return { success: false, error: `Operation ${operation} not implemented` };
            }
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.RUNTIME(3016));
        }
    }

    /**
     * Secure regex pattern execution
     */
    async securePatternMatch(pattern, text, context = null) {
        try {
            // Validate inputs
            if (!pattern || !text) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SECURITY.VALIDATION(2009));
                // ไม่ throw - return null แทน
                return null;
            }
            
            // Rate limiting for regex operations
            await this.securityManager.checkRateLimit('regex_execution');
            
            // Safe regex execution with ReDoS protection
            const result = await this.securityManager.safeRegexExecution(pattern, text, context);
            
            // ! NO_SILENT_FALLBACKS: Explicit pattern source extraction
            let patternString;
            if (pattern.source) {
                patternString = pattern.source;
            } else if (typeof pattern === 'string') {
                patternString = pattern;
            } else {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SECURITY.VALIDATION(2010));
                // ไม่ throw - return null แทน
                return null;
            }
            
            return {
                success: true,
                matches: result,
                pattern: patternString,
                contextInfo: context
            };
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.RUNTIME(3017));
        }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // VS Code Integration Security
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure diagnostic creation with validation
     */
    async createSecureDiagnostic(range, message, severity = null) {
        try {
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            // ! NO_SILENT_FALLBACKS: Explicit severity determination
            let defaultSeverity;
            if (severity !== null && severity !== undefined) {
                defaultSeverity = severity;
            } else {
                defaultSeverity = this.vscode.DiagnosticSeverity.Information;
            }
            
            // Validate inputs
            if (!range || !message) {
                throw new SecurityError('Invalid range or message for diagnostic');
            }
            
            // Sanitize message to prevent XSS-like issues
            const sanitizedMessage = this.sanitizeMessage(message);
            
            // Rate limiting for diagnostic creation
            await this.securityManager.checkRateLimit('diagnostic_creation');
            
            return new this.vscode.Diagnostic(range, sanitizedMessage, defaultSeverity);
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.RUNTIME(3018));
        }
    }

    /**
     * Secure notification display
     */
    async showSecureNotification(message, type = 'info', actions = []) {
        try {
            // Sanitize message
            const sanitizedMessage = this.sanitizeMessage(message);
            
            // Rate limiting for notifications
            await this.securityManager.checkRateLimit('notifications');
            
            // Validate actions
            const validActions = actions.filter(action => 
                action && typeof action === 'string' && action.length < 100
            );
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            switch (type) {
                case 'info':
                    return await this.vscode.window.showInformationMessage(sanitizedMessage, ...validActions);
                case 'warning':
                    return await this.vscode.window.showWarningMessage(sanitizedMessage, ...validActions);
                case 'error':
                    return await this.vscode.window.showErrorMessage(sanitizedMessage, ...validActions);
                default:
                    return await this.vscode.window.showInformationMessage(sanitizedMessage, ...validActions);
            }
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.RUNTIME(3019));
        }
    }

    // ══════════════════════════════════════════════════════════════════
    // File System Security Operations
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Secure file reading
     */
    async secureFileRead(filePath) {
        const fs = require('fs').promises;
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            
            return {
                success: true,
                content,
                filePath,
                size: content.length,
                encoding: 'utf8'
            };
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.FILE_SYSTEM(2013));
        }
    }
    
    /**
     * Secure file writing with backup
     */
    async secureFileWrite(filePath, content) {
        const fs = require('fs').promises;
        const path = require('path');
        
        try {
            // Create backup if file exists
            let backupPath = null;
            try {
                await fs.access(filePath);
                backupPath = filePath + '.security-backup.' + Date.now();
                await fs.copyFile(filePath, backupPath);
            } catch (error) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.IO.RESOURCE_NOT_FOUND(11001));
                // File doesn't exist, no backup needed
            }
            
            // Write content securely
            await fs.writeFile(filePath, content, 'utf8');
            
            return {
                success: true,
                filePath,
                backupPath,
                size: content.length
            };
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.FILE_SYSTEM(2014));
        }
    }
    
    /**
     * Secure file scanning for validation (Enhanced with configurable patterns)
     */
    async secureFileScan(filePath) {
        try {
            const readResult = await this.secureFileRead(filePath);
            const content = readResult.content;
            
            // Basic security scan of file content
            const securityIssues = [];
            
            // ! NO_SILENT_FALLBACKS: Explicit pattern extraction with validation
            let suspiciousPatterns;
            if (this.securityManager.config.content && this.securityManager.config.content.suspiciousPatterns) {
                suspiciousPatterns = this.securityManager.config.content.suspiciousPatterns;
            } else {
                // ! FAIL LOUD: Log warning when patterns are missing
                emitSecurityNotice(
                    'No suspicious patterns configured - file scanning will be limited',
                    'secureFileScan',
                    'WARNING',
                    'Add entries under security-config.content.suspiciousPatterns to enable scanning'
                );
                suspiciousPatterns = [];
            }
            
            // Scan content against each configured pattern
            for (const patternConfig of suspiciousPatterns) {
                try {
                    const matches = await this.securityManager.safeRegexExecution(
                        patternConfig.pattern, 
                        content, 
                        filePath
                    );
                    
                    if (matches && matches.length > 0) {
                        securityIssues.push({
                            issue: patternConfig.description,
                            name: patternConfig.name,
                            severity: patternConfig.severity,
                            category: patternConfig.category,
                            matches: matches.length,
                            positions: matches.map(match => ({
                                index: match.index,
                                length: match[0] ? match[0].length : 0
                            })).slice(0, 10) // Limit to first 10 matches for performance
                        });
                    }
                } catch (regexError) {
                    // FIX: Universal Reporter - Auto-collect
                    report(BinaryCodes.SECURITY.VALIDATION(2015));
                    // Log regex execution error but continue scanning
                    this.securityManager.logSecurityEvent(
                        'SCAN_PATTERN_ERROR', 
                        `Pattern scan failed: ${patternConfig.name}`,
                        { 
                            patternName: patternConfig.name,
                            error: regexError.message,
                            filePath 
                        }
                    );
                }
            }
            
            // Additional file-specific validations
            const fileExtension = require('path').extname(filePath).toLowerCase();
            const fileTypeRules = this.securityManager.config.content?.fileTypeRules?.[fileExtension];
            
            if (fileTypeRules) {
                // Check file size against extension-specific limits
                if (fileTypeRules.maxSize && content.length > fileTypeRules.maxSize) {
                    securityIssues.push({
                        issue: `File exceeds size limit for ${fileExtension} files`,
                        name: 'File Size Violation',
                        severity: 'MEDIUM',
                        category: 'PERFORMANCE_RISK',
                        actualSize: content.length,
                        maxSize: fileTypeRules.maxSize
                    });
                }
                
                // JSON validation for .json files
                if (fileExtension === '.json' && fileTypeRules.validateJSON) {
                try {
                    JSON.parse(content);
                } catch (jsonError) {
                    // FIX: Universal Reporter - Auto-collect
                    report(BinaryCodes.SECURITY.VALIDATION(2016));
                }
            }
        }            return {
                success: true,
                filePath,
                contentSize: content.length,
                fileExtension,
                securityIssues,
                scanTimestamp: new Date().toISOString(),
                patternsScanned: suspiciousPatterns.length
            };
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SECURITY.VALIDATION(3012));
         }
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Utility and Helper Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Sanitize message content
     */
    sanitizeMessage(message) {
        if (typeof message !== 'string') {
            return 'Invalid message type';
        }
        
        // Remove potentially dangerous characters and limit length
        return message
            .replace(/[<>\"'&]/g, '') // Remove HTML/script characters
            .replace(/\x00/g, '') // Remove null bytes
            .substring(0, 500); // Limit length
    }
    
    /**
     * Handle security errors with appropriate logging and actions (Enhanced)
     * ! NO_SILENT_FALLBACKS: Explicit checks for error properties
     */
    handleSecurityError(error, operation) {
        // ! NO_SILENT_FALLBACKS: Explicit errorCode check
        let errorCode = 'UNKNOWN';
        if (error.errorCode) {
            if (typeof error.errorCode !== 'string') {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.VALIDATOR.VALIDATION(7004));
            }
        }
        
        // ! NO_SILENT_FALLBACKS: Explicit severity check
        let severity = 'HIGH';
        if (error.severity) {
            if (typeof error.severity !== 'string') {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.VALIDATOR.VALIDATION(7005));
            }
        }
        
        // FIX: Universal Reporter - Auto-collect (central error reporting)
        report(BinaryCodes.SECURITY.RUNTIME(3013));
        
        // Log security event with sanitized message (message will be sanitized in logSecurityEvent)
        this.securityManager.logSecurityEvent('SECURITY_ERROR', error.message, {
            operation,
            errorType: error.constructor.name,
            errorCode: errorCode,
            severity: severity,
            // Sanitize stack trace to prevent log injection
            stack: error.stack ? error.stack.replace(/\r?\n/g, ' | ').substring(0, 500) : 'No stack trace'
        });
        
        // Show appropriate user notification based on error type
        if (error instanceof SecurityError) {
            this.showSecurityAlert(error, operation);
        }
    }
    
    /**
     * Show security alert to user
     */
    async showSecurityAlert(error, operation) {
        try {
            const message = `Security Alert: ${error.message}`;
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            if (this.vscode && this.vscode.window) {
                // Don't use our secure notification to avoid recursion
                await this.vscode.window.showWarningMessage(
                    message,
                    'View Security Report',
                    'Dismiss'
                ).then(selection => {
                    if (selection === 'View Security Report') {
                        this.showSecurityReport();
                    }
                });
            } else {
                // Fallback to console logging if VS Code not available
                emitSecurityNotice(
                    `Security alert fallback: ${error.message}`,
                    'showSecurityAlert',
                    'ERROR',
                    {
                        operation,
                        notification: 'VSCode API unavailable'
                    }
                );
            }
            
        } catch (notificationError) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.RUNTIME(5002));
        }
    }
    
    /**
     * Show security report to user
     */
    async showSecurityReport() {
        try {
            const report = this.securityManager.generateSecurityReport();
            
            // Create formatted report content
            const reportContent = this.formatSecurityReport(report);
            
            // Initialize vscode if not available
            if (!this.vscode) {
                this.vscode = vscode;
            }
            
            if (this.vscode && this.vscode.workspace) {
                // Show in a new untitled document
                const doc = await this.vscode.workspace.openTextDocument({
                    content: reportContent,
                    language: 'json'
                });
                
                await this.vscode.window.showTextDocument(doc);
            } else {
                // Fallback for non-vscode environment
                emitSecurityNotice(
                    'Security report generated outside VS Code environment',
                    'showSecurityReport',
                    'INFO',
                    {
                        summary: report.status,
                        violations: report.statistics?.violations ?? 0
                    }
                );
            }
            
        } catch (error) {
            // FIX: Universal Reporter - Auto-collect
            report(BinaryCodes.SYSTEM.RUNTIME(5003));
        }
    }
    
    /**
     * Format security report for display
     */
    formatSecurityReport(report) {
        return JSON.stringify(report, null, 2);
    }
    
    // ══════════════════════════════════════════════════════════════════
    // Security Control Methods
    // ══════════════════════════════════════════════════════════════════
    
    /**
     * Enable security middleware
     */
    enable() {
        this.isEnabled = true;
        this.securityManager.logSecurityEvent('MIDDLEWARE_ENABLED', 'Security middleware enabled');
    }
    
    /**
     * Disable security middleware (for debugging only)
     */
    disable() {
        this.isEnabled = false;
        this.securityManager.logSecurityEvent('MIDDLEWARE_DISABLED', 'Security middleware disabled');
    }
    
    /**
     * Get security statistics
     */
    getStats() {
        return this.securityManager.getSecurityStats();
    }
    
    /**
     * Check if security is enabled
     */
    isSecurityEnabled() {
        return this.isEnabled;
    }
}

// ======================================================================
// Security Decorator Functions
// ======================================================================

/**
 * Decorator function to add security to any async function
 */
function withSecurity(securityMiddleware, operation) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            try {
                // Security pre-check
                if (!securityMiddleware.isSecurityEnabled()) {
                    return await originalMethod.apply(this, args);
                }
                
                // Rate limiting
                await securityMiddleware.securityManager.checkRateLimit(`method_${propertyKey}`);
                
                // Execute original method
                const result = await originalMethod.apply(this, args);
                
                // Log successful operation
                securityMiddleware.securityManager.logSecurityEvent(
                    'SECURE_OPERATION',
                    `Method ${propertyKey} executed securely`,
                    { operation, args: args.length }
                );
                
                return result;
                
            } catch (error) {
                // FIX: Universal Reporter - Auto-collect
                report(BinaryCodes.SECURITY.RUNTIME(3020));
            }
        };

        return descriptor;
    };
}

// ======================================================================
// Export Security Middleware
// ======================================================================

export {
    SecurityMiddleware,
    withSecurity
};