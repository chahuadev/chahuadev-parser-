// ! ══════════════════════════════════════════════════════════════════════════════
// ! BINARY PARSER - 100% BINARY COMPARISON ONLY
// ! ══════════════════════════════════════════════════════════════════════════════
// ! PHILOSOPHY: ABSOLUTE ZERO STRING COMPARISON
// ! - เปรียบเทียบ binary code เท่านั้น
// ! - ถาม grammar-index เพื่อเอา binary มาเทียบ
// ! - ไม่มี token.type (string) ให้เช็คเลย
// ! ══════════════════════════════════════════════════════════════════════════════

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! GENERIC TYPE BINARIES (ต้องตรงกับ PureBinaryTokenizer)
// ! ══════════════════════════════════════════════════════════════════════════════
const GENERIC_TYPES = {
    IDENTIFIER: 0x0001,
    NUMBER: 0x0002,
    STRING: 0x0003,
    COMMENT: 0x0004
};

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Binary Parser - เช็ค Binary เท่านั้น
// ! ══════════════════════════════════════════════════════════════════════════════
export class BinaryParser {
    constructor(tokens, source, grammarIndex) {
        if (!grammarIndex) {
            report(BinaryCodes.PARSER.CONFIGURATION(6101));
        }
        
        if (!tokens || !Array.isArray(tokens)) {
            report(BinaryCodes.PARSER.VALIDATION(6100));
        }
        
        this.tokens = tokens || [];
        this.source = source || '';
        this.grammarIndex = grammarIndex;
        this.current = 0;
        this.parseErrors = [];
        
        // โหลด Punctuation Binary Codes จาก Grammar
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
            COLON: grammarIndex.getPunctuationBinary(':')
        };
    }

    parse() {
        const ast = {
            type: 'Program',
            body: [],
            sourceType: 'module',
            sourceCode: this.source,
            tokens: this.tokens
        };

        while (!this.isAtEnd()) {
            // Skip comments
            this.skipComments();
            
            if (this.isAtEnd()) break;
            
            const stmt = this.parseStatement();
            if (stmt) {
                ast.body.push(stmt);
            }
        }

        ast.parseErrors = this.parseErrors;
        return ast;
    }

    parseStatement() {
        const token = this.peek();
        if (!token) return null;

        // Skip comments (in case skipComments() missed any)
        if (token.binary === GENERIC_TYPES.COMMENT) {
            this.advance();
            return this.parseStatement(); // Recursively get next non-comment statement
        }

        // Empty statement: ;
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance();
            return { type: 'EmptyStatement' };
        }

        // Block: { ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseBlockStatement();
        }

        // Keyword: ถาม Grammar
        if (this.isKeyword(token.binary)) {
            return this.parseKeywordStatement(token);
        }

        // Labeled: identifier :
        if (token.binary === GENERIC_TYPES.IDENTIFIER) {
            if (this.matchPunctuation(this.PUNCT.COLON, 1)) {
                return this.parseLabeledStatement();
            }
        }

        return this.parseExpressionStatement();
    }

    parseKeywordStatement(token) {
        const keyword = token.value;
        const keywordInfo = this.grammarIndex.getKeywordInfo(keyword);
        
        if (!keywordInfo) {
            report(BinaryCodes.PARSER.SYNTAX(6001));
            this.advance();
            return null;
        }

        const category = keywordInfo.category;

        switch (category) {
            case 'declaration':
                return this.parseDeclaration(keyword);
            case 'control':
                return this.parseControl(keyword);
            case 'exception':
                return this.parseTryStatement(this.current - 1);
            case 'module':
                return this.parseModuleStatement(keyword);
            default:
                return this.parseExpressionStatement();
        }
    }

    parseDeclaration(keyword) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const constBinary = this.grammarIndex.getKeywordBinary('const');
        const letBinary = this.grammarIndex.getKeywordBinary('let');
        const varBinary = this.grammarIndex.getKeywordBinary('var');
        const functionBinary = this.grammarIndex.getKeywordBinary('function');
        const classBinary = this.grammarIndex.getKeywordBinary('class');
        const asyncBinary = this.grammarIndex.getKeywordBinary('async');

        // Variable declaration (const, let, var)
        if (keywordBinary === constBinary || keywordBinary === letBinary || keywordBinary === varBinary) {
            return this.parseVariableDeclaration(keyword, start);
        }

        // Function declaration
        if (keywordBinary === functionBinary) {
            return this.parseFunctionDeclaration(false, false, start);
        }

        // Class declaration
        if (keywordBinary === classBinary) {
            return this.parseClassDeclaration(start);
        }

        // Async function
        if (keywordBinary === asyncBinary) {
            const nextToken = this.peek();
            if (nextToken && nextToken.binary === functionBinary) {
                this.advance(); // consume 'function'
                return this.parseFunctionDeclaration(true, false, start);
            }
        }

        report(BinaryCodes.PARSER.SYNTAX(6002));
        return null;
    }

    parseVariableDeclaration(kind, start) {
        const declarations = [];
        
        do {
            const id = this.parseIdentifier();
            let init = null;

            const nextToken = this.peek();
            if (nextToken && this.isOperator(nextToken.binary)) {
                const assignBinary = this.grammarIndex.getOperatorBinary('=');
                
                if (nextToken.binary === assignBinary) {
                    this.advance();
                    init = this.parseExpression();
                }
            }

            declarations.push({
                type: 'VariableDeclarator',
                id,
                init
            });

        } while (this.matchPunctuation(this.PUNCT.COMMA) && this.advance());

        this.consumeSemicolon();

        return {
            type: 'VariableDeclaration',
            kind,
            declarations,
            start,
            end: this.current
        };
    }

    parseControl(keyword) {
        const start = this.current;
        this.advance();

        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const returnBinary = this.grammarIndex.getKeywordBinary('return');
        const ifBinary = this.grammarIndex.getKeywordBinary('if');
        const forBinary = this.grammarIndex.getKeywordBinary('for');
        const whileBinary = this.grammarIndex.getKeywordBinary('while');
        const doBinary = this.grammarIndex.getKeywordBinary('do');
        const switchBinary = this.grammarIndex.getKeywordBinary('switch');
        const breakBinary = this.grammarIndex.getKeywordBinary('break');
        const continueBinary = this.grammarIndex.getKeywordBinary('continue');
        const throwBinary = this.grammarIndex.getKeywordBinary('throw');

        if (keywordBinary === returnBinary) {
            return this.parseReturnStatement(start);
        }
        if (keywordBinary === ifBinary) {
            return this.parseIfStatement(start);
        }
        if (keywordBinary === forBinary) {
            return this.parseForStatement(start);
        }
        if (keywordBinary === whileBinary) {
            return this.parseWhileStatement(start);
        }
        if (keywordBinary === doBinary) {
            return this.parseDoWhileStatement(start);
        }
        if (keywordBinary === switchBinary) {
            return this.parseSwitchStatement(start);
        }
        if (keywordBinary === breakBinary) {
            return this.parseBreakStatement(start);
        }
        if (keywordBinary === continueBinary) {
            return this.parseContinueStatement(start);
        }
        if (keywordBinary === throwBinary) {
            return this.parseThrowStatement(start);
        }

        report(BinaryCodes.PARSER.SYNTAX(6003));
        return null;
    }

    parseReturnStatement(start) {
        let argument = null;
        
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            argument = this.parseExpression();
        }
        
        this.consumeSemicolon();

        return {
            type: 'ReturnStatement',
            argument,
            start,
            end: this.current
        };
    }

    parseIfStatement(start) {
        // if (test) consequent else alternate
        
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);

        const consequent = this.parseStatement();

        let alternate = null;
        const elseBinary = this.grammarIndex.getKeywordBinary('else');
        const nextToken = this.peek();
        
        if (nextToken && nextToken.binary === elseBinary) {
            this.advance(); // consume 'else'
            alternate = this.parseStatement();
        }

        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
            start,
            end: this.current
        };
    }

    parseForStatement(start) {
        // for (init; test; update) body
        // for (let x of arr) body
        // for (let x in obj) body
        
        this.consumePunctuation(this.PUNCT.LPAREN);

        // Check for 'let', 'const', 'var' (for-in/for-of)
        const token = this.peek();
        let init = null;

        if (token && (token.value === 'let' || token.value === 'const' || token.value === 'var')) {
            init = this.parseVariableDeclaration(token.value, this.current);
        } else if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            init = this.parseExpression();
        }

        // Check for 'in' or 'of' (for-in/for-of loops)
        const inBinary = this.grammarIndex.getKeywordBinary('in');
        const ofBinary = this.grammarIndex.getKeywordBinary('of');
        const currentToken = this.peek();

        if (currentToken && (currentToken.binary === inBinary || currentToken.binary === ofBinary)) {
            const isForOf = currentToken.binary === ofBinary;
            this.advance(); // consume 'in' or 'of'

            const right = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);

            const body = this.parseStatement();

            return {
                type: isForOf ? 'ForOfStatement' : 'ForInStatement',
                left: init,
                right,
                body,
                start,
                end: this.current
            };
        }

        // Regular for loop
        this.consumeSemicolon();

        let test = null;
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            test = this.parseExpression();
        }
        this.consumeSemicolon();

        let update = null;
        if (!this.matchPunctuation(this.PUNCT.RPAREN)) {
            update = this.parseExpression();
        }
        this.consumePunctuation(this.PUNCT.RPAREN);

        const body = this.parseStatement();

        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body,
            start,
            end: this.current
        };
    }

    parseWhileStatement(start) {
        // while (test) body
        
        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);

        const body = this.parseStatement();

        return {
            type: 'WhileStatement',
            test,
            body,
            start,
            end: this.current
        };
    }

    parseDoWhileStatement(start) {
        // do body while (test);
        
        const body = this.parseStatement();

        const whileBinary = this.grammarIndex.getKeywordBinary('while');
        const token = this.peek();
        
        if (!token || token.binary !== whileBinary) {
            this.createParserError('Expected while after do-while body');
            return null;
        }
        this.advance(); // consume 'while'

        this.consumePunctuation(this.PUNCT.LPAREN);
        const test = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);
        this.consumeSemicolon();

        return {
            type: 'DoWhileStatement',
            body,
            test,
            start,
            end: this.current
        };
    }

    parseSwitchStatement(start) {
        // switch (discriminant) { cases }
        
        this.consumePunctuation(this.PUNCT.LPAREN);
        const discriminant = this.parseExpression();
        this.consumePunctuation(this.PUNCT.RPAREN);

        this.consumePunctuation(this.PUNCT.LBRACE);
        const cases = [];

        const caseBinary = this.grammarIndex.getKeywordBinary('case');
        const defaultBinary = this.grammarIndex.getKeywordBinary('default');

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RBRACE)) break;

            const token = this.peek();
            if (!token) break;

            let test = null;
            let isDefault = false;

            if (token.binary === caseBinary) {
                this.advance(); // consume 'case'
                test = this.parseExpression();
            } else if (token.binary === defaultBinary) {
                this.advance(); // consume 'default'
                isDefault = true;
            } else {
                this.createParserError('Expected case or default in switch');
                this.advance();
                continue;
            }

            this.consumePunctuation(this.PUNCT.COLON);

            const consequent = [];
            while (!this.isAtEnd()) {
                const nextToken = this.peek();
                if (!nextToken) break;
                
                if (nextToken.binary === caseBinary || 
                    nextToken.binary === defaultBinary || 
                    this.matchPunctuation(this.PUNCT.RBRACE)) {
                    break;
                }

                const stmt = this.parseStatement();
                if (stmt) consequent.push(stmt);
            }

            cases.push({
                type: 'SwitchCase',
                test: isDefault ? null : test,
                consequent
            });
        }

        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'SwitchStatement',
            discriminant,
            cases,
            start,
            end: this.current
        };
    }

    parseBreakStatement(start) {
        let label = null;
        
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            const token = this.peek();
            if (token && token.binary === GENERIC_TYPES.IDENTIFIER) {
                label = this.parseIdentifier();
            }
        }
        
        this.consumeSemicolon();

        return {
            type: 'BreakStatement',
            label,
            start,
            end: this.current
        };
    }

    parseContinueStatement(start) {
        let label = null;
        
        if (!this.matchPunctuation(this.PUNCT.SEMICOLON) && !this.isAtEnd()) {
            const token = this.peek();
            if (token && token.binary === GENERIC_TYPES.IDENTIFIER) {
                label = this.parseIdentifier();
            }
        }
        
        this.consumeSemicolon();

        return {
            type: 'ContinueStatement',
            label,
            start,
            end: this.current
        };
    }

    parseThrowStatement(start) {
        const argument = this.parseExpression();
        this.consumeSemicolon();

        return {
            type: 'ThrowStatement',
            argument,
            start,
            end: this.current
        };
    }

    parseTryStatement(start) {
        // try { block } catch (param) { handler } finally { finalizer }
        
        this.advance(); // consume 'try'

        const block = this.parseBlockStatement();

        let handler = null;
        const catchBinary = this.grammarIndex.getKeywordBinary('catch');
        const token = this.peek();

        if (token && token.binary === catchBinary) {
            this.advance(); // consume 'catch'

            // Optional catch parameter
            let param = null;
            if (this.matchPunctuation(this.PUNCT.LPAREN)) {
                this.advance();
                param = this.parseIdentifier();
                this.consumePunctuation(this.PUNCT.RPAREN);
            }

            const body = this.parseBlockStatement();

            handler = {
                type: 'CatchClause',
                param,
                body
            };
        }

        let finalizer = null;
        const finallyBinary = this.grammarIndex.getKeywordBinary('finally');
        const nextToken = this.peek();

        if (nextToken && nextToken.binary === finallyBinary) {
            this.advance(); // consume 'finally'
            finalizer = this.parseBlockStatement();
        }

        if (!handler && !finalizer) {
            this.createParserError('Try statement must have catch or finally block');
        }

        return {
            type: 'TryStatement',
            block,
            handler,
            finalizer,
            start,
            end: this.current
        };
    }

    parseModuleStatement(keyword) {
        const start = this.current - 1;
        const keywordBinary = this.grammarIndex.getKeywordBinary(keyword);
        const importBinary = this.grammarIndex.getKeywordBinary('import');
        const exportBinary = this.grammarIndex.getKeywordBinary('export');

        if (keywordBinary === importBinary) {
            return this.parseImportDeclaration(start);
        }
        if (keywordBinary === exportBinary) {
            return this.parseExportDeclaration(start);
        }

        return null;
    }

    parseImportDeclaration(start) {
        // import defaultExport from "module"
        // import * as name from "module"
        // import { export1, export2 } from "module"
        // import "module" (side-effect only)

        const specifiers = [];
        const token = this.peek();

        // Side-effect import: import "module"
        if (token && token.binary === GENERIC_TYPES.STRING) {
            const source = this.parsePrimary();
            this.consumeSemicolon();

            return {
                type: 'ImportDeclaration',
                specifiers: [],
                source,
                start,
                end: this.current
            };
        }

        // import * as name from "module"
        if (token && token.value === '*') {
            this.advance(); // consume '*'
            
            const asBinary = this.grammarIndex.getKeywordBinary('as');
            const asToken = this.peek();
            
            if (asToken && asToken.binary === asBinary) {
                this.advance(); // consume 'as'
                const local = this.parseIdentifier();
                
                specifiers.push({
                    type: 'ImportNamespaceSpecifier',
                    local
                });
            }
        }
        // import { ... } from "module"
        else if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            this.advance(); // consume '{'
            
            while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
                const imported = this.parseIdentifier();
                let local = imported;

                // import { x as y }
                const asBinary = this.grammarIndex.getKeywordBinary('as');
                const asToken = this.peek();
                
                if (asToken && asToken.binary === asBinary) {
                    this.advance(); // consume 'as'
                    local = this.parseIdentifier();
                }

                specifiers.push({
                    type: 'ImportSpecifier',
                    imported,
                    local
                });

                if (!this.matchPunctuation(this.PUNCT.COMMA)) break;
                this.advance(); // consume comma
            }

            this.consumePunctuation(this.PUNCT.RBRACE);
        }
        // default import: import name from "module"
        else {
            const local = this.parseIdentifier();
            specifiers.push({
                type: 'ImportDefaultSpecifier',
                local
            });
        }

        // from "module"
        const fromBinary = this.grammarIndex.getKeywordBinary('from');
        const fromToken = this.peek();
        
        if (!fromToken || fromToken.binary !== fromBinary) {
            this.createParserError('Expected from in import statement');
            return null;
        }
        this.advance(); // consume 'from'

        const source = this.parsePrimary(); // module string
        this.consumeSemicolon();

        return {
            type: 'ImportDeclaration',
            specifiers,
            source,
            start,
            end: this.current
        };
    }

    parseExportDeclaration(start) {
        // export { x, y }
        // export default expression
        // export * from "module"
        // export const x = 1
        // export function name() {}

        const defaultBinary = this.grammarIndex.getKeywordBinary('default');
        const token = this.peek();

        // export default ...
        if (token && token.binary === defaultBinary) {
            this.advance(); // consume 'default'

            const declaration = this.parseExpression();
            this.consumeSemicolon();

            return {
                type: 'ExportDefaultDeclaration',
                declaration,
                start,
                end: this.current
            };
        }

        // export * from "module"
        if (token && token.value === '*') {
            this.advance(); // consume '*'

            const fromBinary = this.grammarIndex.getKeywordBinary('from');
            const fromToken = this.peek();
            
            if (fromToken && fromToken.binary === fromBinary) {
                this.advance(); // consume 'from'
                const source = this.parsePrimary();
                this.consumeSemicolon();

                return {
                    type: 'ExportAllDeclaration',
                    source,
                    start,
                    end: this.current
                };
            }
        }

        // export { ... }
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            const specifiers = [];
            this.advance(); // consume '{'

            while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
                const local = this.parseIdentifier();
                let exported = local;

                // export { x as y }
                const asBinary = this.grammarIndex.getKeywordBinary('as');
                const asToken = this.peek();
                
                if (asToken && asToken.binary === asBinary) {
                    this.advance(); // consume 'as'
                    exported = this.parseIdentifier();
                }

                specifiers.push({
                    type: 'ExportSpecifier',
                    local,
                    exported
                });

                if (!this.matchPunctuation(this.PUNCT.COMMA)) break;
                this.advance(); // consume comma
            }

            this.consumePunctuation(this.PUNCT.RBRACE);

            // from "module" (optional)
            let source = null;
            const fromBinary = this.grammarIndex.getKeywordBinary('from');
            const fromToken = this.peek();
            
            if (fromToken && fromToken.binary === fromBinary) {
                this.advance(); // consume 'from'
                source = this.parsePrimary();
            }

            this.consumeSemicolon();

            return {
                type: 'ExportNamedDeclaration',
                declaration: null,
                specifiers,
                source,
                start,
                end: this.current
            };
        }

        // export const/let/var/function/class
        const declaration = this.parseStatement();

        return {
            type: 'ExportNamedDeclaration',
            declaration,
            specifiers: [],
            source: null,
            start,
            end: this.current
        };
    }

    parseFunctionDeclaration(isAsync = false, isGenerator = false, start) {
        // function name(...params) { body }
        // async function name() {}
        // function* name() {} (generator)
        
        // Check for generator (function*)
        if (this.peek() && this.peek().value === '*') {
            this.advance();
            isGenerator = true;
        }

        // Function name (required for declaration)
        const id = this.parseIdentifier();
        if (!id) {
            this.createParserError('Function declaration requires a name');
            return null;
        }

        // Parameters: (param1, param2, ...)
        this.consumePunctuation(this.PUNCT.LPAREN);
        const params = this.parseFunctionParams();
        this.consumePunctuation(this.PUNCT.RPAREN);

        // Body: { ... }
        const body = this.parseBlockStatement();

        return {
            type: 'FunctionDeclaration',
            id,
            params,
            body,
            async: isAsync,
            generator: isGenerator,
            start,
            end: this.current
        };
    }

    parseFunctionParams() {
        const params = [];
        
        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            // Skip comments
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RPAREN)) break;

            // Parse parameter (identifier or destructuring)
            const param = this.parseIdentifier();
            if (param) {
                params.push(param);
            }

            // Check for comma
            if (!this.matchPunctuation(this.PUNCT.COMMA)) {
                break;
            }
            this.advance(); // consume comma
        }

        return params;
    }

    parseClassDeclaration(start) {
        // class Name extends Base { ... }
        
        // Class name (required)
        const id = this.parseIdentifier();
        if (!id) {
            this.createParserError('Class declaration requires a name');
            return null;
        }

        // Check for 'extends'
        let superClass = null;
        const extendsBinary = this.grammarIndex.getKeywordBinary('extends');
        const nextToken = this.peek();
        
        if (nextToken && nextToken.binary === extendsBinary) {
            this.advance(); // consume 'extends'
            superClass = this.parseIdentifier();
        }

        // Class body: { methods, properties }
        this.consumePunctuation(this.PUNCT.LBRACE);
        const body = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RBRACE)) break;

            // Parse class member (method or property)
            const member = this.parseClassMember();
            if (member) {
                body.push(member);
            }
        }

        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ClassDeclaration',
            id,
            superClass,
            body: {
                type: 'ClassBody',
                body
            },
            start,
            end: this.current
        };
    }

    parseClassMember() {
        // Method or property
        // constructor() {}, method() {}, async method() {}, static method() {}
        
        let isStatic = false;
        let isAsync = false;
        
        const staticBinary = this.grammarIndex.getKeywordBinary('static');
        const asyncBinary = this.grammarIndex.getKeywordBinary('async');
        
        const token = this.peek();
        if (!token) return null;

        // Check for 'static'
        if (token.binary === staticBinary) {
            isStatic = true;
            this.advance();
        }

        // Check for 'async'
        const currentToken = this.peek();
        if (currentToken && currentToken.binary === asyncBinary) {
            isAsync = true;
            this.advance();
        }

        // Method name
        const key = this.parseIdentifier();
        if (!key) return null;

        // Parameters
        this.consumePunctuation(this.PUNCT.LPAREN);
        const params = this.parseFunctionParams();
        this.consumePunctuation(this.PUNCT.RPAREN);

        // Body
        const body = this.parseBlockStatement();

        return {
            type: 'MethodDefinition',
            key,
            value: {
                type: 'FunctionExpression',
                params,
                body,
                async: isAsync
            },
            kind: key.name === 'constructor' ? 'constructor' : 'method',
            static: isStatic
        };
    }

    parseBlockStatement() {
        this.consumePunctuation(this.PUNCT.LBRACE);
        const body = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RBRACE)) break;
            
            const stmt = this.parseStatement();
            if (stmt) body.push(stmt);
        }

        this.consumePunctuation(this.PUNCT.RBRACE);
        return { type: 'BlockStatement', body };
    }

    parseLabeledStatement() {
        const start = this.current;
        const label = this.parseIdentifier();
        this.consumePunctuation(this.PUNCT.COLON);
        const statement = this.parseStatement();
        
        return {
            type: 'LabeledStatement',
            label,
            body: statement,
            start,
            end: this.current
        };
    }

    parseExpressionStatement() {
        const expr = this.parseExpression();
        this.consumeSemicolon();
        return { type: 'ExpressionStatement', expression: expr };
    }

    parseExpression() {
        return this.parseAssignmentExpression();
    }

    parseAssignmentExpression() {
        const left = this.parseConditionalExpression();

        const token = this.peek();
        if (token && this.isAssignmentOperator(token.binary)) {
            const operator = this.advance();
            const right = this.parseAssignmentExpression(); // Right associative

            return {
                type: 'AssignmentExpression',
                operator: operator.value,
                left,
                right
            };
        }

        return left;
    }

    parseConditionalExpression() {
        // Ternary: test ? consequent : alternate
        const test = this.parseLogicalOrExpression();

        const token = this.peek();
        if (token && token.value === '?') {
            this.advance(); // consume '?'
            const consequent = this.parseExpression();
            this.consumePunctuation(this.PUNCT.COLON);
            const alternate = this.parseExpression();

            return {
                type: 'ConditionalExpression',
                test,
                consequent,
                alternate
            };
        }

        return test;
    }

    parseLogicalOrExpression() {
        let left = this.parseLogicalAndExpression();

        while (!this.isAtEnd()) {
            const token = this.peek();
            if (!token) break;

            const orBinary = this.grammarIndex.getOperatorBinary('||');
            if (token.binary === orBinary) {
                const operator = this.advance();
                const right = this.parseLogicalAndExpression();

                left = {
                    type: 'LogicalExpression',
                    operator: operator.value,
                    left,
                    right
                };
            } else {
                break;
            }
        }

        return left;
    }

    parseLogicalAndExpression() {
        let left = this.parseBitwiseOrExpression();

        while (!this.isAtEnd()) {
            const token = this.peek();
            if (!token) break;

            const andBinary = this.grammarIndex.getOperatorBinary('&&');
            if (token.binary === andBinary) {
                const operator = this.advance();
                const right = this.parseBitwiseOrExpression();

                left = {
                    type: 'LogicalExpression',
                    operator: operator.value,
                    left,
                    right
                };
            } else {
                break;
            }
        }

        return left;
    }

    parseBitwiseOrExpression() {
        return this.parseBinaryExpression(
            this.parseBitwiseXorExpression.bind(this),
            ['|']
        );
    }

    parseBitwiseXorExpression() {
        return this.parseBinaryExpression(
            this.parseBitwiseAndExpression.bind(this),
            ['^']
        );
    }

    parseBitwiseAndExpression() {
        return this.parseBinaryExpression(
            this.parseEqualityExpression.bind(this),
            ['&']
        );
    }

    parseEqualityExpression() {
        return this.parseBinaryExpression(
            this.parseRelationalExpression.bind(this),
            ['==', '!=', '===', '!==']
        );
    }

    parseRelationalExpression() {
        return this.parseBinaryExpression(
            this.parseShiftExpression.bind(this),
            ['<', '>', '<=', '>=']
        );
    }

    parseShiftExpression() {
        return this.parseBinaryExpression(
            this.parseAdditiveExpression.bind(this),
            ['<<', '>>', '>>>']
        );
    }

    parseAdditiveExpression() {
        return this.parseBinaryExpression(
            this.parseMultiplicativeExpression.bind(this),
            ['+', '-']
        );
    }

    parseMultiplicativeExpression() {
        return this.parseBinaryExpression(
            this.parseUnaryExpression.bind(this),
            ['*', '/', '%']
        );
    }

    parseBinaryExpression(parseNext, operators) {
        let left = parseNext();

        while (!this.isAtEnd()) {
            const token = this.peek();
            if (!token) break;

            let matched = false;
            for (const op of operators) {
                const opBinary = this.grammarIndex.getOperatorBinary(op);
                if (opBinary && token.binary === opBinary) {
                    const operator = this.advance();
                    const right = parseNext();

                    left = {
                        type: 'BinaryExpression',
                        operator: operator.value,
                        left,
                        right
                    };
                    matched = true;
                    break;
                }
            }

            if (!matched) break;
        }

        return left;
    }

    parseUnaryExpression() {
        const token = this.peek();
        if (!token) return this.parsePostfixExpression();

        // Unary operators: ++, --, +, -, !, ~, typeof, void, delete
        const unaryOps = ['++', '--', '+', '-', '!', '~'];
        for (const op of unaryOps) {
            const opBinary = this.grammarIndex.getOperatorBinary(op);
            if (opBinary && token.binary === opBinary) {
                const operator = this.advance();
                const argument = this.parseUnaryExpression();

                return {
                    type: 'UnaryExpression',
                    operator: operator.value,
                    prefix: true,
                    argument
                };
            }
        }

        // Unary keywords: typeof, void, delete, await
        const typeofBinary = this.grammarIndex.getKeywordBinary('typeof');
        const voidBinary = this.grammarIndex.getKeywordBinary('void');
        const deleteBinary = this.grammarIndex.getKeywordBinary('delete');
        const awaitBinary = this.grammarIndex.getKeywordBinary('await');

        if (token.binary === typeofBinary || token.binary === voidBinary || 
            token.binary === deleteBinary || token.binary === awaitBinary) {
            const operator = this.advance();
            const argument = this.parseUnaryExpression();

            return {
                type: token.binary === awaitBinary ? 'AwaitExpression' : 'UnaryExpression',
                operator: operator.value,
                prefix: true,
                argument
            };
        }

        return this.parsePostfixExpression();
    }

    parsePostfixExpression() {
        let expr = this.parseLeftHandSideExpression();

        const token = this.peek();
        if (token) {
            const incBinary = this.grammarIndex.getOperatorBinary('++');
            const decBinary = this.grammarIndex.getOperatorBinary('--');

            if (token.binary === incBinary || token.binary === decBinary) {
                const operator = this.advance();
                return {
                    type: 'UpdateExpression',
                    operator: operator.value,
                    prefix: false,
                    argument: expr
                };
            }
        }

        return expr;
    }

    parseLeftHandSideExpression() {
        let expr = this.parsePrimaryExpression();

        while (!this.isAtEnd()) {
            const token = this.peek();
            if (!token) break;

            // Member access: obj.prop
            if (this.matchPunctuation(this.PUNCT.DOT)) {
                this.advance();
                const property = this.parseIdentifier();

                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property,
                    computed: false
                };
            }
            // Computed member: obj[key]
            else if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
                this.advance();
                const property = this.parseExpression();
                this.consumePunctuation(this.PUNCT.RBRACKET);

                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property,
                    computed: true
                };
            }
            // Function call: func(args)
            else if (this.matchPunctuation(this.PUNCT.LPAREN)) {
                this.advance();
                const args = this.parseArguments();
                this.consumePunctuation(this.PUNCT.RPAREN);

                expr = {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args
                };
            }
            else {
                break;
            }
        }

        return expr;
    }

    parseArguments() {
        const args = [];

        while (!this.matchPunctuation(this.PUNCT.RPAREN) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RPAREN)) break;

            args.push(this.parseExpression());

            if (!this.matchPunctuation(this.PUNCT.COMMA)) break;
            this.advance(); // consume comma
        }

        return args;
    }

    parsePrimaryExpression() {
        const token = this.peek();

        if (!token) {
            report(BinaryCodes.PARSER.SYNTAX(6010));
            return null;
        }

        // Number
        if (token.binary === GENERIC_TYPES.NUMBER) {
            this.advance();
            return {
                type: 'Literal',
                value: parseFloat(token.value),
                raw: token.value
            };
        }

        // String
        if (token.binary === GENERIC_TYPES.STRING) {
            this.advance();
            return {
                type: 'Literal',
                value: token.value.slice(1, -1),
                raw: token.value
            };
        }

        // Template literal (check for ` character in value)
        if (token.binary === GENERIC_TYPES.STRING && token.value && token.value[0] === '`') {
            return this.parseTemplateLiteral();
        }

        // New expression: new Foo()
        const newBinary = this.grammarIndex.getKeywordBinary('new');
        if (token.binary === newBinary) {
            return this.parseNewExpression();
        }

        // Array literal: [1, 2, 3]
        if (this.matchPunctuation(this.PUNCT.LBRACKET)) {
            return this.parseArrayExpression();
        }

        // Object literal or arrow function: { key: value } or () => {}
        if (this.matchPunctuation(this.PUNCT.LBRACE)) {
            return this.parseObjectExpression();
        }

        // Boolean/null keywords
        if (this.isKeyword(token.binary)) {
            const trueBinary = this.grammarIndex.getKeywordBinary('true');
            const falseBinary = this.grammarIndex.getKeywordBinary('false');
            const nullBinary = this.grammarIndex.getKeywordBinary('null');
            
            if (token.binary === trueBinary || token.binary === falseBinary) {
                this.advance();
                return {
                    type: 'Literal',
                    value: token.binary === trueBinary,
                    raw: token.value
                };
            }
            if (token.binary === nullBinary) {
                this.advance();
                return { type: 'Literal', value: null, raw: 'null' };
            }
        }

        // Identifier
        if (token.binary === GENERIC_TYPES.IDENTIFIER) {
            return this.parseIdentifier();
        }

        // Grouping: (expr)
        if (this.matchPunctuation(this.PUNCT.LPAREN)) {
            this.advance();
            const expr = this.parseExpression();
            this.consumePunctuation(this.PUNCT.RPAREN);
            return expr;
        }

        report(BinaryCodes.PARSER.SYNTAX(6011));
        this.advance();
        return { type: 'Unknown', value: token.value };
    }

    parseArrayExpression() {
        // [elem1, elem2, ...]
        this.consumePunctuation(this.PUNCT.LBRACKET);
        const elements = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACKET) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RBRACKET)) break;

            // Handle holes: [1, , 3]
            if (this.matchPunctuation(this.PUNCT.COMMA)) {
                elements.push(null);
                this.advance();
                continue;
            }

            elements.push(this.parseExpression());

            if (!this.matchPunctuation(this.PUNCT.COMMA)) break;
            this.advance(); // consume comma
        }

        this.consumePunctuation(this.PUNCT.RBRACKET);

        return {
            type: 'ArrayExpression',
            elements
        };
    }

    parseObjectExpression() {
        // { key: value, ... }
        this.consumePunctuation(this.PUNCT.LBRACE);
        const properties = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
            this.skipComments();
            
            if (this.matchPunctuation(this.PUNCT.RBRACE)) break;

            // Parse property key
            const key = this.parseIdentifier();
            
            this.consumePunctuation(this.PUNCT.COLON);
            
            // Parse property value
            const value = this.parseExpression();

            properties.push({
                type: 'Property',
                key,
                value,
                kind: 'init'
            });

            if (!this.matchPunctuation(this.PUNCT.COMMA)) break;
            this.advance(); // consume comma
        }

        this.consumePunctuation(this.PUNCT.RBRACE);

        return {
            type: 'ObjectExpression',
            properties
        };
    }

    parseIdentifier() {
        const token = this.peek();
        if (token && token.binary === GENERIC_TYPES.IDENTIFIER) {
            this.advance();
            return { type: 'Identifier', name: token.value };
        }
        
        this.createParserError(`Expected identifier`);
        return null;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! BINARY CATEGORY CHECKS
    // ! ══════════════════════════════════════════════════════════════════════════════

    isKeyword(binary) {
        return binary >= 0x0001 && binary <= 0x0FFF && binary > 0x0004;
    }

    isOperator(binary) {
        return binary >= 0x1000 && binary <= 0x1FFF;
    }

    isAssignmentOperator(binary) {
        const assignOps = ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^='];
        for (const op of assignOps) {
            const opBinary = this.grammarIndex.getOperatorBinary(op);
            if (opBinary && binary === opBinary) {
                return true;
            }
        }
        return false;
    }

    // ! ══════════════════════════════════════════════════════════════════════════════
    // ! HELPERS
    // ! ══════════════════════════════════════════════════════════════════════════════

    matchPunctuation(punctBinary, offset = 0) {
        const token = this.peek(offset);
        return token && token.binary === punctBinary;
    }

    consumePunctuation(punctBinary) {
        if (this.matchPunctuation(punctBinary)) {
            return this.advance();
        }
        
        this.createParserError('Expected punctuation');
        return null;
    }

    consumeSemicolon() {
        if (this.matchPunctuation(this.PUNCT.SEMICOLON)) {
            this.advance();
        }
    }

    skipComments() {
        while (!this.isAtEnd()) {
            const token = this.peek();
            if (token && token.binary === GENERIC_TYPES.COMMENT) {
                this.advance(); // Skip comment token
            } else {
                break; // Not a comment, stop skipping
            }
        }
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

    createParserError(message) {
        this.parseErrors.push({
            message,
            position: this.current,
            token: this.peek()
        });
    }
}

export default BinaryParser;
