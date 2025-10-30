<div align="center"><div align="center"><div align="center"><div align="center"><div align="center"><div align="center"><div align="center">



# Chahuadev Sentinel



**FROM CHAOS TO CODE**# Chahuadev Sentinel



[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()**FROM CHAOS TO CODE**# Chahuadev Sentinel



> Code analysis tool using binary instead of strings - NOT for speed, but for memory efficiency  

> Don't like it? Fork it - MIT License

[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)

</div>

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()**FROM CHAOS TO CODE**# Chahuadev Sentinel

## What It Does (Straight Talk)



### 1. Binary Error Reporting

**Problem:** String error codes (`"ERR_SECURITY_5001"`) use 20-50 bytes each  > Code analysis tool using binary instead of strings - because it's faster  

**Solution:** Use 64-bit integers instead - only 8 bytes (60-80% smaller)

> Don't like it? Fork it - MIT License

```javascript

// Old way (string) - 20-50 bytes per error[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)

if (errorCode === "ERR_SECURITY_5001") { ... }

</div>

// New way (binary) - 8 bytes per error

const targetCode = BinaryCodes.SECURITY.PERMISSION(5001);[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

if (errorCode === targetCode) { ... }

---

// Or use pattern matching

if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION')) { ... }[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()**FROM CHAOS TO CODE**# Chahuadev Sentinel  <img src="./logo.png" alt="Chahuadev Sentinel" width="150"/>

```

## What It Does (Straight Talk)

**Truth:** Binary is NOT faster than strings in JavaScript (V8 optimizes strings heavily)  

**Why we use it:** **Memory efficiency** - 60-80% smaller, structured data, type safety



### 2. Auto-Capture Context### 1. Binary Error Reporting

**Problem:** Manual context writing is error-prone  

**Solution:** Extract context from stack traces automatically**Problem:** String error codes (`"ERR_SECURITY_5001"`) are slow to compare  > Code analysis tool using binary instead of strings - because it's faster  



```javascript**Solution:** Use 64-bit integers instead - instant comparison

// Old way - manual (error-prone)

reportError(code, {> Don't like it? Fork it - MIT License

    file: 'auth.js',      // might typo

    method: 'login',      // might forget```javascript

    line: 42              // might be wrong

});// Old way (string) - slow comparison[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)



// New way - auto-captureif (errorCode === "ERR_SECURITY_5001") { ... }

report(code, { error }); // extracts everything from stack trace

```</div>



**Don't like it?** Write context manually - system doesn't forbid it:// New way (binary) - instant comparison

```javascript

report(code, { file: 'x.js', method: 'y', line: 10, error });const targetCode = BinaryCodes.SECURITY.PERMISSION(5001);[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

```

if (errorCode === targetCode) { ... }

### 3. Grammar-Based Tokenizer

**Problem:** Hardcoded keywords in code = hard to maintain  ---

**Solution:** Store in grammar files - change one file, done

// Or use pattern matching

```javascript

// Hardcoded (hard to maintain)if (matchBinaryCode(errorCode, grammar, 'SECURITY', 'PERMISSION')) { ... }[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()**FROM CHAOS TO CODE**#  Chahuadev Sentinel

const keywords = { if: true, const: true, async: true };

```

// Grammar-based (easy to maintain)

const keywords = grammar.keywords; // from javascript.grammar.js## What It Does (Straight Talk)

```

**Truth:** You never write `0x0001000400001389n` by hand - you use `BinaryCodes` API  

**Don't like it?** Hardcode it - just means editing multiple places when changes needed

**Don't like it?** Keep using strings - slower but fine for small codebases

### 4. Runtime Binary Generation

**Problem:** Build-time generation = rebuild every change  

**Solution:** Runtime generation - change grammar, use immediately

### 2. Auto-Capture Context### 1. Binary Error Reporting

```javascript

// No build needed**Problem:** Manual context writing is error-prone  

const binary = generateBinary('if', 'keyword'); // generates on-the-fly

```**Solution:** Extract context from stack traces automatically**Problem:** String error codes (`"ERR_SECURITY_5001"`) are slow to compare  > Code analysis tool using binary instead of strings - because it's faster  



**Don't like it?** Pre-generate and commit - faster but harder to maintain



---```javascript**Solution:** Use 64-bit integers instead - instant comparison



## The Truth About Binary Performance// Old way - manual (error-prone)



**Honest Benchmark Results (40,000 errors):**reportError(code, {> Don't like it? Fork it - MIT License



| Method | Time | Winner |    file: 'auth.js',      // might typo

|--------|------|--------|

| String filtering | 5.2ms | Fastest |    method: 'login',      // might forget```javascript

| Bitwise + Grammar lookup | 13.3ms | Medium |

| Raw Bitwise (pure) | 22.7ms | Slowest |    line: 42              // might be wrong



**Why String is Faster in JavaScript:**});// Old way (string) - slow comparison[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)# Chahuadev Sentinel

- V8 engine heavily optimizes string operations

- `startsWith()` and `includes()` are native C++ code

- String comparison is CPU-native, no BigInt overhead

- BigInt shift/mask operations have overhead in JavaScript// New way - auto-captureif (errorCode === "ERR_SECURITY_5001") { ... }



**Why We Still Use Binary:**report(code, { error }); // extracts everything from stack trace



### Primary Reason: Memory Efficiency```</div>

```

String error code: "ERR_SECURITY_PERMISSION_5001"

  → 28 characters × 2 bytes (UTF-16) = 56 bytes

  → Plus object overhead = ~70-80 bytes**Don't like it?** Write context manually - system doesn't forbid it:// New way (binary) - instant comparison



Binary error code: 4503874773783433n```javascript

  → 8 bytes (64-bit integer)

  → 60-80% memory savingsreport(code, { file: 'x.js', method: 'y', line: 10, error });const targetCode = BinaryCodes.SECURITY.PERMISSION(5001);[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

```

```

**In a system with 1 million errors:**

- String codes: ~70 MBif (errorCode === targetCode) { ... }

- Binary codes: ~8 MB

- **Savings: 62 MB (88% reduction)**### 3. Grammar-Based Tokenizer



### Secondary Benefits:**Problem:** Hardcoded keywords in code = hard to maintain  ---



1. **Structured Data****Solution:** Store in grammar files - change one file, done

   ```javascript

   // Binary encodes structure// Or use pattern matching

   64-bit: [Domain 16][Category 16][Severity 8][Source 8][Offset 16]

   ```javascript

   // Extract instantly

   const domain = extractDomain(errorCode);   // SECURITY// Hardcoded (hard to maintain)if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION')) { ... }[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()**The Philosophy: FROM CHAOS TO CODE**

   const category = extractCategory(errorCode); // PERMISSION

   const severity = extractSeverity(errorCode); // ERRORconst keywords = { if: true, const: true, async: true };

   ```

```

2. **Type Safety**

   - No string parsing errors// Grammar-based (easy to maintain)

   - No typos ("ERR_SECURTY" vs "ERR_SECURITY")

   - Compile-time validationconst keywords = grammar.keywords; // from javascript.grammar.js## What It Does (Straight Talk)



3. **Cross-Language Compatibility**```

   - C++/Rust/Go get MASSIVE speedups with bitwise

   - Same binary format across all languages**Truth:** You never write `0x0001000400001389n` by hand - you use `BinaryCodes` API  

   - No string encoding issues

**Don't like it?** Hardcode it - just means editing multiple places when changes needed

4. **Collision Detection**

   - Offset registry prevents duplicate codes**Don't like it?** Keep using strings - slower but fine for small codebases

   - Automated conflict detection

   - Structured error code management### 4. Runtime Binary Generation



---**Problem:** Build-time generation = rebuild every change  



## When to Use Binary vs String**Solution:** Runtime generation - change grammar, use immediately



### Use Binary Error Codes When:### 2. Auto-Capture Context### 1. Binary Error Reporting

- Memory is constrained (embedded systems, large-scale logging)

- You need structured error data (domain/category/severity)```javascript

- Working with multiple languages (C++, Rust, Go, JavaScript)

- Error code collision detection is important// No build needed**Problem:** Manual context writing is error-prone  

- Type safety matters more than readability

const binary = generateBinary('if', 'keyword'); // generates on-the-fly

### Use String Error Codes When:

- Working purely in JavaScript/Node.js```**Solution:** Extract context from stack traces automatically**Problem:** String error codes (`"ERR_SECURITY_5001"`) are slow to compare  > Code analysis tool ที่ใช้เลขฐานสองแทน string เพราะเร็วกว่า  [![Version](https://img.shields.io/badge/version-2.0.0--beta-blue?style=flat-square)](https://github.com/chahuadev-com/Chahuadev-Sentinel)

- Speed is the only concern

- Team prefers human-readable codes

- Memory usage is not a constraint

- Quick prototyping**Don't like it?** Pre-generate and commit - faster but harder to maintain



---



## The 3 Pillars---```javascript**Solution:** Use 64-bit integers instead - instant comparison



```

1. BLANK PAPER     → No hardcoding - everything from config/grammar files

2. BINARY FIRST    → Numbers for memory efficiency (not speed in JS)## The Real Power: Instant Filtering & Categorization// Old way - manual (error-prone)

3. ZERO FALLBACK   → Explicit errors - no silent failures

```



**Note:** If you disagree with these principles, this project isn't for you  This is where binary codes shine - **instant pattern matching** instead of slow string operations.reportError(code, {> ถ้าไม่ชอบก็ fork ไปแก้ได้ - MIT License

Use ESLint, Prettier, or other established tools instead



---

### String-Based Filtering (Traditional Way)    file: 'auth.js',      // might typo

## Quick Start

```javascript

```bash

git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git// Slow: O(n) character comparison for EACH error    method: 'login',      // might forget```javascript

cd Chahuadev-Sentinel

node cli.js --helpconst securityErrors = allErrors.filter(err => 

```

    err.code.startsWith('ERR_SECURITY')  // iterates through "ERR_SECURITY" chars    line: 42              // might be wrong

No `npm install` needed - works out of the box

);

---

});// Old way (string) - slow comparison> Binary-First Code Intelligence Platform  [![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## Core Systems

// Slower: Multiple string operations

### Universal Error Reporting

const criticalSecurityErrors = allErrors.filter(err =>

**What it does:** Report errors with auto-captured file, method, line, column

    err.code.startsWith('ERR_SECURITY') &&   // O(n)

```javascript

import { report } from './src/error-handler/universal-reporter.js';    err.code.includes('CRITICAL')            // O(n*m)// New way - auto-captureif (errorCode === "ERR_SECURITY_5001") { ... }

import BinaryCodes from './src/error-handler/binary-codes.js';

);

report(BinaryCodes.SECURITY.PERMISSION(5001), { error });

// Auto-captures: file, method, line, column, timestamp```report(code, { error }); // extracts everything from stack trace

```



**Performance:** 0.162ms per report

### Binary-Based Filtering (Our Way)```</div>

**Alternative:** If you don't like auto-capture, use manual:

```javascript```javascript

report(code, { file: 'x.js', method: 'y', line: 10, error });

```import { filterByPattern, matchBinaryCode } from './src/error-handler/binary-code-utils.js';



---import { binaryErrorGrammar } from './src/error-handler/binary-error.grammar.js';



### Binary Error System**Don't like it?** Write context manually - system doesn't forbid it:// New way (binary) - instant comparison



**What it does:** Error codes as 64-bit integers instead of strings// Fast: O(1) bitwise comparison for EACH error



**Structure:** `[Domain 16-bit][Category 16-bit][Severity 8-bit][Source 8-bit][Offset 16-bit]`const securityErrors = filterByPattern(allErrors, binaryErrorGrammar, {```javascript



```javascript    domain: 'SECURITY'  // instant bitwise mask check

BinaryCodes.SECURITY.PERMISSION(5001)

// → 4503874773783433 (internal representation)});report(code, { file: 'x.js', method: 'y', line: 10, error });const targetCode = BinaryCodes.SECURITY.PERMISSION(5001);> Where every error speaks in numbers, every token carries meaning[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen?style=flat-square)]()



// But you use it like this:

const code = BinaryCodes.SECURITY.PERMISSION(5001);

if (errorCode === code) { ... }// Still O(1): Multiple bitwise operations```

```

const criticalSecurityErrors = filterByPattern(allErrors, binaryErrorGrammar, {

**Pros:**

- **Memory: 8 bytes vs 70 bytes (88% smaller)** ← Primary reason    domain: 'SECURITY',if (errorCode === targetCode) { ... }

- Structured data (domain/category/severity embedded)

- Type safety (no string parsing)    severity: 'CRITICAL'

- Cross-language compatibility

- Collision detection});### 3. Grammar-Based Tokenizer



**Cons:**

- Harder to read than strings

- Requires decoder// Manual matching - same speed**Problem:** Hardcoded keywords in code = hard to maintain  ---

- **Slower than strings in JavaScript** (but faster in C++/Rust)

if (matchBinaryCode(errorCode, binaryErrorGrammar, 'SECURITY', 'PERMISSION')) {

**Alternative:** If you prefer strings:

```javascript    console.log('This is a SECURITY.PERMISSION error');**Solution:** Store in grammar files - change one file, done

// Create your own wrapper

const ErrorCodes = {}

    SECURITY_PERMISSION: "SEC_PERM_5001"

};```// Or use pattern matching

```



