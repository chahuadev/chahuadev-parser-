#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// project-roadmap-scanner.js - Automatic Project Analysis & Roadmap Generator
// ═══════════════════════════════════════════════════════════════════════════════
// 
// Purpose: Scan entire project to analyze:
//   1. What's been completed (implemented features)
//   2. What needs improvement (TODO, FIXME, BUG comments)
//   3. What's missing (unimplemented exports, empty functions)
//   4. Dependencies between modules
//   5. Code quality metrics (complexity, duplication)
//   6. Generate automatic roadmap with priorities
//
// Usage:
//   node src/error-handler/project-roadmap-scanner.js scan
//   node src/error-handler/project-roadmap-scanner.js analyze
//   node src/error-handler/project-roadmap-scanner.js roadmap
//
// Output:
//   - docs/PROJECT_ANALYSIS.md (detailed analysis)
//   - docs/DEVELOPMENT_ROADMAP.md (prioritized roadmap)
//   - project-analysis.json (machine-readable data)
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Directories to scan
const SCAN_DIRS = ['src', 'docs', 'tests'];
const IGNORE_PATTERNS = [
    'node_modules', 
    '.git', 
    'dist', 
    'build', 
    'coverage', 
    'logs',
    // [SELF-AWARENESS] Don't scan yourself!
    'project-roadmap-scanner.js',  // Don't scan this scanner's own code
    'DEVELOPMENT_ROADMAP.md',      // Don't scan your own output
    'PROJECT_ANALYSIS.md',          // Don't scan your own analysis
    'project-analysis.json',        // Don't scan your own JSON data
    // [RULES] Skip rule documentation (has example comments)
    'src/rules'                     // Skip rules folder - contains example TODO/FIXME in docs
];

// ═══════════════════════════════════════════════════════════════════════════════
// Scanner Class - Analyzes entire project
// ═══════════════════════════════════════════════════════════════════════════════

