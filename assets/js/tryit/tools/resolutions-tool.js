/**
 * Resolutions Tool Module
 * Validates and exports resolutions for Origo & GeoWebCache
 */

const resolutionsTool = (() => {
  const TOOL_KEY = 'resolutions';

  let elements = {
    input: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
    /**
     * Try‑it tool module: Resolutions
     *
     * Purpose:
     * - Parse, validate and present tile resolution lists used by caches (WMTS/GeoWebCache).
     *
     * Expected block structure in HTML: input → actions → output → report
     * Public interface:
     * - init(block)
     *
     * Conventions:
     * - Use `ValidationReport` helpers for user messages and ensure keyboard accessibility.
     */
    previewEl: null,
  };

  let state = {
    lastValidResolutions: null,
  };

  function init(block) {
    if (!block) return false;

    elements.input = block.querySelector('#res-input');
    elements.output = block.querySelector('#res-output');
    elements.status = block.querySelector('#res-status');
    elements.reportEl = block.querySelector('#res-validation');
    elements.logEl = block.querySelector('#res-runlog');
    elements.previewEl = block.querySelector('#res-preview');

    if (!elements.input || !elements.output || !elements.status) return false;

    block.querySelectorAll('[data-res-action]').forEach((btn) => {
      btn.addEventListener('click', () => handleAction(btn.dataset.resAction));
    });

    appState.addLog(TOOL_KEY, 'INFO', 'Resolutions-verktyg initierat');
    updateUI();
    return true;
  }

  function handleAction(action) {
    switch (action) {
      case 'validate':
        validate();
        break;
      case 'export-origo':
        exportOrigo();
        break;
      case 'export-gwc':
        exportGwc();
        break;
      case 'fix':
        fixResolutions();
        break;
      case 'download-origo':
        downloadOrigo();
        break;
      case 'download-gwc':
        downloadGwc();
        break;
      case 'download-report':
        downloadReport();
        break;
      case 'clear':
        actionClear();
        break;
    }
  }

  function parseResolutions() {
    const text = elements.input.value.trim();
    if (!text) return { resolutions: [], errors: [] };

    const resolutions = [];
    const errors = [];

    text.split('\n').forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const cleaned = trimmed.replace(/,/g, '').trim();
      const val = parseFloat(cleaned);

      if (isNaN(val) || !isFinite(val) || val <= 0) {
        errors.push({ line: idx + 1, text: trimmed });
      } else {
        resolutions.push(val);
      }
    });

    return { resolutions, errors };
  }

  function validate() {
    const { resolutions, errors } = parseResolutions();

    if (errors.length > 0) {
      const report = createValidationReport(false);
      errors.forEach((err) => {
        addReportError(
          report,
          'RESOLUTION_INVALID_FORMAT',
          `Ogiltigt värde på rad ${err.line}: ${err.text}`,
          `rad ${err.line}`,
        );
      });
      updateStatus(`Parse-fel på ${errors.length} rader`);
      appState.addLog(TOOL_KEY, 'ERROR', `Parse-fel: ${errors.length} rader`);
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    if (resolutions.length === 0) {
      const report = createValidationReport(true);
      addReportWarning(report, 'RESOLUTION_EMPTY_INPUT', 'Ingen data att validera');
      updateStatus('Ingen data');
      appState.addLog(TOOL_KEY, 'WARN', 'Ingen data att validera');
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    // Check ordering & duplicates
    const unique = new Set(resolutions);
    const report = createValidationReport(true);

    if (unique.size < resolutions.length) {
      const duplicateCount = resolutions.length - unique.size;
      addReportWarning(report, 'RESOLUTION_DUPLICATE', `${duplicateCount} dubbletter`);
    }

    let isDescending = true;
    for (let i = 0; i < resolutions.length - 1; i++) {
      if (resolutions[i] <= resolutions[i + 1]) {
        isDescending = false;
        break;
      }
    }

    if (!isDescending) {
      addReportWarning(report, 'RESOLUTION_OUT_OF_ORDER', 'Inte strikt fallande ordning');
    }

    report.meta.count = resolutions.length;
    report.meta.min = Math.min(...resolutions);
    report.meta.max = Math.max(...resolutions);
    report.meta.descending = isDescending;

    state.lastValidResolutions = resolutions;
    updateStatus(
      report.warnings.length === 0 ? 'Validering OK' : `Varningar: ${report.warnings.length}`,
    );
    appState.addLog(
      TOOL_KEY,
      report.warnings.length > 0 ? 'WARN' : 'OK',
      `${resolutions.length} värden`,
    );
    appState.setReport(TOOL_KEY, report);
    updateUI();
  }

  function exportOrigo() {
    const { resolutions, errors } = parseResolutions();

    if (errors.length > 0 || resolutions.length === 0) {
      updateStatus('Validera först');
      return;
    }

    const json = JSON.stringify(resolutions, null, 2);
    if (elements.output) elements.output.value = json;
    state.lastValidResolutions = resolutions;

    updateStatus('Origo JSON exporterad');
    appState.addLog(TOOL_KEY, 'OK', `Origo JSON: ${resolutions.length} värden`);
    updateUI();
  }

  function exportGwc() {
    const { resolutions, errors } = parseResolutions();

    if (errors.length > 0 || resolutions.length === 0) {
      updateStatus('Validera först');
      return;
    }

    const xml = resolutions.map((r) => `    <resolution>${r}</resolution>`).join('\n');
    if (elements.output) elements.output.value = `  <resolutions>\n${xml}\n  </resolutions>`;

    updateStatus('GWC XML exporterad');
    appState.addLog(TOOL_KEY, 'OK', `GWC XML: ${resolutions.length} värden`);
    updateUI();
  }

  function fixResolutions() {
    const { resolutions } = parseResolutions();

    if (resolutions.length === 0) {
      updateStatus('Ingen data att fixa');
      return;
    }

    const unique = Array.from(new Set(resolutions));
    const sorted = unique.sort((a, b) => b - a);

    if (elements.input) elements.input.value = sorted.join('\n');

    updateStatus(`Fixad: ${resolutions.length} → ${sorted.length}`);
    appState.addLog(TOOL_KEY, 'OK', `Lista fixad: ${resolutions.length} → ${sorted.length}`);
    validate();
  }

  function downloadOrigo() {
    if (!state.lastValidResolutions || state.lastValidResolutions.length === 0) {
      updateStatus('Validera först');
      return;
    }

    const json = JSON.stringify(state.lastValidResolutions, null, 2);
    const filename = `resolutions-${formatTimestamp()}.json`;
    const result = exportFile({ filename, mime: 'application/json', content: json });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'Origo JSON nedladdat');
    updateUI();
  }

  function downloadGwc() {
    if (!state.lastValidResolutions || state.lastValidResolutions.length === 0) {
      updateStatus('Validera först');
      return;
    }

    const xml = state.lastValidResolutions
      .map((r) => `    <resolution>${r}</resolution>`)
      .join('\n');
    const content = `  <resolutions>\n${xml}\n  </resolutions>`;
    const filename = `resolutions-${formatTimestamp()}-gwc.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'GWC format nedladdat');
    updateUI();
  }

  function downloadReport() {
    const report = appState.getReport(TOOL_KEY);
    if (!report) {
      updateStatus('Ingen rapport att ladda ner');
      return;
    }

    const reportText = renderValidationReport(report).join('\n');
    const filename = `resolutions-${formatTimestamp()}-report.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content: reportText });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'Rapport nedladdad');
    updateUI();
  }

  function actionClear() {
    if (elements.input) elements.input.value = '';
    if (elements.output) elements.output.value = '';
    updateStatus('');
    state.lastValidResolutions = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  function updateStatus(message) {
    if (elements.status) elements.status.textContent = message;
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