---

### How Bitwise Filtering Works```javascript

### Pattern Matching & Filtering



**What it does:** Filter errors by domain/category/severity

**Binary Code Structure:**// Hardcoded (hard to maintain)if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION')) { ... }

```javascript

import { filterByPattern, matchBinaryCode } from './src/error-handler/binary-code-utils.js';```



// Filter by domain64-bit: [Domain 16][Category 16][Severity 8][Source 8][Offset 16]const keywords = { if: true, const: true, async: true };

const securityErrors = filterByPattern(allErrors, {

    domain: 'SECURITY'Example: 0x0001000400001389

});

         ^^^^ ^^^^ ^^ ^^ ^^^^```

// Filter by domain + category

const permErrors = filterByPattern(allErrors, {         │    │    │  │  └─ Offset: 5001

    domain: 'SECURITY',

    category: 'PERMISSION'         │    │    │  └──── Source: 1// Grammar-based (easy to maintain)

});

         │    │    └─────── Severity: 16 (ERROR)

// Manual matching

if (matchBinaryCode(errorCode, 'SECURITY', 'PERMISSION')) {         │    └──────────── Category: 4 (PERMISSION)const keywords = grammar.keywords; // from javascript.grammar.js## สิ่งที่ทำ (ตรงๆ)

    console.log('This is a SECURITY.PERMISSION error');

}         └───────────────── Domain: 1 (SECURITY)

```

``````

**Performance Note:** In JavaScript, this is slower than string filtering  

**Use because:** Structured filtering, not speed



---**Instant Domain Check:****Truth:** You never write `0x0001000400001389n` by hand - you use `BinaryCodes` API  



### Smart Grammar Index```javascript



**What it does:** Load multi-language grammars with binary tokenization// Extract domain using bitwise shift + mask (CPU single instruction)**Don't like it?** Hardcode it - just means editing multiple places when changes needed



```javascriptconst domain = (errorCode >> 48n) & 0xFFFFn;  // O(1)

const index = new SmartGrammarIndex('javascript');

await index.loadGrammar();**Don't like it?** Keep using strings - slower but fine for small codebases[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)> **Pure Binary Code Analysis** - Revolutionary error reporting system with auto-context capture and 64-bit binary error codes



index.getBinary('if', 'keyword');         // → 0x01c7// Compare (integer comparison - instant)

index.identifyToken('async');             // → { type, category, binary }

```if (domain === SECURITY_DOMAIN) { ... }  // O(1)### 4. Runtime Binary Generation



**Supports:** 14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)



**Pros:**// vs String comparison**Problem:** Build-time generation = rebuild every change  

- Auto-detect token types

- Runtime binary generationif (errorCode.startsWith('ERR_SECURITY')) { ... }  // O(n) - iterates chars

- Smart caching (126 items)

```**Solution:** Runtime generation - change grammar, use immediately

**Alternative:** For single language, hardcoding is simpler:

```javascript

const jsKeywords = ['if', 'const', 'async', 'function'];

```### Performance Comparison### 2. Auto-Capture Context### 1. Error Reporting แบบ Binary



---



### Offset Registry| Operation | String-Based | Binary-Based | Speedup |```javascript



**What it does:** Prevent binary code collisions|-----------|--------------|--------------|---------|



```bash| Single comparison | O(n) | O(1) | ~10-50x |// No build needed**Problem:** Manual context writing is error-prone  

node tools/offset-scanner.js scan    # scan all offsets

node tools/fix-collisions.js --apply # fix duplicates| Filter 1,000 errors | O(n*m) | O(n) | ~100x |

```

| Filter + categorize | O(n*m*k) | O(n) | ~1000x |const binary = generateBinary('if', 'keyword'); // generates on-the-fly

**Output:** 

- `offset-registry.json` - database

- `docs/OFFSET_REGISTRY.md` - documentation

Where:```**Solution:** Extract context from stack traces automatically**ปัญหา:** Error code แบบ string (`"ERR_SECURITY_5001"`) ช้า เปรียบเทียบยาก  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Alternative:** Not using binary system? Don't need this tool

- n = number of errors

---

- m = average string length

## Project Structure

- k = number of filter criteria

```

Chahuadev-Sentinel/**Don't like it?** Pre-generate and commit - faster but harder to maintain

├── src/

│   ├── error-handler/### Real-World Example

│   │   ├── universal-reporter.js      # Auto-capture API

│   │   ├── binary-codes.js            # 64-bit error codes

│   │   ├── binary-code-utils.js       # Bitwise operations

│   │   └── context-capture.js         # Stack trace parser```javascript

│   │

│   ├── grammars/shared/// Scenario: Find all critical security permission errors in 10,000 error logs---```javascript**แก้ไข:** ใช้ตัวเลข 64-bit (`0x0001000400001389`) แทน - เร็วกว่า instant

│   │   ├── grammar-index.js           # Multi-language loader

│   │   ├── binary-generator.js        # Runtime binary gen

│   │   └── grammars/                  # 14 languages

│   │// String-based (slow)

│   └── security/

│       └── security-manager.js        # Security layerconst results = logs.filter(log => 

│

├── tools/    log.errorCode.startsWith('ERR_SECURITY') &&      // ~12 char comparisons## The 3 Pillars// Old way - manual (error-prone)

│   ├── offset-scanner.js              # Scan offsets

│   └── fix-collisions.js              # Fix collisions    log.errorCode.includes('PERMISSION') &&          // ~40 char scans

│

└── cli.js                             # CLI entry point    log.severity === 'CRITICAL'                      // ~8 char comparisons

```

);

---

// Total: 10,000 × (12 + 40 + 8) = 600,000 character comparisons```reportError(code, {[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()FROM CHAOS TO CODE

## Usage Examples



### 1. Error Reporting

```javascript// Binary-based (instant)1. BLANK PAPER     → No hardcoding - everything from config/grammar files

try {

    validateUser(data);const results = filterByPattern(logs.map(l => l.binaryCode), binaryErrorGrammar, {

} catch (error) {

    report(BinaryCodes.VALIDATOR.VALIDATION(2001), { error, data });    domain: 'SECURITY',      // 1 bitwise shift + 1 comparison2. BINARY FIRST    → Numbers instead of strings for speed    file: 'auth.js',      // might typo

}

```    category: 'PERMISSION',  // 1 bitwise shift + 1 comparison



### 2. Token Analysis    severity: 'CRITICAL'     // 1 bitwise shift + 1 comparison3. ZERO FALLBACK   → Explicit errors - no silent failures

```javascript

const jsIndex = new SmartGrammarIndex('javascript');});

await jsIndex.loadGrammar();

// Total: 10,000 × 3 = 30,000 bitwise operations (CPU single-cycle instructions)```    method: 'login',      // might forget```javascript

const token = jsIndex.identifyToken('async');

// → { type: 'keyword', category: 'modifier', binary: 0x0a2e }// Result: ~20x faster

```

```

### 3. Security Check

```javascript

import { SecurityManager } from './src/security/security-manager.js';

### Advanced Pattern Matching**Note:** If you disagree with these principles, this project isn't for you      line: 42              // might be wrong

const security = new SecurityManager();

if (!security.validatePath(userPath)) {

    report(BinaryCodes.SECURITY.VALIDATION(5200), { path: userPath });

}```javascriptUse ESLint, Prettier, or other established tools instead

```

// Get all errors from specific domain

### 4. Batch Error Filtering

```javascriptconst allSecurityErrors = filterByPattern(errors, binaryErrorGrammar, {});// แบบเก่า (string)

import { filterByPattern } from './src/error-handler/binary-code-utils.js';

    domain: 'SECURITY'

// Filter 10,000 errors by domain

const securityErrors = filterByPattern(allErrors, {});---

    domain: 'SECURITY'

});



const criticalErrors = filterByPattern(allErrors, {// Get all permission-related errors (any domain)

    severity: 'CRITICAL'

});const allPermissionErrors = filterByPattern(errors, binaryErrorGrammar, {

```

    category: 'PERMISSION'## Quick Start

---

});

## CLI

// New way - auto-captureif (errorCode === "ERR_SECURITY_5001") { ... }

```bash

# Scan file// Get all critical errors (any domain/category)

node cli.js src/file.js

const allCriticalErrors = filterByPattern(errors, binaryErrorGrammar, {```bash

# Scan directory with rules

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI    severity: 'CRITICAL'



# Output format});git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.gitreport(code, { error }); // extracts everything from stack trace

node cli.js src/ --format json

```



**Available Rules:**// Combine: Critical security permission errorscd Chahuadev-Sentinel

- `NO_CONSOLE` - No console.log

- `NO_EMOJI` - No emoji in codeconst specific = filterByPattern(errors, binaryErrorGrammar, {

- `NO_HARDCODE` - No hardcoded values

- `NO_SILENT_FALLBACKS` - No silent fallbacks    domain: 'SECURITY',node cli.js --help```</div></div>

- `MUST_HANDLE_ERRORS` - Force error handling

    category: 'PERMISSION',

---

    severity: 'CRITICAL'```

## Performance Reality

});

**Honest Benchmarks (test-bitwise-filtering.js):**

```

```

Dataset: 40,000 error codes



Test 1: RAW Bitwise (Pure O(1))### Why This MattersNo `npm install` needed - works out of the box

  Time: 22.651ms

  

Test 2: String Filtering (V8-optimized)

  Time: 5.180ms  ← WINNER**Small codebase:** Difference negligible  **Don't like it?** Write context manually - system doesn't forbid it:// แบบใหม่ (binary)

  

Test 3: Bitwise + Grammar Lookup**Large codebase:** 10,000+ errors/day → **binary filtering is 20-100x faster**

  Time: 13.346ms

```---



**Why String is Faster:****Memory:** Binary codes = 8 bytes, Strings = 20-50 bytes → **60-80% smaller**

- V8 engine heavily optimizes strings

- `startsWith()` is native C++ code```javascript

- BigInt operations have overhead in JavaScript

**This is the architectural advantage** - not just "optimization"

**Why We Still Use Binary:**

- **Primary: Memory efficiency (88% smaller)**## Core Systems

