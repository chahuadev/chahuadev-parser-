// Go Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const goGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Go",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Go Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Go - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Go language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Go Keywords",
  "__section_01_language": "Go",
  "__section_01_total_items": 51,
  "__section_01_description": "Reserved keywords in Go",
  "__section_01_purpose": "Define all keywords for Go tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "B": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "B keyword"
    },
    "E": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "E keyword"
    },
    "O": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "O keyword"
    },
    "P": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "P keyword"
    },
    "U": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "U keyword"
    },
    "X": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "X keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "a": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "a keyword"
    },
    "b": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "b keyword"
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
    "chan": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "chan keyword"
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
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
    },
    "defer": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "defer keyword"
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
    "f": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "f keyword"
    },
    "fallthrough": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fallthrough keyword"
    },
    "false": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "false keyword"
    },
    "for": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "for keyword"
    },
    "func": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "func keyword"
    },
    "go": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "go keyword"
    },
    "goto": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "goto keyword"
    },
    "i": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i keyword"
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
    "interface": {
      "category": "class",
      "source": "tree-sitter",
      "description": "interface keyword"
    },
    "iota": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "iota keyword"
    },
    "make": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "make keyword"
    },
    "map": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "map keyword"
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
    "nil": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "nil keyword"
    },
    "o": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "o keyword"
    },
    "p": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "p keyword"
    },
    "package": {
      "category": "module",
      "source": "tree-sitter",
      "description": "package keyword"
    },
    "r": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "r keyword"
    },
    "range": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "range keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "select": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "select keyword"
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
    "t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "t keyword"
    },
    "true": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "true keyword"
    },
    "type": {
      "category": "type",
      "source": "tree-sitter",
      "description": "type keyword"
    },
    "u": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u keyword"
    },
    "v": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "v keyword"
    },
    "var": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "var keyword"
    },
    "x": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "x keyword"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "operators",
  "__section_02_title": "【SECTION 02】Go Operators",
  "__section_02_language": "Go",
  "__section_02_total_items": 40,
  "__section_02_description": "All operators in Go",
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
    "&^": {
      "type": "other",
      "source": "tree-sitter",
      "description": "&^ operator"
    },
    "&^=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "&^= operator"
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
    ":=": {
      "type": "other",
      "source": "tree-sitter",
      "description": ":= operator"
    },
    "<": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "< operator"
    },
    "<-": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<- operator"
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
  "__section_03_title": "【SECTION 03】Go Punctuation",
  "__section_03_language": "Go",
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
  "__section_04_title": "【SECTION 04】Go Comments",
  "__section_04_language": "Go",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Go",
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

export default goGrammar;
