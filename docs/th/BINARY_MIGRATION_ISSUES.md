# สมุดบันทึกปัญหาการย้ายแบบไบนารี (TH)

**อัปเดตล่าสุด:** 18 ตุลาคม 2025  
**ผู้ดูแล:** GitHub Copilot (AI Programming Assistant)

| รหัส | วันที่เปิด | พื้นที่ | รายละเอียด | ผลกระทบ | แนวทางต่อไป | สถานะ |
| --- | --- | --- | --- | --- | --- | --- |
| ISS-2025-10-18-01 | 18 ต.ค. 2025 | โมดูล Security & Extension | หลายไฟล์ (`src/security/security-manager.js`, `src/security/security-middleware.js`, `src/security/rate-limit-store-factory.js`, ไฟล์ grammar, `src/extension.js`) ยังเรียก `errorHandler.handleError` แบบเดิมสองพารามิเตอร์ | ขัดขวางการบังคับใช้สัญญา binary-only และทำให้เส้นทาง string severity ยังใช้งานได้ | ทยอยปรับให้ใช้ `createSystemPayload` / `emitSecurityNotice` แล้วรันทดสอบ CLI เพื่อยืนยันความเท่าเทียม | เปิด |
| ISS-2025-10-18-02 | 18 ต.ค. 2025 | Payload Helpers | `src/error-handler/error-emitter.js` ยังไม่มีชุดทดสอบเพื่อการันตีการบังคับใช้ severity และการ sanitize context | การแก้ไขในอนาคตอาจทำให้ string severity หรือ payload ที่ไม่ครบกลับมาได้โดยไม่รู้ตัว | เขียน unit test ครอบคลุม helper ทั้งสองพร้อมเคสข้อมูลหลากหลาย และผูกเข้ากับ pipeline ทดสอบ | เปิด |
