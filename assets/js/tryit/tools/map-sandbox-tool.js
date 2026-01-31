/**
 * Map Sandbox Tool Module
 * Previews WMS GetMap requests
 */

const mapSandboxTool = (() => {
  const TOOL_KEY = 'mapsandbox';

  let elements = {
    urlInput: null,
    previewImg: null,
    fallback: null,
    status: null,
    paramsEl: null,
    reportEl: null,
    logEl: null,
  };

  let state = {
    lastUrl: null,
  };

  function init(block) {
    if (!block) return false;

    elements.urlInput = block.querySelector('#mapsandbox-url');
    elements.previewImg = block.querySelector('#mapsandbox-img');
    elements.fallback = block.querySelector('#mapsandbox-fallback');
    elements.status = block.querySelector('#mapsandbox-status');
    elements.paramsEl = block.querySelector('#mapsandbox-params');
    elements.reportEl = block.querySelector('#mapsandbox-validation');
    elements.logEl = block.querySelector('#mapsandbox-runlog');

    if (!elements.urlInput || !elements.status) return false;

    block.querySelectorAll('[data-mapsandbox-action]').forEach((btn) => {
      btn.addEventListener('click', () => handleAction(btn.dataset.mapsandboxAction));
    });

    appState.addLog(TOOL_KEY, 'INFO', 'Map Sandbox initierat');
    updateUI();
    return true;
  }

  function handleAction(action) {
    switch (action) {
      case 'preview':
        actionPreview();
        break;
      case 'clear':
        actionClear();
        break;
      case 'use-urlbuilder':
        actionUseUrlbuilder();
        break;
      case 'use-bbox-url':
        actionUseBboxUrl();
        break;
    }
  }

  function parseUrl(urlString) {
    try {
      const url = new URL(urlString);
      return {
        valid: true,
        url,
        params: Object.fromEntries(url.searchParams),
      };
    } catch (error) {
      return {
        valid: false,
        url: null,
        params: null,
        error: error.message,
      };
    }
  }

  function actionPreview() {
    const urlString = elements.urlInput?.value.trim();

    if (!urlString) {
      updateStatus('Ange en WMS URL');
      appState.addLog(TOOL_KEY, 'WARN', 'URL saknas');
      const report = createValidationReport(true);
      addReportWarning(report, 'URL_MISSING_BASE', 'URL saknas');
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    const parseResult = parseUrl(urlString);

    if (!parseResult.valid) {
      updateStatus('Ogiltig URL');
      appState.addLog(TOOL_KEY, 'ERROR', `URL-parsefel: ${parseResult.error}`);
      const report = createValidationReport(false);
      addReportError(report, 'URL_INVALID_FORMAT', 'Ogiltig URL', undefined, parseResult.error);
      appState.setReport(TOOL_KEY, report);
      if (elements.previewImg) elements.previewImg.style.display = 'none';
      if (elements.fallback) elements.fallback.style.display = 'block';
      updateUI();
      return;
    }

    state.lastUrl = urlString;

    // Display parsed parameters
    if (elements.paramsEl) {
      const paramsText = Object.entries(parseResult.params)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      elements.paramsEl.textContent = paramsText;
    }

    // Attempt to load image
    if (elements.previewImg) {
      elements.previewImg.src = urlString;
      elements.previewImg.onload = () => {
        if (elements.fallback) elements.fallback.style.display = 'none';
        elements.previewImg.style.display = 'block';
        updateStatus('Förhandsvisning laddad');
        appState.addLog(TOOL_KEY, 'OK', 'Bild laddad');
      };

      elements.previewImg.onerror = () => {
        if (elements.fallback) elements.fallback.style.display = 'block';
        elements.previewImg.style.display = 'none';
        updateStatus('Kunde inte ladda bild (CORS/server-fel)');
        appState.addLog(TOOL_KEY, 'ERROR', 'Bildladdning misslyckades');
      };
    }

    const validationReport = createValidationReport(true);
    validationReport.meta.parameters = parseResult.params;
    appState.setReport(TOOL_KEY, validationReport);
    updateUI();
  }

  function actionClear() {
    if (elements.urlInput) elements.urlInput.value = '';
    if (elements.previewImg) {
      elements.previewImg.src = '';
      elements.previewImg.style.display = 'none';
    }
    if (elements.fallback) elements.fallback.style.display = 'none';
    if (elements.paramsEl) elements.paramsEl.textContent = '';
    updateStatus('');
    state.lastUrl = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  function actionUseUrlbuilder() {
    const urlOutput = document.getElementById('urlbuilder-output');
    if (urlOutput && urlOutput.value) {
      if (elements.urlInput) elements.urlInput.value = urlOutput.value;
      updateStatus('URL från URL builder inladdad');
      appState.addLog(TOOL_KEY, 'INFO', 'URL från URL builder laddad');
      actionPreview();
    } else {
      updateStatus('Generera URL i URL builder först');
      appState.addLog(TOOL_KEY, 'WARN', 'URL builder URL saknas');
    }
    updateUI();
  }

  function actionUseBboxUrl() {
    const bboxUrlOutput = document.getElementById('bbox-url-output');
    if (bboxUrlOutput && bboxUrlOutput.value) {
      if (elements.urlInput) elements.urlInput.value = bboxUrlOutput.value;
      updateStatus('URL från BBOX-verktyg inladdad');
      appState.addLog(TOOL_KEY, 'INFO', 'URL från BBOX laddad');
      actionPreview();
    } else {
      updateStatus('Generera URL i BBOX-verktyg först');
      appState.addLog(TOOL_KEY, 'WARN', 'BBOX URL saknas');
    }
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