class ProjectRoadmapScanner {
    constructor() {
        this.stats = {
            filesScanned: 0,
            linesOfCode: 0,
            completedFeatures: [],
            todoItems: [],
            fixmeItems: [],
            bugItems: [],
            unimplementedItems: [],
            imports: new Map(),
            exports: new Map(),
            testCoverage: new Map()
        };
        
        this.patterns = {
            // Completed features (look for full implementations)
            completedFunction: /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\}/g,
            completedClass: /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?\s*\{[\s\S]*?\}/g,
            completedExport: /export\s+(?:const|let|var|function|class|async\s+function)\s+(\w+)/g,
            
            // Issues to fix
            todo: /\/\/\s*TODO:?\s*(.+)|\/\*\s*TODO:?\s*([\s\S]+?)\*\//gi,
            fixme: /\/\/\s*FIXME:?\s*(.+)|\/\*\s*FIXME:?\s*([\s\S]+?)\*\//gi,
            bug: /\/\/\s*BUG:?\s*(.+)|\/\*\s*BUG:?\s*([\s\S]+?)\*\//gi,
            deprecated: /\/\/\s*DEPRECATED:?\s*(.+)|\/\*\s*DEPRECATED:?\s*([\s\S]+?)\*\//gi,
            hack: /\/\/\s*HACK:?\s*(.+)|\/\*\s*HACK:?\s*([\s\S]+?)\*\//gi,
            
            // Unimplemented code
            emptyFunction: /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{\s*\}/g,
            throwNotImplemented: /throw\s+new\s+Error\s*\(\s*['"`](?:Not implemented|TODO|FIXME)['"`]\s*\)/gi,
            
            // Imports and dependencies
            importStatement: /import\s+(?:\{[^}]+\}|[\w\s,]+)\s+from\s+['"]([^'"]+)['"]/g,
            exportStatement: /export\s+(?:\{[^}]+\}|[\w\s,]+)/g,
            
            // Test patterns
            testDescribe: /describe\s*\(\s*['"`]([^'"]+)['"`]/g,
            testIt: /it\s*\(\s*['"`]([^'"]+)['"`]/g,
            testExpect: /expect\s*\(/g
        };
    }
    
    /**
     * Scan entire project
     */
    async scan() {
        console.log('[SCAN] Starting project analysis...\n');
        
        for (const dir of SCAN_DIRS) {
            const targetPath = path.resolve(PROJECT_ROOT, dir);
            if (fs.existsSync(targetPath)) {
                await this.scanDirectory(targetPath, dir);
            }
        }
        
        this.printSummary();
        return this.generateAnalysis();
    }
    
    /**
     * Recursively scan directory
     */
    async scanDirectory(dirPath, relativePath = '') {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relPath = path.join(relativePath, entry.name);
            
            // Skip ignored patterns (check both name and full relative path)
            const shouldSkip = IGNORE_PATTERNS.some(pattern => {
                // Normalize path separators for comparison
                const normalizedPath = relPath.replace(/\\/g, '/');
                const normalizedPattern = pattern.replace(/\\/g, '/');
                
                return entry.name.includes(normalizedPattern) || 
                       normalizedPath.includes(normalizedPattern);
            });
            
            if (shouldSkip) {
                continue;
            }
            
            if (entry.isDirectory()) {
                await this.scanDirectory(fullPath, relPath);
            } else if (entry.isFile() && this.shouldScanFile(entry.name)) {
                await this.scanFile(fullPath, relPath);
            }
        }
    }
    
    /**
     * Check if file should be scanned
     */
    shouldScanFile(filename) {
        const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md'];
        return extensions.some(ext => filename.endsWith(ext));
    }
    
    /**
     * Scan individual file
     */
    async scanFile(filePath, relativePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        this.stats.filesScanned++;
        this.stats.linesOfCode += lines.length;
        
        // Scan for completed features
        this.scanCompletedFeatures(content, relativePath);
        
        // Scan for issues
        this.scanIssues(content, relativePath, lines);
        
        // Scan for unimplemented code
        this.scanUnimplemented(content, relativePath);
        
        // Scan imports/exports
        this.scanDependencies(content, relativePath);
        
        // Scan test coverage
        if (relativePath.includes('test')) {
            this.scanTests(content, relativePath);
        }
    }
    
    /**
     * Scan for completed features
     */
    scanCompletedFeatures(content, relativePath) {
        // Find completed functions
        let match;
        while ((match = this.patterns.completedFunction.exec(content)) !== null) {
            if (match[0].length > 50) { // Not empty function
                this.stats.completedFeatures.push({
                    type: 'function',
                    name: match[1],
                    file: relativePath,
                    complexity: this.calculateComplexity(match[0])
                });
            }
        }
        
        // Find completed classes
        while ((match = this.patterns.completedClass.exec(content)) !== null) {
            if (match[0].length > 100) { // Has real implementation
                this.stats.completedFeatures.push({
                    type: 'class',
                    name: match[1],
                    file: relativePath,
                    complexity: this.calculateComplexity(match[0])
                });
            }
        }
    }
    
    /**
     * Scan for issues (TODO, FIXME, BUG)
     */
    scanIssues(content, relativePath, lines) {
        // TODO comments
        let match;
        while ((match = this.patterns.todo.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            this.stats.todoItems.push({
                file: relativePath,
                line: lineNumber,
                message: (match[1] || match[2] || '').trim(),
                priority: this.estimatePriority(match[1] || match[2] || '')
            });
        }
        
        // FIXME comments
        while ((match = this.patterns.fixme.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            this.stats.fixmeItems.push({
                file: relativePath,
                line: lineNumber,
                message: (match[1] || match[2] || '').trim(),
                priority: 'HIGH'
            });
        }
        
        // BUG comments
        while ((match = this.patterns.bug.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            this.stats.bugItems.push({
                file: relativePath,
                line: lineNumber,
                message: (match[1] || match[2] || '').trim(),
                priority: 'CRITICAL'
            });
        }
    }
    
    /**
     * Scan for unimplemented code
     */
    scanUnimplemented(content, relativePath) {
        // Empty functions
        let match;
        while ((match = this.patterns.emptyFunction.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            this.stats.unimplementedItems.push({
                type: 'empty-function',
                name: match[1],
                file: relativePath,
                line: lineNumber,
                priority: 'MEDIUM'
            });
        }
        
        // "Not implemented" throws
        while ((match = this.patterns.throwNotImplemented.exec(content)) !== null) {
            const lineNumber = content.substring(0, match.index).split('\n').length;
            this.stats.unimplementedItems.push({
                type: 'not-implemented',
                file: relativePath,
                line: lineNumber,
                priority: 'HIGH'
            });
        }
    }
    
    /**
     * Scan imports and exports
     */
    scanDependencies(content, relativePath) {
        // Imports
        let match;
        while ((match = this.patterns.importStatement.exec(content)) !== null) {
            const importPath = match[1];
            if (!this.stats.imports.has(relativePath)) {
                this.stats.imports.set(relativePath, []);
            }
            this.stats.imports.get(relativePath).push(importPath);
        }
        
        // Exports
        const exportMatches = content.match(this.patterns.exportStatement);
        if (exportMatches) {
            this.stats.exports.set(relativePath, exportMatches.length);
        }
    }
    
    /**
     * Scan test coverage
     */
    scanTests(content, relativePath) {
        const describes = (content.match(this.patterns.testDescribe) || []).length;
        const tests = (content.match(this.patterns.testIt) || []).length;
        const expects = (content.match(this.patterns.testExpect) || []).length;
        
        this.stats.testCoverage.set(relativePath, {
            describes,
            tests,
            expects
        });
    }
    
    /**
     * Calculate code complexity (cyclomatic complexity estimate)
     */
    calculateComplexity(code) {
        const complexity = 1 + // base
            (code.match(/if\s*\(/g) || []).length +
            (code.match(/else\s+if\s*\(/g) || []).length +
            (code.match(/for\s*\(/g) || []).length +
            (code.match(/while\s*\(/g) || []).length +
            (code.match(/case\s+/g) || []).length +
            (code.match(/catch\s*\(/g) || []).length +
            (code.match(/&&|\|\|/g) || []).length;
        
        return complexity;
    }
    
    /**
     * Estimate priority from TODO message
     */
    estimatePriority(message) {
        const lower = message.toLowerCase();
        if (lower.includes('critical') || lower.includes('urgent') || lower.includes('asap')) {
            return 'CRITICAL';
        } else if (lower.includes('important') || lower.includes('soon') || lower.includes('high')) {
            return 'HIGH';
        } else if (lower.includes('nice to have') || lower.includes('optional') || lower.includes('low')) {
            return 'LOW';
        }
        return 'MEDIUM';
    }
    
    /**
     * Print summary
     */
    printSummary() {
        console.log('\n' + '═'.repeat(70));
        console.log('[SUMMARY] Project Analysis Summary');
        console.log('═'.repeat(70));
        console.log(`Files Scanned:         ${this.stats.filesScanned}`);
        console.log(`Lines of Code:         ${this.stats.linesOfCode.toLocaleString()}`);
        console.log(`Completed Features:    ${this.stats.completedFeatures.length}`);
        console.log(`TODO Items:            ${this.stats.todoItems.length}`);
        console.log(`FIXME Items:           ${this.stats.fixmeItems.length}`);
        console.log(`BUG Items:             ${this.stats.bugItems.length}`);
        console.log(`Unimplemented:         ${this.stats.unimplementedItems.length}`);
        console.log(`Test Files:            ${this.stats.testCoverage.size}`);
        console.log('═'.repeat(70));
    }
    
    /**
     * Generate analysis report
     */
    generateAnalysis() {
        const analysis = {
            metadata: {
                generatedAt: new Date().toISOString(),
                projectRoot: PROJECT_ROOT,
                scanDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
            stats: {
                filesScanned: this.stats.filesScanned,
                linesOfCode: this.stats.linesOfCode,
                completedFeatures: this.stats.completedFeatures.length,
                issues: {
                    todo: this.stats.todoItems.length,
                    fixme: this.stats.fixmeItems.length,
                    bugs: this.stats.bugItems.length
                },
                unimplemented: this.stats.unimplementedItems.length,
                tests: this.stats.testCoverage.size
            },
            completedFeatures: this.stats.completedFeatures,
            issues: {
                critical: [...this.stats.bugItems, ...this.stats.fixmeItems],
                high: this.stats.todoItems.filter(t => t.priority === 'HIGH'),
                medium: this.stats.todoItems.filter(t => t.priority === 'MEDIUM'),
                low: this.stats.todoItems.filter(t => t.priority === 'LOW')
            },
            unimplemented: this.stats.unimplementedItems,
            dependencies: {
                imports: Array.from(this.stats.imports.entries()).map(([file, imports]) => ({
                    file,
                    imports
                })),
                exports: Array.from(this.stats.exports.entries()).map(([file, count]) => ({
                    file,
                    exportCount: count
                }))
            },
            testCoverage: Array.from(this.stats.testCoverage.entries()).map(([file, coverage]) => ({
                file,
                ...coverage
            }))
        };
        
        return analysis;
    }
    
    /**
     * Generate detailed roadmap with context and actionable information
     */
    generateRoadmap(analysis) {
        const roadmap = {
            metadata: {
                generatedAt: new Date().toISOString(),
                totalPhases: 0,
                totalTasks: 0,
                estimatedWeeks: 0
            },
            phases: []
        };
        
        // Phase 1: Critical bugs and fixes
        if (analysis.issues.critical.length > 0) {
            const tasks = analysis.issues.critical.map((issue, index) => {
                const taskType = issue.message.toLowerCase().includes('bug') ? 'bug-fix' : 'critical-fix';
                return {
                    id: `P1-${index + 1}`,
                    title: this.generateTaskTitle(issue),
                    file: issue.file,
                    line: issue.line,
                    description: issue.message,
                    type: taskType,
                    priority: 'CRITICAL',
                    estimatedHours: this.estimateEffort(issue.message, taskType),
                    context: this.generateContext(issue, taskType),
                    acceptanceCriteria: this.generateAcceptanceCriteria(issue, taskType),
                    dependencies: [],
                    impact: 'HIGH - System stability affected',
                    codeExample: this.generateCodeExample(issue, taskType)
                };
            });
            
            roadmap.phases.push({
                phase: 1,
                name: 'Critical Bug Fixes & FIXME Items',
                priority: 'CRITICAL',
                status: 'IN_PROGRESS',
                estimatedWeeks: Math.ceil(tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 40),
                description: 'Fix all critical bugs and FIXME items that affect system stability or core functionality.',
                blockers: [],
                tasks
            });
        }
        
        // Phase 2: Complete unimplemented features
        if (analysis.unimplemented.length > 0) {
            const tasks = analysis.unimplemented.map((item, index) => ({
                id: `P2-${index + 1}`,
                title: `Implement ${item.name || 'missing functionality'}`,
                file: item.file,
                line: item.line,
                name: item.name,
                type: item.type,
                priority: item.priority,
                estimatedHours: this.estimateImplementationEffort(item),
                context: `Function/feature declared but not implemented. ${item.type === 'empty-function' ? 'Empty function body' : 'Throws "Not implemented" error'}`,
                acceptanceCriteria: [
                    'Function fully implemented with proper logic',
                    'Error handling added',
                    'Unit tests written',
                    'Documentation updated'
                ],
                dependencies: this.findDependencies(item, analysis),
                impact: this.assessImpact(item, analysis),
                codeExample: `// File: ${item.file}\n// Current: Empty or throws NotImplementedError\n// Action: Implement actual functionality`
            }));
            
            roadmap.phases.push({
                phase: 2,
                name: 'Complete Unimplemented Features',
                priority: 'HIGH',
                status: 'PLANNED',
                estimatedWeeks: Math.ceil(tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 40),
                description: 'Implement all functions/methods that are declared but not yet coded.',
                blockers: ['Phase 1 must be completed first'],
                tasks
            });
        }
        
        // Phase 3: High priority TODOs
        if (analysis.issues.high.length > 0) {
            const tasks = analysis.issues.high.map((todo, index) => ({
                id: `P3-${index + 1}`,
                title: this.generateTaskTitle(todo),
                file: todo.file,
                line: todo.line,
                description: todo.message,
                type: 'improvement',
                priority: 'HIGH',
                estimatedHours: this.estimateEffort(todo.message, 'improvement'),
                context: 'High priority improvement identified in code comments',
                acceptanceCriteria: this.generateAcceptanceCriteria(todo, 'improvement'),
                dependencies: [],
                impact: 'MEDIUM - Improves functionality or code quality',
                codeExample: `// ${todo.file}:${todo.line}\n// TODO: ${todo.message}`
            }));
            
            roadmap.phases.push({
                phase: 3,
                name: 'High Priority Improvements',
                priority: 'HIGH',
                status: 'PLANNED',
                estimatedWeeks: Math.ceil(tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 40),
                description: 'Implement high-priority TODOs that improve system functionality.',
                blockers: ['Phase 2 completion recommended'],
                tasks
            });
        }
        
        // Phase 4: Test coverage
        const untestedCount = analysis.completedFeatures.length - analysis.testCoverage.length;
        roadmap.phases.push({
            phase: 4,
            name: 'Increase Test Coverage',
            priority: 'MEDIUM',
            status: 'ONGOING',
            estimatedWeeks: Math.ceil(untestedCount * 0.5 / 40), // 0.5 hours per test
            description: 'Add comprehensive test coverage for existing features.',
            blockers: [],
            tasks: [{
                id: 'P4-1',
                title: `Add tests for ${untestedCount} untested features`,
                description: `Write unit and integration tests for ${untestedCount} completed features currently without test coverage`,
                type: 'testing',
                priority: 'MEDIUM',
                estimatedHours: untestedCount * 0.5,
                context: `Current coverage: ${analysis.testCoverage.length} tested / ${analysis.completedFeatures.length} total features`,
                acceptanceCriteria: [
                    'All critical functions have unit tests',
                    'Code coverage reaches 80% minimum',
                    'Integration tests cover main workflows',
                    'All tests pass consistently'
                ],
                dependencies: [],
                impact: 'HIGH - Improves code reliability and prevents regressions',
                codeExample: '// Create test files in tests/ directory\n// Follow pattern: feature-name.test.js'
            }]
        });
        
        // Phase 5: Medium priority TODOs
        if (analysis.issues.medium.length > 0) {
            const tasks = analysis.issues.medium.slice(0, 20).map((todo, index) => ({
                id: `P5-${index + 1}`,
                title: this.generateTaskTitle(todo),
                file: todo.file,
                line: todo.line,
                description: todo.message,
                type: 'improvement',
                priority: 'MEDIUM',
                estimatedHours: this.estimateEffort(todo.message, 'improvement'),
                context: 'Medium priority improvement for code quality or features',
                acceptanceCriteria: this.generateAcceptanceCriteria(todo, 'improvement'),
                dependencies: [],
                impact: 'LOW - Nice to have improvements',
                codeExample: `// ${todo.file}:${todo.line}\n// TODO: ${todo.message}`
            }));
            
            roadmap.phases.push({
                phase: 5,
                name: 'Medium Priority Improvements',
                priority: 'MEDIUM',
                status: 'PLANNED',
                estimatedWeeks: Math.ceil(tasks.reduce((sum, t) => sum + t.estimatedHours, 0) / 40),
                description: 'Implement medium-priority TODOs when time permits.',
                blockers: ['Can be done in parallel with Phase 4'],
                tasks
            });
        }
        
        // Calculate metadata
        roadmap.metadata.totalPhases = roadmap.phases.length;
        roadmap.metadata.totalTasks = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
        roadmap.metadata.estimatedWeeks = roadmap.phases.reduce((sum, phase) => sum + (phase.estimatedWeeks || 0), 0);
        
        return roadmap;
    }
    
    /**
     * Generate task title from issue
     */
    generateTaskTitle(issue) {
        const maxLength = 80;
        let title = issue.message || issue.name || 'Fix issue';
        
        // Clean up title
        title = title.replace(/^(TODO|FIXME|BUG):\s*/i, '');
        title = title.trim();
        
        // Truncate if too long
        if (title.length > maxLength) {
            title = title.substring(0, maxLength) + '...';
        }
        
        return title;
    }
    
    /**
     * Estimate effort in hours
     */
    estimateEffort(message, type) {
        const lower = message.toLowerCase();
        
        // Quick fixes
        if (lower.includes('typo') || lower.includes('rename') || lower.includes('comment')) {
            return 0.5;
        }
        
        // Small changes
        if (lower.includes('add') && lower.includes('validation')) {
            return 2;
        }
        
        // Medium changes
        if (type === 'bug-fix') {
            return 4;
        }
        
        if (type === 'improvement') {
            return 3;
        }
        
        // Large changes
        if (lower.includes('refactor') || lower.includes('redesign')) {
            return 8;
        }
        
        // Default
        return 3;
    }
    
    /**
     * Estimate implementation effort
     */
    estimateImplementationEffort(item) {
        if (item.type === 'empty-function') {
            return 4; // 4 hours to implement average function
        }
        
        if (item.type === 'not-implemented') {
            return 6; // 6 hours for planned features
        }
        
        return 3;
    }
    
    /**
     * Generate context for task
     */
    generateContext(issue, type) {
        const contexts = {
            'bug-fix': `Critical bug found in ${issue.file}. This affects system stability and must be fixed immediately.`,
            'critical-fix': `FIXME comment indicates critical issue requiring immediate attention in ${issue.file}.`,
            'improvement': `Enhancement opportunity identified in ${issue.file} to improve code quality or functionality.`
        };
        
        return contexts[type] || `Issue in ${issue.file} requires attention.`;
    }
    
    /**
     * Generate acceptance criteria
     */
    generateAcceptanceCriteria(issue, type) {
        const criteria = {
            'bug-fix': [
                'Bug is identified and root cause determined',
                'Fix is implemented and tested',
                'No new bugs introduced',
                'Regression tests added',
                'Code review passed'
            ],
            'critical-fix': [
                'Issue resolved completely',
                'FIXME comment removed or updated',
                'Tests verify the fix',
                'Documentation updated if needed'
            ],
            'improvement': [
                'Improvement implemented as described',
                'Code quality improved (complexity, readability)',
                'No breaking changes introduced',
                'Tests updated or added'
            ]
        };
        
        return criteria[type] || [
            'Task completed as described',
            'Tests passing',
            'Code reviewed'
        ];
    }
    
    /**
     * Find dependencies for unimplemented item
     */
    findDependencies(item, analysis) {
        const dependencies = [];
        
        // Check if item is in error-handler (needs Universal Reporter)
        if (item.file.includes('error-handler')) {
            dependencies.push('Universal Error Reporting system must be stable');
        }
        
        // Check if item is in grammars (needs parser)
        if (item.file.includes('grammar')) {
            dependencies.push('Binary Parser must be working correctly');
        }
        
        // Check if item is in tests (needs features complete)
        if (item.file.includes('test')) {
            dependencies.push('Feature to be tested must be implemented first');
        }
        
        return dependencies.length > 0 ? dependencies : ['None'];
    }
    
    /**
     * Assess impact of unimplemented item
     */
    assessImpact(item, analysis) {
        // High impact if in core files
        const coreFiles = ['binary-reporter', 'universal-reporter', 'error-handler', 'validator', 'parser'];
        if (coreFiles.some(core => item.file.includes(core))) {
            return 'HIGH - Core functionality affected';
        }
        
        // Medium impact for grammar/rules
        if (item.file.includes('grammar') || item.file.includes('rule')) {
            return 'MEDIUM - Feature completeness affected';
        }
        
        // Low impact for utilities
        return 'LOW - Utility or helper function';
    }
    
    /**
     * Generate code example
     */
    generateCodeExample(issue, type) {
        return `// File: ${issue.file}:${issue.line}\n// ${type.toUpperCase()}: ${issue.message}\n// Action: Review and fix the identified issue`;
    }
    
    /**
     * Save analysis to file
     */
    saveAnalysis(analysis) {
        const outputPath = path.resolve(PROJECT_ROOT, 'project-analysis.json');
        fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf8');
        console.log(`\n[SUCCESS] Analysis saved: ${path.relative(PROJECT_ROOT, outputPath)}`);
        return outputPath;
    }
    
    /**
     * Generate Markdown analysis report
     */
    generateMarkdownAnalysis(analysis) {
        let md = `# Project Analysis Report\n\n`;
        md += `**Generated:** ${analysis.metadata.scanDate}\n\n`;
        md += `---\n\n`;
        
        // Overview
        md += `## Overview\n\n`;
        md += `- **Files Scanned:** ${analysis.stats.filesScanned}\n`;
        md += `- **Lines of Code:** ${analysis.stats.linesOfCode.toLocaleString()}\n`;
        md += `- **Completed Features:** ${analysis.stats.completedFeatures}\n`;
        md += `- **Test Files:** ${analysis.stats.tests}\n\n`;
        
        // Issues
        md += `## Issues Summary\n\n`;
        md += `| Priority | Count | Type |\n`;
        md += `|----------|-------|------|\n`;
        md += `| CRITICAL | ${analysis.issues.critical.length} | Bugs & FIXME |\n`;
        md += `| HIGH | ${analysis.issues.high.length} | TODO (High) |\n`;
        md += `| MEDIUM | ${analysis.issues.medium.length} | TODO (Medium) |\n`;
        md += `| LOW | ${analysis.issues.low.length} | TODO (Low) |\n\n`;
        
        // Critical Issues
        if (analysis.issues.critical.length > 0) {
            md += `## Critical Issues\n\n`;
            analysis.issues.critical.forEach((issue, index) => {
                md += `### ${index + 1}. ${issue.file}:${issue.line}\n\n`;
                md += `\`\`\`\n${issue.message}\n\`\`\`\n\n`;
            });
        }
        
        // Unimplemented
        if (analysis.unimplemented.length > 0) {
            md += `## Unimplemented Features\n\n`;
            analysis.unimplemented.forEach((item, index) => {
                md += `${index + 1}. **${item.file}:${item.line}** - ${item.name || item.type}\n`;
            });
            md += `\n`;
        }
        
        // Completed Features (top 20 most complex)
        const topFeatures = analysis.completedFeatures
            .sort((a, b) => b.complexity - a.complexity)
            .slice(0, 20);
        
        if (topFeatures.length > 0) {
            md += `## Top Complex Features\n\n`;
            md += `| Feature | File | Complexity |\n`;
            md += `|---------|------|------------|\n`;
            topFeatures.forEach(feature => {
                md += `| ${feature.name} | ${feature.file} | ${feature.complexity} |\n`;
            });
            md += `\n`;
        }
        
        return md;
    }
    
    /**
     * Generate Markdown roadmap
     */
    generateMarkdownRoadmap(roadmap) {
        let md = `# Development Roadmap\n\n`;
        md += `**Generated:** ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}\n\n`;
        
        // Executive Summary
        md += `## Executive Summary\n\n`;
        md += `- **Total Phases:** ${roadmap.metadata.totalPhases}\n`;
        md += `- **Total Tasks:** ${roadmap.metadata.totalTasks}\n`;
        md += `- **Estimated Duration:** ${roadmap.metadata.estimatedWeeks} weeks\n`;
        md += `- **Next Action:** Review Phase 1 critical tasks and assign to team members\n\n`;
        
        md += `---\n\n`;
        
        roadmap.phases.forEach(phase => {
            md += `## Phase ${phase.phase}: ${phase.name}\n\n`;
            md += `**Priority:** ${phase.priority} | **Status:** ${phase.status} | **Estimated:** ${phase.estimatedWeeks} week${phase.estimatedWeeks !== 1 ? 's' : ''}\n\n`;
            md += `**Description:** ${phase.description}\n\n`;
            
            if (phase.blockers && phase.blockers.length > 0) {
                md += `**⚠️ Blockers:**\n`;
                phase.blockers.forEach(blocker => {
                    md += `- ${blocker}\n`;
                });
                md += `\n`;
            }
            
            md += `### Tasks (${phase.tasks.length})\n\n`;
            
            phase.tasks.forEach(task => {
                md += `#### ${task.id}: ${task.title}\n\n`;
                md += `**📍 Location:** \`${task.file}\`${task.line ? `:${task.line}` : ''}\n\n`;
                md += `**📊 Details:**\n`;
                md += `- **Type:** ${task.type}\n`;
                md += `- **Priority:** ${task.priority}\n`;
                md += `- **Estimated Effort:** ${task.estimatedHours} hour${task.estimatedHours !== 1 ? 's' : ''}\n`;
                md += `- **Impact:** ${task.impact}\n\n`;
                
                if (task.context) {
                    md += `**📖 Context:**\n${task.context}\n\n`;
                }
                
                if (task.description) {
                    md += `**📝 Description:**\n${task.description}\n\n`;
                }
                
                if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
                    md += `**✅ Acceptance Criteria:**\n`;
                    task.acceptanceCriteria.forEach(criteria => {
                        md += `- [ ] ${criteria}\n`;
                    });
                    md += `\n`;
                }
                
                if (task.dependencies && task.dependencies.length > 0 && task.dependencies[0] !== 'None') {
                    md += `**🔗 Dependencies:**\n`;
                    task.dependencies.forEach(dep => {
                        md += `- ${dep}\n`;
                    });
                    md += `\n`;
                }
                
                if (task.codeExample) {
                    md += `**💻 Code Reference:**\n`;
                    md += `\`\`\`javascript\n${task.codeExample}\n\`\`\`\n\n`;
                }
                
                md += `---\n\n`;
            });
        });
        
        // How to Use section
        md += `## How to Use This Roadmap\n\n`;
        md += `### For AI Assistants\n`;
        md += `1. **Task Selection:** Read the task ID, context, and acceptance criteria\n`;
        md += `2. **Dependency Check:** Verify all dependencies are met before starting\n`;
        md += `3. **Implementation:** Follow the code example and acceptance criteria\n`;
        md += `4. **Validation:** Check off each acceptance criterion as you complete it\n`;
        md += `5. **Update:** Re-run the scanner after completion to update roadmap\n\n`;
        
        md += `### For Developers\n`;
        md += `1. **Phase Planning:** Work through phases sequentially (Phase 1 → 2 → 3...)\n`;
        md += `2. **Task Assignment:** Pick tasks based on priority and your expertise\n`;
        md += `3. **Time Estimation:** Use the estimated hours for sprint planning\n`;
        md += `4. **Progress Tracking:** Check off acceptance criteria as you work\n`;
        md += `5. **Dependencies:** Don't start a task until its dependencies are complete\n\n`;
        
        md += `### Updating the Roadmap\n`;
        md += `\`\`\`bash\n`;
        md += `# Re-scan project after making changes\n`;
        md += `node src/error-handler/project-roadmap-scanner.js scan\n`;
        md += `\`\`\`\n\n`;
        
        md += `This will regenerate:\n`;
        md += `- \`project-analysis.json\` - Machine-readable data\n`;
        md += `- \`docs/PROJECT_ANALYSIS.md\` - Detailed analysis report\n`;
        md += `- \`docs/DEVELOPMENT_ROADMAP.md\` - This roadmap (updated)\n\n`;
        
        return md;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI Interface
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'scan';
    
    const scanner = new ProjectRoadmapScanner();
    
    if (command === 'scan' || command === 'analyze') {
        // Scan project
        const analysis = await scanner.scan();
        
        // Save JSON
        scanner.saveAnalysis(analysis);
        
        // Generate Markdown analysis
        const mdAnalysis = scanner.generateMarkdownAnalysis(analysis);
        const analysisPath = path.resolve(PROJECT_ROOT, 'docs', 'PROJECT_ANALYSIS.md');
        fs.writeFileSync(analysisPath, mdAnalysis, 'utf8');
        console.log(`[SUCCESS] Analysis report: ${path.relative(PROJECT_ROOT, analysisPath)}`);
        
        // Generate roadmap
        const roadmap = scanner.generateRoadmap(analysis);
        const mdRoadmap = scanner.generateMarkdownRoadmap(roadmap);
        const roadmapPath = path.resolve(PROJECT_ROOT, 'docs', 'DEVELOPMENT_ROADMAP.md');
        fs.writeFileSync(roadmapPath, mdRoadmap, 'utf8');
        console.log(`[SUCCESS] Roadmap generated: ${path.relative(PROJECT_ROOT, roadmapPath)}`);
        
    } else if (command === 'roadmap') {
        // Load existing analysis
        const analysisPath = path.resolve(PROJECT_ROOT, 'project-analysis.json');
        if (!fs.existsSync(analysisPath)) {
            console.error('[ERROR] No analysis found. Run "scan" first.');
            process.exit(1);
        }
        
        const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
        const roadmap = scanner.generateRoadmap(analysis);
        const mdRoadmap = scanner.generateMarkdownRoadmap(roadmap);
        const roadmapPath = path.resolve(PROJECT_ROOT, 'docs', 'DEVELOPMENT_ROADMAP.md');
        fs.writeFileSync(roadmapPath, mdRoadmap, 'utf8');
        console.log(`[SUCCESS] Roadmap updated: ${path.relative(PROJECT_ROOT, roadmapPath)}`);
        
    } else {
        console.log('Usage:');
        console.log('  node project-roadmap-scanner.js scan      # Scan project and generate analysis');
        console.log('  node project-roadmap-scanner.js analyze   # Same as scan');
        console.log('  node project-roadmap-scanner.js roadmap   # Generate roadmap from existing analysis');
    }
}

// Run
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/project-roadmap-scanner.js') || 
    process.argv[1].endsWith('project-roadmap-scanner.js')) {
    main().catch(error => {
        console.error('[ERROR]', error.message);
        process.exit(1);
    });
}

export { ProjectRoadmapScanner };
