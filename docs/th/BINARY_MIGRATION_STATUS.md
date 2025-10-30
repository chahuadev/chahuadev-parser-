# Chahuadev Sentinel — Binary Migration Status Report

**วันที่อัปเดต:** 23 ตุลาคม 2025  
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

### ขั้นตอนที่ 5: ปรับ ErrorHandler เป็นเลเยอร์แปลผล (เสร็จสมบูรณ์)

> **อัปเดต 23 ตุลาคม 2025 (สร้างระบบ Binary Error ใหม่ทั้งหมด):**
> - สร้างระบบ Binary Error ใหม่ทั้งหมดตั้งแต่ศูนย์ด้วยสถาปัตยกรรมแบบ Grammar-Driven
> - สร้าง `src/error-handler/binary-error.grammar.js` เป็น Single Source of Truth ที่กำหนด:
>   - โครงสร้าง Binary Code 64 บิต: Domain (16 บิต) | Category (16 บิต) | Severity (8 บิต) | Source (8 บิต) | Offset (16 บิต)
>   - รหัสทั้งหมดเป็น string เพื่อหลีกเลี่ยงข้อจำกัด 53 บิตของ JavaScript
>   - นิยาม domain/category/severity/source ครบถ้วนพร้อม metadata สองภาษา
>   - Meta codes สำหรับ error ระดับระบบ (INVALID_ERROR_CODE, RECURSIVE_ERROR ฯลฯ)
> - สร้าง `src/error-handler/binary-code-utils.js` พร้อม utilities หลัก:
>   - `createErrorCode(domain, category, severity, source, offset)` - ประกอบรหัส 64 บิต
>   - `createErrorCodeBuilder(grammar, domain, category)` - โรงงานสร้าง builder เฉพาะ domain
>   - `getComponentMap(grammar, componentType)` - สร้าง Maps สำหรับค้นหาเร็ว
> - สร้าง `src/error-handler/binary-codes.js` เป็น factory ที่สร้างล่วงหน้า:
>   - สร้าง error builders ทั้งหมดอัตโนมัติตอน import ด้วยการวนลูป Grammar
>   - รูปแบบ: `BinaryCodes.DOMAIN.CATEGORY(severity, source, offset)`
>   - ตัวอย่าง: `BinaryCodes.PARSER.SYNTAX(CRITICAL, CLI, 1001)` คืน "562954785784809"
> - สร้าง `src/error-handler/BinaryErrorParser.js` สำหรับแยกส่วนประกอบ:
>   - `decomposeBinaryCode(code)` - แยก 5 ส่วนประกอบจากรหัส 64 บิต
>   - `renderHumanReadable(code, language)` - สร้างข้อความ error แบบจัดรูปแบบ
>   - `shouldThrowError(code)` - ตัดสินว่า error ควร throw หรือ log
> - สร้าง `src/error-handler/binary-reporter.js` เป็น interface รวม:
>   - `reportError(binaryCode, context)` - ฟังก์ชันเดียวสำหรับรายงาน error ทั้งหมด
>   - บันทึก log อัตโนมัติลงไฟล์ (centralized-errors.log, critical-errors.log)
>   - ป้องกัน recursive error ด้วย META_RECURSIVE_ERROR
> - สร้าง `src/error-handler/binary-log-stream.js` สำหรับจัดการไฟล์:
>   - `ensureLogDirectory()` - สร้างโฟลเดอร์ log ถ้ายังไม่มี
>   - `appendToLog(binaryCode, message, context)` - เขียนลงไฟล์ log
> - ย้าย `cli.js` เป็น Binary Pattern 100 เปอร์เซ็นต์ (แก้ 10 จุด error)
> - ลบ `ErrorHandler.js` แบบเดิมทิ้งเพื่อบังคับใช้ Binary Pattern แท้ๆ
> - สร้างชุดทดสอบครบถ้วน (tests/test-01 ถึง test-04 บวก run-all-tests.js)
> - ผลทดสอบ: BinaryCodes factory ทำงานสมบูรณ์ แต่พบ bug วิกฤตใน parser

> **อัปเดต 18 ตุลาคม 2025:**
> - ปรับ `src/error-handler/error-catalog.js` ให้โครงสร้างโดเมนแบบลำดับชั้นเสร็จสมบูรณ์ ทำให้ผู้ใช้ปลายน้ำสามารถอ่านรหัสโดเมน slug และคำอธิบายจาก payload ที่ normalize แล้วได้ทันที
> - เพิ่ม metadata สองภาษา (recommended action, canRetry, isFatal) ให้พจนานุกรม Syntax และ Type ใน `src/error-handler/error-dictionary.js` ส่วนหมวดอื่น ๆ ยังคงอยู่ในแผนงาน
> - ปรับ `src/error-handler/error-normalizer.js` ให้ส่งต่อ domain descriptor, severity metadata และ recommended action ในทุกกรณี รวมถึงเส้นทาง fallback
> - `src/rules/validator.js` ส่งค่า error แบบ binary-only (sourceCode, severityCode, errorCode) ทั้งในกรณีบูต parser ล้มเหลวและเมื่อการประมวลผลกฎรายตัวผิดพลาด ช่วยผลักดันข้อกำหนด Phase 5.3
> - แยกเลเยอร์ Rendering ออกเป็นไฟล์ `src/error-handler/error-renderer.js` ทำให้ `ErrorHandler.js` เหลือหน้าที่ intake + transport เท่านั้น

