/**
 * BLANK PAPER TOKENIZER - 100% DUMB NO BRAIN
 * 
 * PHILOSOPHY: Blank Paper knows NOTHING
 * 
 * ONE JOB: Read characters and ask Brain (grammar-index.js)
 * 
 * DOES NOT KNOW:
 * - [NO] Does NOT know "if" is a keyword
 * - [NO] Does NOT know "//" is a comment
 * - [NO] Does NOT know "+" is an operator
 * - [NO] Does NOT know "(" is punctuation
 * - [NO] NO hardcoded knowledge
 * 
 * ONLY KNOWS:
 * - Read characters
 * - Count positions
 * - Ask Brain
 */

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';
import { getBinaryFor } from './binary-generator.js';

/**
 * Type Bits - Category identification (fast bit check)
 * Use high bits to identify category without string comparison
 */
const TYPE_BITS = {
    IDENTIFIER:   0b00000000,  // 0x00 - Generic identifier
    NUMBER:       0b00010000,  // 0x10 - Numeric literal
    STRING:       0b00100000,  // 0x20 - String literal
    COMMENT:      0b00110000,  // 0x30 - Comment
    KEYWORD:      0b01000000,  // 0x40 - Keyword (with specific binary)
    OPERATOR:     0b01010000,  // 0x50 - Operator (with specific binary)
    PUNCTUATION:  0b01100000   // 0x60 - Punctuation (with specific binary)
};

/**
 * Character Type - Uses charCode only (NO string comparison)
 */
const CHAR_CODES = {
    SPACE: 32,
    TAB: 9,
    LF: 10,
    CR: 13,
    DOUBLE_QUOTE: 34,   // "
    SINGLE_QUOTE: 39,   // '
    BACKTICK: 96,       // `
    ZERO: 48,
    NINE: 57,
    UPPER_A: 65,
    UPPER_Z: 90,
    LOWER_A: 97,
    LOWER_Z: 122,
    UNDERSCORE: 95,
    DOLLAR: 36
};

export class BlankPaperTokenizer {
    constructor(grammarIndex) {
        if (!grammarIndex) {
            report(BinaryCodes.VALIDATOR.VALIDATION(5200));
        }
        
        this.brain = grammarIndex;
        this.input = '';
        this.position = 0;
        this.tokens = [];
        
        this.brain = grammarIndex;
        this.input = '';
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }
    
    /**
     * Tokenize source code
     */
    tokenize(code) {
        this.input = code;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        
        while (this.position < this.input.length) {
            const token = this.nextToken();
            if (token) {
                this.tokens.push(token);
            }
        }
        
        return this.tokens;
    }
    
    /**
     * Read next token - only reads characters
     */
    nextToken() {
        // Skip whitespace
        this.skipWhitespace();
        
        // Ask Brain: Is this a comment? If yes, skip it
        if (this.skipComment()) {
            return this.nextToken(); // Recursively get next non-comment token
        }
        
        if (this.position >= this.input.length) {
            return null;
        }
        
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        const char = this.input[this.position];
        const charCode = char.charCodeAt(0);
        
        // String literal? (read character code only)
        if (charCode === CHAR_CODES.DOUBLE_QUOTE || 
            charCode === CHAR_CODES.SINGLE_QUOTE || 
            charCode === CHAR_CODES.BACKTICK) {
            return this.readString(char, start, startLine, startColumn);
        }
        
        // Letter? -> Might be keyword or identifier
        if (this.isLetter(charCode)) {
            return this.readWord(start, startLine, startColumn);
        }
        
        // Digit? -> number
        if (this.isDigit(charCode)) {
            return this.readNumber(start, startLine, startColumn);
        }
        
        // Other -> operator or punctuation (ask Brain)
        return this.readOperatorOrPunctuation(start, startLine, startColumn);
    }
    