- Secondary: Structured data, type safety, cross-language

---

| Aspect | String | Binary |

|--------|--------|--------|report(code, { file: 'x.js', method: 'y', line: 10, error });if (errorCode === 0x0001000400001389n) { ... }

| Speed (JavaScript) | Faster | Slower |

| Memory | 70 bytes | 8 bytes |## The 3 Pillars

| Readability | Better | Harder |

| Structure | Parse needed | Embedded |### Universal Error Reporting

| Type Safety | No | Yes |

| Cross-Language | Encoding issues | Universal |```



---1. BLANK PAPER     → No hardcoding - everything from config/grammar files```



## Limitations (Honest Talk)2. BINARY FIRST    → Numbers instead of strings for speed



1. **Not for beginners** - requires understanding of binary, stack traces, grammars3. ZERO FALLBACK   → Explicit errors - no silent failures**What it does:** Report errors with auto-captured file, method, line, column

2. **High learning curve** - concepts differ from typical tools

3. **Not stable yet** - version 3.0.0-beta```

4. **Solo project** - bugs likely exist

5. **Incomplete docs** - still writing```

6. **Slower than strings in JavaScript** - use for memory, not speed

**Note:** If you disagree with these principles, this project isn't for you  

---

Use ESLint, Prettier, or other established tools instead```javascript

## Why Not Use Existing Tools?



**Q: Why not use Babel parser?**  

A: Babel has many "extras" (dependencies, unwanted features). We want 100% control.---import { report } from './src/error-handler/universal-reporter.js';### 3. Grammar-Based Tokenizer



**Q: Why not use Winston/Bunyan for logging?**  

A: We need to enforce binary codes + auto-capture, not just logging.

## Quick Startimport BinaryCodes from './src/error-handler/binary-codes.js';

**Q: Why not use ESLint?**  

A: ESLint is a linter. We're a code intelligence platform. Different purposes.



**Q: Why binary if strings are faster?**  ```bash**Problem:** Hardcoded keywords in code = hard to maintain  ------

A: **Memory efficiency is the primary reason.** 88% smaller memory footprint matters at scale.

git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git

---

cd Chahuadev-Sentinelreport(BinaryCodes.SECURITY.PERMISSION(5001), { error });

## Who Should Use This

node cli.js --help

**Good fit:**

- Large-scale systems (millions of errors/day)```// Auto-captures: file, method, line, column, timestamp**Solution:** Store in grammar files - change one file, done

- Memory-constrained environments

- Multi-language codebases (C++, Rust, Go, JavaScript)

- Teams needing structured error data

- Projects prioritizing memory over speedNo `npm install` needed - works out of the box```



**Not good fit:**

- Beginner developers

- Pure JavaScript projects (strings are faster)---**ถ้าไม่ชอบ:** ใช้ string ต่อก็ได้ แค่ช้ากว่า แต่ถ้าโค้ดไม่ใหญ่ไม่มีปัญหา

- Small projects with low error volume

- Teams wanting ready-to-use tools

- Projects prioritizing speed over memory

## Core Systems**Performance:** 0.162ms per report

---



## Change What You Don't Like

### Universal Error Reporting```javascript

### Don't Like Binary Error Codes?

```javascript

// Create your own wrapper

const MyErrorCodes = {**What it does:** Report errors with auto-captured file, method, line, column**Alternative:** If you don't like auto-capture, use manual:

    SECURITY_PERMISSION: "SEC_PERM_5001",

    // ... define as strings

};

``````javascript```javascript// Hardcoded (hard to maintain)



### Don't Like Auto-Capture?import { report } from './src/error-handler/universal-reporter.js';

```javascript

// Provide all context manuallyimport BinaryCodes from './src/error-handler/binary-codes.js';report(code, { file: 'x.js', method: 'y', line: 10, error });

report(code, {

    file: 'my-file.js',

    method: 'myMethod',

    line: 10,report(BinaryCodes.SECURITY.PERMISSION(5001), { error });```const keywords = { if: true, const: true, async: true };

    error

});// Auto-captures: file, method, line, column, timestamp

```

```

### Don't Like Grammar System?

```javascript

// Hardcode your keywords

const myKeywords = {**Performance:** 0.162ms per report---### 2. Auto-Capture Context

    if: { type: 'control' },

    const: { type: 'variable' }

};

```**Alternative:** If you don't like auto-capture, use manual:



### Don't Like Any of This?```javascript

```bash

# Use other toolsreport(code, { file: 'x.js', method: 'y', line: 10, error });### Binary Error System// Grammar-based (easy to maintain)

npm install eslint prettier

``````



---



## Current Status---



**Version:** 3.0.0-beta  **What it does:** Error codes as 64-bit integers instead of stringsconst keywords = grammar.keywords; // from javascript.grammar.js**ปัญหา:** เขียน context ด้วยมือผิดพลาดได้ ลืมได้  ##  Core Philosophy## What is Sentinel?

**Status:** Not production-ready  

**Team:** Solo developer  ### Binary Error System

**Time invested:** ~1 month  



**Completed:**

- Universal Error Reporting**What it does:** Error codes as 64-bit integers instead of strings

- Binary Error System (optimized for memory, not speed)

- Bitwise Filtering & Pattern Matching**Structure:** `[Domain 16-bit][Category 16-bit][Offset 32-bit]````

- Smart Grammar Index (14 languages)

- Offset Registry**Structure:** `[Domain 16-bit][Category 16-bit][Severity 8-bit][Source 8-bit][Offset 16-bit]`



**In Progress:**

- Full documentation

- 100% test coverage```javascript

- VS Code Extension

- NPM packageBinaryCodes.SECURITY.PERMISSION(5001)```javascript**แก้ไข:** ดึง context จาก stack trace อัตโนมัติ



---// → 0x0001000400001389 (internal representation)



## DocumentationBinaryCodes.SECURITY.PERMISSION(5001)



- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)// But you use it like this:

- [Offset Registry](./docs/OFFSET_REGISTRY.md)

- [Contributing Guide](./docs/en/CONTRIBUTING.md)const code = BinaryCodes.SECURITY.PERMISSION(5001);// → 0x0001000400001389 (internal representation)**Don't like it?** Hardcode it - just means editing multiple places when changes needed

- [Performance Benchmarks](./test-bitwise-filtering.js)

if (errorCode === code) { ... }

---

```

## License



MIT - Use free, modify free, fork free, no permission needed

**Pros:**// But you use it like this:

---

- Fast comparison (integer comparison)

## Contact

- Low memory (8 bytes)const code = BinaryCodes.SECURITY.PERMISSION(5001);

**Author:** Chahua Development Co., Ltd.  

**Email:** chahuadev@gmail.com  - Collision detection

**Philosophy:** Binary-First (for memory), Blank Paper, Zero Fallback

- Instant filtering (bitwise operations)if (errorCode === code) { ... }### 4. Runtime Binary Generation

**Warning:** If you disagree with these philosophies, don't use this project  

There are many better tools available (ESLint, Prettier, Husky, etc.)



---**Cons:**```



## The Bottom Line- Harder to read than strings



**This project uses binary error codes NOT because they're faster in JavaScript (they're not), but because:**- Requires decoder**Problem:** Build-time generation = rebuild every change  ```javascript



1. **Memory efficiency: 88% smaller** (8 bytes vs 70 bytes)

2. Structured data (domain/category/severity embedded)

3. Type safety (no string parsing errors)**Alternative:** If you prefer strings:**Pros:**

4. Cross-language compatibility

5. Collision detection```javascript



**In JavaScript, strings are faster. We use binary anyway because memory matters at scale.**// Create your own wrapper- Fast comparison (integer comparison)**Solution:** Runtime generation - change grammar, use immediately



If you're building a small JavaScript-only project and speed is your only concern, use strings.  const ErrorCodes = {

If you're building a large-scale, multi-language system where memory efficiency matters, binary is worth it.

    SECURITY_PERMISSION: "SEC_PERM_5001"- Low memory (8 bytes)

Choose wisely. 🎯

};

---

```- Collision detection// แบบเก่า - เขียนเอง (ผิดพลาดได้)### The Three Pillars**Chahuadev Sentinel** is a next-generation code quality and security analysis tool built on three revolutionary principles:

<div align="center">



**Built with precision, not perfection**

---

[GitHub](https://github.com/chahuadev-com) • [Docs](./docs/) • [Benchmarks](./test-bitwise-filtering.js)



</div>

### Smart Grammar Index**Cons:**```javascript



**What it does:** Load multi-language grammars with binary tokenization- Harder to read than strings



```javascript- Requires decoder// No build neededreportError(code, {

const index = new SmartGrammarIndex('javascript');

await index.loadGrammar();



index.getBinary('if', 'keyword');         // → 0x01c7**Alternative:** If you prefer strings:const binary = generateBinary('if', 'keyword'); // generates on-the-fly

index.identifyToken('async');             // → { type, category, binary }

``````javascript



**Supports:** 14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)// Create your own wrapper```    file: 'auth.js',      // อาจพิมพ์ผิด



**Pros:**const ErrorCodes = {

- Auto-detect token types

- Runtime binary generation    SECURITY_PERMISSION: "SEC_PERM_5001"

- Smart caching (126 items)

};

**Alternative:** For single language, hardcoding is simpler:

```javascript```**Don't like it?** Pre-generate and commit - faster but harder to maintain    method: 'login',      // อาจลืม

const jsKeywords = ['if', 'const', 'async', 'function'];

```



------



### Offset Registry



**What it does:** Prevent binary code collisions### Smart Grammar Index---    line: 42              // อาจผิด```1. **Universal Error Reporting** - One API for all error types with automatic context capture



```bash

node tools/offset-scanner.js scan    # scan all offsets

node tools/fix-collisions.js --apply # fix duplicates**What it does:** Load multi-language grammars with binary tokenization

```



**Output:** 

- `offset-registry.json` - database```javascript## The 3 Pillars});

- `docs/OFFSET_REGISTRY.md` - documentation

const index = new SmartGrammarIndex('javascript');

**Alternative:** Not using binary system? Don't need this tool

await index.loadGrammar();

---



## Project Structure

index.getBinary('if', 'keyword');         // → 0x01c7```1. BLANK PAPER     ไม่มี hardcode ใดๆ ทุกอย่างมาจาก grammar files2. **Binary Error System** - 64-bit error codes with ~98% collision-free confidence

```

Chahuadev-Sentinel/index.identifyToken('async');             // → { type, category, binary }

├── src/

│   ├── error-handler/```1. BLANK PAPER     → No hardcoding - everything from config/grammar files

│   │   ├── universal-reporter.js      # Auto-capture API

│   │   ├── binary-codes.js            # 64-bit error codes

│   │   ├── binary-code-utils.js       # Bitwise operations

│   │   └── context-capture.js         # Stack trace parser**Supports:** 14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)2. BINARY FIRST    → Numbers instead of strings for speed// แบบใหม่ - auto-capture

│   │

│   ├── grammars/shared/

│   │   ├── grammar-index.js           # Multi-language loader

│   │   ├── binary-generator.js        # Runtime binary gen**Pros:**3. ZERO FALLBACK   → Explicit errors - no silent failures

│   │   └── grammars/                  # 14 languages

│   │- Auto-detect token types

│   └── security/

│       └── security-manager.js        # Security layer- Runtime binary generation```report(code, { error }); // ดึงทุกอย่างจาก stack trace2. BINARY FIRST    ตัวเลขเปรียบเทียบเร็วกว่า string 1000 เท่า3. **Zero Silent Failures** - Every error is tracked, logged, and visible

│

├── tools/- Smart caching (126 items)

│   ├── offset-scanner.js              # Scan offsets

│   └── fix-collisions.js              # Fix collisions

│

