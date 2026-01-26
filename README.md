# Origo Map – intern lathund (GitHub Pages)

Det här repot är en statisk dokumentationsportal för Origo Map och relaterat arbete. Syftet är att ge teamet en snabb, tydlig och kopierbar “lathund” för JSON, Origo-konfigurationer, Layermanager, GeoServer-stilar, recept och npm-flöden.

> **Viktigt:** Om Origo-specifika detaljer inte kan verifieras lokalt ska de markeras med `TODO: verifiera mot Origo-dokumentation`.

Kort sagt: GeoServer publicerar data (WMS/WFS), Origo hämtar och visar den i kartan. Layermanager hjälper användare att hitta/lägga till lager. GeoServer-stilar (SLD/CSS/MBStyle) påverkar hur lagren ser ut i Origo. Datakällorna kan vara PostGIS eller filer som GeoPackage/Shapefile.
GeoWebCache står för tile-cache och påverkar prestanda och när gamla tiles kan ligga kvar.

## Utveckla lokalt

Du kan köra sajten lokalt med valfri statisk server, t.ex.:

```bash
# Python (standard)
python -m http.server 8000

# VS Code Live Server
# Högerklicka på index.html -> "Open with Live Server"
```

Öppna sedan `http://localhost:8000` i webbläsaren.

## Lägga till nya sidor/sektioner

1. Skapa en ny HTML-sida (t.ex. `nytt-amne.html`).
2. Kopiera sidostrukturen från en befintlig docs-sida för att få sidomeny + toppnavigering.
3. Lägg till länken i sidomenyn på samtliga sidor.
4. Om du lägger till nya komponenter, uppdatera `main.css` och följ befintliga klassnamn.

## Struktur (översikt)

- `index.html` – portal/startsida.
- `page.html` – JSON 101.
- `origo-guide.html` – Origo guide (snabbstart, lager, controls och prestanda).
- `layermanager.html` – Layermanager-plugin och konfig-exempel.
- `geoserver.html` – GeoServer 101 + GIS-grunder.
- `geoserver-styles.html` – GeoServer-stilar (SLD/CSS/MBStyle).
- `geowebcache.html` – GeoWebCache (tile-cache).
- `origo-server.html` – Origo Server (backend‑stöd).
- `git-vscode.html` – Git & VS Code (rookie-vänlig guide).
- `examples.html` – Origo-recept (copy/paste-exempel).
- `faq-gis.html` – FAQ för GIS-nybörjare.
- `npm.html` – npm & plugins.
- `release-playbook.html` – release‑checklista för drift.
- `troubleshooting.html` – felsökning.
- `main.css` – gemensam styling.
- `main.js` – navigation + accordion.
- `search-index.json` – sökindex för sidomenyn.

## Källor för verifiering

- https://origo-map.github.io/origo-documentation/latest/
- https://origo-map.github.io/workshop/
- https://github.com/origo-map/origo-documentation
- https://github.com/origo-map/origo
- https://github.com/origo-map/origo-server
- https://docs.geoserver.org/latest/en/user/geowebcache/index.html
- https://docs.geoserver.org/latest/en/user/geowebcache/troubleshooting.html#grid-misalignment

## Test & verifiering (manuellt)

- Starta lokalt: `python -m http.server 8000`.
- Klicka igenom navigationen och öppna Snabblänkar.
- Kontrollera mobilbrytpunkter visuellt.

## Bidra

1. Installera verktyg:
   - `npm install`
2. Formatera filer:
   - `npm run format`
3. Kör kontroller:
   - `npm run check`

**Viktigt:** Glossary-funktionen är borttagen och ska inte återinföras.

## TODO

- Lägg en anonymiserad exempelkonfig i `/examples/` för verifiering av våra mallar.
