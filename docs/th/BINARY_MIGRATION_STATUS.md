# Chahuadev Sentinel — Binary Migration Status Report

**วันที่อัปเดต:** 17 ตุลาคม 2025  
**ผู้เขียน:** GitHub Copilot (AI Programming Assistant)

---

## 1. ภาพรวมโครงการ
โครงการ "Binary-First Refactor" มุ่งให้ระบบ Chahuadev Sentinel ส่งผ่านตัวบ่งชี้กฎ (rule identifiers) และระดับความรุนแรง (severity) ในรูปเลขฐานสองตั้งแต่ชั้นกฎ (rules) ไปจนถึงตัวจัดการผิดพลาด (ErrorHandler) โดยปล่อยให้ ErrorHandler เป็นชั้นเดียวที่แปลงข้อมูลเป็นข้อความสำหรับรายงานและล็อก การดำเนินงานตั้งแต่ต้นปี 2025 ได้สร้างโครงสร้างคอนสแตนต์กลางและเริ่มบังคับใช้ในส่วนหลักของแอปพลิเคชันแล้ว

---

## 2. แผนการดำเนินงานตามขั้นตอน
รายละเอียดด้านล่างแบ่งเป็นขั้นตอนหลัก โดยมีช่องทำเครื่องหมายระบุสถานะ (ทำแล้ว `[x]`, ยังไม่ทำ `[ ]`).

### ขั้นตอนที่ 1: สร้างคอนสแตนต์กลาง (เสร็จแล้ว)
- [x] จัดตั้ง `src/constants/rule-constants.js` นิยามบิตแมสก์ ไอดี และ slug 
พร้อมตัวช่วย `resolveRuleSlug`, `coerceRuleId`
- [x] จัดตั้ง `src/constants/severity-constants.js` 
นิยามระดับความรุนแรงแบบไบนารีทั้งฝั่ง rule และ error พร้อมฟังก์ชัน coercion

### ขั้นตอนที่ 2: ปรับกฎสำคัญให้ยึดคอนสแตนต์ (เสร็จแล้ว)
- [x] ปรับ `src/rules/MUST_HANDLE_ERRORS.js` ให้ใช้ `RULE_IDS`, `RULE_SEVERITY_FLAGS` และ slug จากคอนสแตนต์
- [x] ปรับ `src/rules/NO_CONSOLE.js` ให้สอดคล้องกับ binary-first metadata

### ขั้นตอนที่ 3: ปรับเลเยอร์รวบรวมและ CLI (เสร็จแล้ว)
- [x] Refactor `src/rules/validator.js` ให้บังคับใช้ binary IDs/severity และ enrich metadata ก่อนส่งต่อ
- [x] Refactor `cli.js` ให้แปลง payload ทั้งกฎและ severity เป็นค่าบิตก่อนสร้างรายงาน CLI

