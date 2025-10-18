import {
    ERROR_CATEGORY_CODES,
    ERROR_CATEGORY_CATALOG,
    ERROR_DOMAIN_CODES,
    resolveDomainMetadata,
    SYNTAX_ERROR_CODES,
    TYPE_ERROR_CODES,
    REFERENCE_ERROR_CODES,
    RUNTIME_ERROR_CODES,
    LOGICAL_ERROR_CODES,
    FILE_SYSTEM_ERROR_CODES,
    SYSTEM_ERROR_CODES,
    SECURITY_ERROR_CODES,
    FALLBACK_ERROR_ENTRY,
    FALLBACK_RULE_METADATA,
    classifyErrorCode,
    resolveCategoryMetadata
} from './error-catalog.js';
import { RULE_IDS, resolveRuleSlug } from '../constants/rule-constants.js';
import {
    RULE_SEVERITY_FLAGS,
    ERROR_SEVERITY_FLAGS,
    resolveRuleSeveritySlug,
    resolveErrorSeveritySlug
} from '../constants/severity-constants.js';

const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_FALLBACK_ORDER = Object.freeze(['en', 'th']);

const localized = (enText, thText) => Object.freeze({ en: enText, th: thText });

const RECOMMENDED_ACTIONS = Object.freeze({
    CODE_REVIEW: 'CodeReview',
    FIX_SYNTAX: 'FixSyntax',
    STABILISE_GRAMMAR: 'RepairGrammarIndex',
    INSPECT_RUNTIME: 'InspectRuntimeEnvironment',
    CHECK_DEPENDENCY: 'CheckDependencies',
    INSPECT_FILE_SYSTEM: 'InspectFileSystem',
    RETRY_OPERATION: 'RetryOperation',
    UPDATE_CONFIGURATION: 'UpdateConfiguration',
    TRIGGER_INCIDENT_RESPONSE: 'TriggerIncidentResponse',
    REVIEW_SECURITY_POLICY: 'ReviewSecurityPolicy',
    HARDEN_INPUT_GUARDS: 'HardenInputGuards'
});

function selectLocalized(value, requestedLanguage) {
    if (!value || typeof value !== 'object') {
        return null;
    }
    if (requestedLanguage && value[requestedLanguage]) {
        return value[requestedLanguage];
    }
    for (const fallbackLanguage of LANGUAGE_FALLBACK_ORDER) {
        if (value[fallbackLanguage]) {
            return value[fallbackLanguage];
        }
    }
    const keys = Object.keys(value);
    return keys.length > 0 ? value[keys[0]] : null;
}

function composeMetadata(category, severity, overrides = {}, severityLabelResolver = resolveErrorSeveritySlug) {
    const metadata = { ...overrides };
    const domain = resolveDomainMetadata(category.domainCode ?? ERROR_DOMAIN_CODES.UNKNOWN);

    metadata.domain = {
        code: domain.code,
        slug: domain.slug,
        label: domain.label,
        description: domain.description,
        ...(overrides.domain || {})
    };

    metadata.category = {
        code: category.code,
        slug: category.slug,
        label: category.label,
        description: category.description,
        ...(overrides.category || {})
    };

    metadata.severity = {
        code: severity,
        label: severityLabelResolver(severity),
        ...(overrides.severity || {})
    };

    if (metadata.isFatal === undefined) {
        metadata.isFatal = severity >= ERROR_SEVERITY_FLAGS.CRITICAL;
    }
    if (metadata.canRetry === undefined) {
        metadata.canRetry = false;
    }
    if (metadata.recommendedAction === undefined) {
        metadata.recommendedAction = null;
    }

    return metadata;
}

function createRuleEntry(ruleId, config) {
    const severity = config.severity || RULE_SEVERITY_FLAGS.ERROR;
    const category = ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.RULE];
    const metadata = composeMetadata(category, severity, config.metadata || {}, resolveRuleSeveritySlug);
    return Object.freeze({
        ruleId,
        ruleSlug: resolveRuleSlug(ruleId),
        domainCode: metadata.domain.code,
        domainSlug: metadata.domain.slug,
        domainLabel: metadata.domain.label,
        categoryCode: ERROR_CATEGORY_CODES.RULE,
        categorySlug: category.slug,
        severity,
        severityLabel: resolveRuleSeveritySlug(severity),
        message: config.message,
        explanation: config.explanation,
        fix: config.fix,
        metadata
    });
}

function createSystemEntry(code, config) {
    const category = resolveCategoryMetadata(config.categoryCode);
    const severity = config.severity || category.defaultSeverity;
    const metadata = composeMetadata(category, severity, config.metadata || {});
    return Object.freeze({
        code,
        categoryCode: category.code,
        categorySlug: category.slug,
        severity,
        severityLabel: resolveErrorSeveritySlug(severity),
        message: config.message,
        explanation: config.explanation,
        fix: config.fix,
        domainCode: metadata.domain.code,
        domainSlug: metadata.domain.slug,
        domainLabel: metadata.domain.label,
        metadata
    });
}

const RULE_FALLBACK_ENTRY = Object.freeze({
    ruleId: FALLBACK_RULE_METADATA.id,
    ruleSlug: FALLBACK_RULE_METADATA.slug,
    categoryCode: ERROR_CATEGORY_CODES.RULE,
    categorySlug: ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.RULE].slug,
    severity: FALLBACK_RULE_METADATA.severity,
    severityLabel: FALLBACK_RULE_METADATA.severityLabel,
    message: localized('Unknown rule violation', 'พบการละเมิดกฎที่ไม่ทราบชื่อ'),
    explanation: localized(
        'The validator reported a rule identifier that does not exist in the rule dictionary.',
        'ตัวตรวจสอบรายงานรหัสกฎที่ไม่มีในพจนานุกรมกฎ'
    ),
    fix: localized(
        'Register the rule metadata in error-dictionary.js and ensure the rule exports metadata in src/rules/.',
        'เพิ่มข้อมูลเมทาดาทาของกฎลงใน error-dictionary.js และตรวจสอบว่าไฟล์ใน src/rules/ ส่งออกเมทาดาทาครบถ้วน'
    )
});

