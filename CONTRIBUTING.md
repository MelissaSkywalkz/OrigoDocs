Contributing to OrigoDocs
=========================

Purpose
-------
This document describes the repository conventions and the expected process for contributing to OrigoDocs. It is intended for developers and technical maintainers who will add or modify docs and Try‑it tools.

Language and tone
-----------------
- User‑facing content must be written in Swedish.
- Internal code, identifiers and comments should use English where appropriate.
- Keep content factual, concise and technical. Do not add marketing or speculative language.

Adding a new Try‑it tool
------------------------
1. Create the UI block in `pages/try-it.html` or the appropriate page following the existing pattern: input → actions → output → report.
2. Add a JS module under `assets/js/tryit/tools/` that exports `init(block)`. The module should:
   - Validate inputs defensively and produce a `ValidationReport` using the shared helpers in `assets/js/tryit/ui-helpers.js`.
   - Surface all user‑facing errors in Swedish.
   - Avoid silent failures (no console‑only error reports for expected user errors).
   - Use `appState` for logging where appropriate and `ui-helpers` for rendering reports.
3. Wire the module in `assets/js/main.js` so it is initialized for the corresponding `data-tryit` block.
4. Update the offline search index: `OFFLINE_SEARCH_INDEX` in `assets/js/main.js` and `search/search-index.json`.

UI structure requirements
------------------------
- The HTML block for a tool should contain at minimum:
  - An input area (textarea or form controls).
  - Action buttons (`type="button"`) for primary operations (validate, generate, copy, download).
  - An output area for results/snippets.
  - A report area where `ValidationReport` is rendered.
- All interactive elements must be keyboard accessible and include appropriate `aria-*` attributes as needed.

Validation and exports
----------------------
- Validation must produce structured reports and not rely solely on console output.
- Exports (text, JSON, snippets) must be deterministic where possible (avoid embedding timestamps unless documented and necessary).
- Provide a short human‑readable explanation in Swedish for any automated correction or suggested fix.

Accessibility
-------------
- Buttons must have explicit `type` attributes.
- Inputs and outputs should have labels or `aria-label`/`aria-describedby` where labels are not visually present.
- Ensure focus order is logical and that keyboard activation triggers the same code path as mouse activation.

Testing before merge
--------------------
- Start a local static server and verify:
  - The tool initializes and is reachable from `pages/try-it.html`.
  - All actions produce visible user feedback.
  - Exports download or copy correctly.
  - Mobile viewport (~560px) is usable for the UI.
- Use `?dev=1` to enable developer self‑tests if available.

Pull Request checklist
----------------------
- [ ] Swedish user‑facing strings reviewed.
- [ ] No console‑only error paths for expected user inputs.
- [ ] Deterministic exports when applicable.
- [ ] Accessibility checks (button types, labels, keyboard interaction).
- [ ] `OFFLINE_SEARCH_INDEX` and `search/search-index.json` updated if a new page was added.

Contact
-------
If unsure about a change, open a short issue describing the intended change and any risks. Mark unverifiable claims with `TODO: verifiera mot Origo-dokumentation`.
