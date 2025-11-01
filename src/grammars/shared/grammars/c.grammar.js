// C Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const cGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "C",
  "__grammar_version": "1.0.0",
  "__grammar_title": "C Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for C - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for C language tokenization and parsing",
  "__grammar_total_sections": 4,
  "__grammar_sections": [
    "keywords",
    "operators",
    "punctuation",
    "comments"
  ],
  "__grammar_used_by": [
    "GrammarIndex",
    "BlankPaperTokenizer",
    "BinaryParser"
  ],
  "__grammar_footer": "══════════════════════════════════════════════════════════════════════════════",
  "__section_01": "══════════════════════════════════════════════════════════════════════════════",
  "__section_01_number": "01",
  "__section_01_name": "keywords",
  "__section_01_title": "【SECTION 01】C Keywords",
  "__section_01_language": "C",
  "__section_01_total_items": 115,
  "__section_01_description": "Reserved keywords in C",
  "__section_01_purpose": "Define all keywords for C tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "FALSE": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "FALSE keyword"
    },
    "L\"": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "L\" keyword"
    },
    "L'": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "L' keyword"
    },
    "NULL": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "NULL keyword"
    },
    "TRUE": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "TRUE keyword"
    },
    "U\"": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "U\" keyword"
    },
    "U'": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "U' keyword"
    },
    "\\>": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "\\> keyword"
    },
    "_Alignas": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Alignas keyword"
    },
    "_Alignof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Alignof keyword"
    },
    "_Atomic": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Atomic keyword"
    },
    "_Generic": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Generic keyword"
    },
    "_Nonnull": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Nonnull keyword"
    },
    "_Noreturn": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_Noreturn keyword"
    },
    "__alignof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__alignof keyword"
    },
    "__alignof__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__alignof__ keyword"
    },
    "__asm": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__asm keyword"
    },
    "__asm__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__asm__ keyword"
    },
    "__attribute": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__attribute keyword"
    },
    "__attribute__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__attribute__ keyword"
    },
    "__based": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__based keyword"
    },
    "__cdecl": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__cdecl keyword"
    },
    "__clrcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__clrcall keyword"
    },
    "__declspec": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__declspec keyword"
    },
    "__except": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__except keyword"
    },
    "__extension__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__extension__ keyword"
    },
    "__fastcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__fastcall keyword"
    },
    "__finally": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__finally keyword"
    },
    "__forceinline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__forceinline keyword"
    },
    "__inline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__inline keyword"
    },
    "__inline__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__inline__ keyword"
    },
    "__leave": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__leave keyword"
    },
    "__restrict": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__restrict keyword"
    },
    "__restrict__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__restrict__ keyword"
    },
    "__sptr": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__sptr keyword"
    },
    "__stdcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__stdcall keyword"
    },
    "__thiscall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__thiscall keyword"
    },
    "__thread": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__thread keyword"
    },
    "__try": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__try keyword"
    },
    "__unaligned": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__unaligned keyword"
    },
    "__uptr": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__uptr keyword"
    },
    "__vectorcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__vectorcall keyword"
    },
    "__volatile__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__volatile__ keyword"
    },
    "_alignof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_alignof keyword"
    },
    "_unaligned": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_unaligned keyword"
    },
    "alignas": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "alignas keyword"
    },
    "alignof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "alignof keyword"
    },
    "asm": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "asm keyword"
    },
    "auto": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "auto keyword"
    },
    "bool": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "bool keyword"
    },
    "break": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "break keyword"
    },
    "case": {
      "category": "control",
      "source": "tree-sitter",
      "description": "case keyword"
    },
    "char": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char keyword"
    },
    "char16_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char16_t keyword"
    },
    "char32_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char32_t keyword"
    },
    "char64_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char64_t keyword"
    },
    "char8_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char8_t keyword"
    },
    "charptr_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "charptr_t keyword"
    },
    "const": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "const keyword"
    },
    "constexpr": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "constexpr keyword"
    },
    "continue": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "continue keyword"
    },
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
    },
    "defined": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "defined keyword"
    },
    "do": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "do keyword"
    },
    "double": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "double keyword"
    },
    "else": {
      "category": "control",
      "source": "tree-sitter",
      "description": "else keyword"
    },
    "enum": {
      "category": "type",
      "source": "tree-sitter",
      "description": "enum keyword"
    },
    "extern": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "extern keyword"
    },
    "false": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "false keyword"
    },
    "float": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "float keyword"
    },
    "for": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "for keyword"
    },
    "goto": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "goto keyword"
    },
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "inline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "inline keyword"
    },
    "int": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int keyword"
    },
    "int16_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int16_t keyword"
    },
    "int32_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int32_t keyword"
    },
    "int64_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int64_t keyword"
    },
    "int8_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int8_t keyword"
    },
    "intptr_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "intptr_t keyword"
    },
    "long": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "long keyword"
    },
    "max_align_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "max_align_t keyword"
    },
    "noreturn": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "noreturn keyword"
    },
    "nullptr": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nullptr keyword"
    },
    "nullptr_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nullptr_t keyword"
    },
    "offsetof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "offsetof keyword"
    },
    "ptrdiff_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ptrdiff_t keyword"
    },
    "register": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "register keyword"
    },
    "restrict": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "restrict keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "short": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "short keyword"
    },
    "signed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "signed keyword"
    },
    "size_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "size_t keyword"
    },
    "sizeof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sizeof keyword"
    },
    "ssize_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ssize_t keyword"
    },
    "static": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "static keyword"
    },
    "struct": {
      "category": "type",
      "source": "tree-sitter",
      "description": "struct keyword"
    },
    "switch": {
      "category": "control",
      "source": "tree-sitter",
      "description": "switch keyword"
    },
    "thread_local": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "thread_local keyword"
    },
    "true": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "true keyword"
    },
    "typedef": {
      "category": "type",
      "source": "tree-sitter",
      "description": "typedef keyword"
    },
    "u\"": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u\" keyword"
    },
    "u'": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u' keyword"
    },
    "u8\"": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u8\" keyword"
    },
    "u8'": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u8' keyword"
    },
    "uint16_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uint16_t keyword"
    },
    "uint32_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uint32_t keyword"
    },
    "uint64_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uint64_t keyword"
    },
    "uint8_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uint8_t keyword"
    },
    "uintptr_t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uintptr_t keyword"
    },
    "union": {
      "category": "type",
      "source": "tree-sitter",
      "description": "union keyword"
    },
    "unsigned": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unsigned keyword"
    },
    "void": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "void keyword"
    },
    "volatile": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "volatile keyword"
    },
    "while": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "while keyword"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "operators",
  "__section_02_title": "【SECTION 02】C Operators",
  "__section_02_language": "C",
  "__section_02_total_items": 39,
  "__section_02_description": "All operators in C",
  "__section_02_purpose": "Define operators for expression parsing",
  "__section_02_responsibility": "Handle operators for tokenization",
  "__section_02_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",
  "operators": {
    "!": {
      "type": "logical",
      "source": "tree-sitter",
      "description": "! operator"
    },
    "!=": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "!= operator"
    },
    "%": {
      "type": "arithmetic",
      "source": "tree-sitter",
      "description": "% operator"
    },
    "%=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "%= operator"
    },
    "&": {
      "type": "other",
      "source": "tree-sitter",
      "description": "& operator"
    },
    "&&": {
      "type": "logical",
      "source": "tree-sitter",
      "description": "&& operator"
    },
    "&=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "&= operator"
    },
    "*": {
      "type": "arithmetic",
      "source": "tree-sitter",
      "description": "* operator"
    },
    "*=": {
      "type": "assignment",
      "source": "tree-sitter",
      "description": "*= operator"
    },
    "+": {
      "type": "arithmetic",
      "source": "tree-sitter",
      "description": "+ operator"
    },
    "++": {
      "type": "other",
      "source": "tree-sitter",
      "description": "++ operator"
    },
    "+=": {
      "type": "assignment",
      "source": "tree-sitter",
      "description": "+= operator"
    },
    "-": {
      "type": "arithmetic",
      "source": "tree-sitter",
      "description": "- operator"
    },
    "--": {
      "type": "other",
      "source": "tree-sitter",
      "description": "-- operator"
    },
    "-=": {
      "type": "assignment",
      "source": "tree-sitter",
      "description": "-= operator"
    },
    "->": {
      "type": "other",
      "source": "tree-sitter",
      "description": "-> operator"
    },
    "/": {
      "type": "arithmetic",
      "source": "tree-sitter",
      "description": "/ operator"
    },
    "/*": {
      "type": "other",
      "source": "tree-sitter",
      "description": "/* operator"
    },
    "//": {
      "type": "other",
      "source": "tree-sitter",
      "description": "// operator"
    },
    "/=": {
      "type": "assignment",
      "source": "tree-sitter",
      "description": "/= operator"
    },
    ":": {
      "type": "other",
      "source": "tree-sitter",
      "description": ": operator"
    },
    "::": {
      "type": "other",
      "source": "tree-sitter",
      "description": ":: operator"
    },
    "<": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "< operator"
    },
    "<<": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<< operator"
    },
    "<<=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<<= operator"
    },
    "<=": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "<= operator"
    },
    "=": {
      "type": "assignment",
      "source": "tree-sitter",
      "description": "= operator"
    },
    "==": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "== operator"
    },
    ">": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "> operator"
    },
    ">=": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": ">= operator"
    },
    ">>": {
      "type": "other",
      "source": "tree-sitter",
      "description": ">> operator"
    },
    ">>=": {
      "type": "other",
      "source": "tree-sitter",
      "description": ">>= operator"
    },
    "?": {
      "type": "other",
      "source": "tree-sitter",
      "description": "? operator"
    },
    "^": {
      "type": "other",
      "source": "tree-sitter",
      "description": "^ operator"
    },
    "^=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "^= operator"
    },
    "|": {
      "type": "other",
      "source": "tree-sitter",
      "description": "| operator"
    },
    "|=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "|= operator"
    },
    "||": {
      "type": "logical",
      "source": "tree-sitter",
      "description": "|| operator"
    },
    "~": {
      "type": "other",
      "source": "tree-sitter",
      "description": "~ operator"
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "punctuation",
  "__section_03_title": "【SECTION 03】C Punctuation",
  "__section_03_language": "C",
  "__section_03_total_items": 15,
  "__section_03_description": "Punctuation marks and separators",
  "__section_03_purpose": "Define punctuation for code structure",
  "__section_03_responsibility": "Handle punctuation for tokenization",
  "__section_03_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",
  "punctuation": {
    "\"": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\" punctuation"
    },
    "'": {
      "type": "other",
      "source": "tree-sitter",
      "description": "' punctuation"
    },
    "(": {
      "type": "paren",
      "source": "tree-sitter",
      "description": "( punctuation"
    },
    ")": {
      "type": "paren",
      "source": "tree-sitter",
      "description": ") punctuation"
    },
    ",": {
      "type": "separator",
      "source": "tree-sitter",
      "description": ", punctuation"
    },
    ".": {
      "type": "accessor",
      "source": "tree-sitter",
      "description": ". punctuation"
    },
    "...": {
      "type": "other",
      "source": "tree-sitter",
      "description": "... punctuation"
    },
    ";": {
      "type": "statement-end",
      "source": "tree-sitter",
      "description": "; punctuation"
    },
    "[": {
      "type": "bracket",
      "source": "tree-sitter",
      "description": "[ punctuation"
    },
    "[[": {
      "type": "other",
      "source": "tree-sitter",
      "description": "[[ punctuation"
    },
    "\\": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\\ punctuation"
    },
    "]": {
      "type": "bracket",
      "source": "tree-sitter",
      "description": "] punctuation"
    },
    "]]": {
      "type": "other",
      "source": "tree-sitter",
      "description": "]] punctuation"
    },
    "{": {
      "type": "brace",
      "source": "tree-sitter",
      "description": "{ punctuation"
    },
    "}": {
      "type": "brace",
      "source": "tree-sitter",
      "description": "} punctuation"
    }
  },
  "__section_04": "══════════════════════════════════════════════════════════════════════════════",
  "__section_04_number": "04",
  "__section_04_name": "comments",
  "__section_04_title": "【SECTION 04】C Comments",
  "__section_04_language": "C",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for C",
  "__section_04_purpose": "Define comment patterns for tokenizer to skip",
  "__section_04_responsibility": "Handle comments for tokenization",
  "__section_04_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",
  "comments": {
    "//": {
      "type": "line",
      "pattern": "//",
      "description": "Single-line comment",
      "endPattern": "\\n"
    },
    "/*": {
      "type": "block",
      "pattern": "/*",
      "description": "Multi-line comment",
      "endPattern": "*/"
    }
  }
};

export default cGrammar;
