# รายงานสถานะระบบ Chahuadev Sentinel (อัปเดต ตุลาคม 2025)

## 1. บทนำ
รายงานฉบับนี้สรุปการทำงานของระบบหลังปรับเวิร์กโฟลว์ให้ใช้คำสั่ง `node cli.js` เป็นจุดทดสอบหลัก พร้อมอธิบายโมดูลที่เกี่ยวข้อง โครงสร้างไฟล์ และระบุไฟล์ที่ยังไม่ถูกเรียกใช้งานในเส้นทางดังกล่าวอย่างชัดเจน

## 2. ภาพรวมการไหลของระบบ (System Flow)
การทำงานปัจจุบันใช้เส้นทางเดียวผ่าน `node cli.js` โดยตรง ระบบ logger แยกและตัวสแกน AST เสริมถูกยกเลิกแล้ว

```
แหล่งซอร์สโค้ด (.js/.ts/.jsx/.tsx)
    │
    ▼
cli.js (CLI Entry)
    │  └─ โหลด cli-config.json, เตรียม SecurityManager และ ValidationEngine
    ▼
SecurityManager (src/security/security-manager.js)
    │  └─ ตรวจนโยบายจาก security-config.js และ rate-limit-store-factory.js
    ▼
ValidationEngine (src/rules/validator.js)
    │  ├─ tokenize() จาก src/grammars/index.js → BinaryComputationTokenizer
    │  ├─ GrammarIndex.loadGrammar() (shared/grammar-index.js)
    │  └─ PureBinaryParser / EnhancedBinaryParser วิเคราะห์ AST + ABSOLUTE_RULES
    ▼
ผลจากกฎ (ละเมิด/ผ่าน)
    │
    ▼
ErrorHandler (src/error-handler/ErrorHandler.js)
    │  ├─ ใช้ error-handler-config.js เป็นค่าอ้างอิง
    │  ├─ เรียก streamErrorReport() (error-log-stream.js) เพื่อเก็บ code snippet รายไฟล์
    │  └─ บันทึกไปยัง logs/errors/centralized-errors.log & file-reports/*.log
    ▼
สรุปผล (CLI stdout / Markdown report / logs/*)
```

## 3. สถานะและการเชื่อมโยงของไฟล์หลัก (อัปเดต ตุลาคม 2025)
| ไฟล์ | หน้าที่หลัก | ถูกเรียกโดย / เข้าถึงจาก | สถานะใน flow ปัจจุบัน |
|------|---------------|---------------------------|------------------------|
| `cli.js` | จุดเริ่มต้น CLI, จัดการ argument, สร้าง `SecurityManager`, `ValidationEngine`, เรียก `scanPattern()` | รันตรงผ่าน `node cli.js` หรือสคริปต์ npm (`npm run lint`, `npm test`) | **ใช้งานอยู่** (เส้นทางหลัก) |
| `src/rules/validator.js` | รวม `ABSOLUTE_RULES`, สร้าง `ValidationEngine`, enrich ข้อมูลการละเมิด | ถูก import โดย `cli.js` และเครื่องมือหลัก | **ใช้งานอยู่** |
| `src/grammars/index.js` | ศูนย์กลางโหลด Grammar/Tokenizer/Parser, ใช้โดย `ValidationEngine` | เรียกจาก `validator.js` | **ใช้งานอยู่** |
| `src/grammars/shared/grammar-index.js` | จัดการแคชและโหลดไวยากรณ์แบบแยกภาษา | เรียกภายใน `src/grammars/index.js` | **ใช้งานอยู่** |
| `src/error-handler/ErrorHandler.js` | ศูนย์กลางจัดการ error + คิวการเขียน log แบบ async | ถูกใช้งานโดย CLI, ValidationEngine, Tokenizer ฯลฯ | **ใช้งานอยู่** |
| `src/error-handler/error-log-stream.js` | สร้างไฟล์รายงานรายไฟล์ (`logs/errors/file-reports/*.log`) พร้อม code snippet | ถูกเรียกทุกครั้งที่ `ErrorHandler.handleError()` ถูกใช้ | **ใช้งานอยู่** |
| `src/error-handler/error-handler-config.js` | ค่า config (ชื่อไฟล์ log, severity, ข้อความเตือน) | ใช้โดย `ErrorHandler.js` | **ใช้งานอยู่** |
| *(ยกเลิก)* `src/error-handler/ast-error-detection-validator.js` | เดิมใช้สแกน AST เพื่อตรวจจับ catch block ที่ไม่เรียก `errorHandler` | **ปิดใช้งาน** (ไฟล์เตรียมลบ) |
| *(ยกเลิก)* `src/grammars/shared/logger.js` | เดิมเป็นโหมด session log + Markdown | **ปิดใช้งาน** (ไฟล์เตรียมลบ) |
| `cli-config.json` | ข้อความ, แพทเทิร์น, semantic severity สำหรับ CLI report | โหลดโดย `cli.js` | **ใช้งานอยู่** |
| `logs/errors/` | ผลลัพธ์จาก ErrorHandler + รายงาน context รายไฟล์ | สร้างอัตโนมัติเมื่อเกิด error/notice | **อัปเดตแบบเรียลไทม์** |