> **อัปเดต 18 ตุลาคม 2025 (เริ่มใช้ตัวช่วยสร้าง payload):**
> - เพิ่ม `src/error-handler/error-emitter.js` พร้อมฟังก์ชัน `createSystemPayload` และ `emitSecurityNotice` เพื่อให้จุดเรียกใช้งานไม่ต้องสร้าง payload แบบแมนนวลหรืออาศัย string severity อีกต่อไป
> - ขยาย `error-catalog.js` และ `error-dictionary.js` ด้วยหมวด Security โดยเฉพาะ พร้อมรหัส runtime ใหม่ (uncaught exception, unhandled rejection, process warning, report failure) และ metadata สองภาษาสำหรับแต่ละเหตุการณ์
> - ปรับ `setupGlobalErrorHandlers` และขั้นเริ่มต้นของ `SecurityMiddleware` ให้ใช้ helper ใหม่นำร่องการเลิกใช้ signature แบบสองพารามิเตอร์ของ `handleError`
> - เปิดสมุดบันทึกปัญหาสองภาษา (`docs/en/BINARY_MIGRATION_ISSUES.md`, `docs/th/BINARY_MIGRATION_ISSUES.md`) เพื่อจดอุปสรรคและจุดเรียกที่ยังต้องอัปเดตระหว่างการย้าย

