#!/usr/bin/env python3
"""Basic internal link/anchor check for mkdocs/docs markdown files."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = ROOT / "mkdocs" / "docs"


def slugify_heading(text: str) -> str:
    text = re.sub(r"\s*\{#.+\}\s*$", "", text).strip().lower()
    text = text.replace("→", "-").replace("/", "-")
    text = re.sub(r"[^\w\s\-]+", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text


def collect_anchors(markdown_text: str) -> set[str]:
    anchors: set[str] = set(re.findall(r"\{#([A-Za-z0-9_\-]+)\}", markdown_text))
    for match in re.finditer(r"^(#{1,6})\s+(.+?)\s*$", markdown_text, flags=re.M):
        slug = slugify_heading(match.group(2))
        if slug:
            anchors.add(slug)
    return anchors


def main() -> int:
    markdown_files = sorted(DOCS_ROOT.rglob("*.md"))
    anchors_by_file: dict[str, set[str]] = {}

    for path in markdown_files:
        rel = path.relative_to(DOCS_ROOT).as_posix()
        anchors_by_file[rel] = collect_anchors(path.read_text(encoding="utf-8"))

    errors: list[tuple[str, str, str]] = []

    for path in markdown_files:
        rel = path.relative_to(DOCS_ROOT).as_posix()
        text = path.read_text(encoding="utf-8")

        for link_match in re.finditer(r"\[[^\]]+\]\(([^)]+)\)", text):
            link = link_match.group(1).strip()
            if link.startswith(("http://", "https://", "mailto:", "#")):
                continue

            target = link.split("#", 1)[0].split()[0]
            fragment = link.split("#", 1)[1] if "#" in link else None
            if not target:
                continue

            resolved = (path.parent / target).resolve()
            try:
                resolved_rel = resolved.relative_to(DOCS_ROOT.resolve()).as_posix()
            except Exception:
                errors.append((rel, link, "outside-docs"))
                continue

            if resolved_rel not in anchors_by_file:
                errors.append((rel, link, "missing-doc"))
                continue

            if fragment and fragment not in anchors_by_file[resolved_rel]:
                errors.append((rel, link, "missing-anchor"))

    if errors:
        print(f"Found {len(errors)} mkdocs link/anchor error(s):")
        for src, link, kind in errors:
            print(f" - {kind}: {src} -> {link}")
        return 1

    print(f"OK: checked {len(markdown_files)} markdown files under mkdocs/docs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