└── cli.js                             # CLI entry point**Alternative:** For single language, hardcoding is simpler:

```

```javascript**Note:** If you disagree with these principles, this project isn't for you  ```

---

const jsKeywords = ['if', 'const', 'async', 'function'];

## Usage Examples

```Use ESLint, Prettier, or other established tools instead

### 1. Error Reporting

```javascript

try {

    validateUser(data);---3. ZERO FALLBACK   ทุก error ต้อง explicit ห้าม silent failures

} catch (error) {

    report(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error, data });

}

```### Offset Registry---



### 2. Token Analysis

```javascript

const jsIndex = new SmartGrammarIndex('javascript');**What it does:** Prevent binary code collisions**ถ้าไม่ชอบ:** เขียน context เองก็ได้ ส่งเข้าไปตามปกติ ระบบไม่ห้าม

await jsIndex.loadGrammar();



const token = jsIndex.identifyToken('async');

// → { type: 'keyword', category: 'modifier', binary: 0x0a2e }```bash## Quick Start

```

node tools/offset-scanner.js scan    # scan all offsets

### 3. Security Check

```javascriptnode tools/fix-collisions.js --apply # fix duplicates```### Key Features

import { SecurityManager } from './src/security/security-manager.js';

```

const security = new SecurityManager();

if (!security.validatePath(userPath)) {```bash

    report(BinaryCodes.SECURITY.PATH_TRAVERSAL(5200), { path: userPath });

}**Output:** 

```

- `offset-registry.json` - databasegit clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git### 3. Grammar-Based Tokenizer

### 4. Batch Error Filtering

```javascript- `docs/OFFSET_REGISTRY.md` - documentation

import { filterByPattern } from './src/error-handler/binary-code-utils.js';

import { binaryErrorGrammar } from './src/error-handler/binary-error.grammar.js';cd Chahuadev-Sentinel



// Filter 10,000 errors instantly**Alternative:** Not using binary system? Don't need this tool

const securityErrors = filterByPattern(allErrors, binaryErrorGrammar, {

    domain: 'SECURITY'node cli.js --help**ปัญหา:** Hardcode keywords (`if`, `const`, `async`) ใน code = แก้ยาก  

});

---

const criticalErrors = filterByPattern(allErrors, binaryErrorGrammar, {

    severity: 'CRITICAL'```

});

```## Project Structure



---**แก้ไข:** เก็บใน grammar file - แก้ไฟล์เดียวจบ



## CLI```



```bashChahuadev-Sentinel/No `npm install` needed - works out of the box

# Scan file

node cli.js src/file.js├── src/



# Scan directory with rules│   ├── error-handler/### The Vision- **Auto-Context Capture**: Automatically captures file, method, line, and column from stack traces

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

│   │   ├── universal-reporter.js      # Auto-capture API

# Output format

node cli.js src/ --format json│   │   ├── binary-codes.js            # 64-bit error codes---

```

│   │   └── context-capture.js         # Stack trace parser

**Available Rules:**

- `NO_CONSOLE` - No console.log│   │```javascript

- `NO_EMOJI` - No emoji in code

- `NO_HARDCODE` - No hardcoded values│   ├── grammars/shared/

- `NO_SILENT_FALLBACKS` - No silent fallbacks

- `MUST_HANDLE_ERRORS` - Force error handling│   │   ├── grammar-index.js           # Multi-language loader## Core Systems



---│   │   ├── binary-generator.js        # Runtime binary gen



## Performance│   │   └── grammars/                  # 14 languages// แบบ hardcode (แก้ยาก)- **Binary Error Codes**: 64-bit unique identifiers (Domain + Category + Offset)



| System | Metric | Value |│   │

|--------|--------|-------|

| Universal Reporter | Per report | 0.162ms |│   └── security/### 🔴 Universal Error Reporting

| Binary Comparison | Speed | Instant (O(1)) |

| String Comparison | Speed | O(n) char iteration |│       └── security-manager.js        # Security layer

| Bitwise Filtering | 10k errors | ~20x faster |

| Grammar Cache | Items | 126 |│const keywords = { if: true, const: true, async: true };

| Languages | Supported | 14 |

├── tools/

---

│   ├── offset-scanner.js              # Scan offsets**What it does:** Report errors with auto-captured file, method, line, column

## Limitations (Honest Talk)

│   └── fix-collisions.js              # Fix collisions

1. **Not for beginners** - requires understanding of binary, stack traces, grammars

2. **High learning curve** - concepts differ from typical tools│**เครื่องมือวิเคราะห์โค้ดที่คิดเป็นเลขฐานสอง**- **Universal Serialization**: Handles Error, Buffer, Circular references, BigInt, and more

3. **Not stable yet** - version 3.0.0-beta

4. **Solo project** - bugs likely exist└── cli.js                             # CLI entry point

5. **Incomplete docs** - still writing

``````javascript

---



## Why Not Use Existing Tools?

---import { report } from './src/error-handler/universal-reporter.js';// แบบ grammar-based (แก้ง่าย)

**Q: Why not use Babel parser?**  

A: Babel has many "extras" (dependencies, unwanted features). We want 100% control.



**Q: Why not use Winston/Bunyan for logging?**  ## Usage Examplesimport BinaryCodes from './src/error-handler/binary-codes.js';

A: We need to enforce binary codes + auto-capture, not just logging.



**Q: Why not use ESLint?**  

A: ESLint is a linter. We're a code intelligence platform. Different purposes.### 1. Error Reportingconst keywords = grammar.keywords; // จาก javascript.grammar.js- Error codes = 64-bit integers (not strings)- **Offset Registry**: Prevents collisions with automated scanning and fixing



**Q: Why create your own grammars?**  ```javascript

A: For consistency across languages and control over binary generation.

try {report(BinaryCodes.SECURITY.PERMISSION(5001), { error });

---

    validateUser(data);

## Who Should Use This

} catch (error) {// Auto-captures: file, method, line, column, timestamp```

**Good fit:**

- Projects requiring high performance    report(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error, data });

- Teams willing to trade learning curve for control

- People who believe in "binary-first" philosophy}```

- Large codebases (10k+ errors/day)

```

**Not good fit:**

- Beginner developers- Tokens = Binary values (not text matching)- **Multi-Language Support**: English and Thai error messages

- Small projects needing quick setup

- People wanting ready-to-use tools### 2. Token Analysis



---```javascript**Performance:** 0.162ms per report



## Change What You Don't Likeconst jsIndex = new SmartGrammarIndex('javascript');



### Don't Like Binary Error Codes?await jsIndex.loadGrammar();**ถ้าไม่ชอบ:** Hardcode ต่อก็ได้ แค่แก้หลายที่ แต่ถ้าไม่มีหลายภาษาไม่จำเป็นต้องใช้

```javascript

// Create your own wrapper

const MyErrorCodes = {

    SECURITY_PERMISSION: "SEC_PERM_5001",const token = jsIndex.identifyToken('async');**Alternative:** If you don't like auto-capture, use manual:

    // ... define as strings

};// → { type: 'keyword', category: 'modifier', binary: 0x0a2e }

```

``````javascript- Grammar = Runtime-generated (not hardcoded)- **Security Layer**: Path traversal detection, rate limiting, sandboxed execution

### Don't Like Auto-Capture?

```javascript

// Provide all context manually

report(code, {### 3. Security Checkreport(code, { file: 'x.js', method: 'y', line: 10, error });

    file: 'my-file.js',

    method: 'myMethod',```javascript

    line: 10,

    errorimport { SecurityManager } from './src/security/security-manager.js';```### 4. Runtime Binary Generation

});

```



### Don't Like Grammar System?const security = new SecurityManager();

```javascript

// Hardcode your keywordsif (!security.validatePath(userPath)) {

const myKeywords = {

    if: { type: 'control' },    report(BinaryCodes.SECURITY.PATH_TRAVERSAL(5200), { path: userPath });---**ปัญหา:** Generate binary ตอน build = ต้อง rebuild ทุกครั้งที่แก้  - Context = Auto-captured (not manual)

    const: { type: 'variable' }

};}

```

```

### Don't Like Any of This?

```bash

# Use other tools

npm install eslint prettier---### 🟡 Binary Error System**แก้ไข:** Generate runtime - แก้ grammar แล้วใช้ได้ทันที

```



---

## CLI

## Current Status



**Version:** 3.0.0-beta  

**Status:** Not production-ready  ```bash**What it does:** Error codes as 64-bit integers instead of strings---

**Team:** Solo developer  

**Time invested:** ~1 month  # Scan file



**Completed:**node cli.js src/file.js

- Universal Error Reporting

- Binary Error System

- Bitwise Filtering & Pattern Matching

- Smart Grammar Index (14 languages)# Scan directory with rules**Structure:** `[Domain 16-bit][Category 16-bit][Offset 32-bit]````javascript

- Offset Registry

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

**In Progress:**

- Full documentation

- 100% test coverage

- VS Code Extension# Output format

- NPM package

node cli.js src/ --format json```javascript// ไม่ต้อง build---

---

```

## Documentation

BinaryCodes.SECURITY.PERMISSION(5001)

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)

- [Offset Registry](./docs/OFFSET_REGISTRY.md)**Available Rules:**

- [Contributing Guide](./docs/en/CONTRIBUTING.md)

- `NO_CONSOLE` - No console.log// → 0x0001000400001389 (internal representation)const binary = generateBinary('if', 'keyword'); // Generate ทันที

---

- `NO_EMOJI` - No emoji in code

## License

- `NO_HARDCODE` - No hardcoded values

MIT - Use free, modify free, fork free, no permission needed

- `NO_SILENT_FALLBACKS` - No silent fallbacks

---

- `MUST_HANDLE_ERRORS` - Force error handling// But you use it like this:```## Table of Contents

## Contact



**Author:** Chahua Development Co., Ltd.  

**Email:** chahuadev@gmail.com  ---const code = BinaryCodes.SECURITY.PERMISSION(5001);

**Philosophy:** Binary-First, Blank Paper, Zero Fallback



**Warning:** If you disagree with these philosophies, don't use this project  

There are many better tools available (ESLint, Prettier, Husky, etc.)## Performanceif (errorCode === code) { ... }



---



<div align="center">| System | Metric | Value |```



**Built with precision, not perfection**|--------|--------|-------|



[GitHub](https://github.com/chahuadev-com) • [Docs](./docs/)| Universal Reporter | Per report | 0.162ms |**ถ้าไม่ชอบ:** Pre-generate แล้ว commit ก็ได้ เร็วกว่าแต่แก้ยาก##  Quick Start



</div>| Binary Comparison | Speed | Instant |


| Grammar Cache | Items | 126 |**Pros:**

| Languages | Supported | 14 |

- Fast comparison (integer comparison)

---

- Low memory (8 bytes)

## Limitations (Honest Talk)

- Collision detection---- [Quick Start](#quick-start)

1. **Not for beginners** - requires understanding of binary, stack traces, grammars

2. **High learning curve** - concepts differ from typical tools

3. **Not stable yet** - version 3.0.0-beta

4. **Solo project** - bugs likely exist**Cons:**

5. **Incomplete docs** - still writing

- Harder to read than strings

---

- Requires decoder## ปรัชญา 3 ข้อ```bash- [Installation](#installation)

## Why Not Use Existing Tools?



**Q: Why not use Babel parser?**  

A: Babel has many "extras" (dependencies, unwanted features). We want 100% control.**Alternative:** If you prefer strings:



**Q: Why not use Winston/Bunyan for logging?**  ```javascript

A: We need to enforce binary codes + auto-capture, not just logging.

// Create your own wrapper```# Clone- [Universal Error Reporting](#universal-error-reporting)

**Q: Why not use ESLint?**  

A: ESLint is a linter. We're a code intelligence platform. Different purposes.const ErrorCodes = {



**Q: Why create your own grammars?**      SECURITY_PERMISSION: "SEC_PERM_5001"1. BLANK PAPER     → ไม่ hardcode - ทุกอย่างมาจาก config/grammar files

A: For consistency across languages and control over binary generation.

};

