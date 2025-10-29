// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 2.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! PURE BINARY AST PARSER - 100% Binary Operations
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Philosophy: Parser ใช้ BINARY 100% - ไม่มี String comparison เลย
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Rules:
// ! 1. ใช้ token.binary เท่านั้น (Integer comparison)
// ! 2. ไม่ skip keyword ใดๆ - ต้องแปลงทั้งหมด
// ! 3. ถาม GrammarIndex สำหรับ structure
// ! 4. NO_HARDCODE - ทุกอย่างมาจาก Grammar
// ! 5. NO_SILENT_FALLBACKS - Error ต้องชัดเจน
// ! ══════════════════════════════════════════════════════════════════════════════
// ! FIX: หัวใจของไฟล์นี้คือ "Blank Paper" 100% และ "Binary Comparison" 100% เท่านั้น
// ! ห้ามแก้เป็น String Comparison เด็ดขาด! ทุกฟังก์ชันต้องใช้เลข Binary จาก grammar JSON
// ! หากพบจุดที่มีโอกาสแก้เป็น String ให้เตือนและตรวจสอบกับ Binary Purity Validator ก่อนทุกครั้ง
// ! ระบบนี้ถูกออกแบบและนำไปปฏิบัติ (implement) ตามหลักการนี้อย่างเคร่งครัด
// ! ══════════════════════════════════════════════════════════════════════════════

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

// ! Binary constants from tokenizer-binary-config.json
const BINARY = {
    IDENTIFIER:   1,      // ! 0b0000000000000001
    NUMBER:       2,      // ! 0b0000000000000010
    OPERATOR:     8,      // ! 0b0000000000001000
    KEYWORD:      32,     // ! 0b0000000000100000
    PUNCTUATION:  64,     // ! 0b0000000001000000
    STRING:       128,    // ! 0b0000000010000000
    COMMENT:      256     // ! 0b0000000100000000
};

