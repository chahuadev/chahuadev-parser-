#!/usr/bin/env node
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! fix-collisions.js - Auto-fix Offset Collisions
// ! ═══════════════════════════════════════════════════════════════════════════════
// ! Purpose: Analyze collisions and suggest/apply fixes
// ! ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// ═══════════════════════════════════════════════════════════════════════════════
// Load Registry
// ═══════════════════════════════════════════════════════════════════════════════

const registryPath = path.resolve(__dirname, 'offset-registry.json');
if (!fs.existsSync(registryPath)) {
    console.error('❌ Registry not found. Run "node offset-scanner.js scan" first.');
    process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// ═══════════════════════════════════════════════════════════════════════════════
// Analyze Collisions
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeCollisions() {
    const offsetMap = new Map(); // offset → [{ domain, category, files, count }]
    
    // Group by offset
    for (const [groupKey, offsets] of Object.entries(registry.offsets)) {
        const [domain, category] = groupKey.split('.');
        
        for (const entry of offsets) {
            const offset = entry.offset;
            
            if (!offsetMap.has(offset)) {
                offsetMap.set(offset, []);
            }
            
            offsetMap.get(offset).push({
                domain,
                category,
                groupKey,
                files: entry.files,
                count: entry.count,
                firstSeen: entry.firstSeen
            });
        }
    }
    
    // Find collisions (offset used by multiple domain.category)
    const collisions = [];
    
    for (const [offset, groups] of offsetMap.entries()) {
        if (groups.length > 1) {
            collisions.push({
                offset,
                groups,
                severity: groups.length // More groups = higher severity
            });
        }
    }
    
    // Sort by severity (descending)
    collisions.sort((a, b) => b.severity - a.severity);
    
    return collisions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Find Available Offsets
// ═══════════════════════════════════════════════════════════════════════════════

function findAvailable(domain, category, count = 1) {
    const groupKey = `${domain}.${category}`;
    const used = new Set();
    
    // Collect all used offsets for this domain.category
    if (registry.offsets[groupKey]) {
        for (const entry of registry.offsets[groupKey]) {
            used.add(entry.offset);
        }
    }
    
    // Determine range based on domain
    let startOffset = 1000;
    let endOffset = 65535;
    
    // CLI uses 15000+ range
    if (domain === 'CLI') {
        startOffset = 15000;
        endOffset = 15999;
    }
    // Library code uses 1000-14999
    else {
        startOffset = 1000;
        endOffset = 14999;
    }
    
    const available = [];
    let offset = startOffset;
    
    while (available.length < count && offset <= endOffset) {
        if (!used.has(offset)) {
            available.push(offset);
        }
        offset++;
    }
    
    return available;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Generate Fix Plan
// ═══════════════════════════════════════════════════════════════════════════════

function generateFixPlan(collisions) {
    const plan = [];
    const globalUsedOffsets = new Set(); // Track ALL offsets globally across all domain.category
    
    // First, collect all existing offsets that we're keeping
    for (const collision of collisions) {
        const { offset, groups } = collision;
        const [keepGroup] = groups;
        globalUsedOffsets.add(offset); // Keep this offset (it's being kept)
    }
    
    // Also collect all offsets currently in use (from registry)
    for (const [groupKey, offsets] of Object.entries(registry.offsets)) {
        for (const entry of offsets) {
            globalUsedOffsets.add(entry.offset);
        }
    }
    
    for (const collision of collisions) {
        const { offset, groups } = collision;
        
        // Strategy: Keep the first group (usually the "real" one), reassign others
        const [keepGroup, ...reassignGroups] = groups;
        
        console.log(`\n⚠️  Collision at offset ${offset}:`);
        console.log(`   Keep: ${keepGroup.groupKey} (${keepGroup.files.join(', ')})`);
        
        for (const group of reassignGroups) {
            const groupKey = `${group.domain}.${group.category}`;
            
            // Find available offset that is NOT used globally
            const available = findAvailable(group.domain, group.category, 1000); // Get many candidates
            
            if (available.length === 0) {
                console.error(`   ❌ No available offsets for ${groupKey}!`);
                continue;
            }
            
            // Find first unused offset globally
            let newOffset = null;
            for (const candidate of available) {
                if (!globalUsedOffsets.has(candidate)) {
                    newOffset = candidate;
                    globalUsedOffsets.add(candidate); // Mark as used globally
                    break;
                }
            }
            
            if (!newOffset) {
                console.error(`   ❌ Ran out of available offsets for ${groupKey}!`);
                continue;
            }
            
            console.log(`   Reassign: ${groupKey} → ${newOffset}`);
            console.log(`      Files: ${group.files.join(', ')}`);
            console.log(`      Context: ${group.firstSeen.substring(0, 60)}...`);
            
            plan.push({
                oldOffset: offset,
                newOffset: newOffset,
                domain: group.domain,
                category: group.category,
                groupKey: groupKey,
                files: group.files,
                pattern: `BinaryCodes.${group.domain}.${group.category}(${offset})`
            });
        }
    }
    
    return plan;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Apply Fixes
// ═══════════════════════════════════════════════════════════════════════════════

function applyFixes(plan, dryRun = true) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(dryRun ? '🔍 DRY RUN - No files will be modified' : '✏️  APPLYING FIXES');
    console.log('═'.repeat(70));
    
    const fixes = [];
    
    for (const fix of plan) {
        const { oldOffset, newOffset, domain, category, files } = fix;
        
        for (const relativeFile of files) {
            const filePath = path.resolve(PROJECT_ROOT, relativeFile);
            
            if (!fs.existsSync(filePath)) {
                console.error(`   ❌ File not found: ${relativeFile}`);
                continue;
            }
            
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace pattern: BinaryCodes.DOMAIN.CATEGORY(oldOffset)
            const searchPattern = `BinaryCodes.${domain}.${category}(${oldOffset})`;
            const replacePattern = `BinaryCodes.${domain}.${category}(${newOffset})`;
            
            // Count occurrences
            const regex = new RegExp(searchPattern.replace(/[()]/g, '\\$&'), 'g');
            const matches = content.match(regex);
            const count = matches ? matches.length : 0;
            
            if (count === 0) {
                console.log(`   ⚠️  No matches in ${relativeFile}`);
                continue;
            }
            
            if (!dryRun) {
                // Apply replacement
                content = content.replace(regex, replacePattern);
                fs.writeFileSync(filePath, content, 'utf8');
            }
            
            console.log(`   ${dryRun ? '📝' : '✅'} ${relativeFile}: ${oldOffset} → ${newOffset} (${count} occurrences)`);
            
            fixes.push({
                file: relativeFile,
                oldOffset,
                newOffset,
                groupKey: `${domain}.${category}`,
                count
            });
        }
    }
    
    return fixes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const applyFlag = args.includes('--apply');
    
    console.log('🔍 Analyzing collisions...\n');
    
    const collisions = analyzeCollisions();
    
    if (collisions.length === 0) {
        console.log('✅ No collisions found! Registry is clean.');
        return;
    }
    
    console.log(`Found ${collisions.length} collision${collisions.length > 1 ? 's' : ''}:\n`);
    
    // Generate fix plan
    const plan = generateFixPlan(collisions);
    
    if (plan.length === 0) {
        console.log('\n❌ Could not generate fix plan.');
        return;
    }
    
    // Apply or dry-run
    const dryRun = !applyFlag;
    const fixes = applyFixes(plan, dryRun);
    
    // Summary
    console.log(`\n${'═'.repeat(70)}`);
    console.log('📊 SUMMARY');
    console.log('═'.repeat(70));
    console.log(`Collisions Found:  ${collisions.length}`);
    console.log(`Fixes Generated:   ${plan.length}`);
    console.log(`Files Modified:    ${new Set(fixes.map(f => f.file)).size}`);
    console.log(`Total Changes:     ${fixes.reduce((sum, f) => sum + f.count, 0)}`);
    console.log('═'.repeat(70));
    
    if (dryRun) {
        console.log('\n💡 To apply fixes, run with --apply flag:');
        console.log('   node src/error-handler/fix-collisions.js --apply');
    } else {
        console.log('\n✅ Fixes applied! Run scanner again to verify:');
        console.log('   node src/error-handler/offset-scanner.js scan');
    }
}

// Run
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('/fix-collisions.js') || 
    process.argv[1].endsWith('fix-collisions.js')) {
    main().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

export { analyzeCollisions, generateFixPlan, applyFixes };
