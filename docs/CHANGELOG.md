# Changelog – OrigoDocs

## 2026-02-23 (revidering efter review)

### Vad lades till
- Fördjupat innehåll på samtliga nya kärnsidor med tydligare "Syfte", "När används", arbetssteg och felbilder.
- Konkretare driftförankring mot vår faktiska setup: EPSG:3008, intern/publik GeoServer, WMTS via GWC samt Origo Server-endpoints.
- Tydligare säkerhetsnotering om maskning av nycklar i externa URL:er.

### Vad skrevs om
- `pages/origo-guide.html` omskriven med konkreta konfigmönster från vår klientmiljö.
- `pages/geoserver.html` omskriven med riktlinjer för attribut, queryable och filterkedja.
- `pages/geoserver-styles.html` omskriven med fokus på legend/scale/cache.
- `pages/geowebcache.html` omskriven med seed-flöde och vanliga GWC-fel.
- `pages/wms-wmts-prestanda.html` omskriven med lastdrivare från Origo-klienten.
- `pages/examples.html` omskriven med verklighetsnära copy/paste-anrop mot vår driftdomän.
- `pages/troubleshooting.html` omskriven till symptom → orsak → verifiera → fix.
- `pages/standarder-konventioner.html` omskriven med namngivning och change management från vår lagerstruktur.

### Okänt hos oss (behöver bekräftas)
- Exakta viewparams som används i produktion per lager.
  - Verifiera här: GeoServer layer-konfiguration i drift.
- Exakta standardvärden för GWC metatile/gutter och ev. nattlig seedning.
  - Verifiera här: GeoServer/GWC admin + driftjobb.
- Exakt renderMode-policy per app.
  - Verifiera här: respektive app-repos `index.json`.
