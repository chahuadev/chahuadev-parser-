// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 3.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! BINARY PARSER - AST Parser (Structure-Based, No Semantics)
// ! ══════════════════════════════════════════════════════════════════════════════
import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Binary Type Constants 
// ! ══════════════════════════════════════════════════════════════════════════════
const BINARY_TYPES = {
    IDENTIFIER:   1,      // 0b0000000000000001
    NUMBER:       2,      // 0b0000000000000010
    OPERATOR:     8,      // 0b0000000000001000
    KEYWORD:      32,     // 0b0000000000100000
    PUNCTUATION:  64,     // 0b0000000001000000
    STRING:       128,    // 0b0000000010000000
    COMMENT:      256     // 0b0000000100000000
};

// ! ══════════════════════════════════════════════════════════════════════════════
// ! BinaryParser - AST Parser 
// ! ══════════════════════════════════════════════════════════════════════════════
export class BinaryParser {
    /**
     * สร้าง Binary Parser
     * @param {Array} tokens - Token array จาก Blank Paper Tokenizer
     * @param {string} source - Source code ต้นฉบับ
     * @param {Object} grammarIndex - Grammar Index (Brain ที่รู้ทุกอย่าง)
     */
    constructor(tokens, source, grammarIndex) {
        if (!grammarIndex) {
            report(BinaryCodes.PARSER.CONFIGURATION(6101));
            this.grammarIndex = null;
            this.tokens = [];
            this.source = '';
            this.current = 0;
            this.parseErrors = [];
            this.BINARY = BINARY_TYPES;
            this.PUNCT = {};
            return;
        }
        
        if (!tokens || !Array.isArray(tokens)) {
            report(BinaryCodes.PARSER.VALIDATION(6100));
            this.tokens = [];
        } else {
            this.tokens = tokens;
        }
        
        this.source = source || '';
        this.grammarIndex = grammarIndex;
        this.current = 0;
        this.parseErrors = []; // เก็บ errors แทนการ throw
        this.BINARY = BINARY_TYPES;
        
        // ═══════════════════════════════════════════════════════════════════════════
        // โหลด Punctuation Binary Constants จาก Grammar Index
        // ═══════════════════════════════════════════════════════════════════════════
        this.PUNCT = {
            LPAREN: grammarIndex.getPunctuationBinary('('),
            RPAREN: grammarIndex.getPunctuationBinary(')'),
            LBRACE: grammarIndex.getPunctuationBinary('{'),
            RBRACE: grammarIndex.getPunctuationBinary('}'),
            LBRACKET: grammarIndex.getPunctuationBinary('['),
            RBRACKET: grammarIndex.getPunctuationBinary(']'),
            SEMICOLON: grammarIndex.getPunctuationBinary(';'),
            COMMA: grammarIndex.getPunctuationBinary(','),
            DOT: grammarIndex.getPunctuationBinary('.'),
            COLON: grammarIndex.getPunctuationBinary(':'),
            QUESTION: grammarIndex.getPunctuationBinary('?'),
            ARROW: grammarIndex.getPunctuationBinary('=>'),
            SPREAD: grammarIndex.getPunctuationBinary('...'),
            ELLIPSIS: grammarIndex.getPunctuationBinary('...')
        };
    }



    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Main Parse Method - Entry Point
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    /**
     * Parse tokens เป็น AST
     * Pattern: โง่ๆ - แค่จับคู่ punctuation และสร้าง tree
     * 
     * @returns {Object} AST tree
     */
    parse() {
        const ast = {
            type: 'Program',
            body: [],
            sourceType: 'module',
            sourceCode: this.source,
            tokens: this.tokens
        };

        while (!this.isAtEnd()) {
            this.skipComments();
            if (this.isAtEnd()) break;
            
            const stmt = this.parseStatement();
            if (stmt) {
                ast.body.push(stmt);
            }
        }

        // Attach parse errors to AST
        ast.parseErrors = this.parseErrors;
        
        return ast;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Statement Parsing 
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    /**
     * Parse statement - ถาม Grammar Index ว่า token นี้คืออะไร
     * Pattern: โง่ๆ - ไม่รู้ความหมาย แค่รู้ว่าต้องถาม Brain
     */
    parseStatement() {
        this.skipComments();
        const token = this.peek();
        
        if (!token) return null;

        // Empty statement: ;
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance();
            return { type: 'EmptyStatement' };
        }

        // Block statement: { ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseBlockStatement();
        }

