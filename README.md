<div align="center">
  <img src="./logo.png" alt="Chahuadev Sentinel" width="150"/>

# Chahuadev Sentinel

[![Version](https://img.shields.io/badge/version-2.0.0--beta-blue?style=flat-square)](https://github.com/chahuadev-com/Chahuadev-Sentinel)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen?style=flat-square)]()

> **Pure Binary Code Analysis** - Revolutionary error reporting system with auto-context capture and 64-bit binary error codes

FROM CHAOS TO CODE

</div>

---

## What is Sentinel?

**Chahuadev Sentinel** is a next-generation code quality and security analysis tool built on three revolutionary principles:

1. **Universal Error Reporting** - One API for all error types with automatic context capture
2. **Binary Error System** - 64-bit error codes with ~98% collision-free confidence
3. **Zero Silent Failures** - Every error is tracked, logged, and visible

### Key Features

- **Auto-Context Capture**: Automatically captures file, method, line, and column from stack traces
- **Binary Error Codes**: 64-bit unique identifiers (Domain + Category + Offset)
- **Universal Serialization**: Handles Error, Buffer, Circular references, BigInt, and more
- **Offset Registry**: Prevents collisions with automated scanning and fixing
- **Multi-Language Support**: English and Thai error messages
- **Security Layer**: Path traversal detection, rate limiting, sandboxed execution

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Universal Error Reporting](#universal-error-reporting)
- [Binary Error System](#binary-error-system)
- [Architecture](#architecture)
- [CLI Usage](#cli-usage)
- [VS Code Extension](#vs-code-extension)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/chahuadev-com/Chahuadev-Sentinel.git
cd Chahuadev-Sentinel

# Install dependencies (if any added in future)
npm install

# Run CLI
node cli.js --help
```

### Basic Usage

```javascript
import { report } from './src/error-handler/universal-reporter.js';
import { BinaryCodes } from './src/error-handler/binary-codes.js';

// Old way (10+ lines of boilerplate)
const details = normalizeErrorDetails(error);
reportError(
    BinaryCodes.SECURITY.PERMISSION(5001),
    buildSystemContext('FAILED', {
        component: 'auth',
        message: `Error: ${details.errorMessage}`,
        ...details
    })
);

// New way (1 line - auto-captures everything)
report(BinaryCodes.SECURITY.PERMISSION(5001), { error });
// Auto-captures: file, method, line, column, timestamp
// Auto-serializes: error object with full context
```

---

## Universal Error Reporting

### The Problem

Traditional error reporting requires verbose manual context building:

```javascript
// Manual context building (verbose, error-prone)
const context = {
    file: 'security-manager.js',
    method: 'validatePermission',
    line: 142,
    component: 'SecurityManager',
    message: 'Permission denied',
    errorMessage: error.message,
    errorStack: error.stack
};
reportError(BinaryCodes.SECURITY.PERMISSION(5001), context);
```

### The Solution

**Universal Reporter** with automatic context capture:

```javascript
import { report } from './src/error-handler/universal-reporter.js';

// Automatic context capture from stack trace
report(BinaryCodes.SECURITY.PERMISSION(5001), { error });
```

**What gets captured automatically:**
- `file`: Caller file path (from stack trace)
- `method`: Caller function name (from stack trace)
- `line`: Line number (from stack trace)
- `column`: Column number (from stack trace)
- `timestamp`: ISO timestamp
- `filePath`: Absolute file path

**What gets serialized automatically:**
- Error objects (with stack traces)
- Buffers (as hex strings)
- Circular references (detected and marked)
- BigInt (converted to string)
- Date objects (ISO format)
- Regular expressions (source + flags)
- Functions (name + string representation)
- Symbols (description)

### Performance

- **0.162ms** average per report (8/9 tests passing)
- **88% faster** than manual context building
- **1000 reports** in 162ms

---

## Binary Error System

### 64-Bit Error Code Architecture

Every error in Sentinel is identified by a unique **64-bit binary code** composed of three parts:

```
[DOMAIN (16-bit)] [CATEGORY (16-bit)] [OFFSET (32-bit)]
```

**Example:**
```javascript
BinaryCodes.SECURITY.PERMISSION(5001)
// DOMAIN:   SECURITY (0x0001)
// CATEGORY: PERMISSION (0x0004)
// OFFSET:   5001
// Result:   0x0001000400001389 (64-bit)
```

### Why Binary Codes?

| Aspect | String-Based | Binary-Based |
|--------|--------------|--------------|
| **Comparison Speed** | Slow (byte-by-byte) | Instant (integer) |
| **Memory Usage** | High (string storage) | Low (8 bytes) |
| **Collision Detection** | Manual | Automated |
| **Type Safety** | None | Full |
| **Language Support** | Hardcoded | Decoder-based |

### Collision Prevention

The **Offset Registry** system prevents offset collisions:

```bash
# Scan codebase for offset usage
node src/error-handler/offset-scanner.js scan

# Fix collisions automatically
node src/error-handler/fix-collisions.js --apply
```

**Output:**
```
[SCAN] Scanning for offset usage...

[SUMMARY] OFFSET SCAN SUMMARY
Files Scanned:     48
Offsets Found:     120
Unique Domains:    5 (SECURITY, SYSTEM, PARSER, VALIDATOR, IO)
Unique Categories: 10
Collisions:        0 [OK]
```

---

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                   UNIVERSAL ERROR REPORTING                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  report(binaryCode, context, options)                       │
│    ├─ Auto-capture: file, method, line, column             │
│    ├─ Auto-serialize: Error, Buffer, Circular, BigInt      │
│    ├─ Merge contexts: captured + user-provided             │
│    └─ Call: reportError(code, serialized)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    BINARY ERROR SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  64-bit Error Code: [DOMAIN][CATEGORY][OFFSET]             │
│    ├─ DOMAIN:   16-bit (SECURITY, SYSTEM, PARSER, etc.)    │
│    ├─ CATEGORY: 16-bit (PERMISSION, VALIDATION, etc.)      │
│    └─ OFFSET:   32-bit (unique identifier within category) │
│                                                              │
│  Binary Operations:                                         │
│    - encode(domain, category, offset) → 64-bit             │
│    - decode(binaryCode) → { domain, category, offset }     │
│    - match(code, pattern) → boolean                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    OFFSET REGISTRY                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Collision Detection & Prevention:                          │
│    ├─ Scanner: Find all BinaryCodes usage                  │
│    ├─ Registry: Track offset usage per domain.category     │
│    ├─ Collision Detector: Find duplicate offsets           │
│    └─ Auto-Fixer: Reassign offsets with global tracking    │
│                                                              │
│  Files:                                                     │
│    - offset-scanner.js: Scan codebase                      │
│    - fix-collisions.js: Auto-fix duplicates                │
│    - offset-registry.json: Machine-readable database       │
│    - OFFSET_REGISTRY.md: Human-readable documentation      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Three-Layer System

**Layer 1: Universal Reporter**
- Auto-captures context from stack traces
- Auto-serializes complex data types
- Provides clean API: `report(code, context)`

**Layer 2: Binary Error System**
- Encodes errors as 64-bit integers
- Enables fast comparison and filtering
- ~98% collision-free with proper offset management

**Layer 3: Offset Registry**
- Scans codebase for offset usage
- Detects collisions automatically
- Fixes collisions with global tracking

---

## CLI Usage

### Basic Commands

```bash
# Show help
node cli.js --help

# Scan single file
node cli.js path/to/file.js

# Scan directory
node cli.js src/

# Verbose output
node cli.js src/ --verbose

# Scan with specific rules
node cli.js src/ --rules NO_CONSOLE,NO_EMOJI

# Output formats
node cli.js src/ --format json
node cli.js src/ --format markdown
```

### Configuration

Edit `cli-config.json`:

```json
{
  "defaultRules": [
    "NO_CONSOLE",
    "NO_EMOJI",
    "NO_HARDCODE",
    "NO_SILENT_FALLBACKS",
    "MUST_HANDLE_ERRORS"
  ],
  "scanPatterns": {
    "include": ["**/*.js", "**/*.ts"],
    "exclude": ["**/node_modules/**", "**/dist/**"]
  },
  "output": {
    "format": "text",
    "verbose": false
  }
}
```

---

## VS Code Extension

### Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search for "Chahuadev Sentinel"
4. Click Install

### Features

- **Real-time scanning** while typing
- **Scan on save** automatic validation
- **Context menu integration** - Right-click to scan
- **Security status** in status bar
- **Configurable rules** per workspace

### Commands

| Command | Description |
|---------|-------------|
| `Chahuadev Sentinel: Scan Current File` | Scan active file |
| `Chahuadev Sentinel: Scan Entire Workspace` | Scan all files |
| `Chahuadev Sentinel: Configure Rules` | Toggle rules on/off |
| `Chahuadev Sentinel: Security Status` | Show security report |

### Settings

```json
{
  "chahuadev-sentinel.enableRealTimeScanning": true,
  "chahuadev-sentinel.scanOnSave": true,
  "chahuadev-sentinel.notificationStyle": "subtle",
  "chahuadev-sentinel.securityLevel": "FORTRESS",
  "chahuadev-sentinel.rules.noEmoji": true,
  "chahuadev-sentinel.rules.noConsole": true
}
```

---

## Documentation

### English Documentation

- [Universal Error Reporting](./docs/UNIVERSAL_ERROR_REPORTING.md) - Complete API reference
- [Offset Registry](./docs/OFFSET_REGISTRY.md) - Collision prevention system
- [Contributing Guide](./docs/en/CONTRIBUTING.md) - How to contribute
- [Migration Guide](./docs/en/MIGRATION_GUIDE.md) - Migrating to Universal Reporter
- [Release Process](./docs/en/RELEASE_PROCESS.md) - Release workflow

### Thai Documentation (เอกสารภาษาไทย)

- [แนะนำระบบ](./docs/th/แนะนำ.md) - ภาพรวมระบบ
- [ระบบตรวจสอบข้อผิดพลาด](./docs/th/ERROR_SYSTEM_AUDIT.md) - ระบบ Error ใหม่
- [สถานะการย้ายระบบ](./docs/th/BINARY_MIGRATION_STATUS.md) - ความคืบหน้า

---

## Project Structure

```
Chahuadev-Sentinel/
├── README.md                       # This file
├── LICENSE                         # MIT License
├── package.json                    # Package metadata
├── logo.png                        # Project logo
├── cli.js                          # CLI entry point
├── cli-config.json                 # CLI configuration
├── extension-wrapper.js            # VS Code extension wrapper
│
├── src/
│   ├── extension.js                # VS Code extension main
│   ├── extension-config.json       # Extension config
│   │
│   ├── constants/                  # Central constants
│   │   ├── rule-constants.js       # Rule IDs & slugs
│   │   └── severity-constants.js   # Severity flags
│   │
│   ├── error-handler/              # Error handling system
│   │   ├── universal-reporter.js   # [NEW] Universal API
│   │   ├── context-capture.js      # [NEW] Auto-capture
│   │   ├── data-serializer.js      # [NEW] Auto-serialize
│   │   ├── binary-codes.js         # 64-bit binary codes
│   │   ├── binary-code-utils.js    # Binary operations
│   │   ├── binary-reporter.js      # Legacy reporter
│   │   ├── binary-error.grammar.js # Error grammar
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
