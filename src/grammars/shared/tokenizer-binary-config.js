// Tokenizer Binary Config - ES Module
// Auto-generated from tokenizer-binary-config.json
// Binary-First Architecture: Binary Constants as Code

export const tokenizerBinaryConfig = {
  "__comment_header": "══════════════════════════════════════════════════════════════════════════════",
  "__comment_title": "Binary Flag Configuration for Tokenizer System",
  "__comment_subtitle": "Pure Mathematical Character Classification - NO_HARDCODE Compliance",
  "__comment_footer": "══════════════════════════════════════════════════════════════════════════════",
  "description": "Binary Flag Configuration for Tokenizer System",
  "version": "2.0.0",
  "author": "Chahua Development Co., Ltd.",
  "repository": "https://github.com/chahuadev-com/Chahuadev-Sentinel.git",
  "__section_01": "══════════════════════════════════════════════════════════════════════════════",
  "__section_01_number": "01",
  "__section_01_title": "【SECTION 01】Character Classification Flags (5-bit Extended System)",
  "__section_01_languages": [
    "All Languages"
  ],
  "__section_01_description": "Unicode Standard Character Classification - Mathematical Binary Flags",
  "__section_01_purpose": "กำหนด binary flags สำหรับจำแนกประเภทของตัวอักษรแบบคณิตศาสตร์ ใช้ระบบ 5-bit เพื่อแยกประเภท LETTER, DIGIT, WHITESPACE, OPERATOR, PUNCTUATION",
  "__section_01_responsibility": "ให้ tokenizer สามารถ classify characters ได้อย่างรวดเร็วผ่าน bitwise operations แทนการใช้ string comparison",
  "__section_01_used_by": [
    "UniversalCharacterClassifier",
    "PureBinaryTokenizer"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "characterFlags": {
    "description": "4-bit system for character classification (Unicode Standard)",
    "bitSystem": "5-bit extended system for comprehensive character classification",
    "totalBits": 5,
    "maxValue": 31,
    "flags": {
      "LETTER": {
        "bit": 0,
        "value": 1,
        "binary": "0b00001",
        "hex": "0x01",
        "description": "A-Z, a-z (Unicode: 65-90, 97-122)",
        "examples": [
          "a",
          "Z",
          "m"
        ],
        "usage": "Identifier start and continuation"
      },
      "DIGIT": {
        "bit": 1,
        "value": 2,
        "binary": "0b00010",
        "hex": "0x02",
        "description": "0-9 (Unicode: 48-57)",
        "examples": [
          "0",
          "5",
          "9"
        ],
        "usage": "Number literals and identifier continuation"
      },
      "WHITESPACE": {
        "bit": 2,
        "value": 4,
        "binary": "0b00100",
        "hex": "0x04",
        "description": "Space=32, Tab=9, LF=10, CR=13, VT=11, FF=12",
        "examples": [
          " ",
          "\\t",
          "\\n",
          "\\r"
        ],
        "usage": "Token separation and formatting"
      },
      "OPERATOR": {
        "bit": 3,
        "value": 8,
        "binary": "0b01000",
        "hex": "0x08",
        "description": "Operator symbols: + - * / % < > = ! & | ^ ~ ? :",
        "examples": [
          "+",
          "=",
          "<",
          "&"
        ],
        "usage": "Mathematical and logical operations"
      },
      "PUNCTUATION": {
        "bit": 4,
        "value": 16,
        "binary": "0b10000",
        "hex": "0x10",
        "description": "Punctuation: ( ) [ ] { } , ; . @ # $ ` ' \"",
        "examples": [
          "(",
          "{",
          ",",
          ";"
        ],
        "usage": "Code structure and string delimiters"
      }
    },
    "combinations": {
      "ALPHANUMERIC": {
        "value": 3,
        "binary": "0b00011",
        "description": "LETTER | DIGIT",
        "usage": "Valid identifier characters"
      },
      "IDENTIFIER_START": {
        "value": 1,
        "binary": "0b00001",
        "description": "LETTER only (plus _ and $ from unicodeRanges)",
        "usage": "Valid first character of identifier"
      },
      "IDENTIFIER_CONTINUE": {
        "value": 3,
        "binary": "0b00011",
        "description": "LETTER | DIGIT (plus _ and $ from unicodeRanges)",
        "usage": "Valid continuation character of identifier"
      },
      "NUMBER_START": {
        "value": 2,
        "binary": "0b00010",
        "description": "DIGIT only",
        "usage": "Valid first character of number literal"
      },
      "SYMBOL": {
        "value": 24,
        "binary": "0b11000",
        "description": "OPERATOR | PUNCTUATION",
        "usage": "All non-alphanumeric printable ASCII"
      }
    },
    "unicodeCategories": {
      "description": "Extended Unicode character categories beyond ASCII",
      "categories": {
        "UNICODE_LETTER": {
          "ranges": "U+0080 to U+10FFFF",
          "examples": [
            "á",
            "ñ",
            "文",
            "字",
            ""
          ],
          "note": "Requires ALLOW_UNICODE_IDENTIFIERS=true in parsingRules"
        },
        "UNICODE_DIGIT": {
          "ranges": "U+0660-U+0669 (Arabic), U+06F0-U+06F9 (Persian), etc.",
          "examples": [
            "٠",
            "٩"
          ],
          "note": "Extended digit systems from non-Latin scripts"
        },
        "UNICODE_SPACE": {
          "ranges": "U+00A0 (NBSP), U+2028 (Line Separator), U+2029 (Paragraph Separator)",
          "examples": [
            " ",
            " ",
            " "
          ],
          "note": "Non-ASCII whitespace characters"
        },
        "ZERO_WIDTH": {
          "codes": [
            8203,
            8204,
            8205,
            65279
          ],
          "names": [
            "ZWSP",
            "ZWNJ",
            "ZWJ",
            "BOM"
          ],
          "note": "Invisible characters that affect text rendering"
        }
      }
    },
    "specialCases": {
      "UNDERSCORE": {
        "code": 95,
        "char": "_",
        "classification": "Special - Acts as LETTER for identifiers, DIGIT for numeric separators",
        "note": "Context-dependent classification"
      },
      "DOLLAR": {
        "code": 36,
        "char": "$",
        "classification": "Special - Acts as LETTER for identifiers in JavaScript/PHP",
        "note": "Language-specific identifier character"
      },
      "DOT": {
        "code": 46,
        "char": ".",
        "classification": "PUNCTUATION normally, but DIGIT context in float literals",
        "note": "Context-dependent: property access vs. decimal point"
      },
      "BACKSLASH": {
        "code": 92,
        "char": "\\",
        "classification": "OPERATOR - Escape character in strings",
        "note": "Special handling required for escape sequences"
      },
      "SLASH": {
        "code": 47,
        "char": "/",
        "classification": "OPERATOR - Division or comment/regex delimiter",
        "note": "Context-dependent: math vs. comment vs. regex"
      }
    },
    "validationRules": {
      "ASCII_RANGE": {
        "min": 0,
        "max": 127,
        "description": "Standard ASCII printable and control characters"
      },
      "EXTENDED_ASCII": {
        "min": 128,
        "max": 255,
        "description": "Extended ASCII (Latin-1 supplement)"
      },
      "UNICODE_BMP": {
        "min": 256,
        "max": 65535,
        "description": "Unicode Basic Multilingual Plane"
      },
      "UNICODE_SUPPLEMENTARY": {
        "min": 65536,
        "max": 1114111,
        "description": "Unicode Supplementary Planes (requires surrogate pairs in JavaScript)"
      }
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_title": "【SECTION 02】Token Binary Types (16-bit Extended System)",
  "__section_02_languages": [
    "All Languages"
  ],
  "__section_02_description": "Extended Token Classification - Semantic Token Categories",
  "__section_02_purpose": "กำหนด binary flags แบบ 16-bit สำหรับจำแนกประเภท token ทั้งหมด เช่น IDENTIFIER, NUMBER, KEYWORD, OPERATOR, STRING, COMMENT",
  "__section_02_responsibility": "ให้ tokenizer สามารถกำหนดประเภทของ token แต่ละตัวผ่าน binary flags เพื่อความเร็วในการ process",
  "__section_02_used_by": [
    "PureBinaryTokenizer",
    "GrammarIndex",
    "Parser"
  ],
  "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",
  "tokenBinaryTypes": {
    "description": "Extended 16-bit system for comprehensive token classification",
    "types": {
      "IDENTIFIER": {
        "bit": 0,
        "value": 1,
        "binary": "0b0000000000000001",
        "description": "Variable names, function names"
      },
      "NUMBER": {
        "bit": 1,
        "value": 2,
        "binary": "0b0000000000000010",
        "description": "Numeric literals (int, float, hex, etc.)"
      },
      "BOOLEAN": {
        "bit": 2,
        "value": 4,
        "binary": "0b0000000000000100",
        "description": "true, false"
      },
      "OPERATOR": {
        "bit": 3,
        "value": 8,
        "binary": "0b0000000000001000",
        "description": "Mathematical operators (+, -, *, /, etc.)"
      },
      "ASSIGNMENT": {
        "bit": 4,
        "value": 16,
        "binary": "0b0000000000010000",
        "description": "Assignment operators (=, +=, -=, etc.)"
      },
      "KEYWORD": {
        "bit": 5,
        "value": 32,
        "binary": "0b0000000000100000",
        "description": "Language keywords (if, else, for, etc.)"
      },
      "PUNCTUATION": {
        "bit": 6,
        "value": 64,
        "binary": "0b0000000001000000",
        "description": "Punctuation marks (,, ;, :, etc.)"
      },
      "STRING": {
        "bit": 7,
        "value": 128,
        "binary": "0b0000000010000000",
        "description": "String literals ('...', \"...\")"
      },
      "COMMENT": {
        "bit": 8,
        "value": 256,
        "binary": "0b0000000100000000",
        "description": "Comments (//, /* */)"
      },
      "REGEX": {
        "bit": 9,
        "value": 512,
        "binary": "0b0000001000000000",
        "description": "Regular expressions (/pattern/flags)"
      },
      "TEMPLATE_STRING": {
        "bit": 10,
        "value": 1024,
        "binary": "0b0000010000000000",
        "description": "Template literals (`...`)"
      },
      "NULL": {
        "bit": 11,
        "value": 2048,
        "binary": "0b0000100000000000",
        "description": "null literal"
      },
      "UNDEFINED": {
        "bit": 12,
        "value": 4096,
        "binary": "0b0001000000000000",
        "description": "undefined literal"
      },
      "EOF": {
        "bit": 13,
        "value": 8192,
        "binary": "0b0010000000000000",
        "description": "End of file marker"
      },
      "ERROR": {
        "bit": 14,
        "value": 16384,
        "binary": "0b0100000000000000",
        "description": "Error token"
      },
      "UNKNOWN": {
        "bit": 15,
        "value": 32768,
        "binary": "0b1000000000000000",
        "description": "Unknown/unrecognized token"
      }
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_title": "【SECTION 03】Unicode Character Ranges & Special Characters",
  "__section_03_languages": [
    "All Languages"
  ],
  "__section_03_description": "Character Code Ranges for Mathematical Classification - ASCII & Unicode",
  "__section_03_purpose": "กำหนด Unicode ranges และ special character codes ทั้งหมด เช่น A-Z, 0-9, operators, punctuation เพื่อใช้ในการ classify characters แบบคณิตศาสตร์",
  "__section_03_responsibility": "เก็บ character code ของทุกตัวอักษรพิเศษ ตัวเลข และ operators เพื่อให้ tokenizer ใช้ตรวจสอบแบบ mathematical comparison",
  "__section_03_used_by": [
    "UniversalCharacterClassifier",
    "NumberParser",
    "OperatorRecognizer"
  ],
  "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",
  "unicodeRanges": {
    "description": "Unicode character code ranges for classification",
    "ranges": {
      "UPPERCASE_LETTER": {
        "start": 65,
        "end": 90,
        "description": "A-Z"
      },
      "LOWERCASE_LETTER": {
        "start": 97,
        "end": 122,
        "description": "a-z"
      },
      "DIGIT": {
        "start": 48,
        "end": 57,
        "description": "0-9"
      },
      "BINARY_DIGIT": {
        "start": 48,
        "end": 49,
        "description": "Binary digits 0-1"
      },
      "OCTAL_DIGIT": {
        "start": 48,
        "end": 55,
        "description": "Octal digits 0-7"
      },
      "HEX_DIGIT_UPPERCASE": {
        "start": 65,
        "end": 70,
        "description": "Hexadecimal digits A-F"
      },
      "HEX_DIGIT_LOWERCASE": {
        "start": 97,
        "end": 102,
        "description": "Hexadecimal digits a-f"
      },
      "UNICODE_ID_START": {
        "start": 128,
        "end": 65535,
        "description": "Unicode identifier start characters (non-ASCII)"
      },
      "UNICODE_ID_CONTINUE": {
        "start": 128,
        "end": 65535,
        "description": "Unicode identifier continuation characters"
      },
      "ZERO_WIDTH_NON_JOINER": {
        "start": 8204,
        "end": 8204,
        "description": "Zero-width non-joiner (U+200C)"
      },
      "ZERO_WIDTH_JOINER": {
        "start": 8205,
        "end": 8205,
        "description": "Zero-width joiner (U+200D)"
      },
      "SPACE": {
        "code": 32,
        "description": "Space character"
      },
      "TAB": {
        "code": 9,
        "description": "Tab character"
      },
      "LINE_FEED": {
        "code": 10,
        "description": "Line feed (\\n)"
      },
      "CARRIAGE_RETURN": {
        "code": 13,
        "description": "Carriage return (\\r)"
      },
      "VERTICAL_TAB": {
        "code": 11,
        "description": "Vertical tab (\\v)"
      },
      "FORM_FEED": {
        "code": 12,
        "description": "Form feed (\\f)"
      },
      "NULL": {
        "code": 0,
        "description": "Null character"
      },
      "BACKSPACE": {
        "code": 8,
        "description": "Backspace character"
      },
      "BELL": {
        "code": 7,
        "description": "Bell/Alert character"
      },
      "ESCAPE": {
        "code": 27,
        "description": "Escape character"
      },
      "NO_BREAK_SPACE": {
        "code": 160,
        "description": "Non-breaking space (U+00A0)"
      },
      "LINE_SEPARATOR": {
        "code": 8232,
        "description": "Line separator (U+2028)"
      },
      "PARAGRAPH_SEPARATOR": {
        "code": 8233,
        "description": "Paragraph separator (U+2029)"
      },
      "BYTE_ORDER_MARK": {
        "code": 65279,
        "description": "Byte Order Mark / Zero Width No-Break Space (U+FEFF)"
      },
      "BACKSLASH": {
        "code": 92,
        "description": "Backslash (\\) - Escape character"
      },
      "UNDERSCORE": {
        "code": 95,
        "description": "Underscore (_)"
      },
      "DOLLAR": {
        "code": 36,
        "description": "Dollar sign ($)"
      },
      "DOT": {
        "code": 46,
        "description": "Dot/Period (.)"
      },
      "LETTER_E_UPPERCASE": {
        "code": 69,
        "description": "Letter E (for scientific notation)"
      },
      "LETTER_E_LOWERCASE": {
        "code": 101,
        "description": "Letter e (for scientific notation)"
      },
      "LETTER_B_UPPERCASE": {
        "code": 66,
        "description": "Letter B (for binary literals: 0B)"
      },
      "LETTER_B_LOWERCASE": {
        "code": 98,
        "description": "Letter b (for binary literals: 0b)"
      },
      "LETTER_O_UPPERCASE": {
        "code": 79,
        "description": "Letter O (for octal literals: 0O)"
      },
      "LETTER_O_LOWERCASE": {
        "code": 111,
        "description": "Letter o (for octal literals: 0o)"
      },
      "LETTER_X_UPPERCASE": {
        "code": 88,
        "description": "Letter X (for hexadecimal literals: 0X)"
      },
      "LETTER_X_LOWERCASE": {
        "code": 120,
        "description": "Letter x (for hexadecimal literals: 0x)"
      },
      "LETTER_N_LOWERCASE": {
        "code": 110,
        "description": "Letter n (for BigInt suffix: 123n)"
      },
      "LETTER_L_UPPERCASE": {
        "code": 76,
        "description": "Letter L (for Long suffix: 123L)"
      },
      "LETTER_L_LOWERCASE": {
        "code": 108,
        "description": "Letter l (for Long suffix: 123l)"
      },
      "LETTER_F_UPPERCASE": {
        "code": 70,
        "description": "Letter F (for Float suffix: 1.23F)"
      },
      "LETTER_F_LOWERCASE": {
        "code": 102,
        "description": "Letter f (for Float suffix: 1.23f)"
      },
      "LETTER_D_UPPERCASE": {
        "code": 68,
        "description": "Letter D (for Double suffix: 1.23D)"
      },
      "LETTER_D_LOWERCASE": {
        "code": 100,
        "description": "Letter d (for Double suffix: 1.23d)"
      },
      "LETTER_U_UPPERCASE": {
        "code": 85,
        "description": "Letter U (for Unsigned suffix: 123U)"
      },
      "LETTER_U_LOWERCASE": {
        "code": 117,
        "description": "Letter u (for Unsigned suffix: 123u)"
      },
      "LETTER_P_UPPERCASE": {
        "code": 80,
        "description": "Letter P (for hexadecimal float exponent: 0x1.2P3)"
      },
      "LETTER_P_LOWERCASE": {
        "code": 112,
        "description": "Letter p (for hexadecimal float exponent: 0x1.2p3)"
      },
      "DIGIT_ZERO": {
        "code": 48,
        "description": "Digit 0 (prefix for binary/octal/hex)"
      },
      "PLUS": {
        "code": 43,
        "description": "Plus sign (+)"
      },
      "MINUS": {
        "code": 45,
        "description": "Minus/Hyphen (-)"
      },
      "ASTERISK": {
        "code": 42,
        "description": "Asterisk (*)"
      },
      "SLASH": {
        "code": 47,
        "description": "Forward slash (/)"
      },
      "PERCENT": {
        "code": 37,
        "description": "Percent sign (%)"
      },
      "AMPERSAND": {
        "code": 38,
        "description": "Ampersand (&)"
      },
      "PIPE": {
        "code": 124,
        "description": "Vertical bar (|)"
      },
      "CARET": {
        "code": 94,
        "description": "Caret (^)"
      },
      "TILDE": {
        "code": 126,
        "description": "Tilde (~)"
      },
      "LESS_THAN": {
        "code": 60,
        "description": "Less than (<)"
      },
      "GREATER_THAN": {
        "code": 62,
        "description": "Greater than (>)"
      },
      "EQUALS": {
        "code": 61,
        "description": "Equals sign (=)"
      },
      "EXCLAMATION": {
        "code": 33,
        "description": "Exclamation mark (!)"
      },
      "QUESTION": {
        "code": 63,
        "description": "Question mark (?)"
      },
      "COLON": {
        "code": 58,
        "description": "Colon (:)"
      },
      "SEMICOLON": {
        "code": 59,
        "description": "Semicolon (;)"
      },
      "COMMA": {
        "code": 44,
        "description": "Comma (,)"
      },
      "LEFT_PAREN": {
        "code": 40,
        "description": "Left parenthesis (()"
      },
      "RIGHT_PAREN": {
        "code": 41,
        "description": "Right parenthesis ())"
      },
      "LEFT_BRACKET": {
        "code": 91,
        "description": "Left square bracket ([)"
      },
      "RIGHT_BRACKET": {
        "code": 93,
        "description": "Right square bracket (])"
      },
      "LEFT_BRACE": {
        "code": 123,
        "description": "Left curly brace ({)"
      },
      "RIGHT_BRACE": {
        "code": 125,
        "description": "Right curly brace (})"
      },
      "SINGLE_QUOTE": {
        "code": 39,
        "description": "Single quote (')"
      },
      "DOUBLE_QUOTE": {
        "code": 34,
        "description": "Double quote (\")"
      },
      "BACKTICK": {
        "code": 96,
        "description": "Backtick (`)"
      },
      "AT_SIGN": {
        "code": 64,
        "description": "At sign (@)"
      },
      "HASH": {
        "code": 35,
        "description": "Hash/Pound sign (#)"
      },
      "ASCII_BOUNDARY": {
        "code": 128,
        "description": "ASCII boundary (0-127 = ASCII, 128+ = Extended)"
      }
    }
  },
  "unicodeIdentifierConfig": {
    "description": "Unicode identifier configuration for non-ASCII characters",
    "ranges": [
      {
        "name": "Thai",
        "start": 3584,
        "end": 3711,
        "description": "Thai script block (U+0E00-U+0E7F)"
      }
    ],
    "includeCodes": [],
    "excludeCodes": [],
    "whitespaceCodes": [],
    "autoConfig": {
      "enabled": true,
      "pathSegmentsFromModule": [
        "..",
        "..",
        "..",
        "configs",
        "unicode",
        "unicode-identifier-ranges.json"
      ],
      "categories": {
        "include": [
          "ID_Start",
          "ID_Continue"
        ],
        "exclude": []
      },
      "minCodePoint": 0,
      "maxCodePoint": 1114111
    }
  },
  "__section_04": "══════════════════════════════════════════════════════════════════════════════",
  "__section_04_number": "04",
  "__section_04_title": "【SECTION 04】Token Type String Literals",
  "__section_04_languages": [
    "All Languages"
  ],
  "__section_04_description": "NO_HARDCODE Compliance - All Token Type Names",
  "__section_04_purpose": "กำหนดชื่อ string literals สำหรับ token types ทั้งหมด เช่น 'COMMENT', 'STRING', 'KEYWORD' เพื่อป้องกัน hardcoded strings ในโค้ด",
  "__section_04_responsibility": "เก็บชื่อ token types ที่จะใช้ในการ output และ debugging เพื่อให้สามารถแก้ไขได้จาก config เท่านั้น",
  "__section_04_used_by": [
    "TokenSerializer",
    "DebugLogger",
    "ErrorReporter"
  ],
  "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",
  "tokenTypeStrings": {
    "description": "String literals for token types - NO_HARDCODE compliance",
    "types": {
      "COMMENT": "COMMENT",
      "STRING": "STRING",
      "KEYWORD": "KEYWORD",
      "IDENTIFIER": "IDENTIFIER",
      "NUMBER": "NUMBER",
      "NUMBER_BINARY": "NUMBER_BINARY",
      "NUMBER_OCTAL": "NUMBER_OCTAL",
      "NUMBER_HEXADECIMAL": "NUMBER_HEXADECIMAL",
      "NUMBER_DECIMAL": "NUMBER_DECIMAL",
      "NUMBER_FLOAT": "NUMBER_FLOAT",
      "NUMBER_SCIENTIFIC": "NUMBER_SCIENTIFIC",
      "NUMBER_BIGINT": "NUMBER_BIGINT",
      "OPERATOR": "OPERATOR",
      "PUNCTUATION": "PUNCTUATION",
      "REGEX": "REGEX",
      "TEMPLATE_STRING": "TEMPLATE_STRING",
      "BOOLEAN": "BOOLEAN",
      "NULL": "NULL",
      "UNDEFINED": "UNDEFINED",
      "EOF": "EOF",
      "ERROR": "ERROR",
      "UNKNOWN": "UNKNOWN"
    }
  },
  "__section_05": "══════════════════════════════════════════════════════════════════════════════",
  "__section_05_number": "05",
  "__section_05_title": "【SECTION 05】Error Message Templates",
  "__section_05_languages": [
    "All Languages"
  ],
  "__section_05_description": "NO_HARDCODE Compliance - All Error Messages Externalized",
  "__section_05_purpose": "กำหนด error message templates ทั้งหมด เช่น INVALID_BINARY_DIGIT, UNKNOWN_CHARACTER เพื่อให้แก้ไขข้อความ error ได้จาก config",
  "__section_05_responsibility": "เก็บ template ของ error messages พร้อม placeholders ({digit}, {position}) สำหรับ dynamic error reporting",
  "__section_05_used_by": [
    "ErrorReporter",
    "NumberParser",
    "TokenValidator"
  ],
  "__section_05_footer": "══════════════════════════════════════════════════════════════════════════════",
  "errorMessages": {
    "description": "Error message templates - NO_HARDCODE compliance",
    "templates": {
      "BRAIN_REQUIRED": "PureBinaryTokenizer requires Brain (GrammarIndex)",
      "EXPECTED_PATTERN": "Expected \"{pattern}\" at position {position}",
      "UNKNOWN_CHARACTER": "Unknown character at position {position}: \"{char}\"",
      "UNKNOWN_OPERATOR": "Unknown operator/punctuation at {position}: \"{char}\"",
      "CONFIG_LOAD_FAILED": "CRITICAL: Failed to load tokenizer configuration from {path}: {error}",
      "INVALID_BINARY_DIGIT": "Invalid digit '{digit}' in binary literal at position {position}. Binary literals can only contain 0 and 1.",
      "INVALID_OCTAL_DIGIT": "Invalid digit '{digit}' in octal literal at position {position}. Octal literals can only contain 0-7.",
      "INVALID_HEX_DIGIT": "Invalid character '{char}' in hexadecimal literal at position {position}. Hexadecimal literals can only contain 0-9, A-F, a-f.",
      "LEADING_UNDERSCORE": "Numeric separator '_' cannot appear at the beginning of a number at position {position}",
      "TRAILING_UNDERSCORE": "Numeric separator '_' cannot appear at the end of a number at position {position}",
      "CONSECUTIVE_UNDERSCORES": "Consecutive numeric separators '__' are not allowed at position {position}",
      "UNDERSCORE_AFTER_PREFIX": "Numeric separator '_' cannot appear immediately after number prefix at position {position}",
      "MULTIPLE_DOTS": "Multiple decimal points in number literal at position {position}",
      "INVALID_EXPONENT": "Invalid exponent format in scientific notation at position {position}",
      "EMPTY_EXPONENT": "Exponent in scientific notation cannot be empty at position {position}",
      "NUMBER_TOO_LONG": "Number literal exceeds maximum length ({maxLength}) at position {position}",
      "INVALID_NUMBER_SUFFIX": "Invalid number suffix '{suffix}' at position {position}",
      "LEGACY_OCTAL_STRICT": "Legacy octal literals (leading zero without 'o') are not allowed in strict mode at position {position}",
      "BINARY_OVERFLOW": "Binary literal at position {position} exceeds safe integer range",
      "HEX_OVERFLOW": "Hexadecimal literal at position {position} exceeds safe integer range"
    }
  },
  "__section_06": "══════════════════════════════════════════════════════════════════════════════",
  "__section_06_number": "06",
  "__section_06_title": "【SECTION 06】Parsing Rules Configuration",
  "__section_06_languages": [
    "All Languages"
  ],
  "__section_06_description": "Token Parsing Behavior Rules - NO_HARDCODE Compliance",
  "__section_06_purpose": "กำหนดกฎการ parse tokens เช่น SKIP_WHITESPACE, CASE_SENSITIVE_KEYWORDS, MAX_TOKEN_LENGTH เพื่อควบคุม behavior ของ tokenizer",
  "__section_06_responsibility": "ควบคุมการทำงานของ tokenizer ว่าจะข้าม whitespace หรือไม่, identifiers เริ่มต้นด้วยอะไรได้บ้าง, ความยาวสูงสุดของ token",
  "__section_06_used_by": [
    "PureBinaryTokenizer",
    "IdentifierParser",
    "WhitespaceHandler"
  ],
  "__section_06_footer": "══════════════════════════════════════════════════════════════════════════════",
  "parsingRules": {
    "description": "Parsing configuration rules - NO_HARDCODE compliance",
    "rules": {
      "SKIP_WHITESPACE": true,
      "CASE_SENSITIVE_KEYWORDS": true,
      "ALLOW_UNICODE_IDENTIFIERS": true,
      "MAX_TOKEN_LENGTH": 65536,
      "MAX_NUMBER_LENGTH": 1024,
      "MAX_STRING_LENGTH": 1048576,
      "IDENTIFIER_START_CHARS": [
        "LETTER",
        "UNDERSCORE",
        "DOLLAR"
      ],
      "IDENTIFIER_CONTINUE_CHARS": [
        "LETTER",
        "DIGIT",
        "UNDERSCORE",
        "DOLLAR"
      ],
      "NUMBER_CHARS": [
        "DIGIT",
        "DOT",
        "LETTER_E_UPPERCASE",
        "LETTER_E_LOWERCASE"
      ],
      "NUMERIC_SEPARATOR": {
        "enabled": true,
        "character": "_",
        "charCode": 95,
        "description": "Numeric separator for readability (e.g., 1_000_000)"
      }
    }
  },
  "__section_07": "══════════════════════════════════════════════════════════════════════════════",
  "__section_07_number": "07",
  "__section_07_title": "【SECTION 07】Number Literal Prefixes (Binary, Octal, Hex, Decimal)",
  "__section_07_languages": [
    "JavaScript",
    "TypeScript",
    "Java",
    "Python",
    "C",
    "C++",
    "Rust",
    "Go"
  ],
  "__section_07_description": "Prefix Patterns for Different Number Bases",
  "__section_07_purpose": "กำหนด prefixes สำหรับเลขต่างฐาน เช่น 0b (binary), 0o (octal), 0x (hexadecimal) พร้อม valid digits แต่ละฐาน",
  "__section_07_responsibility": "ให้ number parser รู้ว่าเลขแต่ละฐานเริ่มต้นด้วย prefix อะไร และมี valid digits อะไรบ้าง",
  "__section_07_used_by": [
    "NumberParser",
    "LiteralRecognizer"
  ],
  "__section_07_footer": "══════════════════════════════════════════════════════════════════════════════",
  "numberLiteralPrefixes": {
    "description": "Prefixes for different number literal formats",
    "prefixes": {
      "BINARY": {
        "patterns": [
          "0b",
          "0B"
        ],
        "validDigits": [
          "0",
          "1"
        ],
        "digitRange": {
          "start": 48,
          "end": 49
        },
        "description": "Binary number literals (base 2)",
        "examples": [
          "0b1010",
          "0B1111",
          "0b1010_1010"
        ],
        "languages": [
          "JavaScript",
          "TypeScript",
          "Java",
          "Python",
          "Rust",
          "Go"
        ]
      },
      "OCTAL": {
        "patterns": [
          "0o",
          "0O",
          "0"
        ],
        "validDigits": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7"
        ],
        "digitRange": {
          "start": 48,
          "end": 55
        },
        "description": "Octal number literals (base 8)",
        "examples": [
          "0o777",
          "0O644",
          "0755"
        ],
        "languages": [
          "JavaScript",
          "TypeScript",
          "Java",
          "Python"
        ],
        "legacy": {
          "pattern": "0",
          "note": "Leading zero without 'o' is legacy octal (JavaScript strict mode forbids this)"
        }
      },
      "HEXADECIMAL": {
        "patterns": [
          "0x",
          "0X"
        ],
        "validDigits": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F"
        ],
        "digitRanges": [
          {
            "start": 48,
            "end": 57,
            "description": "0-9"
          },
          {
            "start": 65,
            "end": 70,
            "description": "A-F"
          },
          {
            "start": 97,
            "end": 102,
            "description": "a-f"
          }
        ],
        "description": "Hexadecimal number literals (base 16)",
        "examples": [
          "0xFF",
          "0xDEADBEEF",
          "0xCAFE_BABE"
        ],
        "languages": [
          "JavaScript",
          "TypeScript",
          "Java",
          "Python",
          "C",
          "C++",
          "Rust",
          "Go"
        ]
      },
      "DECIMAL": {
        "patterns": [
          ""
        ],
        "validDigits": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9"
        ],
        "digitRange": {
          "start": 48,
          "end": 57
        },
        "description": "Decimal number literals (base 10)",
        "examples": [
          "123",
          "456.789",
          "1_000_000"
        ],
        "languages": [
          "All"
        ]
      }
    }
  },
  "__section_08": "══════════════════════════════════════════════════════════════════════════════",
  "__section_08_number": "08",
  "__section_08_title": "【SECTION 08】Number Literal Suffixes (L, F, D, U, n)",
  "__section_08_languages": [
    "JavaScript",
    "TypeScript",
    "Java",
    "C",
    "C++",
    "C#"
  ],
  "__section_08_description": "Type Suffixes for Number Literals",
  "__section_08_purpose": "กำหนด suffixes สำหรับระบุประเภทของตัวเลข เช่น L (Long), F (Float), D (Double), U (Unsigned), n (BigInt)",
  "__section_08_responsibility": "ให้ number parser รู้จัก suffix แต่ละตัวและแปลงเป็น type ที่ถูกต้อง เช่น 123L เป็น Long, 3.14F เป็น Float",
  "__section_08_used_by": [
    "NumberParser",
    "TypeInferencer"
  ],
  "__section_08_footer": "══════════════════════════════════════════════════════════════════════════════",
  "numberLiteralSuffixes": {
    "description": "Suffixes for number type specification",
    "suffixes": {
      "BIGINT": {
        "character": "n",
        "charCode": 110,
        "description": "BigInt suffix for arbitrary precision integers",
        "examples": [
          "123n",
          "0b1010n",
          "0xFFn"
        ],
        "languages": [
          "JavaScript",
          "TypeScript"
        ]
      },
      "LONG": {
        "characters": [
          "L",
          "l"
        ],
        "charCodes": [
          76,
          108
        ],
        "description": "Long integer suffix",
        "examples": [
          "123L",
          "456l"
        ],
        "languages": [
          "Java",
          "C",
          "C++"
        ]
      },
      "FLOAT": {
        "characters": [
          "F",
          "f"
        ],
        "charCodes": [
          70,
          102
        ],
        "description": "Float (32-bit) suffix",
        "examples": [
          "3.14F",
          "2.71f"
        ],
        "languages": [
          "Java",
          "C",
          "C++",
          "C#"
        ]
      },
      "DOUBLE": {
        "characters": [
          "D",
          "d"
        ],
        "charCodes": [
          68,
          100
        ],
        "description": "Double (64-bit) suffix",
        "examples": [
          "3.14D",
          "2.71d"
        ],
        "languages": [
          "Java",
          "C#"
        ]
      },
      "UNSIGNED": {
        "characters": [
          "U",
          "u"
        ],
        "charCodes": [
          85,
          117
        ],
        "description": "Unsigned integer suffix",
        "examples": [
          "123U",
          "456u"
        ],
        "languages": [
          "C",
          "C++",
          "C#"
        ]
      },
      "UNSIGNED_LONG": {
        "patterns": [
          "UL",
          "ul",
          "LU",
          "lu"
        ],
        "description": "Unsigned long integer suffix",
        "examples": [
          "123UL",
          "456ul"
        ],
        "languages": [
          "C",
          "C++",
          "C#"
        ]
      }
    }
  },
  "__section_09": "══════════════════════════════════════════════════════════════════════════════",
  "__section_09_number": "09",
  "__section_09_title": "【SECTION 09】Performance Configuration",
  "__section_09_languages": [
    "All Languages"
  ],
  "__section_09_description": "Performance Tuning Parameters - NO_HARDCODE Compliance",
  "__section_09_purpose": "กำหนดค่า performance tuning เช่น INITIAL_TOKEN_ARRAY_SIZE, PATTERN_MATCH_CACHE_SIZE เพื่อ optimize ความเร็วของ tokenizer",
  "__section_09_responsibility": "ควบคุม memory allocation, caching strategy, และ optimization flags เพื่อให้ tokenizer ทำงานเร็วขึ้น",
  "__section_09_used_by": [
    "PureBinaryTokenizer",
    "TokenBuffer",
    "PatternMatcher"
  ],
  "__section_09_footer": "══════════════════════════════════════════════════════════════════════════════",
  "performanceConfig": {
    "description": "Performance tuning parameters - NO_HARDCODE compliance",
    "settings": {
      "INITIAL_TOKEN_ARRAY_SIZE": 256,
      "TOKEN_BUFFER_GROWTH_FACTOR": 1.5,
      "PATTERN_MATCH_CACHE_SIZE": 128,
      "ENABLE_FAST_PATH_OPTIMIZATION": true,
      "USE_CHARCODE_LOOKUP_TABLE": true
    }
  },
  "__section_10": "══════════════════════════════════════════════════════════════════════════════",
  "__section_10_number": "10",
  "__section_10_title": "【SECTION 10】Debug Configuration",
  "__section_10_languages": [
    "All Languages"
  ],
  "__section_10_description": "Debug and Logging Settings - NO_HARDCODE Compliance",
  "__section_10_purpose": "กำหนดการ debug และ logging เช่น ENABLE_POSITION_TRACKING, LOG_UNKNOWN_CHARACTERS เพื่อช่วยในการ troubleshoot",
  "__section_10_responsibility": "ควบคุมว่าจะ log อะไรบ้าง, track metadata อะไร, validate structure หรือไม่ เพื่อช่วย debug ปัญหา",
  "__section_10_used_by": [
    "DebugLogger",
    "PositionTracker",
    "TokenValidator"
  ],
  "__section_10_footer": "══════════════════════════════════════════════════════════════════════════════",
  "debugConfig": {
    "description": "Debug and logging configuration - NO_HARDCODE compliance",
    "settings": {
      "ENABLE_POSITION_TRACKING": true,
      "ENABLE_TOKEN_METADATA": true,
      "LOG_UNKNOWN_CHARACTERS": true,
      "LOG_BRAIN_QUERIES": false,
      "VALIDATE_TOKEN_STRUCTURE": true
    }
  },
  "__section_11": "══════════════════════════════════════════════════════════════════════════════",
  "__section_11_number": "11",
  "__section_11_title": "【SECTION 11】Compatibility Configuration",
  "__section_11_languages": [
    "All Languages"
  ],
  "__section_11_description": "Backward Compatibility Settings - NO_HARDCODE Compliance",
  "__section_11_purpose": "กำหนด backward compatibility settings เช่น aliases สำหรับชื่อเก่า, deprecated features เพื่อรองรับ legacy code",
  "__section_11_responsibility": "จัดการ compatibility กับ version เก่า ให้สามารถใช้ชื่อเก่าได้ และเตือนเมื่อใช้ deprecated features",
  "__section_11_used_by": [
    "CompatibilityLayer",
    "DeprecationWarner"
  ],
  "__section_11_footer": "══════════════════════════════════════════════════════════════════════════════",
  "compatibilityConfig": {
    "description": "Backward compatibility settings - NO_HARDCODE compliance",
    "aliases": {
      "BinaryComputationTokenizer": "PureBinaryTokenizer"
    },
    "deprecatedFeatures": {
      "OLD_BINARY_FLAG_SYSTEM": false,
      "LEGACY_TOKEN_FORMAT": false
    }
  },
  "__section_12": "══════════════════════════════════════════════════════════════════════════════",
  "__section_12_number": "12",
  "__section_12_title": "【SECTION 12】Security Configuration",
  "__section_12_languages": [
    "All Languages"
  ],
  "__section_12_description": "Security Constraints and Limits - NO_HARDCODE Compliance",
  "__section_12_purpose": "กำหนด security limits เช่น MAX_INPUT_LENGTH, MAX_NESTING_DEPTH, PREVENT_REGEX_DOS เพื่อป้องกัน DoS attacks",
  "__section_12_responsibility": "ป้องกัน security vulnerabilities โดยจำกัด input size, nesting depth, และตรวจสอบ regex patterns ที่อันตราย",
  "__section_12_used_by": [
    "SecurityValidator",
    "InputSanitizer",
    "DoSPreventer"
  ],
  "__section_12_footer": "══════════════════════════════════════════════════════════════════════════════",
  "securityConfig": {
    "description": "Security constraints - NO_HARDCODE compliance",
    "limits": {
      "MAX_INPUT_LENGTH": 10485760,
      "MAX_NESTING_DEPTH": 1000,
      "PREVENT_REGEX_DOS": true,
      "SANITIZE_ERROR_MESSAGES": true,
      "MAX_PATTERN_LENGTH": 256,
      "MAX_SAFE_INTEGER": 9007199254740991,
      "MIN_SAFE_INTEGER": -9007199254740991,
      "MAX_BINARY_DIGITS": 53,
      "MAX_OCTAL_DIGITS": 18,
      "MAX_HEX_DIGITS": 13,
      "MAX_DECIMAL_DIGITS": 16,
      "WARN_ON_PRECISION_LOSS": true,
      "STRICT_NUMBER_PARSING": false
    }
  },
  "__section_13_REMOVED": "══════════════════════════════════════════════════════════════════════════════",
  "__section_13_removal_reason": "Dumb Tokenizer, Smart Grammar - Keywords moved to grammar files",
  "__section_13_moved_to": [
    "src/grammars/javascript.grammar.js",
    "src/grammars/typescript.grammar.js",
    "src/grammars/jsx.grammar.js",
    "src/grammars/java.grammar.js"
  ],
  "__section_13_philosophy": "Tokenizer is MATH-ONLY (Unicode ranges, binary flags). Grammar files own MEANING (keywords, semantics).",
  "__section_13_footer": "══════════════════════════════════════════════════════════════════════════════",

  "commentSyntax": {
    "description": "Comment syntax for supported languages",
    "java": {
      "singleLine": "//",
      "multiLineStart": "/*",
      "multiLineEnd": "*/",
      "documentation": {
        "start": "/**",
        "end": "*/",
        "tags": [
          "@param",
          "@return",
          "@throws",
          "@deprecated",
          "@see",
          "@author",
          "@version",
          "@since"
        ]
      }
    },
    "javascript": {
      "singleLine": "//",
      "multiLineStart": "/*",
      "multiLineEnd": "*/",
      "documentation": {
        "start": "/**",
        "end": "*/",
        "tags": [
          "@param",
          "@returns",
          "@type",
          "@typedef",
          "@callback",
          "@template",
          "@deprecated"
        ]
      }
    },
    "typescript": {
      "inheritsFrom": "javascript",
      "documentation": {
        "additionalTags": [
          "@type",
          "@typedef",
          "@namespace",
          "@interface",
          "@class",
          "@property",
          "@readonly"
        ]
      }
    },
    "jsx": {
      "inheritsFrom": "javascript",
      "jsxComment": {
        "start": "{/*",
        "end": "*/}"
      }
    }
  },
  "__section_14": "══════════════════════════════════════════════════════════════════════════════",
  "__section_14_number": "14",
  "__section_14_title": "【SECTION 14】Metadata & Basic Information",
  "__section_14_languages": [
    "Documentation"
  ],
  "__section_14_description": "Tokenizer Metadata - Version, Philosophy, Compliance",
  "__section_14_purpose": "เก็บข้อมูล metadata ของไฟล์ config เช่น version, philosophy, lastUpdated เพื่อการติดตามและ documentation",
  "__section_14_responsibility": "ให้ข้อมูลพื้นฐานเกี่ยวกับไฟล์ config นี้ รวมถึง philosophy และหลักการทำงานของ Pure Binary Tokenizer",
  "__section_14_used_by": [
    "ConfigLoader",
    "VersionChecker",
    "DocumentationGenerator"
  ],
  "__section_14_footer": "══════════════════════════════════════════════════════════════════════════════",
  "metadata": {
    "philosophy": "Tokenizer is a 'BLANK PAPER' - knows nothing about grammar, only mathematical character classification",
    "principle": "All grammar decisions must be asked from Brain (GrammarIndex)",
    "compliance": "NO_HARDCODE - All constants loaded from external configuration",
    "version": "2.0.0",
    "lastUpdated": "2025-10-10",
    "configSchema": "https://chahuadev.com/schemas/tokenizer-binary-config.schema.json",
    "validationRequired": true
  },
  "__section_15": "══════════════════════════════════════════════════════════════════════════════",
  "__section_15_number": "15",
  "__section_15_title": "【SECTION 15】Grammar Structure Constants",
  "__section_15_languages": [
    "All Languages"
  ],
  "__section_15_description": "Constants for grammar structure detection and metadata field identification",
  "__section_15_purpose": "กำหนด field names ที่ใช้ระบุว่า object เป็น grammar item (keyword/operator) หรือเป็น nested category",
  "__section_15_responsibility": "ให้ tokenizer สามารถ flatten nested grammar structure ได้โดยไม่ต้อง hardcode field names",
  "__section_15_used_by": [
    "PureBinaryTokenizer.flattenSection"
  ],
  "__section_15_footer": "══════════════════════════════════════════════════════════════════════════════",
  "grammarStructure": {
    "description": "Field names that indicate a grammar item vs nested category - NO_HARDCODE compliance",
    "metadataFields": {
      "description": "Fields that appear in final grammar items (keywords, operators, punctuation)",
      "purpose": "Used by flattenSection() to identify grammar items vs nested categories",
      "fields": [
        "type",
        "category",
        "subcategory",
        "description",
        "esVersion",
        "source",
        "precedence",
        "associativity",
        "usage",
        "strictMode",
        "contextual",
        "deprecated",
        "examples",
        "fixity",
        "arity"
      ]
    },
    "sectionPrefixes": {
      "description": "Prefixes that indicate section metadata (not grammar items)",
      "purpose": "Used to skip metadata fields when flattening grammar sections",
      "prefixes": [
        "__section_",
        "__comment_"
      ]
    }
  },
  "__section_16": "══════════════════════════════════════════════════════════════════════════════",
  "__section_16_number": "16",
  "__section_16_title": "【SECTION 16】Punctuation Binary Map",
  "__section_16_languages": [
    "All Languages"
  ],
  "__section_16_description": "Binary constants for punctuation characters - enables 100% binary parsing without string comparison",
  "__section_16_purpose": "แมป punctuation characters เป็นตัวเลข binary เพื่อให้ parser ใช้ integer comparison แทน string comparison",
  "__section_16_responsibility": "ให้ parser สามารถตรวจสอบ punctuation ด้วย binary check ได้ 100% - NO STRING COMPARISON",
  "__section_16_used_by": [
    "PureBinaryParser.matchPunctuation",
    "PureBinaryParser.consume"
  ],
  "__section_16_footer": "══════════════════════════════════════════════════════════════════════════════",
  "punctuationBinaryMap": {
    "description": "Binary constants for each punctuation character - enables pure binary comparison",
    "philosophy": "100% BINARY - parser must never use string comparison, even for punctuation",
    "usage": "Use token.punctuationBinary instead of token.value === '(' comparisons",
    "totalPunctuations": 24,
    "map": {
      "(": 1,
      ")": 2,
      "{": 3,
      "}": 4,
      "[": 5,
      "]": 6,
      ";": 7,
      ",": 8,
      ".": 9,
      ":": 10,
      "?": 11,
      "=>": 12,
      "...": 13,
      "@": 14,
      "#": 15,
      "`": 16,
      "'": 17,
      "\"": 18,
      "!": 19,
      "~": 20,
      "<": 21,
      ">": 22,
      "/": 23,
      "\\": 24
    },
    "reverseLookup": {
      "1": "(",
      "2": ")",
      "3": "{",
      "4": "}",
      "5": "[",
      "6": "]",
      "7": ";",
      "8": ",",
      "9": ".",
      "10": ":",
      "11": "?",
      "12": "=>",
      "13": "...",
      "14": "@",
      "15": "#",
      "16": "`",
      "17": "'",
      "18": "\"",
      "19": "!",
      "20": "~",
      "21": "<",
      "22": ">",
      "23": "/",
      "24": "\\"
    },
    "categories": {
      "grouping": [
        "(",
        ")",
        "{",
        "}",
        "[",
        "]"
      ],
      "separators": [
        ";",
        ",",
        ".",
        ":"
      ],
      "operators": [
        "?",
        "!",
        "~",
        "<",
        ">",
        "/",
        "\\"
      ],
      "arrows": [
        "=>"
      ],
      "spread": [
        "..."
      ],
      "decorators": [
        "@"
      ],
      "private": [
        "#"
      ],
      "stringDelimiters": [
        "'",
        "\"",
        "`"
      ]
    },
    "contextDependent": {
      "/": [
        "division operator",
        "regex delimiter",
        "comment start"
      ],
      "<": [
        "less than operator",
        "JSX opening tag",
        "type parameter start"
      ],
      ">": [
        "greater than operator",
        "JSX closing tag",
        "type parameter end"
      ],
      ".": [
        "member access",
        "decimal point",
        "spread part"
      ],
      "!": [
        "logical NOT",
        "non-null assertion (TS)",
        "important (CSS)"
      ],
      ":": [
        "ternary operator",
        "object property",
        "type annotation (TS)",
        "label"
      ],
      "'": [
        "string delimiter",
        "character literal (Java)"
      ],
      "\"": [
        "string delimiter"
      ],
      "`": [
        "template literal delimiter"
      ],
      "@": [
        "decorator (TS/Java)",
        "at-rule (CSS)",
        "annotation (Java)"
      ],
      "#": [
        "private field (JS)",
        "color (CSS)",
        "preprocessor (C)",
        "hashbang"
      ],
      "\\": [
        "escape character",
        "path separator (Windows)",
        "lambda (Haskell)"
      ]
    }
  },
  "__section_philosophy": "══════════════════════════════════════════════════════════════════════════════",
  "__section_philosophy_type": "Documentation",
  "__section_philosophy_title": "【PHILOSOPHY】Architecture Philosophy & Design Principles",
  "__section_philosophy_languages": [
    "Documentation"
  ],
  "__section_philosophy_description": "Pure Binary Tokenizer Architecture - Design Principles and Why This Works",
  "__section_philosophy_purpose": "อธิบาย philosophy และหลักการออกแบบของ Pure Binary Tokenizer ว่าทำไมถึงใช้ mathematical approach แทน regex",
  "__section_philosophy_responsibility": "ให้ความรู้แก่ developers เกี่ยวกับ architecture, layered abstraction, และ comparison กับ traditional tokenizers",
  "__section_philosophy_used_by": [
    "Developers",
    "Architects",
    "Documentation"
  ],
  "__section_philosophy_footer": "══════════════════════════════════════════════════════════════════════════════",
  "architecturePhilosophy": {
    "title": "Pure Binary Tokenizer Architecture - Why This Approach Works",
    "description": "Understanding how this tokenizer reads code through binary mathematics",
    "layeredAbstraction": {
      "description": "Three distinct layers of binary processing - never confuse them!",
      "layers": {
        "LAYER_1_MACHINE_CODE": {
          "name": "Machine Code (CPU Instructions)",
          "description": "Raw CPU instructions (opcodes + operands) that control transistors",
          "example": "10111000 00000101 = MOV AX, 5",
          "scope": "CPU architecture specific (x86, ARM, etc.)",
          "note": "WE DO NOT WORK AT THIS LEVEL - Too low, too platform-specific"
        },
        "LAYER_2_CHARACTER_ENCODING": {
          "name": "Character Encoding (ASCII/UTF-8)",
          "description": "Binary representation of text characters",
          "example": "01100011 = 'c' (ASCII 99)",
          "scope": "Universal text representation standard",
          "note": "THIS IS WHERE WE START - UniversalCharacterClassifier reads these values"
        },
        "LAYER_3_SEMANTIC_BINARY": {
          "name": "Semantic Binary Flags (Our Layer)",
          "description": "Mathematical classification of characters into meaning",
          "example": "0b00100000 = KEYWORD token type",
          "scope": "Language-agnostic semantic representation",
          "note": "THIS IS OUR INNOVATION - Pure mathematical token classification"
        }
      }
    },
    "processingFlow": {
      "description": "How source code flows through the tokenizer",
      "steps": [
        {
          "step": 1,
          "name": "File System Storage",
          "description": "Source code file stored as binary (0s and 1s) by operating system",
          "example": "const x = 5;  stored as sequence of ASCII/UTF-8 bytes"
        },
        {
          "step": 2,
          "name": "Character Code Reading",
          "description": "UniversalCharacterClassifier reads numeric character codes",
          "example": "'c'  charCode 99 (0x63)  mathematical comparison begins",
          "logic": "99 >= 65 && 99 <= 90 || 99 >= 97 && 99 <= 122  TRUE  LETTER"
        },
        {
          "step": 3,
          "name": "Binary Flag Computation",
          "description": "Character properties encoded as bit flags (from config)",
          "example": "LETTER=0b00001, DIGIT=0b00010, WHITESPACE=0b00100, OPERATOR=0b01000",
          "bitwise": "flags |= (1 << CHAR_FLAGS.LETTER.bit)  flags = 0b00001"
        },
        {
          "step": 4,
          "name": "Token Assembly",
          "description": "Characters grouped into tokens by asking Brain (GrammarIndex)",
          "example": "'c','o','n','s','t'  Brain says 'KEYWORD'  assign binary 0b00100000"
        },
        {
          "step": 5,
          "name": "Semantic Stream Output",
          "description": "Stream of tokens with semantic binary flags",
          "example": "{type:'KEYWORD', binary:32, value:'const', start:0, end:5}"
        }
      ]
    },
    "whyThisWorks": {
      "description": "Advantages of Pure Binary Mathematical Tokenization",
      "reasons": {
        "LANGUAGE_AGNOSTIC": {
          "title": "Works with ANY programming language",
          "explanation": "Only need to teach Brain (GrammarIndex) new grammar rules",
          "example": "Same tokenizer reads JavaScript, Python, Rust, Go - just swap Brain"
        },
        "PLATFORM_INDEPENDENT": {
          "title": "Runs on ANY hardware architecture",
          "explanation": "Works at character encoding level, not CPU instruction level",
          "example": "Intel x86, ARM, RISC-V - all use same ASCII/UTF-8 standards"
        },
        "PRESERVES_SEMANTICS": {
          "title": "Maintains programmer intent",
          "explanation": "Source code analysis keeps meaning, Machine code loses it",
          "example": "Variable name 'userAge' meaningful in source, meaningless in machine code"
        },
        "MATHEMATICALLY_PURE": {
          "title": "Zero ambiguity through mathematics",
          "explanation": "No string matching, no regex, pure integer comparisons",
          "example": "charCode >= 65 && charCode <= 90 is absolute truth, never fails"
        },
        "INFINITELY_EXTENSIBLE": {
          "title": "Add new languages without rewriting tokenizer",
          "explanation": "Tokenizer is dumb paper, Brain (config) provides intelligence",
          "example": "Want Kotlin support? Create kotlin-grammar.json, done"
        },
        "SECURITY_BY_DESIGN": {
          "title": "All limits configurable externally",
          "explanation": "No hardcoded buffer sizes, stack depths, or magic numbers",
          "example": "DevOps can set MAX_TOKEN_LENGTH=1000 in config without code change"
        }
      }
    },
    "comparisonWithTraditionalApproach": {
      "description": "Why traditional tokenizers are fundamentally limited",
      "traditional": {
        "approach": "Hardcoded regex patterns and string matching",
        "example": "if (/\\/\\//.test(input)) { /* handle comment */ }",
        "problems": [
          "Regex patterns hardcoded in source code",
          "Different tokenizer per language (JSTokenizer, PythonTokenizer, etc.)",
          "Token types as string literals ('COMMENT', 'STRING', etc.)",
          "No mathematical foundation, just pattern matching",
          "Impossible to extend without modifying source code"
        ]
      },
      "ourApproach": {
        "approach": "Pure mathematical character classification + external Brain",
        "example": "brain.identifyTokenType(char, input, position)  ask, don't assume",
        "advantages": [
          "All decisions delegated to external GrammarIndex (Brain)",
          "Single tokenizer for all languages, just swap Brain",
          "Token types as binary flags from config (0b00100000 = KEYWORD)",
          "Mathematical foundation: charCode comparisons only",
          "Extend by editing config.json, never touch source code"
        ]
      }
    },
    "keyInsight": {
      "title": "The Fundamental Insight",
      "statement": "We are NOT reading Machine Code. We are reading Character Codes and converting them to Semantic Binary Flags through pure mathematics.",
      "analogy": "Think of it like a prism splitting white light into spectrum. Source code (white light)  Character codes (photons)  Binary flags (colors). The prism (tokenizer) is dumb - it just bends light mathematically. The Brain (GrammarIndex) interprets what those colors mean.",
      "prohibition": "NEVER try to understand CPU opcodes. That's the compiler's job downstream. Our job ends at semantic token stream.",
      "boundary": "Our domain: Source Code  Binary Token Stream. Compiler's domain: Binary Token Stream  Machine Code."
    },
    "visualExample": {
      "description": "Complete example: tokenizing 'const x = 5;'",
      "input": "const x = 5;",
      "process": [
        {
          "char": "c",
          "charCode": 99,
          "binary": "01100011",
          "classification": "99>=97 && 99<=122  LETTER (0b00001)",
          "action": "Start identifier/keyword collection"
        },
        {
          "char": "o",
          "charCode": 111,
          "binary": "01101111",
          "classification": "111>=97 && 111<=122  LETTER (0b00001)",
          "action": "Continue identifier/keyword collection"
        },
        {
          "sequence": "const",
          "chars": "c,o,n,s,t",
          "accumulated": "const",
          "brainQuery": "brain.isKeyword('const')  TRUE",
          "tokenOutput": "{type:'KEYWORD', binary:32, value:'const'}"
        },
        {
          "char": " ",
          "charCode": 32,
          "binary": "00100000",
          "classification": "32===32  WHITESPACE (0b00100)",
          "action": "Skip (PARSING_RULES.SKIP_WHITESPACE=true)"
        },
        {
          "char": "x",
          "charCode": 120,
          "binary": "01111000",
          "classification": "120>=97 && 120<=122  LETTER (0b00001)",
          "tokenOutput": "{type:'IDENTIFIER', binary:1, value:'x'}"
        },
        {
          "char": "=",
          "charCode": 61,
          "brainQuery": "brain.findLongestOperator('=')  found",
          "tokenOutput": "{type:'OPERATOR', binary:8, value:'='}"
        },
        {
          "char": "5",
          "charCode": 53,
          "binary": "00110101",
          "classification": "53>=48 && 53<=57  DIGIT (0b00010)",
          "tokenOutput": "{type:'NUMBER', binary:2, value:'5'}"
        },
        {
          "char": ";",
          "charCode": 59,
          "brainQuery": "brain.findLongestPunctuation(';')  found",
          "tokenOutput": "{type:'PUNCTUATION', binary:64, value:';'}"
        }
      ],
      "finalOutput": [
        "{type:'KEYWORD', binary:32, value:'const', start:0, end:5}",
        "{type:'IDENTIFIER', binary:1, value:'x', start:6, end:7}",
        "{type:'OPERATOR', binary:8, value:'=', start:8, end:9}",
        "{type:'NUMBER', binary:2, value:'5', start:10, end:11}",
        "{type:'PUNCTUATION', binary:64, value:';', start:11, end:12}"
      ]
    },
    "noHardcodeProof": {
      "title": "Proving ZERO HARDCODE Compliance",
      "statement": "Every single value used by tokenizer comes from this config file",
      "evidence": [
        "Character boundaries (65,90,97,122,48,57)  unicodeRanges.ranges",
        "Token type strings ('KEYWORD','NUMBER')  tokenTypeStrings.types",
        "Binary bit positions (bit:0,1,2,3...)  tokenBinaryTypes.types[*].bit",
        "Error message templates  errorMessages.templates",
        "Security limits (MAX_TOKEN_LENGTH)  securityConfig.limits",
        "Parsing behavior (SKIP_WHITESPACE)  parsingRules.rules",
        "All special characters (_, $, ., \\)  unicodeRanges.ranges"
      ],
      "verification": "If DevOps changes unicodeRanges.ranges.UPPERCASE_LETTER.start from 65 to 66, 'A' stops being recognized as letter - proving config controls everything",
      "goldenRule": "If you can't change tokenizer behavior by editing ONLY this JSON file, you found a hardcode violation"
    }
  },
  "__section_examples": "══════════════════════════════════════════════════════════════════════════════",
  "__section_examples_type": "Documentation",
  "__section_examples_title": "【EXAMPLES】Number Literal Recognition - Step by Step",
  "__section_examples_languages": [
    "JavaScript",
    "TypeScript",
    "Java",
    "All Languages"
  ],
  "__section_examples_description": "Mathematical Approach to Binary/Octal/Hex/Decimal Recognition with Examples",
  "__section_examples_purpose": "ให้ตัวอย่างการทำงานของ number literal recognition แบบ step-by-step พร้อม character codes และ error cases",
  "__section_examples_responsibility": "สอนว่า tokenizer ทำงานอย่างไรกับ number literals โดยละเอียด เพื่อให้ developers เข้าใจกระบวนการ",
  "__section_examples_used_by": [
    "Developers",
    "Learners",
    "Documentation",
    "Testing"
  ],
  "__section_examples_footer": "══════════════════════════════════════════════════════════════════════════════",
  "numberLiteralRecognition": {
    "title": "How Tokenizer Recognizes Number Literals",
    "description": "Mathematical approach to identifying binary, octal, hex, and decimal numbers",
    "recognitionFlow": {
      "step1": {
        "name": "Detect Starting Pattern",
        "description": "Check if number starts with 0 (charCode 48)",
        "logic": "if (charCode === 48) { /* Check next character */ }"
      },
      "step2": {
        "name": "Identify Number Base",
        "description": "Look at second character to determine base",
        "patterns": {
          "binary": "Next char is 'b' (98) or 'B' (66)  Binary (base 2)",
          "octal": "Next char is 'o' (111) or 'O' (79)  Octal (base 8)",
          "hex": "Next char is 'x' (120) or 'X' (88)  Hexadecimal (base 16)",
          "legacyOctal": "Next char is digit 0-7  Legacy octal (deprecated in strict mode)",
          "decimal": "Anything else  Decimal"
        }
      },
      "step3": {
        "name": "Validate Digits",
        "description": "Ensure all following characters are valid for the detected base",
        "validation": {
          "binary": "Only '0' (48) and '1' (49) allowed",
          "octal": "Only '0'-'7' (48-55) allowed",
          "hex": "0-9 (48-57), A-F (65-70), a-f (97-102) allowed",
          "decimal": "0-9 (48-57) allowed, plus dot (46) and E/e (69/101) for float/scientific"
        }
      },
      "step4": {
        "name": "Handle Numeric Separators",
        "description": "Allow underscore (95) between digits for readability",
        "examples": [
          "0b1010_1010  Valid binary",
          "1_000_000  Valid decimal",
          "0xFF_FF  Valid hexadecimal"
        ],
        "rules": [
          "Cannot start with underscore",
          "Cannot end with underscore",
          "Cannot have consecutive underscores",
          "Cannot come before/after prefix (0b, 0x, etc.)"
        ]
      },
      "step5": {
        "name": "Check for Suffix",
        "description": "Look for type suffix after number",
        "suffixes": {
          "n (110)": "BigInt - JavaScript/TypeScript arbitrary precision",
          "L/l (76/108)": "Long - Java/C/C++ 64-bit integer",
          "F/f (70/102)": "Float - Single precision floating point",
          "D/d (68/100)": "Double - Double precision floating point",
          "U/u (85/117)": "Unsigned - Unsigned integer"
        }
      }
    },
    "examplesWithCharCodes": {
      "binary": {
        "code": "0b1010",
        "breakdown": [
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Prefix start"
          },
          {
            "char": "b",
            "charCode": 98,
            "meaning": "Binary indicator"
          },
          {
            "char": "1",
            "charCode": 49,
            "meaning": "Binary digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Binary digit"
          },
          {
            "char": "1",
            "charCode": 49,
            "meaning": "Binary digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Binary digit"
          }
        ],
        "value": 10,
        "tokenType": "NUMBER",
        "binaryFlag": "0b0000000000000010"
      },
      "hex": {
        "code": "0xCAFE",
        "breakdown": [
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Prefix start"
          },
          {
            "char": "x",
            "charCode": 120,
            "meaning": "Hexadecimal indicator"
          },
          {
            "char": "C",
            "charCode": 67,
            "meaning": "Hex digit (12)"
          },
          {
            "char": "A",
            "charCode": 65,
            "meaning": "Hex digit (10)"
          },
          {
            "char": "F",
            "charCode": 70,
            "meaning": "Hex digit (15)"
          },
          {
            "char": "E",
            "charCode": 69,
            "meaning": "Hex digit (14)"
          }
        ],
        "value": 51966,
        "tokenType": "NUMBER",
        "binaryFlag": "0b0000000000000010"
      },
      "octal": {
        "code": "0o755",
        "breakdown": [
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Prefix start"
          },
          {
            "char": "o",
            "charCode": 111,
            "meaning": "Octal indicator"
          },
          {
            "char": "7",
            "charCode": 55,
            "meaning": "Octal digit"
          },
          {
            "char": "5",
            "charCode": 53,
            "meaning": "Octal digit"
          },
          {
            "char": "5",
            "charCode": 53,
            "meaning": "Octal digit"
          }
        ],
        "value": 493,
        "tokenType": "NUMBER",
        "binaryFlag": "0b0000000000000010"
      },
      "bigint": {
        "code": "123n",
        "breakdown": [
          {
            "char": "1",
            "charCode": 49,
            "meaning": "Decimal digit"
          },
          {
            "char": "2",
            "charCode": 50,
            "meaning": "Decimal digit"
          },
          {
            "char": "3",
            "charCode": 51,
            "meaning": "Decimal digit"
          },
          {
            "char": "n",
            "charCode": 110,
            "meaning": "BigInt suffix"
          }
        ],
        "value": "123n",
        "tokenType": "NUMBER",
        "subtype": "BIGINT",
        "binaryFlag": "0b0000000000000010"
      },
      "withSeparator": {
        "code": "1_000_000",
        "breakdown": [
          {
            "char": "1",
            "charCode": 49,
            "meaning": "Decimal digit"
          },
          {
            "char": "_",
            "charCode": 95,
            "meaning": "Numeric separator (ignored)"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          },
          {
            "char": "_",
            "charCode": 95,
            "meaning": "Numeric separator (ignored)"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          },
          {
            "char": "0",
            "charCode": 48,
            "meaning": "Decimal digit"
          }
        ],
        "value": 1000000,
        "tokenType": "NUMBER",
        "binaryFlag": "0b0000000000000010"
      }
    },
    "commonErrors": {
      "invalidBinary": {
        "code": "0b1012",
        "error": "Invalid digit '2' in binary literal (only 0-1 allowed)",
        "charCode": 50,
        "fix": "Use only 0 and 1 after 0b prefix"
      },
      "invalidOctal": {
        "code": "0o789",
        "error": "Invalid digit '8' in octal literal (only 0-7 allowed)",
        "charCode": 56,
        "fix": "Use only 0-7 after 0o prefix"
      },
      "invalidHex": {
        "code": "0xGHI",
        "error": "Invalid character 'G' in hex literal (only 0-9, A-F allowed)",
        "charCode": 71,
        "fix": "Use only 0-9 and A-F after 0x prefix"
      },
      "leadingSeparator": {
        "code": "_123",
        "error": "Numeric separator cannot appear at start",
        "charCode": 95,
        "fix": "Remove leading underscore"
      },
      "trailingSeparator": {
        "code": "123_",
        "error": "Numeric separator cannot appear at end",
        "charCode": 95,
        "fix": "Remove trailing underscore"
      },
      "consecutiveSeparators": {
        "code": "1__000",
        "error": "Consecutive numeric separators not allowed",
        "charCode": 95,
        "fix": "Use single underscore between digits"
      }
    },
    "crossLanguageSupport": {
      "binary": {
        "supported": [
          "JavaScript (ES6+)",
          "TypeScript",
          "Java (7+)",
          "Python",
          "Rust",
          "Go",
          "C++14",
          "Swift"
        ],
        "notSupported": [
          "C (before C23)",
          "PHP (before 5.4)"
        ],
        "syntax": "0b or 0B prefix"
      },
      "octal": {
        "modern": {
          "syntax": "0o or 0O prefix",
          "supported": [
            "JavaScript (ES6+)",
            "TypeScript",
            "Python 3",
            "Ruby"
          ]
        },
        "legacy": {
          "syntax": "Leading 0 without prefix",
          "supported": [
            "C",
            "Java (legacy)",
            "JavaScript (non-strict)"
          ],
          "warning": "Deprecated and forbidden in JavaScript strict mode"
        }
      },
      "hexadecimal": {
        "supported": [
          "All major languages"
        ],
        "syntax": "0x or 0X prefix",
        "universal": true
      },
      "separator": {
        "character": "_",
        "supported": [
          "Java (7+)",
          "Python",
          "Rust",
          "C++14",
          "Swift",
          "JavaScript (Stage 3)"
        ],
        "notSupported": [
          "C (most versions)",
          "Legacy JavaScript"
        ]
      }
    }
  },
  "__section_14": "══════════════════════════════════════════════════════════════════════════════",
  "__section_14_number": "14",
  "__section_14_title": "【SECTION 14】Grammar Metadata Field Definitions",
  "__section_14_languages": [
    "All"
  ],
  "__section_14_description": "Metadata fields that appear in grammar definitions to distinguish data from metadata",
  "__section_14_purpose": "กำหนดว่า field ไหนเป็น metadata (ต้องข้าม) และ field ไหนเป็น data (ต้องนำมาใช้)",
  "__section_14_responsibility": "ให้ flattenSection รู้จักแยก metadata fields ออกจาก actual token/keyword definitions",
  "__section_14_used_by": [
    "PureBinaryTokenizer.flattenSection",
    "GrammarIndex"
  ],
  "__section_14_footer": "══════════════════════════════════════════════════════════════════════════════",
  "grammarMetadata": {
    "description": "Fields that indicate a grammar entry contains actual token/keyword metadata (not a nested category)",
    "fields": [
      "category",
      "esVersion",
      "source",
      "description",
      "binary",
      "precedence",
      "associativity",
      "arity",
      "fixity",
      "followedBy",
      "precededBy",
      "parentContext",
      "startsExpr",
      "beforeExpr",
      "returnType",
      "spec",
      "example",
      "deprecated",
      "alternative"
    ],
    "prefixes": [
      "__grammar_",
      "__section_"
    ],
    "notes": "If an object has ANY of these fields, it's considered a final definition (not a nested category)"
  }
};

