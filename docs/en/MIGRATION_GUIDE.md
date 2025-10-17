# Migration Guide: Binary-First Architecture

> **For Developers**: Why we migrated to Opcode & Decoder architecture and how to work with it

---

## Table of Contents

- [Why We Migrated](#why-we-migrated)
- [What Changed](#what-changed)
- [How to Add New Rules](#how-to-add-new-rules)
- [How to Add New Error Codes](#how-to-add-new-error-codes)
- [Migration Checklist](#migration-checklist)
- [Common Pitfalls](#common-pitfalls)
- [FAQ](#faq)

---

## Why We Migrated

### The Problem with String-Based Systems

Our original architecture used string literals for rule identifiers and error messages:

```javascript
//  OLD WAY: String-based (before migration)
const ruleId = 'NO_CONSOLE';
const severity = 'ERROR';

if (violation.ruleId === 'NO_CONSOLE') {
  console.error('Console usage detected');
}
```

**Problems we encountered:**

1. **Performance Issues**
   - String comparisons are 10-100x slower than integer comparisons
   - Every comparison requires byte-by-byte matching
   - Thousands of string comparisons per file slowed down parsing

2. **Typo Vulnerability**
   ```javascript
   // Silent failure - typo not caught until runtime
   if (ruleId === 'NO_CONSLE') { // Typo: CONSLE vs CONSOLE
     // This block never executes!
   }
   ```

3. **Memory Waste**
   - String `'NO_CONSOLE'` = 10+ bytes
   - Integer `64` = 4-8 bytes
   - Multiplied across thousands of violations = significant memory

4. **No Type Safety**
   - IDE autocomplete couldn't help
   - No compile-time validation
   - Refactoring was error-prone

5. **Internationalization Challenges**
   - Error messages hardcoded in English
   - Adding Thai/other languages required code changes everywhere

### The Solution: Binary-First Architecture

```javascript
//  NEW WAY: Opcode-based (after migration)
import { RULE_IDS } from './constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from './constants/severity-constants.js';

const ruleId = RULE_IDS.NO_CONSOLE;  // 64 (binary opcode)
const severity = RULE_SEVERITY_FLAGS.ERROR;  // 4 (binary opcode)

if (violation.ruleId === RULE_IDS.NO_CONSOLE) {
  // Instant integer comparison, type-safe, IDE autocomplete works!
}
```

**Benefits achieved:**

-  **10-100x faster** integer comparisons
-  **Type-safe** with IDE autocomplete
-  **Typo-proof** (compile-time errors)
-  **Memory efficient** (4-8 bytes vs 10-100+ bytes)
-  **i18n ready** (decoder handles all languages)

---

## What Changed

### Phase-by-Phase Migration

We completed migration in **6 phases**:

#### Phase 1: Foundation (COMPLETE )
- Created `src/constants/rule-constants.js` - Central rule opcode registry
- Created `src/constants/severity-constants.js` - Severity opcode registry
- Established binary bitmask system

#### Phase 2: Core Rules (COMPLETE )
- Migrated 3 high-priority rules to use opcodes:
  - `NO_EMOJI.js`
  - `NO_CONSOLE.js`
  - `MUST_HANDLE_ERRORS.js`

#### Phase 3: Validator & CLI (COMPLETE )
- Updated `validator.js` to use opcodes
- Updated `cli.js` to use opcodes
- All rule checks now use `RULE_IDS` constants

#### Phase 4: Complete Rule Migration (COMPLETE )
- Migrated remaining 7 rules:
  - `BINARY_AST_ONLY.js`
  - `NO_HARDCODE.js`
  - `NO_INTERNAL_CACHING.js`
  - `NO_MOCKING.js`
  - `NO_SILENT_FALLBACKS.js`
  - `NO_STRING.js`
  - `STRICT_COMMENT_STYLE.js`
- Removed deprecated `src/rules/rule-constants.js` (duplicate file)

#### Phase 5: Error Handler & Decoder (COMPLETE )
- Created 4-layer ErrorHandler architecture:
  1. **Binary Intake Layer** - Receives opcodes
  2. **Normalization Layer** - Validates opcodes
  3. **Rendering Layer** - Decodes to human-readable
  4. **Transport Layer** - Logs/sends errors
- Created `error-dictionary.js` with bilingual support (EN/TH)
- Implemented 7 error dictionaries:
  - `RULE_ERROR_DICTIONARY` (10 rules)
  - `SYNTAX_ERROR_DICTIONARY` (codes 1001-1099)
  - `TYPE_ERROR_DICTIONARY` (codes 2001-2099)
  - `REFERENCE_ERROR_DICTIONARY` (codes 3001-3099)
  - `RUNTIME_ERROR_DICTIONARY` (codes 4001-4099)
  - `LOGICAL_ERROR_DICTIONARY` (codes 5001-5099)
  - `FILE_SYSTEM_ERROR_DICTIONARY` (codes 6001-6099)

#### Phase 6: Documentation (COMPLETE )
- Updated README.md with Opcode & Decoder architecture
- Created Migration Guide (this document)
- Updated bilingual documentation (EN/TH)

---

## How to Add New Rules

### Step 1: Register Opcode in `src/constants/rule-constants.js`

```javascript
// 1. Add to RULE_BITMASKS
export const RULE_BITMASKS = Object.freeze({
    NO_MOCKING:        0b0000000000000001,
    // ... existing rules ...
    MUST_HANDLE_ERRORS: 0b0000001000000000,
    
    //  NEW RULE: Use next power of 2
    YOUR_NEW_RULE:     0b0000010000000000  // Next: 2^10 = 1024
});

// 2. Add to RULE_IDS
export const RULE_IDS = Object.freeze({
    NO_MOCKING: RULE_BITMASKS.NO_MOCKING,
    // ... existing rules ...
    YOUR_NEW_RULE: RULE_BITMASKS.YOUR_NEW_RULE
});

// 3. Add to RULE_SLUGS (for decoding opcode  string)
export const RULE_SLUGS = Object.freeze({
    [RULE_BITMASKS.NO_MOCKING]: 'NO_MOCKING',
    // ... existing rules ...
    [RULE_BITMASKS.YOUR_NEW_RULE]: 'YOUR_NEW_RULE'
});
```

### Step 2: Create Rule File `src/rules/YOUR_NEW_RULE.js`

```javascript
//  Template for new rules
import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from '../constants/severity-constants.js';

export function YOUR_NEW_RULE(node, context) {
  // Your validation logic here
  if (violationDetected) {
    return {
      ruleId: RULE_IDS.YOUR_NEW_RULE,  // Use opcode
      severity: RULE_SEVERITY_FLAGS.ERROR,  // Use opcode
      message: 'Violation detected',  // Optional: will be overridden by decoder
      node,
      position: node.loc
    };
  }
  
  return null;  // No violation
}

// Export metadata
YOUR_NEW_RULE.meta = {
  ruleId: RULE_IDS.YOUR_NEW_RULE,
  slug: resolveRuleSlug(RULE_IDS.YOUR_NEW_RULE),
  severity: RULE_SEVERITY_FLAGS.ERROR,
  category: 'best-practices',
  description: 'Description of your rule'
};
```

### Step 3: Add Error Messages to `src/error-handler/error-dictionary.js`

```javascript
// Add to RULE_ERROR_DICTIONARY
export const RULE_ERROR_DICTIONARY = Object.freeze({
  [RULE_IDS.NO_MOCKING]: {
    en: 'Mocking detected in production code',
    th: 'พบการใช้ mocking ในโค้ดจริง'
  },
  // ... existing rules ...
  
  //  Add your rule
  [RULE_IDS.YOUR_NEW_RULE]: {
    en: 'English error message',
    th: 'ข้อความ error ภาษาไทย'
  }
});
```

### Step 4: Register in Validator `src/rules/validator.js`

```javascript
import { YOUR_NEW_RULE } from './YOUR_NEW_RULE.js';

// Add to rules array
const allRules = [
  NO_MOCKING,
  NO_HARDCODE,
  // ... existing rules ...
  YOUR_NEW_RULE  //  Add here
];
```

### Step 5: Test Your Rule

```javascript
// Create test file: __tests__/rules/YOUR_NEW_RULE.test.js
import { YOUR_NEW_RULE } from '../../src/rules/YOUR_NEW_RULE.js';
import { RULE_IDS } from '../../src/constants/rule-constants.js';

describe('YOUR_NEW_RULE', () => {
  it('should detect violations', () => {
    const node = createTestNode(); // Your test node
    const result = YOUR_NEW_RULE(node);
    
    expect(result).not.toBeNull();
    expect(result.ruleId).toBe(RULE_IDS.YOUR_NEW_RULE);
  });
});
```

---

## How to Add New Error Codes

### Error Code Ranges

We use **numbered error codes** organized by category:

| Category | Code Range | Example |
|----------|------------|---------|
| Syntax Errors | 1001-1099 | 1001: Missing semicolon |
| Type Errors | 2001-2099 | 2001: Type mismatch |
| Reference Errors | 3001-3099 | 3001: Undefined variable |
| Runtime Errors | 4001-4099 | 4001: Null pointer |
| Logical Errors | 5001-5099 | 5001: Infinite loop |
| File System Errors | 6001-6099 | 6001: File not found |

### Step 1: Choose Error Code

```javascript
// Find next available code in your category
// Example: Adding a new Syntax Error

// Existing codes in SYNTAX_ERROR_DICTIONARY:
// 1001, 1002, 1003, ... 1010

// Next available: 1011
const NEW_ERROR_CODE = 1011;
```

### Step 2: Add to Error Dictionary

```javascript
// In src/error-handler/error-dictionary.js

export const SYNTAX_ERROR_DICTIONARY = Object.freeze({
  1001: {
    en: 'Missing semicolon',
    th: 'ขาดเครื่องหมาย semicolon'
  },
  // ... existing errors ...
  
  //  Add your error
  1011: {
    en: 'Your error description in English',
    th: 'คำอธิบาย error ภาษาไทย',
    suggestion: {  // Optional
      en: 'How to fix this error',
      th: 'วิธีแก้ไข error นี้'
    }
  }
});
```

### Step 3: Use in Code

```javascript
import { errorHandler } from './error-handler/ErrorHandler.js';
import { resolveErrorMessage } from './error-handler/error-dictionary.js';

function parseStatement() {
  if (syntaxError) {
    const error = new Error('Syntax error');
    error.code = 1011;  // Your error code
    
    errorHandler.handleError(error, {
      source: 'Parser',
      method: 'parseStatement',
      severity: RULE_SEVERITY_FLAGS.ERROR,
      errorCode: 1011
    });
    
    // Get bilingual message
    const message = resolveErrorMessage(1011, 'en');
    // "Your error description in English"
  }
}
```

---

## Migration Checklist

Use this checklist when migrating existing code to Binary-First architecture:

### For Each File

- [ ] Remove all string literal rule IDs (`'NO_CONSOLE'`  `RULE_IDS.NO_CONSOLE`)
- [ ] Remove all string literal severities (`'ERROR'`  `RULE_SEVERITY_FLAGS.ERROR`)
- [ ] Add imports from `src/constants/rule-constants.js`
- [ ] Add imports from `src/constants/severity-constants.js`
- [ ] Update all rule checks to use opcode comparison
- [ ] Use decoder functions (`resolveRuleSlug`, `resolveErrorMessage`) only at output layer
- [ ] Remove any local constant definitions
- [ ] Update tests to use opcodes

### Example Migration

**BEFORE (String-based):**
```javascript
//  OLD CODE
function checkRule(node) {
  if (node.type === 'CallExpression') {
    return {
      ruleId: 'NO_CONSOLE',  // String literal
      severity: 'ERROR'      // String literal
    };
  }
}

if (violation.ruleId === 'NO_CONSOLE') {  // String comparison
  console.error('Console usage detected');
}
```

**AFTER (Opcode-based):**
```javascript
//  NEW CODE
import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from '../constants/severity-constants.js';
import { resolveErrorMessage } from '../error-handler/error-dictionary.js';

function checkRule(node) {
  if (node.type === 'CallExpression') {
    return {
      ruleId: RULE_IDS.NO_CONSOLE,  // Opcode
      severity: RULE_SEVERITY_FLAGS.ERROR  // Opcode
    };
  }
}

if (violation.ruleId === RULE_IDS.NO_CONSOLE) {  // Integer comparison
  const message = resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'en');
  console.error(message);
}
```

---

## Common Pitfalls

###  Pitfall 1: String Comparison After Migration

```javascript
//  WRONG: Comparing opcode with string
import { RULE_IDS } from '../constants/rule-constants.js';

if (violation.ruleId === 'NO_CONSOLE') {  // String vs Integer!
  // This will NEVER match!
}

//  CORRECT: Compare opcode with opcode
if (violation.ruleId === RULE_IDS.NO_CONSOLE) {
  // This works!
}
```

###  Pitfall 2: Creating Local Constants

```javascript
//  WRONG: Redefining constants locally
const NO_CONSOLE = 'NO_CONSOLE';  // Don't do this!

//  CORRECT: Import from central registry
import { RULE_IDS } from '../constants/rule-constants.js';
```

###  Pitfall 3: Decoding Too Early

```javascript
//  WRONG: Decoding during execution
import { resolveRuleSlug } from '../constants/rule-constants.js';

function processViolation(violation) {
  const slug = resolveRuleSlug(violation.ruleId);  // Too early!
  
  // Now you're back to string comparisons!
  if (slug === 'NO_CONSOLE') { ... }
}

//  CORRECT: Keep opcodes, decode only at output
function processViolation(violation) {
  // Work with opcodes
  if (violation.ruleId === RULE_IDS.NO_CONSOLE) { ... }
  
  return violation;  // Still opcode
}

function formatOutput(violations, lang) {
  // Decode ONLY here
  return violations.map(v => ({
    rule: resolveRuleSlug(v.ruleId),
    message: resolveErrorMessage(v.ruleId, lang)
  }));
}
```

###  Pitfall 4: Hardcoding Binary Values

```javascript
//  WRONG: Hardcoding binary literals
if (ruleId === 0b0000000001000000) {  // What rule is this?
  // Unreadable!
}

//  CORRECT: Use named constants
if (ruleId === RULE_IDS.NO_CONSOLE) {  // Clear and readable
  // Much better!
}
```

###  Pitfall 5: Forgetting Bilingual Support

```javascript
//  WRONG: Hardcoded English message
console.error('Console usage detected');

//  CORRECT: Use decoder with language parameter
import { resolveErrorMessage } from '../error-handler/error-dictionary.js';

const userLang = getUserLanguage();  // 'en' or 'th'
const message = resolveErrorMessage(RULE_IDS.NO_CONSOLE, userLang);
console.error(message);
```

---

## FAQ

### Q: Why binary bitmasks instead of sequential numbers?

**A:** Bitmasks enable **bitwise operations**:

```javascript
// Combine multiple rules
const enabledRules = RULE_IDS.NO_CONSOLE | RULE_IDS.NO_EMOJI;

// Check if rule is enabled
if (enabledRules & RULE_IDS.NO_CONSOLE) {
  // NO_CONSOLE is enabled
}
```

Sequential numbers (1, 2, 3...) can't do this efficiently.

### Q: What if I run out of bits?

**A:** JavaScript numbers are 53-bit safe integers. We're using 10-bit bitmasks, so we can support **up to 53 rules** before needing to switch strategies.

Current usage: **10 rules** (bits 0-9)  
Available: **43 more rules** (bits 10-52)

If we exceed 53 rules (unlikely), we can:
- Use BigInt for unlimited bits
- Switch to category-based bitmasks
- Use composite keys

### Q: How do I debug opcode values?

**A:** Use the decoder functions:

```javascript
import { resolveRuleSlug } from '../constants/rule-constants.js';

console.log('Rule ID:', ruleId);  // 64
console.log('Rule Slug:', resolveRuleSlug(ruleId));  // 'NO_CONSOLE'
console.log('Binary:', ruleId.toString(2));  // '1000000'
```

### Q: Can I use opcodes with TypeScript?

**A:** Yes! TypeScript works great with opcodes:

```typescript
// src/constants/rule-constants.d.ts
export const RULE_IDS: {
  readonly NO_MOCKING: number;
  readonly NO_CONSOLE: number;
  // ... etc
};

// Full type safety and autocomplete!
import { RULE_IDS } from './constants/rule-constants.js';

const ruleId: number = RULE_IDS.NO_CONSOLE;  // Type-safe
```

### Q: What about backwards compatibility?

**A:** We maintained a decoder layer specifically for backwards compatibility:

```javascript
// Old code using strings still works via adapter
function legacyAdapter(stringRuleId) {
  // Convert string  opcode
  const opcode = Object.entries(RULE_SLUGS)
    .find(([_, slug]) => slug === stringRuleId)?.[0];
  
  return parseInt(opcode);
}

// Usage
const opcode = legacyAdapter('NO_CONSOLE');  // 64
```

### Q: How do I add a new language?

**A:** Add to error dictionary:

```javascript
// In error-dictionary.js
export const RULE_ERROR_DICTIONARY = Object.freeze({
  [RULE_IDS.NO_CONSOLE]: {
    en: 'Console usage detected',
    th: 'พบการใช้ console',
    es: 'Uso de consola detectado',  //  Add Spanish
    ja: 'コンソールの使用が検出されました'  //  Add Japanese
  }
});

// Then use:
resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'es');  // Spanish message
resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'ja');  // Japanese message
```

---

## Summary

### Key Takeaways

1. **Always use opcodes** (integers) instead of strings in execution path
2. **Decode only at output layer** (logging, display)
3. **Import from `src/constants/`** - never create local constants
4. **Use decoder functions** for human-readable output
5. **Add bilingual support** for all error messages

### Migration is Complete! 

All core files have been migrated to Binary-First architecture:
-  10 validation rules using opcodes
-  Central constants in `src/constants/`
-  4-layer ErrorHandler with decoder
-  Bilingual error dictionary (EN/TH)
-  Updated documentation

### Next Steps for Developers

1. **Read this guide** before making changes
2. **Follow the patterns** shown in existing code
3. **Use the checklists** when adding new rules/errors
4. **Keep opcodes** throughout execution
5. **Decode at the last moment** before output

---

**Questions?** Check the [Architecture Documentation](./ARCHITECTURE.md) or [Binary Migration Status](./BINARY_MIGRATION_STATUS.md).

**Happy coding!** 
