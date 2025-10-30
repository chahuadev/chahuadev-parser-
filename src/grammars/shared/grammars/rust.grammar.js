// Rust Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const rustGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Rust",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Rust Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Rust - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Rust language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Rust Keywords",
  "__section_01_language": "Rust",
  "__section_01_total_items": 79,
  "__section_01_description": "Reserved keywords in Rust",
  "__section_01_purpose": "Define all keywords for Rust tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "..=": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "..= keyword"
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
    "b": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "b keyword"
    },
    "block": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "block keyword"
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
    "char": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "char keyword"
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
    "crate": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "crate keyword"
    },
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
    },
    "dyn": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "dyn keyword"
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
    "expr": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "expr keyword"
    },
    "expr_2021": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "expr_2021 keyword"
    },
    "extern": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "extern keyword"
    },
    "f32": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "f32 keyword"
    },
    "f64": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "f64 keyword"
    },
    "false": {
      "category": "literal",
      "source": "tree-sitter",
      "description": "false keyword"
    },
    "fn": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fn keyword"
    },
    "for": {
      "category": "iteration",
      "source": "tree-sitter",
      "description": "for keyword"
    },
    "gen": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "gen keyword"
    },
    "i128": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i128 keyword"
    },
    "i16": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i16 keyword"
    },
    "i32": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i32 keyword"
    },
    "i64": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i64 keyword"
    },
    "i8": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "i8 keyword"
    },
    "ident": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ident keyword"
    },
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "impl": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "impl keyword"
    },
    "in": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "in keyword"
    },
    "isize": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "isize keyword"
    },
    "item": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "item keyword"
    },
    "let": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "let keyword"
    },
    "lifetime": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "lifetime keyword"
    },
    "literal": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "literal keyword"
    },
    "loop": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "loop keyword"
    },
    "macro_rules!": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "macro_rules! keyword"
    },
    "match": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "match keyword"
    },
    "meta": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "meta keyword"
    },
    "mod": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "mod keyword"
    },
    "move": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "move keyword"
    },
    "mut": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "mut keyword"
    },
    "pat": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "pat keyword"
    },
    "pat_param": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "pat_param keyword"
    },
    "path": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "path keyword"
    },
    "pub": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "pub keyword"
    },
    "raw": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "raw keyword"
    },
    "ref": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ref keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "self": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "self keyword"
    },
    "static": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "static keyword"
    },
    "stmt": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "stmt keyword"
    },
    "str": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "str keyword"
    },
    "struct": {
      "category": "type",
      "source": "tree-sitter",
      "description": "struct keyword"
    },
    "super": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "super keyword"
    },
    "trait": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "trait keyword"
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
    "tt": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "tt keyword"
    },
    "ty": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ty keyword"
    },
    "type": {
      "category": "type",
      "source": "tree-sitter",
      "description": "type keyword"
    },
    "u128": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u128 keyword"
    },
    "u16": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u16 keyword"
    },
    "u32": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u32 keyword"
    },
    "u64": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u64 keyword"
    },
    "u8": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "u8 keyword"
    },
    "union": {
      "category": "type",
      "source": "tree-sitter",
      "description": "union keyword"
    },
    "unsafe": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unsafe keyword"
    },
    "use": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "use keyword"
    },
    "usize": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "usize keyword"
    },
    "vis": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "vis keyword"
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
  "__section_02_title": "【SECTION 02】Rust Operators",
  "__section_02_language": "Rust",
  "__section_02_total_items": 38,
  "__section_02_description": "All operators in Rust",
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
    "*/": {
      "type": "other",
      "source": "tree-sitter",
      "description": "*/ operator"
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
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "punctuation",
  "__section_03_title": "【SECTION 03】Rust Punctuation",
  "__section_03_language": "Rust",
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
  }
};

export default rustGrammar;
