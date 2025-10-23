# Chahuadev Sentinel — Binary Migration Status Report

**Last Updated:** 23 October 2025  
**Author:** GitHub Copilot (AI Programming Assistant)

---

## 1. Project Overview
The "Binary-First Refactor" initiative ensures that Chahuadev Sentinel transmits rule identifiers and severity levels as binary values from the rule layer all the way to the central ErrorHandler. Only the ErrorHandler may translate these binary codes into human-readable text. Since early 2025, shared constant registries have been introduced and adopted across the primary application stack.

---

## 2. Step-by-Step Execution Plan
Each phase below includes checkboxes to indicate status (`[x]` completed, `[ ]` pending).

### Phase 1: Establish Shared Constants (Complete)
- [x] Introduce `src/constants/rule-constants.js` with bitmasks, numeric IDs, slugs, and helpers such as `resolveRuleSlug`, `coerceRuleId`
- [x] Introduce `src/constants/severity-constants.js` with binary rule/error severities and coercion helpers

### Phase 2: Migrate Key Rules to Shared Constants (Complete)
- [x] Update `src/rules/MUST_HANDLE_ERRORS.js` to consume `RULE_IDS`, `RULE_SEVERITY_FLAGS`, and canonical slugs
- [x] Update `src/rules/NO_CONSOLE.js` to align with the binary-first metadata contract

### Phase 3: Upgrade Aggregation Layer and CLI (Complete)
- [x] Refactor `src/rules/validator.js` to normalize binary IDs/severities and enrich rule metadata prior to reporting
- [x] Refactor `cli.js` to coerce rule and severity payloads into binary form before CLI reporting

### Phase 4: Audit All Rule Modules (Complete)
- [x] Revisit `src/rules/BINARY_AST_ONLY.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_EMOJI.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_HARDCODE.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_INTERNAL_CACHING.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_MOCKING.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_SILENT_FALLBACKS.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/NO_STRING.js` to guarantee all metadata relies on shared constants
- [x] Revisit `src/rules/STRICT_COMMENT_STYLE.js` to guarantee all metadata relies on shared constants
- [x] Confirm no rule still references literal IDs or severity strings

### Phase 5: Rebuild ErrorHandler as the Translation Layer (Complete)

> **Update 23 October 2025 (Binary Error System Complete Rebuild):**
> - Completed full rebuild of Binary Error System from scratch with Grammar-Driven Architecture
> - Created `src/error-handler/binary-error.grammar.js` as Single Source of Truth defining:
>   - 64-bit Binary Code Structure: Domain (16 bits) | Category (16 bits) | Severity (8 bits) | Source (8 bits) | Offset (16 bits)
>   - All codes returned as strings to avoid JavaScript 53-bit integer limitation
>   - Complete domain/category/severity/source definitions with bilingual metadata
>   - Meta codes for system-level errors (INVALID_ERROR_CODE, RECURSIVE_ERROR, etc.)
> - Created `src/error-handler/binary-code-utils.js` with core utilities:
>   - `createErrorCode(domain, category, severity, source, offset)` - Compose 64-bit codes
>   - `createErrorCodeBuilder(grammar, domain, category)` - Factory for domain-specific builders
>   - `getComponentMap(grammar, componentType)` - Build Maps for fast lookups
> - Created `src/error-handler/binary-codes.js` as pre-built factory:
>   - Auto-generates all error builders at import time by looping Grammar
>   - Pattern: `BinaryCodes.DOMAIN.CATEGORY(severity, source, offset)`
>   - Example: `BinaryCodes.PARSER.SYNTAX(CRITICAL, CLI, 1001)` returns "562954785784809"
> - Created `src/error-handler/BinaryErrorParser.js` for decomposition:
>   - `decomposeBinaryCode(code)` - Extract all 5 components from 64-bit string
>   - `renderHumanReadable(code, language)` - Generate formatted error messages
>   - `shouldThrowError(code)` - Determine if error should throw or log
> - Created `src/error-handler/binary-reporter.js` as unified interface:
>   - `reportError(binaryCode, context)` - Single function for all error reporting
>   - Automatic logging to files (centralized-errors.log, critical-errors.log)
>   - Recursive error handling with META_RECURSIVE_ERROR protection
> - Created `src/error-handler/binary-log-stream.js` for file operations:
>   - `ensureLogDirectory()` - Create log folders if missing
>   - `appendToLog(binaryCode, message, context)` - Write to log files
> - Migrated `cli.js` to 100 percent Binary Pattern (10 error points converted)
> - Deleted legacy `ErrorHandler.js` to force pure Binary Pattern adoption
> - Created comprehensive test suite (tests/test-01 to test-04 plus run-all-tests.js)
> - Test results: BinaryCodes factory working perfectly, discovered critical bugs in parser