        // Keyword statement: ถาม Grammar Index
        if (token.binary === this.BINARY.KEYWORD) {
            return this.parseKeywordStatement(token);
        }

        // Labeled statement: identifier : statement
        if (token.binary === this.BINARY.IDENTIFIER) {
            if (this.matchPunctuation(this.PUNCT.COLON, 1)) {
                return this.parseLabeledStatement();
            }
        }

        // Default: expression statement
        return this.parseExpressionStatement();
    }

    /**
     * Parse keyword statement - ถาม Grammar Index ว่า keyword นี้เป็นประเภทไหน
     */
    parseKeywordStatement(token) {
        const keyword = token.value;
        
        const keywordInfo = this.grammarIndex.getKeywordInfo(keyword);
        
        if (!keywordInfo) {
            report(BinaryCodes.PARSER.SYNTAX(6001));
            return null;
        }

        const category = keywordInfo.category;

        switch (category) {
            case 'declaration':
                return this.parseDeclaration(keyword, keywordInfo);
            case 'control':
                return this.parseControl(keyword, keywordInfo);
            case 'iteration':
                return this.parseIteration(keyword, keywordInfo);
            case 'exception':
                return this.parseException(keyword, keywordInfo);
            case 'module':
                return this.parseModule(keyword, keywordInfo);
            case 'modifier':
                return this.parseModifier(keyword, keywordInfo);
            case 'statement':
                return this.parseStatementKeyword(keyword, keywordInfo);
            default:
                // ไม่รู้จัก category - ลอง parse เป็น expression
                return this.parseExpressionStatement();
        }
    }

    /**
     * Parse block statement - จับคู่ { กับ } แบบโง่ๆ
     */
    parseBlockStatement() {
        this.consumePunctuation(this.PUNCT.LBRACE);
        const body = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) body.push(stmt);
        }

        this.consumePunctuation(this.PUNCT.RBRACE);
        
        return {
            type: 'BlockStatement',
            body: body
        };
    }

    /**
     * Parse labeled statement: label: statement
     */
    parseLabeledStatement() {
        const start = this.current;
        const label = this.parseIdentifier();
        
        this.consumePunctuation(this.PUNCT.COLON);
        const statement = this.parseStatement();
        
        return {
            type: 'LabeledStatement',
            label: label,
            body: statement,
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Declaration Parsing 
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseDeclaration(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // Skip keyword

        // ถาม Grammar Index: keyword นี้เป็น declaration ประเภทไหน?
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const constBinary = this.grammarIndex.getKeywordBinary('const');
        const letBinary = this.grammarIndex.getKeywordBinary('let');
        const varBinary = this.grammarIndex.getKeywordBinary('var');
        const functionBinary = this.grammarIndex.getKeywordBinary('function');
        const classBinary = this.grammarIndex.getKeywordBinary('class');

        // จับคู่ binary แบบโง่ๆ (ไม่รู้ความหมาย)
        if (keywordBinary === constBinary || keywordBinary === letBinary || keywordBinary === varBinary) {
            return this.parseVariableDeclaration(keyword, start);
        } else if (keywordBinary === functionBinary) {
            return this.parseFunctionDeclaration(start);
        } else if (keywordBinary === classBinary) {
            return this.parseClassDeclaration(start);
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6002));
            return null;
        }
    }

    parseVariableDeclaration(kind, start) {
        const declarations = [];

        do {
            let id;
            
            // Destructuring patterns
            if (this.matchPunctuation(this.PUNCT.LBRACE)) {
                id = this.parseObjectPattern();
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                id = this.parseArrayPattern();
            } else {
                id = this.parseIdentifier();
            }

            let init = null;

            // Check for assignment operator (=)
            const assignOp = this.peek();
            if (assignOp && assignOp.binary === this.BINARY.OPERATOR) {
                const operatorBinary = this.grammarIndex.getOperatorBinary(assignOp.value);
                if (this.grammarIndex.isSimpleAssignmentByBinary?.(operatorBinary)) {
                    this.advance(); // Skip '='
                    init = this.parseExpression();
                }
            }

            declarations.push({
                type: 'VariableDeclarator',
                id: id,
                init: init
            });

        } while (this.matchPunctuation(this.PUNCT.COMMA) && this.advance());

        this.consumeSemicolon();

        return {
            type: 'VariableDeclaration',
            kind: kind,
            declarations: declarations,
            start: start,
            end: this.current
        };
    }

    parseFunctionDeclaration(start) {
        const id = this.parseIdentifier();
        const params = this.parseParameterList();
        const body = this.parseBlockStatement();

        return {
            type: 'FunctionDeclaration',
            id: id,
            params: params,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseClassDeclaration(start) {
        const id = this.parseIdentifier();
        this.consumePunctuation(this.PUNCT.LBRACE);
        
        const body = [];
        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            // Skip class members (simplified)
            this.advance();
        }
        
        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ClassDeclaration',
            id: id,
            body: { type: 'ClassBody', body: body },
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Control Flow Parsing 
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseControl(keyword, keywordInfo) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const ifBinary = this.grammarIndex.getKeywordBinary('if');
        const returnBinary = this.grammarIndex.getKeywordBinary('return');
        const breakBinary = this.grammarIndex.getKeywordBinary('break');
        const continueBinary = this.grammarIndex.getKeywordBinary('continue');
        const switchBinary = this.grammarIndex.getKeywordBinary('switch');

        if (keywordBinary === ifBinary) {
            return this.parseIfStatement(start);
        } else if (keywordBinary === returnBinary) {
            return this.parseReturnStatement(start);
        } else if (keywordBinary === breakBinary) {
            return this.parseBreakStatement(start);
        } else if (keywordBinary === continueBinary) {
            return this.parseContinueStatement(start);
        } else if (keywordBinary === switchBinary) {
            return this.parseSwitchStatement(start);
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6003));
            return null;
        }
    }

    parseIfStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        const consequent = this.parseStatement();
        
        let alternate = null;
        const nextToken = this.peek();
        if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
            const nextTokenBinary = this.grammarIndex.getKeywordBinary(nextToken.value);
            const elseBinary = this.grammarIndex.getKeywordBinary('else');
            if (nextTokenBinary === elseBinary) {
                this.advance();
                alternate = this.parseStatement();
            }
        }

        return {
            type: 'IfStatement',
            test: test,
            consequent: consequent,
            alternate: alternate,
            start: start,
            end: this.current
        };
    }

    parseReturnStatement(start) {
        let argument = null;
        
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            argument = this.parseExpression();
        }
        
        this.consumeSemicolon();

        return {
            type: 'ReturnStatement',
            argument: argument,
            start: start,
            end: this.current
        };
    }

    parseBreakStatement(start) {
        this.consumeSemicolon();
        return {
            type: 'BreakStatement',
            start: start,
            end: this.current
        };
    }

    parseContinueStatement(start) {
        this.consumeSemicolon();
        return {
            type: 'ContinueStatement',
            start: start,
            end: this.current
        };
    }

    parseSwitchStatement(start) {
        // Simplified switch parsing
        this.consumePunctuation(this.PUNCT.LPAREN);
        const discriminant = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        this.consumePunctuation(this.PUNCT.LBRACE);
        
        const cases = [];
        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.advance(); // Skip for now
        }
        
        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'SwitchStatement',
            discriminant: discriminant,
            cases: cases,
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Iteration Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseIteration(keyword, keywordInfo) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const forBinary = this.grammarIndex.getKeywordBinary('for');
        const whileBinary = this.grammarIndex.getKeywordBinary('while');
        const doBinary = this.grammarIndex.getKeywordBinary('do');

        if (keywordBinary === forBinary) {
            return this.parseForStatement(start);
        } else if (keywordBinary === whileBinary) {
            return this.parseWhileStatement(start);
        } else if (keywordBinary === doBinary) {
            return this.parseDoWhileStatement(start);
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6004));
            return null;
        }
    }

    parseForStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        
        let init = null;
        let test = null;
        let update = null;

        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            init = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.SEMICOLON);

        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            test = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.SEMICOLON);

        if (!this.matchPunctuation(this.PUNCT.RPAREN)) {
            update = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.RPAREN);

        const body = this.parseStatement();

        return {
            type: 'ForStatement',
            init: init,
            test: test,
            update: update,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseWhileStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        const body = this.parseStatement();

        return {
            type: 'WhileStatement',
            test: test,
            body: body,
            start: start,
            end: this.current
        };
    }

    parseDoWhileStatement(start) {
        const body = this.parseStatement();
        this.consumeKeyword('while');
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        this.consumeSemicolon();

        return {
            type: 'DoWhileStatement',
            body: body,
            test: test,
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Exception Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseException(keyword, keywordInfo) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const tryBinary = this.grammarIndex.getKeywordBinary('try');
        const throwBinary = this.grammarIndex.getKeywordBinary('throw');

        if (keywordBinary === tryBinary) {
            return this.parseTryStatement(start);
        } else if (keywordBinary === throwBinary) {
            return this.parseThrowStatement(start);
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6005));
            return null;
        }
    }

    parseTryStatement(start) {
        const block = this.parseBlockStatement();
        
        let handler = null;
        let nextToken = this.peek();
        if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
            const nextTokenBinary = this.grammarIndex.getKeywordBinary(nextToken.value);
            const catchBinary = this.grammarIndex.getKeywordBinary('catch');
            if (nextTokenBinary === catchBinary) {
                this.advance();
                this.consumePunctuation(this.PUNCT.LPAREN);
                const param = this.parseIdentifier();
                this.consumePunctuation(this.PUNCT.RPAREN);
                const body = this.parseBlockStatement();
                
                handler = {
                    type: 'CatchClause',
                    param: param,
                    body: body
                };
            }
        }

        let finalizer = null;
        nextToken = this.peek();
        if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
            const nextTokenBinary = this.grammarIndex.getKeywordBinary(nextToken.value);
            const finallyBinary = this.grammarIndex.getKeywordBinary('finally');
            if (nextTokenBinary === finallyBinary) {
                this.advance();
                finalizer = this.parseBlockStatement();
            }
        }

        return {
            type: 'TryStatement',
            block: block,
            handler: handler,
            finalizer: finalizer,
            start: start,
            end: this.current
        };
    }

    parseThrowStatement(start) {
        const argument = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ThrowStatement',
            argument: argument,
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Module Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseModule(keyword, keywordInfo) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const importBinary = this.grammarIndex.getKeywordBinary('import');
        const exportBinary = this.grammarIndex.getKeywordBinary('export');

        if (keywordBinary === importBinary) {
            return this.parseImportDeclaration(start);
        } else if (keywordBinary === exportBinary) {
            return this.parseExportDeclaration(start);
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6006));
            return null;
        }
    }

    parseImportDeclaration(start) {
        // Simplified - skip to semicolon
        while (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumeSemicolon();

        return {
            type: 'ImportDeclaration',
            specifiers: [],
            source: { type: 'Literal', value: 'unknown' },
            start: start,
            end: this.current
        };
    }

    parseExportDeclaration(start) {
        // Simplified - skip to semicolon
        while (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumeSemicolon();

        return {
            type: 'ExportDeclaration',
            declaration: null,
            start: start,
            end: this.current
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Modifier Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseModifier(keyword, keywordInfo) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const asyncBinary = this.grammarIndex.getKeywordBinary('async');

        if (keywordBinary === asyncBinary) {
            const nextToken = this.peek();
            
            if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
                const nextKeywordBinary = this.grammarIndex.getKeywordBinary(nextToken.value);
                const functionBinary = this.grammarIndex.getKeywordBinary('function');
                
                if (nextKeywordBinary === functionBinary) {
                    this.advance();
                    const func = this.parseFunctionDeclaration(start);
                    func.async = true;
                    return func;
                }
            }
            
            report(BinaryCodes.PARSER.SYNTAX(6007));
            return null;
        }

        report(BinaryCodes.PARSER.SYNTAX(6008));
        return null;
    }

    parseStatementKeyword(keyword, keywordInfo) {
        const start = this.current;
        
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const debuggerBinary = this.grammarIndex.getKeywordBinary('debugger');
        const withBinary = this.grammarIndex.getKeywordBinary('with');
        
        if (keywordBinary === debuggerBinary) {
            this.consumeSemicolon();
            return {
                type: 'DebuggerStatement',
                start: start,
                end: this.current
            };
        } else if (keywordBinary === withBinary) {
            this.consumePunctuation(this.PUNCT.LPAREN);
            const object = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);
            const body = this.parseStatement();
            
            return {
                type: 'WithStatement',
                object: object,
                body: body,
                start: start,
                end: this.current
            };
        } else {
            report(BinaryCodes.PARSER.SYNTAX(6009));
            return null;
        }
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Expression Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    }

    /**
     * Parse expression - แบบโง่ๆ (ไม่รู้ operator precedence)
     * แค่จับคู่ punctuation และสร้าง tree
     */
    parseExpression(precedence = 0) {
        let left = this.parsePrimary();

        while (!this.isAtEnd()) {
            const token = this.peek();
            
            // Infix operators
            if (token && token.binary === this.BINARY.OPERATOR) {
                const op = this.advance();
                const right = this.parsePrimary();
                
                left = {
                    type: 'BinaryExpression',
                    operator: op.value,
                    left: left,
                    right: right
                };
            }
            // Member expression: obj.prop
            else if (this.matchPunctuation(this.PUNCT.DOT)) {
                this.advance();
                const property = this.parseIdentifier();
                
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: false
                };
            }
            // Computed member: obj[prop]
            else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                this.advance();
                const property = this.parseExpression();
                this.consumePunctuation(this.PUNCT.RBRACKET);
                
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: true
                };
            }
            // Call expression: func()
            else if (this.matchPunctuation(this.PUNCT.LPAREN)) {
                const args = this.parseArgumentList();
                
                left = {
                    type: 'CallExpression',
                    callee: left,
                    arguments: args
                };
            }
            else {
                break;
            }
        }

        return left;
    }

    /**
     * Parse primary expression - literals, identifiers, grouping
     */
    parsePrimary() {
        const token = this.peek();

        if (!token) {
            report(BinaryCodes.PARSER.SYNTAX(6010));
            return null;
        }

        // Number literal
        if (token.binary === this.BINARY.NUMBER) {
            this.advance();
            return {
                type: 'Literal',
                value: parseFloat(token.value),
                raw: token.value
            };
        }

        // String literal
        if (token.binary === this.BINARY.STRING) {
            this.advance();
            return {
                type: 'Literal',
                value: token.value.slice(1, -1),
                raw: token.value
            };
        }

        // Boolean/null keywords
        if (token.binary === this.BINARY.KEYWORD) {
            if (token.value === 'true' || token.value === 'false') {
                this.advance();
                return {
                    type: 'Literal',
                    value: token.value === 'true',
                    raw: token.value
                };
            }
            if (token.value === 'null') {
                this.advance();
                return {
                    type: 'Literal',
                    value: null,
                    raw: 'null'
                };
            }
        }

        // Identifier
        if (token.binary === this.BINARY.IDENTIFIER) {
            return this.parseIdentifier();
        }

        // Grouping: (expr)
        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            this.advance();
            const expr = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);
            return expr;
        }

        // Object literal: { ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseObjectLiteral();
        }

        // Array literal: [ ... ]
        if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
            return this.parseArrayLiteral();
        }

        report(BinaryCodes.PARSER.SYNTAX(6011));
        return null;
    }

    parseObjectLiteral() {
        const properties = [];
        this.consumePunctuation(this.PUNCT.LBRACE);

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            const key = this.parseIdentifier();
            
            if (this.matchPunctuation(this.PUNCT.COLON)) {
                this.advance();
                const value = this.parseExpression();
                
                properties.push({
                    type: 'Property',
                    key: key,
                    value: value,
                    kind: 'init',
                    shorthand: false
                });
            } else {
                properties.push({
                    type: 'Property',
                    key: key,
                    value: key,
                    kind: 'init',
                    shorthand: true
                });
            }

            if (!this.matchPunctuation(this.PUNCT.RBRACE)) {
                this.consumePunctuation(this.PUNCT.COMMA);
            }
        }

        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ObjectExpression',
            properties: properties
        };
    }

    parseArrayLiteral() {
        const elements = [];
        this.consumePunctuation(this.PUNCT.LBRACKET);

        while (!this.matchPunctuation(this.PUNCT.RBRACKET) && !this.isAtEnd()) {
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                elements.push(null);
                this.advance();
            } else {
                elements.push(this.parseExpression());
                if (!this.matchPunctuation(this.PUNCT.RBRACKET)) {
                    this.consumePunctuation(this.PUNCT.COMMA);
                }
            }
        }

        this.consumePunctuation(this.PUNCT.RBRACKET);

        return {
            type: 'ArrayExpression',
            elements: elements
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Helper Methods 
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseIdentifier() {
        const token = this.peek();
        if (token && (token.binary === this.BINARY.IDENTIFIER || token.binary === this.BINARY.KEYWORD)) {
            this.advance();
            return {
                type: 'Identifier',
                name: token.value
            };
        }
        this.createParserError(`Expected identifier but got '${token?.value || 'EOF'}'`);
        return null;
    }

    parseObjectPattern() {
        // Simplified
        this.consumePunctuation(this.PUNCT.LBRACE);
        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumePunctuation(this.PUNCT.RBRACE);
        return { type: 'ObjectPattern', properties: [] };
    }

    parseArrayPattern() {
        // Simplified
        this.consumePunctuation(this.PUNCT.LBRACKET);
        while (!this.matchPunctuation(this.PUNCT.RBRACKET) && !this.isAtEnd()) {
            this.advance();
        }
        this.consumePunctuation(this.PUNCT.RBRACKET);
        return { type: 'ArrayPattern', elements: [] };
    }

    parseParameterList() {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const params = [];

        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            params.push(this.parseIdentifier());
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            }
        }

        this.consumePunctuation(this.PUNCT.RPAREN);
        return params;
    }

    parseArgumentList() {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const args = [];

        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            args.push(this.parseExpression());
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            }
        }

        this.consumePunctuation(this.PUNCT.RPAREN);
        return args;
    }

    skipComments() {
        while (this.peek() && this.peek().binary === this.BINARY.COMMENT) {
            this.advance();
        }
    }

    consumeSemicolon() {
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance();
        }
    }

    consumeKeyword(keyword) {
        const token = this.peek();
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const tokenBinary = token ? this.grammarIndex.getKeywordBinary(token.value) : null;
        
        if (token && token.binary === this.BINARY.KEYWORD && tokenBinary === keywordBinary) {
            this.advance();
            return token;
        }
        
        this.createParserError(`Expected keyword '${keyword}' but got '${token?.value || 'EOF'}'`);
        return null;
    }

    consumePunctuation(punctBinary) {
        const token = this.peek();
        if (this.matchPunctuation(punctBinary)) {
            this.advance();
            return token;
        }
        
        const expected = this.grammarIndex.getPunctuationFromBinary?.(punctBinary) || 'unknown';
        this.createParserError(`Expected '${expected}' but got '${token?.value || 'EOF'}'`);
        return null;
    }

    matchPunctuation(punctBinary, offset = 0) {
        const token = this.peek(offset);
        return token && 
               token.binary === this.BINARY.PUNCTUATION && 
               token.punctuationBinary === punctBinary;
    }

    peek(offset = 0) {
        return this.tokens[this.current + offset];
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }
}

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Export
// ! ══════════════════════════════════════════════════════════════════════════════

export default BinaryParser;
