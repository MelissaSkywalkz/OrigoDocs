#!/usr/bin/env python3
"""
Enhanced whitespace normalization script for wiki pages.

Rules:
1. Remove trailing spaces at end of all lines (empty or non-empty)
2. Ensure blank lines are truly empty (no spaces/tabs)
3. Preserve intentional indentation inside code blocks
4. Do not change spacing inside inline code or fenced code blocks
5. Do not alter Markdown semantics
6. Ensure consistent line endings (LF)
"""

import sys
import re


def normalize_whitespace(content, is_markdown=False):
    """
    Normalize whitespace according to comprehensive rules.
    
    Args:
        content: File content as string
        is_markdown: Whether file is markdown (affects code block detection)
    
    Returns:
        Cleaned content with normalized whitespace
    """
    lines = content.split('\n')
    cleaned_lines = []
    in_code_block = False
    
    for line in lines:
        # Detect code blocks in markdown files
        if is_markdown and line.strip().startswith('```'):
            in_code_block = not in_code_block
            # Remove trailing whitespace from code fence lines too
            cleaned_lines.append(line.rstrip())
            continue
        
        # Inside code blocks: preserve everything as-is
        if in_code_block:
            cleaned_lines.append(line)
            continue
        
        # Outside code blocks: remove all trailing whitespace
        # This handles both empty lines with spaces and non-empty lines with trailing spaces
        cleaned_line = line.rstrip()
        cleaned_lines.append(cleaned_line)
    
    # Join with LF line endings
    return '\n'.join(cleaned_lines)


def process_file(filepath, dry_run=False):
    """Process a single file for whitespace normalization."""
    is_markdown = filepath.endswith('.md')
    
    try:
        with open(filepath, 'r', encoding='utf-8', newline='') as f:
            original_content = f.read()
        
        # Normalize line endings first (CRLF -> LF)
        original_content = original_content.replace('\r\n', '\n')
        
        # Clean whitespace
        cleaned_content = normalize_whitespace(original_content, is_markdown)
        
        if original_content != cleaned_content:
            if not dry_run:
                with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(cleaned_content)
            return True, len(original_content.split('\n')), len([l for l in original_content.split('\n') if l != l.rstrip()])
        return False, 0, 0
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False, 0, 0


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Normalize whitespace in markdown files'
    )
    parser.add_argument('files', nargs='+', help='Files to process')
    parser.add_argument('--dry-run', action='store_true', 
                       help='Show what would be changed without modifying files')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Show detailed information')
    
    args = parser.parse_args()
    
    modified_count = 0
    total_lines = 0
    total_lines_cleaned = 0
    
    for filepath in args.files:
        modified, lines, lines_cleaned = process_file(filepath, args.dry_run)
        
        if modified:
            status = "Would clean" if args.dry_run else "Cleaned"
            print(f"{status}: {filepath}")
            if args.verbose:
                print(f"  Total lines: {lines}, Lines with trailing whitespace: {lines_cleaned}")
            modified_count += 1
            total_lines += lines
            total_lines_cleaned += lines_cleaned
        else:
            if args.verbose:
                print(f"No changes: {filepath}")
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Files {'that would be ' if args.dry_run else ''}modified: {modified_count}/{len(args.files)}")
    if modified_count > 0:
        print(f"  Total lines processed: {total_lines}")
        print(f"  Lines cleaned: {total_lines_cleaned}")
    
    if args.dry_run and modified_count > 0:
        print(f"\nRun without --dry-run to apply changes")


if __name__ == '__main__':
    main()
