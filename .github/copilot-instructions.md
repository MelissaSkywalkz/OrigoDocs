# OrigoDocs — Copilot / AI Agent Instructions

This repository is a static documentation portal for Origo Map. The guidance below is focused, actionable, and specific to this codebase so an AI coding agent can be immediately productive.

- **Big picture:** static HTML/CSS/JS site served as documentation. Content lives as individual HTML files (index.html, origo-guide.html, layermanager.html, etc.). `main.js` implements navigation, an offline search index (`OFFLINE_SEARCH_INDEX`), and UI behaviors. `main.css` contains shared styling.

- **How to run locally:** run any static server. Common commands used in the repo:
  - `python -m http.server 8000` — open `http://localhost:8000`
  - VS Code Live Server (right‑click index.html → Open with Live Server)

- **Build / scripts:** there is no build pipeline. Use Prettier for formatting:
  - `npm install`
  - `npm run format` (runs `prettier --write "**/*.{html,css,js,json,md}"`)

- **Key integration points & externals:**
  - Origo (client library) — pages reference Origo concepts and configuration snippets.
  - GeoServer and GeoWebCache — several pages (geoserver*, geowebcache) explain server-side configs and caches.
  - Origo Server (backend) — referenced in `origo-server.html`.

- **Common developer workflows and where to change things:**
  - Add a new page: copy an existing doc page HTML to preserve side menu and header structure (e.g., copy `page.html`).
  - Update navigation: each page contains the side menu markup; add the new page link to the menu on all pages so navigation stays consistent.
  - Search index: `main.js` contains an `OFFLINE_SEARCH_INDEX` constant used by the client. When adding pages, add an entry there and keep `search-index.json` in sync if used.
  - Styling: update `main.css` for new classes; follow existing class names and the layout patterns used across pages.

- **Project-specific conventions and notes:**
  - Content language is Swedish. Keep messaging and labels consistent with existing pages.
  - Origo-specific claims that cannot be locally verified should be marked: `TODO: verifiera mot Origo-dokumentation` (this exact token is used in the README).
  - The repo intentionally has no CI/tests; changes should be verified manually by running a local server and clicking through navigation and mobile breakpoints.

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

If anything in this file is unclear or you want additional examples (e.g., a page template diff, the exact HTML snippet to update the side menu), tell me which area to expand and I will iterate.
