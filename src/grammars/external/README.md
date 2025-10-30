# External Grammar Cache

This directory stores original grammar files downloaded from external sources (Tree-sitter, ANTLR, etc.)

## Structure

```
external/
├── python.json      # Tree-sitter Python grammar (raw)
├── go.json          # Tree-sitter Go grammar (raw)
├── rust.json        # Tree-sitter Rust grammar (raw)
└── ...
```

## Purpose

- Cache original grammar files
- Allow offline development
- Track source versions
- Enable diff/comparison

## Usage

These files are automatically downloaded by:

```bash
node src/grammars/shared/configs/add-language.js python
```

Do NOT edit these files manually - they are source files from upstream repositories.
