# Error Reporting Guide

**Chahuadev Sentinel - Binary Error Reporting System**

This guide explains how to use the simplified error reporting system in Chahuadev Sentinel.

---

## 🎯 Quick Start

Every file that needs to report errors should use this simple pattern:

```javascript
// Import at the top of your file
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';

// Report errors anywhere in your code
report(BinaryCodes.DOMAIN.CATEGORY(offset), { error, ...context });
```

**That's it!** No need to:
- ❌ Pass `{ collect: true }`
- ❌ Pass `{ collector: this.errorCollector }`
- ❌ Manually create collectors in every file

The system **auto-injects** the Global Error Collector automatically.

---

## 📦 Import Patterns by File Type

### 1️⃣ **Regular Files** (90% of files)

Files that just need to report errors.

**Examples:** Validators, parsers, utilities, security handlers

```javascript
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';

// Usage
function validateInput(input) {
    if (!input) {
        report(BinaryCodes.VALIDATOR.VALIDATION(15001), { 
            input, 
            expected: 'non-empty string' 
        });
        return false;
    }
    return true;
}
```

**Path adjustment:** Use `../ ` based on your file location:
- `src/rules/*.js` → `../error-handler/`
- `src/grammars/shared/*.js` → `../../error-handler/`
- `src/security/*.js` → `../error-handler/`

---

### 2️⃣ **Files with Custom Error Collector**

Files that need their own error collector for batch processing.

**Examples:** Validators that collect all errors before returning

```javascript
import { report } from '../error-handler/universal-reporter.js';
import BinaryCodes from '../error-handler/binary-codes.js';
import { ErrorCollector } from '../error-handler/error-collector.js';

class Validator {
    constructor() {
        // Create custom collector
        this.errorCollector = new ErrorCollector({
            streamMode: false,      // Batch mode
            throwOnCritical: true
        });
    }

    validate(data) {
        // Report with custom collector
        report(BinaryCodes.VALIDATOR.VALIDATION(15002), 
            { data }, 
            { collector: this.errorCollector }  // Override global collector
        );

        // Get all errors at the end
        return this.errorCollector.generateReport();
    }
}
```

**Note:** You can still override the global collector by passing `{ collector: customCollector }` as the 3rd parameter.

---

### 3️⃣ **Main Entry Points** (CLI, Extension)

Files that initialize the Global Error Collector.

**Examples:** `cli.js`, `extension.js`

```javascript
import { report, setGlobalCollector } from './src/error-handler/universal-reporter.js';
import BinaryCodes from './src/error-handler/binary-codes.js';
import { ErrorCollector } from './src/error-handler/error-collector.js';

class Application {
    constructor() {
        // Create and register global collector
        this.errorCollector = new ErrorCollector({
            streamMode: true,        // Write logs immediately
            throwOnCritical: false,  // Don't throw, just collect
            maxErrors: 10000
        });
        
        // 🔥 IMPORTANT: Register as global collector
        setGlobalCollector(this.errorCollector);
    }

    run() {
        // Now all report() calls auto-use this collector
        report(BinaryCodes.SYSTEM.RUNTIME(15001), { error });
    }
}
```

**Only import `setGlobalCollector` in main entry points!**

---

### 4️⃣ **Files with Only Binary Codes**

Files that only need error code definitions (no reporting).

**Examples:** Configuration files, constants

```javascript
import BinaryCodes from '../error-handler/binary-codes.js';

// Just use codes without reporting
const ERROR_CODE = BinaryCodes.PARSER.SYNTAX(1001);
```

---

## 🔢 Binary Code Structure

All error codes follow this pattern:

```javascript
BinaryCodes.DOMAIN.CATEGORY(offset)
```

### Available Domains

