// Swift Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const swiftGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Swift",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Swift Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Swift - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Swift language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Swift Keywords",
  "__section_01_language": "Swift",
  "__section_01_total_items": 118,
  "__section_01_description": "Reserved keywords in Swift",
  "__section_01_purpose": "Define all keywords for Swift tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "..<": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "..< keyword"
    },
    "0x": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "0x keyword"
    },
    "@autoclosure": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "@autoclosure keyword"
    },
    "@escaping": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "@escaping keyword"
    },
    "Protocol": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Protocol keyword"
    },
    "Type": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Type keyword"
    },
    "^{": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "^{ keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "_modify": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_modify keyword"
    },
    "actor": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "actor keyword"
    },
    "any": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "any keyword"
    },
    "arch": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "arch keyword"
    },
    "associatedtype": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "associatedtype keyword"
    },
    "async": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "async keyword"
    },
    "available": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "available keyword"
    },
    "await": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "await keyword"
    },
    "borrowing": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "borrowing keyword"
    },
    "break": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "break keyword"
    },
    "canImport": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "canImport keyword"
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
    "colorLiteral": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "colorLiteral keyword"
    },
    "column": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "column keyword"
    },
    "compiler": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "compiler keyword"
    },
    "consuming": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "consuming keyword"
    },
    "continue": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "continue keyword"
    },
    "convenience": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "convenience keyword"
    },
    "deinit": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "deinit keyword"
    },
    "delegate": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "delegate keyword"
    },
    "didSet": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "didSet keyword"
    },
    "distributed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "distributed keyword"
    },
    "do": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "do keyword"
    },
    "dsohandle": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "dsohandle keyword"
    },
    "dynamic": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "dynamic keyword"
    },
    "each": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "each keyword"
    },
    "enum": {
      "category": "type",
      "source": "tree-sitter",
      "description": "enum keyword"
    },
    "extension": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "extension keyword"
    },
    "externalMacro": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "externalMacro keyword"
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
    "file": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "file keyword"
    },
    "fileID": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fileID keyword"
    },
    "fileLiteral": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fileLiteral keyword"
    },
    "filePath": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "filePath keyword"
    },
    "fileprivate": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fileprivate keyword"
    },
    "final": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "final keyword"
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
    "getter:": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "getter: keyword"
    },
    "guard": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "guard keyword"
    },
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "imageLiteral": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "imageLiteral keyword"
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
    "indirect": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "indirect keyword"
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
    "inout": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "inout keyword"
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
    "keyPath": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "keyPath keyword"
    },
    "lazy": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "lazy keyword"
    },
    "let": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "let keyword"
    },
    "line": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "line keyword"
    },
    "macro": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "macro keyword"
    },
    "mutating": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "mutating keyword"
    },
    "nil": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "nil keyword"
    },
    "nonisolated": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nonisolated keyword"
    },
    "nonmutating": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nonmutating keyword"
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
    "optional": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "optional keyword"
    },
    "os": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "os keyword"
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
    "postfix": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "postfix keyword"
    },
    "precedencegroup": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "precedencegroup keyword"
    },
    "prefix": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "prefix keyword"
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
    "protocol": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "protocol keyword"
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
    "repeat": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "repeat keyword"
    },
    "required": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "required keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "selector": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "selector keyword"
    },
    "self": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "self keyword"
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
    "setter:": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "setter: keyword"
    },
    "some": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "some keyword"
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
    "subscript": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "subscript keyword"
    },
    "super": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super keyword"
    },
    "swift": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "swift keyword"
    },
    "switch": {
      "category": "control",
      "source": "tree-sitter",
      "description": "switch keyword"
    },
    "targetEnvironment": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "targetEnvironment keyword"
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
    "u": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u keyword"
    },
    "unavailable": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unavailable keyword"
    },
    "unowned": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unowned keyword"
    },
    "unowned(safe)": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unowned(safe) keyword"
    },
    "unowned(unsafe)": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unowned(unsafe) keyword"
    },
    "unused1": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unused1 keyword"
    },
    "unused2": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unused2 keyword"
    },
    "var": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "var keyword"
    },
    "weak": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "weak keyword"
    },
    "while": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "while keyword"
    },
    "willSet": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "willSet keyword"
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
  "__section_02_title": "【SECTION 02】Swift Operators",
  "__section_02_language": "Swift",
  "__section_02_total_items": 29,
  "__section_02_description": "All operators in Swift",
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
    "<=": {
      "type": "comparison",
      "source": "tree-sitter",
      "description": "<= operator"
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
    ">>": {
      "type": "other",
      "source": "tree-sitter",
      "description": ">> operator"
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
    "|": {
      "type": "other",
      "source": "tree-sitter",
      "description": "| operator"
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
  "__section_03_title": "【SECTION 03】Swift Punctuation",
  "__section_03_language": "Swift",
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
    "$": {
      "type": "other",
      "source": "tree-sitter",
      "description": "$ punctuation"
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
    "\\(": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\\( punctuation"
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
  "__section_04_title": "【SECTION 04】Swift Comments",
  "__section_04_language": "Swift",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Swift",
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

export default swiftGrammar;
