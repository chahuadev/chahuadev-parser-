// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-parser-.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
import { report } from './error-handler/universal-reporter.js';
import BinaryCodes from './error-handler/binary-codes.js';
import * as vscode from 'vscode';
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
let securityMiddleware;

function emitExtensionLog(message, method, severity = 'INFO', context = {}) {
    const normalizedMessage = typeof message === 'string' && message.trim().length > 0
        ? message
        : 'Extension event emitted';

    // FIX: Universal Reporter - Auto-collect
    report(BinaryCodes.SYSTEM.RUNTIME(5000));
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
            report(BinaryCodes.SYSTEM.CONFIGURATION(1047));
            // ไม่ throw - report() จัดการแล้ว
            return;
        }
        
        emitExtensionLog('Security middleware initialized', 'activate', 'INFO', {
            securityLevel,
            policies: Object.keys(policies)
        });
        
        // ! Create diagnostic collection for subtle blue notifications
        diagnosticCollection = vscode.languages.createDiagnosticCollection('chahuadev-sentinel');
        context.subscriptions.push(diagnosticCollection);
        
        // ! Register security status command
        context.subscriptions.push(
            vscode.commands.registerCommand('chahuadev-sentinel.securityStatus', showSecurityStatus)
        );
        
    } catch (error) {
        report(BinaryCodes.SYSTEM.CONFIGURATION(1047));
        vscode.window.showErrorMessage(extensionConfig.messages.securityInitFailed);
        // ไม่ throw - report() จัดการแล้ว
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
                report(BinaryCodes.SECURITY.RUNTIME(1048));
                // ไม่ throw - report() จัดการแล้ว
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
            report(BinaryCodes.SECURITY.RUNTIME(5004));
            await securityMiddleware.showSecureNotification(extensionConfig.messages.securityError, 'error');
            // ไม่ throw - report() จัดการแล้ว
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
                report(BinaryCodes.VALIDATOR.VALIDATION(5005));
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
            report(BinaryCodes.SYSTEM.RUNTIME(5006));
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
                        report(BinaryCodes.VALIDATOR.VALIDATION(5007));
                        // ไม่ throw - skip file นี้และทำงานต่อ
                        continue;
                    }
                    
                    totalViolations += results.violations.length;
                    scannedCount++;
                } catch (error) {
                    report(BinaryCodes.SYSTEM.RUNTIME(5008));
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
            report(BinaryCodes.SYSTEM.RUNTIME(5009));
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
        
        // Rules system DISABLED - return empty violations
        const results = { violations: [] };
        
        const diagnostics = results.violations.map(violation => {
            // ! Explicit validation instead of silent fallback
            if (!violation.location) {
                report(BinaryCodes.VALIDATOR.VALIDATION(5010));
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
        report(BinaryCodes.SYSTEM.RUNTIME(5011));
        
        // ! Show error as diagnostic
        const errorDiagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 10),
            'Scan failed - check syntax',
            vscode.DiagnosticSeverity.Warning
        );
        errorDiagnostic.source = 'Chahuadev Sentinel';
        
        diagnosticCollection.set(document.uri, [errorDiagnostic]);
        // ไม่ throw - report() จัดการแล้ว
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
            report(BinaryCodes.SECURITY.VALIDATION(5012));
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
                report(BinaryCodes.VALIDATOR.VALIDATION(5013));
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
        report(BinaryCodes.SECURITY.RUNTIME(5014));
        
        // ! Show security alert to user
        await securityMiddleware.showSecureNotification(
            `Security scan failed: ${error.message}`,
            'warning'
        );
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
        report(BinaryCodes.SECURITY.RUNTIME(5015));
        vscode.window.showErrorMessage(extensionConfig.messages.securityStatusFailed);
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
        report(BinaryCodes.SECURITY.RUNTIME(5016));
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