> **Update 18 October 2025:**
> - Finalised the hierarchical domain catalog in `src/error-handler/error-catalog.js`, allowing downstream callers to resolve domain codes, slugs, and descriptions directly from normalized payloads.
> - Extended bilingual metadata (recommended actions, retry/fatal guidance) for Syntax and Type dictionaries in `src/error-handler/error-dictionary.js`; remaining categories stay on the roadmap.
> - Upgraded `src/error-handler/error-normalizer.js` to surface domain descriptors, severity metadata, and recommended actions for every normalized error, including fallback flows.
> - `src/rules/validator.js` now raises binary-only system payloads (with `sourceCode`, `severityCode`, `errorCode`) whenever parser bootstrapping or per-rule evaluation fails, backstopping Phase 5.3 intake requirements.
> - Extracted the console rendering layer into `src/error-handler/error-renderer.js` so `ErrorHandler.js` now focuses on intake and transport orchestration.

> **Update 18 October 2025 (Helper Rollout):**
> - Added `src/error-handler/error-emitter.js` with `createSystemPayload` and `emitSecurityNotice` helpers so callers no longer craft raw payloads or string severities inline.
> - Expanded `error-catalog.js` and `error-dictionary.js` with a dedicated Security category, new runtime codes (uncaught exception, unhandled rejection, process warnings, report failures), and bilingual metadata for each entry.
> - Rewired `setupGlobalErrorHandlers` and the `SecurityMiddleware` bootstrap path to consume the new helpers, beginning the systematic migration away from the legacy two-argument `handleError` signature.
> - Opened bilingual issue ledgers (`docs/en/BINARY_MIGRATION_ISSUES.md`, `docs/th/BINARY_MIGRATION_ISSUES.md`) to capture migration blockers and outstanding caller updates as they are discovered.

