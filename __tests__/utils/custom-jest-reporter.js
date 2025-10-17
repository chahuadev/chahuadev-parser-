import errorHandler from '../../src/error-handler/ErrorHandler.js';

class CustomJestReporter {
    onRunComplete(_, results) {
        if (!results) {
            return;
        }

        if (results.numFailedTests > 0 || results.numFailedTestSuites > 0) {
            const failureSummary = new Error('Jest run reported failing tests');
            failureSummary.name = 'JestRunFailure';
            failureSummary.isOperational = true;

            errorHandler.handleError(failureSummary, {
                source: 'CustomJestReporter',
                method: 'onRunComplete',
                severity: 'HIGH',
                context: {
                    failedSuites: results.numFailedTestSuites,
                    failedTests: results.numFailedTests
                }
            });
        }

        const summary = `Jest Suites: ${results.numPassedTestSuites}/${results.numTotalTestSuites} passed, ` +
            `Tests: ${results.numPassedTests}/${results.numTotalTests} passed\n`;
        process.stdout.write(summary);
    }
}

export default CustomJestReporter;