| Domain | Description | Example |
|--------|-------------|---------|
| `SYSTEM` | System-level errors | `BinaryCodes.SYSTEM.RUNTIME(15001)` |
| `PARSER` | Grammar/syntax parsing | `BinaryCodes.PARSER.SYNTAX(1001)` |
| `VALIDATOR` | Validation errors | `BinaryCodes.VALIDATOR.VALIDATION(15001)` |
| `SECURITY` | Security violations | `BinaryCodes.SECURITY.PERMISSION(10001)` |
| `IO` | File I/O operations | `BinaryCodes.IO.RESOURCE_NOT_FOUND(15002)` |
| `RUNTIME` | Runtime execution | `BinaryCodes.RUNTIME.LOGIC(4001)` |

### Available Categories

| Category | Description | Used With |
|----------|-------------|-----------|
| `SYNTAX` | Syntax errors | PARSER |
| `VALIDATION` | Validation failures | PARSER, VALIDATOR |
| `RUNTIME` | Runtime errors | SYSTEM, RUNTIME |
| `CONFIGURATION` | Config errors | SYSTEM |
| `LOGIC` | Logic errors | VALIDATOR, RUNTIME |
| `PERMISSION` | Permission denied | SECURITY, IO |
| `RESOURCE_NOT_FOUND` | Resource missing | IO |
| `RESOURCE_UNAVAILABLE` | Resource unavailable | IO |

---

## 📝 Context Object

Always provide useful context when reporting errors:

```javascript
// ✅ Good: Rich context
report(BinaryCodes.IO.RESOURCE_NOT_FOUND(15002), {
    filePath: '/path/to/file.js',
    operation: 'read',
    error: originalError
});

// ❌ Bad: No context
report(BinaryCodes.IO.RESOURCE_NOT_FOUND(15002), {});
```

### Common Context Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `error` | Error | Original error object | `{ error: err }` |
| `filePath` | string | File path | `{ filePath: '/src/file.js' }` |
| `line` | number | Line number | `{ line: 42 }` |
| `column` | number | Column number | `{ column: 10 }` |
| `expected` | any | Expected value | `{ expected: 'string' }` |
| `actual` | any | Actual value | `{ actual: null }` |
| `operation` | string | Operation name | `{ operation: 'parse' }` |

---

## 🔄 Migration from Old System

### Old Pattern (❌ Deprecated)

```javascript
import { reportError } from '../error-handler/binary-reporter.js';

reportError(BinaryCodes.VALIDATOR.VALIDATION(15001), 
    { error },
    { collect: true, collector: this.errorCollector }  // ❌ Manual collector
);
```

### New Pattern (✅ Recommended)

```javascript
import { report } from '../error-handler/universal-reporter.js';

report(BinaryCodes.VALIDATOR.VALIDATION(15001), { error });
// ✅ Auto-collects using global collector
```

### Migration Tool

Use the automated migration tool:

```bash
# Check which files need migration
node tools/check-error-reporting.js

# Migrate all files automatically (with backups)
node tools/migrate-error-reporting.js

# Verify migration
node tools/check-error-reporting.js
```

---

## 🎛️ Advanced Usage

### Override Global Collector

```javascript
const customCollector = new ErrorCollector({ streamMode: false });

report(BinaryCodes.VALIDATOR.VALIDATION(15001), 
    { error },
    { collector: customCollector }  // Override global
);
```

### Disable Auto-Collection

```javascript
report(BinaryCodes.SYSTEM.RUNTIME(15001), 
    { error },
    { collect: false }  // Don't collect, just log
);
```

### Register Context-Specific Collectors

```javascript
import { registerCollector, report } from '../error-handler/universal-reporter.js';

const parserCollector = new ErrorCollector({ maxErrors: 1000 });
registerCollector('parser', parserCollector);

// Use context-specific collector
report(BinaryCodes.PARSER.SYNTAX(1001), 
    { error },
    { context: 'parser' }  // Uses parserCollector
);
```

---

## 🧪 Testing

### Verify Error Reporting Works

