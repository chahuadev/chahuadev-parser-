// Javascript Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const javascriptGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Javascript",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Javascript Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Javascript - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Javascript language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Javascript Keywords",
  "__section_01_language": "Javascript",
  "__section_01_total_items": 60,
  "__section_01_description": "Reserved keywords in Javascript",
  "__section_01_purpose": "Define all keywords for Javascript tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "0B": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0B keyword"
    },
    "0O": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0O keyword"
    },
    "0X": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0X keyword"
    },
    "0b": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0b keyword"
    },
    "0o": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0o keyword"
    },
    "0x": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0x keyword"
    },
    "?.": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "?. keyword"
    },
    "E": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "E keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "as": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "as keyword"
    },
    "async": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "async keyword"
    },
    "await": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "await keyword"
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
    "const": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "const keyword"
    },
    "continue": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "continue keyword"
    },
    "debugger": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "debugger keyword"
    },
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
    },
    "delete": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "delete keyword"
    },
    "do": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "do keyword"
    },
    "e": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "e keyword"
    },
    "else": {
      "category": "control",
      "source": "tree-sitter",
      "description": "else keyword"
    },
    "export": {
      "category": "module",
      "source": "tree-sitter",
      "description": "export keyword"
    },
    "extends": {
      "category": "class",
      "source": "tree-sitter",
      "description": "extends keyword"
    },
    "false": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "false keyword"
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
    "from": {
      "category": "module",
      "source": "tree-sitter",
      "description": "from keyword"
    },
    "function": {
      "category": "function",
      "source": "tree-sitter",
      "description": "function keyword"
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
    "instanceof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "instanceof keyword"
    },
    "let": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "let keyword"
    },
    "meta": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "meta keyword"
    },
    "n": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "n keyword"
    },
    "new": {
      "category": "class",
      "source": "tree-sitter",
      "description": "new keyword"
    },
    "null": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "null keyword"
    },
    "of": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "of keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "set": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "set keyword"
    },
    "static": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "static keyword"
    },
    "super": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super keyword"
    },
    "switch": {
      "category": "control",
      "source": "tree-sitter",
      "description": "switch keyword"
    },
    "target": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "target keyword"
    },
    "this": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "this keyword"
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
    "typeof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "typeof keyword"
    },
    "undefined": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "undefined keyword"
    },
    "using": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "using keyword"
    },
    "var": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "var keyword"
    },
    "void": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "void keyword"
    },
    "while": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "while keyword"
    },
    "with": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "with keyword"
    },
    "yield": {
      "category": "function",
      "source": "tree-sitter",
      "description": "yield keyword"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "operators",
  "__section_02_title": "【SECTION 02】Javascript Operators",
  "__section_02_language": "Javascript",
  "__section_02_total_items": 49,
  "__section_02_description": "All operators in Javascript",
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
    "&&=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "&&= operator"
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
    "**": {
      "type": "other",
      "source": "tree-sitter",
      "description": "** operator"
    },
    "**=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "**= operator"
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
    "/>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "/> operator"
    },
    ":": {
      "type": "other",
      "source": "tree-sitter",
      "description": ": operator"
    },
    "<": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "< operator"
    },
    "</": {
      "type": "other",
      "source": "tree-sitter",
      "description": "</ operator"
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
    "===": {
      "type": "other",
      "source": "tree-sitter",
      "description": "=== operator"
    },
    "=>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "=> operator"
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
    ">>>": {
      "type": "other",
      "source": "tree-sitter",
      "description": ">>> operator"
    },
    ">>>=": {
      "type": "other",
      "source": "tree-sitter",
      "description": ">>>= operator"
    },
    "??": {
      "type": "other",
      "source": "tree-sitter",
      "description": "?? operator"
    },
    "??=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "??= operator"
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
    "||=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "||= operator"
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
  "__section_03_title": "【SECTION 03】Javascript Punctuation",
  "__section_03_language": "Javascript",
  "__section_03_total_items": 17,
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
    "#": {
      "type": "other",
      "source": "tree-sitter",
      "description": "# punctuation"
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
    "`": {
      "type": "other",
      "source": "tree-sitter",
      "description": "` punctuation"
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
  "__section_04_title": "【SECTION 04】Javascript Comments",
  "__section_04_language": "Javascript",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Javascript",
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

export default javascriptGrammar;
