# Changelog – OrigoDocs

## 2026-02-23 (revidering 6: bevara UI/UX + utökade labs)

### Vad ändrades
- Säkerställde att uppdaterade docs-sidor använder samma OrigoDocs-UI/UX-mönster (sidenav + nav-search + nav-backdrop + main.js).
- Lade till `docs/_migration_notes.md` med inventering av:
  - layout/nav-filer
  - sökmekanik (build-script + indexfiler)
  - try-it-lab-mekanik (`data-tryit` + tool-moduler)
- Utökade `pages/try-it.html` med ny sektion **Skövde-cases** (copy/paste-scenarier + förväntat användningsmönster) utan att ändra lab-motorn.
- Uppdaterade nav-länkar i `pages/try-it.html` till samma docs-struktur som övriga uppdaterade sidor.
- Regenererade `search/search-index.json` så nytt innehåll är sökbart.

### Okänt hos oss (behöver bekräftas)
- Exakt standard för verifiering av cache-hit/miss headers i alla miljöer (kan skilja mellan proxy-lager).
  - Verifiera här: driftloggning/proxykonfiguration för respektive miljö.

## 2026-02-23 (revidering 7: canonical template på nya sidor)

### Vad ändrades
- Migrerade nya docs-sidor till canonical `pages/try-it.html`-struktur (samma nav/header/sidebar/sök-hookar):
  - `pages/start-har.html`
  - `pages/standarder-konventioner.html`
  - `pages/wms-wmts-prestanda.html`
- Säkerställde att sidorna innehåller samma DOM-hookar:
  - `#sidenav`
  - `#navSearch`
  - `.nav-backdrop`
  - `assets/js/main.js`
- Regenererade `search/search-index.json`.

### Okänt hos oss (behöver bekräftas)
- Varför lokal HTTP-server inte accepterar anslutning i denna körmiljö (påverkar browser-baserad liveverifiering här).
