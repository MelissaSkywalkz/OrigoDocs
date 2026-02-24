# Release-playbook

> Minimal migration från `pages/release-playbook.html` för preview-spåret.

## Snabb överblick

- Planera vad som ändras och vilka lager som påverkas.
- Verifiera data, styles och cache innan publicering.
- Testa lokalt i Origo och i GeoServer Preview.
- Dokumentera ändring och rollback-plan.
- Verifiera live med sanity-check.

## WMS-test

```bash
curl -I 'https://srv-origo01.kommun.skovde.se/geoserver/ows/?service=WMS&request=GetCapabilities'
```

## WMTS-test

```bash
curl -I 'https://srv-origo01.kommun.skovde.se/geoserver/gwc/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities'
```

## Legend / RULE-check

```bash
curl -G 'https://srv-origo01.kommun.skovde.se/geoserver/ows/' \
  --data-urlencode 'service=WMS' \
  --data-urlencode 'request=GetLegendGraphic' \
  --data-urlencode 'format=image/png' \
  --data-urlencode 'layer=publik:wms_publik_lm_topowebb_nedtonad'
```

## Cache / GWC-check

- Bekräfta om lager går via WMTS eller WMS.
- Kör seed/truncate vid behov.
- Verifiera att gamla tiles inte ligger kvar.

## Vanliga fel → snabbfix

- `RULE=undefined` → kontrollera Rule Name i SLD, skicka inte tom RULE.
- `Schema does not exist / Unable to flush` → kontrollera store/schema/behörighet.
- Seg karta → isolera lager och jämför WMS vs WMTS.

## Release sanity-check

- Start, Try it-lab och Felsökning laddar.
- Minst ett WMS-lager och ett WMTS-lager verifierat.
- Legend + GetFeatureInfo fungerar utan fel.

## Rollback-plan (mall)

1. Vad rullas tillbaka?
2. Hur görs rollback?
3. Hur verifieras återställning?
