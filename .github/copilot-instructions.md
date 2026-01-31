```instructions
# OrigoDocs — Copilot / AI Agent Instructions

This repository is a static documentation portal for Origo Map. The guidance below is focused, actionable, and specific so an AI coding agent or contributor can be productive while preserving repository quality.

Big picture
-----------
- Static HTML/CSS/JS site. Content lives in root HTML files and `pages/`.
- `assets/js/main.js` contains navigation, the offline search index (`OFFLINE_SEARCH_INDEX`) and UI helpers. `assets/css/main.css` contains shared styles.
- `pages/try-it.html` includes interactive tools; most tools are client‑side only. Some tools use OpenLayers (via CDN) for mapping previews.

Run locally
-----------
- Start any static server, for example:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

- Alternatively use VS Code Live Server (right‑click `index.html` → Open with Live Server).

Formatting
----------
- Use Prettier for formatting edits:

```bash
npm install
npm run format
```

Key rules and expectations
---------------------------
- Language: user‑facing UI text must be Swedish. Use English for internal identifiers, code comments and examples where appropriate.
- Defensive validation: tools must validate inputs and present errors to the user via the UI (use the shared `ValidationReport` pattern in `assets/js/tryit/ui-helpers.js`).
- No silent failures: avoid console‑only messages for expected user errors. Any action that can fail must return a visible report or status.
- Explicit assumptions: make CRS, axis order and extent assumptions explicit in constants or comments (e.g. EPSG:3006, EPSG:3008). If a claim cannot be locally verified, add `TODO: verifiera mot Origo-dokumentation`.
- Deterministic exports: exported snippets or files should avoid embedding non‑essential timestamps or machine‑specific data. If timestamps are required, document why.
- Accessibility: buttons must have explicit `type` attributes, interactive controls should include `aria-*` attributes as appropriate, and keyboard activation must be supported.
- Dependencies: do not add new runtime dependencies without explicit justification and a PR note. Prefer no‑build, client‑side implementations.
- Reuse utilities: prefer shared helpers and the `ValidationReport` rendering for consistent UX across tools.
- Professional correctness: prefer conservative, well‑documented changes over speculative fixes. When in doubt, open a short issue or add a `TODO` with reproduction steps.

Where to change things
## OrigoDocs — Copilot / AI‑agent instruktioner

Syfte
-----
- Ge korta, exakta instruktioner för AI‑assistenter och bidragsgivare så att ändringar blir korrekta, transparenta och underhållbara i ett professionellt GIS‑sammanhang.

Grundprinciper (kort)
----------------------
- Prioritera korrekthet, transparens och underhållbarhet.
- Undvik spekulativ GIS‑beteende eller outtalade antaganden.
- Validera alltid indata defensivt och visa fel via UI:t — inga konsol‑endast fel för förväntade användarfel.
- Alla transformationer ska vara förklarbara och, när möjligt, reversibla.
- Använd svenska för användargränssnitt och användardokumentation.
- Använd engelska för interna identifierare, felkoder och datastrukturer.
- Undvik globalt delat tillstånd och duplicerad logik.
- Föredra små, granskbara commits. Lägg inte till nya beroenden utan uttryckligt godkännande.
- Try‑it‑verktyg ska vara klient‑sidiga (inga serverside‑komponenter eller byggsteg utan godkännande).

Regler för kod och verktyg
--------------------------
- Struktur: `assets/js/tryit/tools/` — varje modul exporterar `init(block)` och interagerar med ett block: input → actions → output → `ValidationReport`.
- Validering: använd och återanvänd den delade `ValidationReport`‑mönstret i `assets/js/tryit/ui-helpers.js` för UI‑felrapporter.
- Antaganden: gör CRS, axis‑order och extent‑antaganden explicita i konstanta värden och inline‑kommentarer (t.ex. `EPSG:3006`). Om något inte kan verifieras lokalt: lägg till `TODO: verifiera mot Origo-dokumentation`.
- Transformationer: logga (i UI eller `ValidationReport`) vilka transformationer som applicerats och hur de kan backas/återställas; undvik tysta modifieringar av användardata.
- State: håll lokalt per‑verktyg‑state; undvik globals. Dela logik via hjälpfunktioner i `assets/js/tryit/`.

Konventioner för språk och identifierare
---------------------------------------
- UI och dokumentation: svenska.
- Felkoder, variabelnamn, funktioner, JSON‑fält och logg‑nycklar: engelska (t.ex. `error_invalid_bbox`).

Commit‑ och granskningspolicy
-----------------------------
- Små commits med tydlig titel och kropp. Visa kort varför en förändring är säker.
- Kommentera alla icke‑triviala GIS‑antaganden i koden och öppna en issue om verifiering krävs.

Beroenden och bygg
-------------------
- Får ej lägga till nya runtime‑beroenden utan ett explicit PR‑kommentar och godkännande från projektägare.
- Föredra no‑build klientkod; om ett byggsteg krävs, dokumentera varför och hur det körs lokalt.

Testning och QA
---------------
- Manuell verifiering krävs: starta en statisk server och testa alla berörda Try‑it‑verktyg.
- Använd `?dev=1` för inbyggda dev‑tester där sådana finns; dessa får inte ersätta manuell kontroll.
- Kontrollera mobilvy (~560px), tangentbordsåtkomst och `aria-*` attribut.

Godkännande och undantag
------------------------
- Förslag som bryter mot ovan (nya beroenden, serverside‑komponenter, stora API‑ändringar) kräver att förslaget dokumenteras i PR‑beskrivningen och godkänns av en projektägare.

Kontakt
-------
- Vid frågor: öppna en issue eller tagga en projektägare i PR‑konversationen.

---

Skriv alltid tydligt och koncist — tänk på att framtida granskare ska kunna förstå varför en ändring gjordes utan att köra koden.
