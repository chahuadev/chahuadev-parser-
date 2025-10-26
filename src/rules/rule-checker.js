// ! ======================================================================
// !  บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// !  Repository: https://github.com/chahuadev/chahuadev-Sentinel.git
// !  Version: 1.0.0
// !  License: MIT
// !  Contact: chahuadev@gmail.com
// ! ======================================================================

/**
 * Generic pattern-based rule checker
 * Shared implementation for all pattern-based rules
 * 
 * @param {object} rule - Rule object with patterns array
 * @param {object} ast - AST (not used for pattern matching, but kept for compatibility)
 * @param {string} code - Source code to check
 * @param {string} fileName - File name being checked
 * @returns {array} Array of violation objects
 */
export function patternBasedCheck(rule, ast, code, fileName) {
    const violations = [];
    const lines = code.split('\n');
    
    // Check each pattern against the code
    for (const pattern of rule.patterns) {
        const matches = [...code.matchAll(pattern.regex)];
        
        for (const match of matches) {
            // Calculate line and column from match.index
            const beforeMatch = code.substring(0, match.index);
            const line = beforeMatch.split('\n').length;
            const lastLineBreak = beforeMatch.lastIndexOf('\n');
            const column = match.index - lastLineBreak;
            
            // Extract code snippet (3 lines context)
            const startLine = Math.max(0, line - 2);
            const endLine = Math.min(lines.length, line + 1);
            const snippet = lines.slice(startLine, endLine).join('\n');
            
            violations.push({
                rule: rule.slug,
                severity: pattern.severity,
                message: `${pattern.name}: ${match[0]}`,
                line: line,
                column: column,
                fileName: fileName,
                snippet: snippet
            });
        }
    }
    
    return violations;
}

export default {
    patternBasedCheck
};
