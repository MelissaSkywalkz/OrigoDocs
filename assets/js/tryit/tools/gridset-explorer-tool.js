/**
 * Gridset Explorer Tool Module
 * Interactive map-based gridset visualization (EPSG:3006)
 * Requires OpenLayers (ol from CDN)
 */

const gridsetExplorerTool = (() => {
  const TOOL_KEY = 'gridset';

  let elements = {
    mapContainer: null,
    status: null,
    reportEl: null,
    logEl: null,
    extentSpan: null,
    bboxSpan: null,
    zoomSpan: null,
    tilesSpan: null,
  };

  let state = {
    map: null,
    currentExtent: null,
    presets: {
      sverige: { minx: 0, miny: 5500000, maxx: 1500000, maxy: 8000000 },
      skaraborg: { minx: 300000, miny: 6400000, maxx: 550000, maxy: 6650000 },
    },
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
      code: 'EPSG:3006',
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

    appState.addLog(TOOL_KEY, 'OK', 'Karta initierad (EPSG:3006)');
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
    const tileSize = 256;
    const resolution = 100; // placeholder
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

    appState.setReport(TOOL_KEY, report);
  }

  async function copyBbox() {
    if (!state.currentExtent) {
      return;
    }

    const ext = state.currentExtent;
    const bbox = `${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`;

    if (await copyToClipboard(bbox)) {
      appState.addLog(TOOL_KEY, 'OK', 'BBOX kopierad');
    } else {
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }

    updateUI();
  }

  function sendToUrlbuilder() {
    if (!state.currentExtent) return;

    const ext = state.currentExtent;
    const bbox = `${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`;
    const bboxInput = document.getElementById('urlbuilder-bbox');

    if (bboxInput) {
      bboxInput.value = bbox;
      scrollIntoView(document.getElementById('urlbuilder-base'));
      appState.addLog(TOOL_KEY, 'OK', 'Skickad till URL builder');
    }

    updateUI();
  }

  function exportGeojson() {
    if (!state.currentExtent) return;

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

    downloadFile(
      `gridset-${Date.now()}.geojson`,
      JSON.stringify(geojson, null, 2),
      'application/json',
    );
    appState.addLog(TOOL_KEY, 'OK', 'GeoJSON exporterad');
    updateUI();
  }

  function exportTxt() {
    if (!state.currentExtent) return;

    const ext = state.currentExtent;
    const content = [
      '═══ GRIDSET EXTENT ═══',
      `Generated: ${new Date().toLocaleString('sv-SE')}`,
      `CRS: EPSG:3006`,
      '',
      `Extent: [${ext.minx}, ${ext.miny}, ${ext.maxx}, ${ext.maxy}]`,
      `BBOX: ${ext.minx},${ext.miny},${ext.maxx},${ext.maxy}`,
      `Width: ${ext.maxx - ext.minx} m`,
      `Height: ${ext.maxy - ext.miny} m`,
    ].join('\n');

    downloadFile(`gridset-${Date.now()}.txt`, content, 'text/plain');
    appState.addLog(TOOL_KEY, 'OK', 'TXT exporterad');
    updateUI();
  }

  function copyGridset() {
    if (!state.currentExtent) return;

    const ext = state.currentExtent;
    const snippet = `<extent>[${ext.minx}, ${ext.miny}, ${ext.maxx}, ${ext.maxy}]</extent>`;

    copyToClipboard(snippet);
    appState.addLog(TOOL_KEY, 'OK', 'Gridset-snippet kopierad');
    updateUI();
  }

  function sendToGridcalc() {
    if (!state.currentExtent) return;

    const ext = state.currentExtent;
    const width = Math.abs(ext.maxx - ext.minx);
    const height = Math.abs(ext.maxy - ext.miny);

    const widthInput = document.getElementById('gridcalc-bboxwidth');
    const heightInput = document.getElementById('gridcalc-bboxheight');

    if (widthInput && heightInput) {
      widthInput.value = Math.round(width);
      heightInput.value = Math.round(height);
      scrollIntoView(document.getElementById('gridcalc'));
      appState.addLog(TOOL_KEY, 'OK', 'Skickad till Gridcalc');
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
