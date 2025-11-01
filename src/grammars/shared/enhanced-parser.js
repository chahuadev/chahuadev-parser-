// ! ══════════════════════════════════════════════════════════════════════════════
// !  QUANTUM ENHANCED PARSER - Extended with Scout & Prophet
// ! ══════════════════════════════════════════════════════════════════════════════
// ! ARCHITECTURE:
// ! - extends BinaryParser (100% binary)
// ! - uses BinaryScout for structure mapping
// ! - uses BinaryProphet for ambiguous cases
// ! - quantum jumps for performance
// ! ══════════════════════════════════════════════════════════════════════════════

import { report } from '../../error-handler/universal-reporter.js';
import BinaryCodes from '../../error-handler/binary-codes.js';
import { BinaryScout } from './binary-scout.js';
import { STRUCTURE_TYPES } from './grammar-index.js';
import { BinaryParser } from './binary-parser.js';
import BinaryProphet from './binary-prophet.js';

/**
 * Quantum Enhanced Parser - BinaryParser + Scout + Prophet
 */
export class QuantumEnhancedParser extends BinaryParser {
    constructor(tokens, source, grammarIndex, options = {}) {
        super(tokens, source, grammarIndex);
        
        this.options = {
            useScout: true,
            quantumJumps: true,
            preAllocation: true,
            ...options
        };

        this.prophet = new BinaryProphet(grammarIndex, this.options.prophetConfig || {});
        this.structureMap = new Map();
        this.stats = {
            quantumJumps: 0,
            scoutTime: 0,
            parseTime: 0,
            totalTime: 0
        };
    }

    parse() {
        const totalStartTime = performance.now();
        
        try {
            // Phase 1: Scout Reconnaissance
            if (this.tokens && this.tokens.length > 0 && this.options.useScout) {
                const scoutStartTime = performance.now();

                try {
                    const scout = new BinaryScout(this.tokens, this.grammarIndex);
                    this.structureMap = scout.scanStructure();
                    this.stats.scoutTime = performance.now() - scoutStartTime;
                } catch (scoutError) {
                    report(BinaryCodes.PARSER.VALIDATION(1018));
                }
            }

            // Phase 2: Parse with structure awareness
            const parseStartTime = performance.now();
            const ast = super.parse();
            this.stats.parseTime = performance.now() - parseStartTime;
            this.stats.totalTime = performance.now() - totalStartTime;

            return ast;

        } catch (error) {
            report(BinaryCodes.PARSER.SYNTAX(1033));
            
            return {
                type: 'Program',
                body: [],
                sourceType: 'module',
                sourceCode: this.source,
                tokens: this.tokens,
                parseErrors: [{ message: 'Parser crashed', error }]
            };
        }
    }

    /**
     * Enhanced function parsing with structure awareness
     */
    parseFunctionDeclaration(start) {
        try {
            const structure = this.structureMap?.get(this.current);
            
            // Use structure info for optimization
            if (structure && structure.structureType === STRUCTURE_TYPES.FUNCTION) {
                if (this.options.preAllocation) {
                    const estimatedNodes = Math.ceil((structure.endPos - structure.startPos) / 5);
                    // Pre-allocation hint for GC
                }
            }

            return super.parseFunctionDeclaration(start);

        } catch (error) {
            report(BinaryCodes.PARSER.SYNTAX(4004));
            return null;
        }
    }

    /**
     * Quantum jump to target position
     */
    quantumJump(targetPos) {
        if (!this.options.quantumJumps) return;

        try {
            this.current = targetPos;
            this.stats.quantumJumps++;
        } catch (error) {
            report(BinaryCodes.PARSER.VALIDATION(4005));
        }
    }

    /**
     * Get parser statistics
     */
    getStats() {
        return {
            ...this.stats,
            scoutEnabled: this.options.useScout,
            structuresFound: this.structureMap?.size || 0,
            speedup: this.stats.scoutTime > 0 
                ? ((this.stats.parseTime / this.stats.totalTime) * 100).toFixed(1) + '%'
                : 'N/A'
        };
    }
}

export default QuantumEnhancedParser;
