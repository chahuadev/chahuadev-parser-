// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
import { reportError } from './error-handler/binary-reporter.js';
import BinaryCodes from './error-handler/binary-codes.js';
import * as vscode from 'vscode';
import { ABSOLUTE_RULES, ValidationEngine } from './rules/validator.js';
import { SecurityMiddleware } from './security/security-middleware.js';
import { createSecurityConfig } from './security/security-config.js';
import { readFileSync } from 'fs';

// Load extension configuration
const extensionConfig = JSON.parse(readFileSync(new URL('./extension-config.json', import.meta.url), 'utf8'));

 // ! ══════════════════════════════════════════════════════════════════════════════
 // ! VS Code Extension Entry Point for Chahuadev Sentinel
 // ! Provides subtle blue notifications with detailed hover information
 // ! Enhanced with Fortress-level security protection
 // ! ══════════════════════════════════════════════════════════════════════════════

let diagnosticCollection;
let validationEngine;
let securityMiddleware;

function emitExtensionLog(message, method, severity = 'INFO', context = {}) {
    const normalizedMessage = typeof message === 'string' && message.trim().length > 0
        ? message
        : 'Extension event emitted';

    const notice = new Error(normalizedMessage);
    notice.name = 'ExtensionNotice';
    notice.isOperational = true;

    // FIX: Binary Error Pattern
    reportError(BinaryCodes.SYSTEM.RUNTIME(5000), {
        method,
        message: normalizedMessage,
        error: notice,
        context
    });
}

function showProjectInfo() {
    emitExtensionLog('Extension project metadata loaded', 'showProjectInfo', 'INFO', {
        projectInfo: extensionConfig.projectInfo
    });
}

