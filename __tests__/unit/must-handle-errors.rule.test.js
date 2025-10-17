import { ValidationEngine } from '../../src/rules/validator.js';
import errorHandler from '../../src/error-handler/ErrorHandler.js';

describe('MUST_HANDLE_ERRORS rule enforcement', () => {
    let engine;

    beforeAll(async () => {
        engine = new ValidationEngine();
        await engine.initializeParserStudy();
    });

    afterAll(async () => {
        if (errorHandler && typeof errorHandler.flushAsyncOperations === 'function') {
            await errorHandler.flushAsyncOperations();
        }
    });

    test('reports async function without try/catch', async () => {
        const sample = `async function loadData() {
    await fetchData();
}`;
        const result = await engine.validateCode(sample, 'virtual-without-try.js');
        const violations = result.violations.filter(v => v.ruleId === 'MUST_HANDLE_ERRORS');

        expect(violations).toHaveLength(1);
        expect(violations[0]).toEqual(expect.objectContaining({
            ruleId: 'MUST_HANDLE_ERRORS',
            line: 1
        }));
    });

    test('allows async function protected with try/catch and errorHandler', async () => {
        const sample = `import errorHandler from './src/error-handler/ErrorHandler.js';

async function loadData() {
    try {
        return await fetchData();
    } catch (error) {
        errorHandler.handleError(error, { source: 'virtual-test' });
        throw error;
    }
}`;
        const result = await engine.validateCode(sample, 'virtual-with-try.js');
        const violations = result.violations.filter(v => v.ruleId === 'MUST_HANDLE_ERRORS');

        expect(violations).toHaveLength(0);
    });
});
