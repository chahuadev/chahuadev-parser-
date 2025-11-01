/**
 * Parser Configuration - ES Module
 * Migrated from parser-config.json
 */

export const parserConfig = {
    // Parser settings
    maxDepth: 100,
    maxTokens: 100000,
    strictMode: false,
    allowImplicitGlobals: false,
    
    // Error handling
    throwOnError: false,
    collectErrors: true,
    maxErrors: 100,
    
    // Performance
    enableCaching: true,
    cacheSize: 1000,
    
    // Binary settings
    binaryMode: true,
    useQuantumArchitecture: true,
    
    // Default rules (can be overridden by createParser)
    rules: {
        requireSemicolons: false,
        allowTrailingComma: true,
        allowAsync: true,
        allowAwait: true,
        allowGenerators: true,
        allowClasses: true,
        allowModules: true
    }
};

export default parserConfig;
