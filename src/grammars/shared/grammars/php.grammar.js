// Php Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const phpGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Php",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Php Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Php - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Php language tokenization and parsing",
  "__grammar_total_sections": 3,
  "__grammar_sections": [
    "keywords",
    "operators",
    "punctuation"
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
  "__section_01_title": "【SECTION 01】Php Keywords",
  "__section_01_language": "Php",
  "__section_01_total_items": 19,
  "__section_01_description": "Reserved keywords in Php",
  "__section_01_purpose": "Define all keywords for Php tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    ".=": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": ".= keyword"
    },
    "\\u": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "\\u keyword"
    },
    "array": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "array keyword"
    },
    "bool": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "bool keyword"
    },
    "e": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "e keyword"
    },
    "encoding": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "encoding keyword"
    },
    "f": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "f keyword"
    },
    "float": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "float keyword"
    },
    "int": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "int keyword"
    },
    "n": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "n keyword"
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
    "r": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "r keyword"
    },
    "strict_types": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "strict_types keyword"
    },
    "string": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "string keyword"
    },
    "t": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "t keyword"
    },
    "ticks": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ticks keyword"
    },
    "unset": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unset keyword"
    },
    "v": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "v keyword"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "operators",
  "__section_02_title": "【SECTION 02】Php Operators",
  "__section_02_language": "Php",
  "__section_02_total_items": 52,
  "__section_02_description": "All operators in Php",
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
    "<<<": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<<< operator"
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
    "<=>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<=> operator"
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
    "?": {
      "type": "other",
      "source": "tree-sitter",
      "description": "? operator"
    },
    "?->": {
      "type": "other",
      "source": "tree-sitter",
      "description": "?-> operator"
    },
    "?>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "?> operator"
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
    "|>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "|> operator"
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
  "__section_03_title": "【SECTION 03】Php Punctuation",
  "__section_03_language": "Php",
  "__section_03_total_items": 20,
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
    "#[": {
      "type": "other",
      "source": "tree-sitter",
      "description": "#[ punctuation"
    },
    "$": {
      "type": "other",
      "source": "tree-sitter",
      "description": "$ punctuation"
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
    "\\'": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\\' punctuation"
    },
    "\\\\": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\\\\ punctuation"
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
  }
};

export default phpGrammar;