export const RULE_ERROR_DICTIONARY = Object.freeze({
    [RULE_IDS.NO_MOCKING]: createRuleEntry(RULE_IDS.NO_MOCKING, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Forbidden Mock/Stub/Spy usage detected', 'พบการใช้ Mock/Stub/Spy ที่ต้องห้าม'),
        explanation: localized(
            'Using jest.mock(), sinon.stub(), or similar helpers violates the NO_MOCKING rule which enforces Dependency Injection so that tests exercise the real implementation.',
            'การใช้ jest.mock(), sinon.stub() หรือ helper ลักษณะเดียวกันละเมิดกฎ NO_MOCKING ที่บังคับให้ใช้ Dependency Injection เพื่อให้การทดสอบทำงานกับโค้ดจริง'
        ),
        fix: localized(
            'Remove the mocking helper and restructure the module to receive dependencies through constructor or function parameters.',
            'ลบการเรียก mocking แล้วปรับโครงสร้างโมดูลให้รับ dependencies ผ่าน constructor หรือพารามิเตอร์ฟังก์ชัน'
        )
    }),
    [RULE_IDS.NO_HARDCODE]: createRuleEntry(RULE_IDS.NO_HARDCODE, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Hardcoded values detected in code', 'พบค่าคงที่ที่ฝังอยู่ในโค้ด'),
        explanation: localized(
            'Embedding URLs, API keys, or policy values inside source code couples the build to a single environment and breaches NO_HARDCODE.',
            'การฝัง URL, API key หรือค่ากำหนดใดๆ ไว้ในซอร์สโค้ดทำให้ระบบผูกติดกับสภาพแวดล้อมเดียวและฝ่าฝืนกฎ NO_HARDCODE'
        ),
        fix: localized(
            'Move the value into configuration (environment variables, config files) and fail fast when values are missing.',
            'ย้ายค่าดังกล่าวไปไว้ในไฟล์หรือ environment configuration และให้ระบบล้มเหลวทันทีหากไม่พบค่า'
        )
    }),
    [RULE_IDS.NO_SILENT_FALLBACKS]: createRuleEntry(RULE_IDS.NO_SILENT_FALLBACKS, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Silent fallback detected', 'พบการ fallback แบบเงียบ'),
        explanation: localized(
            'Returning default values without logging hides production defects and violates NO_SILENT_FALLBACKS.',
            'การคืนค่าปริยายโดยไม่บันทึก log ทำให้ปัญหาในระบบ production ถูกซ่อนและฝ่าฝืนกฎ NO_SILENT_FALLBACKS'
        ),
        fix: localized(
            'Log the error via the ErrorHandler or rethrow so the caller can handle it explicitly.',
            'บันทึก error ผ่าน ErrorHandler หรือโยนต่อให้ผู้เรียกจัดการอย่างชัดเจน'
        )
    }),
    [RULE_IDS.NO_INTERNAL_CACHING]: createRuleEntry(RULE_IDS.NO_INTERNAL_CACHING, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Internal caching detected in function', 'พบการสร้าง cache ภายในฟังก์ชัน'),
        explanation: localized(
            'Caching inside core functions breaks purity guarantees and breaches NO_INTERNAL_CACHING.',
            'การทำ cache ภายในฟังก์ชันแกนกลางทำให้ฟังก์ชันไม่เป็น pure และละเมิดกฎ NO_INTERNAL_CACHING'
        ),
        fix: localized(
            'Delegate caching to an external layer and keep the function deterministic.',
            'ย้ายการทำ cache ไปยังเลเยอร์ภายนอกแล้วทำให้ฟังก์ชันคงความคาดเดาได้'
        )
    }),
    [RULE_IDS.NO_EMOJI]: createRuleEntry(RULE_IDS.NO_EMOJI, {
        severity: RULE_SEVERITY_FLAGS.WARNING,
        message: localized('Emoji usage detected in code', 'พบการใช้ emoji ในโค้ด'),
        explanation: localized(
            'Unicode emoji characters break diff tooling and audit trails; NO_EMOJI demands plain text tokens.',
            'อักขระ emoji ส่งผลให้การเปรียบเทียบ diff และการตรวจสอบย้อนหลังทำได้ยาก กฎ NO_EMOJI จึงบังคับให้ใช้ตัวอักษรธรรมดา'
        ),
        fix: localized(
            'Replace the emoji with a plain text description such as "SUCCESS" or "FAILED".',
            'แทนที่ emoji ด้วยคำบรรยายแบบตัวอักษร เช่น "SUCCESS" หรือ "FAILED"'
        )
    }),
    [RULE_IDS.NO_STRING]: createRuleEntry(RULE_IDS.NO_STRING, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('String comparison detected in core logic', 'พบการเปรียบเทียบสตริงในตรรกะหลัก'),
        explanation: localized(
            'Core analyzers must rely on binary identifiers; string comparisons are slow and fragile and therefore violate NO_STRING.',
            'ตรรกะหลักของตัววิเคราะห์ต้องใช้ตัวระบุแบบไบนารี การเปรียบเทียบสตริงช้ากว่าและเปราะบาง จึงฝ่าฝืนกฎ NO_STRING'
        ),
        fix: localized(
            'Import numeric constants from constants.js and replace string checks with bitwise or numeric comparisons.',
            'นำเข้าค่าคงที่ตัวเลขจาก constants.js แล้วแทนที่การเปรียบเทียบสตริงด้วยการเปรียบเทียบตัวเลขหรือบิต'
        )
    }),
    [RULE_IDS.NO_CONSOLE]: createRuleEntry(RULE_IDS.NO_CONSOLE, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('console.* usage detected', 'พบการใช้ console.*'),
        explanation: localized(
            'Direct console calls bypass masking and severity policies; NO_CONSOLE forces routing through the ErrorHandler.',
            'การเรียก console โดยตรงไม่ผ่านนโยบายการซ่อนข้อมูลและระดับความรุนแรง กฎ NO_CONSOLE บังคับให้ส่งผ่าน ErrorHandler'
        ),
        fix: localized(
            'Use errorHandler.handleError or the structured logger that feeds the central transport pipeline.',
            'ใช้ errorHandler.handleError หรือ logger แบบมีโครงสร้างที่ส่งข้อมูลเข้า transport ส่วนกลาง'
        )
    }),
    [RULE_IDS.BINARY_AST_ONLY]: createRuleEntry(RULE_IDS.BINARY_AST_ONLY, {
        severity: RULE_SEVERITY_FLAGS.CRITICAL,
        message: localized('Object AST usage detected', 'พบการใช้งาน AST รูปแบบออบเจกต์'),
        explanation: localized(
            'Falling back to parser.parse() or node.children means the binary AST pipeline was bypassed, breaking memory guarantees.',
            'การกลับไปใช้ parser.parse() หรือ node.children แสดงว่าระบบเลี่ยงผ่านท่อ Binary AST ทำให้สูญเสียการควบคุมหน่วยความจำ'
        ),
        fix: localized(
            'Decode the binary buffer using iterateBinaryAst or decodeNodeTable before inspection.',
            'ถอดรหัสบัฟเฟอร์ Binary AST ด้วย iterateBinaryAst หรือ decodeNodeTable ก่อนประมวลผล'
        )
    }),
    [RULE_IDS.STRICT_COMMENT_STYLE]: createRuleEntry(RULE_IDS.STRICT_COMMENT_STYLE, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Non-standard comment signature detected', 'พบคอมเมนต์ที่ไม่ตรงรูปแบบ'),
        explanation: localized(
            'Comments must use the "// !" signature so automated audits can detect intent. Any other style violates STRICT_COMMENT_STYLE.',
            'คอมเมนต์ต้องใช้รูปแบบ "// !" เพื่อให้ระบบตรวจสอบอัตโนมัติอ่านเจตนาได้ ชนิดอื่นถือว่าฝ่าฝืน STRICT_COMMENT_STYLE'
        ),
        fix: localized(
            'Rewrite comments with "// !" and remove legacy block comments.',
            'เขียนคอมเมนต์ใหม่ด้วย "// !" แล้วลบ block comment แบบเดิมออก'
        )
    }),
    [RULE_IDS.MUST_HANDLE_ERRORS]: createRuleEntry(RULE_IDS.MUST_HANDLE_ERRORS, {
        severity: RULE_SEVERITY_FLAGS.ERROR,
        message: localized('Async function without error handling detected', 'พบฟังก์ชัน async ที่ไม่มีการจัดการข้อผิดพลาด'),
        explanation: localized(
            'Async functions that omit try/catch leak unhandled rejections and violate MUST_HANDLE_ERRORS.',
            'ฟังก์ชัน async ที่ไม่มี try/catch ทำให้เกิด unhandled rejection และฝ่าฝืนกฎ MUST_HANDLE_ERRORS'
        ),
        fix: localized(
            'Wrap the function body with try/catch and forward failures to the central ErrorHandler.',
            'ครอบโค้ดหลักด้วย try/catch แล้วส่งข้อผิดพลาดไปยัง ErrorHandler ส่วนกลาง'
        )
    })
});

