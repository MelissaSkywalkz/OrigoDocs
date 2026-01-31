/**
 * URL Builder Tool Module
 *
 * Handles: WMS/WFS URL generation, validation, testing, export
 *
 * Interface:
 * - init(containerElement)
 */

const urlBuilderTool = (() => {
  const TOOL_KEY = 'urlbuilder';

  let elements = {
    base: null,
    service: null,
    layer: null,
/**
 * Try‑it tool module: URL Builder
 *
 * Purpose:
 * - Construct sample WMS/WFS request URLs, generate `curl` snippets and export text snippets.
 *
 * Expected block structure in HTML: input → actions → output → report
 * Public interface:
 * - init(block)
 *
 * Conventions:
 * - Generated snippets should be deterministic where feasible and labeled in Swedish.
 * - Avoid embedding machine‑specific metadata unless documented.
 */
    format: null,
    crs: null,
    bbox: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
    explainEl: null,
    curlMultiline: null,
    curlSilent: null,
  };

  let state = {
    lastGeneratedUrl: null,
    quickActions: {
      'cap-wms': 'WMS GetCapabilities',
      'cap-wfs': 'WFS GetCapabilities',
      'getmap-demo': 'WMS GetMap demo',
    },
  };

  function init(block) {
    if (!block) return false;

    elements.base = block.querySelector('#urlbuilder-base');
    elements.service = block.querySelector('#urlbuilder-service');
    elements.layer = block.querySelector('#urlbuilder-layer');
    elements.format = block.querySelector('#urlbuilder-format');
    elements.crs = block.querySelector('#urlbuilder-crs');
    elements.bbox = block.querySelector('#urlbuilder-bbox');
    elements.output = block.querySelector('#urlbuilder-output');
    elements.status = block.querySelector('#urlbuilder-status');
    elements.reportEl = block.querySelector('#urlbuilder-validation');
    elements.logEl = block.querySelector('#urlbuilder-runlog');
    elements.explainEl = block.querySelector('#urlbuilder-explain');
    elements.curlMultiline = block.querySelector('#urlbuilder-curl-multiline');
    elements.curlSilent = block.querySelector('#urlbuilder-curl-silent');

    if (!elements.base || !elements.output || !elements.status) {
      console.error('URL Builder Tool: Missing required DOM elements');
      return false;
    }

    attachEventListeners(block);

    appState.addLog(TOOL_KEY, 'INFO', 'URL Builder-verktyg initierat');
    updateUI();

    return true;
  }

  function attachEventListeners(block) {
    // Main action buttons
    const buttons = block.querySelectorAll('[data-url-action]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.urlAction;
        handleAction(action);
      });
    });

    // Quick action buttons
    const quickButtons = block.querySelectorAll('[data-url-quick]');
    quickButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const quick = button.dataset.urlQuick;
        handleQuickAction(quick);
      });
    });
  }

  function handleQuickAction(quick) {
    switch (quick) {
      case 'cap-wms':
        fillQuickWMS();
        break;
      case 'cap-wfs':
        fillQuickWFS();
        break;
      case 'getmap-demo':
        fillQuickGetMapDemo();
        break;
      case 'clear':
        actionClear();
        break;
      default:
        break;
    }
  }

  function fillQuickWMS() {
    if (elements.service) elements.service.value = 'WMS';
    if (elements.bbox) elements.bbox.value = '';
    actionGenerate();
    updateStatus('WMS GetCapabilities URL skapad.');
    appState.addLog(TOOL_KEY, 'OK', 'WMS GetCapabilities Quick preset');
  }

  function fillQuickWFS() {
    if (elements.service) elements.service.value = 'WFS';
    if (elements.bbox) elements.bbox.value = '';
    actionGenerate();
    updateStatus('WFS GetCapabilities URL skapad.');
    appState.addLog(TOOL_KEY, 'OK', 'WFS GetCapabilities Quick preset');
  }

  function fillQuickGetMapDemo() {
    if (elements.service) elements.service.value = 'WMS';
    actionGenerate();
    updateStatus('WMS GetMap demo URL skapad.');
    appState.addLog(TOOL_KEY, 'OK', 'WMS GetMap demo Quick preset');
  }

  function handleAction(action) {
    switch (action) {
      case 'generate':
        actionGenerate();
        break;
      case 'copy':
        actionCopy();
        break;
      case 'test':
        actionTest();
        break;
      case 'open':
        actionOpen();
        break;
      case 'copy-curl':
        actionCopyCurl();
        break;
      case 'download-curl':
        actionDownloadCurl();
        break;
      case 'export-txt':
        actionExportTxt();
        break;
      case 'fix-bbox':
        actionFixBbox();
        break;
      default:
        break;
    }
  }

  const REMOVE_PARAM_VALUES = new Set(['', '__remove__', '__delete__']);

  const PARAM_MEANINGS = {
    service: 'Tjänst (WMS/WFS)',
    request: 'Åtgärd (t.ex. GetMap/GetFeature)',
    version: 'Tjänsteversion',
    layers: 'Layer (WMS)',
    typename: 'Layer (WFS, 1.1.0)',
    typenames: 'Layer (WFS, 2.0.0)',
    format: 'Outputformat (WMS)',
    outputformat: 'Outputformat (WFS)',
    crs: 'Koordinatsystem (WMS 1.3.0)',
    srs: 'Koordinatsystem (WMS 1.1.1)',
    bbox: 'BBOX (minx,miny,maxx,maxy)',
    width: 'Bredd (px)',
    height: 'Höjd (px)',
    styles: 'Styles',
  };

  function normalizeText(value) {
    return (value || '').trim();
  }

  function isUnsafeProtocol(url) {
    return url.protocol.toLowerCase() === 'javascript:';
  }

  function createBaseUrl(baseValue) {
    const trimmed = normalizeText(baseValue);
    if (!trimmed) {
      return { ok: false, url: null, error: { code: 'URL_MISSING_BASE', message: 'Bas-URL är tom' } };
    }

    try {
      const url = new URL(trimmed, window.location.href);
      if (isUnsafeProtocol(url)) {
        return {
          ok: false,
          url: null,
          error: { code: 'URL_INVALID_PROTOCOL', message: 'javascript: URLs är inte tillåtna' },
        };
      }

      if (!['http:', 'https:'].includes(url.protocol.toLowerCase())) {
        return {
          ok: false,
          url: null,
          error: { code: 'URL_INVALID_PROTOCOL', message: 'Endast http/https tillåts' },
        };
      }

      return { ok: true, url, error: null };
    } catch (error) {
      return {
        ok: false,
        url: null,
        error: {
          code: 'URL_INVALID_FORMAT',
          message: 'Ogiltig bas-URL',
          details: error.message,
        },
      };
    }
  }

  function collectBaseParams(baseUrl) {
    const baseParams = new URLSearchParams(baseUrl.search);
    const removed = new Set();
    const params = new URLSearchParams();

    baseParams.forEach((value, key) => {
      const trimmedKey = normalizeText(key);
      const trimmedValue = normalizeText(value);
      if (!trimmedKey) return;

      if (trimmedKey.startsWith('-')) {
        removed.add(trimmedKey.slice(1));
        return;
      }

      if (REMOVE_PARAM_VALUES.has(trimmedValue)) {
        removed.add(trimmedKey);
        return;
      }

      params.set(trimmedKey, trimmedValue);
    });

    return { params, removed };
  }

  function buildParamExplanation(params, serviceValue) {
    const explanation = [];
    const entries = Array.from(params.entries());

    const requiredForWms = ['service', 'request', 'version', 'layers', 'format', 'bbox'];
    const requiredForWfs = ['service', 'request', 'version'];

    const required = serviceValue === 'WFS' ? requiredForWfs : requiredForWms;

    required.forEach((key) => {
      const value = params.get(key);
      explanation.push({
        name: key,
        value: value || '',
        meaning: PARAM_MEANINGS[key] || 'Okänd parameter',
        status: value ? 'ok' : 'error',
      });
    });

    entries.forEach(([key, value]) => {
      if (required.includes(key)) return;
      explanation.push({
        name: key,
        value,
        meaning: PARAM_MEANINGS[key] || 'Anpassad parameter',
        status: value ? 'ok' : 'warn',
      });
    });

    return explanation;
  }

  function shellQuote(value) {
    const str = String(value ?? '');
    if (str === '') return "''";
    return `'${str.replace(/'/g, `'"'"'`)}'`;
  }

  function buildCurlCommand(url, options = {}) {
    const { silent = false, multiline = false, acceptHeader = '' } = options;
    const parts = ['curl', '-L'];
    if (silent) parts.push('-sS');

    if (acceptHeader) {
      parts.push('-H', shellQuote(`Accept: ${acceptHeader}`));
    }

    parts.push(shellQuote(url));

    if (!multiline) {
      return parts.join(' ');
    }

    const formatted = ['curl', '-L', ...(silent ? ['-sS'] : [])]
      .concat(acceptHeader ? ['-H', shellQuote(`Accept: ${acceptHeader}`)] : [])
      .concat([shellQuote(url)])
      .map((part, idx) => (idx === 0 ? part : `  ${part}`));

    return formatted.join(' \\\n');
  }

  function validateInputs() {
    const issues = [];

    const baseCheck = createBaseUrl(elements.base.value);
    if (!baseCheck.ok) {
      issues.push({
        code: baseCheck.error.code,
        message: baseCheck.error.message,
        field: 'base',
        details: baseCheck.error.details,
      });
    }

    if (!normalizeText(elements.layer.value)) {
      issues.push({
        code: 'URL_MISSING_LAYER',
        message: 'Layer är tom',
        field: 'layer',
      });
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  function generateUrl() {
    const validation = validateInputs();

    if (!validation.valid) {
      return {
        valid: false,
        url: null,
        errors: validation.issues,
      };
    }

    try {
      const baseResult = createBaseUrl(elements.base.value);
      if (!baseResult.ok) {
        return {
          valid: false,
          url: null,
          errors: [baseResult.error],
        };
      }

      const baseUrl = baseResult.url;
      const serviceValue = normalizeText(elements.service?.value || 'WMS').toUpperCase();
      const { params: baseParams, removed } = collectBaseParams(baseUrl);

      const params = new URLSearchParams();
      baseParams.forEach((value, key) => {
        if (!removed.has(key)) params.set(key, value);
      });

      const setParam = (key, value) => {
        if (removed.has(key)) return;
        const trimmed = normalizeText(value);
        if (!trimmed) return;
        params.set(key, trimmed);
      };

      setParam('service', serviceValue);
      setParam('version', serviceValue === 'WFS' ? '2.0.0' : '1.1.1');
      setParam('request', serviceValue === 'WFS' ? 'GetFeature' : 'GetMap');

      if (serviceValue === 'WFS') {
        setParam('typenames', elements.layer.value);
        setParam('outputFormat', elements.format?.value || 'application/json');
      } else {
        setParam('layers', elements.layer.value);
        setParam('styles', '');
        setParam('format', elements.format?.value || 'image/png');
        setParam('crs', elements.crs?.value || 'EPSG:3008');
        setParam('bbox', elements.bbox?.value);
        setParam('width', '256');
        setParam('height', '256');
      }

      baseUrl.search = params.toString();
      return {
        valid: true,
        url: baseUrl.toString(),
        errors: [],
        params,
        removed,
      };
    } catch (error) {
      return {
        valid: false,
        url: null,
        errors: [
          {
            code: 'URL_INVALID_FORMAT',
            message: 'Ogiltig bas-URL',
            details: error.message,
          },
        ],
      };
    }
  }

  function generateValidationReport(result) {
    const report = createValidationReport(result.valid);

    if (!result.valid) {
      result.errors.forEach((err) => {
        addReportError(report, err.code || 'URL_INVALID_FORMAT', err.message, err.field, err.details);
      });
      return report;
    }

    // Valid - add metadata
    report.meta.service = elements.service?.value || 'WMS';
    report.meta.layer = elements.layer?.value || '(inget)';
    report.meta.format = elements.format?.value || 'image/png';
    report.meta.crs = elements.crs?.value || 'EPSG:3008';

    if (elements.bbox?.value) {
      report.meta.bbox = elements.bbox.value;
    }

    if (result.params) {
      const serviceValue = normalizeText(elements.service?.value || 'WMS').toUpperCase();
      const explain = buildParamExplanation(result.params, serviceValue);
      report.meta.paramExplain = explain;
      report.meta.params = Object.fromEntries(result.params.entries());

      explain
        .filter((item) => item.status === 'error')
        .forEach((item) => {
          addReportWarning(
            report,
            'URL_MISSING_PARAM',
            `Parametern ${item.name} saknas`,
            item.name,
          );
        });
    }

    if (result.removed && result.removed.size > 0) {
      report.meta.removedParams = Array.from(result.removed);
    }

    return report;
  }

  function actionGenerate() {
    const result = generateUrl();
    const report = generateValidationReport(result);
    appState.setReport(TOOL_KEY, report);

    if (!result.valid) {
      if (elements.output) elements.output.value = '';
      const firstError = result.errors[0]?.message || 'Validering misslyckades';
      updateStatus(`Fel: ${firstError}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Generation misslyckades: ${firstError}`);
    } else {
      if (elements.output) elements.output.value = result.url;
      state.lastGeneratedUrl = result.url;
      updateStatus('URL genererad.');
      appState.addLog(TOOL_KEY, 'OK', 'URL genererad');
    }

    updateUI();
  }

  async function actionCopy() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    const result = await copyToClipboard(url);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'URL kopierad');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }

    updateUI();
  }

  function actionTest() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
        updateStatus('Endast http/https tillåts.');
        appState.addLog(TOOL_KEY, 'ERROR', 'URL-protokoll ej tillåtet');
        return;
      }
      updateStatus('URL-syntax OK.');
      appState.addLog(TOOL_KEY, 'OK', 'URL-syntax validerad');
    } catch (error) {
      updateStatus(`URL-fel: ${error.message}`);
      appState.addLog(TOOL_KEY, 'ERROR', `URL-validering misslyckades: ${error.message}`);
    }

    updateUI();
  }

  function actionOpen() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
        updateStatus('Endast http/https tillåts.');
        appState.addLog(TOOL_KEY, 'ERROR', 'URL-protokoll ej tillåtet');
        return;
      }
    } catch {
      updateStatus('Ogiltig URL.');
      appState.addLog(TOOL_KEY, 'ERROR', 'URL öppning misslyckades: ogiltig URL');
      return;
    }

    window.open(url, '_blank');
    updateStatus('URL öppnad i ny flik.');
    appState.addLog(TOOL_KEY, 'OK', 'URL öppnad i ny flik');
    updateUI();
  }

  async function actionCopyCurl() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    const acceptHeader = normalizeText(elements.format?.value || '');
    const curl = buildCurlCommand(url.trim(), {
      silent: Boolean(elements.curlSilent?.checked),
      multiline: Boolean(elements.curlMultiline?.checked),
      acceptHeader,
    });
    const result = await copyToClipboard(curl);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'Curl kopierad');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }

    updateUI();
  }

  function actionDownloadCurl() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    const acceptHeader = normalizeText(elements.format?.value || '');
    const curlCommand = buildCurlCommand(url.trim(), {
      silent: Boolean(elements.curlSilent?.checked),
      multiline: Boolean(elements.curlMultiline?.checked),
      acceptHeader,
    });
    const curl = `#!/bin/bash\n# Curl-begäran\n${curlCommand}\n`;
    const filename = `urlbuilder-${formatTimestamp()}.sh`;
    const result = exportFile({ filename, mime: 'text/plain', content: curl });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'Curl-skript nedladdat');
    updateUI();
  }

  function actionExportTxt() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    let content = '═══ WMS/WFS-BEGÄRAN ═══\n\n';
    content += '─── URL ───\n';
    content += `${url}\n\n`;
    content += '─── Parametrar ───\n';
    content += `Tjänst: ${elements.service?.value || 'WMS'}\n`;
    content += `Lager: ${elements.layer?.value || '(saknas)'}\n`;
    content += `Format: ${elements.format?.value || 'image/png'}\n`;
    content += `CRS: ${elements.crs?.value || 'EPSG:3008'}\n`;

    if (elements.bbox?.value) {
      content += `BBOX: ${elements.bbox.value}\n`;
    }

    const filename = `urlbuilder-${formatTimestamp()}.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'TXT exporterad');
    updateUI();
  }

  function actionFixBbox() {
    if (!elements.bbox?.value) {
      updateStatus('Ingen BBOX att fixa.');
      return;
    }

    const parts = elements.bbox.value.split(',').map((p) => parseFloat(p.trim()));

    if (parts.length !== 4 || parts.some(isNaN)) {
      updateStatus('BBOX-format ogiltigt (behövs: minx,miny,maxx,maxy)');
      appState.addLog(TOOL_KEY, 'ERROR', 'BBOX-fix misslyckades: ogiltigt format');
      updateUI();
      return;
    }

    const [minx, miny, maxx, maxy] = parts;

    const fixedMinx = Math.min(minx, maxx);
    const fixedMaxx = Math.max(minx, maxx);
    const fixedMiny = Math.min(miny, maxy);
    const fixedMaxy = Math.max(miny, maxy);

    elements.bbox.value = `${fixedMinx},${fixedMiny},${fixedMaxx},${fixedMaxy}`;
    updateStatus('BBOX fixad.');
    appState.addLog(TOOL_KEY, 'OK', 'BBOX fixad');
    updateUI();
  }

  function actionClear() {
    if (elements.base) elements.base.value = 'https://localhost/geoserver/workspace/ows';
    if (elements.layer) elements.layer.value = 'workspace:layer';
    if (elements.format) elements.format.value = 'image/png';
    if (elements.crs) elements.crs.value = 'EPSG:3008';
    if (elements.bbox) elements.bbox.value = '';
    if (elements.output) elements.output.value = '';
    updateStatus('');
    state.lastGeneratedUrl = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  function updateStatus(message) {
    if (elements.status) {
      elements.status.textContent = message;
    }
  }

  function renderExplain(explain) {
    if (!elements.explainEl) return;

    if (!explain || explain.length === 0) {
      elements.explainEl.textContent = '';
      return;
    }

    const lines = [];
    explain.forEach((item) => {
      const statusLabel = item.status === 'error' ? 'FEL' : item.status === 'warn' ? 'VARNING' : 'OK';
      lines.push(`${item.name} = ${item.value || '(saknas)'} (${statusLabel})`);
      lines.push(`  ${item.meaning}`);
    });

    elements.explainEl.textContent = lines.join('\n');
  }

  function updateUI() {
    if (elements.reportEl) {
      const report = appState.getReport(TOOL_KEY);
      renderReport(elements.reportEl, report);
    }

    const report = appState.getReport(TOOL_KEY);
    renderExplain(report?.meta?.paramExplain || []);

    if (elements.logEl) {
      const logs = appState.getLogs(TOOL_KEY);
      renderRunLog(elements.logEl, logs);
    }
  }

  return {
    init,
    getState: () => state,
  };
})();
