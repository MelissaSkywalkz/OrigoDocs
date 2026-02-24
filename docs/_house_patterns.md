# House patterns – inventering från repo

Detta dokument sammanfattar **vad som faktiskt finns i OrigoDocs-koden** och används som källa för uppdaterade exempeltexter.

## 1) Navigering, layout och sidram
- Canonical sidram (sidenav + nav-search + nav-backdrop + topbar + `main.js`) finns i `pages/try-it.html`.
- Samma DOM-hookar ska finnas på docs-sidor:
  - `#sidenav`
  - `#navSearch`
  - `.nav-backdrop`
  - script `../assets/js/main.js`

## 2) Sök
- Klientsök initieras i `assets/js/main.js`.
- Relativ sökindex-URL hanteras beroende på sidnivå (`pages/` eller root).
- Byggsteg: `scripts/build-search-index.js` genererar `search/search-index.json`.

## 3) Try-it-lab
- Lab-mekaniken är data-driven via `data-tryit` och tool-moduler under `assets/js/tryit/`.
- Sidan `pages/try-it.html` innehåller canonical navigation + samtliga tool-kort.

## 4) Konfigurationsmönster som används i docs
Följande mönster är belagda i repo och återanvänds i uppdaterade JSON-exempel:
- Source-nycklar i plural (`sources`) och `layers`-lista med `type`, `source`, `group`.
- Både WMS, WFS och WMTS används i samma klientkonfig.
- Exempel på verkliga namn/endpointmönster som återkommer i dokumentationen:
  - `publik_wms`, `publik_wfs`, `publik_wmts`
  - `origo_search` (WFS)
  - `publik:wms_publik_lm_topowebb_nedtonad` (WMS)
  - `publik:lm_wms_fastighetsgrans_l` (WMTS)
  - `https://srv-origo01.kommun.skovde.se/geoserver/ows/`
  - `https://srv-origo01.kommun.skovde.se/geoserver/gwc/service/wmts`

## 5) Felsökningsmönster
Återkommande fel som dokumenteras och återfinns i uppdaterade sidor:
- `RULE=undefined` i legendflödet.
- `Schema does not exist` / `Unable to flush`.
- `Can't obtain the schema for the required layer`.

## 6) Begränsningar i belägg
- Repo:t innehåller docs-kod, inte hela produktionskonfigen (alla kartors fulla `index.json` saknas här).
- Exempel i docs bygger därför på mönster som kan beläggas i detta repo + anteckningar i uppdraget.