---

```2. BINARY FIRST    → ใช้ตัวเลขแทน string เพื่อความเร็วgit clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git- [Binary Error System](#binary-error-system)

## Who Should Use This



**Good fit:**

- Projects requiring high performance---3. ZERO FALLBACK   → Error ต้องชัดเจน - ห้าม silent fail

- Teams willing to trade learning curve for control

- People who believe in "binary-first" philosophy



**Not good fit:**### 🟢 Smart Grammar Index```cd Chahuadev-Sentinel- [Architecture](#architecture)

- Beginner developers

- Small projects needing quick setup

- People wanting ready-to-use tools

**What it does:** Load multi-language grammars with binary tokenization

---



## Change What You Don't Like

```javascript**หมายเหตุ:** ถ้าคุณไม่เห็นด้วยกับปรัญญาพวกนี้ ก็ไม่เหมาะกับโปรเจกต์นี้  - [CLI Usage](#cli-usage)

### Don't Like Binary Error Codes?

```javascriptconst index = new SmartGrammarIndex('javascript');

// Create your own wrapper

const MyErrorCodes = {await index.loadGrammar();ใช้ ESLint, Prettier หรือ tool อื่นจะดีกว่า

    SECURITY_PERMISSION: "SEC_PERM_5001",

    // ... define as strings

};

```index.getBinary('if', 'keyword');         // → 0x01c7# Use immediately - no install needed- [VS Code Extension](#vs-code-extension)



### Don't Like Auto-Capture?index.identifyToken('async');             // → { type, category, binary }

```javascript

// Provide all context manually```---

report(code, {

    file: 'my-file.js',

    method: 'myMethod',

    line: 10,**Supports:** 14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)node cli.js --help- [Documentation](#documentation)

    error

});

```

**Pros:**## Quick Start

### Don't Like Grammar System?

```javascript- Auto-detect token types

// Hardcode your keywords

const myKeywords = {- Runtime binary generation```- [Project Structure](#project-structure)

    if: { type: 'control' },

    const: { type: 'variable' }- Smart caching (126 items)

};

``````bash



### Don't Like Any of This?**Alternative:** For single language, hardcoding is simpler:

```bash

# Use other tools```javascriptgit clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git- [Contributing](#contributing)

npm install eslint prettier

```const jsKeywords = ['if', 'const', 'async', 'function'];



---```cd Chahuadev-Sentinel



## Current Status



**Version:** 3.0.0-beta  ---node cli.js --help### 30-Second Example

**Status:** Not production-ready  

**Team:** Solo developer  

**Time invested:** ~1 month  

### 🔵 Offset Registry```

**Completed:**

- Universal Error Reporting

- Binary Error System

- Smart Grammar Index (14 languages)**What it does:** Prevent binary code collisions---

- Offset Registry



**In Progress:**

- Full documentation```bashไม่ต้อง `npm install` - ใช้ได้เลย

- 100% test coverage

- VS Code Extensionnode tools/offset-scanner.js scan    # scan all offsets

- NPM package

node tools/fix-collisions.js --apply # fix duplicates```javascript

---

```

## Documentation

---

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)

- [Offset Registry](./docs/OFFSET_REGISTRY.md)**Output:** 

- [Contributing Guide](./docs/en/CONTRIBUTING.md)

- `offset-registry.json` - databaseimport { report } from './src/error-handler/universal-reporter.js';## Quick Start

---

- `docs/OFFSET_REGISTRY.md` - documentation

## License

## ระบบหลัก

MIT - Use free, modify free, fork free, no permission needed

**Alternative:** Not using binary system? Don't need this tool

---

import BinaryCodes from './src/error-handler/binary-codes.js';

## Contact

---

**Author:** Chahua Development Co., Ltd.  

**Email:** chahuadev@gmail.com  ### 🔴 Universal Error Reporting

**Philosophy:** Binary-First, Blank Paper, Zero Fallback

## Project Structure

**Warning:** If you disagree with these philosophies, don't use this project  

There are many better tools available (ESLint, Prettier, Husky, etc.)### Installation



---```



<div align="center">Chahuadev-Sentinel/**ทำอะไร:** Report error พร้อม auto-capture file, method, line, column



**Built with precision, not perfection**├── src/



[GitHub](https://github.com/chahuadev-com) • [Docs](./docs/)│   ├── error-handler/// Auto-captures: file, method, line, column, timestamp



</div>│   │   ├── universal-reporter.js      # Auto-capture API


│   │   ├── binary-codes.js            # 64-bit error codes```javascript

│   │   └── context-capture.js         # Stack trace parser

│   │import { report } from './src/error-handler/universal-reporter.js';report(BinaryCodes.SECURITY.PERMISSION(5001), { error });```bash

│   ├── grammars/shared/

│   │   ├── grammar-index.js           # Multi-language loaderimport BinaryCodes from './src/error-handler/binary-codes.js';

│   │   ├── binary-generator.js        # Runtime binary gen

│   │   └── grammars/                  # 14 languages```# Clone repository

│   │

│   └── security/report(BinaryCodes.SECURITY.PERMISSION(5001), { error });

│       └── security-manager.js        # Security layer

│// Auto-captures: file, method, line, column, timestampgit clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git

├── tools/

│   ├── offset-scanner.js              # Scan offsets```

│   └── fix-collisions.js              # Fix collisions

│---cd Chahuadev-Sentinel

└── cli.js                             # CLI entry point

```**Performance:** 0.162ms ต่อ report



---



## Usage Examples**ทางเลือก:** ถ้าไม่ชอบ auto-capture ใช้ manual ก็ได้:



### 1. Error Reporting```javascript##  System Architecture# Install dependencies (if any added in future)

```javascript

try {report(code, { file: 'x.js', method: 'y', line: 10, error });

    validateUser(data);

} catch (error) {```npm install

    report(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error, data });

}

```

---###  Core Systems (Production Ready)

### 2. Token Analysis

```javascript

const jsIndex = new SmartGrammarIndex('javascript');

await jsIndex.loadGrammar();### 🟡 Binary Error System# Run CLI



const token = jsIndex.identifyToken('async');

// → { type: 'keyword', category: 'modifier', binary: 0x0a2e }

```**ทำอะไร:** Error code เป็นตัวเลข 64-bit แทน string#### 1. Universal Error Reportingnode cli.js --help



### 3. Security Check

```javascript

import { SecurityManager } from './src/security/security-manager.js';**โครงสร้าง:** `[Domain 16-bit][Category 16-bit][Offset 32-bit]`**Auto-capture everything from stack traces**```



const security = new SecurityManager();

if (!security.validatePath(userPath)) {

    report(BinaryCodes.SECURITY.PATH_TRAVERSAL(5200), { path: userPath });```javascript

}

```BinaryCodes.SECURITY.PERMISSION(5001)



---// → 0x0001000400001389```javascript### Basic Usage



## CLI```



```bash// Before (manual)

# Scan file

node cli.js src/file.js**ข้อดี:**



# Scan directory with rules- เปรียบเทียบเร็ว (integer comparison)reportError(code, { file: 'x.js', method: 'y', line: 10, message: '...' });```javascript

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

- ใช้ memory น้อย (8 bytes)

# Output format

node cli.js src/ --format json- ตรวจ collision ได้import { report } from './src/error-handler/universal-reporter.js';

```



**Available Rules:**

- `NO_CONSOLE` - No console.log**ข้อเสีย:**// After (automatic)import { BinaryCodes } from './src/error-handler/binary-codes.js';

- `NO_EMOJI` - No emoji in code

- `NO_HARDCODE` - No hardcoded values- อ่านยากกว่า string

- `NO_SILENT_FALLBACKS` - No silent fallbacks

- `MUST_HANDLE_ERRORS` - Force error handling- ต้องมี decoderreport(code, { error }); // Auto-captures everything



---



## Performance**ทางเลือก:** ถ้าชอบ string มากกว่า:```// Old way (10+ lines of boilerplate)



| System | Metric | Value |```javascript

|--------|--------|-------|

| Universal Reporter | Per report | 0.162ms |// สร้าง wrapper เองconst details = normalizeErrorDetails(error);

| Binary Comparison | Speed | Instant |

| Grammar Cache | Items | 126 |const ErrorCodes = {

| Languages | Supported | 14 |

    SECURITY_PERMISSION: "SEC_PERM_5001"**Performance:** 0.162ms/report · 88% faster than manualreportError(

---

};

## Limitations (Honest Talk)

```    BinaryCodes.SECURITY.PERMISSION(5001),

1. **Not for beginners** - requires understanding of binary, stack traces, grammars

2. **High learning curve** - concepts differ from typical tools

3. **Not stable yet** - version 3.0.0-beta

4. **Solo project** - bugs likely exist---#### 2. Binary Error System    buildSystemContext('FAILED', {

5. **Incomplete docs** - still writing



---

### 🟢 Smart Grammar Index**64-bit error codes: `[Domain 16][Category 16][Offset 32]`**        component: 'auth',

## Why Not Use Existing Tools?



**Q: Why not use Babel parser?**  

A: Babel has many "extras" (dependencies, unwanted features). We want 100% control.**ทำอะไร:** โหลด grammar หลายภาษา พร้อม binary tokenization        message: `Error: ${details.errorMessage}`,



**Q: Why not use Winston/Bunyan for logging?**  

A: We need to enforce binary codes + auto-capture, not just logging.

```javascript```javascript        ...details

**Q: Why not use ESLint?**  

A: ESLint is a linter. We're a code intelligence platform. Different purposes.const index = new SmartGrammarIndex('javascript');



**Q: Why create your own grammars?**  await index.loadGrammar();BinaryCodes.SECURITY.PERMISSION(5001)    })

A: For consistency across languages and control over binary generation.



---

index.getBinary('if', 'keyword');         // → 0x01c7//  0x0001000400001389 (64-bit integer));

## Who Should Use This

index.identifyToken('async');             // → { type, category, binary }

✅ **Good fit:**

- Projects requiring high performance``````

- Teams willing to trade learning curve for control

- People who believe in "binary-first" philosophy



❌ **Not good fit:****รองรับ:** 14 ภาษา (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)// New way (1 line - auto-captures everything)

- Beginner developers

- Small projects needing quick setup

- People wanting ready-to-use tools

**ข้อดี:****Benefits:** Instant comparison · 8 bytes memory · ~98% collision-freereport(BinaryCodes.SECURITY.PERMISSION(5001), { error });

---

- Auto-detect token type

## Change What You Don't Like

- Runtime binary generation// Auto-captures: file, method, line, column, timestamp

### Don't Like Binary Error Codes?

```javascript- Smart caching (126 items)

// Create your own wrapper

const MyErrorCodes = {#### 3. Smart Grammar Index// Auto-serializes: error object with full context

    SECURITY_PERMISSION: "SEC_PERM_5001",

    // ... define as strings**ทางเลือก:** ถ้าใช้แค่ภาษาเดียว hardcode ง่ายกว่า:

};

``````javascript**Multi-language grammar with binary-first tokenization**```



### Don't Like Auto-Capture?const jsKeywords = ['if', 'const', 'async', 'function'];

```javascript

// Provide all context manually```

