#!/usr/bin/env node
// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Centralized Error Handler
// ! ══════════════════════════════════════════════════════════════════════════════  
// ! ! NO_SILENT_FALLBACKS Compliance - "SILENCE IS A FORM OF DAMAGE"
 // ! ══════════════════════════════════════════════════════════════════════════════ 
// ! หลักการ:
// ! 1. ทุก Error ต้องถูกส่งมาที่นี่ (Single Point of Truth)
// ! 2. ทุก Error ต้องถูก Log (No Silent Failures)
// ! 3. ทุก Error ต้องมีการจัดประเภท (Operational vs Programming)
// ! 4. Error ที่เป็นบั๊ก (Non-Operational) ต้อง Crash Process ทันที
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Flow: Code  throw Error  ErrorHandler  Logger  Log File
// ! ══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { ERROR_HANDLER_CONFIG } from './error-handler-config.js';
import { streamErrorReport } from './error-log-stream.js';


// ! ══════════════════════════════════════════════════════════════════════════════
// ! ══════════════════════════════════════════════════════════════════════════════ Error Handler Class (Singleton)
// ! ══════════════════════════════════════════════════════════════════════════════
class ErrorHandler {
    constructor() {
        this.logDir = path.join(
            process.cwd(), 
            ERROR_HANDLER_CONFIG.LOG_BASE_DIR, 
            ERROR_HANDLER_CONFIG.LOG_ERROR_SUBDIR
        );
        this.errorLogPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_FILENAME);
        this.criticalErrorPath = path.join(this.logDir, ERROR_HANDLER_CONFIG.LOG_CRITICAL_FILENAME);
        // ! คิวงานเขียนไฟล์แบบ Async ป้องกันการ block event loop
        this.logWriteQueue = Promise.resolve();
        this.backgroundTasks = new Set();
        
