/**
 * Try‑it tool module: BBOX / Extent
 *
 * Purpose:
 * - Parse, normalize and validate bounding boxes and generate example WMS URLs.
 *
 * Expected block structure in HTML: input → actions → output → report
 * Public interface:
 * - init(block)
 *
 * Conventions:
 * - Document CRS assumptions (e.g. EPSG:3008/EPSG:3006) in constants.
 * - Use `ValidationReport` helpers for user messages and avoid silent failures.
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
  // Antagande: intervall nedan är generella Sverige-extent för EPSG:3008/3006.
  // Justera här om din CRS har andra bounds eller axelordning.
  const BBOX_RANGE_CONFIG = {
    epsg3008: { minx: 0, maxx: 1500000, miny: 6100000, maxy: 7700000 },
    epsg3006: { minx: 0, maxx: 1500000, miny: 5500000, maxy: 8000000 },
  };
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

    if (isDevMode()) {
      runBboxSelfTests();
    }

    return true;
  }

  function runBboxSelfTests() {
    const tests = [
      {
        name: 'Parse commas/spaces/newlines',
        input: '100000, 6400000\n200000 6500000',
        expect: { minx: 100000, miny: 6400000, maxx: 200000, maxy: 6500000 },
      },
      {
        name: 'Axis swap fixes',
        input: '200000 6500000 100000 6400000',
        expect: { minx: 100000, miny: 6400000, maxx: 200000, maxy: 6500000 },
        expectFix: 'bbox.axisSwapped',
      },
      {
        name: 'Out of range',
        input: '9999999 1 9999999 2',
        expectError: 'bbox.outOfRange',
      },
    ];

    tests.forEach((t) => {
      const report = createValidationReport(true);
      const parsed = parseBboxText(t.input);

      if (parsed.length !== 4) {
        console.error(`[BBOX SelfTest] ${t.name} failed: invalid token count`);
        return;
      }

      const normalized = normalizeBbox(
        { minx: parsed[0], miny: parsed[1], maxx: parsed[2], maxy: parsed[3] },
        report,
      );

      const in3008 = matchesRange(normalized, RANGE_EPSG_3008);
      const in3006 = matchesRange(normalized, RANGE_EPSG_3006);
      if (!in3008 && !in3006) {
        addReportError(report, 'bbox.outOfRange', 'BBOX utanför tillåtna intervall');
      }

      if (t.expect) {
        const match =
          normalized.minx === t.expect.minx &&
          normalized.miny === t.expect.miny &&
          normalized.maxx === t.expect.maxx &&
          normalized.maxy === t.expect.maxy;
        if (!match) {
          console.error(`[BBOX SelfTest] ${t.name} failed: normalization mismatch`, normalized);
          return;
        }
      }

      if (t.expectFix && !report.fixesApplied.some((f) => f.code === t.expectFix)) {
        console.error(`[BBOX SelfTest] ${t.name} failed: expected fix ${t.expectFix}`);
        return;
      }

      if (t.expectError && !report.errors.some((e) => e.code === t.expectError)) {
        console.error(`[BBOX SelfTest] ${t.name} failed: expected error ${t.expectError}`);
        return;
      }
    });
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

  const RANGE_EPSG_3008 = BBOX_RANGE_CONFIG.epsg3008;
  const RANGE_EPSG_3006 = BBOX_RANGE_CONFIG.epsg3006;

  function isDevMode() {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:')
    );
  }

  function parseBboxText(rawText) {
    const tokens = (rawText.match(/-?\d+(?:[.,]\d+)?/g) || []).map((t) => t.replace(',', '.'));
    return tokens.map((t) => Number(t));
  }

  function parseBboxInputs() {
    const raw = [
      elements.minx?.value || '',
      elements.miny?.value || '',
      elements.maxx?.value || '',
      elements.maxy?.value || '',
    ]
      .join(' ')
      .trim();

    if (!raw) return { ok: false, values: null, error: 'BBOX saknas' };

    const numbers = parseBboxText(raw);
    if (numbers.length !== 4) {
      return { ok: false, values: null, error: 'BBOX måste innehålla exakt 4 värden' };
    }

    const [minx, miny, maxx, maxy] = numbers;
    if ([minx, miny, maxx, maxy].some((n) => Number.isNaN(n))) {
      return { ok: false, values: null, error: 'Alla koordinater måste vara tal' };
    }

    return {
      ok: true,
      values: { minx, miny, maxx, maxy },
      error: null,
    };
  }

  function normalizeBbox(values, report) {
    let { minx, miny, maxx, maxy } = values;
    let swapped = false;

    if (minx > maxx) {
      [minx, maxx] = [maxx, minx];
      swapped = true;
    }

    if (miny > maxy) {
      [miny, maxy] = [maxy, miny];
      swapped = true;
    }

    if (swapped) {
      addReportWarning(
        report,
        'bbox.axisSwapped',
        'Min/Max var omkastade – korrigerad',
      );
      addReportFix(report, 'bbox.axisSwapped', 'Min/Max korrigerades automatiskt');
    }

    return { minx, miny, maxx, maxy };
  }

  function matchesRange(values, range) {
    return (
      values.minx >= range.minx &&
      values.maxx <= range.maxx &&
      values.miny >= range.miny &&
      values.maxy <= range.maxy
    );
  }

  function validateBbox() {
    const report = createValidationReport(true);
    const parsed = parseBboxInputs();

    if (!parsed.ok) {
      const code = parsed.error.includes('4') ? 'bbox.invalidFormat' : 'bbox.nonNumeric';
      addReportError(report, code, parsed.error);
      return report;
    }

    const normalized = normalizeBbox(parsed.values, report);

    const in3008 = matchesRange(normalized, RANGE_EPSG_3008);
    const in3006 = matchesRange(normalized, RANGE_EPSG_3006);

    if (!in3008 && !in3006) {
      addReportError(
        report,
        'bbox.outOfRange',
        'BBOX ligger utanför giltiga intervall för EPSG:3008 och EPSG:3006',
        'bbox',
        `EPSG:3008 X:${RANGE_EPSG_3008.minx}-${RANGE_EPSG_3008.maxx}, Y:${RANGE_EPSG_3008.miny}-${RANGE_EPSG_3008.maxy}; ` +
          `EPSG:3006 X:${RANGE_EPSG_3006.minx}-${RANGE_EPSG_3006.maxx}, Y:${RANGE_EPSG_3006.miny}-${RANGE_EPSG_3006.maxy}`,
      );
    }

    report.meta.values = normalized;
    report.meta.normalized = `${normalized.minx},${normalized.miny},${normalized.maxx},${normalized.maxy}`;
    report.meta.crsCandidates = [
      ...(in3008 ? ['EPSG:3008'] : []),
      ...(in3006 ? ['EPSG:3006'] : []),
    ];

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

    const bboxStr = validation.meta.normalized;
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

    const result = await copyToClipboard(text);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'BBOX kopierad');
    } else {
      updateStatus(result.message);
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

    const result = await copyToClipboard(text);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'URL kopierad');
    } else {
      updateStatus(result.message);
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

    const filename = `bbox-${formatTimestamp()}.geojson`;
    const result = exportFile({
      filename,
      mime: 'application/json',
      content: JSON.stringify(geojson, null, 2),
    });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'GeoJSON exporterad');
    updateUI();
  }

  function exportTxt() {
    const content = [
      '═══ BBOX EXPORT ═══',
      `CRS: ${BBOX_CRS}`,
      '',
      'BBOX-sträng:',
      elements.output?.value || '(inget)',
      '',
      'WMS GetMap-URL:',
      elements.urlOutput?.value || '(inget)',
    ].join('\n');

    const filename = `bbox-${formatTimestamp()}.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    updateStatus(result.message);
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
