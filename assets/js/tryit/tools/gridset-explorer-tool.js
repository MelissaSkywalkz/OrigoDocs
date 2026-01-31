/**
 * Gridset Explorer Tool Module
 * Interactive map-based gridset visualization (EPSG:3006)
 * Requires OpenLayers (ol from CDN)
 */
/**
 * Try‑it tool module: Gridset Explorer
 *
 * Purpose:
 * - Interactive exploration of tile grid definitions and generation of example snippets.
 *
 * Expected block structure in HTML: input → actions → output → report
 * Public interface:
 * - init(block)
 *
 * Conventions:
 * - Document CRS and tile size assumptions in `GRIDSET_CONFIG`.
 * - Surface errors and status updates via `ValidationReport` and `appState`.
 */
  let elements = {
    mapContainer: null,
    status: null,
    reportEl: null,
    logEl: null,
    extentSpan: null,
    bboxSpan: null,
    zoomSpan: null,
    tilesSpan: null,
    snippetTemplate: null,
    snippetOutput: null,
  };

  // Antagande: förinställda extents och resolutioner är förenklade exempel.
  // Justera dessa värden för din faktiska CRS/extent-konfiguration.
  const GRIDSET_CONFIG = {
    crs: 'EPSG:3006',
    presets: {
      sverige: { minx: 0, miny: 5500000, maxx: 1500000, maxy: 8000000 },
      skaraborg: { minx: 300000, miny: 6400000, maxx: 550000, maxy: 6650000 },
    },
    tileSize: 256,
    resolutions: [100, 50, 25, 12.5, 6.25],
  };

  let state = {
    map: null,
    currentExtent: null,
    presets: GRIDSET_CONFIG.presets,
    tileSize: GRIDSET_CONFIG.tileSize,
    resolutions: GRIDSET_CONFIG.resolutions,
  };

  function init(block) {
    if (!block || !window.ol) {
      console.error('Gridset Explorer: OpenLayers not available');
      return false;
    }

    elements.mapContainer = block.querySelector('#gridset-map');
    elements.status = block.querySelector('.gridset-note');
    elements.reportEl = block.querySelector('#gridset-validation');
    elements.logEl = block.querySelector('#gridset-runlog');
    elements.extentSpan = block.querySelector('#gridset-info-extent');
    elements.bboxSpan = block.querySelector('#gridset-info-bbox');
    elements.zoomSpan = block.querySelector('#gridset-info-zoom');
    elements.tilesSpan = block.querySelector('#gridset-info-tiles');
    elements.snippetTemplate = block.querySelector('#gridset-snippet-template');
    elements.snippetOutput = block.querySelector('#gridset-output');

    if (!elements.mapContainer) {
      console.error('Gridset Explorer: Missing map container');
      return false;
    }

    initializeMap();
    attachEventListeners(block);

    appState.addLog(TOOL_KEY, 'INFO', 'Gridset Explorer initierat');
    updateUI();

    return true;
  }

  function initializeMap() {
    const ol = window.ol;
    const olExtent = ol.extent;
    const projection = new ol.proj.Projection({
      code: GRIDSET_CONFIG.crs,
      extent: [0, 5500000, 1500000, 8000000],
    });
    ol.proj.addProjection(projection);

    state.map = new ol.Map({
      target: elements.mapContainer,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous',
          }),
        }),
      ],
      view: new ol.View({
        projection: projection,
        center: [750000, 6750000],
        zoom: 5,
      }),
    });

    appState.addLog(TOOL_KEY, 'OK', `Karta initierad (${GRIDSET_CONFIG.crs})`);
  }

  function attachEventListeners(block) {
    block.querySelectorAll('[data-extent-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.extentAction;
        if (state.presets[preset]) {
          zoomToPreset(state.presets[preset]);
        }
      });
    });

    block.querySelectorAll('[data-gridset-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleAction(btn.dataset.gridsetAction);
      });
    });

    if (elements.snippetTemplate) {
      elements.snippetTemplate.addEventListener('change', () => {
        updateSnippet();
      });
    }
  }

  function handleAction(action) {
    switch (action) {
      case 'copy-bbox':
        copyBbox();
        break;
      case 'send-to-urlbuilder':
        sendToUrlbuilder();
        break;
      case 'export-geojson':
        exportGeojson();
        break;
      case 'export-txt':
        exportTxt();
        break;
      case 'copy-gridset':
        copyGridset();
        break;
      case 'copy-snippet':
        copySnippet();
        break;
      case 'download-snippet':
        downloadSnippet();
        break;
      case 'send-to-gridcalc':
        sendToGridcalc();
        break;
    }
  }

  function zoomToPreset(preset) {
    if (!state.map) return;

    const view = state.map.getView();
    const extent = [preset.minx, preset.miny, preset.maxx, preset.maxy];

    view.fit(extent, { duration: 500 });
    state.currentExtent = preset;

    updateInfo();
    appState.addLog(TOOL_KEY, 'OK', `Zoomad till preset`);
    updateUI();
  }

  function updateInfo() {
    if (!state.currentExtent) return;

    const ext = state.currentExtent;
    const width = ext.maxx - ext.minx;
    const height = ext.maxy - ext.miny;

    if (elements.extentSpan) {
      elements.extentSpan.textContent = `[${ext.minx}, ${ext.miny}, ${ext.maxx}, ${ext.maxy}]`;
    }

    if (elements.bboxSpan) {
      elements.bboxSpan.textContent = `${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`;
    }

    // Estimate tiles at 256px/tile
    const tileSize = state.tileSize;
    // Antagande: första resolutionen används för grov tile-estimat.
    const resolution = state.resolutions[0];
    const tileSpan = resolution * tileSize;
    const tilesX = Math.ceil(width / tileSpan);
    const tilesY = Math.ceil(height / tileSpan);
    const totalTiles = tilesX * tilesY;

    if (elements.tilesSpan) {
      elements.tilesSpan.textContent = formatNumber(totalTiles);
    }

    const report = createValidationReport(true);
    report.meta.extent = [ext.minx, ext.miny, ext.maxx, ext.maxy];
    report.meta.width = width;
    report.meta.height = height;
    report.meta.tiles = formatNumber(totalTiles);
    report.meta.resolution = resolution;
    report.meta.tileSize = tileSize;
    report.meta.resolutions = state.resolutions;

    appState.setReport(TOOL_KEY, report);

    updateSnippet();
  }

  function validateSnippetData() {
    const report = createValidationReport(true);

    if (!state.currentExtent) {
      addReportError(report, 'GRIDSET_NO_EXTENT', 'Ingen extent vald');
    }

    if (!state.resolutions || state.resolutions.length === 0) {
      addReportError(report, 'GRIDSET_NO_RESOLUTIONS', 'Resolutioner saknas');
    }

    if (!Number.isFinite(state.tileSize) || state.tileSize <= 0) {
      addReportError(report, 'GRIDSET_INVALID_TILESIZE', 'Tile size måste vara > 0');
    }

    return report;
  }

  function getSnippetTemplate() {
    return elements.snippetTemplate?.value || 'plain';
  }

  function buildSnippet(templateKey) {
    const report = validateSnippetData();
    if (!report.ok) {
      return { ok: false, report, content: 'Kan inte skapa snippet: data saknas.' };
    }

    const ext = state.currentExtent;
    const extent = [ext.minx, ext.miny, ext.maxx, ext.maxy];
    const crs = GRIDSET_CONFIG.crs;
    const tileSize = state.tileSize;
    const resolutions = state.resolutions;

    if (templateKey === 'gwc') {
      const xml = [
        '<gridSet>',
        `  <name>${crs}</name>`,
        `  <srs><number>3006</number></srs>`,
        `  <extent>`,
        `    <coords>`,
        `      <double>${extent[0]}</double>`,
        `      <double>${extent[1]}</double>`,
        `      <double>${extent[2]}</double>`,
        `      <double>${extent[3]}</double>`,
        `    </coords>`,
        `  </extent>`,
        `  <tileWidth>${tileSize}</tileWidth>`,
        `  <tileHeight>${tileSize}</tileHeight>`,
        `  <resolutions>`,
        ...resolutions.map((r) => `    <resolution>${r}</resolution>`),
        `  </resolutions>`,
        '</gridSet>',
      ].join('\n');
      return { ok: true, report, content: xml };
    }

    if (templateKey === 'origo') {
      const obj = {
        crs,
        extent,
        tileSize,
        resolutions,
      };
      return { ok: true, report, content: JSON.stringify(obj, null, 2) };
    }

    const summary = [
      'Gridset-snippet',
      `CRS: ${crs}`,
      `Utsträckning: ${extent.join(', ')}`,
      `Tile-storlek: ${tileSize}px`,
      `Resolutioner: ${resolutions.join(', ')}`,
    ].join('\n');
    return { ok: true, report, content: summary };
  }

  function updateSnippet() {
    if (!elements.snippetOutput) return;
    const templateKey = getSnippetTemplate();
    const snippet = buildSnippet(templateKey);

    elements.snippetOutput.textContent = snippet.content;

    if (!snippet.ok) {
      setStatus('Snippet kunde inte skapas', 'WARN');
      appState.setReport(TOOL_KEY, snippet.report);
      updateUI();
    }
  }

  function setStatus(message, level = 'INFO') {
    if (elements.status) elements.status.textContent = message;
    if (message) appState.addLog(TOOL_KEY, level, message);
  }

  async function copyBbox() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const bbox = `${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`;

    const result = await copyToClipboard(bbox);
    if (result.ok) {
      setStatus('BBOX kopierad', 'OK');
    } else {
      setStatus('Kopieringen misslyckades', 'ERROR');
    }

    updateUI();
  }

  function sendToUrlbuilder() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const bbox = `${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`;
    const bboxInput = document.getElementById('urlbuilder-bbox');

    if (bboxInput) {
      bboxInput.value = bbox;
      scrollIntoView(document.getElementById('urlbuilder-base'));
      setStatus('Skickad till URL builder', 'OK');
    }

    updateUI();
  }

  function exportGeojson() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const geojson = {
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'EPSG:3006' } },
      features: [
        {
          type: 'Feature',
          properties: { name: 'Gridset Extent' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [ext.minx, ext.miny],
                [ext.maxx, ext.miny],
                [ext.maxx, ext.maxy],
                [ext.minx, ext.maxy],
                [ext.minx, ext.miny],
              ],
            ],
          },
        },
      ],
    };

    const filename = `gridset-${formatTimestamp()}.geojson`;
    const result = exportFile({
      filename,
      mime: 'application/json',
      content: JSON.stringify(geojson, null, 2),
    });
    setStatus(result.message, 'OK');
    updateUI();
  }

  function exportTxt() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const content = [
      '═══ GRIDSET EXTENT ═══',
      `CRS: ${GRIDSET_CONFIG.crs}`,
      '',
      `Utsträckning: [${ext.minx}, ${ext.miny}, ${ext.maxx}, ${ext.maxy}]`,
      `BBOX: ${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`,
      `Bredd: ${ext.maxx - ext.minx} m`,
      `Höjd: ${ext.maxy - ext.miny} m`,
    ].join('\n');

    const filename = `gridset-${formatTimestamp()}.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    setStatus(result.message, 'OK');
    updateUI();
  }

  async function copyGridset() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const snippet = `<extent>[${ext.minx}, ${ext.miny}, ${ext.maxx}, ${ext.maxy}]</extent>`;

    const result = await copyToClipboard(snippet);
    if (result.ok) {
      setStatus('Gridset-snippet kopierad', 'OK');
    } else {
      setStatus('Kopieringen misslyckades', 'ERROR');
    }
    updateUI();
  }

  async function copySnippet() {
    const templateKey = getSnippetTemplate();
    const snippet = buildSnippet(templateKey);

    if (!snippet.ok) {
      setStatus('Snippet saknas', 'WARN');
      appState.setReport(TOOL_KEY, snippet.report);
      updateUI();
      return;
    }

    const result = await copyToClipboard(snippet.content || '');
    if (result.ok) {
      setStatus('Snippet kopierad', 'OK');
    } else {
      setStatus('Kopieringen misslyckades', 'ERROR');
    }
    updateUI();
  }

  function downloadSnippet() {
    const templateKey = getSnippetTemplate();
    const snippet = buildSnippet(templateKey);

    if (!snippet.ok) {
      setStatus('Snippet saknas', 'WARN');
      appState.setReport(TOOL_KEY, snippet.report);
      updateUI();
      return;
    }

    let extension = 'txt';
    let mime = 'text/plain';
    if (templateKey === 'origo') {
      extension = 'json';
      mime = 'application/json';
    } else if (templateKey === 'gwc') {
      extension = 'xml';
      mime = 'application/xml';
    }

    const filename = `gridset-${formatTimestamp()}.${extension}`;
    const result = exportFile({ filename, mime, content: snippet.content || '' });
    setStatus(result.message, 'OK');
    updateUI();
  }

  function sendToGridcalc() {
    if (!state.currentExtent) {
      setStatus('Välj en extent först', 'WARN');
      updateUI();
      return;
    }

    const ext = state.currentExtent;
    const width = Math.abs(ext.maxx - ext.minx);
    const height = Math.abs(ext.maxy - ext.miny);

    const widthInput = document.getElementById('gridcalc-bboxwidth');
    const heightInput = document.getElementById('gridcalc-bboxheight');

    if (widthInput && heightInput) {
      widthInput.value = Math.round(width);
      heightInput.value = Math.round(height);
      scrollIntoView(document.getElementById('gridcalc'));
      setStatus('Skickad till Gridcalc', 'OK');
    }

    updateUI();
  }

  function updateUI() {
    if (elements.reportEl) {
      renderReport(elements.reportEl, appState.getReport(TOOL_KEY));
    }
    if (elements.logEl) {
      renderRunLog(elements.logEl, appState.getLogs(TOOL_KEY));
    }
  }

  return { init, getState: () => state };
})();
