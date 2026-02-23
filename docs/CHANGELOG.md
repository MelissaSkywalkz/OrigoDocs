# Changelog – OrigoDocs

## 2026-02-23 (revidering 2 efter review)

### Vad lades till
- Tydligare förankring till faktisk lagerrealitet från index-konfig: tematiska lagerfamiljer, queryable=false-fall, intern/publik-source-mönster.
- Praktiska exempel med verkliga lager-ID:n från vår miljö (bl.a. skyfall, fastighet, WMTS fastighetsgräns).
- Ny felsökningspost för bakgrundslager med både WMS- och WMTS-varianter.

### Vad skrevs om
- `pages/origo-guide.html`: omskriven med driftrelevanta mönster och riskområden från verklig lagerkatalog.
- `pages/geoserver.html`: omskriven med attribut/queryable/filter utifrån faktisk konfigprofil.
- `pages/geoserver-styles.html`: omskriven med fokus på tematiska lager, legend och cache.
- `pages/wms-wmts-prestanda.html`: omskriven med verkliga lastdrivare från vår lagerstruktur.
- `pages/examples.html`: omskriven med copy/paste mot våra faktiska endpoints och lager-ID:n.
- `pages/troubleshooting.html`: omskriven med mer konkreta symptomkedjor för vår miljö.

### Okänt hos oss (behöver bekräftas)
- Formell policy för dubbla WMS/WMTS-varianter av samma bakgrundstema.
  - Verifiera här: produktions-`index.json` + driftbeslut i ops-dokumentation.
- Exakt tröskel för acceptabel legendlast i produktion.
  - Verifiera här: APM/prestandarapporter i driftmiljön.