const SYNTAX_ERROR_DICTIONARY = Object.freeze({
    [SYNTAX_ERROR_CODES.UNEXPECTED_TOKEN]: createSystemEntry(SYNTAX_ERROR_CODES.UNEXPECTED_TOKEN, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Unexpected token found', 'พบ Token ที่ไม่คาดคิด'),
        explanation: localized(
            'The parser encountered a token that does not match the grammar at this position.',
            'ตัวแปลภาษาพบ token ที่ไม่ตรงตาม grammar ในตำแหน่งนี้'
        ),
        fix: localized(
            'Inspect the surrounding code for typos or missing punctuation.',
            'ตรวจสอบโค้ดบริเวณใกล้เคียงว่าไม่มีตัวอักษรเกินหรือขาดสัญลักษณ์'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.FIX_SYNTAX,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.MISSING_SEMICOLON]: createSystemEntry(SYNTAX_ERROR_CODES.MISSING_SEMICOLON, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Missing semicolon', 'ขาดเครื่องหมายเซมิโคลอน'),
        explanation: localized(
            'An expression terminated without the expected semicolon. This breaks statement boundaries.',
            'นิพจน์จบลงโดยไม่มีเครื่องหมายเซมิโคลอน ทำให้ขอบเขตคำสั่งไม่ถูกต้อง'
        ),
        fix: localized(
            'Insert the required semicolon or adjust the formatter configuration if intentional.',
            'เติมเครื่องหมายเซมิโคลอนหรือปรับ formatter หากตั้งใจไม่ใช้'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.FIX_SYNTAX,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.UNMATCHED_BRACKETS]: createSystemEntry(SYNTAX_ERROR_CODES.UNMATCHED_BRACKETS, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Unmatched brackets detected', 'พบวงเล็บที่ไม่ปิดให้ครบ'),
        explanation: localized(
            'Opening and closing brackets were imbalanced, preventing the parser from finishing.',
            'วงเล็บเปิดและปิดไม่สมดุล ทำให้ parser ทำงานต่อไม่ได้'
        ),
        fix: localized(
            'Add or remove bracket characters until the pairs are balanced.',
            'เพิ่มหรือลดวงเล็บให้ครบคู่'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.FIX_SYNTAX,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.INVALID_ASSIGNMENT]: createSystemEntry(SYNTAX_ERROR_CODES.INVALID_ASSIGNMENT, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Invalid assignment target', 'ตำแหน่งกำหนดค่าไม่ถูกต้อง'),
        explanation: localized(
            'The assignment operator was applied to an expression that cannot accept a value.',
            'โอเปอเรเตอร์กำหนดค่าถูกใช้กับนิพจน์ที่ไม่สามารถรับค่าได้'
        ),
        fix: localized(
            'Rewrite the expression so the left-hand side is a valid identifier or property access.',
            'แก้นิพจน์ให้ด้านซ้ายเป็นตัวแปรหรือการเข้าถึงคุณสมบัติที่ถูกต้อง'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.DUPLICATE_PARAMETER]: createSystemEntry(SYNTAX_ERROR_CODES.DUPLICATE_PARAMETER, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Duplicate function parameter', 'พบพารามิเตอร์ซ้ำ'),
        explanation: localized(
            'A function declared two parameters with the same name, which shadows earlier arguments.',
            'ฟังก์ชันประกาศพารามิเตอร์ที่มีชื่อซ้ำ ทำให้ค่าก่อนหน้าถูกบัง'
        ),
        fix: localized(
            'Rename or remove the duplicate parameter to keep the signature unique.',
            'เปลี่ยนชื่อหรือลบพารามิเตอร์ที่ซ้ำเพื่อให้ลายเซ็นไม่ซ้ำกัน'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.UNEXPECTED_END_OF_INPUT]: createSystemEntry(SYNTAX_ERROR_CODES.UNEXPECTED_END_OF_INPUT, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Unexpected end of input', 'จบไฟล์ก่อนคาด'),
        explanation: localized(
            'Source code terminated before the parser encountered a valid ending token.',
            'ซอร์สโค้ดสิ้นสุดก่อนที่ parser จะเจอโทเค็นปิดที่ถูกต้อง'
        ),
        fix: localized(
            'Ensure every block and string literal is properly closed.',
            'ตรวจสอบให้แน่ใจว่าบล็อกและสตริงทุกส่วนปิดครบ'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.FIX_SYNTAX,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.GRAMMAR_RULE_MISSING]: createSystemEntry(SYNTAX_ERROR_CODES.GRAMMAR_RULE_MISSING, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Grammar rule missing from registry', 'กฎไวยากรณ์ขาดจากทะเบียน'),
        explanation: localized(
            'Token stream referenced a production that is not defined in the active grammar set.',
            'ชุดโทเค็นอ้างอิง production ที่ไม่มีอยู่ในชุดไวยากรณ์ที่ใช้งาน'
        ),
        fix: localized(
            'Add the rule to the grammar JSON or regenerate the grammar index so the parser has the definition.',
            'เพิ่มกฎลงในไฟล์ grammar JSON หรือสร้างดัชนีไวยากรณ์ใหม่เพื่อให้ parser มีคำจำกัดความ'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.STABILISE_GRAMMAR,
            canRetry: false
        }
    }),
    [SYNTAX_ERROR_CODES.TOKENIZER_BRAIN_INITIALIZED]: createSystemEntry(SYNTAX_ERROR_CODES.TOKENIZER_BRAIN_INITIALIZED, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Tokenizer Brain initialization failure', 'การเริ่มต้น Brain ของ Tokenizer ล้มเหลว'),
        explanation: localized(
            'Binary grammar translation aborted during Brain bootstrap. Tokenizer cannot proceed without a valid GrammarIndex.',
            'กระบวนการแปลงไวยากรณ์เป็นไบนารีหยุดทำงานระหว่างบูต Brain ทำให้ Tokenizer ไม่สามารถทำงานต่อได้'
        ),
        fix: localized(
            'Investigate grammar index hydration and halt the pipeline until the Brain loads correctly.',
            'ตรวจสอบกระบวนการโหลด GrammarIndex แล้วหยุดท่อประมวลผลจนกว่าจะบูต Brain ได้สมบูรณ์'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.STABILISE_GRAMMAR,
            canRetry: false,
            isFatal: true
        }
    }),
    [SYNTAX_ERROR_CODES.GRAMMAR_SECTIONS_FLATTENED]: createSystemEntry(SYNTAX_ERROR_CODES.GRAMMAR_SECTIONS_FLATTENED, {
        categoryCode: ERROR_CATEGORY_CODES.SYNTAX,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Grammar flattening failure', 'การแปลงส่วน Grammar เป็นไบนารีล้มเหลว'),
        explanation: localized(
            'Tokenizer failed while flattening nested grammar sections, leaving binary lookups unusable.',
            'Tokenizer ล้มเหลวระหว่างการแปลงโครงสร้าง Grammar ที่ซ้อนกัน ทำให้การค้นหาไบนารีใช้การไม่ได้'
        ),
        fix: localized(
            'Pause scanning and repair the grammar cache before re-running the pipeline.',
            'หยุดการสแกนแล้วซ่อมแซม cache ของ grammar ก่อนเริ่มกระบวนการใหม่'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.STABILISE_GRAMMAR,
            canRetry: false,
            isFatal: true
        }
    })
});

const TYPE_ERROR_DICTIONARY = Object.freeze({
    [TYPE_ERROR_CODES.IS_NOT_A_FUNCTION]: createSystemEntry(TYPE_ERROR_CODES.IS_NOT_A_FUNCTION, {
        categoryCode: ERROR_CATEGORY_CODES.TYPE,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Value is not callable', 'ค่าที่เรียกใช้งานไม่ได้'),
        explanation: localized(
            'A call expression targeted a value that is not a function reference.',
            'มีการเรียกใช้งานค่าที่ไม่ใช่ฟังก์ชัน'
        ),
        fix: localized(
            'Verify the imported module or dependency injection wiring to ensure the symbol is a function.',
            'ตรวจสอบการ import หรือ dependency injection ให้แน่ใจว่าสัญลักษณ์นั้นเป็นฟังก์ชัน'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CHECK_DEPENDENCY,
            canRetry: false
        }
    }),
    [TYPE_ERROR_CODES.CANNOT_READ_PROPERTY_OF_NULL_OR_UNDEFINED]: createSystemEntry(TYPE_ERROR_CODES.CANNOT_READ_PROPERTY_OF_NULL_OR_UNDEFINED, {
        categoryCode: ERROR_CATEGORY_CODES.TYPE,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Cannot read property of null or undefined', 'ไม่สามารถอ่านคุณสมบัติจาก null/undefined'),
        explanation: localized(
            'Code attempted to access a property on a nullish value.',
            'โค้ดพยายามเข้าถึงคุณสมบัติบนค่า null หรือ undefined'
        ),
        fix: localized(
            'Guard the access with nullish checks or ensure the value is initialised.',
            'เพิ่มการตรวจสอบ null หรือกำหนดค่าให้พร้อมก่อนใช้งาน'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.INSPECT_RUNTIME,
            canRetry: false
        }
    }),
    [TYPE_ERROR_CODES.INVALID_TYPE_ARGUMENT]: createSystemEntry(TYPE_ERROR_CODES.INVALID_TYPE_ARGUMENT, {
        categoryCode: ERROR_CATEGORY_CODES.TYPE,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Invalid type argument supplied', 'อาร์กิวเมนต์ประเภทไม่ถูกต้อง'),
        explanation: localized(
            'A generic helper received an incompatible type argument.',
            'ตัวช่วยแบบเจเนอริกรับอาร์กิวเมนต์ประเภทที่ไม่เข้ากัน'
        ),
        fix: localized(
            'Update the caller to pass the expected type or adjust the generic constraints.',
            'แก้ไขผู้เรียกให้ส่งประเภทที่ถูกต้องหรือปรับข้อจำกัดของเจเนอริก'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW,
            canRetry: false
        }
    }),
    [TYPE_ERROR_CODES.OPERATOR_CANNOT_BE_APPLIED]: createSystemEntry(TYPE_ERROR_CODES.OPERATOR_CANNOT_BE_APPLIED, {
        categoryCode: ERROR_CATEGORY_CODES.TYPE,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Operator cannot be applied to operand', 'โอเปอเรเตอร์ใช้กับตัวถูกดำเนินการไม่ได้'),
        explanation: localized(
            'The operator does not support the operand types supplied.',
            'โอเปอเรเตอร์ไม่รองรับประเภทตัวถูกดำเนินการที่ให้มา'
        ),
        fix: localized(
            'Convert the values to compatible types or change the operator.',
            'แปลงค่าก่อนหรือเลือกโอเปอเรเตอร์ที่รองรับ'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW,
            canRetry: false
        }
    })
});

const REFERENCE_ERROR_DICTIONARY = Object.freeze({
    [REFERENCE_ERROR_CODES.IS_NOT_DEFINED]: createSystemEntry(REFERENCE_ERROR_CODES.IS_NOT_DEFINED, {
        categoryCode: ERROR_CATEGORY_CODES.REFERENCE,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Identifier is not defined', 'ตัวแปรไม่ได้ถูกประกาศ'),
        explanation: localized(
            'A variable or function was used before it was declared or imported.',
            'มีการใช้ตัวแปรหรือฟังก์ชันก่อนประกาศหรือ import'
        ),
        fix: localized(
            'Declare the identifier or ensure the correct module import is executed first.',
            'ประกาศตัวแปรให้ถูกต้องหรือ import โมดูลให้เสร็จก่อนใช้งาน'
        )
    }),
    [REFERENCE_ERROR_CODES.TEMPORAL_DEAD_ZONE_ACCESS]: createSystemEntry(REFERENCE_ERROR_CODES.TEMPORAL_DEAD_ZONE_ACCESS, {
        categoryCode: ERROR_CATEGORY_CODES.REFERENCE,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Temporal Dead Zone access detected', 'เข้าถึงค่าก่อนการประกาศ (TDZ)'),
        explanation: localized(
            'A let/const binding was accessed before initialisation, triggering the TDZ protection.',
            'มีการเข้าถึงตัวแปร let/const ก่อนถูกกำหนดค่า จึงเกิดการป้องกันแบบ TDZ'
        ),
        fix: localized(
            'Reorder the code so the binding is initialised before use.',
            'จัดลำดับโค้ดให้ตัวแปรถูกกำหนดค่าก่อนนำไปใช้'
        )
    })
});

const RUNTIME_ERROR_DICTIONARY = Object.freeze({
    [RUNTIME_ERROR_CODES.STACK_OVERFLOW]: createSystemEntry(RUNTIME_ERROR_CODES.STACK_OVERFLOW, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Stack overflow detected', 'สแตกล้น'),
        explanation: localized(
            'Recursive or deeply nested calls exhausted the stack.',
            'การเรียกซ้อนกันลึกเกินไปทำให้ stack หมด'
        ),
        fix: localized(
            'Refactor recursion into iteration or add guards to stop infinite recursion.',
            'ปรับ recursion ให้เป็น iteration หรือเพิ่มเงื่อนไขหยุดเพื่อกันการเรียกไม่รู้จบ'
        )
    }),
    [RUNTIME_ERROR_CODES.OUT_OF_MEMORY]: createSystemEntry(RUNTIME_ERROR_CODES.OUT_OF_MEMORY, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Process ran out of memory', 'หน่วยความจำไม่เพียงพอ'),
        explanation: localized(
            'Allocations exceeded available memory during execution.',
            'การจองหน่วยความจำระหว่างรันเกินกว่าที่มีอยู่'
        ),
        fix: localized(
            'Optimise data structures or stream the workload to reduce peak memory usage.',
            'ปรับโครงสร้างข้อมูลหรือทำงานแบบสตรีมเพื่อลดหน่วยความจำสูงสุด'
        )
    }),
    [RUNTIME_ERROR_CODES.NULL_POINTER_EXCEPTION]: createSystemEntry(RUNTIME_ERROR_CODES.NULL_POINTER_EXCEPTION, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Null pointer dereference', 'อ้างอิงค่า null'),
        explanation: localized(
            'A pointer-like structure was dereferenced while null.',
            'มีการอ้างอิงโครงสร้างที่มีค่า null'
        ),
        fix: localized(
            'Add null guards or ensure initialisation before use.',
            'เพิ่มการตรวจสอบ null หรือกำหนดค่าให้เรียบร้อยก่อนใช้'
        )
    }),
    [RUNTIME_ERROR_CODES.PARSE_FAILURE]: createSystemEntry(RUNTIME_ERROR_CODES.PARSE_FAILURE, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Runtime parse failure', 'การ parse ล้มเหลวระหว่างรัน'),
        explanation: localized(
            'Dynamic parsing of user input or configuration failed during execution.',
            'การ parse ข้อมูลแบบไดนามิกจากผู้ใช้หรือ config ล้มเหลวขณะรัน'
        ),
        fix: localized(
            'Validate and sanitise the input before parsing or handle failure cases explicitly.',
            'ตรวจสอบความถูกต้องของข้อมูลก่อน parse หรือจัดการกรณีล้มเหลวอย่างชัดเจน'
        )
    }),
    [RUNTIME_ERROR_CODES.UNCAUGHT_EXCEPTION]: createSystemEntry(RUNTIME_ERROR_CODES.UNCAUGHT_EXCEPTION, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Uncaught exception crashed the process', 'พบข้อยกเว้นที่ไม่ถูกจับจนโปรเซสล่ม'),
        explanation: localized(
            'A synchronous exception bubbled to the process boundary without a handler.',
            'ข้อยกเว้นแบบซิงโครนัสหลุดไปถึงระดับโปรเซสโดยไม่มีตัวจัดการ'
        ),
        fix: localized(
            'Wrap high-risk code paths in try/catch and route failures through the ErrorHandler.',
            'ครอบเส้นทางโค้ดที่เสี่ยงด้วย try/catch และส่งความล้มเหลวเข้า ErrorHandler'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.TRIGGER_INCIDENT_RESPONSE
        }
    }),
    [RUNTIME_ERROR_CODES.UNHANDLED_REJECTION]: createSystemEntry(RUNTIME_ERROR_CODES.UNHANDLED_REJECTION, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Unhandled rejection detected', 'พบ Promise ถูกปฏิเสธโดยไม่มีผู้จัดการ'),
        explanation: localized(
            'A promise rejected without catch handling, risking silent production failures.',
            'Promise ถูกปฏิเสธโดยไม่มี catch ทำให้เสี่ยงต่อปัญหาใน production ที่ไม่ถูกตรวจจับ'
        ),
        fix: localized(
            'Attach catch handlers or await promises inside try/catch blocks.',
            'เพิ่ม catch หรือใช้ await ภายใน try/catch'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW
        }
    }),
    [RUNTIME_ERROR_CODES.PROCESS_WARNING]: createSystemEntry(RUNTIME_ERROR_CODES.PROCESS_WARNING, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Process warning emitted', 'มีการส่งคำเตือนระดับโปรเซส'),
        explanation: localized(
            'Node.js raised a process-level warning such as deprecation or performance hints.',
            'Node.js แจ้งคำเตือนระดับโปรเซส เช่น การเลิกใช้งานหรือคำแนะนำด้านประสิทธิภาพ'
        ),
        fix: localized(
            'Review the warning text and update the affected dependency or code path.',
            'ตรวจสอบข้อความเตือนและอัปเดตไลบรารีหรือโค้ดที่เกี่ยวข้อง'
        ),
        metadata: {
            canRetry: false,
            recommendedAction: RECOMMENDED_ACTIONS.REVIEW_SECURITY_POLICY
        }
    }),
    [RUNTIME_ERROR_CODES.REPORT_GENERATION_FAILURE]: createSystemEntry(RUNTIME_ERROR_CODES.REPORT_GENERATION_FAILURE, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Failed to generate validation report', 'สร้างรายงานการตรวจสอบไม่สำเร็จ'),
        explanation: localized(
            'Writing or formatting the validation report threw an exception.',
            'การเขียนหรือจัดรูปแบบรายงานการตรวจสอบทำให้เกิดข้อยกเว้น'
        ),
        fix: localized(
            'Inspect file permissions and ensure the report directory exists.',
            'ตรวจสอบสิทธิ์ไฟล์และตรวจว่ามีไดเรกทอรีรายงานพร้อมใช้งาน'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.INSPECT_FILE_SYSTEM
        }
    }),
    [RUNTIME_ERROR_CODES.UNKNOWN_RUNTIME_FAILURE]: createSystemEntry(RUNTIME_ERROR_CODES.UNKNOWN_RUNTIME_FAILURE, {
        categoryCode: ERROR_CATEGORY_CODES.RUNTIME,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Unknown runtime failure', 'ความล้มเหลวระหว่างรันที่ไม่ทราบสาเหตุ'),
        explanation: localized(
            'A runtime error occurred but no specific catalogue entry matched the code.',
            'เกิดข้อผิดพลาดขณะรันแต่ไม่มีรหัสที่ตรงกับแคตตาล็อก'
        ),
        fix: localized(
            'Inspect the surrounding logs and register a dedicated error code.',
            'ตรวจสอบบันทึกที่เกี่ยวข้องและลงทะเบียนรหัสข้อผิดพลาดเฉพาะ'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.CODE_REVIEW
        }
    })
});

