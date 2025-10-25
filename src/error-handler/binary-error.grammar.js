// Binary Error Grammar - ES Module
// Pure Configuration: Binary Error Code Structure Definition
// Binary-First Architecture: Grammar as Code

export const binaryErrorGrammar = {
    "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
    "__grammar_language": "Binary Error Code System",
    "__grammar_version": "1.0.0",
    "__grammar_title": "Binary Error Code Grammar Definition",
    "__grammar_description": "Complete grammar rules for 64-bit Binary Error Codes - Domains, Categories, Severities, Sources",
    "__grammar_purpose": "ให้ BinaryErrorHandler (Brain) รู้จักทุก component ของ Binary Error Code เพื่อ decompose และ validate อย่างถูกต้อง",
    "__grammar_total_sections": 6,
    "__grammar_sections": [
        "config",
        "meta",
        "domains",
        "categories",
        "severities",
        "sources"
    ],
    "__grammar_used_by": [
        "BinaryErrorHandler",
        "binary-codes.js",
        "binary-reporter.js",
        "binary-dictionary.js"
    ],
    "__grammar_footer": "══════════════════════════════════════════════════════════════════════════════",

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 00: Configuration - Runtime Settings (NO_HARDCODE Compliance)
    // ═══════════════════════════════════════════════════════════════════════════
    
    "config": {
        "baseLogDir": "logs",
        "emergencyLogPath": "logs/errors/logger-emergency.log",
        "defaultFallbackSeverity": "ERROR"
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 00.5: Meta Error Codes - Reserved Codes for System Errors
    // ═══════════════════════════════════════════════════════════════════════════
    
    "meta": {
        "META_INVALID_ERROR_CODE": "283674537383937"
        // Domain: SYSTEM (1) | Category: INTEGRITY (512) | Severity: CRITICAL (32) | Source: SYSTEM (1) | Offset: 1
        // Calculation: (1 << 48) | (512 << 32) | (32 << 24) | (1 << 16) | 1
    },

    "__section_01": "══════════════════════════════════════════════════════════════════════════════",
    "__section_01_number": "01",
    "__section_01_name": "domains",
    "__section_01_title": "【SECTION 01】Binary Error Domains (16-bit)",
    "__section_01_language": "Binary Error Code System",
    "__section_01_total_items": 10,
    "__section_01_description": "โมดูลที่ Binary Error เกิดขึ้น - PARSER, TYPE_SYSTEM, VALIDATOR, SECURITY, RUNTIME, IO, NETWORK, DATABASE, EXTENSION, SYSTEM",
    "__section_01_purpose": "กำหนด domain ทั้งหมดของ Binary Error Code เพื่อให้ Brain รู้ว่า error มาจากโมดูลไหน และควร route ไปให้ใครจัดการ",
    "__section_01_responsibility": "ให้ Brain รู้ว่า domain แต่ละตัว ใช้ได้กับ category ไหนบ้าง, ควร throw หรือไม่, และต้องการ context อะไร",
    "__section_01_used_by": [
        "composeBinaryCode()",
        "decomposeBinaryCode()",
        "BinaryErrorHandler.renderError()"
    ],
    "__section_01_notes": "Domain code ใช้ 16 bits (0x0001 - 0xFFFF) และเป็น bit flag เพื่อให้สามารถ combine ได้ในอนาคต",
    "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",

    "domains": {
        "SYSTEM": {
            "code": 1,
            "hexCode": "0x0001",
            "binaryCode": "0b0000000000000001",
            "bitPosition": 0,
            "label": "System",
            "slug": "system",
            "description": "ระบบทั่วไป - Meta errors, unknown errors, internal failures",
            "allowedCategories": [
                "RUNTIME",
                "CONFIGURATION",
                "INTEGRITY"
            ],
            "requiredContext": [
                "timestamp",
                "systemState"
            ],
            "optionalContext": [
                "errorCode",
                "stackTrace"
            ],
            "shouldThrow": true,
            "canRetry": false,
            "isRecoverable": false,
            "priority": "CRITICAL"
        },
        "PARSER": {
            "code": 2,
            "hexCode": "0x0002",
            "binaryCode": "0b0000000000000010",
            "bitPosition": 1,
            "label": "Parser",
            "slug": "parser",
            "description": "Grammar/Syntax Parser - Tokenization, AST construction, syntax validation",
            "allowedCategories": [
                "SYNTAX",
                "VALIDATION"
            ],
            "requiredContext": [
                "position",
                "character"
            ],
            "optionalContext": [
                "line",
                "column",
                "charCode",
                "tokenType"
            ],
            "shouldThrow": true,
            "canRetry": false,
            "isRecoverable": false,
            "priority": "CRITICAL"
        },
        "TYPE_SYSTEM": {
            "code": 4,
            "hexCode": "0x0004",
            "binaryCode": "0b0000000000000100",
            "bitPosition": 2,
            "label": "Type System",
            "slug": "type-system",
            "description": "Type Checker - Type inference, type validation, type mismatch detection",
            "allowedCategories": [
                "TYPE",
                "VALIDATION"
            ],
            "requiredContext": [
                "expectedType",
                "actualType"
            ],
            "optionalContext": [
                "identifier",
                "location"
            ],
            "shouldThrow": true,
            "canRetry": false,
            "isRecoverable": false,
            "priority": "ERROR"
        },
        "VALIDATOR": {
            "code": 8,
            "hexCode": "0x0008",
            "binaryCode": "0b0000000000001000",
            "bitPosition": 3,
            "label": "Validator",
            "slug": "validator",
            "description": "Validation System - Schema validation, constraint checking, data integrity",
            "allowedCategories": [
                "VALIDATION",
                "LOGIC"
            ],
            "requiredContext": [
                "field",
                "value"
            ],
            "optionalContext": [
                "constraint",
                "expected"
            ],
            "shouldThrow": false,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "WARNING"
        },
        "SECURITY": {
            "code": 16,
            "hexCode": "0x0010",
            "binaryCode": "0b0000000000010000",
            "bitPosition": 4,
            "label": "Security",
            "slug": "security",
            "description": "Security Layer - Authentication, authorization, rate limiting, intrusion detection",
            "allowedCategories": [
                "PERMISSION",
                "VALIDATION",
                "RUNTIME"
            ],
            "requiredContext": [
                "userId",
                "resource",
                "action"
            ],
            "optionalContext": [
                "ipAddress",
                "attempt"
            ],
            "shouldThrow": true,
            "canRetry": false,
            "isRecoverable": false,
            "priority": "CRITICAL"
        },
        "RUNTIME": {
            "code": 32,
            "hexCode": "0x0020",
            "binaryCode": "0b0000000000100000",
            "bitPosition": 5,
            "label": "Runtime",
            "slug": "runtime",
            "description": "Runtime Execution - Code execution, evaluation, dynamic errors",
            "allowedCategories": [
                "RUNTIME",
                "LOGIC",
                "RESOURCE"
            ],
            "requiredContext": [
                "operation"
            ],
            "optionalContext": [
                "value",
                "state"
            ],
            "shouldThrow": true,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "ERROR"
        },
        "IO": {
            "code": 64,
            "hexCode": "0x0040",
            "binaryCode": "0b0000000001000000",
            "bitPosition": 6,
            "label": "I/O",
            "slug": "io",
            "description": "File I/O Operations - File read/write, path resolution, permissions",
            "allowedCategories": [
                "RESOURCE",
                "RESOURCE_NOT_FOUND",
                "RESOURCE_UNAVAILABLE",
                "RESOURCE_EXHAUSTED",
                "PERMISSION",
                "RUNTIME"
            ],
            "requiredContext": [
                "path"
            ],
            "optionalContext": [
                "operation",
                "permissions"
            ],
            "shouldThrow": true,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "ERROR"
        },
        "NETWORK": {
            "code": 128,
            "hexCode": "0x0080",
            "binaryCode": "0b0000000010000000",
            "bitPosition": 7,
            "label": "Network",
            "slug": "network",
            "description": "Network Operations - HTTP requests, API calls, network failures",
            "allowedCategories": [
                "TIMEOUT",
                "RESOURCE",
                "RESOURCE_NOT_FOUND",
                "RESOURCE_UNAVAILABLE",
                "RESOURCE_EXHAUSTED",
                "RUNTIME"
            ],
            "requiredContext": [
                "url"
            ],
            "optionalContext": [
                "method",
                "status",
                "timeout"
            ],
            "shouldThrow": false,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "WARNING"
        },
        "DATABASE": {
            "code": 256,
            "hexCode": "0x0100",
            "binaryCode": "0b0000000100000000",
            "bitPosition": 8,
            "label": "Database",
            "slug": "database",
            "description": "Database Operations - Query execution, connection management, data integrity",
            "allowedCategories": [
                "RUNTIME",
                "TIMEOUT",
                "INTEGRITY"
            ],
            "requiredContext": [
                "query"
            ],
            "optionalContext": [
                "table",
                "connection"
            ],
            "shouldThrow": true,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "ERROR"
        },
        "EXTENSION": {
            "code": 512,
            "hexCode": "0x0200",
            "binaryCode": "0b0000001000000000",
            "bitPosition": 9,
            "label": "Extension",
            "slug": "extension",
            "description": "Extension/Plugin System - Extension loading, lifecycle, configuration",
            "allowedCategories": [
                "RUNTIME",
                "CONFIGURATION",
                "RESOURCE"
            ],
            "requiredContext": [
                "extensionId"
            ],
            "optionalContext": [
                "version",
                "config"
            ],
            "shouldThrow": false,
            "canRetry": true,
            "isRecoverable": true,
            "priority": "WARNING"
        }
    },

    "__section_02": "══════════════════════════════════════════════════════════════════════════════",
    "__section_02_number": "02",
    "__section_02_name": "categories",
    "__section_02_title": "【SECTION 02】Binary Error Categories (16-bit)",
    "__section_02_language": "Binary Error Code System",
    "__section_02_total_items": 10,
    "__section_02_description": "ประเภทของปัญหา - SYNTAX, TYPE, VALIDATION, RUNTIME, LOGIC, CONFIGURATION, PERMISSION, RESOURCE, TIMEOUT, INTEGRITY",
    "__section_02_purpose": "กำหนด category ทั้งหมดของ Binary Error Code เพื่อให้ Brain รู้ว่า error เป็นประเภทไหน และควรจะแก้ไขอย่างไร",
    "__section_02_responsibility": "ให้ Brain รู้ว่า category แต่ละตัว มี default severity อะไร, ต้องการ fix suggestion อย่างไร, และมีตัวอย่าง error อะไรบ้าง",
    "__section_02_used_by": [
        "composeBinaryCode()",
        "decomposeBinaryCode()",
        "binary-dictionary.js"
    ],
    "__section_02_notes": "Category code ใช้ 16 bits (0x0001 - 0xFFFF) และสามารถ combine กับ domain เพื่อสร้าง error code ที่สมบูรณ์",
    "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",

    "categories": {
        "SYNTAX": {
            "code": 1,
            "hexCode": "0x0001",
            "binaryCode": "0b0000000000000001",
            "bitPosition": 0,
            "label": "Syntax Error",
            "slug": "syntax",
            "description": "Syntax/Grammar violations - Invalid tokens, unexpected characters, malformed expressions",
            "defaultSeverity": "CRITICAL",
            "defaultSeverityCode": 32,
            "commonCauses": [
                "Missing/unexpected punctuation",
                "Invalid operator usage",
                "Malformed keywords",
                "Undefined grammar elements"
            ],
            "fixSuggestions": [
                "Check grammar definition",
                "Verify source code syntax",
                "Add missing grammar elements"
            ],
            "exampleErrors": [
                "GRAMMAR_PUNCTUATION_UNDEFINED",
                "GRAMMAR_OPERATOR_UNDEFINED",
                "UNEXPECTED_TOKEN"
            ]
        },
        "TYPE": {
            "code": 2,
            "hexCode": "0x0002",
            "binaryCode": "0b0000000000000010",
            "bitPosition": 1,
            "label": "Type Error",
            "slug": "type",
            "description": "Type mismatches, invalid casts, undefined types",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "Type mismatch",
                "Invalid type cast",
                "Undefined type reference"
            ],
            "fixSuggestions": [
                "Check type definitions",
                "Verify type compatibility",
                "Add type annotations"
            ],
            "exampleErrors": [
                "TYPE_MISMATCH",
                "UNDEFINED_TYPE",
                "INVALID_TYPE_CAST"
            ]
        },
        "VALIDATION": {
            "code": 4,
            "hexCode": "0x0004",
            "binaryCode": "0b0000000000000100",
            "bitPosition": 2,
            "label": "Validation Error",
            "slug": "validation",
            "description": "Schema validation failures, constraint violations, invalid data",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "Missing required field",
                "Invalid format",
                "Out of range value"
            ],
            "fixSuggestions": [
                "Check schema definition",
                "Verify input data",
                "Add validation rules"
            ],
            "exampleErrors": [
                "MISSING_REQUIRED_FIELD",
                "INVALID_FORMAT",
                "OUT_OF_RANGE"
            ]
        },
        "RUNTIME": {
            "code": 8,
            "hexCode": "0x0008",
            "binaryCode": "0b0000000000001000",
            "bitPosition": 3,
            "label": "Runtime Error",
            "slug": "runtime",
            "description": "Errors during code execution, evaluation failures",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "Null reference",
                "Division by zero",
                "Stack overflow"
            ],
            "fixSuggestions": [
                "Add null checks",
                "Handle edge cases",
                "Optimize recursion"
            ],
            "exampleErrors": [
                "NULL_REFERENCE",
                "DIVISION_BY_ZERO",
                "STACK_OVERFLOW"
            ]
        },
        "LOGIC": {
            "code": 16,
            "hexCode": "0x0010",
            "binaryCode": "0b0000000000010000",
            "bitPosition": 4,
            "label": "Logic Error",
            "slug": "logic",
            "description": "Business logic violations, invariant failures",
            "defaultSeverity": "WARNING",
            "defaultSeverityCode": 8,
            "commonCauses": [
                "Invalid state transition",
                "Invariant violation",
                "Unexpected condition"
            ],
            "fixSuggestions": [
                "Review business logic",
                "Add assertions",
                "Validate state"
            ],
            "exampleErrors": [
                "INVALID_STATE",
                "INVARIANT_VIOLATION",
                "CONDITION_NOT_MET"
            ]
        },
        "CONFIGURATION": {
            "code": 32,
            "hexCode": "0x0020",
            "binaryCode": "0b0000000000100000",
            "bitPosition": 5,
            "label": "Configuration Error",
            "slug": "configuration",
            "description": "Invalid or missing configuration, setup errors",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "Missing config file",
                "Invalid config value",
                "Required config missing"
            ],
            "fixSuggestions": [
                "Create config file",
                "Verify config values",
                "Add required settings"
            ],
            "exampleErrors": [
                "MISSING_CONFIG",
                "INVALID_CONFIG_VALUE",
                "CONFIG_PARSE_ERROR"
            ]
        },
        "PERMISSION": {
            "code": 64,
            "hexCode": "0x0040",
            "binaryCode": "0b0000000001000000",
            "bitPosition": 6,
            "label": "Permission Error",
            "slug": "permission",
            "description": "Access denied, insufficient privileges, authentication failures",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "Access denied",
                "Insufficient privileges",
                "Authentication failed"
            ],
            "fixSuggestions": [
                "Check permissions",
                "Verify credentials",
                "Request access"
            ],
            "exampleErrors": [
                "ACCESS_DENIED",
                "INSUFFICIENT_PRIVILEGES",
                "AUTH_FAILED"
            ]
        },
        "RESOURCE": {
            "code": 128,
            "hexCode": "0x0080",
            "binaryCode": "0b0000000010000000",
            "bitPosition": 7,
            "label": "Resource Error",
            "slug": "resource",
            "description": "Resource not found, unavailable, or exhausted",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "File not found",
                "Resource unavailable",
                "Resource exhausted"
            ],
            "fixSuggestions": [
                "Verify resource path",
                "Check resource availability",
                "Free up resources"
            ],
            "exampleErrors": [
                "FILE_NOT_FOUND",
                "RESOURCE_UNAVAILABLE",
                "RESOURCE_EXHAUSTED"
            ]
        },
        "RESOURCE_NOT_FOUND": {
            "code": 129,
            "hexCode": "0x0081",
            "binaryCode": "0b0000000010000001",
            "bitPosition": 7,
            "label": "Resource Not Found",
            "slug": "resource-not-found",
            "description": "Resource (file, URL, asset) does not exist at the specified path",
            "defaultSeverity": "ERROR",
            "defaultSeverityCode": 16,
            "commonCauses": [
                "File path incorrect",
                "File deleted",
                "Path does not exist"
            ],
            "fixSuggestions": [
                "Verify file path is correct",
                "Check if file was moved or deleted",
                "Create missing resource"
            ],
            "exampleErrors": [
                "FILE_NOT_FOUND",
                "PATH_NOT_FOUND",
                "URL_404"
            ]
        },
        "RESOURCE_UNAVAILABLE": {
            "code": 130,
            "hexCode": "0x0082",
            "binaryCode": "0b0000000010000010",
            "bitPosition": 7,
            "label": "Resource Unavailable",
            "slug": "resource-unavailable",
            "description": "Resource exists but is temporarily unavailable (locked, busy, server down)",
            "defaultSeverity": "WARNING",
            "defaultSeverityCode": 8,
            "commonCauses": [
                "File locked by another process",
                "Server temporarily down",
                "Resource busy"
            ],
            "fixSuggestions": [
                "Retry after delay",
                "Check if resource is locked",
                "Wait for resource to become available"
            ],
            "exampleErrors": [
                "FILE_LOCKED",
                "SERVER_UNAVAILABLE",
                "RESOURCE_BUSY"
            ]
        },
        "RESOURCE_EXHAUSTED": {
            "code": 131,
            "hexCode": "0x0083",
            "binaryCode": "0b0000000010000011",
            "bitPosition": 7,
            "label": "Resource Exhausted",
            "slug": "resource-exhausted",
            "description": "Resource limit reached (disk full, memory full, pool empty, quota exceeded)",
            "defaultSeverity": "CRITICAL",
            "defaultSeverityCode": 32,
            "commonCauses": [
                "Disk full",
                "Memory exhausted",
                "Connection pool empty",
                "Quota exceeded"
            ],
            "fixSuggestions": [
                "Free up disk space",
                "Increase memory allocation",
                "Close unused connections",
                "Request quota increase"
            ],
            "exampleErrors": [
                "DISK_FULL",
                "OUT_OF_MEMORY",
                "POOL_EXHAUSTED",
                "QUOTA_EXCEEDED"
            ]
        },
        "TIMEOUT": {
            "code": 256,
            "hexCode": "0x0100",
            "binaryCode": "0b0000000100000000",
            "bitPosition": 8,
            "label": "Timeout Error",
            "slug": "timeout",
            "description": "Operation timeout, deadline exceeded",
            "defaultSeverity": "WARNING",
            "defaultSeverityCode": 8,
            "commonCauses": [
                "Operation too slow",
                "Network timeout",
                "Deadlock"
            ],
            "fixSuggestions": [
                "Increase timeout",
                "Optimize operation",
                "Check network"
            ],
            "exampleErrors": [
                "OPERATION_TIMEOUT",
                "NETWORK_TIMEOUT",
                "DEADLOCK_DETECTED"
            ]
        },
        "INTEGRITY": {
            "code": 512,
            "hexCode": "0x0200",
            "binaryCode": "0b0000001000000000",
            "bitPosition": 9,
            "label": "Integrity Error",
            "slug": "integrity",
            "description": "Data integrity violations, corruption, checksum failures",
            "defaultSeverity": "CRITICAL",
            "defaultSeverityCode": 32,
            "commonCauses": [
                "Data corruption",
                "Checksum mismatch",
                "Constraint violation"
            ],
            "fixSuggestions": [
                "Restore from backup",
                "Verify data integrity",
                "Re-import data"
            ],
            "exampleErrors": [
                "DATA_CORRUPTED",
                "CHECKSUM_MISMATCH",
                "CONSTRAINT_VIOLATION"
            ]
        }
    },

    "__section_03": "══════════════════════════════════════════════════════════════════════════════",
    "__section_03_number": "03",
    "__section_03_name": "severities",
    "__section_03_title": "【SECTION 03】Binary Error Severities (8-bit)",
    "__section_03_language": "Binary Error Code System",
    "__section_03_total_items": 8,
    "__section_03_description": "ความรุนแรง - TRACE, DEBUG, INFO, WARNING, ERROR, CRITICAL, FATAL, EMERGENCY",
    "__section_03_purpose": "กำหนด severity levels ทั้งหมดเพื่อให้ BinaryErrorHandler ตัดสินใจว่าจะ throw หรือ log, และ exit code ควรเป็นเท่าไร",
    "__section_03_responsibility": "ให้ Brain รู้ว่า severity แต่ละระดับควร throw error หรือไม่, exit code เท่าไร, และ logging level อะไร",
    "__section_03_used_by": [
        "BinaryErrorHandler.shouldThrowError()",
        "BinaryErrorHandler.renderError()",
        "composeBinaryCode()"
    ],
    "__section_03_notes": "Severity code ใช้ 8 bits (0x01 - 0xFF) และตัดสินใจ behavior ของ error handling",
    "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",

    "severities": {
        "TRACE": {
            "code": 1,
            "hexCode": "0x01",
            "binaryCode": "0b00000001",
            "bitPosition": 0,
            "label": "Trace",
            "slug": "trace",
            "description": "Detailed trace information for debugging - most verbose",
            "shouldThrow": false,
            "shouldLog": true,
            "exitCode": 0,
            "logLevel": "trace",
            "color": "gray",
            "icon": "[TRACE]",
            "priority": 0,
            "isRecoverable": true,
            "logPath": "telemetry/trace.log"
        },
        "DEBUG": {
            "code": 2,
            "hexCode": "0x02",
            "binaryCode": "0b00000010",
            "bitPosition": 1,
            "label": "Debug",
            "slug": "debug",
            "description": "Debug-level information - development only",
            "shouldThrow": false,
            "shouldLog": true,
            "exitCode": 0,
            "logLevel": "debug",
            "color": "blue",
            "icon": "[DEBUG]",
            "priority": 1,
            "isRecoverable": true,
            "logPath": "telemetry/debug.log"
        },
        "INFO": {
            "code": 4,
            "hexCode": "0x04",
            "binaryCode": "0b00000100",
            "bitPosition": 2,
            "label": "Info",
            "slug": "info",
            "description": "Informational message - normal operation",
            "shouldThrow": false,
            "shouldLog": true,
            "exitCode": 0,
            "logLevel": "info",
            "color": "cyan",
            "icon": "[INFO]",
            "priority": 2,
            "isRecoverable": true,
            "logPath": "telemetry/info.log"
        },
        "WARNING": {
            "code": 8,
            "hexCode": "0x08",
            "binaryCode": "0b00001000",
            "bitPosition": 3,
            "label": "Warning",
            "slug": "warning",
            "description": "Warning - potential issues, not blocking",
            "shouldThrow": false,
            "shouldLog": true,
            "exitCode": 0,
            "logLevel": "warn",
            "color": "yellow",
            "icon": "[WARN]",
            "priority": 3,
            "isRecoverable": true,
            "logPath": "errors/warnings.log"
        },
        "ERROR": {
            "code": 16,
            "hexCode": "0x10",
            "binaryCode": "0b00010000",
            "bitPosition": 4,
            "label": "Error",
            "slug": "error",
            "description": "Standard error - recoverable, logged",
            "shouldThrow": false,
            "shouldLog": true,
            "exitCode": 1,
            "logLevel": "error",
            "color": "red",
            "icon": "[ERROR]",
            "priority": 4,
            "isRecoverable": true,
            "logPath": "errors/syntax-errors.log"
        },
        "CRITICAL": {
            "code": 32,
            "hexCode": "0x20",
            "binaryCode": "0b00100000",
            "bitPosition": 5,
            "label": "Critical",
            "slug": "critical",
            "description": "Critical error - must throw, system unstable",
            "shouldThrow": true,
            "shouldLog": true,
            "exitCode": 1,
            "logLevel": "error",
            "color": "magenta",
            "icon": "[CRITICAL]",
            "priority": 5,
            "isRecoverable": false,
            "logPath": "errors/critical.log"
        },
        "FATAL": {
            "code": 64,
            "hexCode": "0x40",
            "binaryCode": "0b01000000",
            "bitPosition": 6,
            "label": "Fatal",
            "slug": "fatal",
            "description": "Fatal error - system cannot continue, immediate exit",
            "shouldThrow": true,
            "shouldLog": true,
            "exitCode": 2,
            "logLevel": "fatal",
            "color": "red",
            "icon": "[FATAL]",
            "priority": 6,
            "isRecoverable": false,
            "logPath": "errors/fatal.log"
        },
        "EMERGENCY": {
            "code": 128,
            "hexCode": "0x80",
            "binaryCode": "0b10000000",
            "bitPosition": 7,
            "label": "Emergency",
            "slug": "emergency",
            "description": "Emergency - immediate attention required, system compromised",
            "shouldThrow": true,
            "shouldLog": true,
            "exitCode": 2,
            "logLevel": "fatal",
            "color": "red",
            "icon": "[EMERGENCY]",
            "priority": 7,
            "isRecoverable": false,
            "logPath": "errors/security.log"
        }
    },

    "__section_04": "══════════════════════════════════════════════════════════════════════════════",
    "__section_04_number": "04",
    "__section_04_name": "sources",
    "__section_04_title": "【SECTION 04】Binary Error Sources (8-bit)",
    "__section_04_language": "Binary Error Code System",
    "__section_04_total_items": 8,
    "__section_04_description": "แหล่งที่มา - SYSTEM, USER, EXTERNAL, PARSER, VALIDATOR, RUNTIME, MIDDLEWARE, PLUGIN",
    "__section_04_purpose": "กำหนด source ทั้งหมดของ Binary Error Code เพื่อให้ Brain รู้ว่า error มาจากส่วนไหนของระบบ",
    "__section_04_responsibility": "ให้ Brain รู้ว่า source แต่ละตัว ควร handle อย่างไร, ต้องการ logging ระดับไหน, และมี accountability กับใคร",
    "__section_04_used_by": [
        "composeBinaryCode()",
        "decomposeBinaryCode()",
        "BinaryErrorHandler.renderError()"
    ],
    "__section_04_notes": "Source code ใช้ 8 bits (0x01 - 0xFF) และช่วยในการ trace origin ของ error",
    "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",

    "sources": {
        "SYSTEM": {
            "code": 1,
            "hexCode": "0x01",
            "binaryCode": "0b00000001",
            "bitPosition": 0,
            "label": "System",
            "slug": "system",
            "description": "Internal system error - programming bugs, assertion failures",
            "accountability": "Development Team",
            "loggingLevel": "error",
            "requiresStackTrace": true,
            "shouldAlert": true
        },
        "USER": {
            "code": 2,
            "hexCode": "0x02",
            "binaryCode": "0b00000010",
            "bitPosition": 1,
            "label": "User Input",
            "slug": "user",
            "description": "Error from user input - validation failures, invalid data",
            "accountability": "End User",
            "loggingLevel": "warn",
            "requiresStackTrace": false,
            "shouldAlert": false
        },
        "EXTERNAL": {
            "code": 4,
            "hexCode": "0x04",
            "binaryCode": "0b00000100",
            "bitPosition": 2,
            "label": "External System",
            "slug": "external",
            "description": "Error from external system/API - network failures, API errors",
            "accountability": "External Service",
            "loggingLevel": "warn",
            "requiresStackTrace": false,
            "shouldAlert": true
        },
        "PARSER": {
            "code": 8,
            "hexCode": "0x08",
            "binaryCode": "0b00001000",
            "bitPosition": 3,
            "label": "Parser",
            "slug": "parser",
            "description": "Error from parser component - syntax errors, tokenization failures",
            "accountability": "Grammar Definition",
            "loggingLevel": "error",
            "requiresStackTrace": true,
            "shouldAlert": true
        },
        "VALIDATOR": {
            "code": 16,
            "hexCode": "0x10",
            "binaryCode": "0b00010000",
            "bitPosition": 4,
            "label": "Validator",
            "slug": "validator",
            "description": "Error from validator component - schema validation, constraint violations",
            "accountability": "Schema Definition",
            "loggingLevel": "warn",
            "requiresStackTrace": false,
            "shouldAlert": false
        },
        "RUNTIME": {
            "code": 32,
            "hexCode": "0x20",
            "binaryCode": "0b00100000",
            "bitPosition": 5,
            "label": "Runtime",
            "slug": "runtime",
            "description": "Error from runtime environment - execution failures, resource exhaustion",
            "accountability": "Runtime Environment",
            "loggingLevel": "error",
            "requiresStackTrace": true,
            "shouldAlert": true
        },
        "MIDDLEWARE": {
            "code": 64,
            "hexCode": "0x40",
            "binaryCode": "0b01000000",
            "bitPosition": 6,
            "label": "Middleware",
            "slug": "middleware",
            "description": "Error from middleware layer - request processing, validation",
            "accountability": "Middleware Configuration",
            "loggingLevel": "warn",
            "requiresStackTrace": false,
            "shouldAlert": false
        },
        "PLUGIN": {
            "code": 128,
            "hexCode": "0x80",
            "binaryCode": "0b10000000",
            "bitPosition": 7,
            "label": "Plugin",
            "slug": "plugin",
            "description": "Error from plugin/extension - third-party code, extension failures",
            "accountability": "Plugin Author",
            "loggingLevel": "warn",
            "requiresStackTrace": true,
            "shouldAlert": false
        }
    }
};

export default binaryErrorGrammar;
