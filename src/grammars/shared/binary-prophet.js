// ! ══════════════════════════════════════════════════════════════════════════════
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev-com/Chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ══════════════════════════════════════════════════════════════════════════════
// ! PURE BINARY AST PARSER - 100% Binary Operations
// ! ══════════════════════════════════════════════════════════════════════════════
// ! Philosophy: Parser ใช้ BINARY 100% - ไม่มี String comparison เลย
// ! Binary Prophet - Speculative engine that resolves Pure Binary ambiguities without backtracking
// ! ══════════════════════════════════════════════════════════════════════════════
import { performance } from 'node:perf_hooks';
import errorHandler from '../../error-handler/ErrorHandler.js';
import PureBinaryParser from './pure-binary-parser.js';

// ! Sandbox parser: isolated copy of Architect logic for quantum experimentation only
class SandboxBinaryParser extends PureBinaryParser {
    constructor(tokens, grammarIndex, options = {}) {
        super(tokens, options.source || '', grammarIndex);
    }

    parseExpressionFromStart(precedence = 0) {
        this.current = 0;
        this.skipComments();
        return this.parseExpression(precedence);
    }

    getConsumedTokens() {
        return this.current;
    }
}

// ! Binary Prophet: explores speculative universes and reports deterministic outcomes back to Architect
class BinaryProphet {
    constructor(grammarIndex, options = {}) {
        if (!grammarIndex) {
            const error = new Error('BinaryProphet requires a GrammarIndex instance');
            error.isOperational = false;
            errorHandler.handleError(error, {
                source: 'BinaryProphet',
                method: 'constructor',
                severity: 'CRITICAL'
            });
            throw error;
        }

        this.grammarIndex = grammarIndex;
        this.options = {
            maxUniverses: 6,
            timeoutMs: 100,
            minConfidence: 60,
            adaptiveLearning: true,
            ...options
        };

        this.metrics = {
            totalSpeculations: 0,
            successfulProphecies: 0,
            universesSimulated: 0,
            averageConfidence: 0
        };

        this.PUNCT = {
            LPAREN: this.grammarIndex.getPunctuationBinary('('),
            RPAREN: this.grammarIndex.getPunctuationBinary(')'),
            COMMA: this.grammarIndex.getPunctuationBinary(','),
            RBRACE: this.grammarIndex.getPunctuationBinary('}'),
            ARROW: this.grammarIndex.getPunctuationBinary('=>')
        };
    }

    // ! Entry signature check: verify whether arrow tokens exist before asking Architect to halt
    detectArrowSignature(tokens, startIndex) {
        const detection = this.scanForArrow(tokens, startIndex);
        return detection.foundArrow === true;
    }

    // ! Speculate both method and arrow universes, then collapse to the sole surviving AST
    speculateObjectProperty(tokens, startIndex, context = {}) {
        const startTime = performance.now();
        this.metrics.totalSpeculations += 1;

        const hypotheses = [
            this.simulateTraditionalMethod(tokens, startIndex, context),
            this.simulateArrowFunction(tokens, startIndex, context)
        ];

        this.metrics.universesSimulated += hypotheses.length;

        const successfulUniverses = hypotheses.filter(hypothesis => hypothesis.success);
        if (successfulUniverses.length === 0) {
            errorHandler.handleError(new Error('Prophet speculation unable to resolve ambiguity'), {
                source: 'BinaryProphet',
                method: 'speculateObjectProperty',
                severity: 'WARNING',
                context: {
                    propertyKey: context.propertyKey,
                    universesTested: hypotheses.length,
                    durationMs: (performance.now() - startTime).toFixed(2)
                }
            });
            return null;
        }

        successfulUniverses.sort((a, b) => b.confidence - a.confidence);
        const bestUniverse = successfulUniverses[0];

        this.metrics.successfulProphecies += 1;
        this.metrics.averageConfidence = this.updateAverageConfidence(
            this.metrics.averageConfidence,
            bestUniverse.confidence,
            this.metrics.successfulProphecies
        );

        errorHandler.handleError(new Error('Prophet speculation completed'), {
            source: 'BinaryProphet',
            method: 'speculateObjectProperty',
            severity: 'INFO',
            context: {
                propertyKey: context.propertyKey,
                winningAssumption: bestUniverse.assumption,
                confidence: bestUniverse.confidence,
                universesTested: hypotheses.length,
                endIndex: bestUniverse.endIndex,
                durationMs: (performance.now() - startTime).toFixed(2)
            }
        });

        return {
            success: true,
            assumption: bestUniverse.assumption,
            confidence: bestUniverse.confidence,
            node: bestUniverse.node,
            endIndex: bestUniverse.endIndex,
            universesTested: hypotheses.length
        };
    }