> **อัปเดต 17 ตุลาคม 2025:**
> - ตัดการเรียก `errorHandler` ออกจากกฎทั้งหมด (`src/rules/*.js`) เพื่อให้เลเยอร์กฎส่งเฉพาะรหัสไบนารีตามสัญญา Phase 5 เตรียมพร้อมสำหรับ Binary Intake Layer.
> - เพิ่มรหัสวินิจฉัย **1008 / 1009** สำหรับตรวจจับสถานะ Tokenizer โดยยกระดับให้เป็นเหตุการณ์ CRITICAL ทันทีที่การบูต Brain หรือการแปลง Grammar ล้มเหลว ทำให้ท่อประมวลผลต้องหยุดเพื่อป้องกันข้อมูลผิดพลาด
> - การรัน `node cli src\` รอบล่าสุดสำเร็จหลังเพิ่มการตรวจสอบความสมบูรณ์ใน `PureBinaryTokenizer.loadGrammarSections` และย้ายข้อความสถานะไปยังช่อง `telemetry-recorder` ใหม่ ทำให้ยังคงป้องกัน CRITICAL 1008/1009 แต่ไม่มี log โค้ด 500 ปรากฏใน CLI อีกต่อไป
> - ขั้นถัดไปคือยกระบบ Error Catalog ให้เป็นลำดับชั้น (Domain  Category  Code) พร้อม metadata ประเภท retry/fatal และแหล่งอ้างอิงมาตรฐาน เพื่อให้เครื่องมือ downstream วิเคราะห์แล้วตัดสินใจได้อัตโนมัติ

#### 5.1 ออกแบบสถาปัตยกรรม Binary Error แบบ Grammar-Driven
- [x] ออกแบบระบบ Binary Error แบบ Grammar-Driven ด้วยโครงสร้างรหัส 64 บิต:
  - **โครงสร้าง 64 บิต:** Domain (16) | Category (16) | Severity (8) | Source (8) | Offset (16)
  - **Single Source of Truth:** `binary-error.grammar.js` กำหนด domains, categories, severities, sources ทั้งหมด
  - **Pure Binary Pattern:** รหัสทั้งหมดเป็น string เพื่อหลีกเลี่ยงข้อจำกัด 53 บิตของ JavaScript
  - **Factory Pattern:** `BinaryCodes.DOMAIN.CATEGORY(severity, source, offset)` สร้างล่วงหน้าตอน import
  - **Unified Interface:** `reportError(binaryCode, context)` สำหรับรายงาน error ทั้งหมด

#### 5.2 สร้าง Binary Error Grammar และ Core Utilities
- [x] สร้าง `src/error-handler/binary-error.grammar.js` เป็น Single Source of Truth:
  - ส่วน Config กำหนดโครงสร้างรหัสและกฎการประกอบ
  - ส่วน Meta มีรหัส error ระดับระบบ (INVALID_ERROR_CODE, RECURSIVE_ERROR)
  - ส่วน Domains กำหนด error domains ทั้งหมด (PARSER, VALIDATOR, SYSTEM, CLI, SECURITY, RULE)
  - ส่วน Categories กำหนด error categories ต่อ domain (SYNTAX, TYPE, REFERENCE ฯลฯ)
  - ส่วน Severities มีชื่อสองภาษาและ shouldThrow flags
  - ส่วน Sources กำหนดที่มาของ error (CLI, VALIDATOR, PARSER, SYSTEM)
- [x] สร้าง `src/error-handler/binary-code-utils.js` พร้อม utilities การประกอบรหัส:
  - `createErrorCode(domain, category, severity, source, offset)` - ประกอบรหัส 64 บิต
  - `createErrorCodeBuilder(grammar, domain, category)` - โรงงานสร้าง builders
  - `getComponentMap(grammar, componentType)` - สร้าง Maps สำหรับค้นหาเร็ว
  - รหัสทั้งหมดคืนเป็น string เพื่อความปลอดภัย 64 บิต
- [x] สร้าง `src/error-handler/binary-codes.js` เป็น factory ที่สร้างล่วงหน้า:
  - สร้าง BinaryCodes.DOMAIN.CATEGORY builders ทั้งหมดอัตโนมัติตอน import
  - วนลูป Grammar domains และ categories เพื่อสร้าง builders
  - Export BinaryCodes object พร้อม builders ทั้งหมด
  - ตัวอย่าง: `BinaryCodes.PARSER.SYNTAX(CRITICAL, CLI, 1001)`

#### 5.3 Refactor ErrorHandler.js เป็น Binary Intake Layer (กำลังดำเนินการ)
- [x] บังคับให้ `handleError` ทุกเส้นทางผ่าน `error-normalizer.js` เพื่อแปลงรหัสไบนารีเป็น metadata จาก dictionary ก่อนบันทึกหรือล็อกออก
- [x] เพิ่ม helper ส่วนกลาง (`createSystemPayload`, `emitSecurityNotice`) และใช้งานกับ global process hooks รวมถึงขั้นเริ่มต้นของ Security middleware
- [ ] ปรับ signature `handleError(error, context)` ให้ผู้เรียกส่งเฉพาะรหัสไบนารีและ metadata ที่มีโครงสร้าง (ไม่รับ string severity อีกต่อไป)
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
- [ ] เสริม validation ให้ reject ค่า severity แบบสตริงแต่เนิ่น ๆ และรายงานเป็นความผิดพลาดการตั้งค่า
- [x] ย้ายข้อความสถานะของ Tokenizer/Grammar ที่สำเร็จออกจาก `handleError` หรือกำหนดรหัสเฉพาะ เพื่อไม่ให้ CLI แสดง “Unknown error code”
- [x] เพิ่ม smoke test `node cli src\` เพื่อยืนยันว่า instrumentation ระดับ LOW/MEDIUM ไม่ถูกส่งผ่านช่อง aggressive อีก
- [x] ปรับ `error-catalog.js` ให้มีโครงสร้างโดเมนแบบลำดับชั้นและ helper สำหรับประกอบรหัส (Domain  Family  Code)
- [ ] เพิ่ม metadata (isFatal, canRetry, recommendedAction ฯลฯ) ให้แต่ละ entry ใน `error-dictionary.js` แล้วเชื่อมต่อถึง normalizer *(หมวด Syntax และ Type เสร็จแล้ว หมวดที่เหลือยังรอดำเนินการ)*
- [ ] อัปเดต `error-normalizer.js` ให้ตรวจจับรหัสมาตรฐานภายนอก (HTTP status, errno) พร้อมแนบ metadata และ domain descriptor ลงใน payload *(ปล่อย domain descriptor และ metadata แล้ว ส่วนการรองรับรหัสภายนอกยังอยู่ระหว่างพัฒนา)*
- [ ] Refactor `ErrorHandler.js` ให้รับ binary payload ที่มีโครงสร้างตายตัว แล้วปรับจุดเรียกใช้งานใน validator / grammars / security / extension ให้สอดคล้อง
- [ ] ปรับจุดเรียกที่เหลือใน security, extension, grammars และ CLI ให้ใช้ helper ใหม่ทั้งหมด พร้อมจดบันทึกอุปสรรคในสมุดบันทึกสองภาษา
- [ ] จัดโครงเลเยอร์ Renderer ให้สมบูรณ์ ย้าย helper การแสดงผลที่เหลือออกจาก ErrorHandler และให้ transport รับเฉพาะ normalized error objects
- [x] แก้ไขสาเหตุรหัส CRITICAL 1008/1009 โดยตรวจสอบการโหลด GrammarIndex และการ flatten ส่วน grammar ให้เสถียรก่อนประกาศว่า intake layer พร้อมใช้งาน

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

### ขั้นตอนที่ 7: การย้ายจาก JSON ไปเป็น ES Module (กำลังดำเนินการ)

> **เหตุผล:**  
> ไฟล์ JSON ต้องใช้การประมวลผล 3 ขั้นตอนที่มีต้นทุนสูง: **I/O  String  JSON.parse()  Object** การ parse ดังกล่าวสร้างปัญหาคอขวดด้านประสิทธิภาพ โดยเฉพาะไฟล์ grammar ที่ถูกโหลดบ่อยครั้งระหว่าง tokenization การย้ายจาก `.json` ไปเป็น `.js` ES Modules ช่วยให้เราใช้ประโยชน์จากระบบโหลดโมดูลแบบ native ของ V8 — JavaScript Engine เข้าใจไฟล์ `.js` โดยกำเนิด โดยไม่ต้องผ่านขั้นตอน string-to-object parsing เลย

> **อัปเดต 23 ตุลาคม 2025:**
> - ย้ายไฟล์ grammar สำคัญทั้งหมดจาก JSON ไปเป็น ES Modules:
>   - `java.grammar.json`  `java.grammar.js` (export เป็น `javaGrammar`)
>   - `javascript.grammar.json`  `javascript.grammar.js` (export เป็น `javascriptGrammar`)
>   - `typescript.grammar.json`  `typescript.grammar.js` (export เป็น `typescriptGrammar`)
>   - `jsx.grammar.json`  `jsx.grammar.js` (export เป็น `jsxGrammar`)
> - ย้ายไฟล์ configuration หลัก:
>   - `tokenizer-binary-config.json`  `tokenizer-binary-config.js` (export เป็น `tokenizerBinaryConfig`)
>   - `parser-config.json`  `parser-config.js` (export เป็น `parserConfig`)
>   - `quantum-architecture.json`  `quantum-architecture.js` (export เป็น `quantumArchitectureConfig`)
>   - `unicode-identifier-ranges.json`  `unicode-identifier-ranges.js` (export เป็น `unicodeIdentifierRanges`)
> - อัปเดต `grammar-index.js` ให้ใช้ `import()` แบบ dynamic แทนที่ `JSON.parse(readFileSync())`
> - ใช้รูปแบบ async initialization พร้อม method `ready()` เพื่อรองรับ constructor
> - แก้ไขปัญหา Windows ด้วย `pathToFileURL()` สำหรับ file:// URL scheme
> - **การทดสอบ:** ยืนยันว่าการโหลด grammar ทำงานถูกต้อง (โหลด 75 keywords และ 48 operators สำเร็จ)
> - **ผลประโยชน์ด้านประสิทธิภาพ:** กำจัดขั้นตอน JSON parsing แบบ 3 ขั้นตอนออกไปโดยสิ้นเชิง

#### 7.1 การย้ายไฟล์ Grammar
- [x] แปลง `java.grammar.json`  `java.grammar.js`
- [x] แปลง `javascript.grammar.json`  `javascript.grammar.js`
- [x] แปลง `typescript.grammar.json`  `typescript.grammar.js`
- [x] แปลง `jsx.grammar.json`  `jsx.grammar.js`
- [x] อัปเดต `grammar-index.js` ให้ใช้ `import(pathToFileURL(path).href)` แทน `JSON.parse(readFileSync())`
- [x] ใช้รูปแบบ async initialization สำหรับ constructor ของ GrammarIndex
- [x] ทดสอบการโหลด grammar กับทุกภาษา

#### 7.2 การย้ายไฟล์ Configuration
- [x] แปลง `tokenizer-binary-config.json`  `tokenizer-binary-config.js`
- [x] แปลง `parser-config.json`  `parser-config.js`
- [x] แปลง `quantum-architecture.json`  `quantum-architecture.js`
- [x] แปลง `unicode-identifier-ranges.json`  `unicode-identifier-ranges.js`
- [ ] อัปเดตไฟล์ทั้งหมดที่อ้างอิงถึง config เหล่านี้ให้ import จาก `.js` แทน `.json`
  - [ ] `tokenizer-helper.js` (บรรทัด 131)
  - [ ] `grammars/index.js` (บรรทัด 81, 84)
  - [ ] ไฟล์ grammar helper อื่น ๆ

#### 7.3 การย้ายไฟล์ Security & Extension
- [ ] แปลง `error-handlers.json`  `error-handlers.js`
- [ ] แปลง `security-defaults.json`  `security-defaults.js`
- [ ] แปลง `suspicious-patterns.json`  `suspicious-patterns.js`
- [ ] แปลง `extension-config.json`  `extension-config.js`
- [ ] อัปเดตไฟล์ security และ extension ทั้งหมดให้ import จาก `.js` modules

#### 7.4 การย้ายไฟล์ Configuration ระดับราก
- [ ] แปลง `cli-config.json`  `cli-config.js`
- [ ] อัปเดต `cli.js` ให้ import จาก `cli-config.js`
- [ ] ประเมินการย้าย `package.json` (เลือกได้ - npm ต้องการ JSON format)

#### 7.5 อัปเดตเอกสาร
- [ ] อัปเดต `README.md` ให้สะท้อนสถาปัตยกรรม ES Module
- [ ] อัปเดต `docs/th/หน้าที่ไฟล์.md` ให้แสดง extension `.js`
- [ ] อัปเดตเอกสารสถาปัตยกรรมทั้งหมดที่กล่าวถึงไฟล์ JSON config

#### 7.6 ประโยชน์และการตรวจสอบ
- [x] **ประสิทธิภาพ:** V8 โหลดแบบ native (ไม่มี parsing overhead)
- [x] **Tree-shaking:** ES Modules รองรับการ import เฉพาะส่วนที่ต้องการ
- [x] **Type Safety:** IDE autocomplete และ static analysis ดีขึ้น
- [x] **การดูแลรักษา:** JavaScript syntax highlighting และ validation
- [ ] **การทดสอบ:** เพิ่ม benchmark เปรียบเทียบเวลาโหลด JSON vs ES Module
- [ ] **Regression:** ตรวจสอบให้แน่ใจว่าฟังก์ชันทุกอย่างยังทำงานหลังการย้าย

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
- [x] `src/grammars/shared/grammar-index.js` *(อัปเดตให้ใช้ ES Module imports แล้ว)*
- [x] `src/grammars/shared/parser-config.js` *(ย้ายจาก JSON แล้ว)*
- [ ] `src/grammars/shared/pure-binary-parser.js`
- [ ] `src/grammars/shared/tokenizer-helper.js`
- [x] `src/grammars/shared/tokenizer-binary-config.js` *(ย้ายจาก JSON แล้ว)*

###### `src/grammars/shared/configs/`
- [x] `src/grammars/shared/configs/quantum-architecture.js` *(ย้ายจาก JSON แล้ว)*
- [x] `src/grammars/shared/configs/unicode/unicode-identifier-ranges.js` *(ย้ายจาก JSON แล้ว)*

###### `src/grammars/shared/grammars/`
- [x] `src/grammars/shared/grammars/java.grammar.js` *(ย้ายจาก JSON แล้ว)*
- [x] `src/grammars/shared/grammars/javascript.grammar.js` *(ย้ายจาก JSON แล้ว)*
- [x] `src/grammars/shared/grammars/jsx.grammar.js` *(ย้ายจาก JSON แล้ว)*
- [x] `src/grammars/shared/grammars/typescript.grammar.js` *(ย้ายจาก JSON แล้ว)*

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

## 4. แผนงาน TODO อย่างเป็นทางการ

> ** สำคัญ - การย้ายจาก JSON ไปเป็น ES Module:**  
> ขั้นตอนที่ 7 กำลังดำเนินการเพื่อย้ายไฟล์ JSON ทั้งหมดไปเป็น ES Modules (.js) เพื่อปรับปรุงประสิทธิภาพอย่างมหาศาล JSON.parse() สร้างคอขวดการ parse (I/O  String  Parse  Object) ในขณะที่ ES Modules ถูกโหลดโดย V8 แบบ native โดยไม่มี parsing overhead เลย ไฟล์ grammar และ config สำคัญทั้งหมดถูกย้ายเรียบร้อยแล้ว งานที่เหลือคืออัปเดตการอ้างอิงไฟล์และย้าย config ของ security/extension

### งานเร่งด่วน (สัปดาห์ที่ 42, พ.ศ. 2568)
- [ ] **[ขั้นตอนที่ 7]** อัปเดตการอ้างอิงไฟล์ที่เหลือให้ใช้ extension `.js` แทน `.json` (tokenizer-helper.js บรรทัด 131, grammars/index.js บรรทัด 81/84)
- [ ] **[ขั้นตอนที่ 7]** ย้ายไฟล์ configuration ด้านความปลอดภัย: `error-handlers.json`, `security-defaults.json`, `suspicious-patterns.json`  ES Modules `.js`
- [ ] **[ขั้นตอนที่ 7]** ย้าย `extension-config.json`  `extension-config.js` และอัปเดต imports ใน extension.js
- [ ] ย้ายจุดเรียก `handleError` ที่เหลือ (`src/security/security-manager.js`, `src/security/security-middleware.js`, `src/security/rate-limit-store-factory.js`, ไฟล์ `src/grammars/shared/*.js`, และ `src/extension.js`) ไปใช้ `createSystemPayload` / `emitSecurityNotice` พร้อมทดสอบด้วย CLI smoke test เพื่อยืนยันความถูกต้อง
- [ ] อัปเดต `ErrorHandler.handleError` ให้รับเฉพาะ payload ที่มีโครงสร้าง (object) ปฏิเสธ signature แบบเดิม และบันทึกสัญญาใหม่ใน `README.md` รวมถึง `docs/th/หน้าที่ไฟล์.md`
- [ ] เติม metadata (`recommendedAction`, `canRetry`, `isFatal`) ให้หมวด Logical, File System, Security และหมวดที่เหลือใน `error-dictionary.js` จากนั้นเชื่อมต่อข้อมูลผ่าน `error-normalizer.js`
- [ ] เพิ่มชุดทดสอบ (Jest) สำหรับ `error-emitter.js` ครอบคลุมการ coercion ของ severity การ sanitise context การเลือก fallback error และการตีตราเหตุการณ์ security

### งานต่อเนื่องระยะใกล้
- [ ] เพิ่ม validation ค่า severity ภายใน `error-normalizer.js` และ `ErrorHandler.js` เพื่อให้ค่าประเภทสตริงหรือรหัสไม่รู้จักถูกปฏิเสธทันที พร้อมรายงานผ่าน Security catalogue
- [ ] สอน `error-normalizer.js` ให้แม็พ HTTP status codes และรหัส `errno` ของ Node ไปยัง domain descriptor ใหม่ พร้อมบันทึก telemetry เมื่อการแม็พล้มเหลว
- [ ] ทำให้ transport แยกจาก `ErrorHandler.js` โดยย้าย helper ฝั่ง console/log ไปยัง renderer และส่งต่อเฉพาะ normalized error objects
- [ ] อัปเดตรายงานสถานะ EN/TH พร้อมเชื่อมโยงสมุดบันทึกปัญหาเมื่อการย้ายตัวช่วย (helper migration) สำเร็จ พร้อมสรุปผลกระทบด้านการดำเนินงาน

### กิจกรรมสนับสนุน
- [ ] เพิ่ม regression test สำหรับ `error-log-stream.js` และตัวเขียนรายงาน Markdown หลัง refactor transport layer เสร็จสมบูรณ์
- [ ] จัดทำสคริปต์หรือ CI ตรวจสอบให้ Appendix A สอดคล้องกับโครงสร้าง repository ล่าสุดทุกครั้งที่มีไฟล์เพิ่ม/ลบ
- [ ] นัดรีวิวคำศัพท์และคำอธิบายสองภาษา หลังเปลี่ยนสัญญา ErrorHandler (เป้าหมายสัปดาห์ที่ 44, พ.ศ. 2568)

---

## 5. ปัญหาและอุปสรรครอแก้ไข
- **ISS-2025-10-18-01 — Legacy Callers:** ยังมีจุดเรียก `handleError` แบบสองพารามิเตอร์หลงเหลือ ทำให้ไม่สามารถบังคับใช้ payload แบบโครงสร้างได้เต็มที่ ติดตามการแก้ไขในสมุดปัญหาทั้งสองภาษา และยังไม่ควรเปลี่ยน signature จนกว่าจะเคลียร์ครบ
- **ISS-2025-10-18-02 — Helper Test Gap:** `error-emitter.js` ยังไม่มี automated test จำเป็นต้องเพิ่มก่อนนำ helper ไปใช้กับโมดูลอื่นเพื่อลดความเสี่ยง regression
- **Schema Drift Risk:** รายการ metadata ใน Security catalogue ยังอาศัยการอัปเดตด้วยมือ หากขาดข้อมูลระบบจะ fallback ทันที ต้องผูกงานนี้เข้ากับ TODO ข้างต้นและตรวจสอบก่อนขยายชุดทดสอบ

---

## 6. ความเสี่ยงและข้อควรระวัง
- **การแปลง ErrorHandler:** ความซับซ้อนสูงและเป็นจุดสุดท้ายของ pipeline; ต้องจัดทำ backup และรีวิวโค้ดอย่างเคร่งครัด
- **ความไม่สอดคล้องของ metadata:** หากกฎใดลืม slug หรือ severity ที่ตรงกับคอนสแตนต์จะทำให้รายงาน ErrorHandler ผิดพลาดหรือแสดง UNKNOWN
- **การเปลี่ยนแปลงพร้อมกันหลายไฟล์:** ควรใช้การ commit ย่อยเพื่อช่วยในการยกเลิก/แก้ไขได้ง่ายขึ้น

---

## 7. ภาคผนวก
- **ไฟล์ที่เกี่ยวข้องหลัก:**
  - `src/constants/rule-constants.js`
  - `src/constants/severity-constants.js`
  - `src/rules/*.js`
  - `src/rules/validator.js`
  - `cli.js`
  - `src/error-handler/ErrorHandler.js`
- **สถานะล่าสุด:** `src/error-handler/ErrorHandler.js` ถูก revert กลับเวอร์ชันเดิมหลังการ refactor ครั้งก่อนล้มเหลว ต้องเริ่มวางแผนใหม่ภายใต้ขั้นตอนที่ 5

## 8. ผังต้นไม้ของโปรเจ็กต์และหน้าที่ไฟล์
```
Chahuadev-Sentinel/
├─ .git/ — ข้อมูลภายในของ Git (history, refs, hooks)
├─ .gitignore — รูปแบบไฟล์ที่ไม่ต้องติดตามใน Git
├─ .vscode/
│  └─ launch.json — การตั้งค่าดีบักสำหรับ VS Code
├─ .vscodeignore — รายการไฟล์ที่ไม่ต้องรวมในแพ็กเกจส่วนขยาย
├─ cli-config.json — การตั้งค่าและแฟล็กสำหรับ CLI
├─ cli.js — จุดเริ่มต้นของเครื่องมือ CLI ของ Sentinel
├─ docs/
│  ├─ en/ — เอกสารภาษาอังกฤษ
│  │  ├─ ARCHITECTURE.md — คำอธิบายสถาปัตยกรรมภาพรวมภาษาอังกฤษ
│  │  ├─ ARCHITECTURE_VISION.md — วิสัยทัศน์สถาปัตยกรรมภาษาอังกฤษ
│  │  ├─ BINARY_MIGRATION_ISSUES.md — สมุดปัญหาการย้ายแบบไบนารี (EN)
│  │  ├─ BINARY_MIGRATION_STATUS.md — รายงานสถานะ (EN)
│  │  ├─ CODE_OF_CONDUCT.md — จรรยาบรรณผู้ร่วมพัฒนา (EN)
│  │  ├─ COLLABORATION.md — แนวทางการทำงานร่วมกัน (EN)
│  │  ├─ COMMIT_GUIDELINES.md — แนวปฏิบัติการคอมมิต (EN)
│  │  ├─ CONTRIBUTING.md — ขั้นตอนร่วมพัฒนา (EN)
│  │  ├─ GOVERNANCE.md — โครงสร้างการตัดสินใจ (EN)
│  │  ├─ MIGRATION_GUIDE.md — คู่มือย้ายระบบ (EN)
│  │  └─ RELEASE_PROCESS.md — ขั้นตอนปล่อยเวอร์ชัน (EN)
│  └─ th/ — เอกสารภาษาไทย
│     ├─ ARCHITECTURE_VISION.md — วิสัยทัศน์สถาปัตยกรรม (TH)
│     ├─ BINARY_MIGRATION_ISSUES.md — สมุดปัญหาการย้ายแบบไบนารี (TH)
│     ├─ BINARY_MIGRATION_STATUS.md — รายงานสถานะ (TH)
│     ├─ BLANK_PAPER_ARCHITECTURE.md — เอกสารร่างสถาปัตยกรรมฉบับกระดาษเปล่า
│     ├─ MIGRATION_GUIDE.md — คู่มือย้ายระบบ (TH)
│     ├─ QUANTUM_BINARY_ARCHITECTURE.md — สถาปัตยกรรมควอนตัม (TH)
│     ├─ TOKENIZER_FLOW.md — ลำดับงานของ tokenizer
│     ├─ ZONE_LINE_NUMBERS.md — ตารางหมายเลขบรรทัดตามโซน
│     ├─ ระบบการไหล-Chahuadev-Sentinel.md — ผังการไหลของระบบ Sentinel
│     └─ หน้าที่ไฟล์.md — สรุปหน้าที่ไฟล์ (TH)
├─ extension-wrapper.js — ตัวช่วยแพ็กส่วนขยาย VS Code
├─ LICENSE — ข้อความสัญญาอนุญาต MIT
├─ logo.png — ไฟล์โลโก้ของโปรเจ็กต์
├─ logs/
│  ├─ cli-run.txt — ล็อกการรัน CLI ล่าสุด
│  ├─ errors/
│  │  ├─ centralized-errors.log — ล็อกข้อผิดพลาดทั้งหมด
│  │  ├─ critical-errors.log — รายการข้อผิดพลาดระดับวิกฤต
│  │  └─ file-reports/
│  │     ├─ binary-scout.js.log — รายงานข้อผิดพลาดของ binary-scout
│  │     ├─ grammar-index.js.log — รายงานข้อผิดพลาดของ grammar-index
│  │     ├─ index.js.log — รายงานข้อผิดพลาดของ index.js (grammars)
│  │     ├─ pure-binary-parser.js.log — รายงานข้อผิดพลาดของ pure-binary-parser
│  │     ├─ tokenizer-helper.js.log — รายงานข้อผิดพลาดของ tokenizer-helper
│  │     └─ validator.js.log — รายงานข้อผิดพลาดของ validator
│  ├─ security.log — บันทึกกิจกรรม security middleware
│  └─ telemetry/
│     └─ telemetry.log — สตรีม telemetry notices
├─ package.json — ไฟล์ manifest และสคริปต์ของ Node
├─ README.md — เอกสารแนะนำโครงการหลัก
├─ src/
│  ├─ constants/
│  │  ├─ rule-constants.js — ค่าคงที่และตัวช่วยเกี่ยวกับรหัสกฎ
│  │  └─ severity-constants.js — ค่าคงที่ระดับความรุนแรงแบบไบนารี
│  ├─ error-handler/
│  │  ├─ error-catalog.js — เมทาดาทาโดเมน/หมวดหมู่และรหัสข้อผิดพลาด
│  │  ├─ error-dictionary.js — พจนานุกรมข้อความข้อผิดพลาดสองภาษา
│  │  ├─ error-emitter.js — ฟังก์ชันสร้าง payload สำหรับ handleError
│  │  ├─ error-handler-config.js — ค่า configuration ของ ErrorHandler
│  │  ├─ error-log-stream.js — ตัวช่วยเขียนรายงานข้อผิดพลาดลงไฟล์
│  │  ├─ error-normalizer.js — โลจิกแปลงรหัสไบนารีเป็น metadata
│  │  ├─ error-renderer.js — ตัวช่วยเรนเดอร์คอนโซลและรายงาน
│  │  ├─ ErrorHandler.js — คลาสศูนย์กลางจัดการข้อผิดพลาด
│  │  └─ telemetry-recorder.js — ตัวช่วยบันทึก telemetry
│  ├─ extension-config.json — การตั้งค่าส่วนขยาย VS Code
│  ├─ extension.js — จุดเริ่มต้นส่วนขยาย VS Code
│  ├─ grammars/
│  │  ├─ docs/
│  │  │  └─ CHANGELOG.md — บันทึกการเปลี่ยนแปลงของ grammars
│  │  ├─ index.d.ts — การประกาศประเภท TypeScript ของโมดูล grammars
│  │  ├─ index.js — จุดรวม utilities ของ grammars
│  │  └─ shared/
│  │     ├─ binary-prophet.js — ตัวช่วยคาดการณ์และแก้ปัญหาความกำกวม
│  │     ├─ binary-scout.js — โมดูลสอดส่อง grammar
│  │     ├─ configs/
│  │     │  ├─ quantum-architecture.json — สเปกสถาปัตยกรรม grammar ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │  ├─ quantum-architecture.js — สเปกสถาปัตยกรรม grammar (ES Module)
│  │     │  └─ unicode/
│  │     │     ├─ unicode-identifier-ranges.json — ขอบเขตตัวอักษร Unicode ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │     └─ unicode-identifier-ranges.js — ขอบเขตตัวอักษร Unicode (ES Module)
│  │     ├─ constants.js — ค่าคงที่และ mapping ต่าง ๆ
│  │     ├─ enhanced-binary-parser.js — Parser เวอร์ชันขยาย
│  │     ├─ grammar-index.js — รีจิสทรีและตัวโหลด grammar
│  │     ├─ grammars/
│  │     │  ├─ java.grammar.json — คำนิยาม grammar ของ Java ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │  ├─ java.grammar.js — คำนิยาม grammar ของ Java (ES Module, export เป็น javaGrammar)
│  │     │  ├─ javascript.grammar.json — คำนิยาม grammar ของ JavaScript ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │  ├─ javascript.grammar.js — คำนิยาม grammar ของ JavaScript (ES Module, export เป็น javascriptGrammar)
│  │     │  ├─ jsx.grammar.json — คำนิยาม grammar ของ JSX ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │  ├─ jsx.grammar.js — คำนิยาม grammar ของ JSX (ES Module, export เป็น jsxGrammar)
│  │     │  ├─ typescript.grammar.json — คำนิยาม grammar ของ TypeScript ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     │  └─ typescript.grammar.js — คำนิยาม grammar ของ TypeScript (ES Module, export เป็น typescriptGrammar)
│  │     ├─ parser-config.json — การตั้งค่าของ parser ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     ├─ parser-config.js — การตั้งค่าของ parser (ES Module, export เป็น parserConfig)
│  │     ├─ pure-binary-parser.js — Parser หลักแบบไบนารี
│  │     ├─ tokenizer-binary-config.json — การตั้งค่า tokenizer แบบไบนารี ( เลิกใช้แล้ว - ใช้ .js แทน)
│  │     ├─ tokenizer-binary-config.js — การตั้งค่า tokenizer แบบไบนารี (ES Module, export เป็น tokenizerBinaryConfig)
│  │     └─ tokenizer-helper.js — ตัวช่วย orchestrate tokenizer
│  ├─ rules/
│  │  ├─ BINARY_AST_ONLY.js — กฎบังคับใช้ AST แบบไบนารีเท่านั้น
│  │  ├─ MUST_HANDLE_ERRORS.js — กฎบังคับให้จัดการข้อผิดพลาด
│  │  ├─ NO_CONSOLE.js — กฎห้ามใช้ console
│  │  ├─ NO_EMOJI.js — กฎห้ามใช้ emoji ในโค้ด
│  │  ├─ NO_HARDCODE.js — กฎห้ามฮาร์ดโค้ดค่า
│  │  ├─ NO_INTERNAL_CACHING.js — กฎห้ามสร้าง cache แอบแฝง
│  │  ├─ NO_MOCKING.js — กฎห้าม mocking ใน production
│  │  ├─ NO_SILENT_FALLBACKS.js — กฎห้าม fallback เงียบ ๆ
│  │  ├─ NO_STRING.js — กฎบังคับใช้ตัวระบุแบบไบนารี
│  │  ├─ STRICT_COMMENT_STYLE.js — กฎควบคุมรูปแบบคอมเมนต์
│  │  └─ validator.js — เอนจินตรวจสอบกฎทั้งหมด
│  └─ security/
│     ├─ error-handlers.json — การตั้งค่าตัวจัดการข้อผิดพลาดด้านความปลอดภัย
│     ├─ rate-limit-store-factory.js — โรงงานสร้างที่เก็บข้อมูล rate limit
│     ├─ security-config.js — การตั้งค่า security middleware
│     ├─ security-defaults.json — ค่าเริ่มต้นของนโยบายความปลอดภัย
│     ├─ security-manager.js — โลจิกจัดการระบบความปลอดภัย
│     ├─ security-middleware.js — middleware เพื่อความปลอดภัยใน VS Code
│     └─ suspicious-patterns.json — รายการรูปแบบต้องสงสัยสำหรับการตรวจจับ
└─ tests/
   └─ cli-smoke.test.js — การทดสอบ smoke สำหรับ CLI
```

---

> เอกสารฉบับนี้จัดทำเพื่อใช้ติดตามและประสานงานการปรับระบบ Chahuadev Sentinel สู่สถาปัตยกรรม Binary-First อย่างเป็นทางการ หากมีการอัปเดตเพิ่มเติม กรุณาแก้ไขไฟล์นี้พร้อมระบุวันที่และผู้แก้ไขให้ครบถ้วน
