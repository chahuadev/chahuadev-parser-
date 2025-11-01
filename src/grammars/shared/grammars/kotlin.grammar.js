// Kotlin Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const kotlinGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Kotlin",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Kotlin Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Kotlin - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Kotlin language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Kotlin Keywords",
  "__section_01_language": "Kotlin",
  "__section_01_total_items": 85,
  "__section_01_description": "Reserved keywords in Kotlin",
  "__section_01_purpose": "Define all keywords for Kotlin tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "!in": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "!in keyword"
    },
    "!is": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "!is keyword"
    },
    "#!": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "#! keyword"
    },
    "L": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "L keyword"
    },
    "\\u": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "\\u keyword"
    },
    "abstract": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "abstract keyword"
    },
    "actual": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "actual keyword"
    },
    "annotation": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "annotation keyword"
    },
    "as": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "as keyword"
    },
    "as?": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "as? keyword"
    },
    "break": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "break keyword"
    },
    "break@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "break@ keyword"
    },
    "by": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "by keyword"
    },
    "catch": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "catch keyword"
    },
    "class": {
      "category": "class",
      "source": "tree-sitter",
      "description": "class keyword"
    },
    "companion": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "companion keyword"
    },
    "const": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "const keyword"
    },
    "constructor": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "constructor keyword"
    },
    "continue": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "continue keyword"
    },
    "continue@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "continue@ keyword"
    },
    "crossinline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "crossinline keyword"
    },
    "data": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "data keyword"
    },
    "delegate": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "delegate keyword"
    },
    "do": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "do keyword"
    },
    "dynamic": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "dynamic keyword"
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
    "expect": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "expect keyword"
    },
    "external": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "external keyword"
    },
    "false": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "false keyword"
    },
    "field": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "field keyword"
    },
    "file": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "file keyword"
    },
    "final": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "final keyword"
    },
    "finally": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "finally keyword"
    },
    "for": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "for keyword"
    },
    "fun": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fun keyword"
    },
    "get": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "get keyword"
    },
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "import": {
      "category": "module",
      "source": "tree-sitter",
      "description": "import keyword"
    },
    "in": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "in keyword"
    },
    "infix": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "infix keyword"
    },
    "init": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "init keyword"
    },
    "inline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "inline keyword"
    },
    "inner": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "inner keyword"
    },
    "interface": {
      "category": "class",
      "source": "tree-sitter",
      "description": "interface keyword"
    },
    "internal": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "internal keyword"
    },
    "is": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "is keyword"
    },
    "lateinit": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "lateinit keyword"
    },
    "noinline": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "noinline keyword"
    },
    "null": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "null keyword"
    },
    "object": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "object keyword"
    },
    "open": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "open keyword"
    },
    "operator": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "operator keyword"
    },
    "out": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "out keyword"
    },
    "override": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "override keyword"
    },
    "package": {
      "category": "module",
      "source": "tree-sitter",
      "description": "package keyword"
    },
    "param": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "param keyword"
    },
    "private": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "private keyword"
    },
    "property": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "property keyword"
    },
    "protected": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "protected keyword"
    },
    "public": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "public keyword"
    },
    "receiver": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "receiver keyword"
    },
    "reified": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "reified keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "return@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "return@ keyword"
    },
    "sealed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sealed keyword"
    },
    "set": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "set keyword"
    },
    "setparam": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "setparam keyword"
    },
    "super": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super keyword"
    },
    "super@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super@ keyword"
    },
    "suspend": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "suspend keyword"
    },
    "tailrec": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "tailrec keyword"
    },
    "this": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "this keyword"
    },
    "this@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "this@ keyword"
    },
    "throw": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "throw keyword"
    },
    "true": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "true keyword"
    },
    "try": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "try keyword"
    },
    "typealias": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "typealias keyword"
    },
    "val": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "val keyword"
    },
    "value": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "value keyword"
    },
    "var": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "var keyword"
    },
    "vararg": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "vararg keyword"
    },
    "when": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "when keyword"
    },
    "where": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "where keyword"
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
  "__section_02_title": "【SECTION 02】Kotlin Operators",
  "__section_02_language": "Kotlin",
  "__section_02_total_items": 32,
  "__section_02_description": "All operators in Kotlin",
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
    "!!": {
      "type": "other",
      "source": "tree-sitter",
      "description": "!! operator"
    },
    "!=": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "!= operator"
    },
    "!==": {
      "type": "other",
      "source": "tree-sitter",
      "description": "!== operator"
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
    "===": {
      "type": "other",
      "source": "tree-sitter",
      "description": "=== operator"
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
    "?": {
      "type": "other",
      "source": "tree-sitter",
      "description": "? operator"
    },
    "?:": {
      "type": "other",
      "source": "tree-sitter",
      "description": "?: operator"
    },
    "||": {
      "type": "logical",
      "source": "tree-sitter",
      "description": "|| operator"
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "punctuation",
  "__section_03_title": "【SECTION 03】Kotlin Punctuation",
  "__section_03_language": "Kotlin",
  "__section_03_total_items": 14,
  "__section_03_description": "Punctuation marks and separators",
  "__section_03_purpose": "Define punctuation for code structure",
  "__section_03_responsibility": "Handle punctuation for tokenization",
  "__section_03_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",
  "punctuation": {
    "$": {
      "type": "other",
      "source": "tree-sitter",
      "description": "$ punctuation"
    },
    "${": {
      "type": "other",
      "source": "tree-sitter",
      "description": "${ punctuation"
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
    "..": {
      "type": "other",
      "source": "tree-sitter",
      "description": ".. punctuation"
    },
    ";": {
      "type": "statement-end",
      "source": "tree-sitter",
      "description": "; punctuation"
    },
    "@": {
      "type": "other",
      "source": "tree-sitter",
      "description": "@ punctuation"
    },
    "[": {
      "type": "bracket",
      "source": "tree-sitter",
      "description": "[ punctuation"
    },
    "]": {
      "type": "bracket",
      "source": "tree-sitter",
      "description": "] punctuation"
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
  "__section_04_title": "【SECTION 04】Kotlin Comments",
  "__section_04_language": "Kotlin",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Kotlin",
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

export default kotlinGrammar;