report(code, {

    file: 'my-file.js',

    method: 'myMethod',

    line: 10,---```javascript---

    error

});

```

### 🔵 Offset Registryconst index = new SmartGrammarIndex('javascript');

### Don't Like Grammar System?

```javascript

// Hardcode your keywords

const myKeywords = {**ทำอะไร:** ป้องกัน binary code ซ้ำกันawait index.loadGrammar();## Universal Error Reporting

    if: { type: 'control' },

    const: { type: 'variable' }

};

``````bash



### Don't Like Any of This?node tools/offset-scanner.js scan    # สแกนหา offset ทั้งหมด

```bash

# Use other toolsnode tools/fix-collisions.js --apply # แก้ offset ที่ซ้ำindex.getBinary('if', 'keyword');      //  0x01c7### The Problem

npm install eslint prettier

``````



---index.identifyToken('async');          //  { type, category, binary }



## Current Status**Output:** 



**Version:** 3.0.0-beta  - `offset-registry.json` - databaseindex.findKeywordsByCategory('control'); //  ['if', 'else', 'switch']Traditional error reporting requires verbose manual context building:

**Status:** Not production-ready  

**Team:** Solo developer  - `docs/OFFSET_REGISTRY.md` - documentation

**Time invested:** ~1 month  

```

**Completed:**

- ✅ Universal Error Reporting**ทางเลือก:** ถ้าไม่ได้ใช้ binary system ไม่ต้องใช้ tool นี้

- ✅ Binary Error System

- ✅ Smart Grammar Index (14 languages)```javascript

- ✅ Offset Registry

---

**In Progress:**

- ⏳ Full documentation**Features:**// Manual context building (verbose, error-prone)

- ⏳ 100% test coverage

- ⏳ VS Code Extension## โครงสร้างโปรเจกต์

- ⏳ NPM package

-  14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)const context = {

---

```

## Documentation

Chahuadev-Sentinel/-  Runtime binary generation (zero-maintenance)    file: 'security-manager.js',

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)

- [Offset Registry](./docs/OFFSET_REGISTRY.md)├── src/

- [Contributing Guide](./docs/en/CONTRIBUTING.md)

│   ├── error-handler/-  Smart caching (Map-based, 126 items)    method: 'validatePermission',

---

│   │   ├── universal-reporter.js      # Auto-capture API

## License

│   │   ├── binary-codes.js            # 64-bit error codes-  Auto-detect token types    line: 142,

MIT - Use free, modify free, fork free, no permission needed

│   │   └── context-capture.js         # Stack trace parser

---

│   │    component: 'SecurityManager',

## Contact

│   ├── grammars/shared/

**Author:** Chahua Development Co., Ltd.  

**Email:** chahuadev@gmail.com  │   │   ├── grammar-index.js           # Multi-language loader#### 4. Offset Registry    message: 'Permission denied',

**Philosophy:** Binary-First, Blank Paper, Zero Fallback

│   │   ├── binary-generator.js        # Runtime binary gen

**Warning:** If you disagree with these philosophies, don't use this project  

There are many better tools available (ESLint, Prettier, Husky, etc.)│   │   └── grammars/                  # 14 languages**Collision prevention for error codes**    errorMessage: error.message,



---│   │



<div align="center">│   └── security/    errorStack: error.stack



**Built with precision, not perfection**│       └── security-manager.js        # Security layer



[GitHub](https://github.com/chahuadev-com) • [Docs](./docs/)│```bash};



</div>├── tools/


│   ├── offset-scanner.js              # Scan offsetsnode tools/offset-scanner.js scan    # Scan codebasereportError(BinaryCodes.SECURITY.PERMISSION(5001), context);

│   └── fix-collisions.js              # Fix collisions

│node tools/fix-collisions.js --apply # Auto-fix collisions```

└── cli.js                             # CLI entry point

``````



---### The Solution



## ตัวอย่างการใช้งาน**Output:** JSON database + Markdown docs + Zero collisions



### 1. Error Reporting**Universal Reporter** with automatic context capture:

```javascript

try {---

    validateUser(data);

} catch (error) {```javascript

    report(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error, data });

}###  Grammar System (Specialized)import { report } from './src/error-handler/universal-reporter.js';

```



### 2. Token Analysis

```javascript#### Pure Binary Tokenizer// Automatic context capture from stack trace

const jsIndex = new SmartGrammarIndex('javascript');

await jsIndex.loadGrammar();**100% binary comparison - no string matching**report(BinaryCodes.SECURITY.PERMISSION(5001), { error });



const token = jsIndex.identifyToken('async');```

// → { type: 'keyword', category: 'modifier', binary: 0x0a2e }

``````javascript



### 3. Security Checkimport { PureBinaryTokenizer } from './src/grammars/shared/pure-binary-tokenizer.js';**What gets captured automatically:**

```javascript

import { SecurityManager } from './src/security/security-manager.js';- `file`: Caller file path (from stack trace)



const security = new SecurityManager();const tokenizer = new PureBinaryTokenizer(grammar);- `method`: Caller function name (from stack trace)

if (!security.validatePath(userPath)) {

    report(BinaryCodes.SECURITY.PATH_TRAVERSAL(5200), { path: userPath });const tokens = tokenizer.tokenize(code);- `line`: Line number (from stack trace)

}

```// Each token has: { type, value, binary, position }- `column`: Column number (from stack trace)



---```- `timestamp`: ISO timestamp



## CLI- `filePath`: Absolute file path



```bash#### Tree-sitter Integration

# Scan file

node cli.js src/file.js**Auto-generate grammars from Tree-sitter****What gets serialized automatically:**



# Scan directory with rules- Error objects (with stack traces)

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

```bash- Buffers (as hex strings)

# Output format

node cli.js src/ --format jsonnode src/grammars/shared/configs/add-language.js python java rust- Circular references (detected and marked)

```

# Downloads + Converts + Generates binary map- BigInt (converted to string)

**Rules ที่มี:**

- `NO_CONSOLE` - ห้าม console.log```- Date objects (ISO format)

- `NO_EMOJI` - ห้าม emoji

- `NO_HARDCODE` - ห้าม hardcode values- Regular expressions (source + flags)

- `NO_SILENT_FALLBACKS` - ห้าม fallback แบบเงียบๆ

- `MUST_HANDLE_ERRORS` - บังคับจัดการ error#### Binary Generator- Functions (name + string representation)



---**Runtime binary generation (FNV-1a algorithm)**- Symbols (description)



## Performance



| ระบบ | Metric | ค่า |```javascript### Performance

|------|--------|-----|

| Universal Reporter | ต่อ report | 0.162ms |import { generateBinaryMapFromGrammar } from './src/grammars/shared/binary-generator.js';

| Binary Comparison | Speed | Instant |

| Grammar Cache | Items | 126 |- **0.162ms** average per report (8/9 tests passing)

| Languages | รองรับ | 14 |

const binaryMap = generateBinaryMapFromGrammar(grammar);- **88% faster** than manual context building

---

// Adds binary values to all keywords/operators/punctuation- **1000 reports** in 162ms

## ข้อจำกัด (พูดตรงๆ)

```

1. **ไม่เหมาะกับ beginner** - ต้องเข้าใจ binary, stack trace, grammar

2. **Learning curve สูง** - concept ต่างจาก tool ทั่วไป---

3. **ยังไม่ stable** - version 3.0.0-beta

4. **ทำคนเดียว** - bug อาจเยอะ---

5. **Documentation ไม่ครบ** - ยังเขียนอยู่

## Binary Error System

---

###  Security Layer

## ทำไมไม่ใช้ tool ที่มีอยู่แล้ว?

### 64-Bit Error Code Architecture

**Q: ทำไมไม่ใช้ Babel parser?**  

A: Babel ให้ "ของแถม" เยอะ (dependencies, features ที่ไม่ต้องการ) เราต้องการควบคุม 100%#### Multi-layer Protection



**Q: ทำไมไม่ใช้ Winston/Bunyan สำหรับ logging?**  Every error in Sentinel is identified by a unique **64-bit binary code** composed of three parts:

A: เราต้องการบังคับให้ใช้ binary code + auto-capture ไม่ใช่แค่ log

```javascript

**Q: ทำไมไม่ใช้ ESLint?**  

A: ESLint ทำหน้าที่คนละอย่าง - มันเป็น linter เราเป็น code intelligence platformimport { SecurityManager } from './src/security/security-manager.js';```



**Q: ทำไมต้องสร้าง grammar เอง?**  [DOMAIN (16-bit)] [CATEGORY (16-bit)] [OFFSET (32-bit)]

A: เพื่อให้ consistent ทุกภาษา และ control binary generation

const security = new SecurityManager();```

---

security.validatePath('/safe/path');      // Path traversal protection

## ใครควรใช้

security.checkRateLimit('apiCall', 100);  // Rate limiting**Example:**

✅ **เหมาะกับ:**

- โปรเจกต์ที่ต้องการ performance สูงsecurity.sanitizeInput(userInput);        // Input sanitization```javascript

- ทีมที่ยอมแลก learning curve กับ control

- คนที่เชื่อใน "binary-first" philosophy```BinaryCodes.SECURITY.PERMISSION(5001)



❌ **ไม่เหมาะกับ:**// DOMAIN:   SECURITY (0x0001)

- Beginner developers

- โปรเจกต์เล็กๆ ที่ต้องการ quick setup**Features:**// CATEGORY: PERMISSION (0x0004)

- คนที่ต้องการ tool พร้อมใช้งานทันที

- Path traversal detection// OFFSET:   5001

---

- Rate limiting (in-memory + Redis)// Result:   0x0001000400001389 (64-bit)

## เปลี่ยนระบบที่ไม่ชอบ

- Input sanitization```

### ถ้าไม่ชอบ Binary Error Codes

```javascript- Suspicious pattern detection

// สร้าง wrapper ของคุณเอง

const MyErrorCodes = {### Why Binary Codes?

    SECURITY_PERMISSION: "SEC_PERM_5001",

    // ... define แบบ string---

};

```| Aspect | String-Based | Binary-Based |



### ถ้าไม่ชอบ Auto-Capture###  Validation & Rules|--------|--------------|--------------|

```javascript

// ส่ง context เองทั้งหมด| **Comparison Speed** | Slow (byte-by-byte) | Instant (integer) |

report(code, {

    file: 'my-file.js',#### Rule-Based Code Scanning| **Memory Usage** | High (string storage) | Low (8 bytes) |

    method: 'myMethod',

    line: 10,| **Collision Detection** | Manual | Automated |

    error

});```bash| **Type Safety** | None | Full |

```

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI,NO_HARDCODE| **Language Support** | Hardcoded | Decoder-based |

### ถ้าไม่ชอบ Grammar System

```javascript```

// Hardcode keywords ของคุณเอง

const myKeywords = {### Collision Prevention

    if: { type: 'control' },

    const: { type: 'variable' }**Available Rules:**

};

```- `NO_CONSOLE` - No console.logThe **Offset Registry** system prevents offset collisions:



### ถ้าไม่ชอบทั้งหมด- `NO_EMOJI` - No emoji in code

```bash

# ใช้ tool อื่น- `NO_HARDCODE` - No hardcoded values```bash

npm install eslint prettier

```- `NO_SILENT_FALLBACKS` - Must handle all errors explicitly# Scan codebase for offset usage



---- `MUST_HANDLE_ERRORS` - All try-catch must reportnode src/error-handler/offset-scanner.js scan



## สถานะปัจจุบัน



**Version:** 3.0.0-beta  ---# Fix collisions automatically

**Status:** ยังไม่ production-ready  

**ทำโดย:** คนเดียว  node src/error-handler/fix-collisions.js --apply

**เวลาที่ใช้:** ~1 เดือน  

##  Project Structure```

**ระบบที่เสร็จ:**

- ✅ Universal Error Reporting

- ✅ Binary Error System

- ✅ Smart Grammar Index (14 languages)```**Output:**

- ✅ Offset Registry

Chahuadev-Sentinel/```

**ระบบที่ยังทำไม่เสร็จ:**