    /**
     * Read word (identifier or keyword) - doesn't know what it is
     */
    readWord(start, startLine, startColumn) {
        while (this.position < this.input.length) {
            const charCode = this.input.charCodeAt(this.position);
            if (!this.isLetter(charCode) && !this.isDigit(charCode) && 
                charCode !== CHAR_CODES.UNDERSCORE && charCode !== CHAR_CODES.DOLLAR) {
                break;
            }
            this.advance();
        }
        
        const value = this.input.substring(start, this.position);
        
        // Ask Brain: "Is this word a keyword?"
        const keywordBinary = this.brain.getKeywordBinary(value);
        
        if (keywordBinary) {
            // Brain says it's a keyword
            return this.createToken('KEYWORD', value, keywordBinary, start, startLine, startColumn);
        } else {
            // Brain says it's an identifier
            return this.createToken('IDENTIFIER', value, 0, start, startLine, startColumn);
        }
    }
    
    /**
     * Read number - only reads digits
     */
    readNumber(start, startLine, startColumn) {
        while (this.position < this.input.length && 
               this.isDigit(this.input.charCodeAt(this.position))) {
            this.advance();
        }
        
        // Decimal point?
        if (this.input[this.position] === '.' && 
            this.isDigit(this.input.charCodeAt(this.position + 1))) {
            this.advance(); // skip '.'
            while (this.position < this.input.length && 
                   this.isDigit(this.input.charCodeAt(this.position))) {
                this.advance();
            }
        }
        
        const value = this.input.substring(start, this.position);
        return this.createToken('NUMBER', value, 0, start, startLine, startColumn);
    }
    
    /**
     * Read string literal - reads until closing quote
     */
    readString(quote, start, startLine, startColumn) {
        this.advance(); // skip opening quote
        
        while (this.position < this.input.length) {
            const char = this.input[this.position];
            
            if (char === quote) {
                this.advance(); // skip closing quote
                break;
            }
            
            // Escape character?
            if (char === '\\') {
                this.advance(); // skip backslash
                if (this.position < this.input.length) {
                    this.advance(); // skip escaped char
                }
            } else {
                this.advance();
            }
        }
        
        const value = this.input.substring(start, this.position);
        return this.createToken('STRING', value, 0, start, startLine, startColumn);
    }
    
    /**
     * Read operator/punctuation - doesn't know what it is, must ask Brain
     */
    readOperatorOrPunctuation(start, startLine, startColumn) {
        // Read 1-3 characters (longest operator is 3 chars: ===, >>>, ...)
        let longest = '';
        let longestBinary = 0;
        let longestType = null;
        
        for (let len = 1; len <= 3 && (start + len) <= this.input.length; len++) {
            const substr = this.input.substring(start, start + len);
            
            // Ask Brain: "Is this string an operator?"
            let binary = this.brain.getOperatorBinary(substr);
            if (binary) {
                longest = substr;
                longestBinary = binary;
                longestType = 'OPERATOR';
                continue;
            }
            
            // Ask Brain: "Is this string punctuation?"
            binary = this.brain.getPunctuationBinary(substr);
            if (binary) {
                longest = substr;
                longestBinary = binary;
                longestType = 'PUNCTUATION';
            }
        }
        
        if (longest) {
            // Brain recognizes it - it's operator or punctuation
            this.position += longest.length;
            this.column += longest.length;
            return this.createToken(longestType, longest, longestBinary, start, startLine, startColumn);
        }
        
        // Brain doesn't recognize it - unknown character
        report(BinaryCodes.PARSER.SYNTAX(5201));
    }
    
    /**
     * Create token object
     */
    createToken(type, value, binary, start, line, column) {
        return {
            type,
            value,
            binary,
            start,
            end: this.position,
            line,
            column,
            length: value.length
        };
    }
    