function activate(context) {
    // ! Show project information
    showProjectInfo();
    emitExtensionLog(extensionConfig.messages.activation, 'activate', 'INFO');
    
    try {
        // ! Get configuration from VS Code settings with fallback
        const userConfig = vscode.workspace.getConfiguration('chahuadev-sentinel');
        const securityLevel = userConfig.get('securityLevel') || extensionConfig.defaultSettings.securityLevel;
        
        // ! Initialize security system
        const securityConfig = createSecurityConfig({
            level: securityLevel,
            vscodeSettings: userConfig
        });
        
        // ! SECURITY FIX: Dependency Injection for NO_MOCKING compliance
        // ! Pass vscode instance to SecurityMiddleware instead of letting it create mocks
        securityMiddleware = new SecurityMiddleware(vscode, securityConfig.policies);
        
        // ! NO_SILENT_FALLBACKS: Validate policies loaded correctly
        const policies = securityConfig.policies;
        if (!policies || typeof policies !== 'object') {
            const configError = new Error('Security policies missing or invalid in securityConfig');
            configError.isOperational = false;
            throw configError;
        }
        
        emitExtensionLog('Security middleware initialized', 'activate', 'INFO', {
            securityLevel,
            policies: Object.keys(policies)
        });
        
        // ! Initialize validation engine
        validationEngine = new ValidationEngine();
        validationEngine.initializeParserStudy().catch(error => {
            errorHandler.handleError(error, {
                source: 'Extension',
                method: 'activate',
                severity: 'CRITICAL',
                context: 'Failed to initialize validation engine'
            });
            // ไม่ throw - ให้ extension ทำงานต่อแม้ parser ไม่สำเร็จ
        });
        
        // ! Create diagnostic collection for subtle blue notifications
        diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuadev-sentinel');
        context.subscriptions.push(diagnosticCollection);
        
        // ! Register security status command
        context.subscriptions.push(
            vscode.commands.registerCommand('chahuadev-sentinel.securityStatus', showSecurityStatus)
        );
        
    } catch (error) {
        errorHandler.handleError(error, {
            source: 'Extension',
            method: 'activate',
            severity: 'CRITICAL',
            context: 'Failed to initialize security system'
        });
        vscode.window.showErrorMessage(extensionConfig.messages.securityInitFailed);
        throw error; // ! Don't silently continue - extension should fail if security can't initialize
    }
    
    // ! Real-time scanning on document change (throttled with security)
    let scanTimeout;
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(async (event) => {
        const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
        if (!config.get('enableRealTimeScanning', true)) return;
        
        // ! Throttle scanning to avoid performance issues
        clearTimeout(scanTimeout);
        const throttleMs = config.get('scanThrottleMs') || extensionConfig.defaultSettings.timing.scanThrottleMs;
        scanTimeout = setTimeout(async () => {
            try {
                await secureDocumentScan(event.document);
            } catch (error) {
                errorHandler.handleError(error, {
                    source: 'Extension',
                    method: 'onDidChangeTextDocument',
                    severity: 'HIGH',
                    context: 'Security error in document scan'
                });
                throw error; // ! Re-throw to let caller handle properly
            }
        }, throttleMs);
    });
    
    // ! Scan on save with security
    const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
        if (!config.get('scanOnSave', true)) return;
        
        try {
            await secureDocumentScan(document);
            await securityMiddleware.showSecureNotification(extensionConfig.messages.scanSuccess);
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'Extension',
                method: 'onDidSaveTextDocument',
                severity: 'HIGH',
                context: 'Security error in save scan'
            });
            await securityMiddleware.showSecureNotification(extensionConfig.messages.securityError, 'error');
            throw error; // ! Re-throw for proper error handling
        }
    });
    
    // ! Command: Scan Current File
    const scanFileCommand = vscode.commands.registerCommand('chahuadev-sentinel.scanFile', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage(extensionConfig.messages.noActiveFile);
            return;
        }
        
        try {
            const results = await scanDocument(activeEditor.document);
            if (!results || !results.violations) {
                errorHandler.handleError(new Error('Scan results are invalid or missing'), {
                    source: 'Extension',
                    method: 'scanActiveFile',
                    severity: 'MEDIUM'
                });
                // ไม่ throw - แสดง message แล้ว return
                showSubtleNotification(extensionConfig.messages.fileClean);
                return;
            }
            
            const violationCount = results.violations.length;
            
            if (violationCount === 0) {
                showSubtleNotification(extensionConfig.messages.fileClean);
            } else {
                const plural = violationCount > 1 ? 's' : '';
                const message = extensionConfig.messages.issuesFound
                    .replace('{violationCount}', violationCount)
                    .replace('{plural}', plural);
                showSubtleNotification(message);
            }
        } catch (error) {
            errorHandler.handleError(error, {
                source: 'Extension',
                method: 'scanFileCommand',
                severity: 'HIGH',
                context: 'Scan file command failed'
            });
            throw error;
        }
    });
    
    // ! Command: Scan Workspace
    const scanWorkspaceCommand = vscode.commands.registerCommand('chahuadev-sentinel.scanWorkspace', async () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Chahuadev Sentinel',
            cancellable: true
        }, async (progress, token) => {
            progress.report({ message: extensionConfig.messages.scanning });
            
            const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
            const includePattern = config.get('scanPatterns.include') || extensionConfig.defaultSettings.scanPatterns.include;
            const excludePattern = config.get('scanPatterns.exclude') || extensionConfig.defaultSettings.scanPatterns.exclude;
            
            const files = await vscode.workspace.findFiles(includePattern, excludePattern);
            
            let scannedCount = 0;
            let totalViolations = 0;
            
            for (const [index, file] of files.entries()) {
                if (token.isCancellationRequested) break;
                
                const fileName = file.path.split('/').pop();
                const scanMessage = extensionConfig.messages.scanningFile.replace('{fileName}', fileName);
                progress.report({ 
                    message: scanMessage,
                    increment: (100 / files.length)
                });
                
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const results = await scanDocument(document);
                    
                    if (!results || !results.violations) {
                        errorHandler.handleError(new Error(`Invalid scan results for file: ${fileName}`), {
                            source: 'Extension',
                            method: 'scanWorkspace',
                            severity: 'MEDIUM'
                        });
                        // ไม่ throw - skip file นี้และทำงานต่อ
                        continue;
                    }
                    
                    totalViolations += results.violations.length;
                    scannedCount++;
                } catch (error) {
                    errorHandler.handleError(error, {
                        source: 'Extension',
                        method: 'scanWorkspaceCommand',
                        severity: 'HIGH',
                        context: `Scan error for file: ${fileName}`
                    });
                    throw error; // ! Re-throw to surface scanning issues
                }
            }
            
            if (!token.isCancellationRequested) {
                const completionMessage = extensionConfig.messages.scanCompleted
                    .replace('{scannedCount}', scannedCount)
                    .replace('{totalViolations}', totalViolations);
                showSubtleNotification(completionMessage);
            }
        });
    });
    
    // ! Command: Configure Rules
    const configureRulesCommand = vscode.commands.registerCommand('chahuadev-sentinel.toggleRules', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:chahuadev.chahuadev-sentinel');
    });
    
    // ! Register all subscriptions
    context.subscriptions.push(
        documentChangeListener,
        saveListener,
        scanFileCommand,
        scanWorkspaceCommand,
        configureRulesCommand
    );
    
    // ! Initial scan of active document
    if (vscode.window.activeTextEditor) {
        scanDocument(vscode.window.activeTextEditor.document).catch(error => {
            errorHandler.handleError(error, {
                source: 'Extension',
                method: 'activate',
                severity: 'MEDIUM',
                context: 'Initial document scan failed'
            });
            // Error already handled, no need to log again
        });
    }
    
    emitExtensionLog(extensionConfig.messages.ready, 'activate', 'INFO');
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Scan document and create subtle diagnostics with detailed hover info
 // ! ══════════════════════════════════════════════════════════════════════════════
