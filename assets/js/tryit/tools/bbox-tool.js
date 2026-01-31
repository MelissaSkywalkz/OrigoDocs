/**
 * BBOX Tool Module - For EPSG:3008
 * Generates BBOX strings and WMS URLs
 */

const bboxTool = (() => {
  const TOOL_KEY = 'bbox';

  let elements = {
    base: null,
    layer: null,
    format: null,
    width: null,
    height: null,
    minx: null,
    miny: null,
    maxx: null,
    maxy: null,
    output: null,
    urlOutput: null,
    status: null,
    reportEl: null,
    logEl: null,
    normalizedEl: null,
  };

  const BBOX_CRS = 'EPSG:3008';
  const presets = {
    'preset-1': { minx: 100000, miny: 6400000, maxx: 200000, maxy: 6500000 },
    'preset-2': { minx: 200000, miny: 6500000, maxx: 350000, maxy: 6650000 },
    'preset-3': { minx: 350000, miny: 6650000, maxx: 500000, maxy: 6800000 },
  };

  let state = {
    lastBbox: null,
    hasGenerated: false,
  };

  function init(block) {
    if (!block) return false;

    elements.base = block.querySelector('#bbox-base');
    elements.layer = block.querySelector('#bbox-layer');
    elements.format = block.querySelector('#bbox-format');
    elements.width = block.querySelector('#bbox-width');
    elements.height = block.querySelector('#bbox-height');
    elements.minx = block.querySelector('#bbox-minx');
    elements.miny = block.querySelector('#bbox-miny');
    elements.maxx = block.querySelector('#bbox-maxx');
    elements.maxy = block.querySelector('#bbox-maxy');
    elements.output = block.querySelector('#bbox-output');
    elements.urlOutput = block.querySelector('#bbox-url-output');
    elements.status = block.querySelector('#bbox-status');
    elements.reportEl = block.querySelector('#bbox-validation');
    elements.logEl = block.querySelector('#bbox-runlog');
    elements.normalizedEl = block.querySelector('#bbox-normalized');

    if (!elements.output || !elements.status) {
      console.error('BBOX Tool: Missing required elements');
      return false;
    }

    attachEventListeners(block);
    appState.addLog(TOOL_KEY, 'INFO', 'BBOX-verktyg initierat');
    updateUI();

    return true;
  }

  function attachEventListeners(block) {
    block.querySelectorAll('[data-bbox-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleAction(btn.dataset.bboxAction);
      });
    });
  }

  function handleAction(action) {
    if (action.startsWith('preset-')) {
      applyPreset(presets[action]);
    } else {
      switch (action) {
        case 'generate':
          generate();
          break;
        case 'copy-bbox':
          copybbox();
          break;
        case 'copy-url':
          copyUrl();
          break;
        case 'send-to-gridcalc':
          sendToGridcalc();
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
      }
    }
  }

  function validateBbox() {
    const values = {
      minx: parseFloat(elements.minx?.value || 0),
      miny: parseFloat(elements.miny?.value || 0),
      maxx: parseFloat(elements.maxx?.value || 0),
      maxy: parseFloat(elements.maxy?.value || 0),
    };

    const report = createValidationReport();

    if (isNaN(values.minx) || isNaN(values.maxx) || isNaN(values.miny) || isNaN(values.maxy)) {
      addReportError(report, 'BBOX_INVALID_NUMBER', 'Alla koordinater måste vara tal');
      return report;
    }

    if (values.minx >= values.maxx) {
      addReportError(report, 'BBOX_MIN_MAX_REVERSED', 'Min X måste vara mindre än Max X', 'minx');
    }

    if (values.miny >= values.maxy) {
      addReportError(report, 'BBOX_MIN_MAX_REVERSED', 'Min Y måste vara mindre än Max Y', 'miny');
    }

    if (values.minx < 0 || values.maxx > 1500000) {
      addReportError(
        report,
        'BBOX_OUT_OF_RANGE',
        'X-värden måste vara inom 0 → 1,500,000',
        'x',
      );
    }

    if (values.miny < 5500000 || values.maxy > 8000000) {
      addReportError(
        report,
        'BBOX_OUT_OF_RANGE',
        'Y-värden måste vara inom 5,500,000 → 8,000,000',
        'y',
      );
    }

    if (report.ok) {
      report.meta.values = values;
      report.meta.crs = BBOX_CRS;
    }

    return report;
  }

  function generate() {
    const validation = validateBbox();

    if (!validation.ok) {
      if (elements.output) elements.output.value = '';
      if (elements.urlOutput) elements.urlOutput.value = '';
      const firstError = validation.errors[0]?.message || 'Validering misslyckades';
      updateStatus(firstError);
      appState.addLog(TOOL_KEY, 'ERROR', `Validering misslyckades: ${firstError}`);
      appState.setReport(TOOL_KEY, validation);
      updateUI();
      return;
    }

    const bbox = validation.meta.values;
    state.lastBbox = bbox;
    state.hasGenerated = true;

    const bboxStr = `${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}`;
    if (elements.output) elements.output.value = bboxStr;

    // Generate URL
    if (elements.base?.value.trim()) {
      try {
        const url = new URL(elements.base.value.trim());
        const params = new URLSearchParams();
        params.set('service', 'WMS');
        params.set('version', '1.1.1');
        params.set('request', 'GetMap');
        params.set('layers', elements.layer?.value || '');
        params.set('format', elements.format?.value || 'image/png');
        params.set('bbox', bboxStr);
        params.set('width', elements.width?.value || '512');
        params.set('height', elements.height?.value || '512');
        params.set('srs', BBOX_CRS);

        url.search = params.toString();
        if (elements.urlOutput) elements.urlOutput.value = url.toString();
      } catch (e) {
        if (elements.urlOutput) elements.urlOutput.value = '';
      }
    }

    // Update normalized
    if (elements.normalizedEl) {
      let norm = '{\n';
      norm += `  "minx": ${bbox.minx},\n`;
      norm += `  "miny": ${bbox.miny},\n`;
      norm += `  "maxx": ${bbox.maxx},\n`;
      norm += `  "maxy": ${bbox.maxy},\n`;
      norm += `  "crs": "${BBOX_CRS}"\n}`;
      elements.normalizedEl.value = norm;
    }

    validation.meta.bbox = bboxStr;
    validation.meta.width = bbox.maxx - bbox.minx;
    validation.meta.height = bbox.maxy - bbox.miny;

    updateStatus('BBOX genererad.');
    appState.addLog(TOOL_KEY, 'OK', `BBOX genererad: ${bboxStr}`);
    appState.setReport(TOOL_KEY, validation);
    updateUI();
  }

  function applyPreset(preset) {
    if (elements.minx) elements.minx.value = preset.minx;
    if (elements.miny) elements.miny.value = preset.miny;
    if (elements.maxx) elements.maxx.value = preset.maxx;
    if (elements.maxy) elements.maxy.value = preset.maxy;

    state.hasGenerated = false;
    if (elements.output) elements.output.value = '';
    if (elements.urlOutput) elements.urlOutput.value = '';

    appState.addLog(TOOL_KEY, 'OK', `Preset applicerad`);
    updateUI();
  }

  async function copybbox() {
    const text = elements.output?.value;
    if (!text) {
      updateStatus('Generera BBOX först');
      return;
    }

    if (await copyToClipboard(text)) {
      updateStatus('BBOX kopierad');
      appState.addLog(TOOL_KEY, 'OK', 'BBOX kopierad');
    } else {
      updateStatus('Kopieringen misslyckades');
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }
    updateUI();
  }

  async function copyUrl() {
    const text = elements.urlOutput?.value;
    if (!text) {
      updateStatus('Generera URL först');
      return;
    }

    if (await copyToClipboard(text)) {
      updateStatus('URL kopierad');
      appState.addLog(TOOL_KEY, 'OK', 'URL kopierad');
    } else {
      updateStatus('Kopieringen misslyckades');
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }
    updateUI();
  }

  function sendToGridcalc() {
    if (!state.lastBbox) {
      updateStatus('Generera BBOX först');
      return;
    }

    const bbox = state.lastBbox;
    const width = Math.abs(bbox.maxx - bbox.minx);
    const height = Math.abs(bbox.maxy - bbox.miny);

    const widthInput = document.getElementById('gridcalc-bboxwidth');
    const heightInput = document.getElementById('gridcalc-bboxheight');

    if (widthInput && heightInput) {
      widthInput.value = Math.round(width);
      heightInput.value = Math.round(height);
      updateStatus('Skickad till Gridcalc');
      appState.addLog(TOOL_KEY, 'OK', 'BBOX skickad till Gridcalc');

      const gridcalcSection = document.getElementById('gridcalc');
      if (gridcalcSection) scrollIntoView(gridcalcSection);
    }

    updateUI();
  }

  function sendToUrlbuilder() {
    if (!state.lastBbox) {
      updateStatus('Generera BBOX först');
      return;
    }

    const bbox = state.lastBbox;
    const bboxStr = `${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}`;
    const bboxInput = document.getElementById('urlbuilder-bbox');

    if (bboxInput) {
      bboxInput.value = bboxStr;
      updateStatus('Skickad till URL builder');
      appState.addLog(TOOL_KEY, 'OK', 'BBOX skickad till URL builder');

      const section = document.getElementById('urlbuilder-base');
      if (section) scrollIntoView(section);
    }

    updateUI();
  }

  function exportGeojson() {
    if (!state.lastBbox) {
      updateStatus('Generera BBOX först');
      return;
    }

    const bbox = state.lastBbox;
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
                [bbox.minx, bbox.miny],
                [bbox.maxx, bbox.miny],
                [bbox.maxx, bbox.maxy],
                [bbox.minx, bbox.maxy],
                [bbox.minx, bbox.miny],
              ],
            ],
          },
        },
      ],
    };

    downloadFile(
      `bbox-${Date.now()}.geojson`,
      JSON.stringify(geojson, null, 2),
      'application/json',
    );
    updateStatus('GeoJSON exporterad');
    appState.addLog(TOOL_KEY, 'OK', 'GeoJSON exporterad');
    updateUI();
  }

  function exportTxt() {
    const content = [
      '═══ BBOX EXPORT ═══',
      `Generated: ${new Date().toLocaleString('sv-SE')}`,
      `CRS: ${BBOX_CRS}`,
      '',
      'BBOX String:',
      elements.output?.value || '(inget)',
      '',
      'WMS GetMap URL:',
      elements.urlOutput?.value || '(inget)',
    ].join('\n');

    downloadFile(`bbox-${Date.now()}.txt`, content, 'text/plain');
    updateStatus('TXT exporterad');
    appState.addLog(TOOL_KEY, 'OK', 'TXT exporterad');
    updateUI();
  }

  function updateStatus(message) {
    if (elements.status) elements.status.textContent = message;
  }

  function updateUI() {
    if (elements.reportEl) {
      const report = appState.getReport(TOOL_KEY);
      renderReport(elements.reportEl, report);
    }

    if (elements.logEl) {
      const logs = appState.getLogs(TOOL_KEY);
      renderRunLog(elements.logEl, logs);
    }
  }

  return { init, getState: () => state };
})();
