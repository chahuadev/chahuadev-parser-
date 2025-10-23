# Binary Error System - 100% Bitwise Operations

## Overview

Chahuadev Sentinel uses a **100% binary error system** for maximum performance and type safety. All error classifications use bitwise flags instead of string comparisons or range-based lookups.

## Architecture

### Error Code Structure (64-bit Composite)

```
┌─────────────┬─────────────┬──────────┬──────────┬────────────┐
│ Domain      │ Category    │ Severity │ Source   │ Offset     │
│ (16 bits)   │ (16 bits)   │ (8 bits) │ (8 bits) │ (16 bits)  │
├─────────────┼─────────────┼──────────┼──────────┼────────────┤
│ 0b...       │ 0b...       │ 0b...    │ 0b...    │ 0-65535    │
└─────────────┴─────────────┴──────────┴──────────┴────────────┘
   Bits 48-63   Bits 32-47   Bits 24-31 Bits 16-23  Bits 0-15
```

## Binary Flags

### 1. Severity Flags (8-bit)

```javascript
ERROR_SEVERITY_FLAGS = {
    LOW:      0b0001,  // 1
    MEDIUM:   0b0010,  // 2
    HIGH:     0b0100,  // 4
    CRITICAL: 0b1000   // 8
}
```

**Usage:**
```javascript
// Check if error is critical
if (severityFlag & ERROR_SEVERITY_FLAGS.CRITICAL) {
    // Handle critical error
}

// Check if HIGH or CRITICAL
if (severityFlag & (ERROR_SEVERITY_FLAGS.HIGH | ERROR_SEVERITY_FLAGS.CRITICAL)) {
    // Handle severe errors
}
```

### 2. Source Flags (8-bit)

```javascript
ERROR_SOURCE_CODES = {
    UNKNOWN:   0b00000000,  // 0
    VALIDATOR: 0b00000001,  // 1
    PARSER:    0b00000010,  // 2
    CLI:       0b00000100,  // 4
    SYSTEM:    0b00001000,  // 8
    SECURITY:  0b00010000,  // 16
    EXTENSION: 0b00100000   // 32
}
```

### 3. Domain Flags (16-bit)

```javascript
ERROR_DOMAIN_FLAGS = {
    UNKNOWN:        0b0000000000000000,  // 0
    VALIDATION:     0b0000000000000001,  // 1
    PARSER:         0b0000000000000010,  // 2
    TYPE_SYSTEM:    0b0000000000000100,  // 4
    REFERENCE:      0b0000000000001000,  // 8
    RUNTIME:        0b0000000000010000,  // 16
    LOGIC:          0b0000000000100000,  // 32
    FILE_SYSTEM:    0b0000000001000000,  // 64
    NETWORK:        0b0000000010000000,  // 128
    SECURITY:       0b0000000100000000,  // 256
    OBSERVABILITY:  0b0000001000000000   // 512
}
```

### 4. Category Flags (16-bit)

```javascript
ERROR_CATEGORY_FLAGS = {
    UNKNOWN:     0b0000000000000000,  // 0
    RULE:        0b0000000000000001,  // 1
    SYNTAX:      0b0000000000000010,  // 2
    TYPE:        0b0000000000000100,  // 4
    REFERENCE:   0b0000000000001000,  // 8
    RUNTIME:     0b0000000000010000,  // 16
    LOGICAL:     0b0000000000100000,  // 32
    FILE_SYSTEM: 0b0000000001000000,  // 64
    SECURITY:    0b0000000010000000   // 128
}
```

## Creating Error Codes

### Method 1: Composite Error Code

```javascript
import { createCompositeErrorCode } from './error-catalog.js';
import { 
    ERROR_DOMAIN_FLAGS, 
    ERROR_CATEGORY_FLAGS,
    ERROR_SOURCE_CODES 
} from './error-catalog.js';
import { ERROR_SEVERITY_FLAGS } from '../constants/severity-constants.js';

const errorCode = createCompositeErrorCode(
    ERROR_DOMAIN_FLAGS.PARSER,      // Domain
    ERROR_CATEGORY_FLAGS.SYNTAX,    // Category
    ERROR_SEVERITY_FLAGS.HIGH,      // Severity
    ERROR_SOURCE_CODES.PARSER,      // Source
    1001                            // Offset (specific error)
);
```