        // สร้างโฟลเดอร์ logs ถ้ายังไม่มี
        this.initializeLogDirectory();
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! สร้างโฟลเดอร์สำหรับบันทึก Error
    // ! ══════════════════════════════════════════════════════════════════════════════
    initializeLogDirectory() {
        fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ฟังก์ชันหลักในการจัดการ Error
    // ! NO_SILENT_FALLBACKS: ทุก Error ต้องถูก Log และจัดการ
    // ! ══════════════════════════════════════════════════════════════════════════════
    handleError(error, context = {}) {
        try {
            // 1. จัดประเภท Error
            const errorInfo = this.categorizeError(error, context);
            
            // 2. บันทึกลง Log ทันที (ผ่านคิว Async)
            this.scheduleBackgroundTask(this.logError(errorInfo));
            this.scheduleBackgroundTask(streamErrorReport(errorInfo));
            
            // 3. ตัดสินใจว่าจะปิด Process หรือไม่
            this.decideProcessFate(errorInfo);
            
            // 4. แจ้งเตือนถ้าเป็น Critical Error
            if (errorInfo.isCritical) {
                this.alertCriticalError(errorInfo);
            }
            
            return errorInfo;
            
        } catch (handlerError) {
            // ถ้า Error Handler เองมีปัญหา ต้อง Log ออก stderr ทันที
            console.error(ERROR_HANDLER_CONFIG.MSG_ERROR_HANDLER_FAILURE);
            console.error(ERROR_HANDLER_CONFIG.MSG_ORIGINAL_ERROR, error);
            console.error(ERROR_HANDLER_CONFIG.MSG_HANDLER_ERROR, handlerError);
            
            // Force crash เพราะระบบ Error Handling พัง (ยกเว้นในโหมด test)
            if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
                process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
            } else {
                console.error('[TEST MODE] Process exit prevented for testing');
                throw handlerError; // ให้ Jest จัดการต่อ
            }
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! จัดประเภท Error เพื่อให้รู้ว่าจะจัดการอย่างไร
    // ! NO_SILENT_FALLBACKS: ใช้ explicit checks แทน || operators
    // ! ══════════════════════════════════════════════════════════════════════════════
    categorizeError(error, context) {
        const now = new Date();
        
        // ตรวจสอบว่าเป็น Error ที่เรารู้จักหรือไม่
        const isKnownError = error.name && error.isOperational !== undefined;
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.name
        let errorName;
        if (error.name) {
            errorName = error.name;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_NAME);
            errorName = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_NAME;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.message
        let errorMessage;
        if (error.message) {
            errorMessage = error.message;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_MESSAGE);
            errorMessage = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_MESSAGE;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.stack
        let errorStack;
        if (error.stack) {
            errorStack = error.stack;
        } else {
            console.warn(ERROR_HANDLER_CONFIG.MSG_MISSING_STACK);
            errorStack = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_STACK;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.statusCode
        let statusCode;
        if (error.statusCode) {
            statusCode = error.statusCode;
        } else {
            statusCode = ERROR_HANDLER_CONFIG.DEFAULT_STATUS_CODE;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.errorCode
        let errorCode;
        if (error.errorCode) {
            errorCode = error.errorCode;
        } else {
            errorCode = ERROR_HANDLER_CONFIG.DEFAULT_ERROR_CODE;
        }
        
        // ! NO_HARDCODE: ตรวจสอบและจัดการ error.severity
        let severity;
        if (error.severity) {
            severity = error.severity;
        } else {
            if (error.isOperational) {
                severity = ERROR_HANDLER_CONFIG.SEVERITY_MEDIUM;
            } else {
                severity = ERROR_HANDLER_CONFIG.SEVERITY_CRITICAL;
            }
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.filePath
        let filePath;
        if (error.filePath) {
            filePath = error.filePath;
        } else {
            filePath = null;
        }
        
        // ! NO_SILENT_FALLBACKS: ตรวจสอบและจัดการ error.details
        let details;
        if (error.details) {
            details = error.details;
        } else {
            details = {};
        }
        
        return {
            // เวลาและบริบท
            timestamp: now.toISOString(),
            timestampLocal: now.toLocaleString('th-TH'),
            processId: process.pid,
            context: context,
            
            // ข้อมูล Error
            name: errorName,
            message: errorMessage,
            stack: errorStack,
            
            // การจัดประเภท
            isOperational: error.isOperational === true, // คาดเดาได้หรือไม่
            isKnownError: isKnownError, // เป็น Error ที่เราสร้างขึ้นมาเองหรือไม่
            isCritical: !error.isOperational, // Critical = ไม่คาดเดา
            
            // ข้อมูลเพิ่มเติม
            statusCode: statusCode,
            errorCode: errorCode,
            severity: severity,
            
            // สำหรับ Security Errors
            filePath: filePath,
            details: details
        };
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! บันทึก Error ลง Log File + โวยวายแบบไม่แกรงใจใคร 
    // ! NO_SILENT_FALLBACKS: ใช้คิว append แบบ Async เพื่อให้ Log ถูกเขียนครบก่อนปิดโปรเซส
    // ! AGGRESSIVE REPORTING: บอกชัดเจนว่าขาดอะไร ทำไมต้องใช้ แก้อย่างไร
    // ! ══════════════════════════════════════════════════════════════════════════════
    logError(errorInfo) {
        // สร้าง Log Entry แบบ JSON
        const logEntry = {
            timestamp: errorInfo.timestamp,
            level: 'ERROR',
            severity: errorInfo.severity,
            name: errorInfo.name,
            message: errorInfo.message,
            isOperational: errorInfo.isOperational,
            isCritical: errorInfo.isCritical,
            statusCode: errorInfo.statusCode,
            errorCode: errorInfo.errorCode,
            context: errorInfo.context,
            stack: errorInfo.stack
        };
        
        const logString = JSON.stringify(logEntry, null, 2) + '\n' + ERROR_HANDLER_CONFIG.LOG_SEPARATOR + '\n';
        
        // ! 1. โวยวายแบบหัวร้อน - NO_EMOJI VERSION
        console.error('\n' + '='.repeat(80));
        console.error('>>> ERROR HANDLER IS SCREAMING AT YOU! <<<');
        console.error('>>> THIS IS NOT A DRILL! FIX THIS NOW! <<<');
        console.error('='.repeat(80));
        console.error('\n[TIME] ' + errorInfo.timestampLocal);
        console.error('[ERROR NAME] ' + errorInfo.name);
        console.error('[MESSAGE] ' + errorInfo.message);
        console.error('[OPERATIONAL] ' + errorInfo.isOperational);
        console.error('[CRITICAL] ' + errorInfo.isCritical);
        console.error('[SEVERITY] ' + errorInfo.severity);
        
        // ! 2. วิเคราะห์และโวยวายแบบเจาะลึก
        this.aggressiveErrorAnalysis(errorInfo);
        
        console.error('\n' + '='.repeat(80) + '\n');
        
        // ! 2. เขียนลง Log File ผ่านคิว Async เพื่อเลี่ยงการ block
        let lastWritePromise = this.queueLogWrite(this.errorLogPath, logString);

        // ! 3. ถ้าเป็น Critical Error ให้ส่งต่อไปไฟล์พิเศษผ่านคิวเดียวกัน
        if (errorInfo.isCritical) {
            const criticalLog = `${ERROR_HANDLER_CONFIG.LOG_WARNING_PREFIX.repeat(ERROR_HANDLER_CONFIG.LOG_WARNING_REPEAT)}\n` +
                               `CRITICAL ERROR DETECTED\n` +
                               `${ERROR_HANDLER_CONFIG.LOG_WARNING_PREFIX.repeat(ERROR_HANDLER_CONFIG.LOG_WARNING_REPEAT)}\n` +
                               logString;
            lastWritePromise = this.queueLogWrite(this.criticalErrorPath, criticalLog);
        }

        return lastWritePromise;
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! AGGRESSIVE ERROR ANALYSIS V2 - โวยวายแบบไม่แกรงใจใคร + จี้จุดปัญหา
    // ! บอกชัดเจนว่า: What's Wrong, Why It's a Catastrophe, How to Fix
    // ! ══════════════════════════════════════════════════════════════════════════════
    aggressiveErrorAnalysis(errorInfo) {
        console.error('\n' + '-'.repeat(80));
        console.error('>>> AGGRESSIVE ERROR ANALYSIS <<<');
        console.error('-'.repeat(80));
        
        const { name, message, stack, context } = errorInfo;

        // ! Pattern 1: Parser ไม่มีสมอง (FATAL & MOST COMMON ERROR)
        // ! "TypeError: Cannot read properties of undefined (reading '...')"
        if (name === 'TypeError' && message.includes("Cannot read properties of undefined")) {
            console.error('\n[ROOT CAUSE DETECTED]');
            console.error('>>> THE PARSER WAS CREATED WITHOUT A BRAIN! (grammarIndex is undefined) <<<');
            
            console.error('\n[WHY THIS IS A CATASTROPHE]');
            console.error('>>> A Parser without a Brain (GrammarIndex) is just a confused script. It CANNOT understand ANY grammar rules. It\'s USELESS. <<<');
            console.error('>>> Every single call to the Parser MUST pass a valid, fully-loaded GrammarIndex instance. NO EXCEPTIONS! <<<');
            
            console.error('\n[HOW TO FIX IT - STEP BY STEP]');
            console.error('>>> STEP 1: Find where `new PureBinaryParser(...)` is called. The stack trace is screaming at you! <<<');
            if (stack) {
                // หาบรรทัดที่เรียก Object.parse หรือ new PureBinaryParser
                const creationPoint = stack.split('\n').find(line => line.includes('Object.parse') || line.includes('new PureBinaryParser'));
                if (creationPoint) {
                    console.error('       LOOK HERE ->', creationPoint.trim());
                }
            }
            console.error('>>> STEP 2: Ensure that a `grammarIndex` object is passed as the THIRD argument. <<<');
            console.error('>>> STEP 3: Make sure this `grammarIndex` object is NOT NULL or UNDEFINED. <<<');
            
            console.error('\n[EXAMPLE - THE ONLY RIGHT WAY]');
            console.error(">>> const brain = new GrammarIndex(loadedGrammarData); <<<");
            console.error(">>> const parser = new PureBinaryParser(tokens, source, brain); // <-- YOU FORGOT TO PASS THE BRAIN! <<<");
            
            // ไม่ต้องวิเคราะห์ต่อเพราะนี่คือปัญหาหลัก
            return; 
        }

        // ! Pattern 2: Tokenizer ตาบอด (Grammar ไม่รู้จักตัวอักษร)
        // ! "TokenizerError: Unknown operator/punctuation..." หรือ "Unknown character..."
        if (name === 'TokenizerError') {
            console.error('\n[ROOT CAUSE DETECTED]');
            console.error('>>> THE TOKENIZER IS BLIND! YOUR GRAMMAR IS INCOMPLETE! <<<');

            if (message.includes("Unknown operator/punctuation")) {
                const charMatch = message.match(/at\s+\d+:\s+"([^"]+)"/);
                const missingChar = charMatch ? charMatch[1] : 'UNKNOWN';

                console.error('\n[WHAT\'S WRONG]');
                console.error(`>>> Your Grammar doesn't know what a "${missingChar}" is! Are you kidding me?! <<<`);
                console.error('>>> The Tokenizer is confused and is stopping everything because of this one character! <<<');

                console.error('\n[HOW TO FIX IT - NOW!]');
                console.error('>>> STEP 1: Open `javascript.grammar.json`. <<<');
                console.error(`>>> STEP 2: Add "${missingChar}" to either the "punctuation" or "operators" section. NO EXCUSES! <<<`);
                
            } else if (message.includes("Unknown character")) {
                const charMatch = message.match(/position\s+\d+:\s+"([^"]+)"/);
                const missingChar = charMatch ? charMatch[1] : 'UNKNOWN';

                console.error('\n[WHAT\'S WRONG]');
                console.error(`>>> What is this character: "${missingChar}"?! It's not a letter, not a digit, not an operator! <<<`);
                console.error('>>> The Tokenizer follows MATH. If it\'s not in the rules, IT DOES NOT EXIST. <<<');

                console.error('\n[HOW TO FIX IT - NOW!]');
                console.error('>>> STEP 1: Find this character in your source code. Is it a typo? A copy-paste error? Or a valid character you forgot to teach the grammar? <<<');
                console.error('>>> STEP 2A: If it\'s a typo (LIKE A THAI CHARACTER IN YOUR CODE!), REMOVE IT! <<<');
                console.error('>>> STEP 2B: If it\'s a new symbol, add it to `javascript.grammar.json` like I told you before! <<<');
            }
            return;
        }

        // ! Pattern 3: Parser เจอ Operator แต่ Brain ไม่รู้จักประเภท
        // ! "ParserError: Operator "..." has unknown type "undefined" in Grammar"
        if (name === 'ParserError' && message.includes('has unknown')) {
            const operatorMatch = message.match(/Operator\s+"([^"]+)"/);
            const operator = operatorMatch ? operatorMatch[1] : 'UNKNOWN';

            console.error('\n[ROOT CAUSE DETECTED]');
            console.error(`>>> YOUR BRAIN IS HALF-BAKED! It knows about "${operator}" but doesn't know WHAT TO DO with it! <<<`);

            console.error('\n[WHAT\'S WRONG]');
            console.error(`>>> In \`javascript.grammar.json\`, the entry for "${operator}" is MISSING the "category" property! <<<`);
            console.error('>>> The Parser is asking "Is this for math? Is it for comparison?" and the Brain is just shrugging! <<<');

            console.error('\n[HOW TO FIX IT - DON\'T MAKE ME REPEAT MYSELF!]');
            console.error('>>> STEP 1: Open `javascript.grammar.json`. <<<');
            console.error(`>>> STEP 2: Find the entry for "${operator}". <<<`);
            console.error('>>> STEP 3: ADD a "category" property. Choose one of these: "relational", "equality", "additive", "multiplicative", "logical", "bitwise". <<<');

            console.error('\n[EXAMPLE - PAY ATTENTION!]');
            console.error(`   "${operator}": {`);
            console.error(`     "precedence": 7,`);
            console.error(`     "category": "relational"  // <-- YOU FORGOT THIS! ADD IT!`);
            console.error(`   },`);
            return;
        }

        // ! Fallback สำหรับ Parser Error อื่นๆ ที่ยังไม่ได้เจาะจง
        if (name === 'ParserError') {
             console.error('\n[GENERIC PARSER FAILURE]');
             console.error(">>> The Parser's logic failed. It encountered a sequence of tokens it was not built to handle. <<<");
             console.error(">>> This usually means your Expression Parser (Pratt Parser) is incomplete. It doesn't understand syntax like Arrow Functions, Class bodies, or something equally complex. <<<");
        }

        // ! แสดง Context และ Stack Trace (ส่วนนี้ยังดีอยู่)
        if (context && Object.keys(context).length > 0) {
            console.error('\n[ERROR CONTEXT]');
            console.error(JSON.stringify(context, null, 2));
        }
        
        if (context && context.hint) {
            console.error('\n[HINT]');
            console.error('>>> ' + context.hint + ' <<<');
        }
        
        console.error('\n[STACK TRACE - THE TRAIL OF DESTRUCTION]');
        console.error(stack || 'No stack trace available');
        
        console.error('\n' + '-'.repeat(80));
        console.error('>>> END OF AGGRESSIVE ANALYSIS - NOW GO FIX IT! <<<');
        console.error('-'.repeat(80));
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! ตัดสินใจว่าจะปิด Process หรือไม่
    // !  NO_SILENT_FALLBACKS: Error ที่เป็นบั๊กต้อง Crash ทันที
    // ! ══════════════════════════════════════════════════════════════════════════════
    decideProcessFate(errorInfo) {
        if (errorInfo.isCritical) {
            console.error('\n' + ERROR_HANDLER_CONFIG.MSG_CRITICAL_DETECTED);
            console.error('This is a non-operational error (likely a bug).');
            console.error('Application will shut down to prevent data corruption.');
            console.error('Process Manager (PM2/systemd) should restart the application.');
            console.error('\nShutting down in 1 second...\n');
            
            // ป้องกันการ exit ในโหมด test เพื่อให้ Jest เขียน log ได้
            if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
                // ให้เวลา 1 วินาที สำหรับ Log ถูกเขียนเสร็จ
                setTimeout(() => {
                    this.flushAsyncOperations().finally(() => {
                        process.exit(ERROR_HANDLER_CONFIG.FORCE_EXIT_CODE);
                    });
                }, ERROR_HANDLER_CONFIG.SHUTDOWN_DELAY_MS);
            } else {
                console.error('[TEST MODE] Process exit prevented for testing');
            }
        }
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! จัดการคิวงาน Async เพื่อป้องกัน unhandled rejection และติดตามสถานะ
    // ! ══════════════════════════════════════════════════════════════════════════════
    scheduleBackgroundTask(taskPromise) {
        if (!taskPromise || typeof taskPromise.then !== 'function') {
            return;
        }

        this.backgroundTasks.add(taskPromise);
        taskPromise.finally(() => {
            this.backgroundTasks.delete(taskPromise);
        });
    }

    queueLogWrite(targetPath, payload) {
        this.logWriteQueue = this.logWriteQueue
            .catch(() => undefined)
            .then(async () => {
                try {
                    await fsPromises.appendFile(targetPath, payload, 'utf8');
                } catch (writeError) {
                    console.error(ERROR_HANDLER_CONFIG.MSG_LOG_WRITE_FAILURE, writeError.message);
                    console.error('Target log path that failed:', targetPath);
                }
            });

        return this.logWriteQueue;
    }

    flushAsyncOperations() {
        const pending = Array.from(this.backgroundTasks);
        pending.push(this.logWriteQueue.catch(() => undefined));
        return Promise.allSettled(pending);
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! แจ้งเตือน Critical Error (สามารถเชื่อมต่อกับ Monitoring Service)
     // ! ══════════════════════════════════════════════════════════════════════════════
    alertCriticalError(errorInfo) {
        // ! ในอนาคตสามารถส่งไปที่:
        // ! - Slack/Discord Webhook
        // ! - Email
        // ! - SMS
        // ! - PagerDuty
        // ! - Sentry.io

        const alertMessage = `
${ERROR_HANDLER_CONFIG.MSG_CRITICAL_ALERT}
Time: ${errorInfo.timestampLocal}
Name: ${errorInfo.name}
Message: ${errorInfo.message}
Process: ${errorInfo.processId}

This error requires immediate attention!
        `.trim();
        
        console.error(alertMessage);
        
        // TODO: ส่ง alert ไปยัง monitoring service
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! ตรวจสอบว่า Error นี้เป็น Trusted Error หรือไม่
     // ! ══════════════════════════════════════════════════════════════════════════════
    isTrustedError(error) {
        return error.isOperational === true;
    }
    
     // ! ══════════════════════════════════════════════════════════════════════════════
     // ! สร้าง Error Report สำหรับดูภาพรวม
     // ! ══════════════════════════════════════════════════════════════════════════════
    async generateErrorReport() {
        try {
            if (!fs.existsSync(this.errorLogPath)) {
                return {
                    totalErrors: 0,
                    criticalErrors: 0,
                    operationalErrors: 0,
                    message: ERROR_HANDLER_CONFIG.REPORT_NO_ERRORS
                };
            }
            
            const content = fs.readFileSync(this.errorLogPath, 'utf-8');
            const errors = content.split(ERROR_HANDLER_CONFIG.LOG_SEPARATOR).filter(e => e.trim());
            
            const critical = errors.filter(e => e.includes('"isCritical": true')).length;
            const operational = errors.filter(e => e.includes('"isOperational": true')).length;
            
            return {
                totalErrors: errors.length,
                criticalErrors: critical,
                operationalErrors: operational,
                nonOperationalErrors: errors.length - operational,
                logFilePath: this.errorLogPath,
                criticalLogPath: this.criticalErrorPath
            };
        } catch (error) {
            console.error('Failed to generate error report:', error.message);
            throw error;
        }
    }
}

// ! Export Singleton Instance
const errorHandler = new ErrorHandler();

 // ! ══════════════════════════════════════════════════════════════════════════════
 // ! Setup Global Error Handlers
 // ! NO_SILENT_FALLBACKS: ดักจับ Error ที่หลุดลอดมาได้ทุกอัน
 // ! ══════════════════════════════════════════════════════════════════════════════
export function setupGlobalErrorHandlers() {
    // ! 1. Uncaught Exception (Synchronous errors)
    process.on('uncaughtException', (error) => {
        console.error('\nUNCAUGHT EXCEPTION DETECTED');
        errorHandler.handleError(error, {
            type: 'UNCAUGHT_EXCEPTION',
            fatal: true
        });
        // ! handleError จะจัดการการปิด Process เอง
    });
    
    // ! 2. Unhandled Promise Rejection (Async errors)
    process.on('unhandledRejection', (reason, promise) => {
        console.error('\nUNHANDLED PROMISE REJECTION DETECTED');
        
        // reason อาจไม่ใช่ Error object
        const error = reason instanceof Error ? reason : new Error(String(reason));
        error.isOperational = false; // Promise Rejection ที่ไม่ถูก Handle คือบั๊ก
        
        errorHandler.handleError(error, {
            type: 'UNHANDLED_REJECTION',
            promise: promise.toString(),
            fatal: true
        });
    });
    
    // ! 3. Process Warning (สำหรับ deprecation warnings)
    process.on('warning', (warning) => {
        console.warn('\nPROCESS WARNING');
        console.warn(warning.name);
        console.warn(warning.message);
        console.warn(warning.stack);
        
        // Warning ไม่ Fatal แต่ควร Log ไว้
        const warningError = new Error(warning.message);
        warningError.name = warning.name;
        warningError.isOperational = true; // Warning ไม่ใช่ Error ที่ต้อง Crash
        
        errorHandler.handleError(warningError, {
            type: 'PROCESS_WARNING',
            fatal: false
        });
    });
    
    console.log('Global error handlers initialized');
}

export default errorHandler;
