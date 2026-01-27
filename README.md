# OrigoDocs

📘 **Intern dokumentationsportal för Origo Map**  
En statisk docs-site med praktiska exempel, felsökning och “Try it”-verktyg för arbete med GIS, GeoServer och Origo Map.

🌍 **Live docs:**  
👉 https://melissaskywalkz.github.io/OrigoDocs/

📖 **Projekt Wiki:**  
👉 https://github.com/MelissaSkywalkz/OrigoDocs/wiki

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)
![Static](https://img.shields.io/badge/site-static-blue)
![Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4)

---

## 🎯 Syfte
OrigoDocs är till för utvecklare, GIS-ingenjörer och tekniska förvaltare som jobbar med **Origo Map**.  
Fokus ligger på:

- Snabba **copy/paste-exempel**
- Praktiska **konfigurationer** (JSON, lager, SLD)
- **Felsökning** som faktiskt funkar i vardagen
- Små **Try it-verktyg** för att testa och förstå

Detta är inte en teoretisk manual utan en **arbetsyta**.

---

## 🧭 Innehål & sidor

**Huvuddokumentation:**
- **Origo guide** – grundläggande konfiguration, lager, WMS/WFS/WMTS
- **JSON 101** – Origo JSON-format med valideringsverktyg
- **Layermanager** – så fungerar lag-hiearkier
- **GeoServer 101** – servering av data, WMS/WFS, CRS
- **GeoServer styles** – SLD-format, styling, renderingskontroll
- **GeoWebCache** – tile-caching, resolutions, gridsets
- **Felsökning** – systematisk felsökning med symptom → orsak → nästa steg
- **Try it-lab** – interaktiva verktyg
- **Git & VS Code** – versionshantering för kollegor
- **Origo-recept** – copy/paste-exempel

**Try it-lab verktyg:**
- JSON-validering & builder
- BBOX/Extent explorer (EPSG:3008, EPSG:3006)
- Resolutions & Gridcalc
- SLD-validering & preview
- Map sandbox (OpenLayers-preview)
- Gridset Explorer (3006)

---

## 🚀 Utveckling lokalt

OrigoDocs är en statisk HTML-site och kräver ingen backend.

**Live Server (VS Code):**
```
Högerklicka på index.html → Open with Live Server
```

**Python HTTP Server:**
```bash
python -m http.server 8000
Öppna: http://localhost:8000
```

**Kodformatering (Prettier):**
```bash
npm install
npm run format
```

---

## 📦 Publicering (GitHub Pages)

Sajten publiceras automatiskt från `main`-branch till:  
👉 https://melissaskywalkz.github.io/OrigoDocs/

**Lokala ändringar verifieras via:**
1. Lokal server (se ovan)
2. Kolla mobile-viewport (~560px)
3. Verifiera interna länkar & navigering
4. Testa Try it-lab verktyg