- ⏳ Full documentation├──  CORE SYSTEMS[SCAN] Scanning for offset usage...

- ⏳ Test coverage 100%

- ⏳ VS Code Extension│   ├── src/error-handler/

- ⏳ NPM package

│   │   ├── universal-reporter.js      # Auto-capture API[SUMMARY] OFFSET SCAN SUMMARY

---

│   │   ├── binary-codes.js            # 64-bit error codesFiles Scanned:     48

## Documentation

│   │   ├── context-capture.js         # Stack trace parsingOffsets Found:     120

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)

- [Offset Registry](./docs/OFFSET_REGISTRY.md)│   │   └── data-serializer.js         # Auto-serialize complex typesUnique Domains:    5 (SECURITY, SYSTEM, PARSER, VALIDATOR, IO)

- [Contributing Guide](./docs/en/CONTRIBUTING.md)

│   │Unique Categories: 10

---

│   └── src/grammars/shared/Collisions:        0 [OK]

## License

│       ├── grammar-index.js           # Smart Grammar Index (NEW)```

MIT - ใช้ฟรี แก้ได้ fork ได้ ไม่ต้องขออนุญาต

│       ├── binary-generator.js        # Runtime binary generation

---

│       └── pure-binary-parser.js      # 100% binary tokenizer---

## Contact

│

**Author:** Chahua Development Co., Ltd.  

**Email:** chahuadev@gmail.com  ├──  TOOLS## Architecture

**Philosophy:** Binary-First, Blank Paper, Zero Fallback

│   ├── tools/offset-scanner.js        # Scan error code offsets

**คำเตือน:** ถ้าคุณไม่เห็นด้วยกับปรัชญาพวกนี้ อย่าใช้โปรเจกต์นี้  

มี tool อื่นที่ดีกว่าเยอะ (ESLint, Prettier, Husky, ฯลฯ)│   ├── tools/fix-collisions.js        # Auto-fix collisions### Core Components



---│   └── tools/scan-report-issues.js    # Report generator



<div align="center">│```



**Built with precision, not perfection**├──  GRAMMARS (14 Languages)┌─────────────────────────────────────────────────────────────┐



[GitHub](https://github.com/chahuadev-com) • [Docs](./docs/)│   └── src/grammars/shared/grammars/│                   UNIVERSAL ERROR REPORTING                  │



</div>│       ├── javascript.grammar.js├─────────────────────────────────────────────────────────────┤


│       ├── typescript.grammar.js│                                                              │

│       ├── python.grammar.js│  report(binaryCode, context, options)                       │

│       └── ... (11 more)│    ├─ Auto-capture: file, method, line, column             │

││    ├─ Auto-serialize: Error, Buffer, Circular, BigInt      │

├──  SECURITY│    ├─ Merge contexts: captured + user-provided             │

│   └── src/security/│    └─ Call: reportError(code, serialized)                  │

│       ├── security-manager.js        # Security orchestrator│                                                              │

│       ├── security-middleware.js     # Middleware layer└─────────────────────────────────────────────────────────────┘

│       └── rate-limit-store-factory.js                          │

│                          

├──  RULES & VALIDATION┌─────────────────────────────────────────────────────────────┐

│   └── src/rules/│                    BINARY ERROR SYSTEM                       │

│       ├── NO_CONSOLE.js├─────────────────────────────────────────────────────────────┤

│       ├── NO_EMOJI.js│                                                              │

│       └── ... (10+ rules)│  64-bit Error Code: [DOMAIN][CATEGORY][OFFSET]             │

││    ├─ DOMAIN:   16-bit (SECURITY, SYSTEM, PARSER, etc.)    │

├──  CLI & EXTENSION│    ├─ CATEGORY: 16-bit (PERMISSION, VALIDATION, etc.)      │

│   ├── cli.js                         # CLI entry point│    └─ OFFSET:   32-bit (unique identifier within category) │

│   ├── cli-config.json                # CLI configuration│                                                              │

│   └── extension-wrapper.js           # VS Code extension│  Binary Operations:                                         │

││    - encode(domain, category, offset)  64-bit             │

└──  DOCUMENTATION│    - decode(binaryCode)  { domain, category, offset }     │

    └── docs/│    - match(code, pattern)  boolean                        │

        ├── UNIVERSAL_ERROR_REPORTING.md│                                                              │

        ├── OFFSET_REGISTRY.md└─────────────────────────────────────────────────────────────┘

        └── ... (more docs)                          │

```                          

┌─────────────────────────────────────────────────────────────┐

---│                    OFFSET REGISTRY                           │

├─────────────────────────────────────────────────────────────┤

##  Key Concepts│                                                              │

│  Collision Detection & Prevention:                          │

### Binary-First Philosophy│    ├─ Scanner: Find all BinaryCodes usage                  │

│    ├─ Registry: Track offset usage per domain.category     │

**Why Binary?**│    ├─ Collision Detector: Find duplicate offsets           │

```│    └─ Auto-Fixer: Reassign offsets with global tracking    │

String Comparison:  "error-5001" === "error-5001"    Slow (byte-by-byte)│                                                              │

Binary Comparison:  0x1389 === 0x1389               Instant (integer)│  Files:                                                     │

│    - offset-scanner.js: Scan codebase                      │

Memory: String = 10+ bytes  |  Binary = 8 bytes│    - fix-collisions.js: Auto-fix duplicates                │

Speed:  String = 100ms      |  Binary = 0.1ms│    - offset-registry.json: Machine-readable database       │

Type:   String = no safety  |  Binary = full type safety│    - OFFSET_REGISTRY.md: Human-readable documentation      │

```│                                                              │

└─────────────────────────────────────────────────────────────┘

### Blank Paper Principle```



**ไม่มี hardcode ใดๆ**### Three-Layer System

```javascript

//  BAD: Hardcoded**Layer 1: Universal Reporter**

const keywords = { if: true, const: true, async: true };- Auto-captures context from stack traces

- Auto-serializes complex data types

//  GOOD: Grammar-based- Provides clean API: `report(code, context)`

const keywords = grammar.keywords; // From grammar file

```**Layer 2: Binary Error System**

- Encodes errors as 64-bit integers

### Zero Fallback Rule- Enables fast comparison and filtering

- ~98% collision-free with proper offset management

**ทุก error ต้อง explicit**

```javascript**Layer 3: Offset Registry**

//  BAD: Silent fallback- Scans codebase for offset usage

const value = data.field || 'default';- Detects collisions automatically

- Fixes collisions with global tracking

//  GOOD: Explicit error

if (!data.field) {---

    report(BinaryCodes.VALIDATOR.REQUIRED_FIELD(2002), { field: 'field' });

    return null;## CLI Usage

}

```### Basic Commands



---```bash

# Show help

##  Performancenode cli.js --help



| System | Metric | Value |# Scan single file

|--------|--------|-------|node cli.js path/to/file.js

| **Universal Reporter** | Avg per report | 0.162ms |

| | vs Manual | 88% faster |# Scan directory

| **Binary Errors** | Comparison | Instant |node cli.js src/

| | Memory/code | 8 bytes |

| **Smart Grammar** | Cache size | 126 items |# Verbose output

| | Languages | 14 |node cli.js src/ --verbose



---# Scan with specific rules

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

##  Migration Tools

# Output formats

```bashnode cli.js src/ --format json

# Migrate old code to Universal Reporternode cli.js src/ --format markdown

node src/error-handler/migrate-to-universal.js --apply```



# Fix binary code collisions### Configuration

node tools/fix-collisions.js --apply

Edit `cli-config.json`:

# Scan offset usage

node tools/offset-scanner.js scan```json

```{

  "defaultRules": [

---    "NO_CONSOLE",

    "NO_EMOJI",

##  Documentation    "NO_HARDCODE",

    "NO_SILENT_FALLBACKS",

### English    "MUST_HANDLE_ERRORS"

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md)  ],

- [Offset Registry](./docs/OFFSET_REGISTRY.md)  "scanPatterns": {

- [Contributing Guide](./docs/en/CONTRIBUTING.md)    "include": ["**/*.js", "**/*.ts"],

    "exclude": ["**/node_modules/**", "**/dist/**"]

### Thai (ภาษาไทย)  },

- [แนะนำระบบ](./docs/th/แนะนำ.md)  "output": {

- [ระบบตรวจสอบข้อผิดพลาด](./docs/th/ERROR_SYSTEM_AUDIT.md)    "format": "text",

    "verbose": false

---  }

}

##  CLI Usage```



```bash---

# Scan file

node cli.js path/to/file.js## VS Code Extension



# Scan directory with rules### Installation

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

1. Open VS Code

# Output formats2. Press `Ctrl+Shift+X` (Extensions)

node cli.js src/ --format json3. Search for "Chahuadev Sentinel"

node cli.js src/ --format markdown4. Click Install



# Verbose mode### Features

node cli.js src/ --verbose

```- **Real-time scanning** while typing

- **Scan on save** automatic validation

---- **Context menu integration** - Right-click to scan

- **Security status** in status bar

##  Roadmap- **Configurable rules** per workspace



###  Phase 1: Foundation (COMPLETED)### Commands

- Universal Error Reporting

- Binary Error System (64-bit)| Command | Description |

- Smart Grammar Index|---------|-------------|

- Offset Registry| `Chahuadev Sentinel: Scan Current File` | Scan active file |

| `Chahuadev Sentinel: Scan Entire Workspace` | Scan all files |

###  Phase 2: Enhancement (IN PROGRESS)| `Chahuadev Sentinel: Configure Rules` | Toggle rules on/off |

- Multi-language grammar expansion| `Chahuadev Sentinel: Security Status` | Show security report |

- Real-time collision monitoring

- Performance optimization### Settings



###  Phase 3: Integration (PLANNED)```json

- CI/CD hooks{

- GitHub Actions  "chahuadev-sentinel.enableRealTimeScanning": true,

- NPM package  "chahuadev-sentinel.scanOnSave": true,

- VS Code Marketplace  "chahuadev-sentinel.notificationStyle": "subtle",

  "chahuadev-sentinel.securityLevel": "FORTRESS",

---  "chahuadev-sentinel.rules.noEmoji": true,

  "chahuadev-sentinel.rules.noConsole": true

##  Example Use Cases}

```

### 1. Error Reporting

```javascript---

try {

    validateUserInput(data);## Documentation

} catch (error) {

    report(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error, data });### English Documentation

}

```- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md) - Complete API reference

- [Offset Registry](./docs/OFFSET_REGISTRY.md) - Collision prevention system

### 2. Token Analysis- [Contributing Guide](./docs/en/CONTRIBUTING.md) - How to contribute

```javascript- [Migration Guide](./docs/en/MIGRATION_GUIDE.md) - Migrating to Universal Reporter

const jsIndex = new SmartGrammarIndex('javascript');- [Release Process](./docs/en/RELEASE_PROCESS.md) - Release workflow

await jsIndex.loadGrammar();

### Thai Documentation (เอกสารภาษาไทย)

const token = jsIndex.identifyToken('async');

//  { type: 'keyword', category: 'modifier', binary: 0x0a2e }- [แนะนำระบบ](./docs/th/แนะนำ.md) - ภาพรวมระบบ

```- [ระบบตรวจสอบข้อผิดพลาด](./docs/th/ERROR_SYSTEM_AUDIT.md) - ระบบ Error ใหม่

- [สถานะการย้ายระบบ](./docs/th/BINARY_MIGRATION_STATUS.md) - ความคืบหน้า

### 3. Security Validation

```javascript---

const security = new SecurityManager();

if (!security.validatePath(userPath)) {## Project Structure

    report(BinaryCodes.SECURITY.PATH_TRAVERSAL(5200), { path: userPath });

}```

```Chahuadev-Sentinel/

