#  REFACTOR TODO: Remove All Hardcoded Constants

**Created:** 2025-10-14  
**Priority:** HIGH  
**Goal:** Enforce NO_HARDCODE rule by integrating `constants.js` throughout entire codebase

---

##  Overview

**Problem:** ไฟล์ `constants.js` ถูกสร้างขึ้นเพื่อเป็น single source of truth แต่ไม่มีไฟล์ใดใช้มัน! ทุกไฟล์ยังคง hardcode ค่าต่างๆ อยู่

**Irony:** ไฟล์ที่สร้างมาเพื่อบังคับกฎ NO_HARDCODE กลับไม่ถูกใช้ = การละเมิด NO_HARDCODE!

**Solution:** Refactor ทุกไฟล์ให้ import จาก `constants.js` แทนการ hardcode

---

##  Phase 1: Constants File Upgrade (COMPLETED)

- [x]  แปลง `constants.js` เป็น Binary 100% encoding
  - [x] RULE_IDS: 5-bit binary encoding (0b00001 - 0b10000)
  - [x] ERROR_TYPES: 6-bit binary encoding with categories
  - [x] SEVERITY_LEVELS: 2-bit binary encoding (0-3)
  - [x] TOKEN_TYPES: 6-bit binary encoding (matches tokenizer config)
  - [x] ENGINE_MODES: 2-bit binary encoding
  - [x] Helper functions: `isRuleEnabled()`, `getSeverityCode()`, `getRuleIdByCode()`
  - [x] Backward compatibility layer: `RULE_IDS_LEGACY`, etc.

---

##  Phase 2: Rule Files Refactor

**Target Files:** `src/rules/*.js` (5 files)

### Files to Refactor:
1. [ ] `NO_MOCKING.js`
2. [ ] `NO_HARDCODE.js`
3. [ ] `NO_SILENT_FALLBACKS.js`
4. [ ] `NO_INTERNAL_CACHING.js`
5. [ ] `NO_EMOJI.js`

### Current Pattern (HARDCODED):
```javascript
const ABSOLUTE_RULES = {
    ruleId: 'NO_MOCKING',
    severity: 'CRITICAL',
    // ... more hardcoded strings
};
```

### New Pattern (FROM CONSTANTS):
```javascript
import { RULE_IDS, SEVERITY_LEVELS } from '../grammars/shared/constants.js';

const ABSOLUTE_RULES = {
    ruleId: RULE_IDS.NO_MOCKING.id,        // Binary: 0b00001
    ruleBinary: RULE_IDS.NO_MOCKING.binary, // For bitwise operations
    severity: SEVERITY_LEVELS.CRITICAL.id,  // Binary: 0b11
    severityCode: SEVERITY_LEVELS.CRITICAL.code, // Numeric: 3
    // ... use constants everywhere
};
```

### Checklist per File:
- [ ] Import `RULE_IDS` from constants.js
- [ ] Replace hardcoded `ruleId: 'NO_XXX'` with `RULE_IDS.NO_XXX.id`
- [ ] Import `SEVERITY_LEVELS` from constants.js
- [ ] Replace hardcoded `severity: 'CRITICAL'` with `SEVERITY_LEVELS.CRITICAL.id`
- [ ] Add binary codes for bitwise operations
- [ ] Test rule still works correctly

---

##  Phase 3: Validator.js Refactor

**Target File:** `src/rules/validator.js`

### Current Issues:
- Imports individual rule files and combines them
- Uses hardcoded severity strings like `'CRITICAL'`, `'HIGH'`, `'MEDIUM'`

### Required Changes:
- [ ] Import `SEVERITY_LEVELS` from constants.js
- [ ] Replace all hardcoded severity strings:
  ```javascript
  // OLD:
  severity: 'CRITICAL'
  
  // NEW:
  severity: SEVERITY_LEVELS.CRITICAL.id,
  severityCode: SEVERITY_LEVELS.CRITICAL.code
  ```
- [ ] Use numeric comparison for severity checks:
  ```javascript
  // OLD:
  if (severity === 'CRITICAL')
  
  // NEW:
  if (severityCode >= SEVERITY_LEVELS.ERROR.code)
  ```

---

##  Phase 4: Error Handler Refactor

**Target Files:** 
- `src/error-handler/ErrorHandler.js`
- `src/error-handler/error-handler-config.js`
- `src/error-handler/ast-error-detection-validator.js`

### Current Issues:
- Hardcoded severity strings throughout
- Hardcoded error type strings

### Required Changes:
- [ ] Import `SEVERITY_LEVELS` and `ERROR_TYPES` from constants.js
- [ ] Replace all hardcoded severity strings in error handling
- [ ] Replace all hardcoded error type strings
- [ ] Update error-handler-config.js to use binary constants
- [ ] Use numeric severity codes for filtering/comparison

---

##  Phase 5: Tokenizer System Refactor

**Target Files:**
- `src/grammars/shared/tokenizer-helper.js`
- `src/grammars/shared/tokenizer-binary-config.json` (keep but reference)

### Current Issues:
- tokenizer-helper.js loads TOKEN_TYPES from JSON config
- TOKEN_TYPES defined in BOTH constants.js AND tokenizer-binary-config.json

