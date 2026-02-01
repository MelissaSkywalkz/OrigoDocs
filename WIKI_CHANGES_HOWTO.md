# How to Apply Wiki Quality Fixes

This directory contains the results of a comprehensive quality review of the OrigoDocs Wiki. The wiki repository is separate from the main repository, so the changes need to be manually applied.

## Quick Start

1. Clone the wiki repository (if not already done):
   ```bash
   git clone https://github.com/MelissaSkywalkz/OrigoDocs.wiki.git
   cd OrigoDocs.wiki
   ```

2. Apply the patch:
   ```bash
   git am < /path/to/wiki-quality-fixes.patch
   ```

3. Push the changes:
   ```bash
   git push origin master
   ```

## Alternative: Manual Application

If the patch doesn't apply cleanly, you can make the changes manually using the detailed list below.

## Changes Made

### 1. Rename File
- **Old:** `CRS‐amd‐Coordinate‐Assumptions.md`
- **New:** `CRS‐and‐Coordinate‐Assumptions.md`
- **Reason:** Fixed typo in filename

### 2. Fix Headings

**CRS-and-Coordinate-Assumptions.md** (line 1-2):
```diff
-# CRS och Koordinatantaganden
---
+# CRS och Koordinatantaganden
```

**Tool-documentation.md** (line 1-2):
```diff
-# Verktygsdokumentation
---
+# Verktygsdokumentation
```

**Known-limitations-and-non-goals.md** (line 1-2):
```diff
-# Kända Begränsningar och Non-Goals
---
+# Kända Begränsningar och Non-Goals
```

**Developing-and-maintenance.md** (line 1):
```diff
-Development och Maintenance
+# Development och Maintenance
```

**Error-handling-and-validation-reports.md** (line 1-2):
```diff
 # Error Handling och Valideringsrapporter
-Dokumentation om valideringslogik, felrapporter och strukturen av ValidationReport.
+
+Dokumentation om valideringslogik, felrapporter och strukturen av ValidationReport.
```

### 3. Fix Table Formatting

Replace all escaped pipes (`\|`) with normal pipes (`|`) in:

**Known-limitations-and-non-goals.md** (3 tables around lines 296-323)
**Change-management.md** (1 table around lines 21-28)

Example:
```diff
-\| Feature \| Try-it-labben \| QGIS Desktop \|
-\|---------\|---------------\|--------------\|
+| Feature | Try-it-labben | QGIS Desktop |
+|---------|---------------|--------------|
```

### 4. Fix Content Issues

**Known-limitations-and-non-goals.md** (line 71):
```diff
-- Ingen support för OAuth/******
+- Ingen support för OAuth2
```

**Exports-and-integration.md** (line 355):
```diff
-curl -X GET "******example.com/geoserver/wms?..."
+curl -X GET "https://admin:password@example.com/geoserver/wms?..."
```

## Verification

After applying the changes, verify:

1. All files can be viewed correctly in GitHub Wiki UI
2. Tables render properly (no escaped pipes visible)
3. Headings display correctly
4. No broken formatting

## Files Modified

- CRS‐and‐Coordinate‐Assumptions.md (renamed from CRS‐amd‐Coordinate‐Assumptions.md)
- Change‐management.md
- Developing‐and‐maintenance.md
- Error‐handling‐and‐validation‐reports.md
- Exports‐and‐integration.md
- Known‐limitations‐and‐non‐goals.md
- Tool‐documentation.md

## Commit Message

When committing these changes, use:
```
Fix markdown formatting and consistency issues

- Fix filename typo: CRS-amd -> CRS-and
- Remove extra dashes after H1 headings
- Fix missing H1 heading in Developing-and-maintenance.md
- Fix missing blank line after H1 in Error-handling
- Fix OAuth2 masking issue
- Fix table formatting (remove escaped pipes)
- Fix masked URL example in Exports-and-integration.md
```

## Support

For questions about these changes, refer to:
- `WIKI_QUALITY_REVIEW.md` - Comprehensive review summary
- `wiki-quality-fixes.patch` - Actual code changes in patch format
