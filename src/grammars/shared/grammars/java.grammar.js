// Java Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const javaGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Java",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Java Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Java - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Java language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Java Keywords",
  "__section_01_language": "Java",
  "__section_01_total_items": 77,
  "__section_01_description": "Reserved keywords in Java",
  "__section_01_purpose": "Define all keywords for Java tokenization",
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
    "@interface": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "@interface keyword"
    },
    "L": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "L keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "abstract": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "abstract keyword"
    },
    "assert": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "assert keyword"
    },
    "boolean": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "boolean keyword"
    },
    "break": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "break keyword"
    },
    "byte": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "byte keyword"
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
    "char": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char keyword"
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
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
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
    "exports": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "exports keyword"
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
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "implements": {
      "category": "class",
      "source": "tree-sitter",
      "description": "implements keyword"
    },
    "import": {
      "category": "module",
      "source": "tree-sitter",
      "description": "import keyword"
    },
    "instanceof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "instanceof keyword"
    },
    "int": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int keyword"
    },
    "interface": {
      "category": "class",
      "source": "tree-sitter",
      "description": "interface keyword"
    },
    "l": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "l keyword"
    },
    "long": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "long keyword"
    },
    "module": {
      "category": "module",
      "source": "tree-sitter",
      "description": "module keyword"
    },
    "native": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "native keyword"
    },
    "new": {
      "category": "class",
      "source": "tree-sitter",
      "description": "new keyword"
    },
    "non-sealed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "non-sealed keyword"
    },
    "null": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "null keyword"
    },
    "open": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "open keyword"
    },
    "opens": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "opens keyword"
    },
    "package": {
      "category": "module",
      "source": "tree-sitter",
      "description": "package keyword"
    },
    "permits": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "permits keyword"
    },
    "private": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "private keyword"
    },
    "protected": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "protected keyword"
    },
    "provides": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "provides keyword"
    },
    "public": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "public keyword"
    },
    "record": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "record keyword"
    },
    "requires": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "requires keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "sealed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sealed keyword"
    },
    "short": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "short keyword"
    },
    "static": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "static keyword"
    },
    "strictfp": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "strictfp keyword"
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
    "synchronized": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "synchronized keyword"
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
    "throws": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "throws keyword"
    },
    "to": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "to keyword"
    },
    "transient": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "transient keyword"
    },
    "transitive": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "transitive keyword"
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
    "uses": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uses keyword"
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
    "when": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "when keyword"
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
  "__section_02_title": "【SECTION 02】Java Operators",
  "__section_02_language": "Java",
  "__section_02_total_items": 41,
  "__section_02_description": "All operators in Java",
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
  "__section_03_title": "【SECTION 03】Java Punctuation",
  "__section_03_language": "Java",
  "__section_03_total_items": 16,
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
    "\"\"\"": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\"\"\" punctuation"
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
    "\\{": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\\{ punctuation"
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
  "__section_04_title": "【SECTION 04】Java Comments",
  "__section_04_language": "Java",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Java",
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

export default javaGrammar;