### Strategy Decision Needed:
**Option A:** Keep JSON as primary, import constants.js for validation only
**Option B:** Use constants.js as primary, remove TOKEN_TYPES from JSON
**Option C:** Generate JSON from constants.js at build time

### Recommended: Option A (Low Risk)
- [ ] Keep tokenizer-binary-config.json as data source
- [ ] Import TOKEN_TYPES from constants.js for type checking
- [ ] Validate JSON config matches constants.js definitions
- [ ] Add warning if mismatch detected

---

##  Phase 6: Parser System Refactor

**Target Files:**
- `src/grammars/shared/pure-binary-parser.js`
- `src/grammars/shared/enhanced-binary-parser.js`
- `src/grammars/shared/grammar-index.js`
- `src/grammars/shared/binary-scout.js`

### Current Issues:
- Hardcoded error messages with severity strings
- Direct string comparisons for error types

### Required Changes:
- [ ] Import `ERROR_TYPES` and `SEVERITY_LEVELS`
- [ ] Replace hardcoded error handling with constants
- [ ] Use binary codes for error categorization
- [ ] Update all errorHandler.handleError() calls to use constants

---

##  Phase 7: Testing & Validation Tools Refactor

**Target Files:**
- `src/grammars/shared/logger.js`
- `src/grammars/shared/corpus-tester.js`
- `src/grammars/shared/validate-grammars.js`
- `src/grammars/shared/performance-benchmarks.js`

### Required Changes:
- [ ] Import constants where severity/error types are used
- [ ] Replace hardcoded strings in log messages (where applicable)
- [ ] Keep human-readable output but use constants internally

---

##  Phase 8: Extension & CLI Refactor

**Target Files:**
- `src/extension.js`
- `cli.js`
- `src/security/security-middleware.js`
- `src/security/security-manager.js`

### Required Changes:
- [ ] Import constants for rule checking
- [ ] Use binary rule masks for efficient checking
- [ ] Replace hardcoded severity comparisons

---

##  Phase 9: Configuration Files Sync

**Target Files:**
- `src/extension-config.json`
- `cli-config.json`
- `src/grammars/shared/parser-config.json`

### Strategy:
- [ ] Keep JSON configs for user customization
- [ ] Add validation that references constants.js
- [ ] Document that config values must match constants.js definitions

---

##  Phase 10: Documentation & Testing

### Documentation:
- [ ] Add migration guide for developers
- [ ] Document binary encoding system
- [ ] Update README with constants.js usage examples
- [ ] Add JSDoc comments explaining backward compatibility

### Testing:
- [ ] Test all rule files work with new constants
- [ ] Test validator with binary operations
- [ ] Test error handler with numeric severity codes
- [ ] Test tokenizer still works correctly
- [ ] Test parsers with binary error types
- [ ] Run full CLI test suite
- [ ] Performance benchmark (binary should be faster)

### Validation:
- [ ] Grep search for remaining hardcoded strings:
  ```bash
  grep -r "severity.*:.*['\"]CRITICAL['\"]" src/
  grep -r "ruleId.*:.*['\"]NO_" src/
  grep -r "['\"]SYNTAX_ERROR['\"]" src/
  ```
- [ ] Check all imports reference constants.js
- [ ] Verify no duplicate constant definitions

---

##  Progress Tracking

### Phase Summary:
-  Phase 1: Constants File Upgrade (COMPLETED)
-  Phase 2: Rule Files (0/5 files)
-  Phase 3: Validator (0/1 files)
-  Phase 4: Error Handler (0/3 files)
-  Phase 5: Tokenizer System (0/2 files)
-  Phase 6: Parser System (0/4 files)
-  Phase 7: Testing Tools (0/4 files)
-  Phase 8: Extension & CLI (0/4 files)
-  Phase 9: Configuration Sync (0/3 files)
-  Phase 10: Documentation & Testing (0/10 tasks)

### Total Files to Refactor: ~30 files
### Estimated Time: 8-12 hours (with testing)
### Priority: HIGH (enforces NO_HARDCODE principle)

---

##  Getting Started

### Step 1: Start with Rule Files (Low Risk)
```bash
# Edit first rule file
code src/rules/NO_MOCKING.js
```

### Step 2: Test After Each File
```bash
node cli.js src/
```

### Step 3: Commit After Each Phase
```bash
git add .
git commit -m "refactor: Phase 2 - Integrate constants.js into NO_MOCKING rule"
```

---

##  Important Notes

1. **Backward Compatibility:** Keep `*_LEGACY` exports until refactor complete
2. **Testing:** Test after EACH file modification
3. **Incremental:** Do NOT refactor everything at once
4. **Validation:** Run CLI after each phase
5. **Documentation:** Update docs as you go

---

##  Success Criteria

 Refactor is complete when:
1. Zero hardcoded RULE_IDS strings in codebase
2. Zero hardcoded SEVERITY_LEVELS strings in codebase
3. Zero hardcoded ERROR_TYPES strings in codebase
4. All files import from constants.js
5. All tests pass
6. CLI works correctly
7. No grep matches for hardcoded patterns

---

**Status:**  READY TO START  
**Next Action:** Begin Phase 2 - Refactor first rule file (NO_MOCKING.js)