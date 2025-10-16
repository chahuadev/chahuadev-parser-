#  Blank Paper Architecture - สถาปัตยกรรม "กระดาษเปล่า"

> **ปรัชญาหลัก**: "Worker ไม่รู้อะไรเลย - ทุกอย่างต้องถาม Brain"

##  ภาพรวมสถาปัตยกรรม

สถาปัตยกรรมนี้แบ่งระบบออกเป็น 3 ส่วนหลัก:

```
┌─────────────────────────────────────────────────────────────┐
│                      SOURCE CODE                             │
│                  "const x = 5;"                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     
┌─────────────────────────────────────────────────────────────┐
│              TOKENIZER (โรงงานผลิตวัตถุดิบ)              │
│                tokenizer-helper.js                           │
│                                                              │
│  Role: "กระดาษเปล่า" ที่ไม่รู้อะไรเลย                      │
│  Task: แปลง String  Binary Token Stream                    │
│  Philosophy: ถาม Brain ทุกอย่าง ไม่ Hardcode               │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             │ "const คืออะไร?"              │
                                             │
┌─────────────────────────────────────┐       │
│     BRAIN (สมอง/คลังความรู้)     │       │
│      grammar-index.js               │       │
│                                     │       │
│  Role: ศูนย์รวมความรู้ทั้งหมด      │       │
│  Task: ให้บริการข้อมูล Binary      │       │
│  Source: *.grammar.json             │       │
└────────────┬────────────────────────┘       │
             │                                │
             │ "const = KEYWORD (Binary: 32)" │
             └────────────────────────────────┤
                                              │
                                              
                    ┌─────────────────────────────────────────┐
                    │  Token Stream (วัตถุดิบที่ติดป้าย)    │
                    │  { value: "const", binary: 32, ... }   │
                    └─────────────────┬───────────────────────┘
                                      │
                                      
┌─────────────────────────────────────────────────────────────┐
│              PARSER (ผู้ปฏิบัติงาน)                      │
│              pure-binary-parser.js                           │
│                                                              │
│  Role: แปลง Token Stream  AST                             │
│  Philosophy: ใช้ Binary Comparison 100%                     │
│  Rule: ห้ามเปรียบเทียบ String เด็ดขาด                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     
              ┌─────────────┐
              │     AST     │
              └─────────────┘
```

---

##  1. TOKENIZER: tokenizer-helper.js

###  บทบาท: "โรงงานผลิตวัตถุดิบ" (Raw Material Factory)

**หน้าที่:** แปลง Source Code (String)  Token Stream (Binary-tagged)

###  การปฏิบัติตามปรัชญา "Blank Paper"

#### 1.1 ไม่มีความรู้ Hardcode
```javascript
//  ไม่มีโค้ดแบบนี้
if (word === 'const') { /* ... */ }

//  แต่ทำแบบนี้แทน
const keywordsSection = this.sectionCache.keywords;
const isKeyword = keywordsSection && keywordsSection.hasOwnProperty(value);
```

#### 1.2 พึ่งพา Brain (GrammarIndex)
```javascript
// โหลดความรู้จาก Brain
loadGrammarSections() {
    if (this.brain) {
        // ใช้ GrammarIndex ที่ส่งเข้ามา
        this.sectionCache.keywords = this.flattenSection(this.brain.keywords);
        this.sectionCache.operators = this.flattenSection(this.brain.operators);
    } else {
        // หรือโหลดจาก grammar.json
        const grammarPath = join(__dirname, 'grammars', `${this.language}.grammar.json`);
        this.grammarCache = JSON.parse(readFileSync(grammarPath, 'utf8'));
    }
}
```

#### 1.3 Language Agnostic
```javascript
// สามารถเปลี่ยนภาษาได้ทันที
const jsTokenizer = new PureBinaryTokenizer(javascriptGrammar);
const pyTokenizer = new PureBinaryTokenizer(pythonGrammar);
const rsTokenizer = new PureBinaryTokenizer(rustGrammar);
// ไม่ต้องแก้โค้ด Tokenizer เลย!
```

###  รากฐานคือคณิตศาสตร์ (Pure Math)