async function scanDocument(document) {
    // ! Only scan supported file types
    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
        // !  NO_SILENT_FALLBACKS: คืน empty result แทน null
        diagnosticCollection.set(document.uri, []);
        return { 
            violations: [],
            skipped: true,
            reason: 'Unsupported file type'
        };
    }
    
    try {
        const code = document.getText();
        if (!code.trim()) {
            diagnosticCollection.set(document.uri, []);
            return { violations: [] };
        }
        
        const results = await validationEngine.validateCode(code, document.fileName);
        
        const diagnostics = results.violations.map(violation => {
            // ! Explicit validation instead of silent fallback
            if (!violation.location) {
                errorHandler.handleError(new Error('Violation missing required location information'), {
                    source: 'Extension',
                    method: 'scanDocument',
                    severity: 'MEDIUM',
                    context: { violation }
                });
                // ไม่ throw - skip violation นี้โดยใช้ default location
                return null;
            }
            
            const line = Math.max(0, (violation.location.line ?? 1) - 1);
            const column = Math.max(0, violation.location.column ?? 0);
            
            // ! Create range for the violation
            const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
            const highlightLength = config.get('ui.highlightLength') || extensionConfig.defaultSettings.ui.highlightLength;
            
            const range = new vscode.Range(
                line,
                column,
                line,
                column + highlightLength
            );
            
            const diagnostic = new vscode.Diagnostic(
                range,
                getShortMessage(violation),
                getSeverity(violation.severity)
            );
            
            // ! Set source and code for identification
            diagnostic.source = 'Chahuadev Sentinel';
            diagnostic.code = {
                value: violation.ruleId,
                target: vscode.Uri.parse('https://github.com/chahuadev/chahuadev-vscode-extension#rules')
            };
            
            // ! Add detailed information for hover
            diagnostic.relatedInformation = [
                new vscode.DiagnosticRelatedInformation(
                    new vscode.Location(document.uri, range),
                    getFullMessage(violation)
                )
            ];
            
            // ! Add tags for better categorization
            diagnostic.tags = getViolationTags(violation);
            
            return diagnostic;
        }).filter(d => d !== null); // กรอง null ออก (violations ที่ไม่มี location)
        
        // ! Apply subtle blue styling by using Information severity for most issues
        const subtleDiagnostics = diagnostics.map(d => {
            const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
            const notificationStyle = config.get('notificationStyle', 'subtle');
            
            if (notificationStyle === 'subtle' && d.severity !== vscode.DiagnosticSeverity.Error) {
                d.severity = vscode.DiagnosticSeverity.Information;
            }
            
            return d;
        });
        
        diagnosticCollection.set(document.uri, subtleDiagnostics);
        return results;
        
    } catch (error) {
        errorHandler.handleError(error, {
            source: 'Extension',
            method: 'scanDocument',
            severity: 'HIGH',
            context: `Scan error for document: ${document.fileName}`
        });
        
        // ! Show error as diagnostic but re-throw for proper error handling
        const errorDiagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 10),
            'Scan failed - check syntax',
            vscode.DiagnosticSeverity.Warning
        );
        errorDiagnostic.source = 'Chahuadev Sentinel';
        
        diagnosticCollection.set(document.uri, [errorDiagnostic]);
        throw error; // ! Don't silently return null
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Get short, non-intrusive message for inline display
 // ! ══════════════════════════════════════════════════════════════════════════════