const LOGICAL_ERROR_DICTIONARY = Object.freeze({
    [LOGICAL_ERROR_CODES.UNHANDLED_PROMISE_REJECTION]: createSystemEntry(LOGICAL_ERROR_CODES.UNHANDLED_PROMISE_REJECTION, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Unhandled promise rejection', 'Promise ถูกปฏิเสธโดยไม่มีการจัดการ'),
        explanation: localized(
            'A promise rejected without a catch handler, risking silent production failures.',
            'Promise ถูกปฏิเสธโดยไม่มี catch ทำให้เกิดความล้มเหลวแบบเงียบใน production'
        ),
        fix: localized(
            'Attach a catch handler or wrap the async workflow in try/catch.',
            'เพิ่ม catch หรือครอบ workflow แบบ async ด้วย try/catch'
        )
    }),
    [LOGICAL_ERROR_CODES.INFINITE_LOOP]: createSystemEntry(LOGICAL_ERROR_CODES.INFINITE_LOOP, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Infinite loop detected', 'ตรวจพบลูปไม่รู้จบ'),
        explanation: localized(
            'Loop conditions never change, causing the program to hang.',
            'เงื่อนไขลูปไม่เปลี่ยน ทำให้โปรแกรมค้าง'
        ),
        fix: localized(
            'Ensure the loop mutates its control variable or break condition.',
            'ให้ลูปปรับค่าตัวควบคุมหรือมีเงื่อนไขหยุดที่ชัดเจน'
        )
    }),
    [LOGICAL_ERROR_CODES.UNREACHABLE_CODE]: createSystemEntry(LOGICAL_ERROR_CODES.UNREACHABLE_CODE, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Unreachable code detected', 'พบโค้ดที่ไม่สามารถทำงานได้'),
        explanation: localized(
            'Execution path analysis discovered statements that can never run.',
            'การวิเคราะห์เส้นทางการทำงานพบคำสั่งที่ไม่สามารถถูกเรียกใช้ได้'
        ),
        fix: localized(
            'Remove the dead code or refactor control flow to make the branch reachable.',
            'ลบโค้ดที่ไม่ทำงานหรือปรับโครงสร้างการควบคุมให้สาขาถูกเรียกใช้ได้'
        )
    }),
    [LOGICAL_ERROR_CODES.VARIABLE_SHADOWING]: createSystemEntry(LOGICAL_ERROR_CODES.VARIABLE_SHADOWING, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Variable shadowing detected', 'พบการบังตัวแปร'),
        explanation: localized(
            'An inner scope declared a variable with the same name, hiding the outer binding.',
            'บล็อกชั้นในประกาศตัวแปรชื่อเดียวกับชั้นนอกทำให้ค่าถูกบัง'
        ),
        fix: localized(
            'Rename the inner binding or refactor the scopes to avoid ambiguity.',
            'เปลี่ยนชื่อหรือปรับโครงสร้างสโคปเพื่อไม่ให้สับสน'
        )
    }),
    [LOGICAL_ERROR_CODES.USE_BEFORE_DEFINE]: createSystemEntry(LOGICAL_ERROR_CODES.USE_BEFORE_DEFINE, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Use before define detected', 'ใช้ตัวแปรก่อนประกาศ'),
        explanation: localized(
            'A symbol was consumed before declaration, leading to unpredictable results.',
            'มีการใช้สัญลักษณ์ก่อนประกาศทำให้ผลลัพธ์คาดเดาได้ยาก'
        ),
        fix: localized(
            'Declare the symbol earlier or move the usage after the declaration.',
            'ประกาศสัญลักษณ์ให้ก่อนหรือย้ายจุดใช้งานไปหลังประกาศ'
        )
    }),
    [LOGICAL_ERROR_CODES.MAGIC_NUMBER]: createSystemEntry(LOGICAL_ERROR_CODES.MAGIC_NUMBER, {
        categoryCode: ERROR_CATEGORY_CODES.LOGICAL,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Magic number detected', 'พบตัวเลขที่ไม่มีความหมายชัดเจน'),
        explanation: localized(
            'Literal numbers were used in logic without symbolic names, reducing clarity.',
            'มีการใช้ตัวเลขคงที่ในตรรกะโดยไม่ตั้งชื่อสัญลักษณ์ ทำให้โค้ดอ่านยาก'
        ),
        fix: localized(
            'Extract the literal into a named constant within constants.js.',
            'ย้ายค่าตัวเลขไปเป็นค่าคงที่แบบมีชื่อภายใน constants.js'
        )
    })
});

