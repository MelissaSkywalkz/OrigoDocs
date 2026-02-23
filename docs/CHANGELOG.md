# Changelog – OrigoDocs

## 2026-02-23 (revidering 4 efter review)

### Vad lades till
- Ny tydlig "helhetsbild" av ansvarsfördelning: GeoServer (sanning), GWC (cache), Origo (presentation/logiklager).
- Tydligare backend-först-princip i flera sidor.
- Metodisk felsökningsordning dokumenterad: GeoServer först, Origo sen.

### Vad skrevs om
- `pages/origo-guide.html`: omskriven till arkitektur-/ansvarssida.
- `pages/geoserver.html`: omskriven med datamodellprinciper och filterpraxis.
- `pages/geoserver-styles.html`: omskriven med style=logik, legendfällor och RULE-fel.
- `pages/wms-wmts-prestanda.html`: omskriven med WMTS där det går, WMS där det måste vara dynamiskt.
- `pages/troubleshooting.html`: omskriven till tydlig metodik + vanliga felmönster.
- `pages/start-har.html` och `pages/standarder-konventioner.html`: skärpta för onboarding och kunskapsöverföring.

### Okänt hos oss (behöver bekräftas)
- Formella tröskelvärden för när WMS-latens kräver incident eskalering.
  - Verifiera här: driftens monitorerings-/SLA-dokument.
- Officiell policy för max komplexitet i en enskild style (antal regler/legendkrav).
  - Verifiera här: style-governance i förvaltningsrutiner.