```javascript
class UniversalCharacterClassifier {
    // ใช้ charCode (ตัวเลข) เท่านั้น - ไม่มี String Comparison
    isLetterByMath(charCode) {
        return (
            (charCode >= 65 && charCode <= 90) ||   // A-Z
            (charCode >= 97 && charCode <= 122) ||  // a-z
            charCode === 95 ||  // _
            charCode === 36     // $
        );
    }
    
    isDigitByMath(charCode) {
        return charCode >= 48 && charCode <= 57; // 0-9
    }
}
```

###  ผลิตภัณฑ์: Token Stream ที่ติดป้าย Binary

```javascript
// Input:  "const x = 5;"
// Output:
[
    { value: "const", type: "KEYWORD", binary: 32, start: 0, end: 5 },
    { value: "x", type: "IDENTIFIER", binary: 1, start: 6, end: 7 },
    { value: "=", type: "OPERATOR", binary: 8, punctuationBinary: 123, start: 8, end: 9 },
    { value: "5", type: "NUMBER", binary: 2, start: 10, end: 11 },
    { value: ";", type: "PUNCTUATION", binary: 64, punctuationBinary: 7, start: 11, end: 12 }
]
```

**Key Point:** Token มี `binary` และ `punctuationBinary` ติดมาเสมอ  Parser ไม่ต้องเปรียบเทียบ String อีก

---

##  2. BRAIN: grammar-index.js

###  บทบาท: "สมอง/คลังความรู้" (Knowledge Repository)

**หน้าที่:** เก็บความรู้ทั้งหมดและให้บริการข้อมูล Binary

###  แหล่งความรู้

```javascript
// โหลดจาก JSON Grammar Files
const grammarPath = join(__dirname, 'grammars', `${language}.grammar.json`);
this.grammar = JSON.parse(readFileSync(grammarPath, 'utf8'));

// โครงสร้าง Grammar
{
    "keywords": {
        "const": { "binary": 0b10001, "category": "declaration", ... },
        "let": { "binary": 0b10010, "category": "declaration", ... },
        "if": { "binary": 0b10011, "category": "control", ... }
    },
    "operators": {
        "+": { "binary": 0b100001, "precedence": 6, ... },
        "=": { "binary": 0b100010, "category": "assignment", ... }
    },
    "punctuation": {
        "(": { "binary": 1 },
        ")": { "binary": 2 },
        "{": { "binary": 3 }
    }
}
```

###  API สำหรับ Worker

#### 2.1 Binary Lookup Functions
```javascript
// แปลง String  Binary
getKeywordBinary('const')     //  0b10001
getOperatorBinary('=')        //  0b100010
getPunctuationBinary('(')     //  1

// แปลง Binary  String (reverse lookup)
getKeywordByBinary(0b10001)   //  'const'
```

#### 2.2 Query Functions
```javascript
// ตรวจสอบประเภท
isKeyword('const')            //  true
isOperator('+')               //  true
isPunctuation('(')            //  true

// ดึงข้อมูลละเอียด
getKeywordInfo('const')       //  { binary, category, subcategory, ... }
getOperatorInfo('=')          //  { binary, precedence, associativity, ... }
```

#### 2.3 Binary-First Functions (ใช้ Binary เป็น Input)
```javascript
// ฟังก์ชันที่ยืนยัน Architecture: รับ Binary  ตอบคำถาม
isAssignmentOperatorByBinary(0b100010)       //  true
isSimpleAssignmentByBinary(0b100010)         //  true
getKeywordCategoryByBinary(0b10001)          //  'declaration'
```

###  ทำไมต้องมี Brain?

1. **Single Source of Truth**: ความรู้อยู่ที่เดียว  ง่ายต่อการแก้ไข
2. **Enable Blank Paper**: Worker ไม่ต้อง hardcode  ถาม Brain ได้เลย
3. **Language Flexibility**: เปลี่ยน Grammar  เปลี่ยนภาษาได้ทันที
4. **Binary Provider**: สร้างข้อมูล Binary ให้ Worker ใช้งาน

---

##  3. PARSER: pure-binary-parser.js

