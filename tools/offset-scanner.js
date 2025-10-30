#!/usr/bin/env node
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! offset-scanner.js - Auto-scan Offset Usage
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! Purpose: Scan codebase to find all BinaryCodes usage and extract offsets
// ! Auto-generate: offset-registry.json with collision detection
// ! ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════════════

const SCAN_DIRS = ['src', 'cli.js'];
const EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx'];
const IGNORE_DIRS = ['node_modules', '.git', 'logs', 'test'];
const IGNORE_FILES = ['binary-codes.js', 'binary-error.grammar.js', 'offset-scanner.js'];

// Regex patterns to match BinaryCodes usage
const PATTERNS = [
    // Pattern 1: BinaryCodes.DOMAIN.CATEGORY(offset)
    /BinaryCodes\.([A-Z_]+)\.([A-Z_]+)\((\d+)\)/g,
    
    // Pattern 2: errorCollector.collect(BinaryCodes.DOMAIN.CATEGORY(offset), ...)
    /errorCollector\.(collect|warn|log)\(\s*BinaryCodes\.([A-Z_]+)\.([A-Z_]+)\((\d+)\)/g,
    
    // Pattern 3: report(BinaryCodes.DOMAIN.CATEGORY(offset), ...)
    /report\(\s*BinaryCodes\.([A-Z_]+)\.([A-Z_]+)\((\d+)\)/g
];

// ═══════════════════════════════════════════════════════════════════════════════
// Scanner
// ═══════════════════════════════════════════════════════════════════════════════

class OffsetScanner {
    constructor() {
        this.offsets = new Map(); // key: "DOMAIN.CATEGORY:offset"  value: { files, lines, contexts }
        this.stats = {
            filesScanned: 0,
            offsetsFound: 0,
            collisions: 0,
            domains: new Set(),
            categories: new Set()
        };
    }

    /**
     * Scan entire project
     */
    async scan() {
        console.log('[SCAN] Scanning for offset usage...\n');
        
        for (const target of SCAN_DIRS) {
            const targetPath = path.resolve(PROJECT_ROOT, target);
            
            if (fs.existsSync(targetPath)) {
                const stat = fs.statSync(targetPath);
                
                if (stat.isDirectory()) {
                    await this.scanDirectory(targetPath);
                } else if (stat.isFile()) {
                    await this.scanFile(targetPath);
                }
            }
        }
        
        this.detectCollisions();
        this.printSummary();
        
        return this.generateRegistry();
    }

    /**
     * Scan directory recursively
     */
    async scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                // Skip ignored directories
                if (IGNORE_DIRS.includes(entry.name) || entry.name.startsWith('.')) {
                    continue;
                }
                await this.scanDirectory(fullPath);
            } else if (entry.isFile()) {
                // Check extension
                const ext = path.extname(entry.name);
                if (EXTENSIONS.includes(ext) && !IGNORE_FILES.includes(entry.name)) {
                    await this.scanFile(fullPath);
                }
            }
        }
    }

    /**
     * Scan single file
     */
    async scanFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(PROJECT_ROOT, filePath);
        
        this.stats.filesScanned++;
        
        // Split into lines for context
        const lines = content.split('\n');
        
        for (const pattern of PATTERNS) {
            let match;
            // Reset lastIndex for global regex
            pattern.lastIndex = 0;
            
            while ((match = pattern.exec(content)) !== null) {
                // Extract domain, category, offset based on pattern
                let domain, category, offset;
                
                if (match[0].startsWith('BinaryCodes')) {
                    // Pattern 1: BinaryCodes.DOMAIN.CATEGORY(offset)
                    [, domain, category, offset] = match;
                } else if (match[0].startsWith('errorCollector')) {
                    // Pattern 2: errorCollector.collect(BinaryCodes.DOMAIN.CATEGORY(offset), ...)
                    [, , domain, category, offset] = match;
                } else if (match[0].startsWith('report')) {
                    // Pattern 3: report(BinaryCodes.DOMAIN.CATEGORY(offset), ...)
                    [, domain, category, offset] = match;
                }
                
                if (!domain || !category || !offset) continue;
                
                offset = parseInt(offset, 10);
                
                // Find line number
                const position = match.index;
                const lineNumber = content.substring(0, position).split('\n').length;
                const lineContent = lines[lineNumber - 1]?.trim() || '';
                
                // Store offset usage
                const key = `${domain}.${category}:${offset}`;
                
                if (!this.offsets.has(key)) {
                    this.offsets.set(key, {
                        domain,
                        category,
                        offset,
                        files: [],
                        lines: [],
                        contexts: []
                    });
                    this.stats.offsetsFound++;
                }
                
                const entry = this.offsets.get(key);
                entry.files.push(relativePath);
                entry.lines.push(lineNumber);
                entry.contexts.push(lineContent.substring(0, 80)); // First 80 chars
                
                this.stats.domains.add(domain);
                this.stats.categories.add(category);
            }
        }
    }

    /**
     * Detect collision (same offset used by different domain.category)
     */
    detectCollisions() {
        const offsetMap = new Map(); // offset  [domain.category]
        
        for (const [key, data] of this.offsets.entries()) {
            const offset = data.offset;
            
            if (!offsetMap.has(offset)) {
                offsetMap.set(offset, []);
            }
            
            offsetMap.get(offset).push(`${data.domain}.${data.category}`);
        }
        
        // Find collisions
        for (const [offset, pairs] of offsetMap.entries()) {
            if (pairs.length > 1) {
                this.stats.collisions++;
                console.warn(`[WARNING] Collision detected at offset ${offset}: ${pairs.join(', ')}`);
            }
        }
    }

    /**
     * Print summary
     */
    printSummary() {
        console.log('\n' + '═'.repeat(70));
        console.log('[SUMMARY] OFFSET SCAN SUMMARY');
        console.log('═'.repeat(70));
        console.log(`Files Scanned:     ${this.stats.filesScanned}`);
        console.log(`Offsets Found:     ${this.stats.offsetsFound}`);
        console.log(`Unique Domains:    ${this.stats.domains.size} (${Array.from(this.stats.domains).join(', ')})`);
        console.log(`Unique Categories: ${this.stats.categories.size}`);
        console.log(`Collisions:        ${this.stats.collisions} ${this.stats.collisions > 0 ? '[WARNING]' : '[OK]'}`);
        console.log('═'.repeat(70));
    }

    /**
     * Generate registry JSON
     */
    generateRegistry() {
        const registry = {
            version: '1.0.0',
            generated: new Date().toISOString(),
            description: 'Auto-generated offset registry - DO NOT EDIT MANUALLY',
            stats: {
                filesScanned: this.stats.filesScanned,
                offsetsFound: this.stats.offsetsFound,
                collisions: this.stats.collisions,
                domains: Array.from(this.stats.domains).sort(),
                categories: Array.from(this.stats.categories).sort()
            },
            offsets: {}
        };
        
        // Group by domain.category
        const grouped = new Map();
        
        for (const [key, data] of this.offsets.entries()) {
            const groupKey = `${data.domain}.${data.category}`;
            
            if (!grouped.has(groupKey)) {
                grouped.set(groupKey, []);
            }
            
            grouped.get(groupKey).push({
                offset: data.offset,
                files: [...new Set(data.files)], // Deduplicate
                count: data.files.length,
                firstSeen: data.contexts[0]
            });
        }
        
        // Sort and format
        for (const [groupKey, offsets] of grouped.entries()) {
            registry.offsets[groupKey] = offsets.sort((a, b) => a.offset - b.offset);
        }
        
        return registry;
    }

    /**
     * Save registry to file
     */
    saveRegistry(registry) {
        const outputPath = path.resolve(__dirname, 'offset-registry.json');
        fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2), 'utf8');
        console.log(`\n[SUCCESS] Registry saved: ${path.relative(PROJECT_ROOT, outputPath)}`);
        return outputPath;
    }

    /**
     * Generate Markdown report
     */
    generateMarkdown(registry) {
        let md = '# Offset Registry\n\n';
        md += `**Generated:** ${registry.generated}  \n`;
        md += `**Version:** ${registry.version}  \n\n`;
        
        md += '## Statistics\n\n';
        md += `- Files Scanned: ${registry.stats.filesScanned}\n`;
        md += `- Offsets Found: ${registry.stats.offsetsFound}\n`;
        md += `- Collisions: ${registry.stats.collisions} ${registry.stats.collisions > 0 ? '[WARNING]' : '[OK]'}\n`;
        md += `- Domains: ${registry.stats.domains.join(', ')}\n\n`;
        
        md += '## Offset Usage\n\n';
        
        for (const [groupKey, offsets] of Object.entries(registry.offsets)) {
            md += `### ${groupKey}\n\n`;
            md += '| Offset | Count | Files | Context |\n';
            md += '|--------|-------|-------|----------|\n';
            
            for (const entry of offsets) {
                const files = entry.files.map(f => `\`${f}\``).join(', ');
                const context = entry.firstSeen.replace(/\|/g, '\\|');
                md += `| ${entry.offset} | ${entry.count} | ${files} | ${context} |\n`;
            }
            
            md += '\n';
        }
        
        return md;
    }

    /**
     * Save Markdown report
     */
    saveMarkdown(registry) {
        const markdown = this.generateMarkdown(registry);
        const outputPath = path.resolve(PROJECT_ROOT, 'docs/OFFSET_REGISTRY.md');
        
        // Create docs directory if not exists
        const docsDir = path.dirname(outputPath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, markdown, 'utf8');
        console.log(`[SUCCESS] Markdown saved: ${path.relative(PROJECT_ROOT, outputPath)}`);
        return outputPath;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper: Find Available Offsets
// ═══════════════════════════════════════════════════════════════════════════════

function findAvailableOffsets(registry, domain, category, count = 10) {
    const groupKey = `${domain}.${category}`;
    const used = new Set();
    
    if (registry.offsets[groupKey]) {
        for (const entry of registry.offsets[groupKey]) {
            used.add(entry.offset);
        }
    }
    
    const available = [];
    let offset = 1000;
    
    while (available.length < count && offset < 65535) {
        if (!used.has(offset)) {
            available.push(offset);
        }
        offset++;
    }
    
    return available;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    const scanner = new OffsetScanner();
    
    if (command === 'scan' || !command) {
        // Scan and generate registry
        const registry = await scanner.scan();
        scanner.saveRegistry(registry);
        scanner.saveMarkdown(registry);
        
    } else if (command === 'find') {
        // Find available offsets
        const domain = args[1];
        const category = args[2];
        
        if (!domain || !category) {
            console.error('Usage: node offset-scanner.js find <DOMAIN> <CATEGORY>');
            process.exit(1);
        }
        
        // Load existing registry
        const registryPath = path.resolve(__dirname, 'offset-registry.json');
        if (!fs.existsSync(registryPath)) {
            console.error('Registry not found. Run "scan" first.');
            process.exit(1);
        }
        
        const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        const available = findAvailableOffsets(registry, domain, category, 10);
        
        console.log(`\n[INFO] Available offsets for ${domain}.${category}:\n`);
        console.log(available.join(', '));
        
    } else {
        console.log('Usage:');
        console.log('  node offset-scanner.js scan          # Scan codebase and generate registry');
        console.log('  node offset-scanner.js find <DOMAIN> <CATEGORY>  # Find available offsets');
    }
}

// Run
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/offset-scanner.js') || 
    process.argv[1].endsWith('offset-scanner.js')) {
    main().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

export { OffsetScanner, findAvailableOffsets };
