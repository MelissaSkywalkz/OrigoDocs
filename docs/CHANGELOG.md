# Changelog – OrigoDocs

## 2026-02-23 (revidering 3 efter review)

### Vad lades till
- Flera nya driftförankrade avsnitt från interna anteckningar: server-URL:er, Git/remote-flöde, AD-behörigheter, seed-rutiner och prestandajämförelser WMS/WMTS.
- Ny explicit felsökningskedja för tre återkommande loggfel:
  - RULE=undefined i legend
  - Schema does not exist / Unable to flush
  - Can't obtain schema for layer
- Konkreta quick recipes uppdaterade till `/geoserver/ows/` samt WMTS/GWC-endpoint i vår miljö.

### Vad skrevs om
- `pages/start-har.html`: onboarding och kritiska URL:er.
- `pages/geoserver.html`: attribut, filter, specialtecken och datakällafelsökning.
- `pages/geoserver-styles.html`: RULE-fel och legendpraktik.
- `pages/geowebcache.html`: två använda bbox-varianter och seed-rutin.
- `pages/troubleshooting.html`: utökad handbok med loggfel från verklig drift.
- `pages/standarder-konventioner.html`: AD-behörighet, Git/extern-branch, change management.

### Okänt hos oss (behöver bekräftas)
- Officiell standard-BBOX för Skövde seed (vi har två varianter i anteckningar).
  - Verifiera här: teamets GWC driftmall.
- Exakt klientregel för vilka lager som får/inte får RULE vid legendanrop.
  - Verifiera här: klientkod för legend/thematic-funktion.
