# Origo Map – intern lathund (GitHub Pages)

Det här repot är en statisk dokumentationsportal för Origo Map och relaterat arbete. Syftet är att ge teamet en snabb, tydlig och kopierbar “lathund” för JSON, Origo-konfigurationer, Layermanager, GeoServer-stilar, recept och npm-flöden.

> **Viktigt:** Om Origo-specifika detaljer inte kan verifieras lokalt ska de markeras med `TODO: verifiera mot Origo-dokumentation`.
> TODO: ladda ner Skarakartan-konfigen och lägg under `/examples/skarakartan.json` för verifiering.

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
- `origo.html` – Origo snabbstart (med TODO där detaljer saknas).
- `origo-advanced.html` – Origo avancerat (init/konfig och lager).
- `layermanager.html` – Layermanager-plugin och konfig-exempel.
- `geoserver.html` – GeoServer 101 + GIS-grunder.
- `geoserver-styles.html` – GeoServer-stilar (SLD/CSS/MBStyle).
- `geowebcache.html` – GeoWebCache (tile-cache).
- `git-vscode.html` – Git & VS Code (rookie-vänlig guide).
- `examples-origo-geoserver.html` – copy/paste-exempel.
- `faq-gis.html` – FAQ för GIS-nybörjare.
- `recipes.html` – Origo recept.
- `npm.html` – npm & plugins.
- `troubleshooting.html` – felsökning.
- `main.css` – gemensam styling.
- `main.js` – navigation + accordion.

## Test & verifiering (manuellt)

- Starta lokalt: `python -m http.server 8000`.
- Klicka igenom navigationen och öppna Snabblänkar.
- Kontrollera mobilbrytpunkter visuellt.

> TODO: Automatiserade UI-tester (Playwright) kraschar i nuvarande miljö. Återbesök när miljön stödjer browser-körning.