const FILE_SYSTEM_ERROR_DICTIONARY = Object.freeze({
    [FILE_SYSTEM_ERROR_CODES.FILE_NOT_FOUND]: createSystemEntry(FILE_SYSTEM_ERROR_CODES.FILE_NOT_FOUND, {
        categoryCode: ERROR_CATEGORY_CODES.FILE_SYSTEM,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('File not found', 'ไม่พบไฟล์'),
        explanation: localized(
            'A file path referenced in configuration or runtime does not exist.',
            'เส้นทางไฟล์ที่ใช้ใน config หรือขณะรันไม่พบไฟล์จริง'
        ),
        fix: localized(
            'Verify the path and ensure the file is created before execution.',
            'ตรวจสอบเส้นทางและสร้างไฟล์ให้พร้อมก่อนใช้งาน'
        )
    }),
    [FILE_SYSTEM_ERROR_CODES.FILE_READ_ERROR]: createSystemEntry(FILE_SYSTEM_ERROR_CODES.FILE_READ_ERROR, {
        categoryCode: ERROR_CATEGORY_CODES.FILE_SYSTEM,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Cannot read file', 'อ่านไฟล์ไม่ได้'),
        explanation: localized(
            'Reading a file failed because of permission issues or corruption.',
            'ไม่สามารถอ่านไฟล์ได้เนื่องจากสิทธิ์ไม่เพียงพอหรือไฟล์เสีย'
        ),
        fix: localized(
            'Grant appropriate permissions or restore a clean copy of the file.',
            'ปรับสิทธิ์การเข้าถึงหรือกู้ไฟล์เวอร์ชันที่สมบูรณ์'
        )
    }),
    [FILE_SYSTEM_ERROR_CODES.FILE_WRITE_ERROR]: createSystemEntry(FILE_SYSTEM_ERROR_CODES.FILE_WRITE_ERROR, {
        categoryCode: ERROR_CATEGORY_CODES.FILE_SYSTEM,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Cannot write file', 'เขียนไฟล์ไม่ได้'),
        explanation: localized(
            'The process could not persist data to disk.',
            'กระบวนการไม่สามารถเขียนข้อมูลลงดิสก์ได้'
        ),
        fix: localized(
            'Check disk space, adjust permissions, or redirect output to a writable path.',
            'ตรวจสอบพื้นที่ว่าง ปรับสิทธิ์ หรือเปลี่ยนเส้นทางไปยังตำแหน่งที่เขียนได้'
        )
    }),
    [FILE_SYSTEM_ERROR_CODES.PERMISSION_DENIED]: createSystemEntry(FILE_SYSTEM_ERROR_CODES.PERMISSION_DENIED, {
        categoryCode: ERROR_CATEGORY_CODES.FILE_SYSTEM,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Permission denied', 'ไม่ได้รับสิทธิ์การเข้าถึง'),
        explanation: localized(
            'The runtime lacks the privileges required to access the resource.',
            'ขณะรันไม่มีสิทธิ์เพียงพอในการเข้าถึงทรัพยากร'
        ),
        fix: localized(
            'Grant the expected permissions or adjust the execution user.',
            'เพิ่มสิทธิ์การเข้าถึงหรือปรับผู้ใช้งานให้ถูกต้อง'
        )
    })
});

