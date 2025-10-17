import { setupGlobalErrorHandlers } from '../../src/error-handler/ErrorHandler.js';

export default async function globalSetup() {
    try {
        setupGlobalErrorHandlers();
    } catch (error) {
        const failure = new Error(`globalSetup failed: ${error.message}`);
        failure.cause = error;
        throw failure;
    }
}
