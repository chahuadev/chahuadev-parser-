// Intentionally broken JavaScript to test error reporting

function testBrokenSyntax() {
    const x = 10;
    const y = 20;
    
    // Missing closing brace - syntax error
    if (x > 5) {
        console.log('x is greater');
    // Missing }
    
    // Invalid token
    const z = @@@@@;
    
    // Unclosed string
    const name = "John;
    
    // Missing semicolon and closing parenthesis
    console.log("Missing paren"
    
    return x + y;
}

// Extra closing brace
}}

// Invalid syntax
function ( {
    return "broken";
}