### Method 2: Helper Functions

```javascript
import { 
    createParserError,
    createValidatorError,
    createRuntimeError,
    createFileSystemError,
    createSecurityError
} from './binary-error-helpers.js';

// Parser error with HIGH severity
const parserError = createParserError(ERROR_SEVERITY_FLAGS.HIGH);

// Validator error with MEDIUM severity
const validatorError = createValidatorError(ERROR_SEVERITY_FLAGS.MEDIUM);

// Runtime error with CRITICAL severity
const runtimeError = createRuntimeError(ERROR_SEVERITY_FLAGS.CRITICAL);
```

## Extracting Components

```javascript
import { 
    extractDomainFlag,
    extractCategoryFlag,
    extractSeverityFlag,
    extractSourceFlag,
    extractOffset,
    decomposeErrorCode
} from './error-catalog.js';

const errorCode = 67239938;

// Extract individual components
const domain = extractDomainFlag(errorCode);     // 2 (PARSER)
const category = extractCategoryFlag(errorCode); // 2 (SYNTAX)
const severity = extractSeverityFlag(errorCode); // 4 (HIGH)
const source = extractSourceFlag(errorCode);     // 2 (PARSER)
const offset = extractOffset(errorCode);         // 0

// Or decompose all at once
const components = decomposeErrorCode(errorCode);
// {
//   domain: 2,
//   category: 2,
//   severity: 4,
//   source: 2,
//   offset: 0,
//   composite: 67239938
// }
```

## Filtering & Matching

### Basic Filtering

```javascript
import { 
    matchesDomain,
    matchesCategory,
    matchesSeverity,
    matchesSource
} from './error-catalog.js';

// Check if error is from PARSER domain
if (matchesDomain(errorCode, ERROR_DOMAIN_FLAGS.PARSER)) {
    console.log('Parser error detected');
}

// Check if error is SYNTAX category
if (matchesCategory(errorCode, ERROR_CATEGORY_FLAGS.SYNTAX)) {
    console.log('Syntax error detected');
}

// Check if error is HIGH or CRITICAL
if (matchesSeverity(errorCode, ERROR_SEVERITY_FLAGS.HIGH | ERROR_SEVERITY_FLAGS.CRITICAL)) {
    console.log('Severe error!');
}
```

### Advanced Filtering

```javascript
import { 
    isCriticalError,
    isCodeAnalysisError,
    isRuntimeError,
    isSystemError,
    isRuleViolation,
    isSyntaxError
} from './binary-error-helpers.js';

// Check if error is critical (HIGH or CRITICAL)
if (isCriticalError(errorCode)) {
    process.exit(1);
}

// Check if error is from code analysis (PARSER or VALIDATION)
if (isCodeAnalysisError(errorCode)) {
    showCodeHighlight();
}

// Check if error is a rule violation
if (isRuleViolation(errorCode)) {
    showRuleFix();
}
```

## Array Operations

### Filtering Arrays

```javascript
import { 
    filterBySeverity,
    filterByDomain,
    filterByCategory,
    sortBySeverity
} from './binary-error-helpers.js';

const errors = [
    createParserError(ERROR_SEVERITY_FLAGS.HIGH),
    createValidatorError(ERROR_SEVERITY_FLAGS.MEDIUM),
    createRuntimeError(ERROR_SEVERITY_FLAGS.CRITICAL)
];

// Get only critical errors
const criticalErrors = filterBySeverity(
    errors, 
    ERROR_SEVERITY_FLAGS.HIGH | ERROR_SEVERITY_FLAGS.CRITICAL
);

// Get only parser errors
const parserErrors = filterByDomain(errors, ERROR_DOMAIN_FLAGS.PARSER);

// Sort by severity (most severe first)
const sorted = sortBySeverity(errors);
```

