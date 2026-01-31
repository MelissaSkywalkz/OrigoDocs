# OrigoDocs — Copilot / AI Agent Instructions

This repository is a static documentation portal for Origo Map. The guidance below is focused, actionable, and specific to this codebase so an AI coding agent can be immediately productive.

- **Big picture:** static HTML/CSS/JS site served as documentation. Content lives as individual HTML files (index.html, origo-guide.html, layermanager.html, etc.). `main.js` implements navigation, a dual search system (in-memory `OFFLINE_SEARCH_INDEX` + `search/search-index.json`), syntax highlighting, and UI behaviors including responsive navigation and accordion panels. `main.css` contains shared styling with CSS custom properties for theming. The `try-it.html` page includes interactive tools (JSON/GeoJSON validator, map sandbox, BBOX calculator, etc.) with OpenLayers integration.

- **How to run locally:** run any static server. Common commands used in the repo:
  - `python -m http.server 8000` — open `http://localhost:8000`
  - VS Code Live Server (right‑click index.html → Open with Live Server)
  - **Published live at:** https://melissaskywalkz.github.io/OrigoDocs/ (auto-deployed from `main` via GitHub Pages)

- **Build / scripts:** there is no build pipeline. Use Prettier for formatting:
  - `npm install`
  - `npm run format` (runs `prettier --write "**/*.{html,css,js,json,md}"`)

- **Key integration points & externals:**
  - Origo (client library) — pages reference Origo concepts and configuration snippets.
  - GeoServer and GeoWebCache — several pages (geoserver\*, geowebcache) explain server-side configs and caches.
  - Origo Server (backend) — referenced in `origo-server.html`.

- **Common developer workflows and where to change things:**
  - Add a new page: copy an existing doc page HTML to preserve side menu and header structure (e.g., copy `pages/page.html` for a new page in `pages/`, or `index.html` for a root page). **Important:** pages in `pages/` use relative paths like `../assets/css/main.css` and `../index.html`, while root pages use `assets/css/main.css` and `index.html`.
  - Update navigation: each page contains the side menu markup; add the new page link to `<div class="accordion-panel" id="nav-docs">` on all pages so navigation stays consistent. Update both `index.html` and all `pages/*.html` files.
  - Search index: maintain BOTH search sources:
    - `assets/js/main.js` — update the `OFFLINE_SEARCH_INDEX` constant (JavaScript array near top of file)
    - `search/search-index.json` — keep in sync with the same entries in JSON format
  - Styling: update `assets/css/main.css` for new classes; follow existing class names (`.tool-card`, `.doc-content`, `.tryit`, etc.) and the layout patterns used across pages. CSS uses custom properties (`:root` variables) for theming.

- **Project-specific conventions and notes:**
  - Content language is Swedish. Keep messaging and labels consistent with existing pages.
  - Origo-specific claims that cannot be locally verified should be marked: `TODO: verifiera mot Origo-dokumentation` (this exact token is used throughout the codebase).
  - The repo intentionally has no CI/tests; changes should be verified manually:
    1. Run a local server and test navigation
    2. Check mobile viewport (~560px breakpoint)
    3. Verify internal links work correctly
    4. Test Try it-lab tools if modified
  - `try-it.html` uses OpenLayers (`ol@latest` from CDN) for the Map Sandbox tool. Other tools (JSON validator, BBOX calculator, etc.) are vanilla JS with inline `<script>` blocks at the end of the file.

- **Examples (copy/paste friendly):**
  - Add a search index item in `main.js` (near the top):

    {
    id: 'my-page-id',
    title: 'My Page Title',
    url: 'my-page.html',
    content: 'short keywords used by offline search',
    }

  - Run formatting after edits:
    - `npm install`
    - `npm run format`

- **Files to inspect/edit for common tasks:**
  - `index.html`, `page.html`, `origo-guide.html`, `layermanager.html` — page templates and examples
  - `main.js` — navigation, `OFFLINE_SEARCH_INDEX`, UI behavior
  - `main.css` — shared styles
  - `search-index.json` — search index (used by the UI)
  - `package.json` — formatting script
  - `README.md` — contains developer notes and verification checklist

- **What NOT to change lightly:**
  - Global navigation markup across pages — keep structure consistent or update every page.
  - `OFFLINE_SEARCH_INDEX` entries without updating visible links and `search-index.json`.
  - Relative path references (`../` vs direct) — these differ between root pages and pages in `pages/` folder.

If anything in this file is unclear or you want additional examples (e.g., a page template diff, the exact HTML snippet to update the side menu), tell me which area to expand and I will iterate.
