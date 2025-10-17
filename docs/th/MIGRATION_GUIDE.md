# คู่มือการย้ายระบบ: สถาปัตยกรรม Binary-First

> **สำหรับนักพัฒนา**: ทำไมเราถึงย้ายมาใช้สถาปัตยกรรม Opcode & Decoder และวิธีการทำงานกับมัน

---

## สารบัญ

- [ทำไมต้องย้ายระบบ](#ทำไมต้องย้ายระบบ)
- [สิ่งที่เปลี่ยนแปลง](#สิ่งที่เปลี่ยนแปลง)
- [วิธีเพิ่มกฎใหม่](#วิธีเพิ่มกฎใหม่)
- [วิธีเพิ่ม Error Code ใหม่](#วิธีเพิ่ม-error-code-ใหม่)
- [Checklist การย้ายระบบ](#checklist-การย้ายระบบ)
- [ข้อผิดพลาดที่พบบ่อย](#ข้อผิดพลาดที่พบบ่อย)
- [คำถามที่พบบ่อย](#คำถามที่พบบ่อย)

---

## ทำไมต้องย้ายระบบ

### ปัญหาของระบบที่ใช้ String

สถาปัตยกรรมเดิมของเราใช้ string literals สำหรับ rule identifiers และข้อความ error:

```javascript
//  วิธีเก่า: ใช้ String (ก่อนย้ายระบบ)
const ruleId = 'NO_CONSOLE';
const severity = 'ERROR';

if (violation.ruleId === 'NO_CONSOLE') {
  console.error('Console usage detected');
}
```

**ปัญหาที่พบ:**

1. **ปัญหาด้านประสิทธิภาพ**
   - การเปรียบเทียบ string ช้ากว่าการเปรียบเทียบตัวเลข 10-100 เท่า
   - ทุกการเปรียบเทียบต้องตรวจสอบทีละไบต์
   - หลายพันครั้งของการเปรียบเทียบ string ต่อไฟล์ทำให้ parsing ช้าลง

2. **ความเสี่ยงจากการพิมพ์ผิด**
   ```javascript
   // ผิดพลาดแบบเงียบๆ - พิมพ์ผิดไม่ถูกจับจนกว่าจะ runtime
   if (ruleId === 'NO_CONSLE') { // พิมพ์ผิด: CONSLE vs CONSOLE
     // block นี้จะไม่ทำงานเลย!
   }
   ```

3. **สิ้นเปลือง Memory**
   - String `'NO_CONSOLE'` = 10+ bytes
   - Integer `64` = 4-8 bytes
   - คูณด้วยหลายพัน violations = memory สิ้นเปลืองมาก

4. **ไม่มี Type Safety**
   - IDE autocomplete ช่วยไม่ได้
   - ไม่มีการ validate ตอน compile-time
   - Refactoring ทำแล้วเจอ error ง่าย

5. **ความท้าทายด้าน Internationalization**
   - ข้อความ error hardcode เป็นภาษาอังกฤษ
   - การเพิ่มภาษาไทย/ภาษาอื่น ต้องแก้โค้ดทุกที่

### วิธีแก้: สถาปัตยกรรม Binary-First

```javascript
//  วิธีใหม่: ใช้ Opcode (หลังย้ายระบบ)
import { RULE_IDS } from './constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from './constants/severity-constants.js';

const ruleId = RULE_IDS.NO_CONSOLE;  // 64 (binary opcode)
const severity = RULE_SEVERITY_FLAGS.ERROR;  // 4 (binary opcode)

if (violation.ruleId === RULE_IDS.NO_CONSOLE) {
  // เปรียบเทียบตัวเลขแบบทันที, type-safe, IDE autocomplete ใช้ได้!
}
```

**ประโยชน์ที่ได้รับ:**

-  **เร็วขึ้น 10-100 เท่า** จากการเปรียบเทียบตัวเลข
-  **Type-safe** พร้อม IDE autocomplete
-  **ป้องกันการพิมพ์ผิด** (compile-time errors)
-  **ประหยัด memory** (4-8 bytes vs 10-100+ bytes)
-  **พร้อมสำหรับ i18n** (decoder รองรับหลายภาษา)

---

## สิ่งที่เปลี่ยนแปลง

### การย้ายระบบแบบเป็นขั้นตอน

เราทำการย้ายระบบใน **6 phases**:

#### Phase 1: Foundation (เสร็จสมบูรณ์ )
- สร้าง `src/constants/rule-constants.js` - ศูนย์กลาง rule opcode
- สร้าง `src/constants/severity-constants.js` - ศูนย์กลาง severity opcode
- สร้างระบบ binary bitmask

#### Phase 2: Core Rules (เสร็จสมบูรณ์ )
- ย้าย 3 กฎสำคัญมาใช้ opcodes:
  - `NO_EMOJI.js`
  - `NO_CONSOLE.js`
  - `MUST_HANDLE_ERRORS.js`

#### Phase 3: Validator & CLI (เสร็จสมบูรณ์ )
- อัปเดต `validator.js` ให้ใช้ opcodes
- อัปเดต `cli.js` ให้ใช้ opcodes
- การตรวจสอบกฎทั้งหมดใช้ `RULE_IDS` constants

#### Phase 4: Complete Rule Migration (เสร็จสมบูรณ์ )
- ย้ายกฎที่เหลืออีก 7 กฎ:
  - `BINARY_AST_ONLY.js`
  - `NO_HARDCODE.js`
  - `NO_INTERNAL_CACHING.js`
  - `NO_MOCKING.js`
  - `NO_SILENT_FALLBACKS.js`
  - `NO_STRING.js`
  - `STRICT_COMMENT_STYLE.js`
- ลบไฟล์ `src/rules/rule-constants.js` ที่ซ้ำซ้อน

#### Phase 5: Error Handler & Decoder (เสร็จสมบูรณ์ )
- สร้างสถาปัตยกรรม ErrorHandler 4 ชั้น:
  1. **Binary Intake Layer** - รับ opcodes
  2. **Normalization Layer** - ตรวจสอบ opcodes
  3. **Rendering Layer** - แปลงเป็นภาษาที่มนุษย์อ่านได้
  4. **Transport Layer** - log/ส่ง errors
- สร้าง `error-dictionary.js` รองรับ 2 ภาษา (EN/TH)
- สร้าง 7 error dictionaries:
  - `RULE_ERROR_DICTIONARY` (10 กฎ)
  - `SYNTAX_ERROR_DICTIONARY` (รหัส 1001-1099)
  - `TYPE_ERROR_DICTIONARY` (รหัส 2001-2099)
  - `REFERENCE_ERROR_DICTIONARY` (รหัส 3001-3099)
  - `RUNTIME_ERROR_DICTIONARY` (รหัส 4001-4099)
  - `LOGICAL_ERROR_DICTIONARY` (รหัส 5001-5099)
  - `FILE_SYSTEM_ERROR_DICTIONARY` (รหัส 6001-6099)

#### Phase 6: Documentation (เสร็จสมบูรณ์ )
- อัปเดต README.md ด้วยสถาปัตยกรรม Opcode & Decoder
- สร้าง Migration Guide (เอกสารนี้)
- อัปเดตเอกสาร 2 ภาษา (EN/TH)

---

## วิธีเพิ่มกฎใหม่

### ขั้นตอนที่ 1: ลงทะเบียน Opcode ใน `src/constants/rule-constants.js`

```javascript
// 1. เพิ่มใน RULE_BITMASKS
export const RULE_BITMASKS = Object.freeze({
    NO_MOCKING:        0b0000000000000001,
    // ... กฎที่มีอยู่ ...
    MUST_HANDLE_ERRORS: 0b0000001000000000,
    
    //  กฎใหม่: ใช้ power of 2 ตัวถัดไป
    YOUR_NEW_RULE:     0b0000010000000000  // ตัวถัดไป: 2^10 = 1024
});

// 2. เพิ่มใน RULE_IDS
export const RULE_IDS = Object.freeze({
    NO_MOCKING: RULE_BITMASKS.NO_MOCKING,
    // ... กฎที่มีอยู่ ...
    YOUR_NEW_RULE: RULE_BITMASKS.YOUR_NEW_RULE
});

// 3. เพิ่มใน RULE_SLUGS (สำหรับแปลง opcode  string)
export const RULE_SLUGS = Object.freeze({
    [RULE_BITMASKS.NO_MOCKING]: 'NO_MOCKING',
    // ... กฎที่มีอยู่ ...
    [RULE_BITMASKS.YOUR_NEW_RULE]: 'YOUR_NEW_RULE'
});
```

### ขั้นตอนที่ 2: สร้างไฟล์กฎ `src/rules/YOUR_NEW_RULE.js`

```javascript
//  Template สำหรับกฎใหม่
import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import { RULE_SEVERITY_FLAGS } from '../constants/severity-constants.js';

export function YOUR_NEW_RULE(node, context) {
  // Logic การตรวจสอบของคุณที่นี่
  if (violationDetected) {
    return {
      ruleId: RULE_IDS.YOUR_NEW_RULE,  // ใช้ opcode
      severity: RULE_SEVERITY_FLAGS.ERROR,  // ใช้ opcode
      message: 'ตรวจพบการละเมิด',  // Optional: จะถูก override โดย decoder
      node,
      position: node.loc
    };
  }
  
  return null;  // ไม่มีการละเมิด
}

// Export metadata
YOUR_NEW_RULE.meta = {
  ruleId: RULE_IDS.YOUR_NEW_RULE,
  slug: resolveRuleSlug(RULE_IDS.YOUR_NEW_RULE),
  severity: RULE_SEVERITY_FLAGS.ERROR,
  category: 'best-practices',
  description: 'คำอธิบายกฎของคุณ'
};
```

### ขั้นตอนที่ 3: เพิ่มข้อความ Error ใน `src/error-handler/error-dictionary.js`

```javascript
// เพิ่มใน RULE_ERROR_DICTIONARY
export const RULE_ERROR_DICTIONARY = Object.freeze({
  [RULE_IDS.NO_MOCKING]: {
    en: 'Mocking detected in production code',
    th: 'พบการใช้ mocking ในโค้ดจริง'
  },
  // ... กฎที่มีอยู่ ...
  
  //  เพิ่มกฎของคุณ
  [RULE_IDS.YOUR_NEW_RULE]: {
    en: 'English error message',
    th: 'ข้อความ error ภาษาไทย'
  }
});
```

### ขั้นตอนที่ 4: ลงทะเบียนใน Validator `src/rules/validator.js`

```javascript
import { YOUR_NEW_RULE } from './YOUR_NEW_RULE.js';

// เพิ่มใน rules array
const allRules = [
  NO_MOCKING,
  NO_HARDCODE,
  // ... กฎที่มีอยู่ ...
  YOUR_NEW_RULE  //  เพิ่มที่นี่
];
```

### ขั้นตอนที่ 5: ทดสอบกฎของคุณ

```javascript
// สร้างไฟล์ test: __tests__/rules/YOUR_NEW_RULE.test.js
import { YOUR_NEW_RULE } from '../../src/rules/YOUR_NEW_RULE.js';
import { RULE_IDS } from '../../src/constants/rule-constants.js';

describe('YOUR_NEW_RULE', () => {
  it('ควรตรวจจับการละเมิด', () => {
    const node = createTestNode(); // test node ของคุณ
    const result = YOUR_NEW_RULE(node);
    
    expect(result).not.toBeNull();
    expect(result.ruleId).toBe(RULE_IDS.YOUR_NEW_RULE);
  });
});
```

---

## วิธีเพิ่ม Error Code ใหม่

### ช่วงรหัส Error

เราใช้ **รหัส error ที่เป็นตัวเลข** จัดกลุ่มตามหมวดหมู่:

| หมวดหมู่ | ช่วงรหัส | ตัวอย่าง |
|----------|----------|----------|
| Syntax Errors | 1001-1099 | 1001: ขาด semicolon |
| Type Errors | 2001-2099 | 2001: Type ไม่ตรงกัน |
| Reference Errors | 3001-3099 | 3001: ตัวแปรไม่ได้ประกาศ |
| Runtime Errors | 4001-4099 | 4001: Null pointer |
| Logical Errors | 5001-5099 | 5001: วนลูปไม่รู้จบ |
| File System Errors | 6001-6099 | 6001: หาไฟล์ไม่เจอ |

### ขั้นตอนที่ 1: เลือกรหัส Error

```javascript
// หารหัสถัดไปที่ว่างในหมวดหมู่ของคุณ
// ตัวอย่าง: เพิ่ม Syntax Error ใหม่

// รหัสที่มีอยู่ใน SYNTAX_ERROR_DICTIONARY:
// 1001, 1002, 1003, ... 1010

// รหัสถัดไป: 1011
const NEW_ERROR_CODE = 1011;
```

### ขั้นตอนที่ 2: เพิ่มใน Error Dictionary

```javascript
// ใน src/error-handler/error-dictionary.js

export const SYNTAX_ERROR_DICTIONARY = Object.freeze({
  1001: {
    en: 'Missing semicolon',
    th: 'ขาดเครื่องหมาย semicolon'
  },
  // ... errors ที่มีอยู่ ...
  
  //  เพิ่ม error ของคุณ
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

### ขั้นตอนที่ 3: ใช้ในโค้ด

```javascript
import { errorHandler } from './error-handler/ErrorHandler.js';
import { resolveErrorMessage } from './error-handler/error-dictionary.js';

function parseStatement() {
  if (syntaxError) {
    const error = new Error('Syntax error');
    error.code = 1011;  // รหัส error ของคุณ
    
    errorHandler.handleError(error, {
      source: 'Parser',
      method: 'parseStatement',
      severity: RULE_SEVERITY_FLAGS.ERROR,
      errorCode: 1011
    });
    
    // ดึงข้อความ 2 ภาษา
    const message = resolveErrorMessage(1011, 'th');
    // "คำอธิบาย error ภาษาไทย"
  }
}
```

---

## Checklist การย้ายระบบ

ใช้ checklist นี้เมื่อย้ายโค้ดเดิมมาใช้สถาปัตยกรรม Binary-First:

### สำหรับแต่ละไฟล์

- [ ] ลบ string literal rule IDs ทั้งหมด (`'NO_CONSOLE'`  `RULE_IDS.NO_CONSOLE`)
- [ ] ลบ string literal severities ทั้งหมด (`'ERROR'`  `RULE_SEVERITY_FLAGS.ERROR`)
- [ ] เพิ่ม imports จาก `src/constants/rule-constants.js`
- [ ] เพิ่ม imports จาก `src/constants/severity-constants.js`
- [ ] อัปเดตการตรวจสอบกฎทั้งหมดให้ใช้การเปรียบเทียบ opcode
- [ ] ใช้ฟังก์ชัน decoder (`resolveRuleSlug`, `resolveErrorMessage`) เฉพาะที่ output layer
- [ ] ลบการกำหนด constants ภายใน (local constants)
- [ ] อัปเดต tests ให้ใช้ opcodes

### ตัวอย่างการย้ายระบบ

**ก่อน (String-based):**
```javascript
//  โค้ดเก่า
function checkRule(node) {
  if (node.type === 'CallExpression') {
    return {
      ruleId: 'NO_CONSOLE',  // String literal
      severity: 'ERROR'      // String literal
    };
  }
}

if (violation.ruleId === 'NO_CONSOLE') {  // String comparison
  console.error('พบการใช้ console');
}
```

**หลัง (Opcode-based):**
```javascript
//  โค้ดใหม่
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
  const message = resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'th');
  console.error(message);
}
```

---

## ข้อผิดพลาดที่พบบ่อย

###  ข้อผิดพลาดที่ 1: เปรียบเทียบ String หลังย้ายระบบ

```javascript
//  ผิด: เปรียบเทียบ opcode กับ string
import { RULE_IDS } from '../constants/rule-constants.js';

if (violation.ruleId === 'NO_CONSOLE') {  // String vs Integer!
  // จะไม่ match เลย!
}

//  ถูก: เปรียบเทียบ opcode กับ opcode
if (violation.ruleId === RULE_IDS.NO_CONSOLE) {
  // ใช้ได้!
}
```

###  ข้อผิดพลาดที่ 2: สร้าง Constants ภายใน

```javascript
//  ผิด: สร้าง constants ซ้ำภายใน
const NO_CONSOLE = 'NO_CONSOLE';  // อย่าทำแบบนี้!

//  ถูก: Import จากศูนย์กลาง
import { RULE_IDS } from '../constants/rule-constants.js';
```

###  ข้อผิดพลาดที่ 3: Decode เร็วเกินไป

```javascript
//  ผิด: Decode ระหว่าง execution
import { resolveRuleSlug } from '../constants/rule-constants.js';

function processViolation(violation) {
  const slug = resolveRuleSlug(violation.ruleId);  // เร็วเกินไป!
  
  // ตอนนี้กลับมาเปรียบเทียบ string อีกแล้ว!
  if (slug === 'NO_CONSOLE') { ... }
}

//  ถูก: เก็บ opcodes ไว้, decode เฉพาะตอน output
function processViolation(violation) {
  // ทำงานกับ opcodes
  if (violation.ruleId === RULE_IDS.NO_CONSOLE) { ... }
  
  return violation;  // ยังเป็น opcode
}

function formatOutput(violations, lang) {
  // Decode เฉพาะตรงนี้
  return violations.map(v => ({
    rule: resolveRuleSlug(v.ruleId),
    message: resolveErrorMessage(v.ruleId, lang)
  }));
}
```

###  ข้อผิดพลาดที่ 4: Hardcode ค่า Binary

```javascript
//  ผิด: Hardcode binary literals
if (ruleId === 0b0000000001000000) {  // นี่คือกฎอะไร?
  // อ่านไม่รู้เรื่อง!
}

//  ถูก: ใช้ named constants
if (ruleId === RULE_IDS.NO_CONSOLE) {  // ชัดเจนและอ่านง่าย
  // ดีกว่ามาก!
}
```

###  ข้อผิดพลาดที่ 5: ลืมรองรับหลายภาษา

```javascript
//  ผิด: Hardcode ข้อความภาษาอังกฤษ
console.error('Console usage detected');

//  ถูก: ใช้ decoder พร้อม parameter ภาษา
import { resolveErrorMessage } from '../error-handler/error-dictionary.js';

const userLang = getUserLanguage();  // 'en' หรือ 'th'
const message = resolveErrorMessage(RULE_IDS.NO_CONSOLE, userLang);
console.error(message);
```

---

## คำถามที่พบบ่อย

### Q: ทำไมต้องใช้ binary bitmasks แทนตัวเลขตามลำดับ?

**A:** Bitmasks ทำให้ใช้ **bitwise operations** ได้:

```javascript
// รวมหลายกฎเข้าด้วยกัน
const enabledRules = RULE_IDS.NO_CONSOLE | RULE_IDS.NO_EMOJI;

// ตรวจสอบว่ากฎถูก enable หรือไม่
if (enabledRules & RULE_IDS.NO_CONSOLE) {
  // NO_CONSOLE ถูก enable
}
```

ตัวเลขตามลำดับ (1, 2, 3...) ทำแบบนี้ไม่ได้อย่างมีประสิทธิภาพ

### Q: ถ้า bits หมดจะทำยังไง?

**A:** JavaScript numbers เป็น 53-bit safe integers เราใช้ 10-bit bitmasks ดังนั้นรองรับได้ **ถึง 53 กฎ** ก่อนต้องเปลี่ยนกลยุทธ์

ใช้ไปแล้ว: **10 กฎ** (bits 0-9)  
เหลืออีก: **43 กฎ** (bits 10-52)

ถ้าเกิน 53 กฎ (ไม่น่าจะเกิด) เราสามารถ:
- ใช้ BigInt สำหรับ bits ไม่จำกัด
- เปลี่ยนเป็น category-based bitmasks
- ใช้ composite keys

### Q: จะ debug ค่า opcode ยังไง?

**A:** ใช้ฟังก์ชัน decoder:

```javascript
import { resolveRuleSlug } from '../constants/rule-constants.js';

console.log('Rule ID:', ruleId);  // 64
console.log('Rule Slug:', resolveRuleSlug(ruleId));  // 'NO_CONSOLE'
console.log('Binary:', ruleId.toString(2));  // '1000000'
```

### Q: ใช้ opcodes กับ TypeScript ได้ไหม?

**A:** ได้! TypeScript ทำงานได้ดีกับ opcodes:

```typescript
// src/constants/rule-constants.d.ts
export const RULE_IDS: {
  readonly NO_MOCKING: number;
  readonly NO_CONSOLE: number;
  // ... etc
};

// Type safety และ autocomplete เต็มรูปแบบ!
import { RULE_IDS } from './constants/rule-constants.js';

const ruleId: number = RULE_IDS.NO_CONSOLE;  // Type-safe
```

### Q: แล้ว backwards compatibility ล่ะ?

**A:** เรารักษา decoder layer ไว้โดยเฉพาะสำหรับ backwards compatibility:

```javascript
// โค้ดเก่าที่ใช้ strings ยังใช้ได้ผ่าน adapter
function legacyAdapter(stringRuleId) {
  // แปลง string  opcode
  const opcode = Object.entries(RULE_SLUGS)
    .find(([_, slug]) => slug === stringRuleId)?.[0];
  
  return parseInt(opcode);
}

// การใช้งาน
const opcode = legacyAdapter('NO_CONSOLE');  // 64
```

### Q: จะเพิ่มภาษาใหม่ยังไง?

**A:** เพิ่มใน error dictionary:

```javascript
// ใน error-dictionary.js
export const RULE_ERROR_DICTIONARY = Object.freeze({
  [RULE_IDS.NO_CONSOLE]: {
    en: 'Console usage detected',
    th: 'พบการใช้ console',
    es: 'Uso de consola detectado',  //  เพิ่มภาษาสเปน
    ja: 'コンソールの使用が検出されました',  //  เพิ่มภาษาญี่ปุ่น
    zh: '检测到控制台使用'  //  เพิ่มภาษาจีน
  }
});

// จากนั้นใช้:
resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'es');  // ข้อความภาษาสเปน
resolveErrorMessage(RULE_IDS.NO_CONSOLE, 'ja');  // ข้อความภาษาญี่ปุ่น
```

---

## สรุป

### สิ่งสำคัญที่ต้องจำ

1. **ใช้ opcodes เสมอ** (integers) แทน strings ใน execution path
2. **Decode เฉพาะที่ output layer** (logging, display)
3. **Import จาก `src/constants/`** - ห้ามสร้าง local constants
4. **ใช้ฟังก์ชัน decoder** สำหรับ output ที่มนุษย์อ่านได้
5. **เพิ่มรองรับ 2 ภาษา** สำหรับข้อความ error ทั้งหมด

### การย้ายระบบเสร็จสมบูรณ์! 

ไฟล์หลักทั้งหมดถูกย้ายมาใช้สถาปัตยกรรม Binary-First แล้ว:
-  กฎ validation 10 ตัวใช้ opcodes
-  Constants รวมศูนย์ใน `src/constants/`
-  ErrorHandler 4 ชั้นพร้อม decoder
-  Error dictionary 2 ภาษา (EN/TH)
-  เอกสารอัปเดตแล้ว

### ขั้นตอนถัดไปสำหรับนักพัฒนา

1. **อ่านคู่มือนี้** ก่อนทำการเปลี่ยนแปลง
2. **ทำตามรูปแบบ** ที่แสดงในโค้ดที่มีอยู่
3. **ใช้ checklists** เมื่อเพิ่มกฎ/errors ใหม่
4. **เก็บ opcodes** ตลอด execution
5. **Decode ในช่วงสุดท้าย** ก่อน output

---

**มีคำถาม?** ดูที่ [เอกสารสถาปัตยกรรม](./ARCHITECTURE.md) หรือ [สถานะการย้ายระบบ Binary](./BINARY_MIGRATION_STATUS.md)

**Happy coding!** 
