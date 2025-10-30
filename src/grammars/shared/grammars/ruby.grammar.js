// Ruby Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const rubyGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Ruby",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Ruby Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Ruby - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Ruby language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Ruby Keywords",
  "__section_01_language": "Ruby",
  "__section_01_total_items": 49,
  "__section_01_description": "Reserved keywords in Ruby",
  "__section_01_purpose": "Define all keywords for Ruby tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "&.": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "&. keyword"
    },
    "+@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "+@ keyword"
    },
    "-@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "-@ keyword"
    },
    "BEGIN": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "BEGIN keyword"
    },
    "END": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "END keyword"
    },
    "[]=": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "[]= keyword"
    },
    "__ENCODING__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__ENCODING__ keyword"
    },
    "__FILE__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__FILE__ keyword"
    },
    "__LINE__": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__LINE__ keyword"
    },
    "alias": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "alias keyword"
    },
    "and": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "and keyword"
    },
    "begin": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "begin keyword"
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
    "def": {
      "category": "function",
      "source": "tree-sitter",
      "description": "def keyword"
    },
    "defined?": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "defined? keyword"
    },
    "do": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "do keyword"
    },
    "else": {
      "category": "control",
      "source": "tree-sitter",
      "description": "else keyword"
    },
    "elsif": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "elsif keyword"
    },
    "end": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "end keyword"
    },
    "ensure": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ensure keyword"
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
    "in": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "in keyword"
    },
    "module": {
      "category": "module",
      "source": "tree-sitter",
      "description": "module keyword"
    },
    "next": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "next keyword"
    },
    "nil": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "nil keyword"
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
    "r": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "r keyword"
    },
    "redo": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "redo keyword"
    },
    "rescue": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "rescue keyword"
    },
    "retry": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "retry keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "ri": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ri keyword"
    },
    "self": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "self keyword"
    },
    "super": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super keyword"
    },
    "then": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "then keyword"
    },
    "true": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "true keyword"
    },
    "undef": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "undef keyword"
    },
    "unless": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unless keyword"
    },
    "until": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "until keyword"
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
    "yield": {
      "category": "function",
      "source": "tree-sitter",
      "description": "yield keyword"
    },
    "~@": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "~@ keyword"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "operators",
  "__section_02_title": "【SECTION 02】Ruby Operators",
  "__section_02_language": "Ruby",
  "__section_02_total_items": 44,
  "__section_02_description": "All operators in Ruby",
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
    "!~": {
      "type": "other",
      "source": "tree-sitter",
      "description": "!~ operator"
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
    "<=>": {
      "type": "other",
      "source": "tree-sitter",
      "description": "<=> operator"
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
    "=~": {
      "type": "other",
      "source": "tree-sitter",
      "description": "=~ operator"
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
  "__section_03_title": "【SECTION 03】Ruby Punctuation",
  "__section_03_language": "Ruby",
  "__section_03_total_items": 18,
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
    "#{": {
      "type": "other",
      "source": "tree-sitter",
      "description": "#{ punctuation"
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
    "@@": {
      "type": "other",
      "source": "tree-sitter",
      "description": "@@ punctuation"
    },
    "[": {
      "type": "bracket",
      "source": "tree-sitter",
      "description": "[ punctuation"
    },
    "[]": {
      "type": "other",
      "source": "tree-sitter",
      "description": "[] punctuation"
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
  }
};

export default rubyGrammar;