### ขั้นตอนที่ 4: ตรวจสอบโมดูลกฎทั้งหมด (เสร็จแล้ว)
- [x] ทบทวน `src/rules/BINARY_AST_ONLY.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_EMOJI.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_HARDCODE.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_INTERNAL_CACHING.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_MOCKING.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_SILENT_FALLBACKS.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/NO_STRING.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ทบทวน `src/rules/STRICT_COMMENT_STYLE.js` ให้ metadata ยึดคอนสแตนต์ครบถ้วน
- [x] ยืนยันว่าไม่มีกฎใดใช้ literal string เป็นไอดีหรือ severity

### ขั้นตอนที่ 5: ปรับ ErrorHandler เป็นเลเยอร์แปลผล (ยังไม่เริ่ม)

#### 5.1 ออกแบบสถาปัตยกรรม 4 Layers
- [ ] ออกแบบสถาปัตยกรรมระบบแจ้งข้อผิดพลาดใหม่ โดยแยกเป็น 4 ชั้นที่ชัดเจน:
  - **Layer 1: Binary Intake** - รับ error เป็น binary codes (ruleId, severityCode, errorCode)
  - **Layer 2: Normalization** - แปลง binary  metadata ที่สมบูรณ์ (slug, name, description)
  - **Layer 3: Rendering** - สร้าง output (Markdown, JSON, plain text) จาก normalized data
  - **Layer 4: Transport** - ส่งออกไปยังปลายทาง (file, stream, console, external services)

#### 5.2 สร้างไฟล์ Error Catalog และ Normalization Helpers
- [ ] สร้าง `src/error-handler/error-catalog.js` เก็บข้อมูลกลาง:
  - Error source types และ binary codes (VALIDATOR, PARSER, CLI, SYSTEM)
  - Error category mappings (6 หมวดหมู่หลัก):
    1. **Syntax Errors (1001-1099)**: ข้อผิดพลาดทางไวยากรณ์
       - UNEXPECTED_TOKEN, MISSING_SEMICOLON, UNMATCHED_BRACKETS
       - INVALID_ASSIGNMENT, DUPLICATE_PARAMETER, UNEXPECTED_END_OF_INPUT
    2. **Type Errors (2001-2099)**: ข้อผิดพลาดเกี่ยวกับชนิดข้อมูล
       - IS_NOT_A_FUNCTION, CANNOT_READ_PROPERTY_OF_NULL_OR_UNDEFINED
       - INVALID_TYPE_ARGUMENT, OPERATOR_CANNOT_BE_APPLIED
    3. **Reference Errors (3001-3099)**: ข้อผิดพลาดในการอ้างอิง
       - IS_NOT_DEFINED, TDZ_ACCESS (Temporal Dead Zone)
    4. **Runtime Errors (4001-4099)**: ข้อผิดพลาดตอนทำงาน
       - STACK_OVERFLOW, OUT_OF_MEMORY, NULL_POINTER_EXCEPTION
    5. **Logical Errors (5001-5099)**: ข้อผิดพลาดทางตรรกะ
       - UNHANDLED_PROMISE_REJECTION, INFINITE_LOOP, UNREACHABLE_CODE
       - VARIABLE_SHADOWING, USE_BEFORE_DEFINE, MAGIC_NUMBER
    6. **File System Errors (6001-6099)**: ข้อผิดพลาดเกี่ยวกับไฟล์
       - FILE_NOT_FOUND, FILE_READ_ERROR, FILE_WRITE_ERROR, PERMISSION_DENIED
  - Default error messages และ templates
  - Severity level descriptions
- [ ] สร้าง `src/error-handler/error-dictionary.js` เป็น "พจนานุกรมแปลรหัส Error":
  - Map error codes (binary)  human-readable messages
  - เก็บ explanation (คำอธิบายสาเหตุ) สำหรับแต่ละ error
  - เก็บ fix suggestions (วิธีแก้ไข) สำหรับแต่ละ error
  - รองรับทั้งภาษาไทยและอังกฤษ
  - ครอบคลุม error codes ทั้ง 6 หมวดหมู่:
    - **RULE_ERROR_DICTIONARY**: สำหรับ rule violations (10 กฎ)
    - **SYNTAX_ERROR_DICTIONARY**: สำหรับ syntax errors (1001-1099)
    - **TYPE_ERROR_DICTIONARY**: สำหรับ type errors (2001-2099)
    - **REFERENCE_ERROR_DICTIONARY**: สำหรับ reference errors (3001-3099)
    - **RUNTIME_ERROR_DICTIONARY**: สำหรับ runtime errors (4001-4099)
    - **LOGICAL_ERROR_DICTIONARY**: สำหรับ logical errors (5001-5099)
    - **FILE_SYSTEM_ERROR_DICTIONARY**: สำหรับ file system errors (6001-6099)
  - ตัวอย่างโครงสร้าง:
    ```javascript
    export const SYNTAX_ERROR_DICTIONARY = {
      [SYNTAX_ERROR_CODES.UNEXPECTED_TOKEN]: {
        message: {
          th: "พบ Token ที่ไม่คาดคิด",
          en: "Unexpected token found"
        },
        explanation: {
          th: "Parser พบ token ที่ไม่คาดหวังในตำแหน่งนี้",
          en: "Parser encountered unexpected token at this position"
        },
        fix: {
          th: "ตรวจสอบ syntax หา typo หรือเครื่องหมายที่หายไป",
          en: "Check syntax for typos or missing characters"
        },
        category: "SYNTAX_ERROR",
        severity: ERROR_SEVERITY_FLAGS.HIGH
      }
    }
    ```
- [ ] สร้าง `src/error-handler/error-normalizer.js` จัดทำฟังก์ชันแปลงค่า:
  - `normalizeRuleError(ruleId, severityCode, context)` - แปลง rule violation
  - `normalizeSystemError(errorCode, severityCode, context)` - แปลง system error
  - `resolveErrorSource(sourceCode)` - แปลง source type binary  label
  - `resolveErrorMessage(errorCode, language)` - ค้นหาข้อความจาก error-dictionary
  - `enrichErrorContext(normalizedError)` - เพิ่มข้อมูลบริบทให้สมบูรณ์
  - `createFallbackError(unknownError)` - สร้าง safe fallback สำหรับ error ที่ไม่รู้จัก

#### 5.3 Refactor ErrorHandler.js เป็น Binary Intake Layer
- [ ] ปรับ `handleError(error, context)` รับ binary input:
  ```javascript
  handleError({
    ruleId: number,           // จาก RULE_IDS
    severityCode: number,     // จาก RULE_SEVERITY_FLAGS
    errorCode: number,        // จาก ERROR_CODES (ถ้ามี)
    sourceCode: number,       // validator/parser/cli/system
    filePath: string,
    position: object,
    context: object
  })
  ```
- [ ] เรียกใช้ normalizer แปลง binary  metadata ก่อนประมวลผลต่อ
- [ ] ลบ logic ที่ใช้ string comparison หรือ literal severity ทั้งหมด
- [ ] เพิ่ม validation ตรวจสอบ binary codes ว่าถูกต้องก่อนประมวลผล

#### 5.4 สร้าง Rendering Layer
- [ ] สร้าง `src/error-handler/error-renderer.js` มีฟังก์ชัน:
  - `renderMarkdownReport(normalizedErrors)` - สร้าง Markdown report แบบเต็ม
  - `renderConsoleSummary(normalizedErrors)` - สร้าง CLI summary
  - `renderJSONReport(normalizedErrors)` - สร้าง JSON output
  - `renderErrorDetail(normalizedError)` - สร้างรายละเอียด 1 error
  - `formatCodeSnippet(filePath, position, context)` - จัดรูปแบบ code block
- [ ] Renderer ต้องแสดงข้อมูลครบถ้วน:
  - Rule slug และชื่อกฎ (TH/EN)
  - Severity label และ binary code
  - Error source และ context
  - Code snippet พร้อม line numbers
  - Stack trace (ถ้ามี)

#### 5.5 ปรับ Transport Layer
- [ ] ปรับ `error-log-stream.js` ให้รับ normalized error objects
- [ ] เพิ่มฟังก์ชัน `writeMarkdownReport(filePath, content)` เขียน report แบบ atomic
- [ ] เพิ่มฟังก์ชัน `appendErrorLog(logPath, normalizedError)` เขียน log แบบ append
- [ ] รองรับ multiple output formats (markdown, json, plain text)
- [ ] เพิ่ม error retry และ fallback mechanism สำหรับการเขียนไฟล์

#### 5.6 Fallback และ Error Recovery
- [ ] สร้าง fallback constants ใน error-catalog:
  - `UNKNOWN_RULE` (binary: 0, slug: 'UNKNOWN_RULE')
  - `UNKNOWN_SEVERITY` (binary: 0, slug: 'UNKNOWN_SEVERITY')
  - `UNKNOWN_SOURCE` (binary: 0, slug: 'UNKNOWN_SOURCE')
- [ ] เพิ่ม safe fallback ทุกจุดที่อาจเจอ invalid binary code
- [ ] Log warning เมื่อใช้ fallback values เพื่อตรวจจับ bugs
- [ ] ป้องกัน ErrorHandler crash ด้วย try-catch และ fallback logic

#### 5.7 Integration และ Testing
- [ ] เพิ่ม unit tests สำหรับแต่ละ layer:
  - `error-normalizer.test.js` - ทดสอบการแปลง binary  metadata
  - `error-renderer.test.js` - ทดสอบการสร้าง output formats
  - `error-catalog.test.js` - ทดสอบ catalog data integrity
- [ ] เพิ่ม integration tests:
  - ทดสอบ end-to-end flow: binary input  file output
  - ทดสอบ fallback scenarios
  - ทดสอบ concurrent error handling
- [ ] เพิ่ม regression tests ป้องกัน breaking changes

### ขั้นตอนที่ 6: สร้างเครื่องมือตรวจสอบและทดสอบ (ยังไม่เริ่ม)
- [ ] จัดทำ checklist หรือ script สำหรับตรวจสอบความสอดคล้องของ metadata ทั้งระบบ (rules  validator  CLI  ErrorHandler)
- [ ] เพิ่ม test plan หรือ test cases ที่ยืนยัน binary-first pipeline แบบ end-to-end
- [ ] จัดตั้ง regression suite สำหรับเอกสาร/รายงาน Markdown และ CLI output

---

## 3. ทะเบียนไฟล์ทั้งระบบและสถานะ
ตารางต่อไปนี้ครอบคลุมไฟล์ทั้งหมดใน repository ปัจจุบัน แบ่งตามโครงสร้างโฟลเดอร์เพื่อใช้ติดตามความคืบหน้าการ migrate ให้เป็น Binary-First

### รากโปรเจ็กต์
- [x] `.gitignore`
- [ ] `cli-config.json`
- [x] `cli.js`
- [ ] `extension-wrapper.js`
- [ ] `LICENSE`
- [ ] `package.json`
- [ ] `README.md`

### โฟลเดอร์ `docs/`
- [ ] `docs/ARCHITECTURE_VISION.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/BINARY_MIGRATION_STATUS.md` (ไฟล์ดัชนี; ดูรายการภาคภาษาไทย/อังกฤษด้านล่าง)
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

### โฟลเดอร์ `logs/`
- [ ] `logs/errors/file-reports/` (ตรวจสอบกลไกบันทึกหลัง ErrorHandler refactor)

### โฟลเดอร์ `src/`
- [ ] `src/extension-config.json`
- [ ] `src/extension.js`

#### `src/constants/`
- [x] `src/constants/rule-constants.js`  **ศูนย์กลาง Binary Rule Constants**
- [x] `src/constants/severity-constants.js`  **ศูนย์กลาง Severity Constants**

> **หมายเหตุสำคัญ**: `src/constants/` เป็นโฟลเดอร์ศูนย์กลางสำหรับ constants ทั้งหมด  
> ไฟล์อื่นๆ **ห้าม** สร้าง constants เอง ต้อง import จาก `src/constants/` เท่านั้น

#### `src/error-handler/`
- [ ] `src/error-handler/error-handler-config.js`
- [ ] `src/error-handler/error-log-stream.js`
- [ ] `src/error-handler/ErrorHandler.js`

#### `src/grammars/`
- [ ] `src/grammars/index.d.ts`
- [ ] `src/grammars/index.js`
- [ ] `src/grammars/docs/CHANGELOG.md`

##### `src/grammars/shared/`
- [ ] `src/grammars/shared/binary-prophet.js`
- [ ] `src/grammars/shared/binary-scout.js`
- [ ] `src/grammars/shared/constants.js`
- [ ] `src/grammars/shared/enhanced-binary-parser.js`
- [ ] `src/grammars/shared/grammar-index.js`
- [ ] `src/grammars/shared/parser-config.json`
- [ ] `src/grammars/shared/pure-binary-parser.js`
- [ ] `src/grammars/shared/tokenizer-helper.js`

###### `src/grammars/shared/configs/`
- [ ] `src/grammars/shared/configs/quantum-architecture.json`
- [ ] `src/grammars/shared/configs/unicode/unicode-identifier-ranges.json`

###### `src/grammars/shared/grammars/`
- [ ] `src/grammars/shared/grammars/java.grammar.json`
- [ ] `src/grammars/shared/grammars/javascript.grammar.json`
- [ ] `src/grammars/shared/grammars/jsx.grammar.json`
- [ ] `src/grammars/shared/grammars/typescript.grammar.json`

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

> **หมายเหตุ**: กฎทั้งหมด import constants จาก `src/constants/rule-constants.js` และ `src/constants/severity-constants.js` เท่านั้น  
> ห้ามมี local constants ในโฟลเดอร์นี้

#### `src/security/`
- [ ] `src/security/error-handlers.json`
- [ ] `src/security/rate-limit-store-factory.js`
- [ ] `src/security/security-config.js`
- [ ] `src/security/security-defaults.json`
- [ ] `src/security/security-manager.js`
- [ ] `src/security/security-middleware.js`
- [ ] `src/security/suspicious-patterns.json`

> หมายเหตุ: ไฟล์ที่ทำเครื่องหมาย [x] คือปรับให้สอดคล้อง Binary-First แล้วและอยู่ในสถานะต้องรีวิวต่อเนื่อง ไฟล์ที่ทำเครื่องหมาย [ ] ยังไม่มีการปรับหรือรอการยืนยันผล

---

## 4. ความเสี่ยงและข้อควรระวัง
- **การแปลง ErrorHandler:** ความซับซ้อนสูงและเป็นจุดสุดท้ายของ pipeline; ต้องจัดทำ backup และรีวิวโค้ดอย่างเคร่งครัด
- **ความไม่สอดคล้องของ metadata:** หากกฎใดลืม slug หรือ severity ที่ตรงกับคอนสแตนต์จะทำให้รายงาน ErrorHandler ผิดพลาดหรือแสดง UNKNOWN
- **การเปลี่ยนแปลงพร้อมกันหลายไฟล์:** ควรใช้การ commit ย่อยเพื่อช่วยในการยกเลิก/แก้ไขได้ง่ายขึ้น

---

## 5. ภาคผนวก
- **ไฟล์ที่เกี่ยวข้องหลัก:**
  - `src/constants/rule-constants.js`
  - `src/constants/severity-constants.js`
  - `src/rules/*.js`
  - `src/rules/validator.js`
  - `cli.js`
  - `src/error-handler/ErrorHandler.js`
- **สถานะล่าสุด:** `src/error-handler/ErrorHandler.js` ถูก revert กลับเวอร์ชันเดิมหลังการ refactor ครั้งก่อนล้มเหลว ต้องเริ่มวางแผนใหม่ภายใต้ขั้นตอนที่ 5

---

> เอกสารฉบับนี้จัดทำเพื่อใช้ติดตามและประสานงานการปรับระบบ Chahuadev Sentinel สู่สถาปัตยกรรม Binary-First อย่างเป็นทางการ หากมีการอัปเดตเพิ่มเติม กรุณาแก้ไขไฟล์นี้พร้อมระบุวันที่และผู้แก้ไขให้ครบถ้วน
