// ! ══════════════════════════════════════════════════════════════════════════════
// !  PURE BINARY TOKENIZER - 100% BINARY, NO STRINGS
// ! ══════════════════════════════════════════════════════════════════════════════
// ! PHILOSOPHY: ZERO STRING COMPARISON
// ! - Token มีแค่ binary code
// ! - ไม่มี token.type (string) เลย
// ! - ถาม grammar-index ได้ binary กลับมา
// ! ══════════════════════════════════════════════════════════════════════════════

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';

// ! ══════════════════════════════════════════════════════════════════════════════
// ! BINARY CATEGORY CONSTANTS
// ! ══════════════════════════════════════════════════════════════════════════════
// Generic types (ไม่อยู่ใน grammar) - ใช้ binary code คงที่
const GENERIC_TYPES = {
    IDENTIFIER: 0x0001,   // Generic identifier
    NUMBER: 0x0002,       // Generic number
    STRING: 0x0003,       // Generic string literal
    COMMENT: 0x0004       // Comment
};

// ! ══════════════════════════════════════════════════════════════════════════════
// ! Pure Binary Tokenizer Class
// ! ══════════════════════════════════════════════════════════════════════════════
export class PureBinaryTokenizer {
    constructor(grammarIndex) {
        if (!grammarIndex) {
            report(BinaryCodes.VALIDATOR.VALIDATION(5200));
        }
        
        this.brain = grammarIndex;
        this.input = '';
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }

    /**
     * Tokenize input - แปลง source code เป็น binary tokens
     */
    tokenize(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];

        while (this.position < this.input.length) {
            this.skipWhitespace();
            
            if (this.position >= this.input.length) break;

            const token = this.scanToken();
            if (token) {
                this.tokens.push(token);
            }
        }

        return this.tokens;
    }

    /**
     * Scan single token
     */
    scanToken() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        const char = this.input[this.position];

        // String literals
        if (char === '"' || char === "'" || char === '`') {
            return this.readString(char, start, startLine, startColumn);
        }

        // Numbers
        if (this.isDigit(char)) {
            return this.readNumber(start, startLine, startColumn);
        }

        // Identifiers or Keywords
        if (this.isIdentifierStart(char)) {
            return this.readIdentifierOrKeyword(start, startLine, startColumn);
        }

        // Operators or Punctuation
        return this.readOperatorOrPunctuation(start, startLine, startColumn);
    }

    /**
     * Read identifier or keyword - ถาม Brain ว่าเป็น keyword หรือ identifier
     */
    readIdentifierOrKeyword(start, startLine, startColumn) {
        while (this.position < this.input.length && this.isIdentifierPart(this.input[this.position])) {
            this.advance();
        }
        
        const value = this.input.substring(start, this.position);
        
        // ถาม Brain: นี่เป็น keyword ไหม?
        const keywordBinary = this.brain.getKeywordBinary(value);
        
        if (keywordBinary) {
            // Brain บอกว่าเป็น keyword และให้ binary code มา
            return this.createToken(keywordBinary, value, start, startLine, startColumn);
        } else {
            // Brain บอกว่าไม่ใช่ keyword = เป็น identifier ทั่วไป
            return this.createToken(GENERIC_TYPES.IDENTIFIER, value, start, startLine, startColumn);
        }
    }

    /**
     * Read number literal
     */
    readNumber(start, startLine, startColumn) {
        while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
            this.advance();
        }
        
        // Decimal point
        if (this.input[this.position] === '.' && this.isDigit(this.input[this.position + 1])) {
            this.advance(); // skip '.'
            while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
                this.advance();
            }
        }
        
        const value = this.input.substring(start, this.position);
        return this.createToken(GENERIC_TYPES.NUMBER, value, start, startLine, startColumn);
    }

    /**
     * Read string literal
     */
    readString(quote, start, startLine, startColumn) {
        this.advance(); // skip opening quote
        
        while (this.position < this.input.length && this.input[this.position] !== quote) {
            if (this.input[this.position] === '\\') {
                this.advance(); // skip escape char
            }
            this.advance();
        }
        
        if (this.position < this.input.length) {
            this.advance(); // skip closing quote
        }
        
        const value = this.input.substring(start, this.position);
        return this.createToken(GENERIC_TYPES.STRING, value, start, startLine, startColumn);
    }

    /**
     * Read operator or punctuation - ถาม Brain
     */
    readOperatorOrPunctuation(start, startLine, startColumn) {
        let longest = '';
        let longestBinary = 0;
        
        // Try matching longest operator/punctuation
        for (let len = 3; len >= 1; len--) {
            const substr = this.input.substring(this.position, this.position + len);
            
            // ถาม Brain: นี่เป็น operator ไหม?
            let binary = this.brain.getOperatorBinary(substr);
            if (binary) {
                longest = substr;
                longestBinary = binary;
                break;
            }
            
            // ถาม Brain: นี่เป็น punctuation ไหม?
            binary = this.brain.getPunctuationBinary(substr);
            if (binary) {
                longest = substr;
                longestBinary = binary;
                break;
            }
        }
        
        if (longest) {
            for (let i = 0; i < longest.length; i++) {
                this.advance();
            }
            return this.createToken(longestBinary, longest, start, startLine, startColumn);
        }
        
        // Unknown character - skip
        this.advance();
        return null;
    }

    /**
     * Create token - มีแค่ binary, value, position
     *  ไม่มี type (string) เลย!
     */
    createToken(binary, value, start, line, column) {
        return {
            binary,           // Binary code เท่านั้น!
            value,           // Token value (for debugging/display)
            start,
            end: this.position,
            line,
            column,
            length: value.length
        };
    }

    /**
     * Character type checks
     */
    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isIdentifierStart(char) {
        return (char >= 'a' && char <= 'z') ||
               (char >= 'A' && char <= 'Z') ||
               char === '_' || char === '$';
    }

    isIdentifierPart(char) {
        return this.isIdentifierStart(char) || this.isDigit(char);
    }

    skipWhitespace() {
        while (this.position < this.input.length) {
            const char = this.input[this.position];
            if (char === ' ' || char === '\t' || char === '\r' || char === '\n') {
                if (char === '\n') {
                    this.line++;
                    this.column = 1;
                } else {
                    this.column++;
                }
                this.position++;
            } else {
                break;
            }
        }
    }

    advance() {
        if (this.position < this.input.length) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }
}

export default PureBinaryTokenizer;
