// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================

// ! ======================================================================
// ! ABSOLUTE RULES CONFIGURATION
// ! กฎเหล็กทั้ง 7 ข้อ พร้อมรายละเอียดครบถ้วน
// ! ======================================================================
// ! ======================================================================
// ! ABSOLUTE RULES DEFINITION - 7 กฎเหล็กของ Chahuadev
// ! ======================================================================
import errorHandler from '../error-handler/ErrorHandler.js';

const ABSOLUTE_RULES = {
// ! ======================================================================
// ! NO_CONSOLE - ห้ามใช้ console.* ในระบบหลัก (กฎเหล็กข้อที่ 7)
// ! ======================================================================
    NO_CONSOLE: {
        id: 'NO_CONSOLE',
        name: {
            en: 'No Direct console Usage Anywhere in Production Logic',
            th: 'ห้ามใช้ console โดยตรงในตรรกะสำหรับใช้งานจริง'
        },
        description: {
            en: 'Block every console.log/warn/error/debug/trace call. Route diagnostics through errorHandler so severity, masking, and transport stay consistent.',
            th: 'ปิดกั้น console.log/warn/error/debug/trace ทุกคำสั่ง ให้ส่งข้อมูลผ่าน errorHandler เพื่อคุมระดับความรุนแรง การปกปิดข้อมูล และช่องทางส่งออกให้สอดคล้อง'
        },
        explanation: {
            en: 'ABSOLUTE PHILOSOPHY: "CENTRALISED OBSERVABILITY OR IT DID NOT HAPPEN"\nQUESTION 01: Why is console.* forbidden in sentinel runtime?\nANSWER: console writes bypass masking policies, bypass severity controls, and leak directly to stdout/stderr, violating SOC2/ISO controls.\nQUESTION 02: Can console.log stay in development utilities?\nANSWER: Dev-only scripts must sit outside production bundles. Anything under src/ executed by CLI, VS Code extension, or daemon is production logic and must use errorHandler.\nQUESTION 03: Why isn\'t wrapping console.log in helper enough?\nANSWER: Wrapping still requires reviewers to inspect every helper. errorHandler centralises redaction, batching, throttling, and transport (file, syslog, webhook) in one spot with configuration.\nQUESTION 04: What concrete failures occur when console remains?\nANSWER: Sensitive payloads (API keys, tokens) leak to logs, multi-process services lose context IDs, cloud deployments throttle stdout causing backpressure, and automated testing cannot intercept output cleanly.\nQUESTION 05: How does errorHandler solve these problems?\nANSWER: It enforces severity levels from constants.js, automatically masks secrets, attaches correlation IDs, supports async sinks, and can escalate CRITICAL events to sentinel dashboards.\nDIAGNOSTIC CHECKLIST: (1) Does any file import errorHandler yet still call console? remove the console call. (2) Does the code run in tokeniser/parser/analyser/validator/cli? console is banned. (3) Does the message contain operational data? send via errorHandler with structured payload. (4) Are you debugging locally? use errorHandler.handleDebug or dedicated dev logger that is stripped from production builds.\nALLOWED USE CASES: standalone playground files outside src/, unit tests under __tests__, and throwaway PoC scripts. All other layers must use errorHandler.\nACTION PLAN: replace console.* with errorHandler.handleError or handleDebug, select severity via constants.js, and add regression tests to block future console usage.',
            th: 'ปรัชญาหลัก: "ศูนย์รวมการสังเกตการณ์ ถ้าไม่ผ่าน errorHandler ถือว่าไม่เกิด"\nคำถาม 01: ทำไม console.* ถึงถูกแบนใน Sentinel runtime?\nคำตอบ: console ส่งข้อมูลออกนอกนโยบายปกปิด ไม่คุมระดับความรุนแรง และไหลตรง stdout/stderr ทำให้ขัดมาตรฐาน SOC2/ISO.\nคำถาม 02: ใช้ console.log ในสคริปต์พัฒนาได้ไหม?\nคำตอบ: ใช้ได้เฉพาะสคริปต์ dev ที่อยู่นอกขอบเขต production bundling ส่วนที่อยู่ใน src/ และรันโดย CLI, ส่วนขยาย VS Code หรือ daemon ถือเป็น production ต้องใช้ errorHandler.\nคำถาม 03: ห่อ console.log ด้วย helper เพียงพอหรือไม่?\nคำตอบ: ไม่พอ เพราะ reviewer ต้องเปิดดู helper ทุกตัว ในขณะที่ errorHandler รวมการปกปิดข้อมูล การ batch การ throttle และการส่งต่อ (ไฟล์, syslog, webhook) ไว้ที่เดียวกำหนดผ่าน config.\nคำถาม 04: ความเสียหายจริงคืออะไรถ้า console ยังอยู่?\nคำตอบ: ข้อมูลสำคัญ (API key, token) หลุดไป log, บริการหลายโปรเซสไม่มี correlation id, deployment บน cloud โดน throttle stdout ทำให้เกิด backpressure และระบบเทสอัตโนมัติควบคุม output ไม่ได้.\nคำถาม 05: errorHandler แก้ปัญหาเหล่านี้อย่างไร?\nคำตอบ: บังคับใช้ระดับความรุนแรงตาม constants.js, ซ่อนข้อมูลลับอัตโนมัติ, ผูก correlation id, รองรับช่องทาง asynchronous และแจ้งเตือนเหตุการณ์ CRITICAL ไป dashboard ได้.\nเช็คลิสต์ตรวจสอบ: (1) ไฟล์ไหน import errorHandler แต่ยังเรียก console ให้ลบทิ้ง (2) โค้ดรันใน tokenizer/parser/analyzer/validator/cli หรือไม่ ถ้าใช่ห้ามใช้ console (3) ข้อความมีข้อมูลปฏิบัติการหรือไม่ ให้ส่งผ่าน errorHandler พร้อม payload ที่มีโครงสร้าง (4) ดีบักในเครื่องหรือไม่ ให้ใช้ errorHandler.handleDebug หรือ logger เฉพาะ dev ที่ไม่ถูกรวมใน production.\nกรณีที่อนุญาต: ไฟล์ทดลองที่อยู่นอก src/, unit test ใน __tests__, และสคริปต์ MVP ชั่วคราวเท่านั้น ส่วนอื่นต้องใช้ errorHandler.\nแผนการแก้ไข: แทน console.* เป็น errorHandler.handleError หรือ handleDebug, เลือกระดับความรุนแรงจาก constants.js และเพิ่ม regression test เพื่อกันไม่ให้ console กลับมาอีก'
        },
        patterns: [
            { regex: /console\.(log|warn|error|info|debug|trace)\s*\(/g, name: 'Direct console.* invocation', severity: 'ERROR' },
            { regex: /\bconsole\s*\[/g, name: 'Dynamic console access via bracket notation', severity: 'ERROR' },
            { regex: /globalThis\.console\./g, name: 'Global console usage through globalThis', severity: 'ERROR' }
        ],
        severity: 'ERROR',
        violationExamples: {
            en: [
                '// @example NO_CONSOLE violation\nconsole.log("Parsing started", context);',
                '// @example NO_CONSOLE violation\nif (error) {\n    console.error("Tokenizer failed", error);\n}',
                '// @example NO_CONSOLE violation\nconst logger = console[severity];\nlogger(message);',
                '// @example NO_CONSOLE violation\nglobalThis.console.warn("Deprecated grammar detected");'
            ],
            th: [
                '// @example NO_CONSOLE violation\nconsole.log("เริ่มทำการ parse", context);',
                '// @example NO_CONSOLE violation\nif (error) {\n    console.error("tokenizer ล้มเหลว", error);\n}',
                '// @example NO_CONSOLE violation\nconst logger = console[severity];\nlogger(message);',
                '// @example NO_CONSOLE violation\nglobalThis.console.warn("ตรวจพบ grammar ที่เลิกใช้แล้ว");'
            ]
        },
        correctExamples: {
            en: [
                '// @example NO_CONSOLE correct\nimport errorHandler from "../error-handler/ErrorHandler.js";\nerrorHandler.handleError({\n    message: "Tokenizer failed",\n    severity: SEVERITY_LEVELS.ERROR.code,\n    context: { filePath }\n});',
                '// @example NO_CONSOLE correct\nerrorHandler.handleDebug({\n    message: "Grammar load complete",\n    context: { grammarCount }\n});',
                '// @example NO_CONSOLE correct\nerrorHandler.handleError({\n    message: "Missing configuration",\n    severity: SEVERITY_LEVELS.CRITICAL.code,\n    context: { configKey }\n});'
            ],
            th: [
                '// @example NO_CONSOLE correct\nimport errorHandler from "../error-handler/ErrorHandler.js";\nerrorHandler.handleError({\n    message: "tokenizer ล้มเหลว",\n    severity: SEVERITY_LEVELS.ERROR.code,\n    context: { filePath }\n});',
                '// @example NO_CONSOLE correct\nerrorHandler.handleDebug({\n    message: "โหลด grammar เสร็จสมบูรณ์",\n    context: { grammarCount }\n});',
                '// @example NO_CONSOLE correct\nerrorHandler.handleError({\n    message: "ไม่พบการตั้งค่าที่จำเป็น",\n    severity: SEVERITY_LEVELS.CRITICAL.code,\n    context: { configKey }\n});'
            ]
        },
        fix: {
            en: 'Replace console.* with errorHandler.handleError / handleDebug. Always supply severity from constants.js (SEVERITY_LEVELS) and pass structured context objects.',
            th: 'แทนที่ console.* ด้วย errorHandler.handleError หรือ handleDebug ใส่ระดับความรุนแรงจาก constants.js (SEVERITY_LEVELS) และส่ง context เป็นวัตถุที่มีโครงสร้าง'
        }
    }
};

// ! ======================================================================
// ! MODULE EXPORTS
// ! ======================================================================
export { ABSOLUTE_RULES };
