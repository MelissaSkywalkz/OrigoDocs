# Changelog – OrigoDocs

## 2026-02-23

### Vad lades till
- Ny onboarding-sida: `pages/start-har.html`.
- Ny sida för prestanda: `pages/wms-wmts-prestanda.html`.
- Ny sida för standarder: `pages/standarder-konventioner.html`.
- Ny startstruktur på `index.html` med tydlig "start här"-väg.

### Vad skrevs om
- `pages/origo-guide.html` fokuserar nu på vårt klientmönster (CSW/metadata/lagergrupp).
- `pages/geoserver.html` fokuserar på attribut och filtrering (CQL/viewparams/layer filters).
- `pages/geoserver-styles.html` fokuserar på stilsättning, legend och cachepåverkan.
- `pages/geowebcache.html` fokuserar på seedning/truncate och driftval.
- `pages/examples.html` är nu en quick-recipe-sida med copy/paste-anrop.
- `pages/troubleshooting.html` är ombyggd till symptom → orsak → verifiera → fix.

### Okänt hos oss (behöver bekräftas)
- Exakta timeout-värden och metadatahämtning i produktionsklienten.
  - Verifiera här: produktionsappens `index.html`/`index.json` där metadatahämtning och timeout sätts.
- Exakt policy för CSS vs SLD i alla team.
  - Verifiera här: style-repo eller GeoServer data_dir i drift.
- Exakta GWC-standardvärden (metatiling/gutter) och schemalagd seedning.
  - Verifiera här: GeoServer/GWC admin och driftjobb i CI/ops-repo.
- Exakta renderMode-val i produktions-Origo-appar.
  - Verifiera här: respektive app-repos `index.json`.
