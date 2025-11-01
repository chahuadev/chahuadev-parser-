// Csharp Grammar - ES Module
// Auto-generated from external grammar source
// Binary-First Architecture: Grammar as Code

export const csharpGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "Csharp",
  "__grammar_version": "1.0.0",
  "__grammar_title": "Csharp Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for Csharp - Auto-converted from Tree-sitter",
  "__grammar_purpose": "Grammar definition for Csharp language tokenization and parsing",
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
  "__section_01_title": "【SECTION 01】Csharp Keywords",
  "__section_01_language": "Csharp",
  "__section_01_total_items": 141,
  "__section_01_description": "Reserved keywords in Csharp",
  "__section_01_purpose": "Define all keywords for Csharp tokenization",
  "__section_01_responsibility": "Handle keywords for tokenization",
  "__section_01_used_by": [
    "BlankPaperTokenizer",
    "GrammarIndex"
  ],
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "#!": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "#! keyword"
    },
    "Cdecl": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Cdecl keyword"
    },
    "Fastcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Fastcall keyword"
    },
    "Stdcall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Stdcall keyword"
    },
    "Thiscall": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "Thiscall keyword"
    },
    "_": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "_ keyword"
    },
    "__makeref": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__makeref keyword"
    },
    "__reftype": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__reftype keyword"
    },
    "__refvalue": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "__refvalue keyword"
    },
    "abstract": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "abstract keyword"
    },
    "add": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "add keyword"
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
    "annotations": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "annotations keyword"
    },
    "as": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "as keyword"
    },
    "ascending": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ascending keyword"
    },
    "assembly": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "assembly keyword"
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
    "base": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "base keyword"
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
    "by": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "by keyword"
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
    "checked": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "checked keyword"
    },
    "checksum": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "checksum keyword"
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
    "decimal": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "decimal keyword"
    },
    "default": {
      "category": "control",
      "source": "tree-sitter",
      "description": "default keyword"
    },
    "delegate": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "delegate keyword"
    },
    "descending": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "descending keyword"
    },
    "disable": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "disable keyword"
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
    "enable": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "enable keyword"
    },
    "enum": {
      "category": "type",
      "source": "tree-sitter",
      "description": "enum keyword"
    },
    "equals": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "equals keyword"
    },
    "event": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "event keyword"
    },
    "explicit": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "explicit keyword"
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
    "finally": {
      "category": "exception",
      "source": "tree-sitter",
      "description": "finally keyword"
    },
    "fixed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "fixed keyword"
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
    "foreach": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "foreach keyword"
    },
    "from": {
      "category": "module",
      "source": "tree-sitter",
      "description": "from keyword"
    },
    "get": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "get keyword"
    },
    "global": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "global keyword"
    },
    "goto": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "goto keyword"
    },
    "group": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "group keyword"
    },
    "hidden": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "hidden keyword"
    },
    "if": {
      "category": "control",
      "source": "tree-sitter",
      "description": "if keyword"
    },
    "implicit": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "implicit keyword"
    },
    "in": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "in keyword"
    },
    "init": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "init keyword"
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
    "internal": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "internal keyword"
    },
    "into": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "into keyword"
    },
    "is": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "is keyword"
    },
    "join": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "join keyword"
    },
    "let": {
      "category": "variable",
      "source": "tree-sitter",
      "description": "let keyword"
    },
    "lock": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "lock keyword"
    },
    "long": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "long keyword"
    },
    "managed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "managed keyword"
    },
    "method": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "method keyword"
    },
    "module": {
      "category": "module",
      "source": "tree-sitter",
      "description": "module keyword"
    },
    "namespace": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "namespace keyword"
    },
    "new": {
      "category": "class",
      "source": "tree-sitter",
      "description": "new keyword"
    },
    "nint": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nint keyword"
    },
    "not": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "not keyword"
    },
    "notnull": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "notnull keyword"
    },
    "nuint": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "nuint keyword"
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
    "on": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "on keyword"
    },
    "operator": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "operator keyword"
    },
    "or": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "or keyword"
    },
    "orderby": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "orderby keyword"
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
    "param": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "param keyword"
    },
    "params": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "params keyword"
    },
    "partial": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "partial keyword"
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
    "readonly": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "readonly keyword"
    },
    "record": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "record keyword"
    },
    "ref": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ref keyword"
    },
    "remove": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "remove keyword"
    },
    "required": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "required keyword"
    },
    "restore": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "restore keyword"
    },
    "return": {
      "category": "function",
      "source": "tree-sitter",
      "description": "return keyword"
    },
    "sbyte": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sbyte keyword"
    },
    "scoped": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "scoped keyword"
    },
    "sealed": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sealed keyword"
    },
    "select": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "select keyword"
    },
    "set": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "set keyword"
    },
    "short": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "short keyword"
    },
    "sizeof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "sizeof keyword"
    },
    "stackalloc": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "stackalloc keyword"
    },
    "static": {
      "category": "modifier",
      "source": "tree-sitter",
      "description": "static keyword"
    },
    "string": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "string keyword"
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
    "type": {
      "category": "type",
      "source": "tree-sitter",
      "description": "type keyword"
    },
    "typeof": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "typeof keyword"
    },
    "typevar": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "typevar keyword"
    },
    "uint": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "uint keyword"
    },
    "ulong": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ulong keyword"
    },
    "unchecked": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unchecked keyword"
    },
    "unmanaged": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unmanaged keyword"
    },
    "unsafe": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "unsafe keyword"
    },
    "ushort": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "ushort keyword"
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
    "virtual": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "virtual keyword"
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
    "warning": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "warning keyword"
    },
    "warnings": {
      "category": "keyword",
      "source": "tree-sitter",
      "description": "warnings keyword"
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
  "__section_02_title": "【SECTION 02】Csharp Operators",
  "__section_02_language": "Csharp",
  "__section_02_total_items": 44,
  "__section_02_description": "All operators in Csharp",
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
    "?": {
      "type": "other",
      "source": "tree-sitter",
      "description": "? operator"
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
    "~": {
      "type": "other",
      "source": "tree-sitter",
      "description": "~ operator"
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "punctuation",
  "__section_03_title": "【SECTION 03】Csharp Punctuation",
  "__section_03_language": "Csharp",
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
    "\"\"": {
      "type": "other",
      "source": "tree-sitter",
      "description": "\"\" punctuation"
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
    "@\"": {
      "type": "other",
      "source": "tree-sitter",
      "description": "@\" punctuation"
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
  "__section_04_title": "【SECTION 04】Csharp Comments",
  "__section_04_language": "Csharp",
  "__section_04_total_items": 2,
  "__section_04_description": "Comment syntax for Csharp",
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

export default csharpGrammar;