const SECURITY_ERROR_DICTIONARY = Object.freeze({
    [SECURITY_ERROR_CODES.UNKNOWN_VIOLATION]: createSystemEntry(SECURITY_ERROR_CODES.UNKNOWN_VIOLATION, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Unhandled security violation detected', 'ตรวจพบการละเมิดความปลอดภัยที่ไม่รู้จัก'),
        explanation: localized(
            'The security subsystem reported a violation without a registered catalogue entry.',
            'ระบบความปลอดภัยรายงานการละเมิดที่ยังไม่มีข้อมูลในแคตตาล็อก'
        ),
        fix: localized(
            'Classify the incident, register a dedicated code, and update the security playbook.',
            'จัดหมวดหมู่เหตุการณ์ ลงทะเบียนรหัสเฉพาะ และอัปเดตคู่มือการรับมือด้านความปลอดภัย'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.REVIEW_SECURITY_POLICY,
            canRetry: false
        }
    }),
    [SECURITY_ERROR_CODES.SUSPICIOUS_PATTERN]: createSystemEntry(SECURITY_ERROR_CODES.SUSPICIOUS_PATTERN, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Suspicious pattern detected', 'ตรวจพบรูปแบบที่น่าสงสัย'),
        explanation: localized(
            'Input analysis matched a pattern linked to intrusion or malicious content.',
            'การวิเคราะห์อินพุตพบรูปแบบที่เกี่ยวข้องกับการบุกรุกหรือเนื้อหาที่เป็นอันตราย'
        ),
        fix: localized(
            'Block the payload, alert the operators, and review filter coverage.',
            'บล็อกข้อมูล แจ้งเตือนไปยังผู้ดูแล และทบทวนความครอบคลุมของตัวกรอง'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.TRIGGER_INCIDENT_RESPONSE
        }
    }),
    [SECURITY_ERROR_CODES.RATE_LIMIT_TRIGGERED]: createSystemEntry(SECURITY_ERROR_CODES.RATE_LIMIT_TRIGGERED, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Rate limit threshold triggered', 'ถึงขีดจำกัดการเรียกใช้งาน'),
        explanation: localized(
            'The rate limiter blocked repeated activity that risked resource exhaustion.',
            'ตัวจำกัดอัตราการใช้งานบล็อกกิจกรรมที่เกิดซ้ำจนเสี่ยงต่อการใช้ทรัพยากรเกิน'
        ),
        fix: localized(
            'Verify the caller behaviour and tune threshold configurations if required.',
            'ตรวจสอบพฤติกรรมของผู้เรียกและปรับค่าขีดจำกัดหากจำเป็น'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.UPDATE_CONFIGURATION,
            canRetry: true
        }
    }),
    [SECURITY_ERROR_CODES.PATH_TRAVERSAL_BLOCKED]: createSystemEntry(SECURITY_ERROR_CODES.PATH_TRAVERSAL_BLOCKED, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Path traversal attempt blocked', 'บล็อกความพยายามเจาะเส้นทางไฟล์'),
        explanation: localized(
            'File access validation detected traversal characters that escape the sandbox.',
            'การตรวจสอบการเข้าถึงไฟล์พบอักขระที่พยายามหลบหลีกพื้นที่ปลอดภัย'
        ),
        fix: localized(
            'Log the incident, rotate credentials, and audit recent file access.',
            'บันทึกเหตุการณ์ เปลี่ยนข้อมูลรับรอง และตรวจสอบการเข้าถึงไฟล์ล่าสุด'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.TRIGGER_INCIDENT_RESPONSE,
            isFatal: true
        }
    }),
    [SECURITY_ERROR_CODES.UNAUTHORIZED_MODULE_ACCESS]: createSystemEntry(SECURITY_ERROR_CODES.UNAUTHORIZED_MODULE_ACCESS, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.CRITICAL,
        message: localized('Unauthorized module access blocked', 'บล็อกการเข้าถึงโมดูลโดยไม่ได้รับอนุญาต'),
        explanation: localized(
            'A caller attempted to access a restricted VS Code module or API.',
            'มีผู้เรียกพยายามเข้าถึงโมดูลหรือ API ของ VS Code ที่จำกัดสิทธิ์'
        ),
        fix: localized(
            'Confirm the caller identity and tighten permission scopes.',
            'ยืนยันตัวตนผู้เรียกและปรับความละเอียดของสิทธิ์ให้เข้มขึ้น'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.REVIEW_SECURITY_POLICY,
            isFatal: true
        }
    }),
    [SECURITY_ERROR_CODES.SECURITY_MODULE_FAILURE]: createSystemEntry(SECURITY_ERROR_CODES.SECURITY_MODULE_FAILURE, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.HIGH,
        message: localized('Security subsystem failure', 'ระบบความปลอดภัยขัดข้อง'),
        explanation: localized(
            'An internal security component threw an error while enforcing policy.',
            'คอมโพเนนต์ความปลอดภัยภายในเกิดข้อผิดพลาดระหว่างบังคับใช้นโยบาย'
        ),
        fix: localized(
            'Inspect the stack trace, patch the dependency, and rerun health checks.',
            'ตรวจสอบสแตกเทรซ แก้ไขไลบรารี และรันการตรวจสุขภาพระบบอีกครั้ง'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.INSPECT_RUNTIME,
            canRetry: false
        }
    }),
    [SECURITY_ERROR_CODES.SECURITY_NOTICE]: createSystemEntry(SECURITY_ERROR_CODES.SECURITY_NOTICE, {
        categoryCode: ERROR_CATEGORY_CODES.SECURITY,
        severity: ERROR_SEVERITY_FLAGS.MEDIUM,
        message: localized('Security notice issued', 'ออกประกาศเตือนความปลอดภัย'),
        explanation: localized(
            'The security layer emitted an informational notice for operators.',
            'เลเยอร์ความปลอดภัยแจ้งประกาศข้อมูลให้ผู้ดูแลรับทราบ'
        ),
        fix: localized(
            'Review the notice and update runbooks or dashboards accordingly.',
            'ตรวจสอบประกาศแล้วอัปเดตคู่มือหรือแดชบอร์ดให้ตรงสถานการณ์'
        ),
        metadata: {
            recommendedAction: RECOMMENDED_ACTIONS.REVIEW_SECURITY_POLICY
        }
    })
});

