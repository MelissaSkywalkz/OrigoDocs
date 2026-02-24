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

## 2026-02-23 (revidering 8: innehållsutbyggnad i canonical design)

### Vad ändrades
- Byggde ut dokumentationsinnehåll i canonical layout (samma nav/search/DOM-hooks som `pages/try-it.html`) för:
  - `pages/start-har.html`
  - `pages/origo-guide.html`
  - `pages/geoserver.html`
  - `pages/geoserver-styles.html`
  - `pages/geowebcache.html`
  - `pages/wms-wmts-prestanda.html`
  - `pages/examples.html`
  - `pages/troubleshooting.html`
  - `pages/standarder-konventioner.html`
- Harmoniserade navtexter så nya ämnen ligger i samma Dokumentation-meny som övriga sidor (ingen separat meny).
- Uppdaterade `index.html` för konsekvent nav/search och tydligare ingångar till de utbyggda guiderna.
- Regenererade `search/search-index.json` så nya avsnitt, rubriker och texter är sökbara.

### Okänt hos oss (behöver bekräftas)
- Exakta tröskelvärden/standard för cache-hit headers mellan alla miljöer (intern/proxy/extern).
- Tydlig central policy för när lager ska flyttas från WMS till WMTS som bindande regel.

## 2026-02-23 (revidering 9: verkliga JSON-patterns och house rules)

### Vad ändrades
- Uppdaterade JSON-exempel till våra faktiska mönster (källor/lager/URL:er) i:
  - `pages/faq-gis.html`
  - `pages/page.html`
  - `pages/try-it.html` (Skövde-cases + JSON-snabbtest)
- Uppdaterade driftnära endpoint-referenser i `pages/release-playbook.html` från generiska localhost-exempel till vår OWS-pattern.
- Lade till `docs/_house_patterns.md` med inventering av vad som faktiskt kan beläggas i repo (layout, sök, labs, config-mönster och begränsningar).
- Regenererade `search/search-index.json` så nya exempel och sektioner är sökbara.

### Pattern-källor i repo
- Sök/lab/layout-patterns: `assets/js/main.js`, `pages/try-it.html`, `scripts/build-search-index.js`.
- Konfig/lager-exempel i docs-kod: `pages/page.html`, `pages/faq-gis.html`, `pages/examples.html`.

### Okänt hos oss (kunde ej beläggas i repo)
- Full produktionskonfig för samtliga kartinstanser (`index.json` för alla miljöer) finns inte i detta repo.
- Därför är exempel representativa för belagda mönster, inte komplett dump av driftkonfig.

## 2026-02-24 (revidering 10: felsökning i äldre avancerad design)

### Vad ändrades
- Byggde om `pages/troubleshooting.html` till den äldre, mer avancerade strukturstilen (innehållsmeny, symptomtabell, stegkort, issue-kort, mini-cards och debug-kommandon) samtidigt som befintlig OrigoDocs-layout behölls.
- Återställde den bredare dokumentationsmenyn på felsökningssidan (JSON 101, Layermanager, FAQ GIS, npm/plugins m.fl.) för bättre match mot äldre designmönster.
- Uppdaterade innehållet med mer verklighetsnära driftfall: `RULE=undefined`, schema/flush-problem, cache/seed, WMS/WMTS-skillnader och OWS-kommandon för vår miljö.
- Regenererade `search/search-index.json` så de nya sektionerna och rubrikerna blir sökbara.

### Okänt hos oss (behöver bekräftas)
- Exakta tröskelvärden och acceptansnivå för timeout per tjänst i alla miljöer.

## 2026-02-24 (revidering 11: playbooks + glossary/DoD + ADR)

### Vad ändrades
- Utökade `pages/origo-guide.html` med fem operativa playbooks som speglar verkligt arbetssätt:
  1) Publicera nytt lager
  2) Ändra stil + legend utan cache-regression
  3) Välj WMS vs WMTS (beslutsmatris)
  4) Incidenttriage (seg karta/timeout)
  5) Releaseflöde PR → deploy → verifiering
- Varje playbook innehåller förutsättningar, steg-för-steg, vanliga misstag, verifiering och done-definition.
- Utökade `pages/standarder-konventioner.html` med aktivt glossary/konventioner-nav och nya kärnavsnitt:
  - Namngivning (workspace:layer, suffix, år/säsong)
  - Attributkonventioner
  - Definition of done för lager
  - ADR / beslutshistorik
- Lade in tre ADR-poster (backend-först, WMTS-vs-WMS-princip, RULE-hantering).
- Regenererade `search/search-index.json` så nya playbooks, glossary-termer och ADR-innehåll blir sökbara.

### Okänt hos oss (behöver bekräftas)
- Formell lagrad process för versionshantering av ADR (id-ägare, ändringsgodkännande och arkiveringsrutin).
