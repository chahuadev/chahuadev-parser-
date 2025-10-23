// JavaScript Grammar - ES Module
// Auto-generated from javascript.grammar.json
// Binary-First Architecture: Grammar as Code

export const javascriptGrammar = {
  "__grammar_header": "══════════════════════════════════════════════════════════════════════════════",
  "__grammar_language": "JavaScript",
  "__grammar_version": "ES2024 (ECMAScript 2024)",
  "__grammar_title": "JavaScript Language Grammar Definition",
  "__grammar_description": "Complete grammar rules for JavaScript - Keywords, Literals, Operators, Punctuation",
  "__grammar_purpose": "ให้ GrammarIndex (Brain) รู้จักทุก syntax elements ของภาษา JavaScript เพื่อ classify tokens อย่างถูกต้อง",
  "__grammar_total_sections": 5,
  "__grammar_sections": [
    "keywords",
    "literals",
    "operators",
    "punctuation",
    "tokenMetadata"
  ],
  "__grammar_used_by": [
    "GrammarIndex",
    "JavaScriptParser",
    "TokenClassifier",
    "ESLint"
  ],
  "__grammar_footer": "══════════════════════════════════════════════════════════════════════════════",
  "__section_01": "══════════════════════════════════════════════════════════════════════════════",
  "__section_01_number": "01",
  "__section_01_name": "keywords",
  "__section_01_title": "【SECTION 01】JavaScript Keywords & Reserved Words",
  "__section_01_language": "JavaScript",
  "__section_01_total_items": 75,
  "__section_01_description": "Complete JavaScript keywords: ES1-ES2024, strict mode, contextual, futureReserved, and futureReservedOldECMA (Java-inspired)",
  "__section_01_purpose": "กำหนด keywords ทั้งหมดของ JavaScript รวมถึง reserved words จาก ES3 ที่ inspired จาก Java เพื่อให้ Grammar สมบูรณ์ 100%",
  "__section_01_responsibility": "ให้ Brain รู้ว่า keyword แต่ละตัวมาจาก ES version ไหน, ใช้ใน context ไหน, strict mode หรือไม่, และเป็น futureReserved หรือไม่",
  "__section_01_used_by": [
    "KeywordRecognizer",
    "ContextAnalyzer",
    "StrictModeValidator"
  ],
  "__section_01_notes": "รวม 16 futureReservedOldECMA keywords (abstract, boolean, byte, char, double, final, float, goto, int, long, native, short, synchronized, throws, transient, volatile) เพื่อเป็น Base Grammar สำหรับ C-Family languages",
  "__section_01_footer": "══════════════════════════════════════════════════════════════════════════════",
  "keywords": {
    "if": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Conditional statement - executes code based on condition",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN",
        "else"
      ],
      "parentContext": [
        "BlockStatement",
        "IfStatement",
        "Program",
        "FunctionBody"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "canBeNested": true,
      "isStatement": true,
      "isControl": true,
      "requiresCondition": true,
      "canHaveElse": true,
      "hoisted": false,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "if statement vs ternary operator",
          "contexts": [
            "if (condition) { ... } // if statement",
            "condition ? a : b // ternary operator"
          ]
        },
        {
          "language": "JavaScript",
          "rule": "Dangling else problem",
          "note": "else associates with nearest unmatched if",
          "example": "if (a) if (b) x; else y; // else belongs to inner if"
        }
      ],
      "errorMessage": "An 'if' statement must be followed by a condition in parentheses '(condition)'.",
      "commonTypos": [
        "fi",
        "iif",
        "iff",
        "iof"
      ],
      "notes": "Condition must be in parentheses. Body can be single statement or block.",
      "quirks": [
        "Condition is always evaluated (no short-circuit here)",
        "Truthy/falsy conversion applies",
        "Dangling else associates with nearest if",
        "Can be without braces (single statement)",
        "Prefer braces for clarity"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.6",
      "bestPractice": "Always use braces {}. Avoid deeply nested ifs.",
      "useCases": [
        "Conditional execution",
        "Guard clauses",
        "Early returns",
        "Validation logic"
      ],
      "example": "if (condition) { doSomething(); }",
      "ifElse": "if (x > 0) { ... } else { ... }",
      "ifElseIf": "if (x > 0) { ... } else if (x < 0) { ... } else { ... }",
      "withoutBraces": "if (x) return; // Valid but discouraged",
      "truthyFalsy": "if (0) // false, if (1) // true, if (\"\") // false"
    },
    "else": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Else clause - executes when if condition is false",
      "followedBy": [
        "BRACE_OPEN",
        "if",
        "IDENTIFIER",
        "Statement"
      ],
      "precededBy": [
        "BRACE_CLOSE",
        "Statement",
        "SEMICOLON"
      ],
      "parentContext": [
        "IfStatement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "requiresIf": true,
      "isStatement": true,
      "isControl": true,
      "canChain": true,
      "mustFollowIf": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "else if vs else + nested if",
          "contexts": [
            "else if (x) { ... } // else if (recommended)",
            "else { if (x) { ... } } // else + nested if"
          ],
          "note": "Both are equivalent, else if is preferred"
        },
        {
          "language": "JavaScript",
          "rule": "Dangling else problem",
          "resolution": "else matches nearest unmatched if",
          "example": "if (a) if (b) x; else y; // else belongs to inner if"
        }
      ],
      "errorMessage": "An 'else' statement must follow an 'if' statement and be followed by a block '{}' or another 'if'.",
      "commonTypos": [
        "esle",
        "eles",
        "lese",
        "els"
      ],
      "notes": "Must immediately follow if or else if. Associates with nearest if.",
      "quirks": [
        "Must follow if statement",
        "Dangling else ambiguity",
        "else if is syntactic sugar",
        "Can be without braces (not recommended)",
        "No condition needed"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.6",
      "bestPractice": "Use else if for multiple conditions. Always use braces.",
      "useCases": [
        "Alternative execution path",
        "Multiple conditions (else if)",
        "Default case",
        "Fallback logic"
      ],
      "example": "if (condition) { ... } else { ... }",
      "elseIf": "if (x > 0) { ... } else if (x < 0) { ... } else { ... }",
      "danglingElse": "if (a) if (b) x(); else y(); // else belongs to inner if",
      "addBraces": "if (a) { if (b) x(); } else { y(); } // Explicit grouping"
    },
    "switch": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Switch statement - multi-way branch based on value",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "Program",
        "FunctionBody"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "containsCases": true,
      "isStatement": true,
      "isControl": true,
      "requiresExpression": true,
      "requiresCases": true,
      "hasFallthrough": true,
      "strictComparison": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "switch vs if-else chain",
          "guideline": "Use switch for discrete values, if-else for ranges/complex conditions",
          "note": "switch uses strict equality (===)"
        },
        {
          "language": "JavaScript",
          "rule": "Fall-through behavior",
          "warning": "Cases fall through without break",
          "example": "case 1: doOne(); case 2: doTwo(); // Both execute for case 1!"
        }
      ],
      "errorMessage": "A 'switch' statement must be followed by a parenthesized expression and a block containing 'case' clauses.",
      "commonTypos": [
        "swtich",
        "swich",
        "swicth",
        "switc"
      ],
      "notes": "Uses strict equality (===). Cases fall through without break. Expression evaluated once.",
      "quirks": [
        "Strict equality (===) comparison",
        "Fall-through without break",
        "Expression evaluated once",
        "default can appear anywhere",
        "Block scoping with let/const",
        "Can switch on any type"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.12",
      "bestPractice": "Use break to prevent fall-through. Consider using object lookup for simple cases.",
      "useCases": [
        "Multiple discrete values",
        "State machines",
        "Command dispatch",
        "Menu selection"
      ],
      "example": "switch (value) { case 1: ...; break; default: ...; }",
      "fallthrough": "case 1: case 2: case 3: // Intentional fall-through",
      "blockScoping": "case 1: { let x = 1; } break; // Block for scoping",
      "alternatives": "Object lookup: const actions = { a: fn1, b: fn2 }; actions[key]();",
      "strictEquality": "switch(1) { case \"1\": // Not matched! }",
      "expressionEvaluation": "switch(fn()) // fn() called once only"
    },
    "case": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Case clause - matches specific value in switch",
      "followedBy": [
        "Expression",
        "LITERAL"
      ],
      "precededBy": [
        "BRACE_OPEN",
        "COLON",
        "break",
        "Statement",
        "NEWLINE"
      ],
      "parentContext": [
        "SwitchStatement"
      ],
      "requiresColon": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isClause": true,
      "requiresExpression": true,
      "canFallthrough": true,
      "onlyInSwitch": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "case in switch vs labeled statement",
          "contexts": [
            "switch(x) { case 1: ... } // switch case",
            "myLabel: statement; // labeled statement (different)"
          ]
        },
        {
          "language": "JavaScript",
          "rule": "Multiple case labels",
          "pattern": "case 1: case 2: case 3: shared code",
          "note": "Fall-through for multiple matches"
        }
      ],
      "errorMessage": "A 'case' clause must be followed by an expression and a colon ':'.",
      "commonTypos": [
        "caes",
        "csae",
        "cas",
        "cae"
      ],
      "notes": "Must be inside switch. Strict equality (===). Fall-through without break.",
      "quirks": [
        "Only valid inside switch",
        "Strict equality comparison",
        "Fall-through without break",
        "Can match expressions",
        "Multiple cases can share code",
        "No braces needed"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.12",
      "bestPractice": "Use break to prevent fall-through. Group related cases.",
      "useCases": [
        "Discrete value matching",
        "Multiple values  same action",
        "State machine transitions",
        "Command routing"
      ],
      "example": "case 1: doSomething(); break;",
      "multipleCases": "case 1: case 2: case 3: shared(); break;",
      "expressions": "case x + y: case fn(): // Valid expressions",
      "fallthrough": "case 1: doOne(); // Falls through to next case!",
      "withBlock": "case 1: { let x = 1; } break; // Block scoping"
    },
    "default": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Default clause - fallback in switch statement",
      "followedBy": [
        "COLON"
      ],
      "precededBy": [
        "BRACE_OPEN",
        "COLON",
        "break",
        "Statement",
        "NEWLINE"
      ],
      "parentContext": [
        "SwitchStatement"
      ],
      "requiresColon": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isClause": true,
      "isDefault": true,
      "catchAll": true,
      "onlyInSwitch": true,
      "maxOne": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "default in switch vs default export",
          "contexts": [
            "switch(x) { default: ... } // switch default",
            "export default X; // default export (different)"
          ]
        },
        {
          "language": "JavaScript",
          "rule": "default position",
          "note": "Can appear anywhere in switch, but conventionally last"
        }
      ],
      "errorMessage": "A 'default' clause must be followed by a colon ':'.",
      "commonTypos": [
        "defualt",
        "deafult",
        "deualt",
        "defalt"
      ],
      "notes": "Catch-all clause. Only one per switch. Can appear anywhere.",
      "quirks": [
        "Only valid inside switch",
        "Only one default per switch",
        "Can appear anywhere (not just last)",
        "Executes if no case matches",
        "Still falls through without break",
        "Optional but recommended"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.12",
      "bestPractice": "Always include default for completeness. Place at end by convention.",
      "useCases": [
        "Fallback case",
        "Error handling",
        "Unexpected value handling",
        "Completeness check"
      ],
      "example": "default: handleOther(); break;",
      "position": "case 1: break; default: break; case 2: break; // Valid but unusual",
      "noBreak": "default: doDefault(); // Falls through!",
      "withThrow": "default: throw new Error(\"Unexpected value\");"
    },
    "for": {
      "category": "iteration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "For loop - iteration with initialization, condition, increment",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "Program",
        "FunctionBody"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isLoop": true,
      "isStatement": true,
      "isIteration": true,
      "hasMultipleForms": true,
      "canUseBreak": true,
      "canUseContinue": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "Multiple for loop variants",
          "variants": [
            "for (init; condition; increment) // Classic for",
            "for (let item of iterable) // for-of (ES6)",
            "for (let key in object) // for-in",
            "for await (let item of asyncIterable) // for-await-of (ES2018)"
          ]
        },
        {
          "language": "JavaScript",
          "rule": "for-in vs for-of",
          "forIn": "Iterates over enumerable property keys",
          "forOf": "Iterates over iterable values",
          "example": "for (let k in arr) // indices. for (let v of arr) // values"
        }
      ],
      "errorMessage": "A 'for' loop must be followed by parentheses containing initialization, condition, and increment.",
      "commonTypos": [
        "fro",
        "ofr",
        "forr",
        "fo",
        "fr"
      ],
      "notes": "Three forms: classic, for-in, for-of. Each has different semantics.",
      "quirks": [
        "Classic: for (init; test; update)",
        "for-in: Iterates keys (including prototype)",
        "for-of: Iterates values (Symbol.iterator)",
        "All parts optional in classic for",
        "let/const scoping per iteration",
        "for-await-of for async iterables"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.7",
      "enhancements": {
        "ES6": "for-of loop",
        "ES2018": "for-await-of loop"
      },
      "bestPractice": "Use for-of for arrays, for-in with hasOwnProperty, classic for rare.",
      "useCases": [
        "Iteration with counter",
        "Object property iteration",
        "Array value iteration",
        "Async iteration"
      ],
      "example": "for (let i = 0; i < 10; i++) { ... }",
      "forOf": "for (const value of array) { ... }",
      "forIn": "for (const key in object) { if (obj.hasOwnProperty(key)) ... }",
      "forAwaitOf": "for await (const item of asyncIterable) { ... }",
      "infiniteLoop": "for (;;) { ... } // Infinite loop",
      "blockScoping": "for (let i = 0; i < 10; i++) // Fresh i each iteration"
    },
    "while": {
      "category": "iteration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "While loop - iteration while condition is true",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN",
        "do"
      ],
      "parentContext": [
        "BlockStatement",
        "Program",
        "FunctionBody",
        "DoWhileStatement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isLoop": true,
      "isStatement": true,
      "isIteration": true,
      "requiresCondition": true,
      "canUseBreak": true,
      "canUseContinue": true,
      "preTest": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "while vs do-while",
          "while": "Pre-test loop (may not execute)",
          "doWhile": "Post-test loop (executes at least once)",
          "example": "while (false) {} // Never runs. do {} while (false); // Runs once"
        }
      ],
      "errorMessage": "A 'while' loop must be followed by a condition in parentheses '(condition)'.",
      "commonTypos": [
        "whiel",
        "wihle",
        "whille",
        "wile",
        "whle"
      ],
      "notes": "Pre-test loop. Condition checked before each iteration. May not execute at all.",
      "quirks": [
        "Pre-test loop (condition before body)",
        "May execute zero times",
        "Condition must be truthy to continue",
        "Infinite loop: while (true)",
        "Common for event loops",
        "Can be replaced with for(;;)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.7",
      "bestPractice": "Use when iteration count is unknown. Ensure termination condition.",
      "useCases": [
        "Unknown iteration count",
        "Event loops",
        "Processing until condition met",
        "Polling"
      ],
      "example": "while (condition) { ... }",
      "infiniteLoop": "while (true) { ... break; }",
      "zeroIterations": "while (false) { /* Never runs */ }",
      "vsFor": "for (;;) {} // Equivalent to while (true)"
    },
    "do": {
      "category": "iteration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Do-while loop - executes at least once, then checks condition",
      "followedBy": [
        "BRACE_OPEN",
        "Statement"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "Program",
        "FunctionBody"
      ],
      "requiresWhile": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isLoop": true,
      "isStatement": true,
      "isIteration": true,
      "canUseBreak": true,
      "canUseContinue": true,
      "postTest": true,
      "guaranteedOnce": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "do-while vs while",
          "doWhile": "Post-test loop (at least once)",
          "while": "Pre-test loop (may skip)",
          "example": "do { ... } while (false); // Runs once!"
        }
      ],
      "errorMessage": "A 'do...while' loop must be followed by a block '{}' and then a 'while' condition.",
      "commonTypos": [
        "od",
        "doo",
        "dow"
      ],
      "notes": "Post-test loop. Body executes before condition check. Guarantees at least one execution.",
      "quirks": [
        "Post-test loop (body before condition)",
        "Always executes at least once",
        "Requires while after body",
        "Semicolon after while(condition)",
        "Less common than while",
        "Good for \"do once then maybe repeat\""
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.7",
      "bestPractice": "Use when body must execute at least once. Remember semicolon after while.",
      "useCases": [
        "Execute then check",
        "Input validation loops",
        "Menu systems",
        "Retry logic"
      ],
      "example": "do { ... } while (condition);",
      "guaranteedExecution": "do { console.log(\"Always runs\"); } while (false);",
      "semicolon": "do { ... } while (x < 10); // Semicolon required!",
      "vsWhile": "do { ... } while (condition); // At least once. while (condition) { ... } // Maybe zero"
    },
    "break": {
      "category": "iteration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Break statement - exits loop or switch",
      "followedBy": [
        "SEMICOLON",
        "IDENTIFIER",
        "LineTerminator",
        "NEWLINE"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "IterationStatement",
        "SwitchStatement",
        "LabeledStatement"
      ],
      "canHaveLabel": true,
      "startsExpr": false,
      "beforeExpr": false,
      "isStatement": true,
      "isJump": true,
      "exitsBlock": true,
      "requiresLoopOrSwitch": true,
      "noLineBreakBeforeLabel": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "break vs labeled break",
          "unlabeled": "Exits innermost loop/switch",
          "labeled": "Exits to specific label",
          "example": "outer: for (...) { inner: for (...) { break outer; } }"
        },
        {
          "language": "JavaScript",
          "rule": "break in switch vs loop",
          "switch": "Prevents fall-through",
          "loop": "Exits loop entirely",
          "note": "Same keyword, different semantics"
        }
      ],
      "errorMessage": "A 'break' statement must be inside a loop or switch statement.",
      "commonTypos": [
        "braek",
        "brak",
        "breka",
        "brek"
      ],
      "notes": "Exits innermost loop/switch. Can use label for outer loops. No line break before label.",
      "quirks": [
        "Exits innermost enclosing loop/switch",
        "Can use label to exit outer loop",
        "No line break before label name",
        "Not allowed in function",
        "switch: prevents fall-through",
        "Labeled break exits to label"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.9",
      "bestPractice": "Use unlabeled break for simple cases. Labeled break for nested loops.",
      "useCases": [
        "Exit loop early",
        "Prevent switch fall-through",
        "Exit nested loops",
        "Error conditions"
      ],
      "example": "break;",
      "labeled": "outer: for (...) { for (...) { break outer; } }",
      "inSwitch": "case 1: doSomething(); break;",
      "noLineBreak": "break\nlabel; // Error: label ignored (ASI inserts semicolon)"
    },
    "continue": {
      "category": "iteration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Continue statement - skips to next iteration",
      "followedBy": [
        "SEMICOLON",
        "IDENTIFIER",
        "LineTerminator",
        "NEWLINE"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "if"
      ],
      "parentContext": [
        "IterationStatement",
        "LabeledStatement"
      ],
      "canHaveLabel": true,
      "startsExpr": false,
      "beforeExpr": false,
      "isStatement": true,
      "isJump": true,
      "skipToNext": true,
      "requiresLoop": true,
      "noLineBreakBeforeLabel": true,
      "notInSwitch": "switch (x) { case 1: continue; /* Error! */ }",
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "continue vs labeled continue",
          "unlabeled": "Continues innermost loop",
          "labeled": "Continues to specific labeled loop",
          "example": "outer: for (...) { inner: for (...) { continue outer; } }"
        },
        {
          "language": "JavaScript",
          "rule": "continue vs break",
          "continue": "Skips to next iteration",
          "break": "Exits loop entirely",
          "note": "continue only in loops, not switch"
        }
      ],
      "errorMessage": "A 'continue' statement must be inside a loop.",
      "commonTypos": [
        "contine",
        "contineu",
        "contiue",
        "contineu",
        "cotinue"
      ],
      "notes": "Skips to next iteration. Only in loops, not switch. Can use label for outer loops.",
      "quirks": [
        "Only in loops (not switch)",
        "Skips to next iteration",
        "Can use label for outer loop",
        "No line break before label",
        "for loop: jumps to increment",
        "while/do-while: jumps to condition"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.8",
      "bestPractice": "Use for early return in loop body. Consider filter/map instead.",
      "useCases": [
        "Skip iteration",
        "Conditional processing",
        "Guard clauses in loops",
        "Continue to labeled loop"
      ],
      "example": "if (skip) continue;",
      "labeled": "outer: for (...) { for (...) { continue outer; } }",
      "inFor": "for (let i = 0; i < 10; i++) { if (i % 2) continue; /* even only */ }",
      "alternatives": "array.filter(x => condition).forEach(...) // Instead of continue"
    },
    "try": {
      "category": "exception",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "description": "Try block - error handling with catch/finally",
      "followedBy": [
        "BRACE_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_CLOSE",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "Program",
        "FunctionBody"
      ],
      "requiresCatchOrFinally": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isStatement": true,
      "isException": true,
      "canHaveBoth": true,
      "mustHaveBlock": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "try-catch-finally combinations",
          "valid": [
            "try { } catch (e) { }",
            "try { } finally { }",
            "try { } catch (e) { } finally { }"
          ],
          "invalid": "try { } // Must have catch or finally"
        },
        {
          "language": "JavaScript",
          "rule": "Optional catch binding (ES2019)",
          "legacy": "catch (error) { }",
          "modern": "catch { } // No binding needed"
        }
      ],
      "errorMessage": "A 'try' statement must be followed by a block '{}' and at least one 'catch' or 'finally' clause.",
      "commonTypos": [
        "tyr",
        "tri",
        "tryy",
        "trey"
      ],
      "notes": "Must have catch, finally, or both. ES2019+ allows catch without binding.",
      "quirks": [
        "Must have catch or finally (or both)",
        "try alone is invalid",
        "catch binding optional (ES2019+)",
        "finally always executes",
        "Return in finally overrides try/catch return",
        "Errors bubble up if not caught"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.15",
      "enhancements": {
        "ES2019": "Optional catch binding"
      },
      "bestPractice": "Always catch specific errors. Use finally for cleanup. Avoid catch-all.",
      "useCases": [
        "Error handling",
        "Resource cleanup",
        "Async error handling",
        "Fallback logic"
      ],
      "example": "try { riskyOperation(); } catch (error) { handleError(error); }",
      "withFinally": "try { ... } catch (e) { ... } finally { cleanup(); }",
      "optionalBinding": "try { JSON.parse(str); } catch { /* ES2019+ */ }",
      "onlyFinally": "try { ... } finally { cleanup(); }",
      "returnOverride": "try { return 1; } finally { return 2; } // Returns 2!"
    },
    "catch": {
      "category": "exception",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "description": "Catch clause - handles thrown exceptions",
      "followedBy": [
        "PAREN_OPEN",
        "BRACE_OPEN"
      ],
      "precededBy": [
        "BRACE_CLOSE"
      ],
      "parentContext": [
        "TryStatement"
      ],
      "requiresTry": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isClause": true,
      "isException": true,
      "canHaveBinding": true,
      "bindingOptional": true,
      "canHaveFinally": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "catch binding evolution",
          "legacy": "catch (error) { } // Required binding",
          "modern": "catch { } // Optional binding (ES2019+)",
          "note": "Omit binding if error not used"
        },
        {
          "language": "JavaScript",
          "rule": "catch scope",
          "note": "catch parameter is block-scoped",
          "example": "catch (e) { let e; } // Error: e already declared"
        }
      ],
      "errorMessage": "A 'catch' clause must follow a 'try' block and can optionally have a parameter in parentheses '(error)'.",
      "commonTypos": [
        "cathc",
        "cath",
        "catc",
        "caatch"
      ],
      "notes": "Handles exceptions from try. Binding optional (ES2019+). Block-scoped parameter.",
      "quirks": [
        "Must follow try block",
        "Binding optional (ES2019+)",
        "Catch parameter is block-scoped",
        "Can have finally after",
        "Catches all errors (no type filtering)",
        "Re-throwing is common pattern"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.15",
      "enhancements": {
        "ES2019": "Optional catch binding"
      },
      "bestPractice": "Catch specific errors. Re-throw unexpected errors. Use optional binding if error unused.",
      "useCases": [
        "Error handling",
        "Error recovery",
        "Logging errors",
        "Re-throwing errors"
      ],
      "example": "catch (error) { console.error(error); }",
      "optionalBinding": "catch { /* Ignore error */ }",
      "rethrowing": "catch (e) { if (e instanceof TypeError) handle(e); else throw e; }",
      "blockScoping": "catch (e) { /* e only visible here */ }",
      "multipleErrors": "catch (e) { if (e.code === \"ERR1\") {...} else if (e.code === \"ERR2\") {...} }"
    },
    "finally": {
      "category": "exception",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "description": "Finally clause - always executes after try/catch",
      "followedBy": [
        "BRACE_OPEN"
      ],
      "precededBy": [
        "BRACE_CLOSE"
      ],
      "parentContext": [
        "TryStatement"
      ],
      "requiresTry": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isClause": true,
      "isException": true,
      "alwaysExecutes": true,
      "canOverrideReturn": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "finally execution guarantee",
          "note": "Executes even if try/catch returns or throws",
          "warning": "Return in finally overrides try/catch return"
        }
      ],
      "errorMessage": "A 'finally' clause must follow a 'try' or 'catch' block.",
      "commonTypos": [
        "finaly",
        "finnaly",
        "finallly",
        "fnally"
      ],
      "notes": "Always executes. Can override return values. Good for cleanup.",
      "quirks": [
        "Always executes (even with return/throw)",
        "Return in finally overrides earlier returns",
        "Throw in finally overrides earlier errors",
        "Used for cleanup/resource management",
        "Executes before function returns",
        "Can suppress exceptions (if returns)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.15",
      "bestPractice": "Use for cleanup only. Avoid return/throw in finally.",
      "useCases": [
        "Resource cleanup",
        "File closing",
        "Connection closing",
        "Reset state"
      ],
      "example": "finally { cleanup(); }",
      "withReturn": "try { return 1; } finally { return 2; } // Returns 2!",
      "cleanup": "finally { file.close(); connection.close(); }",
      "alwaysRuns": "try { throw new Error(); } catch (e) { } finally { /* Always runs */ }",
      "dangerousReturn": "finally { return; } // Suppresses exceptions!"
    },
    "throw": {
      "category": "exception",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Throw statement - raises exception",
      "followedBy": [
        "Expression",
        "new",
        "IDENTIFIER"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "if"
      ],
      "parentContext": [
        "BlockStatement",
        "CatchClause",
        "Program",
        "FunctionBody"
      ],
      "requiresExpression": true,
      "noLineBreak": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isStatement": true,
      "isException": true,
      "noLineBreakAfter": true,
      "terminatesExecution": true,
      "canThrowAny": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "throw anything (not just Error)",
          "note": "Can throw any value, but Error objects recommended",
          "examples": [
            "throw new Error(\"message\");",
            "throw \"string\"; // Valid but discouraged",
            "throw { code: 404 }; // Valid but discouraged"
          ]
        },
        {
          "language": "JavaScript",
          "rule": "No line break after throw (ASI)",
          "valid": "throw new Error(\"error\");",
          "invalid": "throw\nnew Error(); // ASI: throw; (SyntaxError)",
          "note": "Line break inserts semicolon"
        }
      ],
      "errorMessage": "A 'throw' statement must be followed by an expression (no line break allowed).",
      "commonTypos": [
        "thorw",
        "thow",
        "trhow",
        "throow"
      ],
      "notes": "No line break after throw (ASI issue). Can throw any value. Terminates execution.",
      "quirks": [
        "No line break after throw keyword",
        "Can throw any value (not just Error)",
        "Terminates current execution context",
        "Bubbles up call stack",
        "Error objects have stack trace",
        "Custom error types inherit from Error"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.14",
      "bestPractice": "Throw Error objects. Include descriptive messages. Use custom error types.",
      "errorTypes": [
        "Error",
        "TypeError",
        "ReferenceError",
        "SyntaxError",
        "RangeError",
        "Custom Error classes"
      ],
      "useCases": [
        "Error signaling",
        "Validation failures",
        "Async error propagation",
        "Control flow (discouraged)"
      ],
      "example": "throw new Error(\"Something went wrong\");",
      "customError": "class CustomError extends Error {}; throw new CustomError();",
      "asiIssue": "throw\nerror; // Error: ASI inserts semicolon after throw",
      "throwAny": "throw \"error\"; // Valid but not recommended",
      "asyncThrow": "async function fn() { throw new Error(); } // Rejects promise"
    },
    "function": {
      "category": "declaration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Function declaration/expression - defines reusable code block",
      "followedBy": [
        "IDENTIFIER",
        "PAREN_OPEN",
        "STAR",
        "async"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "PAREN_OPEN",
        "ASSIGN",
        "async"
      ],
      "parentContext": [
        "Program",
        "BlockStatement",
        "FunctionDeclaration",
        "Expression"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "dualUsage": true,
      "isDeclaration": true,
      "isExpression": true,
      "canBeAsync": true,
      "canBeGenerator": true,
      "hoisted": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "function declaration vs expression",
          "declaration": "function name() {} // Hoisted, requires name",
          "expression": "const fn = function() {}; // Not hoisted, name optional",
          "note": "Context determines which form"
        },
        {
          "language": "JavaScript",
          "rule": "Function variants",
          "regular": "function fn() {}",
          "generator": "function* gen() {}",
          "async": "async function fn() {}",
          "asyncGenerator": "async function* fn() {}",
          "arrow": "() => {} // Arrow function (different)"
        },
        {
          "language": "JavaScript",
          "rule": "Named function expression",
          "note": "Name only visible inside function",
          "example": "const fn = function myName() { myName(); }; myName(); // Error"
        }
      ],
      "errorMessage": "A function declaration must start with 'function', optionally followed by a name, and parentheses '()' for parameters.",
      "commonTypos": [
        "functoin",
        "fucntion",
        "funciton",
        "fuctnion",
        "functino",
        "funciton"
      ],
      "notes": "Declarations are hoisted. Expressions are not. Name optional in expressions.",
      "quirks": [
        "Declarations hoisted to top",
        "Expressions not hoisted",
        "Named expressions: name visible only inside",
        "Generator: function* syntax",
        "Async: async function syntax",
        "Arrow functions are different"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 15.2",
      "enhancements": {
        "ES6": "Arrow functions, default parameters, rest parameters",
        "ES8": "Async functions",
        "ES2018": "Async generators"
      },
      "bestPractice": "Use arrow functions for simple cases. Named functions for recursion/debugging.",
      "useCases": [
        "Reusable code",
        "Callbacks",
        "Event handlers",
        "Modules",
        "Recursion"
      ],
      "example": "function greet(name) { return `Hello ${name}`; }",
      "expression": "const greet = function(name) { return `Hello ${name}`; };",
      "generator": "function* range(n) { for (let i = 0; i < n; i++) yield i; }",
      "async": "async function fetchData() { return await fetch(url); }",
      "asyncGenerator": "async function* asyncRange(n) { for (let i = 0; i < n; i++) yield i; }",
      "namedExpression": "const fn = function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); };",
      "hoisting": "fn(); function fn() {} // Works! (hoisted)"
    },
    "return": {
      "category": "control",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Return statement - exits function with optional value",
      "followedBy": [
        "Expression",
        "SEMICOLON",
        "LineTerminator",
        "NEWLINE",
        "BRACE_CLOSE"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "if"
      ],
      "parentContext": [
        "FunctionBody",
        "ArrowFunctionBody"
      ],
      "canHaveExpression": true,
      "lineBreakAllowed": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isStatement": true,
      "isControl": true,
      "requiresFunction": true,
      "terminatesExecution": true,
      "allowsLineBreak": true,
      "canOmitValue": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "return with/without value",
          "withValue": "return value;",
          "withoutValue": "return; // Returns undefined",
          "note": "Line break after return can trigger ASI"
        },
        {
          "language": "JavaScript",
          "rule": "ASI with return",
          "intended": "return { key: value };",
          "asi": "return\n{ key: value }; // ASI: return; (returns undefined!)",
          "note": "Line break inserts semicolon"
        },
        {
          "language": "JavaScript",
          "rule": "Arrow function implicit return",
          "explicit": "const fn = () => { return value; };",
          "implicit": "const fn = () => value; // Implicit return",
          "note": "No braces = implicit return"
        }
      ],
      "errorMessage": "A 'return' statement must be inside a function body.",
      "commonTypos": [
        "retrun",
        "retur",
        "retrn",
        "retunr"
      ],
      "notes": "Line break after return triggers ASI. Must be in function. Returns undefined if no value.",
      "quirks": [
        "Must be inside function",
        "Line break after return triggers ASI",
        "Without value returns undefined",
        "finally can override return value",
        "Async functions return Promise",
        "Generators return iterator"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.10",
      "bestPractice": "Use explicit returns. Avoid line breaks after return. Early returns for guards.",
      "useCases": [
        "Function result",
        "Early exit",
        "Guard clauses",
        "Error handling"
      ],
      "example": "return result;",
      "noValue": "return; // Returns undefined",
      "asiPitfall": "return\n{ x: 1 }; // ASI: return; (returns undefined!)",
      "earlyReturn": "if (!valid) return; // Guard clause",
      "finallyOverride": "try { return 1; } finally { return 2; } // Returns 2!",
      "asyncReturn": "async function fn() { return value; } // Returns Promise<value>",
      "arrowImplicit": "() => value // Implicit return"
    },
    "var": {
      "category": "declaration",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Variable declaration - function-scoped, hoisted (legacy)",
      "followedBy": [
        "IDENTIFIER",
        "BRACE_OPEN",
        "BRACKET_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "PAREN_OPEN",
        "for"
      ],
      "parentContext": [
        "Program",
        "BlockStatement",
        "ForStatement",
        "FunctionBody"
      ],
      "canDestructure": true,
      "startsExpr": false,
      "beforeExpr": false,
      "isDeclaration": true,
      "isVariable": true,
      "functionScoped": true,
      "hoisted": true,
      "canRedeclare": true,
      "initializerOptional": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "var vs let vs const",
          "var": "Function-scoped, hoisted, can redeclare",
          "let": "Block-scoped, TDZ, no redeclare",
          "const": "Block-scoped, TDZ, must initialize, no reassign",
          "recommendation": "Use const by default, let when reassignment needed"
        },
        {
          "language": "JavaScript",
          "rule": "Hoisting behavior",
          "example": "console.log(x); var x = 1; // undefined (hoisted)",
          "note": "Declaration hoisted, assignment not"
        },
        {
          "language": "JavaScript",
          "rule": "Function vs block scope",
          "example": "if (true) { var x = 1; } console.log(x); // 1 (function-scoped!)",
          "note": "Ignores block boundaries"
        }
      ],
      "errorMessage": "A 'var' declaration must be followed by a variable name.",
      "commonTypos": [
        "vra",
        "va",
        "varr",
        "ver"
      ],
      "notes": "Legacy. Function-scoped. Hoisted. Can redeclare. Use let/const instead.",
      "quirks": [
        "Function-scoped (ignores blocks)",
        "Hoisted to function top",
        "Can redeclare same name",
        "Global var creates window property",
        "for loop var leaks",
        "Deprecated in modern code"
      ],
      "stage": "stable",
      "deprecated": true,
      "deprecationMessage": "Use let or const instead of var",
      "spec": "ECMA-262 Section 14.3.1",
      "bestPractice": "Avoid var. Use const by default, let when reassignment needed.",
      "useCases": [
        "Legacy code",
        "Maintaining old codebases"
      ],
      "example": "var count = 0;",
      "hoisting": "console.log(x); var x = 1; // undefined (hoisted)",
      "functionScope": "if (true) { var x = 1; } console.log(x); // 1",
      "redeclaration": "var x = 1; var x = 2; // OK (but bad)",
      "forLoopLeak": "for (var i = 0; i < 3; i++) {} console.log(i); // 3",
      "globalProperty": "var x = 1; // window.x === 1 (browser)",
      "modernAlternative": "const x = 1; let y = 2; // Use these instead"
    },
    "const": {
      "category": "declaration",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Constant declaration - block-scoped, immutable binding",
      "followedBy": [
        "IDENTIFIER",
        "BRACE_OPEN",
        "BRACKET_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "PAREN_OPEN",
        "for",
        "export"
      ],
      "parentContext": [
        "Program",
        "BlockStatement",
        "ForStatement",
        "FunctionBody"
      ],
      "requiresInitializer": true,
      "canDestructure": true,
      "startsExpr": false,
      "beforeExpr": false,
      "isDeclaration": true,
      "isVariable": true,
      "blockScoped": true,
      "hasTDZ": true,
      "noRedeclare": true,
      "noReassign": "const x = 1; x = 2; // TypeError: reassignment",
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "const immutability",
          "binding": "const x = 1; x = 2; // Error: reassignment",
          "objectMutation": "const obj = {}; obj.x = 1; // OK! (object mutable)",
          "note": "Binding is immutable, not the value"
        },
        {
          "language": "JavaScript",
          "rule": "Temporal Dead Zone (TDZ)",
          "example": "console.log(x); const x = 1; // ReferenceError (TDZ)",
          "note": "Cannot access before declaration"
        }
      ],
      "errorMessage": "A 'const' declaration must be followed by a variable name and an initializer.",
      "commonTypos": [
        "cosnt",
        "ocnst",
        "cnst",
        "conts",
        "cosnst"
      ],
      "notes": "Must initialize. Cannot reassign. Block-scoped. TDZ applies. Objects/arrays mutable.",
      "quirks": [
        "Must initialize at declaration",
        "Cannot reassign binding",
        "Objects/arrays still mutable",
        "Block-scoped",
        "Temporal Dead Zone (TDZ)",
        "No hoisting to top"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.3.1",
      "bestPractice": "Default to const. Use let only when reassignment needed.",
      "useCases": [
        "Immutable bindings",
        "Constants",
        "Function references",
        "Object references"
      ],
      "example": "const MAX_SIZE = 100;",
      "mustInitialize": "const x; // SyntaxError: missing initializer",
      "objectMutation": "const obj = {}; obj.x = 1; // OK (obj reference unchanged)",
      "tdz": "console.log(x); const x = 1; // ReferenceError",
      "blockScope": "if (true) { const x = 1; } console.log(x); // ReferenceError",
      "forLoop": "for (const item of array) { } // OK (fresh binding)",
      "destructuring": "const { x, y } = obj; const [a, b] = arr;"
    },
    "let": {
      "category": "declaration",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Let declaration - block-scoped, reassignable variable",
      "followedBy": [
        "IDENTIFIER",
        "BRACKET_OPEN",
        "BRACE_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "PAREN_OPEN",
        "for",
        "export"
      ],
      "parentContext": [
        "Program",
        "BlockStatement",
        "ForStatement",
        "FunctionBody"
      ],
      "canDestructure": true,
      "startsExpr": false,
      "beforeExpr": false,
      "isDeclaration": true,
      "isVariable": true,
      "blockScoped": true,
      "hasTDZ": true,
      "noRedeclare": "let x = 1; let x = 2; // SyntaxError",
      "canReassign": true,
      "initializerOptional": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "let as keyword vs identifier",
          "keyword": "let x = 1; // Declaration",
          "identifier": "let; // Valid identifier in some contexts",
          "note": "Contextual keyword - can be identifier in ES5 code"
        },
        {
          "language": "JavaScript",
          "rule": "let vs const",
          "let": "Allows reassignment",
          "const": "No reassignment",
          "guideline": "Use const by default, let when reassignment needed"
        },
        {
          "language": "JavaScript",
          "rule": "Temporal Dead Zone (TDZ)",
          "example": "console.log(x); let x = 1; // ReferenceError (TDZ)",
          "note": "Cannot access before declaration"
        }
      ],
      "errorMessage": "A 'let' declaration must be followed by a variable name.",
      "commonTypos": [
        "lte",
        "elt",
        "lett",
        "lete"
      ],
      "notes": "Block-scoped. TDZ applies. Cannot redeclare. Can reassign. Contextual keyword.",
      "quirks": [
        "Block-scoped (respects blocks)",
        "Temporal Dead Zone (TDZ)",
        "Cannot redeclare in same scope",
        "Can reassign value",
        "Fresh binding in for loops",
        "Contextual keyword (can be identifier)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 14.3.1",
      "bestPractice": "Use when reassignment needed. Prefer const otherwise.",
      "useCases": [
        "Loop counters",
        "Accumulator variables",
        "State that changes",
        "Conditional assignment"
      ],
      "example": "let count = 0; count++;",
      "noInitializer": "let x; // OK (undefined)",
      "reassignment": "let x = 1; x = 2; // OK",
      "tdz": "console.log(x); let x = 1; // ReferenceError",
      "blockScope": "if (true) { let x = 1; } console.log(x); // ReferenceError",
      "forLoop": "for (let i = 0; i < 10; i++) { setTimeout(() => console.log(i)); } // Fresh i",
      "destructuring": "let { x, y } = obj; let [a, b] = arr;",
      "contextualKeyword": "let = 5; // Valid in non-strict mode ES5"
    },
    "class": {
      "category": "declaration",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Class declaration/expression - syntactic sugar over prototypes",
      "followedBy": [
        "IDENTIFIER",
        "BRACE_OPEN",
        "extends"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "export",
        "PAREN_OPEN",
        "ASSIGN"
      ],
      "parentContext": [
        "Program",
        "BlockStatement",
        "ExportDeclaration",
        "Expression"
      ],
      "dualUsage": true,
      "startsExpr": true,
      "beforeExpr": false,
      "isDeclaration": true,
      "isExpression": true,
      "strictMode": true,
      "notHoisted": "new X(); class X {} // ReferenceError",
      "canExtend": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "class declaration vs expression",
          "declaration": "class Name {} // Requires name",
          "expression": "const C = class {}; // Name optional",
          "note": "Like function, context determines type"
        },
        {
          "language": "JavaScript",
          "rule": "class vs function constructor",
          "class": "class X { constructor() {} } // Modern",
          "function": "function X() {} X.prototype.method = ... // Legacy",
          "note": "Class is syntactic sugar"
        }
      ],
      "errorMessage": "A class declaration must be followed by a name and a class body '{}'.",
      "commonTypos": [
        "calss",
        "clas",
        "classs",
        "clsas"
      ],
      "notes": "Strict mode by default. Not hoisted. Syntactic sugar over prototypes.",
      "quirks": [
        "Strict mode enforced",
        "Not hoisted (TDZ applies)",
        "Constructor optional",
        "Methods non-enumerable",
        "Must use new",
        "Private fields (#field)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 15.7",
      "enhancements": {
        "ES2022": "Static initialization blocks"
      },
      "bestPractice": "Use class for OOP. Private fields for encapsulation.",
      "useCases": [
        "Object-oriented programming",
        "Inheritance hierarchies",
        "Encapsulation",
        "Polymorphism"
      ],
      "example": "class User { constructor(name) { this.name = name; } }",
      "withMethods": "class X { method() {} static staticMethod() {} }",
      "privateFields": "class X { #private = 1; getPrivate() { return this.#private; } }",
      "staticBlock": "class X { static { /* initialization */ } }"
    },
    "extends": {
      "category": "declaration",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Extends clause - class inheritance",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "null"
      ],
      "precededBy": [
        "IDENTIFIER",
        "BRACE_CLOSE"
      ],
      "parentContext": [
        "ClassDeclaration",
        "ClassExpression"
      ],
      "requiresClass": true,
      "startsExpr": false,
      "beforeExpr": true,
      "isInheritance": true,
      "canBeNull": true,
      "mustBeConstructor": true,
      "singleInheritance": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "extends can be expression",
          "examples": [
            "class A extends B {}",
            "class A extends getBase() {}",
            "class A extends (condition ? B : C) {}",
            "class A extends null {} // Valid!"
          ]
        }
      ],
      "errorMessage": "The 'extends' clause must be followed by a class or constructor function.",
      "commonTypos": [
        "extend",
        "extedns",
        "extneds"
      ],
      "notes": "Single inheritance only. Can extend expressions. extends null is valid.",
      "quirks": [
        "Single inheritance (unlike interfaces)",
        "Can extend expressions",
        "extends null removes Object.prototype",
        "Must call super() in constructor",
        "Static methods inherited",
        "Can extend built-ins (Array, Error)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 15.7",
      "bestPractice": "Call super() first in derived constructor. Avoid deep hierarchies.",
      "useCases": [
        "Class inheritance",
        "Extending built-ins",
        "Mixins (via expressions)",
        "Polymorphism"
      ],
      "example": "class Dog extends Animal { constructor() { super(); } }",
      "extendsExpression": "class X extends getBase() {}",
      "extendsNull": "class X extends null {} // No Object.prototype",
      "extendsBuiltin": "class MyArray extends Array {}"
    },
    "super": {
      "category": "primary",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Super keyword - access parent class",
      "followedBy": [
        "PAREN_OPEN",
        "DOT",
        "BRACKET_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "return"
      ],
      "parentContext": [
        "Constructor",
        "MethodDefinition",
        "StaticBlock"
      ],
      "dualUsage": true,
      "startsExpr": true,
      "beforeExpr": false,
      "isSuper": true,
      "requiresClass": true,
      "onlyInDerived": true,
      "mustBeFirst": "constructor() { super(); /* Must be before this */ }",
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "super() vs super.method vs super[prop]",
          "superCall": "super() // Constructor call (must be first)",
          "superProperty": "super.method() // Parent method",
          "superComputed": "super[name] // Parent property",
          "note": "Different usages in different contexts"
        }
      ],
      "errorMessage": "'super' can only be used in class constructors or methods.",
      "commonTypos": [
        "supr",
        "super",
        "suepr",
        "spuer"
      ],
      "notes": "super() must be first in constructor. super.method() accesses parent. Only in classes.",
      "quirks": [
        "super() only in derived constructors",
        "super() must be called before this",
        "super.method() in any method",
        "super in static methods = parent static",
        "super in arrow functions fails",
        "Cannot call super() conditionally"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 13.3",
      "bestPractice": "Call super() first in constructor. Use super.method() for parent access.",
      "useCases": [
        "Parent constructor call",
        "Parent method access",
        "Method overriding",
        "Constructor chaining"
      ],
      "example": "constructor() { super(); this.x = 1; }",
      "superMethod": "method() { super.method(); /* override */ }",
      "superStatic": "static method() { super.method(); }"
    },
    "new": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "New operator - creates instance",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "new",
        "PAREN_OPEN"
      ],
      "precededBy": [
        "ASSIGN",
        "PAREN_OPEN",
        "BRACKET_OPEN",
        "return",
        "new"
      ],
      "parentContext": [
        "Expression",
        "Statement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isOperator": true,
      "isPrefix": true,
      "requiresConstructor": true,
      "canChain": true,
      "optionalArguments": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "new with/without parentheses",
          "withArgs": "new Date(2024, 0, 1)",
          "noArgs": "new Date // Same as new Date()",
          "note": "Parentheses optional if no arguments"
        },
        {
          "language": "JavaScript",
          "rule": "new.target meta-property",
          "regular": "new Foo()",
          "metaProperty": "new.target // Detects new call",
          "note": "Different from regular new"
        }
      ],
      "errorMessage": "The 'new' operator must be followed by a constructor expression.",
      "commonTypos": [
        "nwe",
        "ne",
        "neew",
        "neww"
      ],
      "notes": "Creates instance. Parentheses optional. Can chain: new new Foo(). Sets prototype.",
      "quirks": [
        "Parentheses optional (no args)",
        "Can chain: new new Foo()",
        "new.target is meta-property",
        "Returns object (unless constructor returns)",
        "Sets prototype chain",
        "Arrow functions cannot be constructors"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 13.3.5",
      "enhancements": {
        "ES6": "new.target meta-property"
      },
      "bestPractice": "Use class instead of constructor functions. Check new.target.",
      "useCases": [
        "Object instantiation",
        "Constructor invocation",
        "Built-in objects",
        "Factory patterns"
      ],
      "example": "const obj = new MyClass();",
      "noParens": "new Date // Same as new Date()",
      "chained": "new new Foo() // Valid but unusual",
      "newTarget": "function F() { console.log(new.target); }"
    },
    "this": {
      "category": "primary",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "This keyword - current execution context",
      "followedBy": [
        "DOT",
        "BRACKET_OPEN",
        "SEMICOLON",
        "COMMA",
        "PAREN_CLOSE"
      ],
      "precededBy": [
        "return",
        "PAREN_OPEN",
        "ASSIGN",
        "COMMA",
        "DOT"
      ],
      "parentContext": [
        "FunctionBody",
        "ClassDeclaration",
        "ObjectLiteral",
        "GlobalScope"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "contextDependent": true,
      "isPrimary": true,
      "bindingRules": [
        "1. new binding: new Foo()",
        "2. Explicit: call/apply/bind",
        "3. Implicit: obj.method()",
        "4. Default: global/undefined",
        "5. Arrow: lexical"
      ],
      "arrowFunctionsInherit": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "this binding rules",
          "global": "this // window (browser) or global (Node)",
          "method": "obj.method() // this = obj",
          "constructor": "new Foo() // this = new instance",
          "arrow": "() => this // this = outer this",
          "explicit": "fn.call(obj) // this = obj",
          "strict": "function() { \"use strict\"; this; } // undefined"
        },
        {
          "language": "JavaScript",
          "rule": "Arrow functions inherit this",
          "regular": "function() { this } // Dynamic binding",
          "arrow": "() => { this } // Lexical binding (outer this)",
          "note": "Arrow functions do not have own this"
        }
      ],
      "errorMessage": "'this' refers to the current execution context.",
      "commonTypos": [
        "tihs",
        "thi",
        "thsi",
        "htis"
      ],
      "notes": "Context-dependent. Arrow functions inherit outer this. strict mode affects global this.",
      "quirks": [
        "Global: window/global/undefined",
        "Method: receiver object",
        "Constructor: new instance",
        "Arrow: lexical (outer this)",
        "Explicit: call/apply/bind",
        "Strict mode: undefined (not global)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 9.2",
      "bestPractice": "Use arrow functions to preserve this. Be aware of binding rules.",
      "useCases": [
        "Object methods",
        "Class methods",
        "Event handlers",
        "Callbacks"
      ],
      "example": "obj.method() // this = obj",
      "arrowFunction": "const fn = () => { this }; // Outer this",
      "explicitBinding": "fn.call(obj) // this = obj",
      "strictMode": "(function() { \"use strict\"; return this; })() // undefined"
    },
    "import": {
      "category": "module",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Import declaration - ES modules",
      "followedBy": [
        "IDENTIFIER",
        "STRING",
        "BRACE_OPEN",
        "STAR"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON"
      ],
      "parentContext": [
        "Program",
        "Module"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isDeclaration": true,
      "hoisted": true,
      "staticOnly": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "import forms",
          "forms": [
            "import x from \"mod\"",
            "import { x } from \"mod\"",
            "import * as x from \"mod\"",
            "import \"mod\"",
            "import(\"mod\") // Dynamic"
          ]
        }
      ],
      "errorMessage": "Import must specify module source.",
      "commonTypos": [
        "imoprt",
        "improt",
        "imprt"
      ],
      "notes": "Static imports hoisted. Dynamic import() returns Promise.",
      "quirks": [
        "Hoisted",
        "Read-only bindings",
        "Live bindings",
        "Dynamic import() is different"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 16.2",
      "bestPractice": "Use named imports. Avoid wildcard.",
      "example": "import { x } from \"./mod.js\";"
    },
    "export": {
      "category": "module",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Export declaration - ES modules",
      "followedBy": [
        "IDENTIFIER",
        "BRACE_OPEN",
        "default",
        "const",
        "let",
        "function",
        "class",
        "STAR"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON"
      ],
      "parentContext": [
        "Program",
        "Module"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isDeclaration": true,
      "canBeDefault": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "export forms",
          "forms": [
            "export const x = 1",
            "export { x }",
            "export default x",
            "export * from \"mod\"",
            "export { x } from \"mod\""
          ]
        }
      ],
      "errorMessage": "Export must specify what to export.",
      "commonTypos": [
        "exprot",
        "exoprt",
        "exprt"
      ],
      "notes": "export default allows expressions. Named exports require declarations.",
      "quirks": [
        "default exports",
        "Re-exports",
        "Live bindings",
        "Cannot export let conditionally"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 16.2",
      "bestPractice": "Prefer named exports. Single default per module.",
      "example": "export const x = 1;"
    },
    "from": {
      "category": "module",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "From clause - module source",
      "followedBy": [
        "STRING"
      ],
      "precededBy": [
        "IDENTIFIER",
        "BRACE_CLOSE",
        "STAR"
      ],
      "parentContext": [
        "ImportDeclaration",
        "ExportDeclaration"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "requiresString": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "from in modules vs identifier",
          "module": "import x from './mod'; // Keyword",
          "identifier": "const from = 'value'; // Valid identifier",
          "note": "from is only keyword in import/export contexts"
        },
        {
          "language": "JavaScript",
          "rule": "from clause requirements",
          "valid": "import x from './file.js'; // Must be string literal",
          "invalid": "import x from module; // SyntaxError",
          "note": "from must be followed by string literal module specifier"
        }
      ],
      "errorMessage": "from requires string module specifier.",
      "commonTypos": [
        "form",
        "fron",
        "frm"
      ],
      "notes": "Contextual keyword. Requires string literal.",
      "quirks": [
        "Contextual keyword in import/export only",
        "Can be used as identifier elsewhere",
        "Must be followed by string literal",
        "Works with both import and export statements",
        "No dynamic import expressions (use import() function)",
        "Bare specifiers require module resolution"
      ],
      "stage": "stable",
      "example": "import x from \"./mod.js\";"
    },
    "as": {
      "category": "module",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "As clause - rename/namespace",
      "followedBy": [
        "IDENTIFIER"
      ],
      "precededBy": [
        "IDENTIFIER",
        "STAR",
        "default"
      ],
      "parentContext": [
        "ImportDeclaration",
        "ExportDeclaration"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "dualUsage": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "as in modules vs TypeScript",
          "module": "import { x as y } from \"mod\"",
          "namespace": "import * as ns from \"mod\"",
          "note": "Contextual keyword in import/export"
        },
        {
          "language": "JavaScript vs TypeScript",
          "rule": "as in modules vs type assertion",
          "javascript": "import { name as alias } from './mod'; // Rename",
          "typescript": "const x = value as Type; // Type assertion (TS only)",
          "note": "TypeScript extends as for type casting"
        }
      ],
      "errorMessage": "as requires identifier.",
      "commonTypos": [
        "s",
        "sa"
      ],
      "notes": "Contextual keyword. Rename or namespace.",
      "quirks": [
        "Contextual keyword in import/export only",
        "Can be used as identifier outside modules",
        "Renames imported/exported bindings",
        "Creates namespace for import * as",
        "TypeScript uses for type assertions (different usage)",
        "Cannot rename default exports inline"
      ],
      "stage": "stable",
      "example": "import { x as y } from \"./mod.js\";"
    },
    "in": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "precedence": 7,
      "description": "In operator - property existence check",
      "followedBy": [
        "Expression"
      ],
      "precededBy": [
        "IDENTIFIER",
        "STRING",
        "PAREN_CLOSE"
      ],
      "parentContext": [
        "Expression",
        "ForInStatement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isBinary": true,
      "dualUsage": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "in operator vs for-in",
          "operator": "\"key\" in obj // true/false",
          "forIn": "for (const key in obj) {}",
          "note": "Different contexts"
        }
      ],
      "errorMessage": "in checks if property exists in object.",
      "commonTypos": [
        "ni",
        "inn"
      ],
      "notes": "Checks prototype chain. for-in iterates keys.",
      "quirks": [
        "Checks prototype chain",
        "for-in also uses in",
        "Returns boolean"
      ],
      "stage": "stable",
      "example": "\"length\" in [] // true"
    },
    "instanceof": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "precedence": 7,
      "description": "Instanceof operator - prototype check",
      "followedBy": [
        "Expression",
        "IDENTIFIER"
      ],
      "precededBy": [
        "IDENTIFIER",
        "PAREN_CLOSE",
        "this"
      ],
      "parentContext": [
        "Expression"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isBinary": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "instanceof vs typeof",
          "instanceof": "obj instanceof Class // Prototype check",
          "typeof": "typeof x // Type string",
          "note": "Different purposes"
        }
      ],
      "errorMessage": "instanceof checks prototype chain.",
      "commonTypos": [
        "instanceof",
        "instanceOf",
        "instaneof"
      ],
      "notes": "Checks prototype chain. Can be fooled with Object.create.",
      "quirks": [
        "Prototype chain check",
        "Can be customized (Symbol.hasInstance)",
        "Fails across realms"
      ],
      "stage": "stable",
      "example": "arr instanceof Array // true"
    },
    "typeof": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Typeof operator - type string",
      "followedBy": [
        "Expression",
        "IDENTIFIER"
      ],
      "precededBy": [
        "PAREN_OPEN",
        "ASSIGN",
        "return"
      ],
      "parentContext": [
        "Expression"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isPrefix": true,
      "isUnary": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "typeof returns",
          "types": [
            "\"undefined\"",
            "\"boolean\"",
            "\"number\"",
            "\"bigint\"",
            "\"string\"",
            "\"symbol\"",
            "\"function\"",
            "\"object\""
          ]
        }
      ],
      "errorMessage": "typeof returns type string.",
      "commonTypos": [
        "typeOf",
        "typof",
        "typeof"
      ],
      "notes": "Returns string. typeof null === \"object\" (bug). Safe for undeclared.",
      "quirks": [
        "typeof null === \"object\"",
        "Safe for undeclared vars",
        "Returns 8 possible strings"
      ],
      "stage": "stable",
      "example": "typeof x === \"number\""
    },
    "void": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Void operator - returns undefined",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "LITERAL"
      ],
      "precededBy": [
        "PAREN_OPEN",
        "ASSIGN",
        "return"
      ],
      "parentContext": [
        "Expression"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isPrefix": true,
      "isUnary": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "void always returns undefined",
          "note": "Evaluates expression but returns undefined"
        }
      ],
      "errorMessage": "void evaluates expression and returns undefined.",
      "commonTypos": [
        "viod",
        "vod",
        "vooid"
      ],
      "notes": "Always returns undefined. Common: void 0. Used in IIFEs.",
      "quirks": [
        "Always returns undefined",
        "void 0 === undefined",
        "Used in void function expressions"
      ],
      "stage": "stable",
      "example": "void 0 // undefined"
    },
    "delete": {
      "category": "operator",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Delete operator - removes property",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "DOT",
        "BRACKET_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "Expression",
        "Statement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isPrefix": true,
      "isUnary": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "delete only affects properties",
          "works": "delete obj.prop // true",
          "doesNotWork": "delete variable // false (strict: error)",
          "note": "Cannot delete variables"
        }
      ],
      "errorMessage": "delete removes object properties.",
      "commonTypos": [
        "delte",
        "dleete",
        "delete"
      ],
      "notes": "Removes properties. Cannot delete variables. Returns boolean.",
      "quirks": [
        "Only properties",
        "Returns boolean",
        "Strict mode: error on vars",
        "Cannot delete non-configurable"
      ],
      "stage": "stable",
      "example": "delete obj.prop"
    },
    "async": {
      "category": "modifier",
      "esVersion": "ES8",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Async modifier - returns Promise",
      "followedBy": [
        "function",
        "PAREN_OPEN",
        "IDENTIFIER"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "ASSIGN",
        "export"
      ],
      "parentContext": [
        "FunctionDeclaration",
        "FunctionExpression",
        "ArrowFunction"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isModifier": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "async function forms",
          "forms": [
            "async function fn() {}",
            "async () => {}",
            "async function* gen() {}"
          ]
        }
      ],
      "errorMessage": "async function returns Promise.",
      "commonTypos": [
        "asynch",
        "asyn",
        "aync"
      ],
      "notes": "Makes function return Promise. Allows await inside.",
      "quirks": [
        "Returns Promise",
        "Allows await",
        "Async generators",
        "Contextual keyword"
      ],
      "stage": "stable",
      "example": "async function fn() { await x; }"
    },
    "await": {
      "category": "operator",
      "esVersion": "ES8",
      "source": "ECMA-262",
      "description": "Await operator - wait for Promise",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "ASSIGN",
        "return"
      ],
      "parentContext": [
        "AsyncFunction",
        "AsyncGenerator"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isPrefix": true,
      "requiresAsync": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "await only in async",
          "valid": "async function() { await promise; }",
          "invalid": "function() { await promise; } // Error",
          "note": "Requires async context"
        }
      ],
      "errorMessage": "await pauses for Promise resolution.",
      "commonTypos": [
        "awiat",
        "awit",
        "awaitt"
      ],
      "notes": "Only in async functions. Pauses execution. Top-level await (ES2022).",
      "quirks": [
        "Only in async",
        "Pauses execution",
        "Top-level await (modules)",
        "await non-Promise is ok"
      ],
      "stage": "stable",
      "enhancements": {
        "ES2022": "Top-level await"
      },
      "example": "await fetch(url)"
    },
    "yield": {
      "category": "operator",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "description": "Yield operator - generator value",
      "followedBy": [
        "Expression",
        "IDENTIFIER",
        "STAR",
        "SEMICOLON"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "GeneratorFunction"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "requiresGenerator": true,
      "canDelegateYield": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "yield vs yield*",
          "yield": "yield value // Single value",
          "yieldStar": "yield* iterable // Delegate",
          "note": "yield* delegates to iterable"
        }
      ],
      "errorMessage": "yield produces generator value.",
      "commonTypos": [
        "yeild",
        "yiled",
        "yeld"
      ],
      "notes": "Only in generators. Pauses function. yield* delegates.",
      "quirks": [
        "Only in generators",
        "Pauses function",
        "yield* delegates",
        "Can receive value via next()"
      ],
      "stage": "stable",
      "example": "yield value"
    },
    "debugger": {
      "category": "statement",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Debugger statement - breakpoint",
      "followedBy": [
        "SEMICOLON",
        "NEWLINE"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "Statement",
        "BlockStatement"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isStatement": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "debugger behavior",
          "devTools": "Pauses if dev tools open",
          "production": "No-op in production",
          "note": "Development tool only"
        }
      ],
      "errorMessage": "debugger creates breakpoint.",
      "commonTypos": [
        "debuger",
        "debbuger",
        "debuggar"
      ],
      "notes": "Pauses execution if debugger attached. No-op otherwise.",
      "quirks": [
        "Only if debugger attached",
        "No-op in production",
        "Remove before deploy"
      ],
      "stage": "stable",
      "example": "debugger; // Pause here"
    },
    "with": {
      "category": "statement",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "deprecated": true,
      "description": "Creates a scope where properties of an object become variables. DEPRECATED - forbidden in strict mode.",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "Program"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isStatement": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "with statement vs object destructuring",
          "with": "with (obj) { x = 1; } // Deprecated",
          "destructuring": "const { x } = obj; x = 1; // Modern",
          "note": "with statement is forbidden in strict mode and should never be used"
        }
      ],
      "quirks": [
        "Forbidden in strict mode (SyntaxError)",
        "Creates ambiguous scope chains",
        "Prevents optimization",
        "Can't determine variable binding at compile time",
        "Security risk - can hijack global objects",
        "Slower execution due to dynamic scope lookup"
      ],
      "stage": "deprecated",
      "spec": "ECMA-262 Annex B.3.4",
      "errorMessage": "Strict mode code may not include a with statement",
      "bestPractice": "NEVER use with. Use destructuring or explicit property access instead.",
      "example": "with (Math) { console.log(PI); } // BAD - deprecated",
      "modernAlternative": "const { PI } = Math; console.log(PI); // GOOD"
    },
    "enum": {
      "category": "reserved",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved for future use in JavaScript. Has meaning in TypeScript for enumerated types.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "enum keyword usage",
          "javascript": "enum // SyntaxError - reserved but not implemented",
          "typescript": "enum Color { Red, Green, Blue } // Valid TypeScript",
          "note": "Reserved in JavaScript for potential future use, but currently implemented only in TypeScript"
        }
      ],
      "quirks": [
        "Reserved in all JavaScript contexts",
        "Cannot be used as variable name",
        "Cannot be used as property name in dot notation",
        "Has meaning in TypeScript",
        "No implementation in JavaScript spec",
        "May be implemented in future ECMAScript versions"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 12.6.2",
      "errorMessage": "Unexpected reserved word 'enum'",
      "bestPractice": "Avoid using as identifier. Use Object.freeze() for enum-like patterns in JavaScript.",
      "example": "const enum = 1; // SyntaxError",
      "jsEnumPattern": "const Colors = Object.freeze({ RED: 'red', GREEN: 'green', BLUE: 'blue' });"
    },
    "implements": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode for future use. Has meaning in TypeScript for interface implementation.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "implements usage",
          "javascript": "'use strict'; const implements = 1; // SyntaxError",
          "typescript": "class Dog implements Animal { } // Valid TypeScript",
          "note": "Reserved only in strict mode JavaScript, but has actual meaning in TypeScript"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "Valid identifier in non-strict ES5",
        "Cannot be variable name in strict mode",
        "TypeScript uses for interface implementation",
        "Part of future-proofing JavaScript for OOP features"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "Avoid using as identifier even in non-strict mode for forward compatibility.",
      "example": "'use strict'; const implements = 1; // SyntaxError",
      "nonStrict": "const implements = 1; // Valid in non-strict mode (not recommended)"
    },
    "interface": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode for future use. Has meaning in TypeScript for type contracts.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "interface usage",
          "javascript": "'use strict'; const interface = 1; // SyntaxError",
          "typescript": "interface Person { name: string; } // Valid TypeScript",
          "note": "Reserved in JavaScript strict mode, structural typing in TypeScript"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "Valid identifier in non-strict ES5",
        "TypeScript uses for type definitions",
        "Cannot be property name via dot notation in strict mode",
        "May be implemented in future JavaScript versions"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "Always avoid. Use TypeScript for interfaces, duck typing for JavaScript.",
      "example": "'use strict'; const interface = 1; // SyntaxError",
      "duckTyping": "function greet(person) { return person.name; } // Duck typing in JS"
    },
    "package": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode for future use. Possibly for Java-like package systems.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "package keyword",
          "javascript": "'use strict'; const package = 1; // SyntaxError",
          "java": "package com.example; // Valid Java",
          "note": "Reserved to prevent confusion with Java-like package systems"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "Never implemented in JavaScript",
        "JavaScript uses modules instead",
        "Valid identifier in non-strict mode",
        "Part of Java-inspired reserved words"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "Avoid completely. Use ES6 modules for code organization.",
      "example": "'use strict'; const package = 1; // SyntaxError",
      "modules": "import { module } from './module.js'; export { feature }; // Modern approach"
    },
    "private": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode. JavaScript uses # prefix for private fields instead (ES2022).",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript vs Java",
          "rule": "private access modifier",
          "javascript": "class C { #private = 1; } // Uses # prefix",
          "typescript": "class C { private x = 1; } // Uses keyword",
          "java": "private int x; // Uses keyword",
          "note": "JavaScript chose # prefix over keyword to avoid breaking existing code"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "JavaScript uses # prefix for private fields",
        "TypeScript uses private keyword",
        "Can be used as identifier in non-strict mode",
        "Reserved to allow future syntax evolution"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "enhancements": {
        "ES2022": "Private fields use # prefix: class C { #field }"
      },
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "Use # prefix for private fields in JavaScript classes.",
      "example": "'use strict'; const private = 1; // SyntaxError",
      "privateFields": "class C { #secret = 42; getSecret() { return this.#secret; } }"
    },
    "protected": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode for future use. TypeScript has protected for inheritance access control.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "protected access modifier",
          "javascript": "'use strict'; const protected = 1; // SyntaxError",
          "typescript": "class C { protected x = 1; } // Valid TypeScript",
          "note": "JavaScript has no protected access - use conventions or closures"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "No protected access in JavaScript",
        "TypeScript implements protected for inheritance",
        "Valid identifier in non-strict mode",
        "Use naming conventions (_protected) in JavaScript"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "Use naming conventions (_prefix) or TypeScript for protected members.",
      "example": "'use strict'; const protected = 1; // SyntaxError",
      "convention": "class C { _protected = 1; } // Convention: _ means internal"
    },
    "public": {
      "category": "reserved",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "strictOnly": true,
      "description": "Reserved in strict mode for future use. All JavaScript class fields are public by default.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "public access modifier",
          "javascript": "class C { x = 1; } // Public by default",
          "typescript": "class C { public x = 1; } // Explicit",
          "note": "JavaScript doesn't need public keyword - all fields are public unless prefixed with #"
        }
      ],
      "quirks": [
        "Only reserved in strict mode",
        "All JS class fields are public by default",
        "TypeScript has explicit public keyword",
        "Valid identifier in non-strict mode",
        "Redundant in JavaScript design"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Section 13.1.1",
      "errorMessage": "Unexpected strict mode reserved word",
      "bestPractice": "No need for explicit public in JavaScript. Fields are public by default.",
      "example": "'use strict'; const public = 1; // SyntaxError",
      "defaultPublic": "class C { x = 1; getX() { return this.x; } } // All public"
    },
    "abstract": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java-inspired). No meaning in JavaScript, but has meaning in TypeScript for abstract classes.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript",
          "rule": "abstract keyword",
          "javascript": "const abstract = 1; // SyntaxError in strict mode",
          "typescript": "abstract class Shape { abstract area(): number; } // Valid TypeScript",
          "note": "Reserved in JavaScript for potential future use, implemented in TypeScript"
        }
      ],
      "quirks": [
        "Reserved in strict mode only",
        "Valid identifier in non-strict mode (not recommended)",
        "Part of Java-inspired reserved words",
        "TypeScript uses for abstract classes and methods",
        "No implementation in JavaScript spec"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'abstract'",
      "bestPractice": "Avoid using. Use TypeScript for abstract classes or design patterns in JavaScript.",
      "example": "'use strict'; const abstract = 1; // SyntaxError",
      "tsExample": "abstract class Animal { abstract makeSound(): void; }"
    },
    "boolean": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3. JavaScript uses 'Boolean' (capitalized) as constructor, not 'boolean' keyword.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs TypeScript/Java",
          "rule": "boolean type",
          "javascript": "const x = true; // Use Boolean() constructor or literals",
          "typescript": "const x: boolean = true; // Type annotation",
          "note": "JavaScript has Boolean (object) not boolean (keyword)"
        }
      ],
      "quirks": [
        "Reserved but unused in JavaScript",
        "JavaScript uses Boolean (capitalized) as constructor",
        "TypeScript uses boolean (lowercase) for type annotation",
        "Part of Java primitive type names"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'boolean'",
      "bestPractice": "Use Boolean() constructor or true/false literals in JavaScript.",
      "example": "const boolean = 1; // SyntaxError in strict mode",
      "jsWay": "const x = Boolean('test'); // or const x = true;"
    },
    "byte": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses typed arrays instead.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "byte type",
          "javascript": "const arr = new Int8Array(10); // Use typed arrays",
          "java": "byte b = 127; // Primitive type",
          "note": "JavaScript has no byte keyword, use Int8Array/Uint8Array"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "Part of Java primitive type names",
        "JavaScript uses Int8Array/Uint8Array for byte data",
        "Valid identifier in non-strict mode"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'byte'",
      "bestPractice": "Use Int8Array or Uint8Array for byte manipulation.",
      "example": "const byte = 1; // SyntaxError in strict mode",
      "jsWay": "const bytes = new Uint8Array([1, 2, 3]);"
    },
    "char": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses strings for characters.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "char type",
          "javascript": "const c = 'a'; // Use string",
          "java": "char c = 'a'; // Primitive type",
          "note": "JavaScript has no char type, single characters are strings"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript treats single characters as strings",
        "Part of Java primitive type names",
        "Use string[0] or charAt(0) in JavaScript"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'char'",
      "bestPractice": "Use string for single characters in JavaScript.",
      "example": "const char = 'a'; // SyntaxError in strict mode",
      "jsWay": "const char = 'a'; // String of length 1"
    },
    "double": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript's Number is already IEEE 754 double-precision.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "double type",
          "javascript": "const x = 3.14; // All numbers are double-precision",
          "java": "double d = 3.14; // Explicit double type",
          "note": "JavaScript Number is always 64-bit IEEE 754 double"
        }
      ],
      "quirks": [
        "Reserved but redundant in JavaScript",
        "All JavaScript numbers are double-precision (64-bit)",
        "Part of Java primitive type names",
        "Use Number or numeric literals"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'double'",
      "bestPractice": "Use Number type or numeric literals directly.",
      "example": "const double = 3.14; // SyntaxError in strict mode",
      "jsWay": "const x = 3.14; // Already double-precision"
    },
    "final": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). JavaScript uses 'const' for similar purpose.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "final keyword",
          "javascript": "const x = 1; // Immutable binding",
          "java": "final int x = 1; // Immutable variable",
          "note": "JavaScript uses const instead of final"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript's const serves similar purpose",
        "Part of Java modifiers",
        "Object.freeze() for immutable objects"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'final'",
      "bestPractice": "Use const for immutable bindings, Object.freeze() for immutable objects.",
      "example": "const final = 1; // SyntaxError in strict mode",
      "jsWay": "const x = 1; Object.freeze(obj);"
    },
    "float": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses Number for all floating-point values.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "float type",
          "javascript": "const x = 3.14; // All numbers are IEEE 754 double",
          "java": "float f = 3.14f; // 32-bit floating point",
          "note": "JavaScript has no separate float type, use Number or Float32Array"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript Number is 64-bit (double), not 32-bit (float)",
        "Use Float32Array for 32-bit float arrays",
        "Part of Java primitive type names"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'float'",
      "bestPractice": "Use Number for general use, Float32Array for performance-critical float arrays.",
      "example": "const float = 3.14; // SyntaxError in strict mode",
      "jsWay": "const x = 3.14; // or new Float32Array([3.14]);"
    },
    "goto": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3. Never implemented in JavaScript due to structured programming principles.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs C/Java",
          "rule": "goto statement",
          "javascript": "// Use functions, loops, and return instead",
          "c": "goto label; label: statement(); // Jump to label",
          "note": "JavaScript deliberately excludes goto to encourage structured programming"
        }
      ],
      "quirks": [
        "Reserved to prevent future use",
        "Considered harmful in structured programming",
        "JavaScript uses functions, loops, break, continue instead",
        "Never will be implemented",
        "Part of compatibility with C/Java"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'goto'",
      "bestPractice": "Use structured control flow: functions, loops, break, continue, return.",
      "example": "const goto = 1; // SyntaxError in strict mode",
      "jsWay": "// Use early return or break instead of goto"
    },
    "int": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses Number for all numeric values.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "int type",
          "javascript": "const x = 42; // Use Number or BigInt",
          "java": "int x = 42; // 32-bit signed integer",
          "note": "JavaScript has no int keyword, use Number, BigInt, or Int32Array"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript Number can represent integers up to 2^53-1 safely",
        "Use BigInt for larger integers",
        "Use Int32Array/Uint32Array for typed arrays"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'int'",
      "bestPractice": "Use Number for integers, BigInt for large integers, typed arrays for performance.",
      "example": "const int = 42; // SyntaxError in strict mode",
      "jsWay": "const x = 42; const big = 42n; // or new Int32Array([42]);"
    },
    "long": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses BigInt for 64-bit integers.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "long type",
          "javascript": "const x = 9007199254740991n; // Use BigInt",
          "java": "long x = 9007199254740991L; // 64-bit integer",
          "note": "JavaScript uses BigInt (ES2020) for arbitrary precision integers"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript now has BigInt for large integers",
        "Number can safely represent integers up to 2^53-1",
        "Part of Java primitive type names"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'long'",
      "bestPractice": "Use BigInt for large integers beyond Number.MAX_SAFE_INTEGER.",
      "example": "const long = 42; // SyntaxError in strict mode",
      "jsWay": "const x = 9007199254740991n; // BigInt literal"
    },
    "native": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). No equivalent in JavaScript.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "native keyword",
          "javascript": "// No native keyword - use WebAssembly for native code",
          "java": "native void nativeMethod(); // JNI method",
          "note": "JavaScript has no native keyword, use WebAssembly or Node.js addons"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "Part of Java's JNI (Java Native Interface)",
        "JavaScript uses WebAssembly or native addons instead",
        "No direct equivalent in JavaScript"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'native'",
      "bestPractice": "Use WebAssembly for performance-critical native code.",
      "example": "const native = 1; // SyntaxError in strict mode",
      "jsWay": "// Use WebAssembly.instantiate() for native code"
    },
    "short": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java primitive type). JavaScript uses Int16Array for 16-bit integers.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "short type",
          "javascript": "const arr = new Int16Array([1, 2, 3]); // 16-bit integers",
          "java": "short s = 32767; // 16-bit signed integer",
          "note": "JavaScript uses Int16Array/Uint16Array for 16-bit integers"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript uses Int16Array/Uint16Array for 16-bit data",
        "Part of Java primitive type names",
        "Number can represent all short values"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'short'",
      "bestPractice": "Use Number for general use, Int16Array for typed arrays.",
      "example": "const short = 1; // SyntaxError in strict mode",
      "jsWay": "const x = 32767; // or new Int16Array([32767]);"
    },
    "synchronized": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). JavaScript uses async/await and Web Workers instead.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "synchronized keyword",
          "javascript": "// Use async/await or Web Workers for concurrency",
          "java": "synchronized void method() { } // Thread synchronization",
          "note": "JavaScript is single-threaded, use async patterns or SharedArrayBuffer with Atomics"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "JavaScript is single-threaded (event loop)",
        "Use async/await for asynchronous operations",
        "Use Web Workers for parallel processing",
        "SharedArrayBuffer + Atomics for shared memory"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'synchronized'",
      "bestPractice": "Use async/await for async operations, Web Workers for parallelism.",
      "example": "const synchronized = 1; // SyntaxError in strict mode",
      "jsWay": "async function fetch() { await response; } // or new Worker('worker.js');"
    },
    "throws": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). JavaScript uses 'throw' (singular) instead.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "throws vs throw",
          "javascript": "throw new Error('message'); // Throw exception",
          "java": "void method() throws Exception { } // Declare exceptions",
          "note": "JavaScript uses throw (verb), not throws (declaration)"
        }
      ],
      "quirks": [
        "Reserved but never used",
        "JavaScript uses 'throw' (singular) to throw exceptions",
        "No checked exceptions in JavaScript",
        "Part of Java exception handling"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'throws'",
      "bestPractice": "Use throw to throw exceptions, try/catch to handle them.",
      "example": "const throws = 1; // SyntaxError in strict mode",
      "jsWay": "throw new Error('message'); try {} catch(e) {}"
    },
    "transient": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). JavaScript has no serialization keywords.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "transient keyword",
          "javascript": "// Use toJSON() method for custom serialization",
          "java": "transient int temp; // Skip serialization",
          "note": "JavaScript uses toJSON() or replacer function in JSON.stringify()"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "Part of Java serialization mechanism",
        "JavaScript uses JSON.stringify() with custom logic",
        "No built-in transient concept"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'transient'",
      "bestPractice": "Use toJSON() method or replacer function for custom serialization.",
      "example": "const transient = 1; // SyntaxError in strict mode",
      "jsWay": "obj.toJSON = () => ({ /* custom */ }); JSON.stringify(obj, replacer);"
    },
    "volatile": {
      "category": "reserved",
      "esVersion": "ES3",
      "source": "ECMA-262",
      "futureReserved": true,
      "description": "Reserved word from ECMAScript 3 (Java keyword). JavaScript uses Atomics for shared memory operations.",
      "followedBy": [],
      "precededBy": [],
      "parentContext": [],
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "language": "JavaScript vs Java",
          "rule": "volatile keyword",
          "javascript": "// Use Atomics with SharedArrayBuffer for thread-safe operations",
          "java": "volatile int counter; // Memory visibility guarantee",
          "note": "JavaScript uses Atomics API for shared memory visibility"
        }
      ],
      "quirks": [
        "Reserved but never implemented",
        "Part of Java memory model",
        "JavaScript uses Atomics API for similar purpose",
        "Relevant for SharedArrayBuffer and Web Workers"
      ],
      "stage": "reserved",
      "spec": "ECMA-262 Annex C",
      "errorMessage": "Unexpected reserved word 'volatile'",
      "bestPractice": "Use Atomics API with SharedArrayBuffer for thread-safe operations.",
      "example": "const volatile = 1; // SyntaxError in strict mode",
      "jsWay": "const sab = new SharedArrayBuffer(4); Atomics.load(new Int32Array(sab), 0);"
    },
    "static": {
      "category": "modifier",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "strictOnly": false,
      "description": "Declares a static method, property, or initialization block for a class. Static members belong to the class itself, not instances.",
      "followedBy": [
        "IDENTIFIER",
        "get",
        "set",
        "BRACE_OPEN",
        "HASH",
        "async"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "ClassBody"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isModifier": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "Static vs Instance Members",
          "static": "MyClass.staticMethod() // Accessed on class",
          "instance": "new MyClass().instanceMethod() // Accessed on instance",
          "note": "Static members cannot directly access instance members via 'this'"
        },
        {
          "language": "JavaScript",
          "rule": "Static initialization blocks (ES2022)",
          "staticBlock": "class C { static { this.init(); } }",
          "staticProperty": "class C { static prop = value; }",
          "note": "Static blocks run once when class is evaluated"
        }
      ],
      "quirks": [
        "Static members inherited by subclasses",
        "'this' refers to class constructor itself",
        "Cannot be used outside class declaration",
        "ES2022 introduced static initialization blocks",
        "Can combine with private fields: static #privateField",
        "Static blocks can access private instance fields",
        "Not available in object literals"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 15.7.10",
      "enhancements": {
        "ES2022": "Static initialization blocks: static { ... }"
      },
      "bestPractice": "Use for utility functions or properties shared across all instances. Use static blocks for complex initialization.",
      "example": "class User { static count = 0; static getCount() { return User.count; } }",
      "staticBlock": "class C { static resource; static { C.resource = loadResource(); } }",
      "staticPrivate": "class C { static #secret = 42; static getSecret() { return C.#secret; } }"
    },
    "of": {
      "category": "iterator",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Iterates over iterable objects (arrays, strings, Maps, Sets, etc.) in for...of loops.",
      "followedBy": [
        "IDENTIFIER",
        "Expression"
      ],
      "precededBy": [
        "IDENTIFIER",
        "BRACKET_CLOSE",
        "BRACE_CLOSE"
      ],
      "parentContext": [
        "ForOfStatement"
      ],
      "startsExpr": false,
      "beforeExpr": true,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "for...of vs for...in",
          "forOf": "for (const item of array) // Iterates over values",
          "forIn": "for (const key in object) // Iterates over keys",
          "note": "for...of works with iterables, for...in works with enumerable properties"
        },
        {
          "language": "JavaScript",
          "rule": "of as contextual keyword vs identifier",
          "keyword": "for (const x of arr) {} // Keyword",
          "identifier": "const of = 'value'; // Valid identifier",
          "note": "of is only a keyword in for loops context"
        }
      ],
      "quirks": [
        "Only a keyword in for loop context",
        "Can be used as variable name outside for loops",
        "Works with any iterable (Array, String, Map, Set, etc.)",
        "Does not work with plain objects (not iterable)",
        "Creates fresh binding in each iteration",
        "Cannot iterate object properties directly"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 14.7.5",
      "errorMessage": "for...of requires an iterable object",
      "bestPractice": "Use for...of for arrays and iterables. Use for...in for object keys. Use Object.entries() for object iteration.",
      "example": "for (const item of [1, 2, 3]) { console.log(item); }",
      "withString": "for (const char of 'hello') { console.log(char); }",
      "withMap": "for (const [key, value] of map) { console.log(key, value); }",
      "withSet": "for (const item of new Set([1, 2, 3])) { console.log(item); }",
      "objectIteration": "for (const [key, value] of Object.entries(obj)) { console.log(key, value); }",
      "asIdentifier": "const of = 'test'; console.log(of); // Valid outside for loop"
    },
    "get": {
      "category": "accessor",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Defines a getter method that executes when a property is accessed.",
      "followedBy": [
        "IDENTIFIER",
        "BRACKET_OPEN",
        "STRING"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "COMMA"
      ],
      "parentContext": [
        "ObjectLiteral",
        "ClassBody"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "get accessor vs get identifier",
          "accessor": "const obj = { get name() { return 'John'; } }; // Getter",
          "identifier": "const get = 'value'; // Valid identifier",
          "note": "get is only a keyword before method names in objects/classes"
        },
        {
          "language": "JavaScript",
          "rule": "get vs regular method",
          "getter": "obj.name // Called without parentheses",
          "method": "obj.getName() // Called with parentheses",
          "note": "Getters are accessed like properties but execute code"
        }
      ],
      "quirks": [
        "Only a keyword before method names",
        "Can be used as variable name",
        "Cannot have parameters",
        "Must return a value",
        "Accessed without parentheses (like property)",
        "Can be used with computed property names: get [prop]()",
        "Works in object literals and classes"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 13.2.5",
      "errorMessage": "Getter must not have parameters",
      "bestPractice": "Use for computed properties or lazy evaluation. Don't perform expensive operations in getters.",
      "example": "const obj = { get fullName() { return `${this.first} ${this.last}`; } };",
      "classGetter": "class Person { get age() { return new Date().getFullYear() - this.birthYear; } }",
      "computedGetter": "const obj = { get [Symbol.iterator]() { return this.items[Symbol.iterator](); } };",
      "asIdentifier": "const get = 'value'; console.log(get); // Valid",
      "withSetter": "const obj = { _val: 0, get value() { return this._val; }, set value(v) { this._val = v; } };"
    },
    "set": {
      "category": "accessor",
      "esVersion": "ES5",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Defines a setter method that executes when a property is assigned a value.",
      "followedBy": [
        "IDENTIFIER",
        "BRACKET_OPEN",
        "STRING"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN",
        "COMMA"
      ],
      "parentContext": [
        "ObjectLiteral",
        "ClassBody"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "set accessor vs set identifier",
          "accessor": "const obj = { set name(value) { this._name = value; } }; // Setter",
          "identifier": "const set = 'value'; // Valid identifier",
          "note": "set is only a keyword before method names in objects/classes"
        },
        {
          "language": "JavaScript",
          "rule": "set vs regular method",
          "setter": "obj.name = 'John'; // Called with assignment",
          "method": "obj.setName('John'); // Called explicitly",
          "note": "Setters are invoked during assignment but execute code"
        }
      ],
      "quirks": [
        "Only a keyword before method names",
        "Can be used as variable name",
        "Must have exactly one parameter",
        "Cannot return values (return is ignored)",
        "Invoked during property assignment",
        "Can be used with computed property names: set [prop](val)",
        "Works in object literals and classes"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 13.2.5",
      "errorMessage": "Setter must have exactly one parameter",
      "bestPractice": "Use for validation, side effects, or derived properties. Pair with getters for consistency.",
      "example": "const obj = { set name(value) { this._name = value.trim(); } };",
      "classSetter": "class Person { set age(value) { if (value < 0) throw new Error('Invalid age'); this._age = value; } }",
      "computedSetter": "const obj = { set [Symbol.toStringTag](value) { this._tag = value; } };",
      "asIdentifier": "const set = 'value'; console.log(set); // Valid",
      "withGetter": "const obj = { _val: 0, get value() { return this._val; }, set value(v) { this._val = Math.max(0, v); } };",
      "validation": "const obj = { set email(value) { if (!value.includes('@')) throw new Error('Invalid email'); this._email = value; } };"
    },
    "meta": {
      "category": "meta",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Part of meta-properties: new.target (constructor detection) and import.meta (module metadata).",
      "followedBy": [
        "DOT"
      ],
      "precededBy": [
        "new",
        "import"
      ],
      "parentContext": [
        "MetaProperty"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "new.target vs import.meta",
          "newTarget": "function F() { console.log(new.target); } // Constructor detection",
          "importMeta": "console.log(import.meta.url); // Module metadata",
          "note": "meta is part of two different meta-properties"
        },
        {
          "language": "JavaScript",
          "rule": "meta as keyword vs identifier",
          "keyword": "new.target // Part of meta-property",
          "identifier": "const meta = {}; // Valid identifier",
          "note": "meta is only keyword when following new or import with dot"
        }
      ],
      "quirks": [
        "Only keyword in new.target and import.meta",
        "Cannot be used standalone",
        "Always followed by dot (.)",
        "Can be used as regular identifier elsewhere",
        "new.target is undefined in non-constructor contexts",
        "import.meta only available in modules"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 13.3.8 (new.target), Section 16.2.11 (import.meta)",
      "bestPractice": "Use new.target for constructor checks. Use import.meta for module information.",
      "example": "function F() { if (!new.target) throw new Error('Must use new'); }",
      "importMetaExample": "console.log(import.meta.url); // Current module URL",
      "newTargetExample": "class Base { constructor() { console.log(new.target.name); } }"
    },
    "target": {
      "category": "meta",
      "esVersion": "ES6",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Part of new.target meta-property. Refers to the constructor that was directly invoked with new.",
      "followedBy": [
        "DOT",
        "SEMICOLON",
        "PAREN_CLOSE",
        "COMMA"
      ],
      "precededBy": [
        "DOT"
      ],
      "parentContext": [
        "MetaProperty"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "new.target usage",
          "inConstructor": "new.target === ConstructorFunction // true when called with new",
          "inFunction": "new.target === undefined // When called without new",
          "note": "Detects whether function was called as constructor"
        },
        {
          "language": "JavaScript",
          "rule": "target in inheritance",
          "base": "class Base { constructor() { console.log(new.target); } }",
          "derived": "class Derived extends Base {} new Derived(); // logs Derived, not Base",
          "note": "new.target refers to the most derived constructor"
        }
      ],
      "quirks": [
        "Only meaningful after new. prefix",
        "Can be used as regular identifier",
        "undefined when function not called with new",
        "Points to most derived constructor in inheritance",
        "Not available in arrow functions",
        "Helps prevent calling constructors without new"
      ],
      "stage": "stable",
      "spec": "ECMA-262 Section 13.3.8",
      "errorMessage": "new.target can only be used in constructors",
      "bestPractice": "Use to enforce new usage in constructors. Check in base classes for abstract patterns.",
      "example": "function User(name) { if (!new.target) throw new Error('Must use new'); this.name = name; }",
      "abstractPattern": "class Abstract { constructor() { if (new.target === Abstract) throw new Error('Abstract class'); } }",
      "asIdentifier": "const target = document.querySelector('#target'); // Valid identifier"
    },
    "using": {
      "category": "declaration",
      "esVersion": "ES2024",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Explicit Resource Management - declares a resource that will be automatically disposed when leaving scope.",
      "followedBy": [
        "IDENTIFIER",
        "BRACE_OPEN",
        "BRACKET_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement",
        "ForStatement"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "using declaration vs identifier",
          "declaration": "using file = await fs.open('data.txt'); // Resource management",
          "identifier": "const using = 'value'; // Valid identifier in older engines",
          "note": "using is contextual - only a keyword when declaring resources"
        },
        {
          "language": "JavaScript vs C#",
          "rule": "using statement comparison",
          "javascript": "using resource = getResource(); // Block-scoped",
          "csharp": "using (var resource = GetResource()) { } // Statement",
          "note": "JavaScript using is more like C# using combined with block scope"
        }
      ],
      "quirks": [
        "ES2024 feature (very new)",
        "Contextual keyword",
        "Requires Symbol.dispose or Symbol.asyncDispose",
        "Calls [Symbol.dispose]() when leaving scope",
        "Works with try-finally internally",
        "Can use await using for async disposal",
        "Not yet widely supported (check compatibility)"
      ],
      "stage": "stage-3",
      "spec": "ECMA-262 Explicit Resource Management Proposal",
      "proposal": "https://github.com/tc39/proposal-explicit-resource-management",
      "errorMessage": "using declaration requires resource with Symbol.dispose",
      "bestPractice": "Use for file handles, database connections, locks - any resource needing cleanup.",
      "example": "using file = await openFile('data.txt'); // Auto-closes when scope exits",
      "asyncExample": "await using connection = await db.connect(); // Async disposal",
      "customResource": "const resource = { [Symbol.dispose]() { console.log('Cleaned up!'); } }; using res = resource;",
      "compatibility": "Node.js 20+, Chrome 122+, Safari 17.4+"
    },
    "defer": {
      "category": "declaration",
      "esVersion": "ES2024",
      "source": "ECMA-262",
      "contextual": true,
      "description": "Deferred Resource Management - declares a resource that will be disposed in reverse order at end of block.",
      "followedBy": [
        "using"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "BlockStatement"
      ],
      "startsExpr": false,
      "beforeExpr": false,
      "isContextual": true,
      "disambiguation": [
        {
          "language": "JavaScript",
          "rule": "defer using vs regular using",
          "defer": "defer using resource = getResource(); // LIFO disposal order",
          "regular": "using resource = getResource(); // Immediate scope disposal",
          "note": "defer ensures reverse (LIFO) disposal order like Go's defer"
        },
        {
          "language": "JavaScript vs Go",
          "rule": "defer comparison",
          "javascript": "defer using lock = acquireLock(); // Disposed at end",
          "go": "defer lock.Release() // Executed at function end",
          "note": "JavaScript defer using is inspired by Go's defer statement"
        }
      ],
      "quirks": [
        "ES2024 feature (very new)",
        "Must be followed by 'using' keyword",
        "Provides LIFO (stack-like) disposal order",
        "Similar to Go's defer statement",
        "Useful for nested resources",
        "Can use await defer using for async",
        "Not yet widely supported"
      ],
      "stage": "stage-3",
      "spec": "ECMA-262 Explicit Resource Management Proposal",
      "proposal": "https://github.com/tc39/proposal-explicit-resource-management",
      "errorMessage": "defer must be followed by using declaration",
      "bestPractice": "Use when disposal order matters (e.g., nested locks, transaction rollback).",
      "example": "{ defer using lock1 = acquireLock(); defer using lock2 = acquireLock(); } // lock2 released first",
      "asyncExample": "await defer using tx = db.transaction(); // Rollback if error",
      "lifoOrder": "defer using a = getA(); defer using b = getB(); // b disposed first, then a",
      "compatibility": "Node.js 20+, Chrome 122+, Safari 17.4+"
    },
    "true": {
      "category": "literal",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Boolean literal - true value",
      "followedBy": [
        "SEMICOLON",
        "COMMA",
        "PAREN_CLOSE",
        "BRACKET_CLOSE",
        "BRACE_CLOSE",
        "COLON"
      ],
      "precededBy": [
        "ASSIGN",
        "PAREN_OPEN",
        "BRACKET_OPEN",
        "return",
        "COLON"
      ],
      "parentContext": [
        "Expression",
        "Literal"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isLiteral": true,
      "isPrimitive": true,
      "value": true,
      "notes": "Boolean literal representing true value",
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 12.8.1",
      "example": "const x = true;"
    },
    "false": {
      "category": "literal",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Boolean literal - false value",
      "followedBy": [
        "SEMICOLON",
        "COMMA",
        "PAREN_CLOSE",
        "BRACKET_CLOSE",
        "BRACE_CLOSE",
        "COLON"
      ],
      "precededBy": [
        "ASSIGN",
        "PAREN_OPEN",
        "BRACKET_OPEN",
        "return",
        "COLON"
      ],
      "parentContext": [
        "Expression",
        "Literal"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isLiteral": true,
      "isPrimitive": true,
      "value": false,
      "notes": "Boolean literal representing false value",
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 12.8.1",
      "example": "const x = false;"
    },
    "null": {
      "category": "literal",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Null literal - intentional absence of value",
      "followedBy": [
        "SEMICOLON",
        "COMMA",
        "PAREN_CLOSE",
        "BRACKET_CLOSE",
        "BRACE_CLOSE",
        "COLON"
      ],
      "precededBy": [
        "ASSIGN",
        "PAREN_OPEN",
        "BRACKET_OPEN",
        "return",
        "COLON",
        "TRIPLE_EQUALS",
        "DOUBLE_EQUALS"
      ],
      "parentContext": [
        "Expression",
        "Literal"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isLiteral": true,
      "isPrimitive": true,
      "value": null,
      "notes": "Null literal - typeof null is 'object' (legacy bug)",
      "quirks": [
        "typeof null === 'object' (historical bug)",
        "null == undefined (true)",
        "null === undefined (false)"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 12.8.2",
      "example": "const x = null;"
    },
    "arguments": {
      "category": "identifier",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Arguments object - array-like object in functions",
      "followedBy": [
        "DOT",
        "BRACKET_OPEN",
        "SEMICOLON"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "FunctionBody"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isIdentifier": true,
      "strictModeReserved": true,
      "notInArrow": true,
      "notes": "Special identifier - not available in arrow functions, reserved in strict mode",
      "quirks": [
        "Array-like (not true array)",
        "Not in arrow functions",
        "Reserved in strict mode",
        "Use rest parameters instead"
      ],
      "stage": "stable",
      "deprecated": true,
      "deprecationMessage": "Use rest parameters (...args) instead",
      "spec": "ECMA-262 Section 10.4.2",
      "example": "function fn() { console.log(arguments); }"
    },
    "eval": {
      "category": "identifier",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Eval function - executes string as code (dangerous)",
      "followedBy": [
        "PAREN_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "Expression",
        "CallExpression"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isIdentifier": true,
      "strictModeReserved": true,
      "dangerous": true,
      "notes": "Special identifier - evaluates string as code, reserved in strict mode, security risk",
      "quirks": [
        "Evaluates string as code",
        "Reserved in strict mode",
        "Security risk (XSS)",
        "Performance impact",
        "Avoid in production"
      ],
      "stage": "stable",
      "deprecated": true,
      "deprecationMessage": "Avoid eval - security and performance risks",
      "spec": "ECMA-262 Section 19.2.1",
      "example": "eval('1 + 1'); // 2 (but dangerous!)"
    },
    "constructor": {
      "category": "identifier",
      "esVersion": "ES1",
      "source": "ECMA-262",
      "description": "Constructor method - initializes class instances",
      "followedBy": [
        "PAREN_OPEN",
        "BRACE_OPEN"
      ],
      "precededBy": [
        "NEWLINE",
        "SEMICOLON",
        "BRACE_OPEN"
      ],
      "parentContext": [
        "ClassBody",
        "ObjectLiteral"
      ],
      "startsExpr": true,
      "beforeExpr": false,
      "isIdentifier": true,
      "isMethod": true,
      "notes": "Special method name - constructor method in classes, property on all objects",
      "quirks": [
        "Reserved method name in classes",
        "Property on all objects",
        "Cannot be called with super()",
        "Automatically called with new"
      ],
      "stage": "stable",
      "deprecated": false,
      "spec": "ECMA-262 Section 15.7.5",
      "example": "class X { constructor() { this.x = 1; } }"
    }
  },
  "__section_02": "══════════════════════════════════════════════════════════════════════════════",
  "__section_02_number": "02",
  "__section_02_name": "literals",
  "__section_02_title": "【SECTION 02】JavaScript Literals",
  "__section_02_language": "JavaScript",
  "__section_02_total_items": 4,
  "__section_02_description": "JavaScript literal values: true, false, null, undefined",
  "__section_02_purpose": "กำหนด literal values ที่เป็น reserved keywords ใน JavaScript",
  "__section_02_responsibility": "ให้ Brain รู้จัก boolean literals, null, และ undefined เพื่อ classify เป็น LITERAL token",
  "__section_02_used_by": [
    "LiteralRecognizer",
    "ConstantEvaluator",
    "TypeInferencer"
  ],
  "__section_02_footer": "══════════════════════════════════════════════════════════════════════════════",
  "literals": {
    "true": {
      "type": "boolean",
      "value": true,
      "source": "ECMA-262"
    },
    "false": {
      "type": "boolean",
      "value": false,
      "source": "ECMA-262"
    },
    "null": {
      "type": "null",
      "value": null,
      "source": "ECMA-262"
    },
    "undefined": {
      "type": "undefined",
      "source": "ECMA-262"
    }
  },
  "operators": {
    "binaryOperators": {
      "|>": {
        "precedence": 0,
        "category": "pipeline",
        "source": "Babel",
        "stage": 2,
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "notes": "Experimental feature. Syntax may change. Requires @babel/plugin-proposal-pipeline-operator.",
        "errorMessage": "Pipeline operator '|>' is experimental. Enable with Babel plugin."
      },
      "??": {
        "precedence": 1,
        "category": "logical",
        "source": "ECMA-262",
        "esVersion": "ES11",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "notes": "Returns right operand when left is null or undefined (not when falsy).",
        "disambiguation": [
          {
            "ifPrecededBy": [
              "IDENTIFIER",
              "PAREN_CLOSE"
            ],
            "ifFollowedBy": [
              "IDENTIFIER",
              "LITERAL"
            ],
            "then": "OPERATOR_NULLISH_COALESCING",
            "notes": "value ?? defaultValue"
          },
          {
            "ifPrecededBy": [
              "JSX_ATTRIBUTE"
            ],
            "then": "PUNCTUATION",
            "language": "JSX"
          }
        ],
        "errorMessage": "Nullish coalescing operator '??' cannot be mixed with '&&' or '||' without parentheses."
      },
      "||": {
        "precedence": 1,
        "category": "logical",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "notes": "Returns first truthy operand or last operand.",
        "errorMessage": "Logical OR '||' cannot be mixed with '??' without parentheses."
      },
      "&&": {
        "precedence": 2,
        "category": "logical",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "notes": "Returns first falsy operand or last operand.",
        "errorMessage": "Logical AND '&&' cannot be mixed with '??' without parentheses."
      },
      "|": {
        "precedence": 3,
        "category": "bitwise",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "COLON",
              "IDENTIFIER",
              "KEYWORD_TYPE"
            ],
            "ifFollowedBy": [
              "IDENTIFIER",
              "KEYWORD_STRING",
              "KEYWORD_NUMBER"
            ],
            "then": "TYPE_UNION",
            "language": "TypeScript",
            "notes": "string | number | boolean"
          },
          {
            "default": "OPERATOR_BITWISE_OR",
            "notes": "a | b"
          }
        ]
      },
      "^": {
        "precedence": 4,
        "category": "bitwise",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false
      },
      "&": {
        "precedence": 5,
        "category": "bitwise",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "COLON",
              "IDENTIFIER",
              "KEYWORD_TYPE"
            ],
            "ifFollowedBy": [
              "IDENTIFIER",
              "BRACE_OPEN"
            ],
            "then": "TYPE_INTERSECTION",
            "language": "TypeScript",
            "notes": "interface A & interface B"
          },
          {
            "default": "OPERATOR_BITWISE_AND",
            "notes": "a & b"
          }
        ]
      },
      "==": {
        "precedence": 6,
        "category": "equality",
        "source": "ECMA-262"
      },
      "!=": {
        "precedence": 6,
        "category": "equality",
        "source": "ECMA-262"
      },
      "===": {
        "precedence": 6,
        "category": "equality",
        "source": "ECMA-262"
      },
      "!==": {
        "precedence": 6,
        "category": "equality",
        "source": "ECMA-262"
      },
      "<": {
        "precedence": 7,
        "category": "relational",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "IDENTIFIER",
              "KEYWORD_CONST",
              "KEYWORD_LET",
              "KEYWORD_FUNCTION"
            ],
            "ifFollowedBy": [
              "IDENTIFIER"
            ],
            "ifNotPrecededBy": [
              "OPERATOR_ASSIGN",
              "OPERATOR_RETURN"
            ],
            "then": "GENERIC_START",
            "language": "TypeScript",
            "notes": "Array<string>, function foo<T>() {}"
          },
          {
            "ifPrecededBy": [
              "KEYWORD_RETURN",
              "PAREN_OPEN",
              "BRACE_OPEN",
              "OPERATOR_ASSIGN"
            ],
            "ifFollowedBy": [
              "IDENTIFIER",
              "JSX_IDENTIFIER"
            ],
            "then": "JSX_TAG_START",
            "language": "JSX",
            "notes": "return <Component />, const x = <div />"
          },
          {
            "default": "OPERATOR_LESS_THAN",
            "notes": "x < 5, a < b"
          }
        ]
      },
      ">": {
        "precedence": 7,
        "category": "relational",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "IDENTIFIER",
              "BRACKET_CLOSE"
            ],
            "ifFollowedBy": [
              "PAREN_OPEN",
              "DOT",
              "IDENTIFIER"
            ],
            "then": "GENERIC_END",
            "language": "TypeScript",
            "notes": "Array<string>.map(), new Map<K, V>()"
          },
          {
            "ifPrecededBy": [
              "SLASH",
              "IDENTIFIER"
            ],
            "then": "JSX_TAG_END",
            "language": "JSX",
            "notes": "<Component />, </div>"
          },
          {
            "default": "OPERATOR_GREATER_THAN",
            "notes": "x > 5, a > b"
          }
        ]
      },
      "<=": {
        "precedence": 7,
        "category": "relational",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false
      },
      ">=": {
        "precedence": 7,
        "category": "relational",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false
      },
      "<<": {
        "precedence": 8,
        "category": "bitshift",
        "source": "ECMA-262"
      },
      ">>": {
        "precedence": 8,
        "category": "bitshift",
        "source": "ECMA-262"
      },
      ">>>": {
        "precedence": 8,
        "category": "bitshift",
        "source": "ECMA-262"
      },
      "+": {
        "precedence": 9,
        "category": "additive",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": true,
        "notes": "Can be unary (type coercion) or binary (addition/concatenation).",
        "disambiguation": [
          {
            "ifPrecededBy": [
              "OPERATOR",
              "PAREN_OPEN",
              "COMMA",
              "KEYWORD_RETURN"
            ],
            "then": "OPERATOR_UNARY_PLUS",
            "notes": "+value, +\"123\""
          },
          {
            "default": "OPERATOR_BINARY_PLUS",
            "notes": "a + b"
          }
        ]
      },
      "-": {
        "precedence": 9,
        "category": "additive",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": true,
        "notes": "Can be unary (negation) or binary (subtraction).",
        "disambiguation": [
          {
            "ifPrecededBy": [
              "OPERATOR",
              "PAREN_OPEN",
              "COMMA",
              "KEYWORD_RETURN"
            ],
            "then": "OPERATOR_UNARY_MINUS",
            "notes": "-value, -10"
          },
          {
            "default": "OPERATOR_BINARY_MINUS",
            "notes": "a - b"
          }
        ]
      },
      "*": {
        "precedence": 10,
        "category": "multiplicative",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "KEYWORD_FUNCTION",
              "KEYWORD_YIELD"
            ],
            "then": "GENERATOR_STAR",
            "notes": "function* gen() {}, yield* otherGen()"
          },
          {
            "ifPrecededBy": [
              "KEYWORD_IMPORT"
            ],
            "ifFollowedBy": [
              "KEYWORD_AS"
            ],
            "then": "IMPORT_NAMESPACE",
            "notes": "import * as name from \"module\""
          },
          {
            "default": "OPERATOR_MULTIPLY",
            "notes": "a * b"
          }
        ]
      },
      "/": {
        "precedence": 10,
        "category": "multiplicative",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false,
        "disambiguation": [
          {
            "ifPrecededBy": [
              "OPERATOR_ASSIGN",
              "PAREN_OPEN",
              "COMMA",
              "KEYWORD_RETURN"
            ],
            "ifFollowedBy": [
              "REGEX_PATTERN"
            ],
            "then": "REGEX_START",
            "notes": "const regex = /pattern/flags"
          },
          {
            "ifPrecededBy": [
              "JSX_TAG_START"
            ],
            "ifFollowedBy": [
              "IDENTIFIER"
            ],
            "then": "JSX_CLOSING_TAG",
            "language": "JSX",
            "notes": "</Component>"
          },
          {
            "ifPrecededBy": [
              "JSX_IDENTIFIER"
            ],
            "ifFollowedBy": [
              "JSX_TAG_END"
            ],
            "then": "JSX_SELF_CLOSING",
            "language": "JSX",
            "notes": "<Component />"
          },
          {
            "default": "OPERATOR_DIVIDE",
            "notes": "a / b"
          }
        ]
      },
      "%": {
        "precedence": 10,
        "category": "multiplicative",
        "source": "ECMA-262",
        "associativity": "left",
        "isInfix": true,
        "isPrefix": false
      },
      "**": {
        "precedence": 11,
        "category": "exponential",
        "source": "ECMA-262",
        "esVersion": "ES7",
        "associativity": "right",
        "isInfix": true,
        "isPrefix": false,
        "notes": "Right-associative: 2 ** 3 ** 2 equals 2 ** (3 ** 2) = 512"
      }
    },
    "unaryOperators": {
      "++": {
        "type": "update",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": true,
        "notes": "Prefix: ++x (returns incremented), Postfix: x++ (returns original)",
        "errorMessage": "Increment operator '++' requires a valid left-hand side expression."
      },
      "--": {
        "type": "update",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": true,
        "notes": "Prefix: --x (returns decremented), Postfix: x-- (returns original)",
        "errorMessage": "Decrement operator '--' requires a valid left-hand side expression."
      },
      "+": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Converts operand to number. +true === 1, +\"42\" === 42"
      },
      "-": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Negates operand. -10 === -10, -true === -1"
      },
      "!": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Logical NOT. !true === false, !0 === true",
        "commonTypos": [
          "not",
          "¬"
        ],
        "errorMessage": "Logical NOT operator '!' must precede an expression."
      },
      "~": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Bitwise NOT. ~5 === -6 (inverts bits)"
      },
      "typeof": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Returns type as string. typeof undefined === \"undefined\"",
        "commonTypos": [
          "typeOf",
          "type of",
          "typof"
        ],
        "errorMessage": "The 'typeof' operator must be followed by an expression."
      },
      "void": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Evaluates expression and returns undefined. void 0 === undefined",
        "errorMessage": "The 'void' operator must be followed by an expression."
      },
      "delete": {
        "type": "unary",
        "source": "ECMA-262",
        "isPrefix": true,
        "isPostfix": false,
        "notes": "Removes property from object. Returns true if successful.",
        "errorMessage": "The 'delete' operator can only be used on object properties.",
        "quirks": "Cannot delete variables or functions. Strict mode throws errors."
      },
      "await": {
        "type": "unary",
        "source": "ECMA-262",
        "esVersion": "ES8",
        "isPrefix": true,
        "isPostfix": false,
        "parentContext": [
          "AsyncFunction",
          "AsyncGeneratorFunction",
          "Module"
        ],
        "notes": "Pauses async function execution until promise resolves.",
        "errorMessage": "'await' can only be used in async functions or at the top level of modules."
      }
    },
    "assignmentOperators": {
      "=": {
        "precedence": 1,
        "type": "simple",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "notes": "Simple assignment. Right-associative: a = b = c means a = (b = c)",
        "errorMessage": "Assignment operator '=' requires a valid left-hand side expression."
      },
      "+=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a + b",
        "notes": "Addition assignment. Performs addition or string concatenation."
      },
      "-=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a - b",
        "notes": "Subtraction assignment."
      },
      "*=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a * b",
        "notes": "Multiplication assignment."
      },
      "/=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a / b",
        "notes": "Division assignment."
      },
      "%=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a % b",
        "notes": "Remainder assignment."
      },
      "<<=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a << b",
        "notes": "Left shift assignment."
      },
      ">>=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a >> b",
        "notes": "Sign-propagating right shift assignment."
      },
      ">>>=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a >>> b",
        "notes": "Unsigned right shift assignment."
      },
      "|=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a | b",
        "notes": "Bitwise OR assignment."
      },
      "^=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a ^ b",
        "notes": "Bitwise XOR assignment."
      },
      "&=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a & b",
        "notes": "Bitwise AND assignment."
      },
      "**=": {
        "precedence": 1,
        "type": "compound",
        "source": "ECMA-262",
        "esVersion": "ES7",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a = a ** b",
        "notes": "Exponentiation assignment."
      },
      "&&=": {
        "type": "logical",
        "source": "ECMA-262",
        "esVersion": "ES12",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a && (a = b)",
        "notes": "Logical AND assignment. Only assigns if left is truthy."
      },
      "||=": {
        "type": "logical",
        "source": "ECMA-262",
        "esVersion": "ES12",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a || (a = b)",
        "notes": "Logical OR assignment. Only assigns if left is falsy."
      },
      "??=": {
        "type": "logical",
        "source": "ECMA-262",
        "esVersion": "ES12",
        "associativity": "right",
        "isAssign": true,
        "equivalentTo": "a ?? (a = b)",
        "notes": "Nullish coalescing assignment. Only assigns if left is null or undefined."
      }
    }
  },
  "__section_03": "══════════════════════════════════════════════════════════════════════════════",
  "__section_03_number": "03",
  "__section_03_name": "operators",
  "__section_03_title": "【SECTION 03】JavaScript Operators",
  "__section_03_language": "JavaScript",
  "__section_03_total_items": 70,
  "__section_03_description": "All JavaScript operators: arithmetic, logical, bitwise, assignment, comparison, nullish coalescing, optional chaining",
  "__section_03_purpose": "กำหนด operators ทั้งหมดใน JavaScript พร้อม precedence, associativity, และ ES version",
  "__section_03_responsibility": "ให้ Brain รู้จัก operator แต่ละตัว เพื่อ parse expressions และตรวจสอบ precedence ได้ถูกต้อง",
  "__section_03_used_by": [
    "OperatorMatcher",
    "ExpressionParser",
    "PrecedenceResolver"
  ],
  "__section_03_footer": "══════════════════════════════════════════════════════════════════════════════",
  "punctuation": {
    "@": {
      "type": "decorator",
      "name": "at-symbol",
      "precedence": 14,
      "associativity": "left",
      "source": "ECMA-262",
      "esVersion": "ES2016",
      "description": "Decorator symbol for class/method decorators",
      "notes": "Used in TypeScript and ES decorators proposal: @decorator",
      "startsExpr": true,
      "beforeExpr": true
    },
    "\\": {
      "type": "escape",
      "name": "escape-character",
      "source": "ECMA-262",
      "description": "Escape character for string literals and special sequences",
      "notes": "Precedes a character to give it a special meaning: \\n, \\t, \\\", \\\\, etc.",
      "startsExpr": false,
      "beforeExpr": false,
      "usageContext": [
        "string-literal",
        "template-literal",
        "regex-literal"
      ]
    },
    "#": {
      "type": "accessor",
      "name": "private-field",
      "source": "ECMA-262",
      "esVersion": "ES2022",
      "description": "Private class fields, methods, and accessors prefix",
      "notes": "Used for private class members: #privateField, #privateMethod()",
      "startsExpr": false,
      "beforeExpr": false,
      "disambiguation": [
        {
          "ifFollowedBy": [
            "IDENTIFIER"
          ],
          "then": "PRIVATE_IDENTIFIER",
          "notes": "class MyClass { #privateField; }"
        }
      ]
    },
    "[": {
      "type": "bracket",
      "pair": "]",
      "precedence": 13,
      "associativity": "left",
      "source": "ANTLR",
      "startsExpr": true,
      "beforeExpr": true,
      "disambiguation": [
        {
          "ifPrecededBy": [
            "IDENTIFIER",
            "BRACKET_CLOSE",
            "PAREN_CLOSE"
          ],
          "then": "MEMBER_ACCESS",
          "notes": "array[index], obj[prop]"
        },
        {
          "default": "ARRAY_LITERAL",
          "notes": "[1, 2, 3]"
        }
      ],
      "errorMessage": "Unclosed bracket '['. Expected ']'."
    },
    "]": {
      "type": "bracket",
      "pair": "[",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": false,
      "errorMessage": "Unexpected bracket ']'. No matching '['."
    },
    "(": {
      "type": "paren",
      "pair": ")",
      "precedence": 13,
      "associativity": "left",
      "source": "ANTLR",
      "startsExpr": true,
      "beforeExpr": true,
      "disambiguation": [
        {
          "ifPrecededBy": [
            "IDENTIFIER",
            "KEYWORD_FUNCTION",
            "KEYWORD_IF",
            "KEYWORD_WHILE"
          ],
          "then": "FUNCTION_CALL_OR_CONDITION",
          "notes": "foo(), if (cond), while (cond)"
        },
        {
          "default": "GROUPING",
          "notes": "(expr)"
        }
      ],
      "errorMessage": "Unclosed parenthesis '('. Expected ')'."
    },
    ")": {
      "type": "paren",
      "pair": "(",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": false,
      "errorMessage": "Unexpected parenthesis ')'. No matching '('."
    },
    "{": {
      "type": "brace",
      "pair": "}",
      "source": "ANTLR",
      "startsExpr": true,
      "beforeExpr": true,
      "disambiguation": [
        {
          "ifPrecededBy": [
            "OPERATOR_ASSIGN",
            "COLON",
            "PAREN_OPEN"
          ],
          "then": "OBJECT_LITERAL",
          "notes": "const obj = {}, arr.map(x => {})"
        },
        {
          "ifPrecededBy": [
            "PAREN_CLOSE",
            "KEYWORD_ELSE",
            "KEYWORD_TRY",
            "KEYWORD_CATCH"
          ],
          "then": "BLOCK_STATEMENT",
          "notes": "if (x) {}, else {}, try {}"
        },
        {
          "default": "BLOCK_STATEMENT",
          "notes": "{ statements }"
        }
      ],
      "errorMessage": "Unclosed brace '{'. Expected '}'."
    },
    "}": {
      "type": "brace",
      "pair": "{",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": false,
      "errorMessage": "Unexpected brace '}'. No matching '{'."
    },
    ";": {
      "type": "delimiter",
      "name": "semicolon",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": false,
      "notes": "Statement terminator. Optional in many cases due to ASI (Automatic Semicolon Insertion).",
      "quirks": "ASI can lead to unexpected behavior. Recommended to always use semicolons."
    },
    ",": {
      "type": "delimiter",
      "name": "comma",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": true,
      "notes": "Separates items in arrays, objects, function parameters, etc."
    },
    ":": {
      "type": "delimiter",
      "name": "colon",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": true,
      "disambiguation": [
        {
          "ifPrecededBy": [
            "IDENTIFIER",
            "STRING_LITERAL",
            "NUMBER_LITERAL"
          ],
          "ifFollowedBy": [
            "Expression"
          ],
          "parentContext": [
            "ObjectLiteral"
          ],
          "then": "OBJECT_PROPERTY",
          "notes": "{ key: value }"
        },
        {
          "ifPrecededBy": [
            "KEYWORD_CASE",
            "KEYWORD_DEFAULT"
          ],
          "then": "SWITCH_CLAUSE",
          "notes": "case x:, default:"
        },
        {
          "ifPrecededBy": [
            "IDENTIFIER"
          ],
          "parentContext": [
            "LabeledStatement"
          ],
          "then": "LABEL",
          "notes": "label: statement"
        },
        {
          "ifPrecededBy": [
            "IDENTIFIER"
          ],
          "language": "TypeScript",
          "then": "TYPE_ANNOTATION",
          "notes": "const x: string"
        },
        {
          "ifPrecededBy": [
            "PAREN_CLOSE"
          ],
          "language": "TypeScript",
          "then": "RETURN_TYPE",
          "notes": "function foo(): string"
        },
        {
          "ifFollowedBy": [
            "Expression"
          ],
          "then": "TERNARY_TRUE",
          "notes": "cond ? true : false"
        }
      ]
    },
    ".": {
      "type": "accessor",
      "name": "dot",
      "precedence": 13,
      "associativity": "left",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": false,
      "notes": "Member access operator. Also used in numeric literals (1.5).",
      "disambiguation": [
        {
          "ifPrecededBy": [
            "IDENTIFIER",
            "PAREN_CLOSE",
            "BRACKET_CLOSE"
          ],
          "ifFollowedBy": [
            "IDENTIFIER"
          ],
          "then": "MEMBER_ACCESS",
          "notes": "obj.prop, arr.length"
        },
        {
          "ifPrecededBy": [
            "NUMBER_LITERAL"
          ],
          "ifFollowedBy": [
            "NUMBER_LITERAL"
          ],
          "then": "DECIMAL_POINT",
          "notes": "3.14"
        }
      ]
    },
    "...": {
      "type": "spread",
      "name": "ellipsis",
      "source": "ANTLR",
      "esVersion": "ES6",
      "startsExpr": false,
      "beforeExpr": false,
      "notes": "Spread operator or rest parameter.",
      "disambiguation": [
        {
          "ifPrecededBy": [
            "BRACKET_OPEN",
            "BRACE_OPEN",
            "PAREN_OPEN",
            "COMMA"
          ],
          "then": "SPREAD_OPERATOR",
          "notes": "[...arr], {...obj}, func(...args)"
        },
        {
          "ifPrecededBy": [
            "PAREN_OPEN",
            "COMMA"
          ],
          "parentContext": [
            "FunctionDeclaration",
            "ArrowFunction"
          ],
          "then": "REST_PARAMETER",
          "notes": "function foo(...args)"
        }
      ],
      "errorMessage": "Spread/rest operator '...' must be followed by an iterable expression."
    },
    "?.": {
      "type": "accessor",
      "name": "optional-chaining",
      "source": "ANTLR",
      "esVersion": "ES11",
      "startsExpr": false,
      "beforeExpr": false,
      "notes": "Optional chaining operator. Short-circuits if left side is null/undefined.",
      "errorMessage": "Optional chaining operator '?.' must be followed by a property name or bracket."
    },
    "=>": {
      "precedence": 1,
      "type": "arrow",
      "name": "arrow-function",
      "source": "ANTLR",
      "esVersion": "ES6",
      "associativity": "right",
      "startsExpr": false,
      "beforeExpr": true,
      "precededBy": [
        "PAREN_CLOSE",
        "IDENTIFIER"
      ],
      "followedBy": [
        "BRACE_OPEN",
        "Expression"
      ],
      "notes": "Arrow function syntax. Does not bind this, arguments, super, or new.target. Same precedence as assignment.",
      "commonTypos": [
        "=>>",
        "->"
      ],
      "errorMessage": "Arrow function '=>' must be preceded by parameters and followed by function body."
    },
    "?": {
      "type": "conditional",
      "name": "ternary",
      "source": "ANTLR",
      "startsExpr": false,
      "beforeExpr": true,
      "disambiguation": [
        {
          "ifFollowedBy": [
            "DOT"
          ],
          "then": "OPTIONAL_CHAINING_START",
          "esVersion": "ES11",
          "notes": "obj?.prop"
        },
        {
          "ifFollowedBy": [
            "BRACKET_OPEN"
          ],
          "then": "OPTIONAL_ELEMENT_ACCESS",
          "esVersion": "ES11",
          "notes": "obj?.[key]"
        },
        {
          "ifFollowedBy": [
            "PAREN_OPEN"
          ],
          "then": "OPTIONAL_CALL",
          "esVersion": "ES11",
          "notes": "func?.()"
        },
        {
          "language": "TypeScript",
          "ifPrecededBy": [
            "IDENTIFIER"
          ],
          "then": "OPTIONAL_PROPERTY",
          "notes": "interface { prop?: string }"
        },
        {
          "default": "TERNARY_OPERATOR",
          "notes": "cond ? true : false"
        }
      ],
      "errorMessage": "Ternary operator '?' must be followed by an expression and ':' with alternative expression."
    }
  },
  "__section_04": "══════════════════════════════════════════════════════════════════════════════",
  "__section_04_number": "04",
  "__section_04_name": "punctuation",
  "__section_04_title": "【SECTION 04】JavaScript Punctuation & Separators",
  "__section_04_language": "JavaScript",
  "__section_04_total_items": 20,
  "__section_04_description": "JavaScript punctuation marks: parentheses, brackets, braces, semicolon, comma, dot, arrow, spread operator",
  "__section_04_purpose": "กำหนด punctuation marks และ separators ที่ใช้ในการ structure code พร้อม disambiguation rules",
  "__section_04_responsibility": "ให้ Brain รู้จัก punctuation และแยกแยะ context เช่น . (dot) vs ... (spread), ? (ternary) vs ?. (optional chaining)",
  "__section_04_used_by": [
    "PunctuationMatcher",
    "ContextDisambiguator",
    "SyntaxParser"
  ],
  "__section_04_footer": "══════════════════════════════════════════════════════════════════════════════",
  "__section_05": "══════════════════════════════════════════════════════════════════════════════",
  "__section_05_number": "05",
  "__section_05_name": "tokenMetadata",
  "__section_05_title": "【SECTION 05】Token Metadata & Context Flags",
  "__section_05_language": "JavaScript",
  "__section_05_total_items": 15,
  "__section_05_description": "Token metadata for parsing context: flags, contexts, and behavior indicators",
  "__section_05_purpose": "กำหนด metadata flags เช่น beforeExpr, startsExpr, isLoop เพื่อช่วยใน context-sensitive parsing",
  "__section_05_responsibility": "ให้ Brain เข้าใจ context ของ token เช่น { คือ object literal หรือ block statement",
  "__section_05_used_by": [
    "ContextAnalyzer",
    "AST Builder",
    "Ambiguity Resolver"
  ],
  "__section_05_footer": "══════════════════════════════════════════════════════════════════════════════",
  "comments": {
    "singleLine": {
      "start": "//",
      "end": "\n",
      "description": "Single-line comment - starts with // and ends at newline",
      "esVersion": "ES1",
      "source": "ECMA-262"
    },
    "multiLine": {
      "start": "/*",
      "end": "*/",
      "description": "Multi-line comment - starts with /* and ends with */",
      "esVersion": "ES1",
      "source": "ECMA-262"
    }
  },
  "tokenMetadata": {
    "flags": {
      "beforeExpr": "Token can precede expression",
      "startsExpr": "Token can start expression",
      "isLoop": "Token is loop keyword",
      "isAssign": "Token is assignment operator",
      "prefix": "Token is prefix operator",
      "postfix": "Token is postfix operator"
    },
    "contexts": {
      "braceStatement": "Brace in statement position",
      "braceExpression": "Brace in expression position",
      "templateQuasi": "Template literal quasi",
      "parenStatement": "Paren in statement position",
      "parenExpression": "Paren in expression position"
    }
  }
};
