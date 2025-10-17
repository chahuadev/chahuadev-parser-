import errorHandler from '../../src/error-handler/ErrorHandler.js';

export default async function globalTeardown() {
    if (typeof errorHandler?.flushAsyncOperations !== 'function') {
        return;
    }

    try {
        await errorHandler.flushAsyncOperations();
    } catch (error) {
        const failure = new Error(`globalTeardown failed: ${error.message}`);
        failure.cause = error;
        throw failure;
    }
}