###  บทบาท: "ผู้ปฏิบัติงาน" (Worker)

**หน้าที่:** แปลง Token Stream  AST (Abstract Syntax Tree)

###  การปฏิบัติตามปรัชญา "Binary 100%"

#### 3.1 ห้ามเปรียบเทียบ String เด็ดขาด

```javascript
//  แบบเก่า (ห้ามใช้!)
if (token.value === 'const') { /* ... */ }

//  แบบใหม่ (Binary Comparison)
const constBinary = this.grammarIndex.getKeywordBinary('const');
if (keywordBinary === constBinary) { /* ... */ }
```

#### 3.2 ใช้ Binary Constants

```javascript
constructor(tokens, grammarIndex) {
    this.BINARY = {
        IDENTIFIER:   1,    // 0b0000000000000001
        NUMBER:       2,    // 0b0000000000000010
        KEYWORD:      32,   // 0b0000000000100000
        PUNCTUATION:  64    // 0b0000000001000000
    };
    
    // โหลด Punctuation Binary จาก Grammar
    this.PUNCT = {
        LPAREN: grammarIndex.getPunctuationBinary('('),    // 1
        RPAREN: grammarIndex.getPunctuationBinary(')'),    // 2
        LBRACE: grammarIndex.getPunctuationBinary('{'),    // 3
        RBRACE: grammarIndex.getPunctuationBinary('}')     // 4
    };
}
```

#### 3.3 Helper Function: matchPunctuation()

```javascript
// Binary Comparison แทน String
matchPunctuation(punctBinary, offset = 0) {
    const token = this.peek(offset);
    return token && 
           token.binary === this.BINARY.PUNCTUATION && 
           token.punctuationBinary === punctBinary; //  Binary เทียบ Binary
}

// ใช้งาน
if (this.matchPunctuation(this.PUNCT.LPAREN)) {
    // เจอ '(' แล้ว
}
```

###  Error Handling ที่สมบูรณ์แบบ

```javascript
createParserError(message, context = {}) {
    const error = new Error(message);
    error.name = 'ParserError';
    error.isOperational = false; // Programming bug
    error.position = this.current;
    error.token = this.peek();
    
    // ส่งไปยัง ErrorHandler กลางทันที (Single Point of Truth)
    errorHandler.handleError(error, {
        source: 'PureBinaryParser',
        method: context.method || 'parse',
        severity: 'ERROR',
        ...context
    });
    
    return error; // Return เพื่อให้ throw ได้
}

// ใช้งาน
if (!keywordInfo) {
    throw this.createParserError(`Unknown keyword: ${keyword}`, {
        method: 'parseKeywordStatement',
        keyword
    });
}
```

**ข้อดี:**
-  มาตรฐาน Error เดียวกันทั้ง Parser
-  Log ครั้งเดียว (ไม่ซ้ำซ้อน)
-  Context ละเอียด (method, keyword, position)
-  ErrorHandler จัดการ process.exit() อัตโนมัติ

---

##  ตัวอย่างการทำงานร่วมกัน

### Flow: `const x = 5;`

```
Step 1: TOKENIZER ทำงาน
├─ อ่าน "const"
├─ ถาม Brain: "const คืออะไร?"
├─ Brain ตอบ: "KEYWORD, binary = 32"
└─ สร้าง Token: { value: "const", binary: 32, type: "KEYWORD" }

Step 2: TOKENIZER ส่ง Token Stream ให้ PARSER
[
    { value: "const", binary: 32 },
    { value: "x", binary: 1 },
    { value: "=", binary: 8, punctuationBinary: 123 },
    { value: "5", binary: 2 }
]

Step 3: PARSER วิเคราะห์
├─ เจอ token.binary === 32 (KEYWORD)
├─ ถาม Brain: getKeywordBinary('const') = 0b10001
├─ เทียบ: keywordBinary === constBinary? 
├─ ถาม Brain: getKeywordInfo('const').category = 'declaration'
└─ เรียก parseDeclaration()  parseVariableDeclaration()

Step 4: สร้าง AST
{
    type: "VariableDeclaration",
    kind: "const",
    declarations: [{
        type: "VariableDeclarator",
        id: { type: "Identifier", name: "x" },
        init: { type: "Literal", value: 5 }
    }]
}
```

