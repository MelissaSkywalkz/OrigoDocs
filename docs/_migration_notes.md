# Migreringsanteckningar – layout/nav/sök/labs

## 1) Var layout/nav/sök/labs styrs
- **Global layoutmönster (HTML + CSS + JS):**
  - `index.html`
  - `pages/*.html` (samma struktur med `sidenav`, `nav-search`, `main`, `nav-backdrop`)
  - `assets/css/main.css`
  - `assets/js/main.js` (nav-toggle, aktiv länk, söklogik, try-it-init)
- **Sökindex:**
  - Generator: `scripts/build-search-index.js`
  - Genererad fil: `search/search-index.json`
  - Offline fallback: `OFFLINE_SEARCH_INDEX` i `assets/js/main.js`
- **Try-it labs-mekanik:**
  - Markup och `data-tryit` i `pages/try-it.html`
  - Tool-moduler i `assets/js/tryit/tools/*.js`
  - Init via `assets/js/main.js` (matchning på `data-tryit`)

## 2) Avancerade sidor/labs som måste bevaras
- `pages/try-it.html` (JSON, mapsandbox, urlbuilder, bbox, resolutions, gridcalc, sld, sldpreview)
- `pages/release-playbook.html`
- `pages/examples.html`
- `pages/troubleshooting.html`
- `pages/geowebcache.html`
- `pages/geoserver-styles.html`

## 3) Migreringsåtgärd i denna revision
- Inga parallella docs-system skapade.
- Uppdaterade docs-sidor använder samma nav/sök/layoutstruktur.
- Try-it labs behålls i befintligt format (`data-tryit`) och kompletteras med "Så gör vi hos oss"-scenarier.