> หมายเหตุ: `ValidationEngine` มีเมธอด `getRules()` เพื่อส่งข้อมูลเมตาของกฎไปยัง Logger/Reporter ช่วยให้รายงาน Markdown ให้บริบท “ทำไม” และ “แก้อย่างไร” ได้ทันที

## 4. ไฟล์/โมดูลที่อยู่นอกเส้นทางหลักหรือใช้เฉพาะกรณี
| สถานะ | ไฟล์ | หน้าที่ | วิธีเรียกใช้งาน |
|-------|-------|---------|----------------|
| ส่วนขยาย VS Code | `extension-wrapper.js`, `src/extension.js`, `extension-config.json` | ฝั่ง Extension UI/commands | ถูกโหลดเมื่อพัฒนาเป็น VS Code Extension (ไม่ได้ถูกเรียกโดย `node cli.js`) |
| *(ยกเลิก)* เครื่องมือรายงานเชิงลึก | `src/grammars/shared/logger.js` | เคยผลิต session logs + Markdown | ปิดใช้งานแล้ว |
| *(ยกเลิก)* สแกนจับ catch ที่ไม่เรียก ErrorHandler | `src/error-handler/ast-error-detection-validator.js` | เคยรายงาน AST โฟกัส error handling | ปิดใช้งานแล้ว |
| สคริปต์ legacy | `scan-real-files.js` | ตัวสแกนรุ่นก่อน | ไม่ได้เรียกในสคริปต์ npm ปัจจุบัน |
| ยูทิลิตี้เสริม | `emoji-cleaner.js` | ลบ emoji ออกจาก repository | เรียกผ่าน `npm run clean-emoji` ตามต้องการ |
| เอกสารอ้างอิง | โฟลเดอร์ `docs/architecture/`, `.md` เฉพาะทาง | คู่มือทีม | ไม่รันเป็นโค้ด |

## 5. โครงสร้างระบบไฟล์พร้อมหน้าที่ (สรุปเฉพาะจุดสำคัญ)
```
Chahuadev-Sentinel/
├─ cli.js                     ─ CLI หลัก
├─ cli-config.json            ─ คอนฟิก CLI (ข้อความ, รูปแบบรายงาน, แพทเทิร์นการสแกน)
├─ extension-wrapper.js       ─ จุดเข้า VS Code (ยังไม่ใช้ใน flow node cli.js)
├─ extension-config.json      ─ คอนฟิกส่วนขยาย
├─ package.json               ─ สคริปต์ npm (test → node cli.js)
├─ docs/                      ─ เอกสารสถาปัตยกรรมและรายงาน (รวมไฟล์ฉบับนี้)
├─ src/
│  ├─ error-handler/          ─ ระบบจัดการข้อผิดพลาดและบันทึกลง logs
│  ├─ grammars/
│  │  ├─ index.js             ─ ผูก tokenizer, grammar index, parser
│  │  └─ shared/              ─ โค้ด Binary Parser, BinaryScout, BinaryProphet, configs
│  ├─ rules/                  ─ ABSOLUTE_RULES + validator.js
│  └─ security/               ─ SecurityManager, rate-limit, suspicious patterns
├─ logs/
│  └─ errors/                 ─ `centralized-errors.log` + `file-reports/*.log` (จาก error-log-stream)
├─ emoji-cleaner.js           ─ สคริปต์ลบอีโมจิ (เรียกเมื่อจำเป็น)
└─ scan-real-files.js         ─ สคริปต์ legacy (ไม่ใช้งานใน flow ปัจจุบัน)
```

## 6. สรุปการทดสอบล่าสุด
- `npm run lint` (ชี้ไป `node cli.js .`) → **ผ่าน** : ยืนยันว่าเส้นทาง CLI หลักทำงานครบ (SecurityManager + ValidationEngine + ErrorHandler)
- *(ปิดใช้งาน)* `node src/grammars/shared/logger.js` — เครื่องมือ logger เดิมถูกนำออกจาก flow

## 7. ข้อเสนอแนะเพิ่มเติม
1. หากต้องใช้ VS Code Extension ให้ตรวจสอบ `extension-wrapper.js` และ `src/extension.js` อีกครั้ง เนื่องจากไม่ได้อยู่ในเส้นทาง `node cli.js`
2. หากต้องการสถิติเพิ่มเติม (เช่น coverage เดิมจาก Jest) จำเป็นต้องติดตั้งหรือพัฒนารีพอร์ตใหม่ภายใต้ CLI
3. ควรตรวจสอบไฟล์ในหมวดเอกสารและสคริปต์ legacy เป็นระยะ เพื่อพิจารณาจัดหมวดหมู่หรือย้ายไปโฟลเดอร์ `todos/` หากไม่มีการใช้งานจริง

---
รายงานนี้ถูกจัดเก็บที่ `docs/ระบบการไหล-Chahuadev-Sentinel.md` เพื่อใช้อ้างอิงและอัปเดตในอนาคต