    // ! Universe A: assume traditional method and ensure no arrow token contradicts the hypothesis
    simulateTraditionalMethod(tokens, startIndex, context) {
        const detection = this.scanForArrow(tokens, startIndex);
        if (detection.foundArrow) {
            return {
                assumption: 'method',
                success: false,
                confidence: 0,
                universesSimulated: 1,
                reason: 'ARROW_PRESENT'
            };
        }

        try {
            const sandboxTokens = tokens.slice(startIndex);
            const sandbox = new SandboxBinaryParser(sandboxTokens, this.grammarIndex);
            const node = sandbox.parseExpressionFromStart(0);
            const consumed = sandbox.getConsumedTokens();
            const endIndex = startIndex + consumed;

            return {
                assumption: 'method',
                success: true,
                confidence: Math.max(this.options.minConfidence - 10, 40),
                node,
                endIndex,
                universesSimulated: 1
            };
        } catch (error) {
            error.isOperational = true;
            errorHandler.handleError(error, {
                source: 'BinaryProphet',
                method: 'simulateTraditionalMethod',
                severity: 'DEBUG',
                context: {
                    propertyKey: context?.propertyKey
                }
            });
            return {
                assumption: 'method',
                success: false,
                confidence: 0,
                universesSimulated: 1,
                reason: 'PARSING_FAILED'
            };
        }
    }

    // ! Universe B: assume arrow function and demand AST confirmation from sandbox parser
    simulateArrowFunction(tokens, startIndex, context) {
        const detection = this.scanForArrow(tokens, startIndex);
        if (!detection.foundArrow) {
            return {
                assumption: 'arrow',
                success: false,
                confidence: 0,
                universesSimulated: 1,
                reason: 'NO_ARROW_DETECTED'
            };
        }

        try {
            const sandboxTokens = tokens.slice(startIndex);
            const sandbox = new SandboxBinaryParser(sandboxTokens, this.grammarIndex);
            const node = sandbox.parseExpressionFromStart(0);
            const consumed = sandbox.getConsumedTokens();
            const endIndex = startIndex + consumed;

            if (!this.isArrowNode(node)) {
                return {
                    assumption: 'arrow',
                    success: false,
                    confidence: 0,
                    universesSimulated: 1,
                    reason: 'AST_NOT_ARROW'
                };
            }

            return {
                assumption: 'arrow',
                success: true,
                confidence: Math.max(this.options.minConfidence, 90),
                node,
                endIndex,
                universesSimulated: 1
            };
        } catch (error) {
            error.isOperational = true;
            errorHandler.handleError(error, {
                source: 'BinaryProphet',
                method: 'simulateArrowFunction',
                severity: 'DEBUG',
                context: {
                    propertyKey: context?.propertyKey
                }
            });
            return {
                assumption: 'arrow',
                success: false,
                confidence: 0,
                universesSimulated: 1,
                reason: 'PARSING_FAILED'
            };
        }
    }

    // ! Binary sweep: scan for => while tracking parentheses depth using pure punctuation binaries
    scanForArrow(tokens, startIndex) {
        let depth = 0;
        for (let index = startIndex; index < tokens.length; index += 1) {
            const token = tokens[index];
            if (!token || typeof token.punctuationBinary !== 'number') {
                continue;
            }

            const binary = token.punctuationBinary;
            if (binary === this.PUNCT.LPAREN) {
                depth += 1;
                continue;
            }
            if (binary === this.PUNCT.RPAREN) {
                if (depth === 0) {
                    return { foundArrow: false, stopIndex: index };
                }
                depth -= 1;
                continue;
            }
            if (binary === this.PUNCT.ARROW) {
                return { foundArrow: true, arrowIndex: index };
            }
            if ((binary === this.PUNCT.COMMA || binary === this.PUNCT.RBRACE) && depth === 0) {
                return { foundArrow: false, stopIndex: index };
            }
        }
        return { foundArrow: false, stopIndex: tokens.length };
    }

    // ! Safety net: ensure sandbox returns genuine ArrowFunctionExpression before trust
    isArrowNode(node) {
        return node && typeof node === 'object' && node.type === 'ArrowFunctionExpression';
    }

    // ! Metrics: update running average confidence without floating point drift
    updateAverageConfidence(currentAverage, newConfidence, totalSuccesses) {
        if (totalSuccesses <= 0) {
            return currentAverage;
        }
        if (totalSuccesses === 1) {
            return newConfidence;
        }
        return currentAverage + ((newConfidence - currentAverage) / totalSuccesses);
    }
}

export { BinaryProphet, SandboxBinaryParser };
export default BinaryProphet;
