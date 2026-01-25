# Origo Map – intern lathund (GitHub Pages)

Det här repot är en statisk dokumentationsportal för Origo Map och relaterat arbete. Syftet är att ge teamet en snabb, tydlig och kopierbar “lathund” för JSON, Origo-konfigurationer, GeoServer-grunder, recept och npm-flöden.

> **Viktigt:** Om Origo-specifika detaljer inte kan verifieras lokalt ska de markeras med `TODO: verifiera mot Origo-dokumentation`.

Kort sagt: GeoServer publicerar data (WMS/WFS), Origo hämtar och visar den i kartan. Datakällorna kan vara PostGIS eller filer som GeoPackage/Shapefile.

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
- `origo.html` – Origo snabbstart (med TODO där detaljer saknas).
- `geoserver.html` – GeoServer 101 + GIS-grunder.
- `recipes.html` – Origo recept.
- `npm.html` – npm & plugins.
- `troubleshooting.html` – felsökning.
- `main.css` – gemensam styling.
- `main.js` – navigation + accordion.