```javascript
import { report, setGlobalCollector } from './src/error-handler/universal-reporter.js';
import { ErrorCollector } from './src/error-handler/error-collector.js';
import BinaryCodes from './src/error-handler/binary-codes.js';

// Setup
const collector = new ErrorCollector({ streamMode: true });
setGlobalCollector(collector);

// Test
report(BinaryCodes.SYSTEM.RUNTIME(90001), { 
    test: 'Hello World' 
});

// Verify
const summary = collector.generateReport();
console.log(`Collected ${summary.summary.totalErrors} errors`);
```

### Check Logs

All errors are written to:

```
logs/errors/
  ├── critical.log    # CRITICAL severity
  ├── error.log       # ERROR severity
  └── warning.log     # WARNING severity
```

---

## ✅ Best Practices

### DO ✅

1. **Always import both `report` and `BinaryCodes`**
   ```javascript
   import { report } from '../error-handler/universal-reporter.js';
   import BinaryCodes from '../error-handler/binary-codes.js';
   ```

2. **Use descriptive context**
   ```javascript
   report(BinaryCodes.VALIDATOR.VALIDATION(15001), {
       error,
       filePath,
       expected: 'non-empty array',
       actual: input
   });
   ```

3. **Choose correct Domain and Category**
   ```javascript
   // ✅ Correct
   report(BinaryCodes.IO.RESOURCE_NOT_FOUND(15002), { filePath });
   
   // ❌ Wrong domain/category
   report(BinaryCodes.SYSTEM.RUNTIME(15002), { filePath });
   ```

4. **Let the system auto-collect**
   ```javascript
   // ✅ Simple - auto-collects
   report(BinaryCodes.VALIDATOR.LOGIC(15003), { error });
   ```

### DON'T ❌

1. **Don't use `reportError` (old API)**
   ```javascript
   // ❌ Old API - deprecated
   import { reportError } from '../error-handler/binary-reporter.js';
   reportError(...);
   ```

2. **Don't pass collector manually unless needed**
   ```javascript
   // ❌ Unnecessary
   report(BinaryCodes.SYSTEM.RUNTIME(15001), 
       { error },
       { collect: true, collector: this.errorCollector }
   );
   
   // ✅ Let it auto-inject
   report(BinaryCodes.SYSTEM.RUNTIME(15001), { error });
   ```

3. **Don't import `setGlobalCollector` in regular files**
   ```javascript
   // ❌ Only for main entry points!
   import { report, setGlobalCollector } from '...';
   ```

---

## 🔍 Troubleshooting

### Error: "Global collector not set"

**Problem:** No global collector was registered.

**Solution:** Make sure your main file calls `setGlobalCollector()`:

```javascript
// In cli.js or extension.js
const collector = new ErrorCollector({ streamMode: true });
setGlobalCollector(collector);
```

### Errors not being collected

**Problem:** Errors are logged but not collected.

**Solution:** Check if you're passing `{ collect: false }`:

```javascript
// ❌ This disables collection
report(code, context, { collect: false });

// ✅ Remove the options or set collect: true
report(code, context);
```

### Wrong import paths

**Problem:** Cannot find module `../error-handler/universal-reporter.js`

**Solution:** Adjust path based on your file location:

```javascript
// From src/rules/
import { report } from '../error-handler/universal-reporter.js';

// From src/grammars/shared/
import { report } from '../../error-handler/universal-reporter.js';

// From root (cli.js)
import { report } from './src/error-handler/universal-reporter.js';
```

---

## 📚 Related Documentation

- [Binary Error Grammar](../../src/error-handler/binary-error.grammar.js) - Complete error code structure
- [Universal Reporter API](../../src/error-handler/universal-reporter.js) - Full API documentation
- [Error Collector](../../src/error-handler/error-collector.js) - Collector implementation

---

## 🆘 Support

If you encounter issues:

1. Run the checker: `node tools/check-error-reporting.js`
2. Check logs: `logs/errors/*.log`
3. Verify imports are correct
4. Ensure global collector is set in main entry point

---

**Last Updated:** October 29, 2025  
**Version:** 2.0.0  
**Author:** Chahua Development Co., Ltd.