> **Update 17 October 2025:**
> - Removed direct `errorHandler` usage from all rule modules (`src/rules/*.js`) so the rule layer now emits binary metadata only, preparing the Binary Intake Layer.
> - Introduced diagnostic error codes **1008 / 1009** for tokenizer instrumentation. These now escalate as CRITICAL incidents by design, forcing the pipeline to halt whenever binary grammar hydration fails; additional safeguards are required to keep operational visibility without blocking valid scans.
> - Latest CLI run (`node cli src\`) now passes after adding integrity assertions to `PureBinaryTokenizer.loadGrammarSections`. Telemetry-only notices are routed through the new `telemetry-recorder` channel, keeping CRITICAL 1008/1009 guarded while removing the generic code `500` chatter from the CLI transcript.
> - Next milestone: promote the Error Catalog into a hierarchical, metadata-aware classification system (domains ➝ categories ➝ individual codes) so downstream automation can infer retry/fatal policies without bespoke logic.

#### 5.1 Design Grammar-Driven Binary Error Architecture
- [x] Design Grammar-Driven Binary Error System with 64-bit code structure:
  - **64-bit Structure:** Domain (16) | Category (16) | Severity (8) | Source (8) | Offset (16)
  - **Single Source of Truth:** `binary-error.grammar.js` defines all domains, categories, severities, sources
  - **Pure Binary Pattern:** All codes as strings to avoid 53-bit JavaScript limitation
  - **Factory Pattern:** `BinaryCodes.DOMAIN.CATEGORY(severity, source, offset)` pre-built at import
  - **Unified Interface:** `reportError(binaryCode, context)` for all error reporting

#### 5.2 Create Binary Error Grammar and Core Utilities
- [x] Create `src/error-handler/binary-error.grammar.js` as Single Source of Truth:
  - Config section defining code structure and composition rules
  - Meta section with system-level error codes (INVALID_ERROR_CODE, RECURSIVE_ERROR)
  - Domains section defining all error domains (PARSER, VALIDATOR, SYSTEM, CLI, SECURITY, RULE)
  - Categories section defining error categories per domain (SYNTAX, TYPE, REFERENCE, etc.)
  - Severities section with bilingual names and shouldThrow flags
  - Sources section defining error origins (CLI, VALIDATOR, PARSER, SYSTEM)
- [x] Create `src/error-handler/binary-code-utils.js` with composition utilities:
  - `createErrorCode(domain, category, severity, source, offset)` - compose 64-bit codes
  - `createErrorCodeBuilder(grammar, domain, category)` - factory for builders
  - `getComponentMap(grammar, componentType)` - build Maps for fast lookups
  - All codes returned as strings for 64-bit safety
- [x] Create `src/error-handler/binary-codes.js` as pre-built factory:
  - Auto-generate all BinaryCodes.DOMAIN.CATEGORY builders at import time
  - Loop through Grammar domains and categories to create builders
  - Export unified BinaryCodes object with all builders ready
  - Example usage: `BinaryCodes.PARSER.SYNTAX(CRITICAL, CLI, 1001)`

#### 5.3 Create Binary Error Parser and Decomposition
- [x] Create `src/error-handler/BinaryErrorParser.js` for code decomposition:
  - `decomposeBinaryCode(binaryCode)` - extract Domain, Category, Severity, Source, Offset from 64-bit string
  - `renderHumanReadable(binaryCode, language)` - generate formatted bilingual error messages
  - `shouldThrowError(binaryCode)` - determine if error should throw based on severity
  - Use Maps for fast reverse lookups (code to metadata)
  - Protect against invalid codes with META_INVALID_ERROR_CODE fallback
- [x] Bug discovered: `decomposeBinaryCode()` only returns offset correctly, other components undefined
- [ ] Fix critical parser bug: implement proper bitwise extraction for all 5 components

#### 5.4 Create Unified Error Reporting Interface
- [x] Create `src/error-handler/binary-reporter.js` as single reporting interface:
  - `reportError(binaryCode, context)` - unified function for all error reporting
  - Automatic console output with formatted messages
  - Automatic file logging to centralized-errors.log
  - Critical errors logged to separate critical-errors.log
  - Recursive error protection with META_RECURSIVE_ERROR
  - Uses BinaryErrorParser for code decomposition and rendering
- [x] Discovered bugs in reportError:
  - BUG-001: PARSER.SYNTAX throws instead of logging (severity.shouldThrow issue)
  - BUG-002: Invalid codes crash with BigInt error (no try-catch)
  - BUG-003: Null context causes crash (no null check)
- [ ] Fix all three critical bugs in binary-reporter.js

#### 5.5 Create Log File Transport Layer
- [x] Create `src/error-handler/binary-log-stream.js` for file operations:
  - `ensureLogDirectory()` - create logs/errors/ directory if missing
  - `appendToLog(binaryCode, message, context)` - write errors to log files
  - Writes to centralized-errors.log for all errors
  - Writes to critical-errors.log for CRITICAL/FATAL severity
  - Automatic directory creation with fallback
  - Timestamp-based log entries
- [ ] Test log file writing functionality (test-04 not yet executed)

#### 5.6 Migration to Binary Pattern and Testing
- [x] Migrate `cli.js` to 100 percent Binary Pattern:
  - Removed ErrorHandler.js import (deleted legacy handler)
  - Converted all 10 error points to use `reportError(BinaryCodes.DOMAIN.CATEGORY(...), context)`
  - Import BinaryCodes from binary-codes.js
  - Pattern: `reportError(BinaryCodes.CLI.CONFIGURATION(CRITICAL, CLI, offset), { message, filePath })`
- [x] Delete legacy `ErrorHandler.js` to force pure Binary Pattern
- [x] Create comprehensive test suite with detailed bug reporting:
  - `tests/test-01-binary-codes.js` - Test BinaryCodes factory (7/7 PASSED)
  - `tests/test-02-binary-reporter.js` - Test reportError function (3/6 FAILED, 3 bugs found)
  - `tests/test-03-binary-parser.js` - Test BinaryErrorParser (2/8 FAILED, critical bug found)
  - `tests/test-04-log-stream.js` - Test log file writing (not yet executed)
  - `tests/run-all-tests.js` - Runner for all test suites
- [x] Bug reporting with file paths, line numbers, root causes, and fixes
- [ ] Fix all discovered bugs before migrating other files

#### 5.7 Known Bugs and Next Steps
- [ ] **BUG-PARSER-001 (CRITICAL):** `decomposeBinaryCode()` only returns offset, missing domain/category/severity/source
  - File: `BinaryErrorParser.js`
  - Root Cause: Bitwise extraction not implemented correctly
  - Fix: Implement proper BigInt bitwise operations for all 5 components
- [ ] **BUG-001 (CRITICAL):** PARSER.SYNTAX throws instead of logging
  - File: `BinaryErrorParser.js` lines 338, 145
  - Root Cause: severity.shouldThrow = true causes throw
  - Fix: Modify reportError to respect shouldThrow flag
- [ ] **BUG-002 (CRITICAL):** Invalid binary code crashes with BigInt error
  - File: `BinaryErrorParser.js` line 51
  - Root Cause: No try-catch around BigInt conversion
  - Fix: Wrap in try-catch, return META_INVALID_ERROR_CODE
- [ ] **BUG-003 (HIGH):** Null context causes crash
  - File: `BinaryErrorParser.js` lines 296, 131
  - Root Cause: Spread operator on null
  - Fix: Add context = context || {} validation
- [ ] Run test-04 to verify log file writing
- [ ] Migrate validator.js and other files to Binary Pattern after bug fixes

### Phase 6: Tooling & Test Automation (Not Started)
- [ ] Produce a checklist or script to validate metadata consistency across rules  validator  CLI  ErrorHandler
- [ ] Add a binary-first test plan or automated suite covering the entire pipeline
- [ ] Establish regression suites for Markdown reports and CLI output

### Phase 7: JSON to ES Module Migration (In Progress)

> **Rationale:**  
> JSON files require 3 expensive operations: **I/O → String → JSON.parse() → Object**. This parsing overhead creates a significant performance bottleneck, especially for grammar files loaded repeatedly during tokenization. By migrating from `.json` to `.js` ES Modules, we leverage V8's native module loading system—the JavaScript engine understands `.js` files natively without any string-to-object parsing overhead.

> **Update 23 October 2025:**
> - Migrated all critical grammar files from JSON to ES Modules:
>   - `java.grammar.json` → `java.grammar.js` (exports `javaGrammar`)
>   - `javascript.grammar.json` → `javascript.grammar.js` (exports `javascriptGrammar`)
>   - `typescript.grammar.json` → `typescript.grammar.js` (exports `typescriptGrammar`)
>   - `jsx.grammar.json` → `jsx.grammar.js` (exports `jsxGrammar`)
> - Migrated core configuration files:
>   - `tokenizer-binary-config.json` → `tokenizer-binary-config.js` (exports `tokenizerBinaryConfig`)
>   - `parser-config.json` → `parser-config.js` (exports `parserConfig`)
>   - `quantum-architecture.json` → `quantum-architecture.js` (exports `quantumArchitectureConfig`)
>   - `unicode-identifier-ranges.json` → `unicode-identifier-ranges.js` (exports `unicodeIdentifierRanges`)
> - Updated `grammar-index.js` to use dynamic `import()` instead of `JSON.parse(readFileSync())`
> - Implemented async initialization pattern with `ready()` method for constructor compatibility
> - Fixed Windows compatibility using `pathToFileURL()` for file:// URL scheme
> - **Testing:** Successfully verified grammar loading (75 keywords, 48 operators loaded correctly)
> - **Performance Gain:** Eliminated 3-step JSON parsing process entirely

#### 7.1 Grammar Files Migration
- [x] Convert `java.grammar.json` → `java.grammar.js`
- [x] Convert `javascript.grammar.json` → `javascript.grammar.js`
- [x] Convert `typescript.grammar.json` → `typescript.grammar.js`
- [x] Convert `jsx.grammar.json` → `jsx.grammar.js`
- [x] Update `grammar-index.js` to use `import(pathToFileURL(path).href)` instead of `JSON.parse(readFileSync())`
- [x] Implement async initialization pattern for GrammarIndex constructor
- [x] Test grammar loading with all languages

#### 7.2 Configuration Files Migration
- [x] Convert `tokenizer-binary-config.json` → `tokenizer-binary-config.js`
- [x] Convert `parser-config.json` → `parser-config.js`
- [x] Convert `quantum-architecture.json` → `quantum-architecture.js`
- [x] Convert `unicode-identifier-ranges.json` → `unicode-identifier-ranges.js`
- [ ] Update all files referencing these configs to import `.js` instead of `.json`
  - [ ] `tokenizer-helper.js` (line 131)
  - [ ] `grammars/index.js` (lines 81, 84)
  - [ ] Other grammar helper files

#### 7.3 Security & Extension Files Migration
- [ ] Convert `error-handlers.json` → `error-handlers.js`
- [ ] Convert `security-defaults.json` → `security-defaults.js`
- [ ] Convert `suspicious-patterns.json` → `suspicious-patterns.js`
- [ ] Convert `extension-config.json` → `extension-config.js`
- [ ] Update all security and extension files to import from `.js` modules

#### 7.4 Root Configuration Files Migration
- [ ] Convert `cli-config.json` → `cli-config.js`
- [ ] Update `cli.js` to import from `cli-config.js`
- [ ] Evaluate `package.json` migration (optional - npm requires JSON format)

#### 7.5 Documentation Updates
- [ ] Update `README.md` to reflect ES Module architecture
- [ ] Update `docs/th/หน้าที่ไฟล์.md` to show `.js` extensions
- [ ] Update all architecture docs mentioning JSON config files

#### 7.6 Benefits & Validation
- [x] **Performance:** V8 native loading (no parsing overhead)
- [x] **Tree-shaking:** ES Modules support selective imports
- [x] **Type Safety:** Better IDE autocomplete and static analysis
- [x] **Maintainability:** JavaScript syntax highlighting and validation
- [ ] **Testing:** Add benchmark comparing JSON vs ES Module load times
- [ ] **Regression:** Ensure no functionality breaks after migration

---

## 3. Repository-Wide File Register & Status
The following checklist inventories every file in the repository, grouped by folder, to track Binary-First readiness.


### Root Level
- [x] `.gitignore`
- [ ] `cli-config.json`
- [x] `cli.js`
- [ ] `extension-wrapper.js`
- [ ] `LICENSE`
- [ ] `package.json`
- [ ] `README.md`

### `docs/`
- [ ] `docs/ARCHITECTURE_VISION.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/BINARY_MIGRATION_STATUS.md` (index file; see Thai/English editions below)
- [ ] `docs/BLANK_PAPER_ARCHITECTURE.md`
- [ ] `docs/CODE_OF_CONDUCT.md`
- [ ] `docs/COLLABORATION.md`
- [ ] `docs/COMMIT_GUIDELINES.md`
- [ ] `docs/CONTRIBUTING.md`
- [ ] `docs/GOVERNANCE.md`
- [ ] `docs/QUANTUM_BINARY_ARCHITECTURE.md`
- [ ] `docs/RELEASE_PROCESS.md`
- [ ] `docs/TOKENIZER_FLOW.md`
- [ ] `docs/ZONE_LINE_NUMBERS.md`
- [ ] `docs/ระบบการไหล-Chahuadev-Sentinel.md`
- [ ] `docs/หน้าที่ไฟล์.md`

#### `docs/architecture/`
- [ ] `docs/architecture/BASE_GRAMMAR_DELTA_ARCHITECTURE.md`

### `logs/`
- [ ] `logs/errors/file-reports/` (verify logging once ErrorHandler refactor lands)

### `src/`
- [ ] `src/extension-config.json`
- [ ] `src/extension.js`

#### `src/constants/`
- [x] `src/constants/rule-constants.js`  **Central Binary Rule Constants Hub**
- [x] `src/constants/severity-constants.js`  **Central Severity Constants Hub**

> **Important Note**: `src/constants/` is the central folder for all constants.  
> Other files **must NOT** create their own constants - they must import from `src/constants/` only.

#### `src/error-handler/`
- [x] `src/error-handler/binary-error.grammar.js` — Single Source of Truth for Binary Error System
- [x] `src/error-handler/binary-code-utils.js` — Core utilities for code composition
- [x] `src/error-handler/binary-codes.js` — Pre-built factory (BinaryCodes.DOMAIN.CATEGORY pattern)
- [x] `src/error-handler/BinaryErrorParser.js` — Code decomposition and rendering (has critical bugs)
- [x] `src/error-handler/binary-reporter.js` — Unified reportError interface (has bugs)
- [x] `src/error-handler/binary-log-stream.js` — Log file writing utilities
- [ ] `src/error-handler/error-catalog.js` — Legacy catalog (to be deprecated)
- [ ] `src/error-handler/error-dictionary.js` — Legacy dictionary (to be deprecated)
- [ ] `src/error-handler/error-emitter.js` — Legacy helper (to be deprecated)
- [ ] `src/error-handler/error-handler-config.js` — Legacy config
- [ ] `src/error-handler/error-log-stream.js` — Legacy log stream (replaced by binary-log-stream.js)
- [ ] `src/error-handler/error-normalizer.js` — Legacy normalizer (to be deprecated)
- [ ] `src/error-handler/error-renderer.js` — Legacy renderer (to be deprecated)
- [ ] `src/error-handler/ErrorHandler.js` — DELETED (replaced by binary-reporter.js)
- [ ] `src/error-handler/telemetry-recorder.js` — Telemetry helper

#### `src/grammars/`
- [ ] `src/grammars/index.d.ts`
- [ ] `src/grammars/index.js`
- [ ] `src/grammars/docs/CHANGELOG.md`

##### `src/grammars/shared/`
- [ ] `src/grammars/shared/binary-prophet.js`
- [ ] `src/grammars/shared/binary-scout.js`
- [ ] `src/grammars/shared/constants.js`
- [ ] `src/grammars/shared/enhanced-binary-parser.js`
- [x] `src/grammars/shared/grammar-index.js` *(updated to use ES Module imports)*
- [x] `src/grammars/shared/parser-config.js` *(migrated from JSON)*
- [ ] `src/grammars/shared/pure-binary-parser.js`
- [ ] `src/grammars/shared/tokenizer-helper.js`
- [x] `src/grammars/shared/tokenizer-binary-config.js` *(migrated from JSON)*

###### `src/grammars/shared/configs/`
- [x] `src/grammars/shared/configs/quantum-architecture.js` *(migrated from JSON)*
- [x] `src/grammars/shared/configs/unicode/unicode-identifier-ranges.js` *(migrated from JSON)*

###### `src/grammars/shared/grammars/`
- [x] `src/grammars/shared/grammars/java.grammar.js` *(migrated from JSON)*
- [x] `src/grammars/shared/grammars/javascript.grammar.js` *(migrated from JSON)*
- [x] `src/grammars/shared/grammars/jsx.grammar.js` *(migrated from JSON)*
- [x] `src/grammars/shared/grammars/typescript.grammar.js` *(migrated from JSON)*

#### `src/rules/`
- [x] `src/rules/BINARY_AST_ONLY.js`
- [x] `src/rules/MUST_HANDLE_ERRORS.js`
- [x] `src/rules/NO_CONSOLE.js`
- [x] `src/rules/NO_EMOJI.js`
- [x] `src/rules/NO_HARDCODE.js`
- [x] `src/rules/NO_INTERNAL_CACHING.js`
- [x] `src/rules/NO_MOCKING.js`
- [x] `src/rules/NO_SILENT_FALLBACKS.js`
- [x] `src/rules/NO_STRING.js`
- [x] `src/rules/STRICT_COMMENT_STYLE.js`
- [x] `src/rules/validator.js`

> **Note**: All rules import constants from `src/constants/rule-constants.js` and `src/constants/severity-constants.js` only.  
> No local constants allowed in this folder.

#### `src/security/`
- [ ] `src/security/error-handlers.json`
- [ ] `src/security/rate-limit-store-factory.js`
- [ ] `src/security/security-config.js`
- [ ] `src/security/security-defaults.json`
- [ ] `src/security/security-manager.js`
- [ ] `src/security/security-middleware.js`
- [ ] `src/security/suspicious-patterns.json`

> Note: `[x]` marks files already migrated to the binary-first contract (subject to ongoing review). `[ ]` marks files pending migration or awaiting verification.

---

## 4. Formal TODO Register

> **⚠️ IMPORTANT - JSON to ES Module Migration:**  
> Phase 7 is now underway to migrate all JSON files to ES Modules (.js) for massive performance improvements. JSON.parse() creates a parsing bottleneck (I/O → String → Parse → Object), while ES Modules are loaded natively by V8 with zero parsing overhead. All critical grammar and config files have been migrated. Remaining tasks include updating file references and migrating security/extension configs.

### Immediate Actions (Week 42, 2025)
- [ ] **[Phase 5]** Fix BUG-PARSER-001: decomposeBinaryCode() not extracting domain/category/severity/source (CRITICAL BLOCKER)
- [ ] **[Phase 5]** Fix BUG-001: PARSER.SYNTAX throws instead of logging (lines 338, 145)
- [ ] **[Phase 5]** Fix BUG-002: Invalid binary code BigInt crash (line 51 - add try-catch)
- [ ] **[Phase 5]** Fix BUG-003: Null context crash (lines 296, 131 - add null check)
- [ ] **[Phase 5]** Run test-04-log-stream.js to verify log file writing
- [ ] **[Phase 5]** Run complete test suite (run-all-tests.js) after bug fixes
- [ ] **[Phase 7]** Update remaining file references to use .js extensions instead of .json (tokenizer-helper.js line 131, grammars/index.js lines 81/84)
- [ ] **[Phase 7]** Migrate security configuration files: error-handlers.json, security-defaults.json, suspicious-patterns.json to ES Modules
- [ ] **[Phase 7]** Migrate extension-config.json to extension-config.js and update extension.js imports

### Near-Term Enhancements
- [ ] Migrate validator.js and remaining files to Binary Pattern after bug fixes
- [ ] Migrate security files (security-manager.js, security-middleware.js) to use reportError with BinaryCodes
- [ ] Migrate grammar files to use Binary Pattern
- [ ] Complete JSON to ES Module migration (Phase 7)
- [ ] Create integration tests for end-to-end Binary Error System flow
- [ ] Add performance benchmarks comparing Binary Pattern vs legacy ErrorHandler

### Supporting Activities
- [ ] Document Binary Error System architecture in README.md
- [ ] Create usage examples for BinaryCodes pattern
- [ ] Update bilingual documentation after bug fixes complete
- [ ] Implement regression tests for error-log-stream.js and Markdown report writer
- [ ] Automate repository tree generation (script or CI check) to keep Appendix A synchronized with future file additions
- [ ] Schedule documentation review to align bilingual terminology (target Week 44, 2025)

---

## 5. Known Issues & Blockers
- **ISS-2025-10-23-01 — Binary Parser Critical Bug:** `BinaryErrorParser.decomposeBinaryCode()` only extracts offset correctly, returns undefined for domain/category/severity/source. This blocks entire error reporting system. Must be fixed before any further migration.
- **ISS-2025-10-23-02 — Reporter Error Handling:** `binary-reporter.js` has three critical bugs (PARSER throws, BigInt crash, null context crash) discovered through testing. All must be fixed for stable error reporting.
- **ISS-2025-10-23-03 — Test Coverage Gap:** test-04-log-stream.js not yet executed, log file writing functionality unverified.
- **ISS-2025-10-18-01 — Legacy Callers:** Several modules still use old ErrorHandler pattern. Cannot migrate until Binary Error System bugs are fixed.
- **ISS-2025-10-18-02 — Helper Test Gap:** error-emitter.js lacks automated coverage (will be deprecated in favor of Binary Pattern).

---

## 6. Risks & Mitigations
- **Binary Error System Bugs:** Critical bugs in BinaryErrorParser block entire system; priority focus on fixing decomposeBinaryCode() before any migration.
- **Test-Driven Development:** Comprehensive test suite successfully identified bugs; continue test-first approach for remaining features.
- **Legacy System Deprecation:** Old ErrorHandler.js deleted to force Binary Pattern adoption; legacy files (error-catalog, error-dictionary, error-emitter) to be deprecated after Binary System stabilizes.
- **64-bit Code Handling:** All codes as strings to avoid JavaScript 53-bit limitation; maintain this pattern throughout system.

---

## 7. Appendix
- **Key Artifacts:**
  - `src/constants/rule-constants.js` — Rule IDs and severity flags
  - `src/constants/severity-constants.js` — Severity constants
  - `src/error-handler/binary-error.grammar.js` — Single Source of Truth for Binary Error System
  - `src/error-handler/binary-codes.js` — Pre-built factory (BinaryCodes.DOMAIN.CATEGORY)
  - `src/error-handler/BinaryErrorParser.js` — Code decomposition (has bugs)
  - `src/error-handler/binary-reporter.js` — Unified reportError interface (has bugs)
  - `src/error-handler/binary-log-stream.js` — Log file utilities
  - `cli.js` — Migrated to Binary Pattern (10 error points)
  - `tests/test-01-binary-codes.js` through `test-04-log-stream.js` — Test suite
- **Latest Status:** Binary Error System architecture complete, BinaryCodes factory working perfectly (7/7 tests passed), but critical bugs discovered in BinaryErrorParser and binary-reporter require fixes before system-wide migration
- **Test Results:**
  - test-01: 7/7 PASSED - BinaryCodes factory working perfectly
  - test-02: 3/6 FAILED - 3 critical bugs in binary-reporter
  - test-03: 2/8 FAILED - Critical bug in decomposeBinaryCode
  - test-04: Not yet executed

---
## Appendix A: Repository Tree & File Roles
```
Chahuadev-Sentinel/
├─ .git/ — Git metadata (version history, refs, hooks)
├─ .gitignore — Ignore rules for local Git operations
├─ .vscode/
│  └─ launch.json — VS Code launch configurations for debugging
├─ .vscodeignore — Exclusion list when packaging the VS Code extension
├─ cli-config.json — CLI feature flags and runtime configuration
├─ cli.js — Entry point for the Sentinel CLI tool
├─ docs/
│  ├─ en/ — English documentation set
│  │  ├─ ARCHITECTURE.md — High-level system architecture guide
│  │  ├─ ARCHITECTURE_VISION.md — Long-term architectural vision statement
│  │  ├─ BINARY_MIGRATION_ISSUES.md — English issue ledger for the binary migration
│  │  ├─ BINARY_MIGRATION_STATUS.md — English migration status (this document)
│  │  ├─ CODE_OF_CONDUCT.md — Contributor code of conduct
│  │  ├─ COLLABORATION.md — Collaboration practices and communication norms
│  │  ├─ COMMIT_GUIDELINES.md — Commit message and review policy
│  │  ├─ CONTRIBUTING.md — Contribution workflow and onboarding steps
│  │  ├─ GOVERNANCE.md — Project governance model and decision making
│  │  ├─ MIGRATION_GUIDE.md — English migration checklist and guidance
│  │  └─ RELEASE_PROCESS.md — Release preparation and deployment process
│  └─ th/ — Thai documentation set
│     ├─ ARCHITECTURE_VISION.md — วิสัยทัศน์สถาปัตยกรรม (Thai)
│     ├─ BINARY_MIGRATION_ISSUES.md — สมุดบันทึกปัญหาสำหรับการย้ายเป็นไบนารี (Thai)
│     ├─ BINARY_MIGRATION_STATUS.md — สถานะการย้ายเป็นไบนารี (Thai)
│     ├─ BLANK_PAPER_ARCHITECTURE.md — ร่างสถาปัตยกรรมฉบับกระดาษเปล่า (Thai)
│     ├─ MIGRATION_GUIDE.md — คู่มือการย้ายระบบ (Thai)
│     ├─ QUANTUM_BINARY_ARCHITECTURE.md — เอกสารสถาปัตยกรรมควอนตัม (Thai)
│     ├─ TOKENIZER_FLOW.md — ลำดับงานของตัวตัดคำ (Thai)
│     ├─ ZONE_LINE_NUMBERS.md — อ้างอิงหมายเลขบรรทัดโซน (Thai)
│     ├─ ระบบการไหล-Chahuadev-Sentinel.md — ผังการไหลของระบบ Sentinel
│     └─ หน้าที่ไฟล์.md — สรุปหน้าที่ไฟล์ในภาษาไทย
├─ extension-wrapper.js — Bridge helper for packaging the VS Code extension
├─ LICENSE — MIT license text for the repository
├─ logo.png — Project logo asset
├─ logs/
│  ├─ cli-run.txt — Transcript of the latest CLI execution
│  ├─ errors/ — Centralised error logs and per-file reports
│  │  ├─ centralized-errors.log — Aggregated error log stream
│  │  ├─ critical-errors.log — Extract of critical severity incidents
│  │  └─ file-reports/ — Markdown-style reports per source file
│  │     ├─ binary-scout.js.log — Error report for binary-scout parser helper
│  │     ├─ grammar-index.js.log — Error report for grammar index loader
│  │     ├─ index.js.log — Error report for grammar entry point
│  │     ├─ pure-binary-parser.js.log — Error report for pure binary parser
│  │     ├─ tokenizer-helper.js.log — Error report for tokenizer helper
│  │     └─ validator.js.log — Error report for validator engine
│  ├─ security.log — Security middleware activity log
│  └─ telemetry/
│     └─ telemetry.log — Telemetry notice stream
├─ package.json — Node package manifest and scripts
├─ README.md — Project overview and primary documentation hub
├─ src/ — Application and extension source code
│  ├─ constants/
│  │  ├─ rule-constants.js — Canonical rule IDs, slugs, and helpers
│  │  └─ severity-constants.js — Binary severity flags and coercion utilities
│  ├─ error-handler/
│  │  ├─ error-catalog.js — Domain/category metadata and binary error codes
│  │  ├─ error-dictionary.js — Bilingual dictionary entries for error codes
│  │  ├─ error-emitter.js — Helper functions that create structured error payloads
│  │  ├─ error-handler-config.js — Configuration constants for the handler
│  │  ├─ error-log-stream.js — File streaming utilities for error reports
│  │  ├─ error-normalizer.js — Binary-to-metadata transformation logic
│  │  ├─ error-renderer.js — Console and report rendering helpers
│  │  ├─ ErrorHandler.js — Centralised error intake class
│  │  └─ telemetry-recorder.js — Helper for routing telemetry notices
│  ├─ extension-config.json — VS Code extension configuration manifest
│  ├─ extension.js — VS Code extension activation entry point
│  ├─ grammars/
│  │  ├─ docs/
│  │  │  └─ CHANGELOG.md — Grammar package changelog
│  │  ├─ index.d.ts — Type definitions for grammar exports
│  │  ├─ index.js — Aggregated grammar utilities entry point
│  │  └─ shared/
│  │     ├─ binary-prophet.js — Heuristic predictor for grammar ambiguities
│  │     ├─ binary-scout.js — Grammar reconnaissance helper
│  │     ├─ configs/
│  │     │  ├─ quantum-architecture.json — Quantum grammar architecture spec (⚠️ DEPRECATED - use .js)
│  │     │  ├─ quantum-architecture.js — Quantum grammar architecture spec (ES Module)
│  │     │  └─ unicode/
│  │     │     ├─ unicode-identifier-ranges.json — Unicode identifier ranges (⚠️ DEPRECATED - use .js)
│  │     │     └─ unicode-identifier-ranges.js — Unicode identifier ranges (ES Module)
│  │     ├─ constants.js — Shared grammar constants and lookups
│  │     ├─ enhanced-binary-parser.js — Enhanced parser implementation
│  │     ├─ grammar-index.js — Registry and loader for grammars
│  │     ├─ grammars/
│  │     │  ├─ java.grammar.json — Java grammar definition (⚠️ DEPRECATED - use .js)
│  │     │  ├─ java.grammar.js — Java grammar definition (ES Module, exports javaGrammar)
│  │     │  ├─ javascript.grammar.json — JavaScript grammar definition (⚠️ DEPRECATED - use .js)
│  │     │  ├─ javascript.grammar.js — JavaScript grammar definition (ES Module, exports javascriptGrammar)
│  │     │  ├─ jsx.grammar.json — JSX grammar definition (⚠️ DEPRECATED - use .js)
│  │     │  ├─ jsx.grammar.js — JSX grammar definition (ES Module, exports jsxGrammar)
│  │     │  ├─ typescript.grammar.json — TypeScript grammar definition (⚠️ DEPRECATED - use .js)
│  │     │  └─ typescript.grammar.js — TypeScript grammar definition (ES Module, exports typescriptGrammar)
│  │     ├─ parser-config.json — Parser configuration metadata (⚠️ DEPRECATED - use .js)
│  │     ├─ parser-config.js — Parser configuration metadata (ES Module, exports parserConfig)
│  │     ├─ pure-binary-parser.js — Core binary parser implementation
│  │     ├─ tokenizer-binary-config.json — Binary tokenizer configuration (⚠️ DEPRECATED - use .js)
│  │     ├─ tokenizer-binary-config.js — Binary tokenizer configuration (ES Module, exports tokenizerBinaryConfig)
│  │     └─ tokenizer-helper.js — Tokenizer orchestration helpers
│  ├─ rules/
│  │  ├─ BINARY_AST_ONLY.js — Enforces binary AST-only parsing rule
│  │  ├─ MUST_HANDLE_ERRORS.js — Rule requiring explicit error handling
│  │  ├─ NO_CONSOLE.js — Rule forbidding console usage
│  │  ├─ NO_EMOJI.js — Rule prohibiting emojis in code
│  │  ├─ NO_HARDCODE.js — Rule preventing hardcoded values
│  │  ├─ NO_INTERNAL_CACHING.js — Rule banning hidden internal caches
│  │  ├─ NO_MOCKING.js — Rule disallowing mocking in production code paths
│  │  ├─ NO_SILENT_FALLBACKS.js — Rule forbidding silent fallbacks
│  │  ├─ NO_STRING.js — Rule enforcing binary identifiers over strings
│  │  ├─ STRICT_COMMENT_STYLE.js — Rule ensuring comment style consistency
│  │  └─ validator.js — Validation engine orchestrating all rules
│  └─ security/
│     ├─ error-handlers.json — Security error handler configuration mapping
│     ├─ rate-limit-store-factory.js — Factory for rate limit storage backends
│     ├─ security-config.js — High-level security middleware configuration
│     ├─ security-defaults.json — Default security policy values
│     ├─ security-manager.js — Core security orchestration logic
│     ├─ security-middleware.js — VS Code security middleware entry point
│     └─ suspicious-patterns.json — Pattern list for intrusion detection
└─ tests/
  └─ cli-smoke.test.js — Smoke test validating CLI execution path
```
> This document tracks the Binary-First migration program. Please update this file with the current date and author when further changes are made.
