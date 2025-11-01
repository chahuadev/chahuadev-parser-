// Python Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const pythonGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Python",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Python Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Python - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Python language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Python Keywords",
  "__section_01_language": "Python",
  "__section_01_total_items": 49,
  "__section_01_description": "Reserved keywords in Python",
  "__section_01_purpose": "Define all keywords for Python tokenization",
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
    "@=": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "@= keyword"
    },
    "False": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "False keyword"
    },
    "None": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "None keyword"
    },
    "True": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "True keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "__future__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__future__ keyword"
    },
    "and": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "and keyword"
    },
    "as": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "as keyword"
    },
    "assert": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "assert keyword"
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
    "class": {
      "category": "class",
      "source": "tree-sitter",
      "description": "class keyword"
    },
    "continue": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "continue keyword"
    },
    "def": {
      "category": "function",
      "source": "tree-sitter",
      "description": "def keyword"
    },
    "del": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "del keyword"
    },
    "elif": {
      "category": "control",
      "source": "tree-sitter",
      "description": "elif keyword"
    },
    "else": {
      "category": "control",
      "source": "tree-sitter",
      "description": "else keyword"
    },
    "except": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "except keyword"
    },
    "exec": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "exec keyword"
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
    "global": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "global keyword"
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
    "is": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "is keyword"
    },
    "lambda": {
      "category": "function",
      "source": "tree-sitter",
      "description": "lambda keyword"
    },
    "match": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "match keyword"
    },
    "nonlocal": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "nonlocal keyword"
    },
    "not": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "not keyword"
    },
    "or": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "or keyword"
    },
    "pass": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "pass keyword"
    },
    "print": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "print keyword"
    },
    "raise": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "raise keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "try": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "try keyword"
    },
    "type": {
      "category": "type",
      "source": "tree-sitter",
      "description": "type keyword"
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
  "__section_02_title": "【SECTION 02】Python Operators",
  "__section_02_language": "Python",
  "__section_02_total_items": 36,
  "__section_02_description": "All operators in Python",
  "__section_02_purpose": "Define operators for expression parsing",
  "__section_02_responsibility": "Handle operators for tokenization",
  "__section_02_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",
  "operators": {
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
    "//=": {
      "type": "other",
      "source": "tree-sitter",
      "description": "//= operator"
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
    "<>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<> operator"
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
    "~": {
      "type": "other",
      "source": "tree-sitter",
      "description": "~ operator"
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "punctuation",
  "__section_03_title": "【SECTION 03】Python Punctuation",
  "__section_03_language": "Python",
  "__section_03_total_items": 13,
  "__section_03_description": "Punctuation marks and separators",
  "__section_03_purpose": "Define punctuation for code structure",
  "__section_03_responsibility": "Handle punctuation for tokenization",
  "__section_03_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",
  "punctuation": {
    "#": {
      "type": "other",
      "source": "tree-sitter",
      "description": "# punctuation"
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
  "__section_04_title": "【SECTION 04】Python Comments",
  "__section_04_language": "Python",
  "__section_04_total_items": 3,
  "__section_04_description": "Comment syntax for Python",
  "__section_04_purpose": "Define comment patterns for tokenizer to skip",
  "__section_04_responsibility": "Handle comments for tokenization",
  "__section_04_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",
  "comments": {
    "#": {
      "type": "line",
      "pattern": "#",
      "description": "Single-line comment",
      "endPattern": "\\n"
    },
    "\"\"\"": {
      "type": "block",
      "pattern": "\"\"\"",
      "description": "Multi-line string/docstring",
      "endPattern": "\"\"\""
    },
    "'''": {
      "type": "block",
      "pattern": "'''",
      "description": "Multi-line string/docstring",
      "endPattern": "'''"
    }
  }
};

export default pythonGrammar;
