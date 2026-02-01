# Whitespace Cleanup Rules

This document describes the strict whitespace cleanup rules applied to this repository.

## Rules

1. **Replace whitespace-only lines**: Lines that contain only spaces or tabs are replaced with a single newline (empty line).

2. **Preserve code blocks**: All content between triple backticks (```) is left unchanged, including any whitespace.

3. **Preserve indentation**: Indentation of list items and blockquotes is preserved. Only lines with ONLY whitespace (no other content) are cleaned.

4. **Preserve section separators**: Intentional double blank lines used to separate sections are preserved.

## Implementation

The `whitespace-cleanup.py` script implements these rules:

```bash
# Clean a single file
python3 whitespace-cleanup.py file.md

# Clean multiple files
python3 whitespace-cleanup.py file1.md file2.md

# Clean all markdown files
find . -name "*.md" -exec python3 whitespace-cleanup.py {} +
```

## Results

Applied to repository on 2026-02-01:
- Files checked: All .md and .html files
- Files modified: 1 (REVIEW_SUMMARY.md)
- Lines cleaned: 2 (lines 71, 75 - removed trailing spaces from blank lines between list items)

## Verification

The cleanup:
- ✅ Removed only whitespace-only lines
- ✅ Preserved all code blocks
- ✅ Preserved list indentation
- ✅ Preserved double blank lines
- ✅ No content changes, only whitespace normalization
