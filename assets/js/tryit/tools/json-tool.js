/**
 * JSON Tool Module
 *
 * Handles: JSON validation, formatting, GeoJSON detection, BBOX extraction, exports
 *
 * Interface:
 * - init(containerElement)
 * - Hooks into AppState for logging and validation reports
 */

const jsonTool = (() => {
  const TOOL_KEY = 'json';

  let elements = {
    input: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
    metaEl: null,
  };

  let state = {
    lastValidJson: null,
    lastBbox: null,
  };

  /**
   * Initialize tool with container element
   * @param {HTMLElement} block - Container element
   */
  function init(block) {
    if (!block) return false;

    // Query elements
    elements.input = block.querySelector('#json-tryit-input');
    elements.output = block.querySelector('#json-tryit-output');
    elements.status = block.querySelector('#json-tryit-status');
    elements.reportEl = block.querySelector('#json-validation');
    elements.logEl = block.querySelector('#json-runlog');
    elements.metaEl = block.querySelector('#json-meta');

    // Validate required elements exist
    if (!elements.input || !elements.output || !elements.status) {
      console.error('JSON Tool: Missing required DOM elements');
      return false;
    }

    // Attach event listeners
    attachEventListeners(block);

    // Log initialization
    appState.addLog(TOOL_KEY, 'INFO', 'JSON-verktyg initierat');
    updateUI();

    return true;
  }

  function attachEventListeners(block) {
    const buttons = block.querySelectorAll('[data-json-action]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.jsonAction;
        handleAction(action);
      });
    });
  }

  function handleAction(action) {
    switch (action) {
      case 'validate':
        actionValidate();
        break;
      case 'prettify':
        actionPrettify();
        break;
      case 'minify':
        actionMinify();
        break;
      case 'copy':
        actionCopy();
        break;
      case 'clear':
        actionClear();
        break;
      case 'export-json':
        actionExportJson();
        break;
      case 'export-bbox-txt':
        actionExportBboxTxt();
        break;
      case 'export-bbox-geojson':
        actionExportBboxGeojson();
        break;
      case 'send-to-bbox':
        actionSendToBbox();
        break;
      case 'send-to-urlbuilder':
        actionSendToUrlbuilder();
        break;
      default:
        break;
    }
  }

  function parseJson() {
    const text = elements.input.value.trim();

    if (!text) {
      return {
        valid: false,
        data: null,
        error: 'JSON tomt',
      };
    }

    try {
      const data = JSON.parse(text);
      return {
        valid: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        valid: false,
        data: null,
        error: error.message,
      };
    }
  }

  function detectGeoJSON(data) {
    if (!data || typeof data !== 'object') return false;

    if (data.type === 'FeatureCollection' || data.type === 'Feature') {
      return true;
    }

    if (
      data.type === 'Point' ||
      data.type === 'LineString' ||
      data.type === 'Polygon' ||
      data.type === 'MultiPoint' ||
      data.type === 'MultiLineString' ||
      data.type === 'MultiPolygon' ||
      data.type === 'GeometryCollection'
    ) {
      return true;
    }

    return false;
  }

  function extractBbox(data) {
    if (!data || typeof data !== 'object') return null;

    let allCoords = [];

    const collectCoords = (obj) => {
      if (Array.isArray(obj)) {
        if (obj.length === 2 && typeof obj[0] === 'number' && typeof obj[1] === 'number') {
          // This is a coordinate [lng, lat]
          allCoords.push(obj);
        } else {
          obj.forEach(collectCoords);
        }
      } else if (obj && typeof obj === 'object') {
        Object.values(obj).forEach((val) => collectCoords(val));
      }
    };

    collectCoords(data);

    if (allCoords.length === 0) return null;

    const lngs = allCoords.map((c) => c[0]);
    const lats = allCoords.map((c) => c[1]);

    return {
      minx: Math.min(...lngs),
      miny: Math.min(...lats),
      maxx: Math.max(...lngs),
      maxy: Math.max(...lats),
    };
  }

  function generateMetadata(data, bbox, isGeojson) {
    const lines = [];

    lines.push('Metadata:');
    lines.push('');

    if (isGeojson) {
      lines.push('Type: GeoJSON');
      if (data.type) lines.push(`GeoJSON Type: ${data.type}`);

      if (data.features) {
        lines.push(`Features: ${data.features.length}`);
        if (data.features.length > 0) {
          const props = Object.keys(data.features[0].properties || {});
          lines.push(`Properties: ${props.join(', ')}`);
        }
      }

      if (bbox) {
        lines.push('');
        lines.push(`BBOX [minx, miny, maxx, maxy]:`);
        lines.push(`${bbox.minx}, ${bbox.miny}, ${bbox.maxx}, ${bbox.maxy}`);
        lines.push('');
        lines.push(`Width:  ${(bbox.maxx - bbox.minx).toFixed(2)}`);
        lines.push(`Height: ${(bbox.maxy - bbox.miny).toFixed(2)}`);
      }
    } else {
      lines.push('Type: JSON');

      if (Array.isArray(data)) {
        lines.push(`Array length: ${data.length}`);
      } else {
        const keys = Object.keys(data);
        lines.push(`Top-level keys: ${keys.length}`);
        if (keys.length <= 10) {
          keys.forEach((k) => lines.push(`  - ${k}`));
        }
      }
    }

    return lines.join('\n');
  }

  function generateValidationReport(parseResult, bbox, isGeojson) {
    const report = createValidationReport();

    if (!parseResult.valid) {
      addReportError(report, 'JSON_PARSE_ERROR', `JSON-parsefel: ${parseResult.error}`);
      return report;
    }

    // Validation passed
    report.ok = true;

    // Add metadata
    report.meta.format = isGeojson ? 'GeoJSON' : 'JSON';
    if (isGeojson && parseResult.data.features) {
      report.meta.featureCount = parseResult.data.features.length;
    }

    // Check for GeoJSON coordinate order warnings
    if (isGeojson && bbox) {
      const { miny, maxy } = bbox;
      if (Math.abs(miny) > 90 || Math.abs(maxy) > 90) {
        addReportWarning(
          report,
          'GEOJSON_COORD_ORDER',
          'Koordinater verkar vara omvända (lat/lon istället för lon/lat)',
        );
      }

      // Add BBOX info to metadata
      report.meta.bbox = {
        minx: bbox.minx.toFixed(6),
        miny: bbox.miny.toFixed(6),
        maxx: bbox.maxx.toFixed(6),
        maxy: bbox.maxy.toFixed(6),
        width: (bbox.maxx - bbox.minx).toFixed(2),
        height: (bbox.maxy - bbox.miny).toFixed(2),
      };
    }

    return report;
  }

  function actionValidate() {
    const parseResult = parseJson();

    if (!parseResult.valid) {
      updateStatus(`Parse-fel: ${parseResult.error}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Parse-fel: ${parseResult.error}`);
      renderOutput(parseResult.error);
      const report = generateValidationReport(parseResult, null, false);
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    const isGeojson = detectGeoJSON(parseResult.data);
    const bbox = isGeojson ? extractBbox(parseResult.data) : null;

    state.lastValidJson = parseResult.data;
    state.lastBbox = bbox;

    const report = generateValidationReport(parseResult, bbox, isGeojson);
    appState.setReport(TOOL_KEY, report);

    const metadata = generateMetadata(parseResult.data, bbox, isGeojson);
    if (elements.metaEl) {
      elements.metaEl.textContent = metadata;
    }

    renderOutput(JSON.stringify(parseResult.data, null, 2));
    updateStatus(`Validering OK${bbox ? ' (BBOX hittad)' : ''}.`);
    appState.addLog(TOOL_KEY, 'OK', `Validering OK${bbox ? ' + BBOX' : ''}`);
    updateUI();
  }

  function actionPrettify() {
    const parseResult = parseJson();

    if (!parseResult.valid) {
      updateStatus(`Parse-fel: ${parseResult.error}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Prettify misslyckades: ${parseResult.error}`);
      return;
    }

    const pretty = JSON.stringify(parseResult.data, null, 2);
    elements.input.value = pretty;
    renderOutput(pretty);
    updateStatus('Formaterad.');
    appState.addLog(TOOL_KEY, 'OK', 'JSON formaterat');
    updateUI();
  }

  function actionMinify() {
    const parseResult = parseJson();

    if (!parseResult.valid) {
      updateStatus(`Parse-fel: ${parseResult.error}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Minify misslyckades: ${parseResult.error}`);
      return;
    }

    const minified = JSON.stringify(parseResult.data);
    renderOutput(minified);
    updateStatus('Minifierad.');
    appState.addLog(TOOL_KEY, 'OK', 'JSON minifierad');
    updateUI();
  }

  async function actionCopy() {
    const text = elements.output.textContent;
    if (!text) {
      updateStatus('Ingen data att kopiera.');
      return;
    }

    const result = await copyToClipboard(text);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'JSON kopierat till clipboard');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }
    updateUI();
  }

  function actionClear() {
    elements.input.value = '';
    elements.output.textContent = '';
    updateStatus('');
    if (elements.metaEl) elements.metaEl.textContent = '';
    state.lastValidJson = null;
    state.lastBbox = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  function actionExportJson() {
    if (!state.lastValidJson) {
      updateStatus('Validera JSON först.');
      return;
    }

    const json = JSON.stringify(state.lastValidJson, null, 2);
    const filename = `json-${formatTimestamp()}.json`;
    const result = exportFile({ filename, mime: 'application/json', content: json });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'JSON exporterad');
    updateUI();
  }

  function actionExportBboxTxt() {
    if (!state.lastBbox) {
      updateStatus('BBOX hittas inte. Validera GeoJSON först.');
      appState.addLog(TOOL_KEY, 'WARN', 'BBOX export blockerad: ingen BBOX');
      return;
    }

    const { minx, miny, maxx, maxy } = state.lastBbox;
    const content = `${minx},${miny},${maxx},${maxy}`;
    const filename = `json-${formatTimestamp()}-bbox.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'BBOX TXT exporterad');
    updateUI();
  }

  function actionExportBboxGeojson() {
    if (!state.lastBbox) {
      updateStatus('BBOX hittas inte. Validera GeoJSON först.');
      appState.addLog(TOOL_KEY, 'WARN', 'BBOX GeoJSON export blockerad: ingen BBOX');
      return;
    }

    const { minx, miny, maxx, maxy } = state.lastBbox;
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'BBOX' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [minx, miny],
                [maxx, miny],
                [maxx, maxy],
                [minx, maxy],
                [minx, miny],
              ],
            ],
          },
        },
      ],
    };

    const json = JSON.stringify(geojson, null, 2);
    const filename = `json-${formatTimestamp()}-bbox.geojson`;
    const result = exportFile({ filename, mime: 'application/geo+json', content: json });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'BBOX GeoJSON exporterad');
    updateUI();
  }

  function actionSendToBbox() {
    if (!state.lastBbox) {
      updateStatus('BBOX hittas inte. Validera GeoJSON först.');
      return;
    }

    const { minx, miny, maxx, maxy } = state.lastBbox;
    const minxInput = document.getElementById('bbox-minx');
    const minyInput = document.getElementById('bbox-miny');
    const maxxInput = document.getElementById('bbox-maxx');
    const maxyInput = document.getElementById('bbox-maxy');

    if (minxInput && minyInput && maxxInput && maxyInput) {
      minxInput.value = minx;
      minyInput.value = miny;
      maxxInput.value = maxx;
      maxyInput.value = maxy;

      updateStatus('Skickad till BBOX-verktyg.');
      appState.addLog(TOOL_KEY, 'OK', 'BBOX skickad till BBOX-verktyg');

      const bboxSection = document.getElementById('bbox');
      if (bboxSection) {
        scrollIntoView(bboxSection);
      }
    } else {
      updateStatus('BBOX-verktyg hittas inte.');
      appState.addLog(TOOL_KEY, 'WARN', 'BBOX-verktyg element saknas');
    }

    updateUI();
  }

  function actionSendToUrlbuilder() {
    if (!state.lastBbox) {
      updateStatus('BBOX hittas inte. Validera GeoJSON först.');
      return;
    }

    const { minx, miny, maxx, maxy } = state.lastBbox;
    const bboxInput = document.getElementById('urlbuilder-bbox');

    if (bboxInput) {
      bboxInput.value = `${minx},${miny},${maxx},${maxy}`;
      updateStatus('Skickad till URL builder.');
      appState.addLog(TOOL_KEY, 'OK', 'BBOX skickad till URL builder');

      const urlBuilderSection = document.getElementById('urlbuilder-base');
      if (urlBuilderSection) {
        scrollIntoView(urlBuilderSection);
      }
    } else {
      updateStatus('URL builder hittas inte.');
      appState.addLog(TOOL_KEY, 'WARN', 'URL builder element saknas');
    }

    updateUI();
  }

  function renderOutput(text) {
    if (elements.output) {
      elements.output.textContent = text;
    }
  }

  function updateStatus(message) {
    if (elements.status) {
      elements.status.textContent = message;
    }
  }

  function updateUI() {
    // Update validation report
    if (elements.reportEl) {
      const report = appState.getReport(TOOL_KEY);
      renderReport(elements.reportEl, report);
    }

    // Update run log
    if (elements.logEl) {
      const logs = appState.getLogs(TOOL_KEY);
      renderRunLog(elements.logEl, logs);
    }
  }

  // Public interface
  return {
    init,
    getState: () => state,
    getData: (key) => state[key],
  };
})();