---

##  ข้อดีของสถาปัตยกรรมนี้

### 1. **Language Agnostic** 
```javascript
// เปลี่ยนภาษาได้ทันที โดยไม่แก้โค้ด
const jsParser = new PureBinaryParser(jsTokens, jsGrammar);
const pyParser = new PureBinaryParser(pyTokens, pyGrammar);
const rsParser = new PureBinaryParser(rsTokens, rsGrammar);
```

### 2. **Zero Hardcode** 
- ทุกอย่างโหลดจาก `.grammar.json`
- แก้ไขไวยากรณ์  แก้ JSON เท่านั้น
- ไม่ต้องแตะโค้ด Tokenizer/Parser เลย

### 3. **Maximum Performance** 
```javascript
// Integer comparison (FAST)
if (token.binary === 32) { /* ... */ }

// String comparison (SLOW)
if (token.value === 'const') { /* ... */ }
```

### 4. **Mathematically Pure** 
```javascript
// ไม่กำกวม - ตรงตามทุกครั้ง
charCode >= 65 && charCode <= 90  // = true (ALWAYS)

// กำกวม - ขึ้นอยู่กับ regex implementation
/^[A-Z]$/.test(char)  // = maybe true?
```

### 5. **Maintainable** 
- **Single Source of Truth**: Grammar อยู่ที่เดียว
- **Separation of Concerns**: Worker/Brain แยกกันชัดเจน
- **Easy Debugging**: Log มี context ครบถ้วน
- **Automated Testing**: มี Compliance Validator

---

##  สรุปบทบาทของแต่ละไฟล์

| ไฟล์ | บทบาท | Input | Output | ปรัชญา |
|------|--------|-------|--------|--------|
| **tokenizer-helper.js** | โรงงานผลิตวัตถุดิบ | Source Code (String) | Token Stream (Binary-tagged) | Blank Paper 100% |
| **grammar-index.js** | สมอง/คลังความรู้ | Grammar JSON | Binary Data + Query API | Single Source of Truth |
| **pure-binary-parser.js** | ผู้ปฏิบัติงาน | Token Stream | AST | Binary Comparison 100% |

---

##  หลักการสำคัญที่ต้องจำ

1. **"Worker ไม่รู้อะไรเลย"** - Tokenizer และ Parser เป็น "กระดาษเปล่า"
2. **"ทุกอย่างต้องถาม Brain"** - Grammar Index เป็นศูนย์กลางความรู้
3. **"Binary 100%"** - Parser ห้ามเปรียบเทียบ String เด็ดขาด
4. **"NO_HARDCODE"** - ทุกอย่างโหลดจาก Config/Grammar JSON
5. **"NO_SILENT_FALLBACKS"** - ทุก Error ต้องผ่าน ErrorHandler กลาง

---

##  Compliance & Quality Assurance

### Binary Purity Validator
```javascript
// ตรวจสอบว่าไม่มี String Comparison
// __tests__/binary-purity-validator.test.js
 ไม่มี token.value ===
 ไม่มี keyword ===
 ไม่มี operator ===
 ใช้ Binary Comparison 100%
```

### Error Handler Compliance Validator
```javascript
// ตรวจสอบว่าทุก Error ผ่าน ErrorHandler กลาง
// __tests__/error-handler-compliance.test.js
 ไม่มี throw new Error() โดยตรง
 ใช้ errorHandler.handleError()
 ไม่มี duplicate logging
```

---

##  เอกสารเพิ่มเติม

- [Grammar JSON Format](./GRAMMAR_FORMAT.md)
- [Binary Configuration](./BINARY_CONFIG.md)
- [Error Handling Guide](./ERROR_HANDLING.md)
- [Adding New Language Support](./ADD_LANGUAGE.md)

---

**สร้างโดย:** Chahua Development Co., Ltd.  
**Repository:** https://github.com/chahuadev/chahuadev-Sentinel.git  
**Version:** 2.0.0  
**License:** MIT
