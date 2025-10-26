#!/usr/bin/env node
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! migrate-to-universal.js - Migrate reportError to Universal Reporter
// ! ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Parse arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

// Files to migrate
const FILES_TO_MIGRATE = [
    'src/security/security-manager.js',
    'src/security/security-config.js',
    'src/security/security-middleware.js',
    'src/rules/validator.js',
    'src/grammars/shared/binary-scout.js',
    'src/grammars/shared/binary-prophet.js',
    'src/grammars/shared/enhanced-binary-parser.js',
    'src/grammars/shared/tokenizer-helper.js'
];

function migrateFile(filePath, dryRun) {
    const fullPath = path.resolve(PROJECT_ROOT, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  Skip: ${filePath} (not found)`);
        return { changed: false };
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let changes = 0;
    
    // Step 1: Replace import
    const oldImport = `import { reportError } from '../error-handler/binary-reporter.js';`;
    const newImport = `import { report } from '../error-handler/universal-reporter.js';`;
    
    if (content.includes(oldImport)) {
        content = content.replace(oldImport, newImport);
        changes++;
        console.log(`   ${dryRun ? '📝' : '✏️ '} Updated import`);
    }
    
    // Handle different import paths
    const oldImport2 = `import { reportError } from './error-handler/binary-reporter.js';`;
    const newImport2 = `import { report } from './error-handler/universal-reporter.js';`;
    
    if (content.includes(oldImport2)) {
        content = content.replace(oldImport2, newImport2);
        changes++;
        console.log(`   ${dryRun ? '📝' : '✏️ '} Updated import (root level)`);
    }
    
    // Step 2: Replace reportError() calls
    // Pattern: reportError(BinaryCodes.DOMAIN.CATEGORY(offset), { ... })
    const pattern = /reportError\((BinaryCodes\.[A-Z_]+\.[A-Z_]+\([^)]+\)),\s*\{/g;
    
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
        content = content.replace(pattern, 'report($1, {');
        changes += matches.length;
        console.log(`   ${dryRun ? '📝' : '✏️ '} Replaced ${matches.length} reportError() calls`);
    }
    
    if (changes > 0) {
        if (!dryRun) {
            fs.writeFileSync(fullPath, content, 'utf8');
        } else {
            // Show preview of first change
            const lines = content.split('\n');
            const originalLines = originalContent.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i] !== originalLines[i]) {
                    console.log(`   📄 Line ${i + 1}:`);
                    console.log(`      - ${originalLines[i].trim()}`);
                    console.log(`      + ${lines[i].trim()}`);
                    break;
                }
            }
        }
        return { changed: true, changes };
    }
    
    return { changed: false };
}

console.log(dryRun ? '🔍 DRY RUN - No files will be modified' : '🔄 Migrating to Universal Reporter...');
console.log('═'.repeat(70));
console.log();

let totalFiles = 0;
let totalChanges = 0;

for (const file of FILES_TO_MIGRATE) {
    console.log(`📝 ${file}`);
    const result = migrateFile(file, dryRun);
    
    if (result.changed) {
        totalFiles++;
        totalChanges += result.changes;
        console.log(`   ${dryRun ? '📊' : '✅'} ${result.changes} changes detected\n`);
    } else {
        console.log(`   ⏭️  No changes needed\n`);
    }
}

console.log('═'.repeat(70));
console.log(`${dryRun ? '📊 SUMMARY (DRY RUN)' : '✅ Migration Complete!'}`);
console.log(`   Files to Update: ${totalFiles}`);
console.log(`   Total Changes: ${totalChanges}`);
console.log('═'.repeat(70));

if (dryRun) {
    console.log('\n💡 To apply changes, run with --apply flag:');
    console.log('   node src/error-handler/migrate-to-universal.js --apply');
} else {
    console.log('\n💡 Next steps:');
    console.log('   1. Run: node src/error-handler/offset-scanner.js scan');
    console.log('   2. Test the application');
}
