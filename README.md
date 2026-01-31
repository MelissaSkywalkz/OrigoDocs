# OrigoDocs

OrigoDocs är en statisk dokumentationsportal för Origo Map med praktiska exempel, felsökningsguider och interaktiva "Try‑it"‑verktyg.

Live (publicerat via GitHub Pages): https://melissaskywalkz.github.io/OrigoDocs/

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)
![Static](https://img.shields.io/badge/site-static-blue)
![Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4)

## Syfte

OrigoDocs riktar sig till utvecklare, GIS‑integratörer och tekniska förvaltare som använder Origo Map och närliggande komponenter (GeoServer, GeoWebCache). Mål: snabba, praktiska exempel, konfigurationssnuttar och små interaktiva verktyg för felsökning och verifiering.

## Try‑it‑verktygen (kortfattat)

- JSON — Validering och enkel metadata‑/BBOX‑extraktion för GeoJSON/Origo JSON.
- URL builder — Bygg WMS/WFS Get‑requests, generera `curl` och textsnippets.
- BBOX / Extent — Parsning, normalisering och validering av bounding boxes (stöder EPSG:3006 och EPSG:3008 i gränssnittet).
- Resolutions — Verktyg för att lista/felsöka tile/resolution‑listor och skala⇄resolution‑omvandlingar.
- Gridcalc — Kalkylator för tilecounts, cache‑estimat och konverteringar (resolution/scale/tilecount).
- Gridset Explorer — Interaktiv gridset‑utforskare (projektioner och tile‑grid, primärt EPSG:3006). Markerad som experimentell i vissa fall; kontrollera stabilitetsnoteringen nedan.
- SLD — Enkel SLD‑validering och snabpreview/förslag på enkla korrigeringar.
- Map sandbox — Enkel OpenLayers‑preview för WMS/WMTS/XYZ‑källor (kan påverkas av CORS och externa servers begränsningar).

## Drift och begränsningar

- Alla verktyg körs helt i webbläsaren (client‑side); inga backend‑tjänster används.
- CRS‑antaganden: verktygen utgår primärt från EPSG:3006 (SWEREF 99 TM) och stödjer även EPSG:3008 där det uttryckligen anges. Axis‑order och server‑specifika beteenden kan variera; se kommentarer i koden för varje verktyg.
- Known limitations:
  - Förhandsvisning i `Map sandbox` kan misslyckas på grund av CORS, server‑svar eller HTTPS‑restriktioner från externa WMS/WMTS‑leverantörer.
  - Vissa avancerade gridset‑operationer och konverteringar kan vara experimentella; verifiera alltid mot din GeoServer/GeoWebCache‑konfiguration.

## Lokalt arbete

1. Starta en lokal statisk server (exempel):

```bash
python -m http.server 8000
# öppna: http://localhost:8000
```

2. Alternativt: använd VS Code Live Server (högerklicka `index.html` → Open with Live Server).

3. Kodformattering:

```bash
npm install
npm run format
```

## Verifikation före commit / PR

- Starta lokal server och kontrollera navigering och sökfunktion.
- Testa varje Try‑it‑verktyg du ändrat; använd `?dev=1` för utvecklarhjälp (debug‑selftests finns i `try-it.html`).
- Kontrollera mobil vy (~560px breakpoint).
- Se till att exporterade filer är deterministiska (inga okontrollerade tidsstämplar).

## Stabilitet och status

- De flesta verktyg är stabila för grundläggande verifiering och felsökning.
- Gridset Explorer och Map sandbox innehåller funktioner som kan kräva vidare validering mot specifika serversättningar och markeras därför som delvis experimentella — kontrollera kommentarer i koden och kör lokala tester.

## Mer information

Se `pages/try-it.html` för det användargränssnitt som innehåller alla verktyg. För utvecklarespecifika instruktioner och kodkonventioner, se `.github/copilot-instructions.md` och `CONTRIBUTING.md`.
