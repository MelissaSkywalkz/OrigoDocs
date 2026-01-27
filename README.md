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

## 🧭 Innehåll (urval)
- Introduktion till Origo Map
- JSON-konfiguration & layermanager
- GeoServer & GeoWebCache
- SLD-stilar
- Troubleshooting
- 🧪 **Try it-lab** (JSON builder, BBOX/extent m.m.)

---

## 🚀 Quick start (lokalt)
OrigoDocs är en statisk HTML-site och kräver ingen backend.

```bash
npm install
npm run format
python -m http.server 8000
```
Öppna sedan: http://localhost:8000