    /**
     * Skip whitespace - character code comparison only
     */
    skipWhitespace() {
        while (this.position < this.input.length) {
            const charCode = this.input.charCodeAt(this.position);
            
            if (charCode === CHAR_CODES.SPACE || 
                charCode === CHAR_CODES.TAB) {
                this.advance();
            } else if (charCode === CHAR_CODES.LF) {
                this.position++;
                this.line++;
                this.column = 1;
            } else if (charCode === CHAR_CODES.CR) {
                this.position++;
                // CR+LF?
                if (this.input.charCodeAt(this.position) === CHAR_CODES.LF) {
                    this.position++;
                }
                this.line++;
                this.column = 1;
            } else {
                break;
            }
        }
    }
    
    /**
     * Skip comment - Ask Brain what patterns are comments
     * Returns true if comment was skipped
     */
    skipComment() {
        if (!this.brain || !this.brain.grammar || !this.brain.grammar.comments) {
            return false; // No comment definitions
        }
        
        const comments = this.brain.grammar.comments;
        
        // Try each comment pattern (longest first)
        const patterns = Object.keys(comments).sort((a, b) => b.length - a.length);
        
        for (const pattern of patterns) {
            const commentDef = comments[pattern];
            const patternLen = pattern.length;
            
            // Check if current position matches this comment pattern
            const substr = this.input.substring(this.position, this.position + patternLen);
            if (substr === pattern) {
                // Found comment start - skip until end pattern
                this.position += patternLen;
                this.column += patternLen;
                
                const endPattern = commentDef.endPattern;
                
                // Line comment (ends with newline)
                if (commentDef.type === 'line') {
                    while (this.position < this.input.length) {
                        const charCode = this.input.charCodeAt(this.position);
                        if (charCode === CHAR_CODES.LF || charCode === CHAR_CODES.CR) {
                            break; // Don't consume newline
                        }
                        this.position++;
                        this.column++;
                    }
                    return true;
                }
                
                // Block comment (ends with specific pattern)
                if (commentDef.type === 'block' || commentDef.type === 'jsx') {
                    const endLen = endPattern.length;
                    while (this.position < this.input.length - endLen + 1) {
                        // Check for end pattern
                        const endSubstr = this.input.substring(this.position, this.position + endLen);
                        if (endSubstr === endPattern) {
                            this.position += endLen;
                            this.column += endLen;
                            return true;
                        }
                        
                        // Track line numbers inside comments
                        const charCode = this.input.charCodeAt(this.position);
                        if (charCode === CHAR_CODES.LF) {
                            this.line++;
                            this.column = 1;
                        } else if (charCode === CHAR_CODES.CR) {
                            this.line++;
                            this.column = 1;
                            if (this.input.charCodeAt(this.position + 1) === CHAR_CODES.LF) {
                                this.position++;
                            }
                        } else {
                            this.column++;
                        }
                        
                        this.position++;
                    }
                    
                    // Unclosed block comment
                    report(BinaryCodes.PARSER.SYNTAX(5202));

                }
            }
        }
        
        return false; // Not a comment
    }
    
    /**
     * Check letter - character code only (no regex)
     */
    isLetter(charCode) {
        return (charCode >= CHAR_CODES.UPPER_A && charCode <= CHAR_CODES.UPPER_Z) ||
               (charCode >= CHAR_CODES.LOWER_A && charCode <= CHAR_CODES.LOWER_Z) ||
               charCode === CHAR_CODES.UNDERSCORE ||
               charCode === CHAR_CODES.DOLLAR;
    }
    
    /**
     * Check digit - character code only
     */
    isDigit(charCode) {
        return charCode >= CHAR_CODES.ZERO && charCode <= CHAR_CODES.NINE;
    }
    
    /**
     * Advance position forward
     */
    advance() {
        this.position++;
        this.column++;
    }
}

/**
 * USAGE:
 * 
 * import { GrammarIndex } from './grammar-index.js';
 * import { BlankPaperTokenizer } from './blank-paper-tokenizer.js';
 * 
 * const grammar = new GrammarIndex(javascriptGrammar);
 * const tokenizer = new BlankPaperTokenizer(grammar);
 * 
 * const tokens = tokenizer.tokenize('if (x > 0) { return true; }');
 * 
 * Tokenizer knows NOTHING - asks Brain everything!
 */
