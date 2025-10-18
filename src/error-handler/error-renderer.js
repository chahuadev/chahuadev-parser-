// ! Rendering layer for ErrorHandler console reporting.
// ! Extracted from ErrorHandler.js to respect the 4-layer design (Intake → Normalization → Rendering → Transport).

import { ERROR_HANDLER_CONFIG } from './error-handler-config.js';

const PRIMARY_SEPARATOR = '='.repeat(80);
const SECONDARY_SEPARATOR = '-'.repeat(80);

function renderConsoleBanner(errorInfo) {
    console.error('\n' + PRIMARY_SEPARATOR);
    console.error('>>> ERROR HANDLER IS SCREAMING AT YOU! <<<');
    console.error('>>> THIS IS NOT A DRILL! FIX THIS NOW! <<<');
    console.error(PRIMARY_SEPARATOR);
    console.error('\n[TIME] ' + errorInfo.timestampLocal);
    console.error('[PROCESS] PID ' + errorInfo.processId);
    console.error('[KIND] ' + (errorInfo.kind || 'unknown'));
    console.error('[CODE] ' + String(errorInfo.code ?? 'N/A'));
    if (errorInfo.ruleSlug) {
        console.error('[RULE] ' + errorInfo.ruleSlug);
    }
    console.error('[SEVERITY] ' + errorInfo.severityLabel + ' (' + errorInfo.severityCode + ')');
    if (errorInfo.sourceSlug) {
        console.error('[SOURCE] ' + errorInfo.sourceSlug);
    }
    if (errorInfo.categorySlug) {
        console.error('[CATEGORY] ' + errorInfo.categorySlug);
    }
    console.error('[CRITICAL] ' + errorInfo.isCritical);
    console.error('[MESSAGE] ' + errorInfo.message);
    if (errorInfo.normalizedMessage && errorInfo.normalizedMessage !== errorInfo.message) {
        console.error('[DICTIONARY MESSAGE] ' + errorInfo.normalizedMessage);
    }
    if (errorInfo.filePath) {
        console.error('[FILE] ' + errorInfo.filePath);
    }
    if (errorInfo.location?.start) {
        const { line, column } = errorInfo.location.start;
        const startLine = Number.isFinite(line) ? line : 'unknown';
        const startColumn = Number.isFinite(column) ? column : 'unknown';
        console.error('[LOCATION] start line ' + startLine + ':' + startColumn);
    }
}