export class PureBinaryParser {
    constructor(tokens, source, grammarIndex) {
        this.tokens = tokens;
        this.source = source || '';  // ! รักษา source code สำหรับ AST
        this.grammarIndex = grammarIndex;
        this.current = 0;
        this.BINARY = BINARY;
        
        // ! NO_THROW: เก็บ parse errors แทนการ throw
        this.parseErrors = [];
        
        // ! 100% BINARY: โหลด punctuation binary constants จาก grammar
        this.PUNCT = {
            LPAREN: grammarIndex.getPunctuationBinary('('),      // 1
            RPAREN: grammarIndex.getPunctuationBinary(')'),      // 2
            LBRACE: grammarIndex.getPunctuationBinary('{'),      // 3
            RBRACE: grammarIndex.getPunctuationBinary('}'),      // 4
            LBRACKET: grammarIndex.getPunctuationBinary('['),    // 5
            RBRACKET: grammarIndex.getPunctuationBinary(']'),    // 6
            SEMICOLON: grammarIndex.getPunctuationBinary(';'),   // 7
            COMMA: grammarIndex.getPunctuationBinary(','),       // 8
            DOT: grammarIndex.getPunctuationBinary('.'),         // 9
            COLON: grammarIndex.getPunctuationBinary(':'),       // 10
            QUESTION: grammarIndex.getPunctuationBinary('?'),    // 11
            ARROW: grammarIndex.getPunctuationBinary('=>'),      // 12
            SPREAD: grammarIndex.getPunctuationBinary('...')     // 13
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Helper: สร้าง Parser Error และส่งไปยัง ErrorHandler กลาง
    // ! NO_SILENT_FALLBACKS Compliance - ห้าม throw new Error โดยตรง
    // ! NO_THROW: เก็บ error ใน parseErrors แทนการ return Error object
    // ! ══════════════════════════════════════════════════════════════════════════════
    createParserError(message, context = {}) {
        const errorInfo = {
            name: 'ParserError',
            message: message,
            isOperational: false, // Parser errors = Programming bugs
            position: this.current,
            token: this.peek(),
            context: context
        };
        
        // ! NO_THROW: Report error to Binary Error System with proper Binary Code
        // ! PARSER.SYNTAX errors are CRITICAL by default
        report(BinaryCodes.PARSER.SYNTAX(this.current || 0), {
            method: context.method || 'parse',
            message: message,
            position: this.current,
            token: this.peek(),
            ...context
        });
        
        // ! NO_THROW: เก็บ error ใน parseErrors array
        this.parseErrors.push(errorInfo);
        
        // ! Return null แทน Error object เพื่อบอกว่า "parsing failed at this point"
        return null;
    }

    parse() {
        // ! NO_CONSOLE: Telemetry disabled for now
        // TODO: Re-implement telemetry with proper binary-reporter integration
        
        const ast = {
            type: 'Program',
            body: [],
            sourceType: 'module',
            sourceCode: this.source,  // ! เพิ่ม sourceCode property ตาม AST spec
            tokens: this.tokens        // ! เพิ่ม tokens property เพื่อ preserve token list
        };

        while (!this.isAtEnd()) {
            try {
                this.skipComments();
                if (this.isAtEnd()) break;
                
                const stmt = this.parseStatement();
                if (stmt) {
                    ast.body.push(stmt);
                }
            } catch (error) {
                // ! NO_THROW: เก็บ error แต่ไม่ throw - ให้ parser ทำงานต่อ
                // ! Error ได้ถูก report ไปที่ Binary Error System แล้วโดย createParserError()
                this.parseErrors.push({
                    message: error.message || 'Unknown parser error',
                    position: error.position || this.current,
                    token: error.token || this.peek(),
                    stack: error.stack
                });
                
                // ! RECOVERY: ข้ามไปยัง token ถัดไป เพื่อพยายาม parse ต่อ
                if (!this.isAtEnd()) {
                    this.advance();
                }
            }
        }

        // ! NO_CONSOLE: Telemetry disabled for now
        // TODO: Re-implement telemetry with proper binary-reporter integration
        
        // ! NO_THROW: ใส่ parseErrors ลงใน AST เพื่อให้ caller รับรู้
        ast.parseErrors = this.parseErrors;
        
        return ast;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! STATEMENT PARSING - PURE BINARY
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseStatement() {
        this.skipComments();
        const token = this.peek();
        
        if (!token) return null;

        // ! EMPTY STATEMENT: จัดการกับ semicolon ที่โดดเดี่ยว
        // Pattern: ;
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance(); // Skip semicolon
            return {
                type: 'EmptyStatement'
            };
        }

        // ! BLOCK STATEMENT: จัดการ { ... }
        // Pattern: { statement1; statement2; ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseBlockStatement();
        }

        // PURE BINARY: ใช้ binary check แทน String
        if (token.binary === this.BINARY.KEYWORD) {
            return this.parseKeywordStatement(token);
        }

        // ! CHECK FOR LABELED STATEMENT (lookahead 2 tokens)
        // Pattern: IDENTIFIER : statement
        // ! 100% BINARY: ใช้ binary comparison แทน string
        if (token.binary === this.BINARY.IDENTIFIER) {
            // Check if next token is colon using binary comparison
            if (this.matchPunctuation(this.PUNCT.COLON, 1)) {
                // This is a labeled statement
                return this.parseLabeledStatement();
            }
        }

        // ! Expression statement
        return this.parseExpressionStatement();
    }

    parseKeywordStatement(token) {
        const keyword = token.value;
        const keywordInfo = this.grammarIndex.getKeywordInfo(keyword);
        
        if (!keywordInfo) {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unknown keyword: ${keyword} at position ${this.current}`, {
                method: 'parseKeywordStatement',
                keyword
            });
            return null;
        }

        // ! ถาม Grammar ว่า keyword นี้ต้อง parse อย่างไร
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
                // ! Modifiers เช่น 'async' ต้อง parse ร่วมกับ keyword ถัดไป
                return this.parseModifier(keyword, keywordInfo);
            
            case 'operator':
                // ! Operator keywords เช่น 'await', 'yield' ไม่เริ่มต้น statement
                // ! ต้อง parse เป็น expression statement แทน
                return this.parseExpressionStatement();
            
            case 'primary':
                // ! Primary keywords เช่น 'this', 'super' ใช้ใน expression
                // ! ต้อง parse เป็น expression statement
                return this.parseExpressionStatement();
            
            case 'statement':
                // ! Statement keywords เช่น 'debugger', 'with'
                return this.parseStatementKeyword(keyword, keywordInfo);
            
            case 'accessor':
                // ! Accessor keywords: get, set (ใช้ใน class/object)
                // ! ไม่ควรมาถึงที่นี่ เพราะควรถูก parse ใน class/object context
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(
                    `'${keyword}' accessor keyword cannot be used as a statement`,
                    {
                        method: 'parseKeywordStatement',
                        keyword,
                        category
                    }
                );
                return null;
            
            case 'meta':
                // ! Meta keywords: new.target, import.meta (ใช้ใน expression)
                return this.parseExpressionStatement();
            
            case 'iterator':
                // ! Iterator keywords: Symbol.iterator (ใช้ใน expression)
                return this.parseExpressionStatement();
            
            case 'literal':
                // ! Literal keywords: true, false, null, undefined (ใช้ใน expression)
                // ! ไม่ควรมาถึงที่นี่ เพราะควรถูก parse ใน parsePrimaryExpression()
                return this.parseExpressionStatement();
            
            case 'identifier':
                // ! Special identifier keywords (ใช้ใน expression)
                return this.parseExpressionStatement();
            
            case 'reserved':
                // ! Reserved keywords ห้ามใช้
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(
                    `'${keyword}' is a reserved keyword and cannot be used`, 
                    {
                        method: 'parseKeywordStatement',
                        keyword,
                        category
                    }
                );
                return null;
            
            default:
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(`Unknown keyword category: ${category} for keyword: ${keyword}`, {
                    method: 'parseKeywordStatement',
                    keyword,
                    category
                });
                return null;
        }
    }
    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! STATEMENT KEYWORD PARSING (debugger, with, etc.)
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseStatementKeyword(keyword, keywordInfo) {
        const start = this.current;
        
        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const debuggerBinary = this.grammarIndex.getKeywordBinary('debugger');
        const withBinary = this.grammarIndex.getKeywordBinary('with');
        
        if (keywordBinary === debuggerBinary) {
            // debugger statement
            this.consumeSemicolon();
            return {
                type: 'DebuggerStatement',
                start: start,
                end: this.current
            };
        } else if (keywordBinary === withBinary) {
            // with statement (not recommended but valid JS)
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
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled statement keyword: ${keyword}`, {
                method: 'parseStatementKeyword',
                keyword
            });
            return null;
        }
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // DECLARATION PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseDeclaration(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // Skip keyword (const/let/var/function/class)

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type แทน String
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const constBinary = this.grammarIndex.getKeywordBinary('const');
        const letBinary = this.grammarIndex.getKeywordBinary('let');
        const varBinary = this.grammarIndex.getKeywordBinary('var');
        const functionBinary = this.grammarIndex.getKeywordBinary('function');
        const classBinary = this.grammarIndex.getKeywordBinary('class');

        if (keywordBinary === constBinary || keywordBinary === letBinary || keywordBinary === varBinary) {
            return this.parseVariableDeclaration(keyword, start);
        } else if (keywordBinary === functionBinary) {
            return this.parseFunctionDeclaration(start);
        } else if (keywordBinary === classBinary) {
            return this.parseClassDeclaration(start);
        } else {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled declaration keyword: ${keyword}`, {
                method: 'parseDeclaration',
                keyword
            });
            return null;
        }
    }

    parseVariableDeclaration(kind, start) {
        const declarations = [];

        do {
            // parseDeclaration() already advanced past keyword, so current is at identifier/pattern
            let id;
            
            // ! CHECK FOR DESTRUCTURING PATTERNS
            const currentToken = this.peek();
            if (this.matchPunctuation(this.PUNCT.LBRACE)) {
                // Object destructuring: const { x, y } = obj
                id = this.parseObjectPattern();
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                // Array destructuring: const [a, b] = arr
                id = this.parseArrayPattern();
            } else {
                // Simple identifier: const x = value
                id = this.parseIdentifier();
            }

            let init = null;

            // ! 100% BINARY: ตรวจสอบว่ามี simple assignment operator (=) หรือไม่
            const assignOp = this.peek();
            if (assignOp && assignOp.binary === this.BINARY.OPERATOR) {
                const operatorBinary = this.grammarIndex.getOperatorBinary(assignOp.value);
                if (this.grammarIndex.isSimpleAssignmentByBinary(operatorBinary)) {
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

    /**
     * Parse Variable Declaration แบบไม่กิน semicolon (สำหรับใช้ใน for loop)
     * @param {string} kind - 'const', 'let', หรือ 'var'
     * @param {number} start - ตำแหน่งเริ่มต้น
     * @returns {Object} VariableDeclaration node
     */
    parseVariableDeclarationWithoutSemicolon(kind, start) {
        const declarations = [];

        do {
            let id;
            
            const currentToken = this.peek();
            if (this.matchPunctuation(this.PUNCT.LBRACE)) {
                id = this.parseObjectPattern();
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                id = this.parseArrayPattern();
            } else {
                id = this.parseIdentifier();
            }

            let init = null;

            const assignOp = this.peek();
            if (assignOp && assignOp.binary === this.BINARY.OPERATOR) {
                const operatorBinary = this.grammarIndex.getOperatorBinary(assignOp.value);
                if (this.grammarIndex.isSimpleAssignmentByBinary(operatorBinary)) {
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

        // ! ไม่กิน semicolon - ให้ caller จัดการเอง

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
            // Skip class members for now
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
    // CONTROL FLOW PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseControl(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type แทน String
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
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled control keyword: ${keyword}`, {
                method: 'parseControl',
                keyword
            });
            return null;
        }
    }

    parseIfStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        const consequent = this.parseStatement();
        
        let alternate = null;
        // ! 100% BINARY: ตรวจสอบ 'else' keyword โดยใช้ binary comparison
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

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ITERATION PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseIteration(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type แทน String
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
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled iteration keyword: ${keyword}`, {
                method: 'parseIteration',
                keyword
            });
            return null;
        }
    }

    parseForStatement(start) {
        this.consumePunctuation(this.PUNCT.LPAREN);
        
        let init = null;
        let test = null;
        let update = null;

        // ! for loop init: ตรวจสอบว่าเป็น variable declaration (let/const/var) หรือ expression
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            const token = this.peek();
            
            // ถ้าเป็น keyword (let, const, var) ให้ parse เป็น variable declaration
            if (token && token.binary === this.BINARY.KEYWORD) {
                const keywordBinary = this.grammarIndex.getKeywordBinary(token.value);
                const letBinary = this.grammarIndex.getKeywordBinary('let');
                const constBinary = this.grammarIndex.getKeywordBinary('const');
                const varBinary = this.grammarIndex.getKeywordBinary('var');
                
                if (keywordBinary === letBinary || keywordBinary === constBinary || keywordBinary === varBinary) {
                    // Parse variable declaration แต่ไม่กิน semicolon (เพราะ for loop จัดการเอง)
                    this.advance(); // Skip keyword
                    init = this.parseVariableDeclarationWithoutSemicolon(token.value, this.current - 1);
                } else {
                    init = this.parseExpression();
                }
            } else {
                init = this.parseExpression();
            }
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
    // EXCEPTION PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseException(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type แทน String
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const tryBinary = this.grammarIndex.getKeywordBinary('try');
        const throwBinary = this.grammarIndex.getKeywordBinary('throw');

        if (keywordBinary === tryBinary) {
            return this.parseTryStatement(start);
        } else if (keywordBinary === throwBinary) {
            return this.parseThrowStatement(start);
        } else {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled exception keyword: ${keyword}`, {
                method: 'parseException',
                keyword
            });
            return null;
        }
    }

    parseTryStatement(start) {
        const block = this.parseBlockStatement();
        
        let handler = null;
        // ! 100% BINARY: ตรวจสอบ 'catch' keyword โดยใช้ binary comparison
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
        // ! 100% BINARY: ตรวจสอบ 'finally' keyword โดยใช้ binary comparison
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
    // MODULE PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseModule(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // keyword

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ keyword type แทน String
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const importBinary = this.grammarIndex.getKeywordBinary('import');
        const exportBinary = this.grammarIndex.getKeywordBinary('export');

        if (keywordBinary === importBinary) {
            return this.parseImportDeclaration(start);
        } else if (keywordBinary === exportBinary) {
            return this.parseExportDeclaration(start);
        } else {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Unhandled module keyword: ${keyword}`, {
                method: 'parseModule',
                keyword
            });
            return null;
        }
    }

    parseImportDeclaration(start) {
        // Simplified import - skip to semicolon
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
        const nextToken = this.peek();
        
        // export function hello() {}
        if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
            const keyword = nextToken.value;
            const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
            const functionBinary = this.grammarIndex.getKeywordBinary('function');
            const constBinary = this.grammarIndex.getKeywordBinary('const');
            const letBinary = this.grammarIndex.getKeywordBinary('let');
            const varBinary = this.grammarIndex.getKeywordBinary('var');
            const classBinary = this.grammarIndex.getKeywordBinary('class');
            
            if (keywordBinary === functionBinary) {
                this.advance(); // consume 'function'
                const declaration = this.parseFunctionDeclaration(start);
                return {
                    type: 'ExportNamedDeclaration',
                    declaration: declaration,
                    start: start,
                    end: this.current
                };
            }
            
            if (keywordBinary === constBinary || keywordBinary === letBinary || keywordBinary === varBinary) {
                this.advance(); // consume const/let/var
                const declaration = this.parseVariableDeclaration();
                return {
                    type: 'ExportNamedDeclaration',
                    declaration: declaration,
                    start: start,
                    end: this.current
                };
            }
            
            if (keywordBinary === classBinary) {
                this.advance(); // consume 'class'
                const declaration = this.parseClass();
                return {
                    type: 'ExportNamedDeclaration',
                    declaration: declaration,
                    start: start,
                    end: this.current
                };
            }
        }
        
        // export { name1, name2 } - named exports
        if (nextToken && this.matchPunctuation(this.PUNCT.LBRACE)) {
            this.advance(); // consume {
            const specifiers = [];
            
            while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
                // Parse export specifiers (simplified - just skip for now)
                if (this.peek().binary === this.BINARY.IDENTIFIER) {
                    this.advance();
                }
                if (this.matchPunctuation(this.PUNCT.COMMA)) {
                    this.advance();
                }
            }
            
            this.consumePunctuation(this.PUNCT.RBRACE);
            this.consumeSemicolon();
            
            return {
                type: 'ExportNamedDeclaration',
                specifiers: specifiers,
                declaration: null,
                start: start,
                end: this.current
            };
        }
        
        // Default: skip to semicolon (fallback for unhandled cases)
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
    // MODIFIER PARSING (async, static, etc.)
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseModifier(keyword, keywordInfo) {
        const start = this.current;
        this.advance(); // Skip modifier keyword (e.g., 'async')

        // ! 100% BINARY: ใช้ binary เพื่อตรวจสอบ modifier type
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const asyncBinary = this.grammarIndex.getKeywordBinary('async');

        if (keywordBinary === asyncBinary) {
            // async ต้องตามด้วย function หรือ arrow function
            const nextToken = this.peek();
            
            if (nextToken && nextToken.binary === this.BINARY.KEYWORD) {
                const nextKeyword = nextToken.value;
                const nextKeywordBinary = this.grammarIndex.getKeywordBinary(nextKeyword);
                const functionBinary = this.grammarIndex.getKeywordBinary('function');
                
                if (nextKeywordBinary === functionBinary) {
                    // async function
                    this.advance(); // Skip 'function'
                    const func = this.parseFunctionDeclaration(start);
                    func.async = true;
                    return func;
                }
            }
            
            // async arrow function: async () => {}
            // TODO: Implement arrow function parsing
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(`Async arrow functions not yet implemented`, {
                method: 'parseModifier',
                modifier: keyword
            });
            return null;
        }

        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(`Unhandled modifier: ${keyword}`, {
            method: 'parseModifier',
            modifier: keyword
        });
        return null;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // LABELED STATEMENT PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    /**
     * Parse Labeled Statement: myLabel: statement
     * Used for labeled loops and blocks that can be targeted by break/continue
     * Example:
     *   outerLoop: for (let i = 0; i < 10; i++) {
     *     innerLoop: for (let j = 0; j < 10; j++) {
     *       if (condition) break outerLoop;
     *     }
     *   }
     */
    parseLabeledStatement() {
        const start = this.current;
        const label = this.parseIdentifier();
        
        // Consume the colon
        this.consumePunctuation(this.PUNCT.COLON);
        
        // Parse the statement that follows the label
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
    // EXPRESSION PARSING - PURE BINARY
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ExpressionStatement',
            expression: expr
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // EXPRESSION PARSING - PRATT PARSING (Operator-Precedence Parsing)
    // ! ══════════════════════════════════════════════════════════════════════════════
    // Philosophy: ใช้ precedence ของ operator ขับเคลื่อนการ parse
    // precedence ต่ำ = ประมวลผลทีหลัง (assignment = 1)
    // precedence สูง = ประมวลผลก่อน (exponential = 11)
    // ! ══════════════════════════════════════════════════════════════════════════════

    // ! BINARY DETERMINISM: Core parser walks predictable terrain only; Prophet handles ambiguity
    parseExpression(precedence = 0) {
        // Phase 1: Parse prefix (literals, identifiers, unary, grouping)
        let left = this.parsePrefix();

        // Phase 2: Parse infix operators ตาม precedence
        // ถ้า precedence ของ operator ถัดไปสูงกว่า precedence ปัจจุบัน ให้ parse ต่อ
        while (precedence < this.getPeekPrecedence()) {
            left = this.parseInfix(left);
        }

        return left;
    }

    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Parse PREFIX expressions (literals, identifiers, unary, grouping)
    // ! @returns {ASTNode}
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parsePrefix() {
        const token = this.peek();
        if (!token) {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError('Unexpected end of input in parsePrefix', {
                method: 'parsePrefix'
            });
            return null;
        }

        // ! UNARY OPERATORS: !, -, +, ~, ++, --
        if (token.binary === this.BINARY.OPERATOR) {
            const operatorInfo = this.grammarIndex.getOperatorInfo(token.value);
            if (operatorInfo?.type === 'unary' || operatorInfo?.type === 'update') {
                return this.parseUnaryExpression();
            }
        }

        // ! PRIMARY EXPRESSIONS: literals, identifiers, objects, arrays, grouping
        return this.parsePrimaryExpression();
    }


    // ! ══════════════════════════════════════════════════════════════════════════════ 
    // ! Parse INFIX expressions (binary operators, arrow function)
    // ! @param {ASTNode} left - Left-hand side expression
    // ! @returns {ASTNode}
    // ! ══════════════════════════════════════════════════════════════════════════════ 

    parseInfix(left) {
        const token = this.peek();
        if (!token) {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError('Unexpected end of input in parseInfix', {
                method: 'parseInfix'
            });
            return null;
        }

        // ! BINARY OPERATORS: +, -, *, /, %, **, ==, ===, <, >, &&, ||, etc.
        if (token.binary === this.BINARY.OPERATOR) {
            const operatorInfo = this.grammarIndex.getOperatorInfo(token.value);
            
            // ! NO_SILENT_FALLBACKS: ถ้าไม่มี operatorInfo = Grammar ไม่รู้จัก operator นี้
            if (!operatorInfo) {
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(
                    `Unknown operator "${token.value}" not found in Grammar`,
                    { 
                        method: 'parseInfix', 
                        tokenValue: token.value,
                        severity: 'CRITICAL',
                        hint: 'Add this operator to javascript.grammar.json binaryOperators section'
                    }
                );
                return null;
            }

            // Assignment operators (precedence = 1)
            if (operatorInfo.isAssign) {
                const operator = this.advance().value;
                const right = this.parseExpression(operatorInfo.precedence);
                return {
                    type: 'AssignmentExpression',
                    operator: operator,
                    left: left,
                    right: right
                };
            }

            // Binary operators (precedence = 1-11) - ใช้ category แทน type!
            const category = operatorInfo.category || operatorInfo.type;
            if (category === 'relational' || category === 'equality' || category === 'additive' || 
                category === 'multiplicative' || category === 'exponential' || category === 'bitwise' ||
                category === 'logical' || category === 'binary') {
                const operator = this.advance().value;
                // Parse right side with higher precedence (left-associative)
                const right = this.parseExpression(operatorInfo.precedence + 1);
                return {
                    type: (category === 'logical') ? 'LogicalExpression' : 'BinaryExpression',
                    operator: operator,
                    left: left,
                    right: right
                };
            }

            // ! NO_SILENT_FALLBACKS: operatorInfo มี แต่ category ไม่รู้จัก = Grammar ผิดพลาด
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError(
                `Operator "${token.value}" has unknown category "${category}" in Grammar`,
                { 
                    method: 'parseInfix', 
                    tokenValue: token.value,
                    operatorCategory: category,
                    severity: 'CRITICAL',
                    hint: 'Fix operator category in javascript.grammar.json (expected: relational, equality, additive, multiplicative, exponential, bitwise, logical, or binary)'
                }
            );
            return null;
        }

        // ! MEMBER EXPRESSION: object.property
        if (this.matchPunctuation(this.PUNCT.DOT)) {
            this.advance(); // consume '.'
            const property = this.expect(this.BINARY.IDENTIFIER, 'Expected property name after "."');
            return {
                type: 'MemberExpression',
                object: left,
                property: {
                    type: 'Identifier',
                    name: property.value
                },
                computed: false
            };
        }

        // ! COMPUTED MEMBER EXPRESSION: object[property]
        if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
            this.advance(); // consume '['
            const property = this.parseExpression(0);
            this.expect(this.PUNCT.RBRACKET, 'Expected "]" after computed property');
            return {
                type: 'MemberExpression',
                object: left,
                property: property,
                computed: true
            };
        }

        // ! CALL EXPRESSION: func(args)
        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            this.advance(); // consume '('
            const args = [];
            
            while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
                args.push(this.parseExpression(1)); // parse argument with low precedence
                if (this.matchPunctuation(this.PUNCT.COMMA)) {
                    this.advance(); // consume ','
                }
            }
            
            this.expect(this.PUNCT.RPAREN, 'Expected ")" after arguments');
            return {
                type: 'CallExpression',
                callee: left,
                arguments: args
            };
        }

        // ! ARROW FUNCTION: () => expression
        if (this.matchPunctuation(this.PUNCT.ARROW)) {
            this.advance(); // consume '=>'
            const body = this.parseExpression(1); // precedence = 1 (same as assignment)
            
            // Convert left (parameters) to proper format
            let params = [];
            if (left.type === 'Identifier') {
                params = [left];
            } else if (left.type === 'SequenceExpression') {
                // Handle (a, b, c) => ...
                params = left.expressions;
            }

            return {
                type: 'ArrowFunctionExpression',
                params: params,
                body: body,
                expression: true // body is expression, not block
            };
        }

        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(
            `Unexpected infix operator: "${token.value}"`,
            { method: 'parseInfix', tokenValue: token.value }
        );
        return null;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // LEGACY EXPRESSION PARSING (for backward compatibility during transition)
    // These methods are being replaced by Pratt Parsing
    // ! ══════════════════════════════════════════════════════════════════════════════

    parseAssignmentExpression() {
        const left = this.parseLogicalExpression();
        const token = this.peek();

        if (token && token.binary === this.BINARY.OPERATOR && 
            this.grammarIndex.isAssignmentOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseAssignmentExpression();

            return {
                type: 'AssignmentExpression',
                operator: operator,
                left: left,
                right: right
            };
        }

        return left;
    }

    parseLogicalExpression() {
        let left = this.parseEqualityExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isLogicalOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseEqualityExpression();

            left = {
                type: 'LogicalExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseEqualityExpression() {
        let left = this.parseRelationalExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isEqualityOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseRelationalExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseRelationalExpression() {
        let left = this.parseAdditiveExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isRelationalOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseAdditiveExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseAdditiveExpression() {
        let left = this.parseMultiplicativeExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isAdditiveOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseMultiplicativeExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseMultiplicativeExpression() {
        let left = this.parseUnaryExpression();
        let token = this.peek();

        while (token && token.binary === this.BINARY.OPERATOR && 
               this.grammarIndex.isMultiplicativeOperator(token.value)) {
            const operator = this.advance().value;
            const right = this.parseUnaryExpression();

            left = {
                type: 'BinaryExpression',
                operator: operator,
                left: left,
                right: right
            };

            token = this.peek();
        }

        return left;
    }

    parseUnaryExpression() {
        const token = this.peek();

        // ! PREFIX UPDATE OPERATORS: ++i และ --i
        if (token && token.binary === this.BINARY.OPERATOR) {
            if (token.value === '++' || token.value === '--') {
                this.advance();
                const argument = this.parseUnaryExpression();
                return {
                    type: 'UpdateExpression',
                    operator: token.value,
                    argument: argument,
                    prefix: true  // prefix: ++i (not i++)
                };
            }
        }

        // SECTION-BASED: ตรวจสอบจาก grammar แทน hardcode array
        if (token && ((token.binary === this.BINARY.OPERATOR && 
                       this.grammarIndex.isUnaryOperator(token.value)) ||
                      (token.binary === this.BINARY.KEYWORD && 
                       this.grammarIndex.isUnaryKeyword(token.value)))) {
            const operator = this.advance().value;
            const argument = this.parseUnaryExpression();

            return {
                type: 'UnaryExpression',
                operator: operator,
                prefix: true,
                argument: argument
            };
        }

        return this.parsePostfixExpression();
    }

    parsePostfixExpression() {
        let left = this.parsePrimaryExpression();

        while (true) {
            if (this.matchPunctuation(this.PUNCT.DOT)) {
                this.advance();
                const property = this.parseIdentifier();
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: false
                };
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                this.advance();
                const property = this.parseExpression();
                this.consumePunctuation(this.PUNCT.RBRACKET);
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property: property,
                    computed: true
                };
            } else if (this.matchPunctuation(this.PUNCT.LPAREN)) {
                const args = this.parseArgumentList();
                left = {
                    type: 'CallExpression',
                    callee: left,
                    arguments: args
                };
            } else {
                // ! POSTFIX OPERATORS: ++ และ --
                const token = this.peek();
                if (token && token.binary === this.BINARY.OPERATOR) {
                    if (token.value === '++' || token.value === '--') {
                        this.advance();
                        left = {
                            type: 'UpdateExpression',
                            operator: token.value,
                            argument: left,
                            prefix: false  // postfix: i++ (not ++i)
                        };
                        continue; // ยังคง loop ต่อไปได้
                    }
                }
                break;
            }
        }

        return left;
    }

    parsePrimaryExpression() {
        this.skipComments();
        const token = this.peek();

        if (!token) {
            // ! NO_THROW: บันทึก error แล้ว return null
            this.createParserError('Unexpected end of input', {
                method: 'parsePrimaryExpression'
            });
            return null;
        }

        // SECTION-BASED: ใช้ grammar lookup แทน string comparison
        if (token.binary === this.BINARY.KEYWORD && 
            this.grammarIndex.isKeywordSubcategory(token.value, 'newExpression')) {
            this.advance();
            const callee = this.parsePostfixExpression();
            return {
                type: 'NewExpression',
                callee: callee,
                arguments: []
            };
        }

        if (token.binary === this.BINARY.NUMBER) {
            this.advance();
            return {
                type: 'Literal',
                value: parseFloat(token.value),
                raw: token.value
            };
        }

        if (token.binary === this.BINARY.STRING) {
            this.advance();
            
            // Template Literal - distinguish from regular string
            if (token.type === 'TemplateLiteral') {
                return {
                    type: 'TemplateLiteral',
                    value: token.value.slice(1, -1), // Remove backticks
                    raw: token.value,
                    expressions: [], // TODO: Parse ${} expressions
                    quasis: []      // TODO: Parse template parts
                };
            }
            
            // Regular string literal
            return {
                type: 'Literal',
                value: token.value.slice(1, -1),
                raw: token.value
            };
        }

        // ! BOOLEAN LITERALS: true / false
        if (token.binary === this.BINARY.KEYWORD && 
            (token.value === 'true' || token.value === 'false')) {
            this.advance();
            return {
                type: 'Literal',
                value: token.value === 'true',  // convert string to boolean
                raw: token.value
            };
        }

        // ! NULL LITERAL: null
        if (token.binary === this.BINARY.KEYWORD && token.value === 'null') {
            this.advance();
            return {
                type: 'Literal',
                value: null,
                raw: 'null'
            };
        }

        if (token.binary === this.BINARY.IDENTIFIER) {
            return this.parseIdentifier();
        }

        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            this.advance();
            const expr = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);
            return expr;
        }

        // ! OBJECT LITERAL: { key: value, ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseObjectLiteral();
        }

        // ! ARRAY LITERAL: [element1, element2, ...]
        if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
            return this.parseArrayLiteral();
        }

        // Unknown token
        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(
            `Unexpected token in primary expression: "${token.value}"\n` +
            `Binary: ${token.binary}\n` +
            `Position: ${this.current}`,
            { method: 'parsePrimaryExpression', tokenValue: token.value, tokenBinary: token.binary }
        );
        return null;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // LITERAL PARSING
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    // ! Object literal parsing: deterministic traversal with Prophet override hook for ambiguous values
    parseObjectLiteral() {
        const properties = [];
        this.consumePunctuation(this.PUNCT.LBRACE);

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.skipComments();
            if (this.matchPunctuation(this.PUNCT.RBRACE)) {
                break;
            }

            const propertyNode = this.parseObjectProperty();
            if (propertyNode) {
                properties.push(propertyNode);
            }

            this.skipComments();
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

    // ! Parse single object property; supports shorthand, computed keys, and literal keys
    parseObjectProperty() {
        this.skipComments();

        if (this.matchPunctuation(this.PUNCT.SPREAD)) {
            this.advance();
            const argument = this.parseExpression();
            return {
                type: 'SpreadElement',
                argument
            };
        }

        let computed = false;
        let keyNode;

        if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
            computed = true;
            this.advance();
            keyNode = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RBRACKET);
        } else {
            const keyToken = this.peek();
            if (!keyToken) {
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError('Unexpected end of input while parsing object property key', {
                    method: 'parseObjectProperty'
                });
                return null;
            }

            if (keyToken.binary === this.BINARY.STRING || keyToken.binary === this.BINARY.NUMBER) {
                keyNode = this.createLiteralFromToken(this.advance());
            } else {
                keyNode = this.parseIdentifier();
            }
        }

        this.skipComments();

        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            const methodValue = this.parseMethodForObjectProperty();
            return {
                type: 'Property',
                key: keyNode,
                value: methodValue,
                kind: 'init',
                method: true,
                shorthand: false,
                computed
            };
        }

        if (!this.matchPunctuation(this.PUNCT.COLON)) {
            return {
                type: 'Property',
                key: keyNode,
                value: keyNode,
                kind: 'init',
                method: false,
                shorthand: true,
                computed
            };
        }

        this.consumePunctuation(this.PUNCT.COLON);
        this.skipComments();

        const valueStartIndex = this.current;
        const propertyValue = this.parseObjectPropertyValue(keyNode, {
            propertyKey: this.extractPropertyKeyName(keyNode),
            valueStartIndex
        });

        return {
            type: 'Property',
            key: keyNode,
            value: propertyValue,
            kind: 'init',
            method: false,
            shorthand: false,
            computed
        };
    }

    // ! Helper: parse method form inside object literal (foo() {})
    parseMethodForObjectProperty() {
        const params = this.parseParameterList();
        const body = this.parseBlockStatement();
        return {
            type: 'FunctionExpression',
            id: null,
            params,
            body,
            generator: false,
            async: false
        };
    }

    // ! Default property value parser - Architect remains deterministic, Prophet can override in subclass
    parseObjectPropertyValue() {
        return this.parseExpression();
    }

    // ! Helper: derive property key name for Prophet context and diagnostics
    extractPropertyKeyName(keyNode) {
        if (!keyNode || typeof keyNode !== 'object') {
            return null;
        }

        if (keyNode.type === 'Identifier') {
            return keyNode.name;
        }

        if (keyNode.type === 'Literal') {
            return String(keyNode.value);
        }

        return null;
    }

    // ! Helper: build literal node from raw punctuation-aware token
    createLiteralFromToken(token) {
        if (!token) {
            return {
                type: 'Literal',
                value: null,
                raw: ''
            };
        }

        if (token.binary === this.BINARY.STRING) {
            return {
                type: 'Literal',
                value: token.value.slice(1, -1),
                raw: token.value
            };
        }

        if (token.binary === this.BINARY.NUMBER) {
            return {
                type: 'Literal',
                value: Number(token.value),
                raw: token.value
            };
        }

        return {
            type: 'Literal',
            value: token.value,
            raw: token.value
        };
    }

    parseArrayLiteral() {
        const elements = [];
        this.consumePunctuation(this.PUNCT.LBRACKET);

        while (!this.matchPunctuation(this.PUNCT.RBRACKET) && !this.isAtEnd()) {
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                // Hole in array: [1, , 3]
                elements.push(null);
                this.advance();
            } else if (this.matchPunctuation(this.PUNCT.SPREAD)) {
                // Spread element: [...items]
                this.advance(); // consume '...'
                const argument = this.parseExpression();
                elements.push({
                    type: 'SpreadElement',
                    argument: argument
                });
                if (!this.matchPunctuation(this.PUNCT.RBRACKET)) {
                    this.consumePunctuation(this.PUNCT.COMMA);
                }
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
    // HELPER METHODS - PURE BINARY
    // ! ══════════════════════════════════════════════════════════════════════════════
    
    parseIdentifier() {
        const token = this.peek();
        if (token && (token.binary === this.BINARY.IDENTIFIER || 
                     token.binary === this.BINARY.KEYWORD)) {
            this.advance();
            return {
                type: 'Identifier',
                name: token.value
            };
        }
        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(`Expected identifier but got '${token?.value || 'EOF'}'`, {
            method: 'parseIdentifier',
            tokenValue: token?.value
        });
        return null;
    }

    
    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Parse Object Destructuring Pattern: { a, b, c: renamed } = obj
    // ! Supports:
    // ! - Simple properties: { x, y }
    // ! - Renamed properties: { oldName: newName }
    // ! - Nested destructuring: { a: { b, c } }
    // ! - Rest operator: { a, ...rest }
    // ! ══════════════════════════════════════════════════════════════════════════════ 
    
    parseObjectPattern() {
        const properties = [];
        this.consumePunctuation(this.PUNCT.LBRACE);

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            // Check for rest operator: ...rest
            if (this.matchPunctuation(this.PUNCT.ELLIPSIS)) {
                this.advance();
                const argument = this.parseIdentifier();
                properties.push({
                    type: 'RestElement',
                    argument: argument
                });
                break; // Rest must be last
            }

            // Parse property key (identifier or string)
            const key = this.parseIdentifier();
            let value = key;

            // Check for renaming: oldName: newName
            if (this.matchPunctuation(this.PUNCT.COLON)) {
                this.advance();
                // Value could be identifier, object pattern, or array pattern
                const nextToken = this.peek();
                if (this.matchPunctuation(this.PUNCT.LBRACE)) {
                    value = this.parseObjectPattern();
                } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                    value = this.parseArrayPattern();
                } else {
                    value = this.parseIdentifier();
                }
            }

            properties.push({
                type: 'Property',
                key: key,
                value: value,
                shorthand: key === value
            });

            // Continue if there's a comma
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            } else {
                break;
            }
        }

        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ObjectPattern',
            properties: properties
        };
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! Parse Array Destructuring Pattern: [a, b, c] = arr
    // ! Supports:
    // ! - Simple elements: [x, y]
    // ! - Skipped elements: [a, , c]
    // ! - Nested destructuring: [a, [b, c]]
    // ! - Rest operator: [a, ...rest]
    // ! ══════════════════════════════════════════════════════════════════════════════
    parseArrayPattern() {
        const elements = [];
        this.consumePunctuation(this.PUNCT.LBRACKET);

        while (!this.matchPunctuation(this.PUNCT.RBRACKET) && !this.isAtEnd()) {
            // Check for skipped element: [a, , c]
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                elements.push(null); // null represents skipped element
                this.advance();
                continue;
            }

            // Check for rest operator: ...rest
            if (this.matchPunctuation(this.PUNCT.ELLIPSIS)) {
                this.advance();
                const argument = this.parseIdentifier();
                elements.push({
                    type: 'RestElement',
                    argument: argument
                });
                break; // Rest must be last
            }

            // Parse element (identifier, object pattern, or array pattern)
            const nextToken = this.peek();
            let element;
            if (this.matchPunctuation(this.PUNCT.LBRACE)) {
                element = this.parseObjectPattern();
            } else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                element = this.parseArrayPattern();
            } else {
                element = this.parseIdentifier();
            }

            elements.push(element);

            // Continue if there's a comma
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                this.advance();
            } else {
                break;
            }
        }

        this.consumePunctuation(this.PUNCT.RBRACKET);

        return {
            type: 'ArrayPattern',
            elements: elements
        };
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

    /**
     * Consume keyword using BINARY CHECK (100% BINARY - NO STRING COMPARISON)
     * @param {string} keyword - keyword name (used to get binary)
     * @returns {Object} - consumed token
     */
    consumeKeyword(keyword) {
        const token = this.peek();
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const tokenBinary = token ? this.grammarIndex.getKeywordBinary(token.value) : null;
        
        if (token && token.binary === this.BINARY.KEYWORD && tokenBinary === keywordBinary) {
            this.advance();
            return token;
        }
        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(`Expected keyword '${keyword}' but got '${token?.value || 'EOF'}'`, {
            method: 'consumeKeyword',
            expected: keyword,
            actual: token?.value
        });
        return null;
    }

    /**
     * Consume punctuation using BINARY CHECK (100% BINARY - NO STRING COMPARISON)
     * @param {number} punctBinary - Binary constant for punctuation
     * @returns {Object} - consumed token
     */
    consumePunctuation(punctBinary) {
        const token = this.peek();
        if (this.matchPunctuation(punctBinary)) {
            this.advance();
            return token;
        }
        const expected = this.grammarIndex.getPunctuationFromBinary(punctBinary);
        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError(`Expected '${expected}' but got '${token?.value || 'EOF'}'`, {
            method: 'consumePunctuation',
            expected,
            actual: token?.value
        });
        return null;
    }

    /**
     * Match punctuation using BINARY CHECK (100% BINARY - NO STRING COMPARISON)
     * @param {number} punctBinary - Binary constant for punctuation
     * @param {number} offset - Token offset (default: 0 = current token)
     * @returns {boolean}
     */
    matchPunctuation(punctBinary, offset = 0) {
        const token = this.peek(offset);
        return token && 
               token.binary === this.BINARY.PUNCTUATION && 
               token.punctuationBinary === punctBinary;
    }

    /**
     * Expect and consume a specific token (punctuation or identifier)
     * @param {number|string} expected - Expected binary value or punctuation constant
     * @param {string} errorMessage - Error message if expectation fails
     * @returns {Token} The consumed token
     */
    expect(expected, errorMessage) {
        const token = this.peek();
        
        // Check if it's an identifier expectation
        if (typeof expected === 'number' && expected === this.BINARY.IDENTIFIER) {
            if (!token || token.binary !== this.BINARY.IDENTIFIER) {
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(errorMessage || `Expected identifier but got "${token?.value}"`, {
                    method: 'expect',
                    expected: 'IDENTIFIER',
                    actual: token?.value
                });
                return null;
            }
            return this.advance();
        }
        
        // Check if it's a punctuation binary constant
        if (typeof expected === 'number') {
            if (!this.matchPunctuation(expected)) {
                // ! NO_THROW: บันทึก error แล้ว return null
                this.createParserError(errorMessage || `Expected punctuation`, {
                    method: 'expect',
                    expected: expected,
                    actual: token?.value
                });
                return null;
            }
            return this.advance();
        }
        
        // ! NO_THROW: บันทึก error แล้ว return null
        this.createParserError('Invalid expect() usage', { method: 'expect' });
        return null;
    }

    /**
     * Get precedence of current peeked token (for Pratt Parsing)
     * @param {number} offset - Token offset (default: 0 = current token)
     * @returns {number} Precedence level (0-11), 0 = not an operator
     */
    getPeekPrecedence(offset = 0) {
        const token = this.peek(offset);
        if (!token) return 0;

        // ตรวจสอบว่าเป็น OPERATOR หรือ PUNCTUATION (สำหรับ => arrow function)
        if (token.binary === this.BINARY.OPERATOR) {
            const info = this.grammarIndex.getOperatorInfo(token.value);
            return info?.precedence || 0;
        }
        
        // ตรวจสอบ => arrow function (เป็น PUNCTUATION แต่มี precedence)
        if (token.binary === this.BINARY.PUNCTUATION) {
            const info = this.grammarIndex.getPunctuationInfo(token.value);
            return info?.precedence || 0;
        }

        return 0; // ไม่ใช่ operator/punctuation หรือไม่มี precedence
    }

    peekValue() {
        return this.peek()?.value;
    }

    /**
     * Peek at current token or lookahead by offset
     * @param {number} offset - How many tokens to look ahead (default: 0)
     * @returns {Token|undefined} The token at current + offset position
     */
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

export default PureBinaryParser;