const SYSTEM_DICTIONARY_LAYERS = [
    SYNTAX_ERROR_DICTIONARY,
    TYPE_ERROR_DICTIONARY,
    REFERENCE_ERROR_DICTIONARY,
    RUNTIME_ERROR_DICTIONARY,
    LOGICAL_ERROR_DICTIONARY,
    FILE_SYSTEM_ERROR_DICTIONARY,
    SECURITY_ERROR_DICTIONARY
];

export const SYSTEM_ERROR_DICTIONARY = Object.freeze(
    SYSTEM_DICTIONARY_LAYERS.reduce((accumulator, layer) => Object.assign(accumulator, layer), {})
);

function parseResolveArgs(arg1, arg2) {
    let kind = null;
    let language = DEFAULT_LANGUAGE;

    if (typeof arg1 === 'string') {
        if (arg1 === 'rule' || arg1 === 'system') {
            kind = arg1;
            if (typeof arg2 === 'string') {
                language = arg2;
            } else if (arg2 && typeof arg2 === 'object' && typeof arg2.language === 'string') {
                language = arg2.language;
            }
        } else {
            language = arg1;
            if (typeof arg2 === 'string' && (arg2 === 'rule' || arg2 === 'system')) {
                kind = arg2;
            }
        }
    } else if (arg1 && typeof arg1 === 'object') {
        if (typeof arg1.language === 'string') {
            language = arg1.language;
        }
        if (typeof arg1.kind === 'string') {
            const candidate = arg1.kind.toLowerCase();
            if (candidate === 'rule' || candidate === 'system') {
                kind = candidate;
            }
        }
    }

    return { kind, language };
}