### Grouping

```javascript
import { 
    groupByDomain,
    groupBySeverity
} from './binary-error-helpers.js';

// Group errors by domain
const domainGroups = groupByDomain(errors);
// Map {
//   2 => [parserError1, parserError2],
//   1 => [validatorError],
//   16 => [runtimeError]
// }

// Group errors by severity
const severityGroups = groupBySeverity(errors);
// Map {
//   4 => [highError1, highError2],
//   2 => [mediumError],
//   8 => [criticalError]
// }
```

## Statistics

```javascript
import { 
    countBySeverity,
    getMaxSeverity,
    hasAnyCriticalError
} from './binary-error-helpers.js';

const errors = [...]; // Array of error codes

// Count by severity
const counts = countBySeverity(errors);
// { LOW: 5, MEDIUM: 12, HIGH: 3, CRITICAL: 1 }

// Get highest severity
const maxSeverity = getMaxSeverity(errors);
// 8 (CRITICAL)

// Check if any critical error exists
if (hasAnyCriticalError(errors)) {
    console.error('CRITICAL ERRORS FOUND!');
    process.exit(1);
}
```

## Performance Benefits

### 1. Zero-Cost Abstraction
Binary flags compile to native integers - no overhead compared to raw numbers.

### 2. Fast Filtering
```javascript
// ❌ OLD: String comparison (slow)
if (error.domain === 'PARSER' || error.domain === 'VALIDATOR') { }

// ✅ NEW: Bitwise operation (fast)
if (errorCode & (DOMAIN_FLAGS.PARSER | DOMAIN_FLAGS.VALIDATOR)) { }
```

### 3. Compact Storage
One 64-bit number contains all error metadata - no objects needed.

### 4. Type Safety
TypeScript can enforce flag types at compile time.

## Migration Guide

### From Range-Based Codes

```javascript
// ❌ OLD
if (errorCode >= 1000 && errorCode <= 1999) {
    // PARSER domain
}

// ✅ NEW
if (matchesDomain(errorCode, ERROR_DOMAIN_FLAGS.PARSER)) {
    // PARSER domain
}
```

### From String-Based Categories

```javascript
// ❌ OLD
if (error.category === 'SYNTAX') {
    // Handle syntax
}

// ✅ NEW
if (matchesCategory(errorCode, ERROR_CATEGORY_FLAGS.SYNTAX)) {
    // Handle syntax
}
```

## Best Practices

1. **Always use flag constants** - Never hardcode binary literals
2. **Use helper functions** - Don't manually shift bits unless necessary
3. **Combine flags with OR (`|`)** - For multi-flag checks
4. **Check flags with AND (`&`)** - For matching operations
5. **Prefer helpers** - Use `isCriticalError()` over manual bit checks

## Examples

### Error Reporter with Binary Filtering

```javascript
import { 
    filterBySeverity,
    groupByDomain,
    sortBySeverity 
} from './binary-error-helpers.js';

class ErrorReporter {
    report(errors) {
        // Filter critical errors
        const critical = filterBySeverity(
            errors,
            ERROR_SEVERITY_FLAGS.HIGH | ERROR_SEVERITY_FLAGS.CRITICAL
        );
        
        if (critical.length > 0) {
            console.error(`🚨 ${critical.length} critical errors found!`);
            this.printErrors(sortBySeverity(critical));
        }
        
        // Group by domain
        const byDomain = groupByDomain(errors);
        for (const [domain, domainErrors] of byDomain) {
            console.log(`Domain ${domain}: ${domainErrors.length} errors`);
        }
    }
}
```

## References

- **error-catalog.js** - Core binary flag definitions
- **binary-error-helpers.js** - Helper functions
- **severity-constants.js** - Severity flags
- **rule-constants.js** - Rule binary IDs