function renderAggressiveAnalysis(errorInfo) {
    console.error('\n' + SECONDARY_SEPARATOR);
    console.error('>>> AGGRESSIVE ERROR ANALYSIS <<<');
    console.error(SECONDARY_SEPARATOR);

    const analysisSource = errorInfo.rawOriginalError || (errorInfo.originalError && {
        name: errorInfo.originalError.name,
        message: errorInfo.originalError.message,
        stack: errorInfo.originalError.stack
    }) || null;

    const name = analysisSource?.name || errorInfo.name;
    const message = analysisSource?.message || errorInfo.originalMessage || errorInfo.message;
    const stack = analysisSource?.stack || errorInfo.stack;
    const context = errorInfo.context;

    if (name === 'TypeError' && message.includes('Cannot read properties of undefined')) {
        console.error('\n[ROOT CAUSE DETECTED]');
        console.error('>>> THE PARSER WAS CREATED WITHOUT A BRAIN! (grammarIndex is undefined) <<<');

        console.error('\n[WHY THIS IS A CATASTROPHE]');
        console.error('>>> A Parser without a Brain (GrammarIndex) is just a confused script. It CANNOT understand ANY grammar rules. It\'s USELESS. <<<');
        console.error('>>> Every single call to the Parser MUST pass a valid, fully-loaded GrammarIndex instance. NO EXCEPTIONS! <<<');

        console.error('\n[HOW TO FIX IT - STEP BY STEP]');
        console.error('>>> STEP 1: Find where `new PureBinaryParser(...)` is called. The stack trace is screaming at you! <<<');
        if (stack) {
            const creationPoint = stack.split('\n').find(line => line.includes('Object.parse') || line.includes('new PureBinaryParser'));
            if (creationPoint) {
                console.error('       LOOK HERE ->', creationPoint.trim());
            }
        }
        console.error('>>> STEP 2: Ensure that a `grammarIndex` object is passed as the THIRD argument. <<<');
        console.error('>>> STEP 3: Make sure this `grammarIndex` object is NOT NULL or UNDEFINED. <<<');

        console.error('\n[EXAMPLE - THE ONLY RIGHT WAY]');
        console.error('>>> const brain = new GrammarIndex(loadedGrammarData); <<<');
        console.error('>>> const parser = new PureBinaryParser(tokens, source, brain); // <-- YOU FORGOT TO PASS THE BRAIN! <<<');
        return;
    }

    if (name === 'TokenizerError') {
        console.error('\n[ROOT CAUSE DETECTED]');
        console.error('>>> THE TOKENIZER IS BLIND! YOUR GRAMMAR IS INCOMPLETE! <<<');

        if (message.includes('Unknown operator/punctuation')) {
            const charMatch = message.match(/at\s+\d+:\s+"([^"]+)"/);
            const missingChar = charMatch ? charMatch[1] : 'UNKNOWN';

            console.error('\n[WHAT\'S WRONG]');
            console.error(`>>> Your Grammar doesn't know what a "${missingChar}" is! Are you kidding me?! <<<`);
            console.error('>>> The Tokenizer is confused and is stopping everything because of this one character! <<<');

            console.error('\n[HOW TO FIX IT - NOW!]');
            console.error('>>> STEP 1: Open `javascript.grammar.json`. <<<');
            console.error(`>>> STEP 2: Add "${missingChar}" to either the "punctuation" or "operators" section. NO EXCUSES! <<<`);
        } else if (message.includes('Unknown character')) {
            const charMatch = message.match(/position\s+\d+:\s+"([^"]+)"/);
            const missingChar = charMatch ? charMatch[1] : 'UNKNOWN';

            console.error('\n[WHAT\'S WRONG]');
            console.error(`>>> What is this character: "${missingChar}"?! It's not a letter, not a digit, not an operator! <<<`);
            console.error('>>> The Tokenizer follows MATH. If it\'s not in the rules, IT DOES NOT EXIST. <<<');

            console.error('\n[HOW TO FIX IT - NOW!]');
            console.error('>>> STEP 1: Find this character in your source code. Is it a typo? A copy-paste error? Or a valid character you forgot to teach the grammar? <<<');
            console.error('>>> STEP 2A: If it\'s a typo (LIKE A THAI CHARACTER IN YOUR CODE!), REMOVE IT! <<<');
            console.error('>>> STEP 2B: If it\'s a new symbol, add it to `javascript.grammar.json` like I told you before! <<<');
        }
        return;
    }

    if (name === 'ParserError' && message.includes('has unknown')) {
        const operatorMatch = message.match(/Operator\s+"([^"]+)"/);
        const operator = operatorMatch ? operatorMatch[1] : 'UNKNOWN';

        console.error('\n[ROOT CAUSE DETECTED]');
        console.error(`>>> YOUR BRAIN IS HALF-BAKED! It knows about "${operator}" but doesn't know WHAT TO DO with it! <<<`);

        console.error('\n[WHAT\'S WRONG]');
        console.error(`>>> In \`javascript.grammar.json\`, the entry for "${operator}" is MISSING the "category" property! <<<`);
        console.error('>>> The Parser is asking "Is this for math? Is it for comparison?" and the Brain is just shrugging! <<<');

        console.error('\n[HOW TO FIX IT - DON\'T MAKE ME REPEAT MYSELF!]');
        console.error('>>> STEP 1: Open `javascript.grammar.json`. <<<');
        console.error(`>>> STEP 2: Find the entry for "${operator}". <<<`);
        console.error('>>> STEP 3: ADD a "category" property. Choose one of these: "relational", "equality", "additive", "multiplicative", "logical", "bitwise". <<<');

        console.error('\n[EXAMPLE - PAY ATTENTION!]');
        console.error(`   "${operator}": {`);
        console.error('     "precedence": 7,');
        console.error('     "category": "relational"  // <-- YOU FORGOT THIS! ADD IT!');
        console.error('   },');
        return;
    }

    if (name === 'ParserError') {
        console.error('\n[GENERIC PARSER FAILURE]');
        console.error(">>> The Parser's logic failed. It encountered a sequence of tokens it was not built to handle. <<<");
        console.error(">>> This usually means your Expression Parser (Pratt Parser) is incomplete. It doesn't understand syntax like Arrow Functions, Class bodies, or something equally complex. <<<");
    }

    if (context && Object.keys(context).length > 0) {
        console.error('\n[ERROR CONTEXT]');
        console.error(JSON.stringify(context, null, 2));
    }

    if (context && context.hint) {
        console.error('\n[HINT]');
        console.error('>>> ' + context.hint + ' <<<');
    }

    console.error('\n[STACK TRACE - THE TRAIL OF DESTRUCTION]');
    console.error(stack || 'No stack trace available');

    console.error('\n' + SECONDARY_SEPARATOR);
    console.error('>>> END OF AGGRESSIVE ANALYSIS - NOW GO FIX IT! <<<');
    console.error(SECONDARY_SEPARATOR);
}

export function renderErrorReport(errorInfo) {
    renderConsoleBanner(errorInfo);
    renderAggressiveAnalysis(errorInfo);
    console.error('\n' + PRIMARY_SEPARATOR + '\n');
}

export function formatCriticalLogEntry(logString) {
    const banner = ERROR_HANDLER_CONFIG.LOG_WARNING_PREFIX.repeat(ERROR_HANDLER_CONFIG.LOG_WARNING_REPEAT);
    return `${banner}\nCRITICAL ERROR DETECTED\n${banner}\n${logString}`;
}

export default {
    renderErrorReport,
    formatCriticalLogEntry
};
