#!/usr/bin/env node
/**
 * Add Language Script
 * ดึง grammar จาก external source และแปลงเป็น Chahuadev format
 * 
 * Usage:
 *   node scripts/add-language.js python
 *   node scripts/add-language.js go rust cpp
 *   node scripts/add-language.js --all
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { convertTreeSitterGrammar, saveGrammarFile } from './grammar-converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, './grammar-registry.json');
const EXTERNAL_DIR = path.join(__dirname, '../../external');
const OUTPUT_DIR = path.join(__dirname, '../grammars');

// สร้าง directories ถ้ายังไม่มี
if (!fs.existsSync(EXTERNAL_DIR)) {
    fs.mkdirSync(EXTERNAL_DIR, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * ดาวน์โหลดไฟล์จาก URL
 */
function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                return downloadFile(response.headers.location).then(resolve).catch(reject);
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                return;
            }
            
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * เพิ่มภาษาใหม่
 */
async function addLanguage(languageName) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Adding Language: ${languageName.toUpperCase()}`);
    console.log('='.repeat(70));
    
    try {
        // 1. โหลด registry
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        
        if (!registry.languages[languageName]) {
            console.error(` Language '${languageName}' not found in registry`);
            console.log(`\nAvailable languages:`);
            Object.keys(registry.languages).forEach(lang => {
                const status = registry.languages[lang].enabled ? '' : '';
                console.log(`  ${status} ${lang}`);
            });
            return false;
        }
        
        const langConfig = registry.languages[languageName];
        
        if (!langConfig.enabled) {
            console.log(` Language '${languageName}' is disabled in registry`);
            return false;
        }
        
        console.log(`Source: ${langConfig.source}`);
        console.log(`Repo: ${langConfig.repo}`);
        console.log(`Version: ${langConfig.version}`);
        
        // 2. ดาวน์โหลด grammar
        console.log(`\nDownloading grammar...`);
        const grammarJson = await downloadFile(langConfig.grammarUrl);
        
        // 3. บันทึกไฟล์ต้นฉบับ
        const externalPath = path.join(EXTERNAL_DIR, `${languageName}.json`);
        fs.writeFileSync(externalPath, grammarJson, 'utf8');
        console.log(` Saved external grammar: ${externalPath}`);
        
        // 4. Parse JSON
        const treeSitterGrammar = JSON.parse(grammarJson);
        
        // 5. แปลงเป็น Chahuadev format (metadata only - no binary values)
        console.log(`\nConverting to Chahuadev format...`);
        const chahuaGrammar = convertTreeSitterGrammar(treeSitterGrammar, languageName);
        
        // 6. บันทึกเป็น .grammar.js (binary will be generated at runtime)
        const outputFile = saveGrammarFile(chahuaGrammar, languageName, OUTPUT_DIR);
        
        // 7. Update registry
        langConfig.lastUpdated = new Date().toISOString();
        langConfig.status = 'ready';
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');
        
        console.log(`\n Successfully added ${languageName}`);
        console.log(`  External: ${externalPath}`);
        console.log(`  Grammar: ${outputFile}`);
        
        return true;
        
    } catch (error) {
        console.error(` Failed to add ${languageName}:`, error.message);
        return false;
    }
}

/**
 * เพิ่มหลายภาษาพร้อมกัน
 */
async function addMultipleLanguages(languages) {
    const results = {};
    
    for (const lang of languages) {
        results[lang] = await addLanguage(lang);
        // Delay เล็กน้อยเพื่อไม่ให้ rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // สรุปผล
    console.log(`\n${'='.repeat(70)}`);
    console.log('SUMMARY');
    console.log('='.repeat(70));
    
    const successful = Object.entries(results).filter(([_, success]) => success);
    const failed = Object.entries(results).filter(([_, success]) => !success);
    
    if (successful.length > 0) {
        console.log(`\n Successfully added (${successful.length}):`);
        successful.forEach(([lang]) => console.log(`  - ${lang}`));
    }
    
    if (failed.length > 0) {
        console.log(`\n Failed (${failed.length}):`);
        failed.forEach(([lang]) => console.log(`  - ${lang}`));
    }
    
    console.log(`\nTotal: ${successful.length}/${languages.length} languages added`);
}

/**
 * Main
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help')) {
        console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                   ADD LANGUAGE SCRIPT                             ║
╚═══════════════════════════════════════════════════════════════════╝

Usage:
  node scripts/add-language.js <language> [language2 language3 ...]
  node scripts/add-language.js --all
  node scripts/add-language.js --list

Examples:
  node scripts/add-language.js python
  node scripts/add-language.js go rust cpp
  node scripts/add-language.js --all

Options:
  --all     Add all enabled languages from registry
  --list    List available languages
  --help    Show this help message
`);
        return;
    }
    
    // List languages
    if (args.includes('--list')) {
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        console.log(`\nAvailable languages in registry:\n`);
        
        Object.entries(registry.languages).forEach(([lang, config]) => {
            const status = config.enabled ? ' Enabled ' : ' Disabled';
            const state = config.status || 'pending';
            console.log(`  ${status} | ${lang.padEnd(15)} | ${state.padEnd(10)} | ${config.repo}`);
        });
        return;
    }
    
    // Add all languages
    if (args.includes('--all')) {
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        const enabledLanguages = Object.entries(registry.languages)
            .filter(([_, config]) => config.enabled)
            .map(([lang]) => lang);
        
        console.log(`\nAdding ${enabledLanguages.length} languages...`);
        await addMultipleLanguages(enabledLanguages);
        return;
    }
    
    // Add specific languages
    await addMultipleLanguages(args);
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
