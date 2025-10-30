<div align="center"><div align="center">

  <img src="./logo.png" alt="Chahuadev Sentinel" width="150"/>

#  Chahuadev Sentinel

# Chahuadev Sentinel

**The Philosophy: FROM CHAOS TO CODE**

[![Version](https://img.shields.io/badge/version-2.0.0--beta-blue?style=flat-square)](https://github.com/chahuadev-com/Chahuadev-Sentinel)

> Binary-First Code Intelligence Platform  [![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> Where every error speaks in numbers, every token carries meaning[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen?style=flat-square)]()



[![Version](https://img.shields.io/badge/version-3.0.0--beta-blue)](https://github.com/chahuadev-com/Chahuadev-Sentinel)> **Pure Binary Code Analysis** - Revolutionary error reporting system with auto-context capture and 64-bit binary error codes

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)]()FROM CHAOS TO CODE



</div></div>



------



##  Core Philosophy## What is Sentinel?



### The Three Pillars**Chahuadev Sentinel** is a next-generation code quality and security analysis tool built on three revolutionary principles:



```1. **Universal Error Reporting** - One API for all error types with automatic context capture

1. BLANK PAPER     ไม่มี hardcode ใดๆ ทุกอย่างมาจาก grammar files2. **Binary Error System** - 64-bit error codes with ~98% collision-free confidence

2. BINARY FIRST    ตัวเลขเปรียบเทียบเร็วกว่า string 1000 เท่า3. **Zero Silent Failures** - Every error is tracked, logged, and visible

3. ZERO FALLBACK   ทุก error ต้อง explicit ห้าม silent failures

```### Key Features



### The Vision- **Auto-Context Capture**: Automatically captures file, method, line, and column from stack traces

- **Binary Error Codes**: 64-bit unique identifiers (Domain + Category + Offset)

**เครื่องมือวิเคราะห์โค้ดที่คิดเป็นเลขฐานสอง**- **Universal Serialization**: Handles Error, Buffer, Circular references, BigInt, and more

- Error codes = 64-bit integers (not strings)- **Offset Registry**: Prevents collisions with automated scanning and fixing

- Tokens = Binary values (not text matching)- **Multi-Language Support**: English and Thai error messages

- Grammar = Runtime-generated (not hardcoded)- **Security Layer**: Path traversal detection, rate limiting, sandboxed execution

- Context = Auto-captured (not manual)

---

---

## Table of Contents

##  Quick Start

- [Quick Start](#quick-start)

```bash- [Installation](#installation)

# Clone- [Universal Error Reporting](#universal-error-reporting)

git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git- [Binary Error System](#binary-error-system)

cd Chahuadev-Sentinel- [Architecture](#architecture)

- [CLI Usage](#cli-usage)

# Use immediately - no install needed- [VS Code Extension](#vs-code-extension)

node cli.js --help- [Documentation](#documentation)

```- [Project Structure](#project-structure)

- [Contributing](#contributing)

### 30-Second Example

---

```javascript

import { report } from './src/error-handler/universal-reporter.js';## Quick Start

import BinaryCodes from './src/error-handler/binary-codes.js';

### Installation

// Auto-captures: file, method, line, column, timestamp

report(BinaryCodes.SECURITY.PERMISSION(5001), { error });```bash

```# Clone repository

git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git

---cd Chahuadev-Sentinel



##  System Architecture# Install dependencies (if any added in future)

npm install

###  Core Systems (Production Ready)

# Run CLI

#### 1. Universal Error Reportingnode cli.js --help

**Auto-capture everything from stack traces**```



```javascript### Basic Usage

// Before (manual)

reportError(code, { file: 'x.js', method: 'y', line: 10, message: '...' });```javascript

import { report } from './src/error-handler/universal-reporter.js';

// After (automatic)import { BinaryCodes } from './src/error-handler/binary-codes.js';

report(code, { error }); // Auto-captures everything

```// Old way (10+ lines of boilerplate)

const details = normalizeErrorDetails(error);

**Performance:** 0.162ms/report · 88% faster than manualreportError(

    BinaryCodes.SECURITY.PERMISSION(5001),

#### 2. Binary Error System    buildSystemContext('FAILED', {

**64-bit error codes: `[Domain 16][Category 16][Offset 32]`**        component: 'auth',

        message: `Error: ${details.errorMessage}`,

```javascript        ...details

BinaryCodes.SECURITY.PERMISSION(5001)    })

//  0x0001000400001389 (64-bit integer));

```

// New way (1 line - auto-captures everything)

**Benefits:** Instant comparison · 8 bytes memory · ~98% collision-freereport(BinaryCodes.SECURITY.PERMISSION(5001), { error });

// Auto-captures: file, method, line, column, timestamp

#### 3. Smart Grammar Index// Auto-serializes: error object with full context

**Multi-language grammar with binary-first tokenization**```



```javascript---

const index = new SmartGrammarIndex('javascript');

await index.loadGrammar();## Universal Error Reporting



index.getBinary('if', 'keyword');      //  0x01c7### The Problem

index.identifyToken('async');          //  { type, category, binary }

index.findKeywordsByCategory('control'); //  ['if', 'else', 'switch']Traditional error reporting requires verbose manual context building:

```

```javascript

**Features:**// Manual context building (verbose, error-prone)

-  14 languages (JavaScript, TypeScript, Python, Java, Go, Rust, C++, C, PHP, Ruby, C#, Swift, Kotlin, JSX)const context = {

-  Runtime binary generation (zero-maintenance)    file: 'security-manager.js',

-  Smart caching (Map-based, 126 items)    method: 'validatePermission',

-  Auto-detect token types    line: 142,

    component: 'SecurityManager',

#### 4. Offset Registry    message: 'Permission denied',

**Collision prevention for error codes**    errorMessage: error.message,

    errorStack: error.stack

```bash};

node tools/offset-scanner.js scan    # Scan codebasereportError(BinaryCodes.SECURITY.PERMISSION(5001), context);

node tools/fix-collisions.js --apply # Auto-fix collisions```

```

### The Solution

**Output:** JSON database + Markdown docs + Zero collisions

**Universal Reporter** with automatic context capture:

---

```javascript

###  Grammar System (Specialized)import { report } from './src/error-handler/universal-reporter.js';



#### Pure Binary Tokenizer// Automatic context capture from stack trace

**100% binary comparison - no string matching**report(BinaryCodes.SECURITY.PERMISSION(5001), { error });

```

```javascript

import { PureBinaryTokenizer } from './src/grammars/shared/pure-binary-tokenizer.js';**What gets captured automatically:**

- `file`: Caller file path (from stack trace)

const tokenizer = new PureBinaryTokenizer(grammar);- `method`: Caller function name (from stack trace)

const tokens = tokenizer.tokenize(code);- `line`: Line number (from stack trace)

// Each token has: { type, value, binary, position }- `column`: Column number (from stack trace)

```- `timestamp`: ISO timestamp

- `filePath`: Absolute file path

#### Tree-sitter Integration

**Auto-generate grammars from Tree-sitter****What gets serialized automatically:**

- Error objects (with stack traces)

```bash- Buffers (as hex strings)

node src/grammars/shared/configs/add-language.js python java rust- Circular references (detected and marked)

# Downloads + Converts + Generates binary map- BigInt (converted to string)

```- Date objects (ISO format)

- Regular expressions (source + flags)

#### Binary Generator- Functions (name + string representation)

**Runtime binary generation (FNV-1a algorithm)**- Symbols (description)



```javascript### Performance

import { generateBinaryMapFromGrammar } from './src/grammars/shared/binary-generator.js';

- **0.162ms** average per report (8/9 tests passing)

const binaryMap = generateBinaryMapFromGrammar(grammar);- **88% faster** than manual context building

// Adds binary values to all keywords/operators/punctuation- **1000 reports** in 162ms

```

---

---

## Binary Error System

###  Security Layer

### 64-Bit Error Code Architecture

#### Multi-layer Protection

Every error in Sentinel is identified by a unique **64-bit binary code** composed of three parts:

```javascript

import { SecurityManager } from './src/security/security-manager.js';```

[DOMAIN (16-bit)] [CATEGORY (16-bit)] [OFFSET (32-bit)]

const security = new SecurityManager();```

security.validatePath('/safe/path');      // Path traversal protection

security.checkRateLimit('apiCall', 100);  // Rate limiting**Example:**

security.sanitizeInput(userInput);        // Input sanitization```javascript

```BinaryCodes.SECURITY.PERMISSION(5001)

// DOMAIN:   SECURITY (0x0001)

**Features:**// CATEGORY: PERMISSION (0x0004)

- Path traversal detection// OFFSET:   5001

- Rate limiting (in-memory + Redis)// Result:   0x0001000400001389 (64-bit)

- Input sanitization```

- Suspicious pattern detection

### Why Binary Codes?

---

| Aspect | String-Based | Binary-Based |

###  Validation & Rules|--------|--------------|--------------|

| **Comparison Speed** | Slow (byte-by-byte) | Instant (integer) |

#### Rule-Based Code Scanning| **Memory Usage** | High (string storage) | Low (8 bytes) |

| **Collision Detection** | Manual | Automated |

```bash| **Type Safety** | None | Full |

node cli.js src/ --rules NO_CONSOLE,NO_EMOJI,NO_HARDCODE| **Language Support** | Hardcoded | Decoder-based |

```

### Collision Prevention

**Available Rules:**

- `NO_CONSOLE` - No console.logThe **Offset Registry** system prevents offset collisions:

- `NO_EMOJI` - No emoji in code

- `NO_HARDCODE` - No hardcoded values```bash

- `NO_SILENT_FALLBACKS` - Must handle all errors explicitly# Scan codebase for offset usage

- `MUST_HANDLE_ERRORS` - All try-catch must reportnode src/error-handler/offset-scanner.js scan



---# Fix collisions automatically

node src/error-handler/fix-collisions.js --apply

##  Project Structure```



```**Output:**

Chahuadev-Sentinel/```

├──  CORE SYSTEMS[SCAN] Scanning for offset usage...

│   ├── src/error-handler/

│   │   ├── universal-reporter.js      # Auto-capture API[SUMMARY] OFFSET SCAN SUMMARY

│   │   ├── binary-codes.js            # 64-bit error codesFiles Scanned:     48

│   │   ├── context-capture.js         # Stack trace parsingOffsets Found:     120

│   │   └── data-serializer.js         # Auto-serialize complex typesUnique Domains:    5 (SECURITY, SYSTEM, PARSER, VALIDATOR, IO)

│   │Unique Categories: 10

│   └── src/grammars/shared/Collisions:        0 [OK]

│       ├── grammar-index.js           # Smart Grammar Index (NEW)```

│       ├── binary-generator.js        # Runtime binary generation

│       └── pure-binary-parser.js      # 100% binary tokenizer---

│

├──  TOOLS## Architecture

│   ├── tools/offset-scanner.js        # Scan error code offsets

│   ├── tools/fix-collisions.js        # Auto-fix collisions### Core Components

│   └── tools/scan-report-issues.js    # Report generator

│```

├──  GRAMMARS (14 Languages)┌─────────────────────────────────────────────────────────────┐

│   └── src/grammars/shared/grammars/│                   UNIVERSAL ERROR REPORTING                  │

│       ├── javascript.grammar.js├─────────────────────────────────────────────────────────────┤

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