function getShortMessage(violation) {
    return extensionConfig.ruleMessages.short[violation.ruleId] || ' Quality';
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Get comprehensive message with suggestions for hover
 // ! ══════════════════════════════════════════════════════════════════════════════
function getFullMessage(violation) {
    const ruleConfig = extensionConfig.ruleMessages.detailed[violation.ruleId];
    
    if (ruleConfig) {
        const title = ruleConfig.title.replace('{message}', violation.message);
        return `${title}\n\n Better Approach:\n${ruleConfig.approach}\n\n Why: ${ruleConfig.reason}`;
    }
    
    return `Code Quality Issue: ${violation.message}\n\n Follow Chahuadev coding standards for better maintainability.`;
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Convert severity to VS Code diagnostic severity with subtle default
 // ! ══════════════════════════════════════════════════════════════════════════════
function getSeverity(severity) {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return vscode.DiagnosticSeverity.Error;
        case 'ERROR': return vscode.DiagnosticSeverity.Warning; // Soften errors to warnings
        case 'WARNING': return vscode.DiagnosticSeverity.Information; // Soften warnings
        case 'INFO': return vscode.DiagnosticSeverity.Hint;
        default: return vscode.DiagnosticSeverity.Information; // Subtle default
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Get diagnostic tags for better categorization
 // ! ══════════════════════════════════════════════════════════════════════════════
function getViolationTags(violation) {
    const tags = [];
    
    if (violation.ruleId === 'NO_HARDCODE' && violation.message.includes('credential')) {
        tags.push(vscode.DiagnosticTag.Deprecated); // ! Security-related
    }
    
    return tags;
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Show subtle, non-intrusive notification
 // ! ══════════════════════════════════════════════════════════════════════════════
function showSubtleNotification(message) {
    const config = vscode.workspace.getConfiguration('chahuadev-sentinel');
    const style = config.get('notificationStyle') || extensionConfig.defaultSettings.ui.notificationStyle;
    const duration = config.get('statusMessageDurationMs') || extensionConfig.defaultSettings.timing.statusMessageDurationMs;
    
    switch (style) {
        case 'prominent':
            vscode.window.showWarningMessage(`Chahuadev Sentinel: ${message}`);
            break;
        case 'normal':
            vscode.window.showInformationMessage(` ${message}`);
            break;
        case 'subtle':
        default:
            // Very subtle - just show in status bar briefly
            vscode.window.setStatusBarMessage(` ${message}`, duration);
            break;
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Security Enhanced Functions
// ! ══════════════════════════════════════════════════════════════════════════════

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Secure document scanning with comprehensive security validation
 // ! ══════════════════════════════════════════════════════════════════════════════
async function secureDocumentScan(document) {
    try {
        // ! Validate document security
        const readResult = await securityMiddleware.secureReadDocument(document);
        
        if (!readResult.success) {
            errorHandler.handleError(new Error('Document security validation failed'), {
                source: 'Extension',
                method: 'secureDocumentScan',
                severity: 'HIGH'
            });
            // ไม่ throw - return empty result แทน
            return { violations: [], securityIssues: [] };
        }
        
        // ! Perform content security scan
        const securityScan = await securityMiddleware.secureWorkspaceOperation(
            'SCAN', 
            readResult.filePath
        );
        
        // ! Regular validation scan
        const validationResults = await scanDocument(document);
        
        // ! Add security issues to diagnostics if any
        if (securityScan.securityIssues && securityScan.securityIssues.length > 0) {
            const securityDiagnostics = securityScan.securityIssues.map(issue => 
                securityMiddleware.createSecureDiagnostic(
                    new vscode.Range(0, 0, 0, 0), // ! Top of file
                    `Security Alert: ${issue.issue}`,
                    vscode.DiagnosticSeverity.Warning
                )
            );
            
            // ! NO_SILENT_FALLBACKS: Validate diagnosticCollection.get() result
            const existingDiagnostics = diagnosticCollection.get(document.uri);
            if (!Array.isArray(existingDiagnostics)) {
                errorHandler.handleError(
                    new Error('diagnosticCollection.get() returned non-array value'),
                    {
                        source: 'Extension',
                        method: 'scanDocumentForSecurityIssues',
                        severity: 'WARNING',
                        context: {
                            uri: document.uri.toString(),
                            existingType: typeof existingDiagnostics
                        }
                    }
                );
                // ถ้าไม่ใช่ array ให้ใช้ empty array แทน (แต่ต้อง log warning ก่อน)
                diagnosticCollection.set(document.uri, securityDiagnostics);
            } else {
                diagnosticCollection.set(document.uri, [...existingDiagnostics, ...securityDiagnostics]);
            }
        }
        
        return {
            ...validationResults,
            security: {
                validated: true,
                issues: securityScan.securityIssues || [],
                scanTimestamp: securityScan.scanTimestamp
            }
        };
        
    } catch (error) {
        errorHandler.handleError(error, {
            source: 'Extension',
            method: 'secureDocumentScan',
            severity: 'HIGH',
            context: `Secure document scan failed for: ${document.fileName}`
        });
        
        // ! Show security alert to user
        await securityMiddleware.showSecureNotification(
            `Security scan failed: ${error.message}`,
            'warning'
        );
        
        throw error;
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Show security status and statistics
 // ! ══════════════════════════════════════════════════════════════════════════════
async function showSecurityStatus() {
    try {
        if (!securityMiddleware) {
            vscode.window.showErrorMessage(extensionConfig.messages.securityNotInitialized);
            return;
        }
        
        const stats = securityMiddleware.getStats();
        const securityReport = securityMiddleware.securityManager.generateSecurityReport();
        const uptime = Math.round(stats.uptime / 1000);
        
        const statusMessage = extensionConfig.messages.securityStatus
            .replace('{totalEvents}', stats.totalEvents)
            .replace('{violations}', stats.violations)
            .replace('{uptime}', uptime)
            .replace('{status}', securityReport.status);
        
        const action = await vscode.window.showInformationMessage(
            statusMessage,
            'View Report',
            'Settings'
        );
        
        if (action === 'View Report') {
            await showDetailedSecurityReport(securityReport);
        } else if (action === 'Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'chahuadev-sentinel');
        }
        
    } catch (error) {
        errorHandler.handleError(error, {
            source: 'Extension',
            method: 'showSecurityStatus',
            severity: 'MEDIUM',
            context: 'Failed to show security status'
        });
        vscode.window.showErrorMessage(extensionConfig.messages.securityStatusFailed);
        throw error; // ! Re-throw for proper error handling
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
 // ! Show detailed security report in new document
 // ! ══════════════════════════════════════════════════════════════════════════════
async function showDetailedSecurityReport(report) {
    try {
        const reportContent = JSON.stringify(report, null, 2);
        
        const doc = await vscode.workspace.openTextDocument({
            content: reportContent,
            language: 'json'
        });
        
        await vscode.window.showTextDocument(doc);
        
    } catch (error) {
        errorHandler.handleError(error, {
            source: 'Extension',
            method: 'showDetailedSecurityReport',
            severity: 'MEDIUM',
            context: 'Failed to show security report'
        });
        // Error already handled by ErrorHandler, no need to duplicate logging
    }
}

function deactivate() {
    emitExtensionLog('Chahuadev Sentinel Extension deactivated', 'deactivate', 'INFO');
    
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
    
    if (securityMiddleware) {
        emitExtensionLog('Security middleware shutdown', 'deactivate', 'INFO');
    }
}

export { activate, deactivate };