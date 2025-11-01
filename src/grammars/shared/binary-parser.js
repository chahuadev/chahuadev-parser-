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

        if (keywordBinary === constBinary || keywordBinary === letBinary || keywordBinary === varBinary) {
            return this.parseVariableDeclaration(keyword, start);
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

        if (keywordBinary === returnBinary) {
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

        report(BinaryCodes.PARSER.SYNTAX(6003));
        return null;
    }

    parseBlockStatement() {
        this.consumePunctuation(this.PUNCT.LBRACE);
        const body = [];

        while (!this.matchPunctuation(this.PUNCT.RBRACE) && !this.isAtEnd()) {
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
        let left = this.parsePrimary();

        while (!this.isAtEnd()) {
            const token = this.peek();
            
            if (token && this.isOperator(token.binary)) {
                const op = this.advance();
                const right = this.parsePrimary();
                
                left = {
                    type: 'BinaryExpression',
                    operator: op.value,
                    left,
                    right
                };
            }
            else if (this.matchPunctuation(this.PUNCT.DOT)) {
                this.advance();
                const property = this.parseIdentifier();
                
                left = {
                    type: 'MemberExpression',
                    object: left,
                    property,
                    computed: false
                };
            }
            else {
                break;
            }
        }

        return left;
    }

    parsePrimary() {
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