export function resolveDictionaryEntry(errorCode) {
    const category = classifyErrorCode(errorCode);

    if (category.code === ERROR_CATEGORY_CODES.RULE) {
        const entry = RULE_ERROR_DICTIONARY[errorCode] || RULE_FALLBACK_ENTRY;
        return {
            kind: 'rule',
            code: errorCode,
            entry,
            category
        };
    }

    if (SYSTEM_ERROR_DICTIONARY[errorCode]) {
        return {
            kind: 'system',
            code: errorCode,
            entry: SYSTEM_ERROR_DICTIONARY[errorCode],
            category
        };
    }

    return {
        kind: 'unknown',
        code: errorCode,
        entry: FALLBACK_ERROR_ENTRY,
        category
    };
}

export function resolveRuleDictionaryEntry(ruleId) {
    return RULE_ERROR_DICTIONARY[ruleId] || null;
}

export function resolveSystemDictionaryEntry(errorCode) {
    return SYSTEM_ERROR_DICTIONARY[errorCode] || null;
}

export function resolveErrorMessage(errorCode, arg1 = null, arg2 = null) {
    const { kind, language } = parseResolveArgs(arg1, arg2);

    let payload;
    if (kind === 'rule') {
        payload = {
            kind: 'rule',
            code: errorCode,
            entry: RULE_ERROR_DICTIONARY[errorCode] || RULE_FALLBACK_ENTRY,
            category: ERROR_CATEGORY_CATALOG[ERROR_CATEGORY_CODES.RULE]
        };
    } else if (kind === 'system') {
        payload = {
            kind: 'system',
            code: errorCode,
            entry: SYSTEM_ERROR_DICTIONARY[errorCode] || FALLBACK_ERROR_ENTRY,
            category: classifyErrorCode(errorCode)
        };
    } else {
        payload = resolveDictionaryEntry(errorCode);
    }

    const message = selectLocalized(payload.entry.message, language);
    const explanation = selectLocalized(payload.entry.explanation, language);
    const fix = selectLocalized(payload.entry.fix, language);
    const severity = payload.entry.severity || FALLBACK_ERROR_ENTRY.severity;
    const severityLabel = payload.entry.severityLabel || resolveErrorSeveritySlug(severity);
    const categoryCode = payload.entry.categoryCode !== undefined ? payload.entry.categoryCode : payload.category.code;
    const categorySlug = payload.entry.categorySlug || payload.category.slug;

    return {
        message,
        explanation,
        fix,
        severity,
        severityLabel,
        categoryCode,
        categorySlug
    };
}

export function resolveLocalizedErrorEntry(errorCode, options = {}) {
    const payload = resolveDictionaryEntry(errorCode);
    const language = typeof options.language === 'string' ? options.language : DEFAULT_LANGUAGE;

    return {
        ...payload,
        resolved: {
            message: selectLocalized(payload.entry.message, language),
            explanation: selectLocalized(payload.entry.explanation, language),
            fix: selectLocalized(payload.entry.fix, language)
        }
    };
}

export default {
    RULE_ERROR_DICTIONARY,
    SYSTEM_ERROR_DICTIONARY,
    resolveDictionaryEntry,
    resolveRuleDictionaryEntry,
    resolveSystemDictionaryEntry,
    resolveErrorMessage,
    resolveLocalizedErrorEntry
};

export { RULE_FALLBACK_ENTRY };

export {
    SYSTEM_ERROR_CODES,
    SYNTAX_ERROR_CODES,
    TYPE_ERROR_CODES,
    REFERENCE_ERROR_CODES,
    RUNTIME_ERROR_CODES,
    LOGICAL_ERROR_CODES,
    FILE_SYSTEM_ERROR_CODES
} from './error-catalog.js';
