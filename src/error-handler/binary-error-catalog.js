// Binary Error Catalog - ES Module
// Pure Configuration: Human-Readable Error Descriptions
// Reference Only: Documentation for Binary Error Codes - Mirrors binary-error.grammar.js Structure

export const binaryErrorCatalog = {
    "__catalog_header": "══════════════════════════════════════════════════════════════════════════════",
    "__catalog_language": "Binary Error Catalog",
    "__catalog_version": "1.0.0",
    "__catalog_title": "Binary Error Catalog - Human-Readable Descriptions for Binary Error Codes",
    "__catalog_description": "คำอธิบายแบบมนุษย์อ่านสำหรับ Binary Error Codes - โครงสร้างตรงกับ binary-error.grammar.js ทุก Section",
    "__catalog_purpose": "ให้ developer เข้าใจ Binary Error Code แต่ละตัว - เกิดเมื่อไร, ทำไม, แก้ไขอย่างไร, impact อะไร",
    "__catalog_total_sections": 4,
    "__catalog_sections": [
        "domains",
        "categories",
        "severities",
        "sources"
    ],
    "__catalog_used_by": [
        "BinaryErrorParser.renderHumanReadable()",
        "Error Documentation",
        "IDE Error Tooltips",
        "Developer Training Materials"
    ],
    "__catalog_notes": "ไฟล์นี้ mirror โครงสร้าง binary-error.grammar.js - Section เดียวกัน, code เดียวกัน, แต่เพิ่มคำอธิบายแบบมนุษย์อ่าน",
    "__catalog_footer": "══════════════════════════════════════════════════════════════════════════════",

    "__section_01": "══════════════════════════════════════════════════════════════════════════════",
    "__section_01_number": "01",
    "__section_01_name": "domains",
    "__section_01_title": "【SECTION 01】Domain Catalog - Human-Readable Domain Descriptions",
    "__section_01_language": "Binary Error Catalog",
    "__section_01_total_items": 10,
    "__section_01_description": "คำอธิบายแบบมนุษย์อ่านสำหรับ Binary Error Domains - โมดูลที่ error เกิดขึ้น",
    "__section_01_purpose": "อธิบายว่า domain แต่ละตัว รับผิดชอบอะไร, error ประเภทไหนเกิดที่นี่, ตัวอย่าง error ที่เกิดบ่อย",
    "__section_01_responsibility": "ให้ developer เข้าใจว่า error จาก domain ไหน มักเกิดจากสาเหตุอะไร และควรแก้ไขที่ไหน",
    "__section_01_used_by": [
        "BinaryErrorParser.renderHumanReadable()",
        "Error Documentation Generator"
    ],
    "__section_01_notes": "Domain codes (1, 2, 4, 8, 16, 32, 64, 128, 256, 512) ตรงกับ binary-error.grammar.js Section 01 เป๊ะ",
    "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",

    "domains": {
        "SYSTEM": {
            "code": 1,
            "humanReadable": {
                "when": "Internal system failures, meta errors, unknown critical issues",
                "what": "ระบบภายในล้มเหลว - programming bugs, assertion failures, internal state corruption",
                "why": "Code bugs, memory corruption, unexpected system state, infrastructure failure",
                "where": "Deep inside system core, not user-facing code",
                "impact": "System unstable, must stop immediately - CRITICAL level failure",
                "examples": [
                    "Assertion failed: Expected non-null value but got null",
                    "Internal state corruption detected in core module",
                    "System invariant violation: Queue size negative",
                    "Unexpected system state: Process already terminated"
                ],
                "developerAction": "Fix system code, add defensive checks, validate internal state",
                "userAction": "Cannot recover - report to development team immediately"
            }
        },
        "PARSER": {
            "code": 2,
            "humanReadable": {
                "when": "During tokenization, syntax parsing, AST construction",
                "what": "Grammar/Syntax Parser errors - source code ไม่ตรงกับ grammar rules",
                "why": "Source code syntax invalid OR grammar definition incomplete/corrupted",
                "where": "Tokenizer and Parser modules",
                "impact": "Cannot parse source code - must fix syntax or grammar before continuing",
                "examples": [
                    "Grammar section 'operators' missing - cannot tokenize operators",
                    "Operator '++' undefined in grammar - add to grammar.operators",
                    "Keyword 'async' not defined - update grammar for ES2017+",
                    "Unexpected token '=' at line 5, column 7 - syntax error in source code",
                    "Missing closing '}' - unclosed block started at line 10"
                ],
                "developerAction": "Fix source code syntax OR update grammar definition to support language features",
                "userAction": "Fix syntax errors in source code - check line/column reported in error"
            }
        },
        "TYPE_SYSTEM": {
            "code": 4,
            "humanReadable": {
                "when": "During type checking, type inference, type validation",
                "what": "Type mismatch, invalid cast, undefined type reference",
                "why": "Variable/expression type doesn't match expected type",
                "where": "Type Checker module (if parser includes type checking)",
                "impact": "Type safety violation - code may fail at runtime",
                "examples": [
                    "Type mismatch: Expected 'number' but got 'string'",
                    "Cannot assign 'null' to type 'string' - non-nullable type",
                    "Property 'length' does not exist on type 'number'",
                    "Function expects 2 arguments but got 3"
                ],
                "developerAction": "Fix type annotations, add type casts, update type definitions",
                "userAction": "Fix type errors in source code - ensure types match"
            }
        },
        "VALIDATOR": {
            "code": 8,
            "humanReadable": {
                "when": "During schema validation, constraint checking, data validation",
                "what": "Validation rules violated - data doesn't match schema/constraints",
                "why": "Input data invalid format, missing required fields, out of range",
                "where": "Validation module",
                "impact": "Data invalid but recoverable - can retry with correct data",
                "examples": [
                    "Required field 'name' missing in configuration",
                    "Value '150' out of range: must be 0-100",
                    "Invalid email format: missing '@' symbol",
                    "String length 256 exceeds maximum 255"
                ],
                "developerAction": "Fix validation rules OR correct input data",
                "userAction": "Provide valid data matching schema requirements"
            }
        },
        "SECURITY": {
            "code": 16,
            "humanReadable": {
                "when": "During authentication, authorization, security checks",
                "what": "Security violation - access denied, invalid credentials, rate limit exceeded",
                "why": "User not authenticated, insufficient permissions, security policy violated",
                "where": "Security middleware, authentication layer",
                "impact": "Access blocked for security - must authenticate or request permission",
                "examples": [
                    "Authentication failed: Invalid credentials",
                    "Access denied: Insufficient permissions for resource 'admin.config'",
                    "Rate limit exceeded: Maximum 100 requests/minute",
                    "Security violation detected: Suspicious pattern in input"
                ],
                "developerAction": "Verify security configuration, check permissions, review security policy",
                "userAction": "Authenticate with valid credentials OR request access permission"
            }
        },
        "RUNTIME": {
            "code": 32,
            "humanReadable": {
                "when": "During code execution, runtime evaluation, dynamic operations",
                "what": "Runtime execution failure - null reference, division by zero, stack overflow",
                "why": "Unexpected runtime state, edge case not handled, logic error",
                "where": "Runtime execution engine",
                "impact": "Operation failed but may be recoverable - depends on error type",
                "examples": [
                    "Null reference: Cannot read property 'name' of undefined",
                    "Division by zero attempted in calculation",
                    "Stack overflow: Maximum call stack size exceeded",
                    "Array index out of bounds: Index 10 but array length 5"
                ],
                "developerAction": "Add null checks, handle edge cases, fix logic errors",
                "userAction": "Check input data, verify operation parameters"
            }
        },
        "IO": {
            "code": 64,
            "humanReadable": {
                "when": "During file read/write, path resolution, file operations",
                "what": "File I/O failure - file not found, permission denied, disk full",
                "why": "File doesn't exist, no read/write permission, storage exhausted",
                "where": "File system I/O module",
                "impact": "File operation failed but may retry or use alternative path",
                "examples": [
                    "File not found: 'config/settings.json' does not exist",
                    "Permission denied: Cannot write to '/etc/app/config'",
                    "Disk full: No space left on device",
                    "Path not found: Directory '/data/temp' does not exist"
                ],
                "developerAction": "Check file paths, verify permissions, ensure disk space available",
                "userAction": "Verify file exists, check file permissions, free up disk space"
            }
        },
        "NETWORK": {
            "code": 128,
            "humanReadable": {
                "when": "During HTTP requests, API calls, network operations",
                "what": "Network failure - connection refused, timeout, DNS error",
                "why": "Network unavailable, server down, timeout exceeded, DNS resolution failed",
                "where": "Network module, HTTP client",
                "impact": "Network operation failed but can retry with exponential backoff",
                "examples": [
                    "Connection refused: Server at 'api.example.com' not responding",
                    "Request timeout: Operation exceeded 30 seconds",
                    "DNS resolution failed: Cannot resolve 'unknown-domain.com'",
                    "Network unreachable: No route to host"
                ],
                "developerAction": "Check network connectivity, verify server URL, increase timeout",
                "userAction": "Check internet connection, verify server is running, retry later"
            }
        },
        "DATABASE": {
            "code": 256,
            "humanReadable": {
                "when": "During database queries, connection management, data operations",
                "what": "Database error - query failed, connection lost, constraint violated",
                "why": "SQL syntax error, connection timeout, unique constraint violation, deadlock",
                "where": "Database module, ORM layer",
                "impact": "Database operation failed - may retry or rollback transaction",
                "examples": [
                    "Query timeout: Database operation exceeded 60 seconds",
                    "Unique constraint violation: Duplicate key 'email' = 'user@example.com'",
                    "Connection lost: Database server disconnected",
                    "Deadlock detected: Transaction rolled back"
                ],
                "developerAction": "Fix SQL query, optimize performance, handle constraints, retry on deadlock",
                "userAction": "Check data uniqueness, verify database connection, retry operation"
            }
        },
        "EXTENSION": {
            "code": 512,
            "humanReadable": {
                "when": "During extension loading, plugin execution, extension lifecycle",
                "what": "Extension/Plugin error - load failed, execution error, configuration invalid",
                "why": "Extension file not found, incompatible version, configuration error, runtime failure",
                "where": "Extension manager, plugin system",
                "impact": "Extension failed but system can continue without it",
                "examples": [
                    "Extension 'my-plugin' not found at path 'extensions/my-plugin.js'",
                    "Extension version mismatch: Expected 2.x but got 1.5",
                    "Extension configuration invalid: Missing required field 'apiKey'",
                    "Extension runtime error: Plugin threw unhandled exception"
                ],
                "developerAction": "Check extension path, verify version compatibility, fix configuration",
                "userAction": "Install missing extension, update to compatible version, check configuration"
            }
        }
    },

    "__section_02": "══════════════════════════════════════════════════════════════════════════════",
    "__section_02_number": "02",
    "__section_02_name": "categories",
    "__section_02_title": "【SECTION 02】Category Catalog - Human-Readable Category Descriptions",
    "__section_02_language": "Binary Error Catalog",
    "__section_02_total_items": 10,
    "__section_02_description": "คำอธิบายแบบมนุษย์อ่านสำหรับ Binary Error Categories - ประเภทของปัญหา",
    "__section_02_purpose": "อธิบายว่า category แต่ละตัว คืออะไร, เกิดเมื่อไร, สาเหตุทั่วไป, วิธีแก้ไข",
    "__section_02_responsibility": "ให้ developer เข้าใจว่า error category ต่างๆ มีลักษณะอย่างไร และควรแก้ไขอย่างไร",
    "__section_02_used_by": [
        "BinaryErrorParser.renderHumanReadable()",
        "Error Documentation Generator"
    ],
    "__section_02_notes": "Category codes (1, 2, 4, 8, 16, 32, 64, 128, 256, 512) ตรงกับ binary-error.grammar.js Section 02 เป๊ะ",
    "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",

    "categories": {
        "SYNTAX": {
            "code": 1,
            "humanReadable": {
                "what": "Syntax/Grammar violations - code structure ผิดกฎ grammar",
                "when": "During tokenization and parsing - source code doesn't match grammar rules",
                "why": "Invalid tokens, unexpected characters, malformed expressions, missing/extra punctuation",
                "realWorldAnalogy": "เหมือนเขียนประโยคผิด grammar - วงเล็บไม่ปิด, ใช้เครื่องหมายผิด, คำไม่ถูกต้อง",
                "commonScenarios": [
                    "Missing semicolon at end of statement",
                    "Unclosed parenthesis/bracket/brace",
                    "Invalid operator usage (e.g., '++x++' double increment)",
                    "Keyword misspelled (e.g., 'fucntion' instead of 'function')",
                    "Unexpected token in wrong position"
                ],
                "howToFix": [
                    "Check syntax at reported line/column",
                    "Use linter (ESLint) for real-time syntax checking",
                    "Enable syntax highlighting in editor",
                    "Use auto-closing brackets/quotes",
                    "Verify grammar supports language features being used"
                ]
            }
        },
        "TYPE": {
            "code": 2,
            "humanReadable": {
                "what": "Type mismatches, invalid casts, undefined types",
                "when": "During type checking - variable/expression type doesn't match expected",
                "why": "Assigning wrong type to variable, calling function with wrong argument types, accessing non-existent properties",
                "realWorldAnalogy": "เหมือนใช้เครื่องมือผิดงาน - เอาค้อนมาขันสกรู, ใส่ string ในที่ที่ต้องการ number",
                "commonScenarios": [
                    "Assigning string to number variable",
                    "Passing number to function expecting string",
                    "Accessing property that doesn't exist on type",
                    "Type annotation mismatch with actual value",
                    "Cannot cast incompatible types"
                ],
                "howToFix": [
                    "Check type annotations match actual usage",
                    "Add explicit type casts where needed",
                    "Update type definitions to match code",
                    "Use TypeScript for compile-time type checking",
                    "Verify function parameter types match call arguments"
                ]
            }
        },
        "VALIDATION": {
            "code": 4,
            "humanReadable": {
                "what": "Schema validation failures, constraint violations, invalid data",
                "when": "During data validation - input doesn't match schema/rules",
                "why": "Missing required fields, invalid format, value out of range, constraint violated",
                "realWorldAnalogy": "เหมือนกรอกฟอร์มผิด - email ไม่มี @, เบอร์โทรมีตัวอักษร, อายุติดลบ",
                "commonScenarios": [
                    "Required configuration field missing",
                    "Email address invalid format",
                    "Number value out of allowed range",
                    "String exceeds maximum length",
                    "Invalid enum value selected"
                ],
                "howToFix": [
                    "Provide all required fields",
                    "Ensure data matches format rules (email, phone, URL, etc.)",
                    "Check value ranges and limits",
                    "Validate input before submission",
                    "Use schema validation libraries (Joi, Yup, Zod)"
                ]
            }
        },
        "RUNTIME": {
            "code": 8,
            "humanReadable": {
                "what": "Errors during code execution - runtime failures",
                "when": "During program execution - unexpected runtime state",
                "why": "Null reference, division by zero, stack overflow, array out of bounds, infinite loop",
                "realWorldAnalogy": "เหมือนรถเสียขณะขับ - เครื่องยนต์ร้อนเกิน, น้ำมันหมด, ยางระเบิด",
                "commonScenarios": [
                    "Cannot read property of undefined/null",
                    "Division by zero in calculation",
                    "Maximum call stack exceeded (infinite recursion)",
                    "Array index out of bounds",
                    "Out of memory error"
                ],
                "howToFix": [
                    "Add null/undefined checks before accessing properties",
                    "Validate divisor is not zero",
                    "Add recursion depth limit or convert to iteration",
                    "Check array bounds before access",
                    "Optimize memory usage, fix memory leaks"
                ]
            }
        },
        "LOGIC": {
            "code": 16,
            "humanReadable": {
                "what": "Business logic violations, invariant failures",
                "when": "During execution - business rules or invariants violated",
                "why": "Invalid state transition, precondition not met, postcondition violated, invariant broken",
                "realWorldAnalogy": "เหมือนทำสิ่งที่ไม่สมเหตุสมผล - ถอนเงินมากกว่ายอดคงเหลือ, ยกเลิกออเดอร์ที่ส่งแล้ว",
                "commonScenarios": [
                    "State transition invalid (e.g., cancel shipped order)",
                    "Precondition not satisfied (e.g., approve without review)",
                    "Invariant violated (e.g., negative balance)",
                    "Business rule broken (e.g., exceeded quota)",
                    "Concurrent modification conflict"
                ],
                "howToFix": [
                    "Check current state before transition",
                    "Validate preconditions are met",
                    "Add assertions for invariants",
                    "Implement proper state machine",
                    "Handle concurrent access with locks/transactions"
                ]
            }
        },
        "CONFIGURATION": {
            "code": 32,
            "humanReadable": {
                "what": "Invalid or missing configuration, setup errors",
                "when": "During initialization - configuration not found or invalid",
                "why": "Config file missing, invalid values, required settings not set, parse error",
                "realWorldAnalogy": "เหมือนคู่มือหาย - ไม่รู้ว่าจะตั้งค่าอย่างไร, ตั้งค่าผิด, ไฟล์คู่มือเสีย",
                "commonScenarios": [
                    "Configuration file not found",
                    "Invalid configuration value (e.g., port = 'abc')",
                    "Required setting missing (e.g., API key)",
                    "Configuration file parse error (invalid JSON/YAML)",
                    "Environment variable not set"
                ],
                "howToFix": [
                    "Create configuration file if missing",
                    "Verify configuration values are correct type/format",
                    "Set all required configuration fields",
                    "Validate configuration file syntax",
                    "Set required environment variables"
                ]
            }
        },
        "PERMISSION": {
            "code": 64,
            "humanReadable": {
                "what": "Access denied, insufficient privileges, authentication failures",
                "when": "During access control checks - user lacks required permission",
                "why": "Not authenticated, insufficient role/permissions, IP blocked, resource forbidden",
                "realWorldAnalogy": "เหมือนประตูล็อค - ไม่มีกุญแจ, บัตรหมดอายุ, ไม่ได้รับอนุญาต",
                "commonScenarios": [
                    "User not logged in - authentication required",
                    "User lacks role (e.g., admin) for operation",
                    "File permission denied - cannot read/write",
                    "API key invalid or expired",
                    "IP address blocked by firewall"
                ],
                "howToFix": [
                    "Authenticate with valid credentials",
                    "Request required role/permission from admin",
                    "Fix file system permissions (chmod/chown)",
                    "Renew or regenerate API key",
                    "Whitelist IP address in firewall"
                ]
            }
        },
        "RESOURCE": {
            "code": 128,
            "humanReadable": {
                "what": "Resource not found, unavailable, or exhausted",
                "when": "During resource access - resource doesn't exist or can't be acquired",
                "why": "File/URL not found, server unavailable, memory/disk exhausted, quota exceeded",
                "realWorldAnalogy": "เหมือนของหมด - ไฟล์ไม่มี, ของหมดสต็อก, พื้นที่เต็ม",
                "commonScenarios": [
                    "File not found at specified path",
                    "URL returns 404 Not Found",
                    "Memory exhausted - out of RAM",
                    "Disk full - no space left",
                    "Connection pool exhausted - no available connections"
                ],
                "howToFix": [
                    "Verify file/resource exists at path",
                    "Check URL is correct and accessible",
                    "Free up memory - fix memory leaks",
                    "Free disk space - delete unused files",
                    "Increase connection pool size or close unused connections"
                ]
            }
        },
        "TIMEOUT": {
            "code": 256,
            "humanReadable": {
                "what": "Operation timeout, deadline exceeded",
                "when": "During long-running operation - time limit exceeded",
                "why": "Operation too slow, network latency, deadlock, infinite loop",
                "realWorldAnalogy": "เหมือนรอนาน - คอยจนหมดเวลา, ติดรถจนสาย",
                "commonScenarios": [
                    "HTTP request timeout - server not responding",
                    "Database query timeout - query too slow",
                    "Operation deadline exceeded - took too long",
                    "Deadlock detected - transactions waiting for each other",
                    "Lock acquisition timeout - resource locked too long"
                ],
                "howToFix": [
                    "Increase timeout limit if operation legitimately needs more time",
                    "Optimize operation performance (better algorithm, indexing, caching)",
                    "Check network connectivity and latency",
                    "Fix deadlocks - proper lock ordering",
                    "Break operation into smaller chunks with progress tracking"
                ]
            }
        },
        "INTEGRITY": {
            "code": 512,
            "humanReadable": {
                "what": "Data integrity violations, corruption, checksum failures",
                "when": "During data verification - data corrupted or inconsistent",
                "why": "File corruption, checksum mismatch, database constraint violated, concurrent modification",
                "realWorldAnalogy": "เหมือนของเสีย - ไฟล์เสีย, ข้อมูลผิดเพี้ยน, เช็คซัมไม่ตรง",
                "commonScenarios": [
                    "File corrupted - checksum mismatch",
                    "Database unique constraint violated (duplicate key)",
                    "Foreign key constraint violated (referential integrity)",
                    "Data inconsistency detected between related records",
                    "Version conflict - concurrent modification"
                ],
                "howToFix": [
                    "Restore corrupted file from backup",
                    "Verify checksum after download/transfer",
                    "Fix duplicate key violations in database",
                    "Ensure foreign key references exist",
                    "Use optimistic locking to handle concurrent updates"
                ]
            }
        }
    },

    "__section_03": "══════════════════════════════════════════════════════════════════════════════",
    "__section_03_number": "03",
    "__section_03_name": "severities",
    "__section_03_title": "【SECTION 03】Severity Catalog - Human-Readable Severity Descriptions",
    "__section_03_language": "Binary Error Catalog",
    "__section_03_total_items": 8,
    "__section_03_description": "คำอธิบายแบบมนุษย์อ่านสำหรับ Binary Error Severities - ระดับความรุนแรง",
    "__section_03_purpose": "อธิบายว่า severity แต่ละระดับ ใช้เมื่อไร, ควร handle อย่างไร, impact อะไร",
    "__section_03_responsibility": "ให้ developer เข้าใจว่า error แต่ละระดับ มีความรุนแรงเท่าไร และควรทำอย่างไร",
    "__section_03_used_by": [
        "BinaryErrorParser.shouldThrowError()",
        "BinaryErrorParser.renderHumanReadable()"
    ],
    "__section_03_notes": "Severity codes (1, 2, 4, 8, 16, 32, 64, 128) ตรงกับ binary-error.grammar.js Section 03 เป๊ะ",
    "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",

    "severities": {
        "TRACE": {
            "code": 1,
            "humanReadable": {
                "level": "TRACE - รายละเอียดสุด",
                "when": "Every small step - token processed, character read, position updated",
                "purpose": "Debugging ระดับ micro - เห็นทุกขั้นตอนย่อยๆ",
                "shouldThrow": false,
                "shouldLog": true,
                "impact": "No impact - information only for deep debugging",
                "example": "Token 1245: KEYWORD 'const' at line 10, column 5, charCode 99",
                "useCase": "Debug tokenizer, trace parser state step-by-step",
                "logDestination": "logs/telemetry/trace.log"
            }
        },
        "DEBUG": {
            "code": 2,
            "humanReadable": {
                "level": "DEBUG - ข้อมูล debug",
                "when": "Development milestones - grammar lookup, cache hit/miss, performance metrics",
                "purpose": "Debugging และ development - เห็น internal operation",
                "shouldThrow": false,
                "shouldLog": true,
                "impact": "No impact - development information only",
                "example": "Grammar lookup: operator '+' found in cache (hit rate 95%)",
                "useCase": "Debug performance, cache behavior, internal state",
                "logDestination": "logs/telemetry/debug.log"
            }
        },
        "INFO": {
            "code": 4,
            "humanReadable": {
                "level": "INFO - ข้อมูลปกติ",
                "when": "Normal operation milestones - file loaded, parsing completed, configuration initialized",
                "purpose": "Information about successful operations",
                "shouldThrow": false,
                "shouldLog": true,
                "impact": "No impact - success notification",
                "example": "Grammar 'javascript.grammar.js' loaded successfully (250 operators, 50 keywords)",
                "useCase": "Track system operation, audit trail, success confirmation",
                "logDestination": "logs/telemetry/info.log"
            }
        },
        "WARNING": {
            "code": 8,
            "humanReadable": {
                "level": "WARNING - คำเตือน",
                "when": "Potential issues - deprecated syntax, performance degradation, version mismatch",
                "purpose": "Warn about issues that don't break functionality but should be addressed",
                "shouldThrow": false,
                "shouldLog": true,
                "impact": "Low impact - system works but not optimal",
                "example": "Using deprecated 'var' keyword, consider 'let' or 'const' (ES6+)",
                "useCase": "Deprecation warnings, performance alerts, best practice violations",
                "logDestination": "logs/errors/warnings.log"
            }
        },
        "ERROR": {
            "code": 16,
            "humanReadable": {
                "level": "ERROR - ข้อผิดพลาด",
                "when": "User errors - syntax errors in source code, validation failures, recoverable errors",
                "purpose": "Report errors that prevent operation but system can continue",
                "shouldThrow": false,
                "shouldLog": true,
                "impact": "Medium impact - operation failed but system stable, can retry",
                "example": "SyntaxError: Unexpected token '=' at line 5, column 7 (source code error)",
                "useCase": "User syntax errors, validation failures, recoverable runtime errors",
                "logDestination": "logs/errors/syntax-errors.log"
            }
        },
        "CRITICAL": {
            "code": 32,
            "humanReadable": {
                "level": "CRITICAL - วิกฤต",
                "when": "System errors - grammar corruption, configuration missing, system integrity failure",
                "purpose": "Report critical failures that prevent system from working correctly",
                "shouldThrow": true,
                "shouldLog": true,
                "impact": "High impact - system cannot function, must throw and stop",
                "example": "CRITICAL: Grammar section 'operators' missing - parser cannot tokenize (SYSTEM error)",
                "useCase": "Grammar corruption, missing system files, configuration errors",
                "logDestination": "logs/errors/critical.log"
            }
        },
        "FATAL": {
            "code": 64,
            "humanReadable": {
                "level": "FATAL - ร้ายแรงสุด",
                "when": "System cannot continue - corrupted state, memory exhausted, unrecoverable failure",
                "purpose": "Report fatal errors requiring immediate system shutdown",
                "shouldThrow": true,
                "shouldLog": true,
                "impact": "Severe impact - system must exit immediately, no recovery possible",
                "example": "FATAL: Grammar file corrupted, checksum mismatch - system halted",
                "useCase": "File corruption, memory exhaustion, system crash, data loss",
                "logDestination": "logs/errors/fatal.log"
            }
        },
        "EMERGENCY": {
            "code": 128,
            "humanReadable": {
                "level": "EMERGENCY - ฉุกเฉิน",
                "when": "Security breach, data corruption, system compromised",
                "purpose": "Alert about security incidents or data integrity violations requiring immediate attention",
                "shouldThrow": true,
                "shouldLog": true,
                "impact": "Critical impact - security/integrity violated, immediate action required",
                "example": "EMERGENCY: Grammar tampering detected - potential security breach",
                "useCase": "Security violations, malicious activity, data tampering, system compromise",
                "logDestination": "logs/errors/security.log"
            }
        }
    },

    "__section_04": "══════════════════════════════════════════════════════════════════════════════",
    "__section_04_number": "04",
    "__section_04_name": "sources",
    "__section_04_title": "【SECTION 04】Source Catalog - Human-Readable Source Descriptions",
    "__section_04_language": "Binary Error Catalog",
    "__section_04_total_items": 8,
    "__section_04_description": "คำอธิบายแบบมนุษย์อ่านสำหรับ Binary Error Sources - แหล่งที่มาของ error",
    "__section_04_purpose": "อธิบายว่า source แต่ละตัว คือใคร, รับผิดชอบอะไร, error จากที่นี่แก้ไขอย่างไร",
    "__section_04_responsibility": "ให้ developer เข้าใจว่า error มาจากส่วนไหน และใครควรรับผิดชอบแก้ไข",
    "__section_04_used_by": [
        "BinaryErrorParser.renderHumanReadable()",
        "Error Accountability Tracking"
    ],
    "__section_04_notes": "Source codes (1, 2, 4, 8, 16, 32, 64, 128) ตรงกับ binary-error.grammar.js Section 04 เป๊ะ",
    "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",

    "sources": {
        "SYSTEM": {
            "code": 1,
            "humanReadable": {
                "who": "Internal System Code",
                "what": "Errors from system internals - programming bugs, assertion failures, invariant violations",
                "when": "Deep inside system code, not user-facing operations",
                "accountability": "Development Team - system developers must fix",
                "responsibility": "Fix system code bugs, add defensive programming, validate internal state",
                "shouldAlert": true,
                "requiresStackTrace": true,
                "examples": [
                    "Assertion failed: Internal state corruption",
                    "Unexpected null in system module",
                    "Invariant violation in core algorithm"
                ],
                "howToFix": "Debug system code, add unit tests, fix bugs in codebase"
            }
        },
        "USER": {
            "code": 2,
            "humanReadable": {
                "who": "End User Input",
                "what": "Errors from user input - syntax errors in code, validation failures, invalid data",
                "when": "User writes code with syntax errors or provides invalid input",
                "accountability": "End User - user must fix their code/input",
                "responsibility": "Fix source code syntax, provide valid input data",
                "shouldAlert": false,
                "requiresStackTrace": false,
                "examples": [
                    "SyntaxError in user's source code",
                    "Validation failure in user configuration",
                    "Invalid format in user input"
                ],
                "howToFix": "User fixes their code/input based on error message"
            }
        },
        "EXTERNAL": {
            "code": 4,
            "humanReadable": {
                "who": "External System/Service",
                "what": "Errors from external systems - API failures, network errors, third-party service issues",
                "when": "Calling external API, network operations, third-party integrations",
                "accountability": "External Service - third-party provider responsible",
                "responsibility": "Retry with exponential backoff, implement circuit breaker, failover to backup",
                "shouldAlert": true,
                "requiresStackTrace": false,
                "examples": [
                    "API returns 500 Internal Server Error",
                    "Network timeout connecting to external service",
                    "Third-party service unavailable"
                ],
                "howToFix": "Retry operation, check external service status, contact third-party support"
            }
        },
        "PARSER": {
            "code": 8,
            "humanReadable": {
                "who": "Parser/Tokenizer Component",
                "what": "Errors from parser - grammar undefined elements, tokenization failures, parsing errors",
                "when": "During tokenization and parsing operations",
                "accountability": "Grammar Definition - grammar may be incomplete or corrupted",
                "responsibility": "Update grammar definition, fix grammar file, validate grammar completeness",
                "shouldAlert": true,
                "requiresStackTrace": true,
                "examples": [
                    "Grammar operator undefined",
                    "Grammar section missing",
                    "Tokenization failure"
                ],
                "howToFix": "Update grammar file to include missing elements, validate grammar integrity"
            }
        },
        "VALIDATOR": {
            "code": 16,
            "humanReadable": {
                "who": "Validator Component",
                "what": "Errors from validation - schema violations, constraint failures, invalid data format",
                "when": "During schema validation, data validation, constraint checking",
                "accountability": "Schema Definition - schema may be too strict or user input invalid",
                "responsibility": "Adjust validation rules OR user provides valid data",
                "shouldAlert": false,
                "requiresStackTrace": false,
                "examples": [
                    "Required field missing",
                    "Invalid email format",
                    "Value out of range"
                ],
                "howToFix": "User provides valid data OR adjust schema validation rules"
            }
        },
        "RUNTIME": {
            "code": 32,
            "humanReadable": {
                "who": "Runtime Execution Environment",
                "what": "Errors during runtime execution - null references, resource exhaustion, execution failures",
                "when": "During code execution, runtime evaluation, dynamic operations",
                "accountability": "Runtime Environment - may be code bug or environment issue",
                "responsibility": "Fix code bugs, handle edge cases, optimize resource usage",
                "shouldAlert": true,
                "requiresStackTrace": true,
                "examples": [
                    "Null reference exception",
                    "Out of memory",
                    "Stack overflow"
                ],
                "howToFix": "Add null checks, optimize memory usage, fix infinite loops"
            }
        },
        "MIDDLEWARE": {
            "code": 64,
            "humanReadable": {
                "who": "Middleware Layer",
                "what": "Errors from middleware - request processing failures, validation errors, transformation errors",
                "when": "During middleware processing, request/response transformation",
                "accountability": "Middleware Configuration - configuration may be incorrect",
                "responsibility": "Fix middleware configuration, update middleware logic",
                "shouldAlert": false,
                "requiresStackTrace": false,
                "examples": [
                    "Middleware validation failed",
                    "Request transformation error",
                    "Middleware timeout"
                ],
                "howToFix": "Check middleware configuration, update middleware logic, verify request format"
            }
        },
        "PLUGIN": {
            "code": 128,
            "humanReadable": {
                "who": "Plugin/Extension",
                "what": "Errors from plugins - extension failures, plugin crashes, third-party code errors",
                "when": "During plugin execution, extension loading, plugin lifecycle events",
                "accountability": "Plugin Author - third-party plugin developer responsible",
                "responsibility": "Fix plugin code, update plugin, disable problematic plugin",
                "shouldAlert": false,
                "requiresStackTrace": true,
                "examples": [
                    "Plugin threw unhandled exception",
                    "Extension initialization failed",
                    "Plugin compatibility issue"
                ],
                "howToFix": "Update plugin to latest version, contact plugin author, disable plugin"
            }
        }
    }
};

export default binaryErrorCatalog;
