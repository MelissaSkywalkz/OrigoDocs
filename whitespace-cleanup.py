#!/usr/bin/env python3
"""
Whitespace cleanup script with strict rules:
1. Replace lines containing only spaces/tabs with single newline
2. Do not modify content between triple backticks (```)
3. Do not modify indentation of list items or blockquotes
4. Do not remove intentional double blank lines for section separation
"""

import sys
import re


def clean_whitespace(content, is_markdown=False):
    """
    Clean whitespace according to strict rules.
    
    Args:
        content: File content as string
        is_markdown: Whether file is markdown (affects code block detection)
    
    Returns:
        Cleaned content
    """
    lines = content.split('\n')
    cleaned_lines = []
    in_code_block = False
    prev_was_blank = False
    
    for i, line in enumerate(lines):
        # Detect code blocks in markdown files
        if is_markdown and line.strip().startswith('```'):
            in_code_block = not in_code_block
            cleaned_lines.append(line)
            prev_was_blank = False
            continue
        
        # Inside code blocks: keep everything as-is
        if in_code_block:
            cleaned_lines.append(line)
            prev_was_blank = False
            continue
        
        # Check if this line contains only whitespace
        if line and not line.strip():
            # This is a line with only spaces/tabs
            # Replace with empty line (preserve intentional double blank lines)
            cleaned_lines.append('')
            # Track if previous was blank to preserve double blanks
            if not prev_was_blank:
                prev_was_blank = True
            # else: keep the blank line to preserve double blanks
        else:
            # Normal line or truly empty line
            cleaned_lines.append(line)
            prev_was_blank = (line == '')
    
    return '\n'.join(cleaned_lines)


def process_file(filepath):
    """Process a single file for whitespace cleanup."""
    is_markdown = filepath.endswith('.md')
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        cleaned_content = clean_whitespace(original_content, is_markdown)
        
        if original_content != cleaned_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: whitespace-cleanup.py <file1> [file2] ...", file=sys.stderr)
        sys.exit(1)
    
    modified_count = 0
    for filepath in sys.argv[1:]:
        if process_file(filepath):
            print(f"Cleaned: {filepath}")
            modified_count += 1
        else:
            print(f"No changes: {filepath}")
    
    print(f"\nTotal files modified: {modified_count}")
