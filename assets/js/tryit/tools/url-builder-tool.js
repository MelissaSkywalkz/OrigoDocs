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
    format: null,
    crs: null,
    bbox: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
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

  function validateInputs() {
    const issues = [];

    if (!elements.base.value.trim()) {
      issues.push('Bas-URL är tom');
    }

    if (!elements.layer.value.trim()) {
      issues.push('Layer är tom');
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
      const baseUrl = new URL(elements.base.value.trim(), window.location.href);
      const params = new URLSearchParams();

      params.set('service', elements.service?.value || 'WMS');
      params.set('version', '1.1.1');
      params.set('request', 'GetMap');
      params.set('layers', elements.layer.value.trim());
      params.set('styles', '');
      params.set('format', elements.format?.value || 'image/png');
      params.set('crs', elements.crs?.value || 'EPSG:3008');

      if (elements.bbox?.value.trim()) {
        params.set('bbox', elements.bbox.value.trim());
      }

      baseUrl.search = params.toString();
      return {
        valid: true,
        url: baseUrl.toString(),
        errors: [],
      };
    } catch (error) {
      return {
        valid: false,
        url: null,
        errors: [error.message],
      };
    }
  }

  function generateValidationReport(result) {
    const report = [];
    report.push('═══ VALIDERINGSRAPPORT ═══');
    report.push('');

    if (!result.valid) {
      report.push('[ERROR] URL generation misslyckades');
      report.push('');
      result.errors.forEach((e) => report.push(`  ${e}`));
      return report;
    }

    report.push('[OK] Giltig URL');
    report.push('');
    report.push('Parameters:');
    report.push(`  Service: ${elements.service?.value || 'WMS'}`);
    report.push(`  Layer: ${elements.layer?.value || '(inget)'}`);
    report.push(`  Format: ${elements.format?.value || 'image/png'}`);
    report.push(`  CRS: ${elements.crs?.value || 'EPSG:3008'}`);

    if (elements.bbox?.value) {
      report.push(`  BBOX: ${elements.bbox.value}`);
    }

    return report;
  }

  function actionGenerate() {
    const result = generateUrl();
    const report = generateValidationReport(result);
    appState.setReport(TOOL_KEY, report);

    if (!result.valid) {
      if (elements.output) elements.output.value = '';
      updateStatus(`Fel: ${result.errors[0]}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Generation misslyckades: ${result.errors[0]}`);
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

    const success = await copyToClipboard(url);
    if (success) {
      updateStatus('Kopierat.');
      appState.addLog(TOOL_KEY, 'OK', 'URL kopierad');
    } else {
      updateStatus('Kopieringen misslyckades.');
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
      new URL(url);
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

    const curl = `curl "${url}"`;
    const success = await copyToClipboard(curl);
    if (success) {
      updateStatus('Curl kopierad.');
      appState.addLog(TOOL_KEY, 'OK', 'Curl kopierad');
    } else {
      updateStatus('Kopieringen misslyckades.');
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

    const curl = `#!/bin/bash\n# Generated curl request\ncurl "${url}"\n`;
    downloadFile(`request-${Date.now()}.sh`, curl, 'text/plain');
    updateStatus('Curl-skript nedladdat.');
    appState.addLog(TOOL_KEY, 'OK', 'Curl-skript nedladdat');
    updateUI();
  }

  function actionExportTxt() {
    const url = elements.output?.value;
    if (!url) {
      updateStatus('Generera URL först.');
      return;
    }

    let content = '═══ WMS/WFS REQUEST ═══\n\n';
    content += `Generated: ${new Date().toLocaleString('sv-SE')}\n\n`;
    content += '─── URL ───\n';
    content += `${url}\n\n`;
    content += '─── Parameters ───\n';
    content += `Service: ${elements.service?.value || 'WMS'}\n`;
    content += `Layer: ${elements.layer?.value || '(none)'}\n`;
    content += `Format: ${elements.format?.value || 'image/png'}\n`;
    content += `CRS: ${elements.crs?.value || 'EPSG:3008'}\n`;

    if (elements.bbox?.value) {
      content += `BBOX: ${elements.bbox.value}\n`;
    }

    downloadFile(`wms-request-${Date.now()}.txt`, content, 'text/plain');
    updateStatus('TXT exporterad.');
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

  return {
    init,
    getState: () => state,
  };
})();
