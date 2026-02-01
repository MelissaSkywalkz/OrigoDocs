# Whitespace Normalization - Comprehensive

This document describes the comprehensive whitespace normalization applied to all wiki pages.

## Rules Applied

1. **Remove trailing spaces**: All trailing spaces removed from non-empty lines
2. **Normalize blank lines**: Blank lines are truly empty (no spaces or tabs)
3. **Preserve code blocks**: Content inside fenced code blocks (```) is preserved exactly
4. **Consistent line endings**: All files use LF (Unix-style) line endings
5. **No semantic changes**: Only whitespace is modified, no content changes

## Implementation

The `whitespace-normalize.py` script implements these rules:

### Usage

```bash
# Dry run - see what would be changed
python3 whitespace-normalize.py --dry-run file.md

# Apply changes
python3 whitespace-normalize.py file.md

# Process multiple files
python3 whitespace-normalize.py *.md

# Verbose output
python3 whitespace-normalize.py --verbose file.md
```

### Features

- **Code block awareness**: Detects and preserves content between ``` markers
- **Safe processing**: Dry-run mode to preview changes
- **Detailed reporting**: Shows number of lines processed and cleaned
- **Line ending normalization**: Converts CRLF to LF automatically

## Results - Wiki Pages

Applied to all wiki pages on 2026-02-01:

### Summary

- **Files processed**: 10 markdown files
- **Files modified**: 7 files
- **Total lines processed**: 2,765 lines
- **Lines with trailing whitespace cleaned**: 654 lines
- **Changes**: 585 insertions, 585 deletions (whitespace only)

### Files Modified

| File | Lines Cleaned | Total Lines |
|------|---------------|-------------|
| CRS-amd-Coordinate-Assumptions.md | 78 | 254 |
| Change-management.md | 135 | 503 |
| Developing-and-maintenance.md | 125 | 500 |
| Exports-and-integration.md | 95 | 376 |
| Known-limitations-and-non-goals.md | 96 | 339 |
| Tool-documentation.md | 124 | 644 |
| Try-it-Labs-overview.md | 1 | 149 |

### Files Already Clean

- Error-handling-and-validation-reports.md
- Home.md
- Map-sandbox-technical-notes.md

## Verification

All changes verified to be:
- ✅ Whitespace-only (no content changes)
- ✅ Code blocks preserved
- ✅ Markdown semantics unchanged
- ✅ Consistent line endings (LF)
- ✅ No words added or removed

## Difference from Previous Cleanup

The previous `whitespace-cleanup.py` script only handled:
- Lines containing ONLY whitespace → empty lines

This comprehensive normalization also handles:
- **Trailing spaces on non-empty lines** → removed
- **Consistent line endings** → normalized to LF
- **Enhanced reporting** → detailed statistics and dry-run mode

## Future Maintenance

Run this script before committing changes to maintain clean whitespace:

```bash
# Check before commit
python3 whitespace-normalize.py --dry-run *.md

# Clean if needed
python3 whitespace-normalize.py *.md
```

Or add as a pre-commit hook for automatic enforcement.

---

**Date**: 2026-02-01  
**Script**: whitespace-normalize.py  
**Wiki commit**: a8ea897 "Comprehensive whitespace normalization"