├── README.md                       # This file

---├── LICENSE                         # MIT License

├── package.json                    # Package metadata

##  License├── logo.png                        # Project logo

├── cli.js                          # CLI entry point

MIT License - see [LICENSE](./LICENSE)├── cli-config.json                 # CLI configuration

├── extension-wrapper.js            # VS Code extension wrapper

---│

├── src/

##  Credits│   ├── extension.js                # VS Code extension main

│   ├── extension-config.json       # Extension config

**Author:** Chahua Development Co., Ltd.  │   │

**Philosophy:** Binary-First, Blank Paper, Zero Fallback  │   ├── constants/                  # Central constants

**Contact:** chahuadev@gmail.com│   │   ├── rule-constants.js       # Rule IDs & slugs

│   │   └── severity-constants.js   # Severity flags

---│   │

│   ├── error-handler/              # Error handling system

<div align="center">│   │   ├── universal-reporter.js   # [NEW] Universal API

│   │   ├── context-capture.js      # [NEW] Auto-capture

**Built with precision · Designed for speed · Crafted for developers**│   │   ├── data-serializer.js      # [NEW] Auto-serialize

│   │   ├── binary-codes.js         # 64-bit binary codes

[Website](https://chahuadev.com) • [GitHub](https://github.com/chahuadev-com) • [Docs](./docs/)│   │   ├── binary-code-utils.js    # Binary operations

│   │   ├── binary-reporter.js      # Legacy reporter

</div>│   │   ├── binary-error.grammar.js # Error grammar

│   │   ├── offset-scanner.js       # [NEW] Offset scanner
│   │   ├── fix-collisions.js       # [NEW] Collision fixer
│   │   ├── migrate-to-universal.js # [NEW] Migration tool
│   │   ├── offset-registry.json    # [NEW] Offset database
│   │   ├── error-collector.js      # Error collection
│   │   └── binary-log-stream.js    # Binary logging
│   │
│   ├── rules/                      # Validation rules
│   │   ├── validator.js            # Rule validator
│   │   ├── rule-checker.js         # Rule checker
│   │   ├── NO_CONSOLE.js
│   │   ├── NO_EMOJI.js
│   │   ├── NO_HARDCODE.js
│   │   ├── NO_SILENT_FALLBACKS.js
│   │   ├── MUST_HANDLE_ERRORS.js
│   │   └── ... (10 rules total)
│   │
│   ├── security/                   # Security layer
│   │   ├── security-manager.js
│   │   ├── security-middleware.js
│   │   ├── security-config.js
│   │   └── rate-limit-store-factory.js
│   │
│   └── grammars/                   # Grammar system
│       └── shared/
│           ├── grammar-index.js
│           ├── tokenizer-helper.js
│           └── pure-binary-parser.js
│
├── docs/                           # Documentation
│   ├── UNIVERSAL_ERROR_REPORTING.md # [NEW] Universal Reporter
│   ├── OFFSET_REGISTRY.md          # [NEW] Offset Registry
│   ├── en/                         # English docs
│   │   ├── CONTRIBUTING.md
│   │   ├── MIGRATION_GUIDE.md
│   │   └── RELEASE_PROCESS.md
│   └── th/                         # Thai docs
│       ├── แนะนำ.md
│       └── ERROR_SYSTEM_AUDIT.md
│
└── logs/                           # Log files
    ├── errors/                     # Error logs
    └── telemetry/                  # Telemetry data
```

---

## API Reference

### Universal Reporter

#### `report(binaryCode, context, options)`

Main API for error reporting with auto-context capture.

**Parameters:**
- `binaryCode` (BigInt): 64-bit error code from BinaryCodes
- `context` (Object): User-provided context (optional)
- `options` (Object): Additional options (optional)
  - `collect` (boolean): Enable error collection
  - `collector` (Object): ErrorCollector instance

**Returns:** void

**Example:**
```javascript
import { report } from './src/error-handler/universal-reporter.js';
import { BinaryCodes } from './src/error-handler/binary-codes.js';

// Minimal usage
report(BinaryCodes.SECURITY.PERMISSION(5001), { error });

// With additional context
report(BinaryCodes.SECURITY.PERMISSION(5001), {
    error,
    userId: '12345',
    action: 'delete'
});

// With collection
report(BinaryCodes.SECURITY.PERMISSION(5001), { error }, {
    collect: true,
    collector: errorCollector
});
```

#### `warn(binaryCode, context, options)`

Same as `report()` but for warnings.

#### `info(binaryCode, context, options)`

Same as `report()` but for informational messages.

#### `debug(binaryCode, context, options)`

Same as `report()` but for debug messages.

### Batch API

#### `startBatch()`

Start batch collection for multiple errors.

**Returns:** Batch object with methods:
- `add(binaryCode, context)`: Add error to batch
- `flush()`: Report all errors at once

**Example:**
```javascript
import { startBatch } from './src/error-handler/universal-reporter.js';

const batch = startBatch();
batch.add(BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001), { error1 });
batch.add(BinaryCodes.VALIDATOR.REQUIRED_FIELD(2002), { error2 });
batch.flush(); // Reports all at once
```

### Try-Catch Wrappers

#### `tryReport(fn, binaryCode, context)`

Wraps function in try-catch with automatic error reporting.

**Example:**
```javascript
import { tryReport } from './src/error-handler/universal-reporter.js';

const result = tryReport(
    () => riskyOperation(),
    BinaryCodes.SYSTEM.UNKNOWN(9999),
    { operation: 'riskyOperation' }
);
```

#### `tryReportAsync(fn, binaryCode, context)`

Async version of `tryReport()`.

---

## Binary Error Codes

### Structure

```javascript
BinaryCodes.{DOMAIN}.{CATEGORY}(offset)
```

### Available Domains

- `SECURITY`: Security-related errors
- `SYSTEM`: System-level errors
- `PARSER`: Parser errors
- `VALIDATOR`: Validation errors
- `IO`: Input/output errors

### Available Categories (per Domain)

**SECURITY:**
- `PERMISSION`: Permission denied
- `AUTHENTICATION`: Auth failures
- `PATH_TRAVERSAL`: Path traversal attempts
- `RATE_LIMIT`: Rate limit exceeded

**SYSTEM:**
- `CONFIGURATION`: Config errors
- `UNKNOWN`: Unknown errors

**PARSER:**
- `SYNTAX`: Syntax errors
- `VALIDATION`: Parser validation

**VALIDATOR:**
- `TYPE_MISMATCH`: Type mismatches
- `REQUIRED_FIELD`: Missing required fields
- `VALIDATION`: General validation

**IO:**
- `READ`: Read errors
- `WRITE`: Write errors

### Example Usage

```javascript
import { BinaryCodes } from './src/error-handler/binary-codes.js';

// Security errors
BinaryCodes.SECURITY.PERMISSION(5001)
BinaryCodes.SECURITY.AUTHENTICATION(5100)
BinaryCodes.SECURITY.PATH_TRAVERSAL(5200)
BinaryCodes.SECURITY.RATE_LIMIT(5300)

// System errors
BinaryCodes.SYSTEM.CONFIGURATION(1001)
BinaryCodes.SYSTEM.UNKNOWN(9999)

// Parser errors
BinaryCodes.PARSER.SYNTAX(3001)
BinaryCodes.PARSER.VALIDATION(3100)

// Validator errors
BinaryCodes.VALIDATOR.TYPE_MISMATCH(2001)
BinaryCodes.VALIDATOR.REQUIRED_FIELD(2002)
BinaryCodes.VALIDATOR.VALIDATION(2100)

// IO errors
BinaryCodes.IO.READ(4001)
BinaryCodes.IO.WRITE(4002)
```

---

## Offset Management

### Scanning for Offsets

```bash
node src/error-handler/offset-scanner.js scan
```

**Output:**
- `offset-registry.json`: Machine-readable database
- `docs/OFFSET_REGISTRY.md`: Human-readable documentation

### Fixing Collisions

```bash
# Dry run (preview changes)
node src/error-handler/fix-collisions.js

# Apply fixes
node src/error-handler/fix-collisions.js --apply
```

### Migrating to Universal Reporter

```bash
# Dry run (preview changes)
node src/error-handler/migrate-to-universal.js

# Apply migration
node src/error-handler/migrate-to-universal.js --apply
```

---

## Performance Benchmarks

### Universal Reporter

| Metric | Value |
|--------|-------|
| Average per report | 0.162ms |
| 1000 reports | 162ms |
| vs Manual building | 88% faster |
| Memory overhead | Minimal (~8KB per 1000 reports) |

### Binary Error System

| Metric | Value |
|--------|-------|
| Comparison speed | Instant (integer) |
| Memory per code | 8 bytes |
| Collision probability | ~2% (with proper offset management) |
| Encoding speed | <0.001ms |
| Decoding speed | <0.001ms |

---

## Testing

### Run Tests

```bash
# Unit tests
npm test

# CLI smoke test
npm run smoke

# Full test suite
node --test tests/**/*.test.js
```

### Test Coverage

- Universal Reporter: 8/9 tests passing (89%)
- Binary Error System: 100% coverage
- Offset Registry: Automated collision detection
- Security Layer: Rate limiting, path traversal

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./docs/en/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git
cd Chahuadev-Sentinel

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm test

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

### Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## Roadmap

### Phase 1: Foundation (COMPLETED)

- [x] Universal Error Reporting API
- [x] Binary Error System (64-bit)
- [x] Auto-context capture from stack traces
- [x] Auto-serialization for complex types
- [x] Offset Registry system
- [x] Collision detection and fixing

### Phase 2: Migration (IN PROGRESS)

- [x] CLI migrated to Universal Reporter
- [ ] Security layer migration (32+ calls)
- [ ] Validator migration (8+ calls)
- [ ] Parser migration (28+ calls)
- [ ] Complete test coverage

### Phase 3: Enhancement (PLANNED)

- [ ] Real-time collision monitoring
- [ ] Binary error analytics dashboard
- [ ] Performance profiling tools
- [ ] Multi-language error messages (more languages)
- [ ] Binary error code documentation generator

### Phase 4: Integration (FUTURE)

- [ ] CI/CD integration hooks
- [ ] GitHub Actions workflow
- [ ] NPM package publication
- [ ] VS Code Marketplace publication
- [ ] Docker container support

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## Credits

**Author:** Chahua Development Co., Ltd.

**Contributors:**
- Core team members
- Community contributors

**Special Thanks:**
- VS Code Extension API team
- Node.js community
- Open source contributors

---

## Support

### Getting Help

- [Documentation](./docs/)
- [GitHub Issues](https://github.com/chahuadev-com/Chahuadev-Sentinel/issues)
- [Discussions](https://github.com/chahuadev-com/Chahuadev-Sentinel/discussions)

### Reporting Bugs

Please use [GitHub Issues](https://github.com/chahuadev-com/Chahuadev-Sentinel/issues) with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)

### Feature Requests

Submit feature requests via [GitHub Issues](https://github.com/chahuadev-com/Chahuadev-Sentinel/issues) with:
- Clear use case description
- Expected benefits
- Potential implementation approach

---

## Changelog

See [MIGRATION_GUIDE.md](./docs/en/MIGRATION_GUIDE.md) for detailed version history.

### Version 2.0.0-beta (Current)

- Universal Error Reporting system
- Binary Error System (64-bit)
- Auto-context capture
- Offset Registry
- Migration tools

### Version 1.0.0 (Legacy)

- Initial release
- Basic rule validation
- CLI and VS Code extension
- Manual error reporting

---

<div align="center">

**Built with precision by Chahua Development**

[Website](https://chahuadev.com) • [GitHub](https://github.com/chahuadev-com) • [Documentation](./docs/)

</div>
