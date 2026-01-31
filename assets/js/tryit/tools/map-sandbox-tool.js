/**
 * Map Sandbox Tool Module
 * Previews WMS GetMap requests
 */

const mapSandboxTool = (() => {
  const TOOL_KEY = 'mapsandbox';
/**
 * Try‑it tool module: Map Sandbox
 *
 * Purpose:
 * - Provide a simple OpenLayers preview for WMS/WMTS/XYZ sources to aid debugging.
 *
 * Expected block structure in HTML: input → actions → output → report
 * Public interface:
 * - init(block)
 *
 * Conventions:
 * - Previews may fail due to CORS or server restrictions; surface those errors to the user.
 * - Do not assume successful network access; always present a status report.
 */

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

  function normalizeParams(params) {
    const normalized = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      normalized[key.toUpperCase()] = value;
    });
    return normalized;
  }

  function validateWmsGetMapParams(params) {
    const report = createValidationReport(true);

    const service = params.SERVICE || '';
    const request = params.REQUEST || '';
    const layers = params.LAYERS || '';
    const crs = params.CRS || params.SRS || '';
    const bbox = params.BBOX || '';
    const width = params.WIDTH || '';
    const height = params.HEIGHT || '';
    const format = params.FORMAT || '';

    if (!service) {
      addReportError(report, 'wms.missingParam', 'SERVICE saknas', 'SERVICE');
    } else if (service.toUpperCase() !== 'WMS') {
      addReportError(report, 'wms.invalidService', 'SERVICE måste vara WMS', 'SERVICE');
    }

    if (!request) {
      addReportError(report, 'wms.missingParam', 'REQUEST saknas', 'REQUEST');
    } else if (request.toUpperCase() !== 'GETMAP') {
      addReportError(report, 'wms.invalidRequest', 'REQUEST måste vara GetMap', 'REQUEST');
    }

    if (!layers) {
      addReportError(report, 'wms.missingParam', 'LAYERS saknas', 'LAYERS');
    }

    if (!crs) {
      addReportError(report, 'wms.missingParam', 'CRS/SRS saknas', 'CRS/SRS');
    }

    if (!bbox) {
      addReportError(report, 'wms.missingParam', 'BBOX saknas', 'BBOX');
    } else {
      const parts = bbox.split(',').map((v) => Number(v.trim()));
      if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
        addReportError(report, 'wms.invalidBbox', 'BBOX måste innehålla 4 tal', 'BBOX');
      }
    }

    if (!width) {
      addReportError(report, 'wms.missingParam', 'WIDTH saknas', 'WIDTH');
    } else if (!Number.isFinite(Number(width)) || Number(width) <= 0) {
      addReportError(report, 'wms.invalidSize', 'WIDTH måste vara > 0', 'WIDTH');
    }

    if (!height) {
      addReportError(report, 'wms.missingParam', 'HEIGHT saknas', 'HEIGHT');
    } else if (!Number.isFinite(Number(height)) || Number(height) <= 0) {
      addReportError(report, 'wms.invalidSize', 'HEIGHT måste vara > 0', 'HEIGHT');
    }

    if (!format) {
      addReportError(report, 'wms.missingParam', 'FORMAT saknas', 'FORMAT');
    }

    return report;
  }

  function mergeReports(baseReport, techReport) {
    const report = createValidationReport(baseReport.ok && techReport.ok);
    report.errors = [...baseReport.errors, ...techReport.errors];
    report.warnings = [...baseReport.warnings, ...techReport.warnings];
    report.fixesApplied = [...baseReport.fixesApplied, ...techReport.fixesApplied];
    report.meta = { ...baseReport.meta, ...techReport.meta };
    if (report.errors.length > 0) report.ok = false;
    return report;
  }

  function buildTechReport({
    status,
    contentType,
    durationMs,
    corsLikely,
    timedOut,
    decodeError,
    fetchError,
  }) {
    const report = createValidationReport(true);

    if (timedOut) {
      addReportError(report, 'mapsandbox.timeout', 'Tidsgräns överskreds');
    }

    if (corsLikely) {
      addReportWarning(report, 'mapsandbox.corsLikely', 'CORS-blockering trolig');
    }

    if (decodeError) {
      addReportError(report, 'mapsandbox.decodeError', 'Bild kunde inte avkodas');
    }

    if (fetchError && !timedOut) {
      addReportWarning(report, 'mapsandbox.fetchError', 'Kunde inte hämta resurs');
    }

    if (status && (status < 200 || status >= 300)) {
      addReportWarning(report, 'mapsandbox.httpStatus', `HTTP-status ${status}`);
    }

    report.meta.httpStatus = status ?? 'okänt';
    report.meta.contentType = contentType || 'okänt';
    report.meta.durationMs = Number.isFinite(durationMs) ? Math.round(durationMs) : 'okänt';
    report.meta.corsLikely = corsLikely ? 'ja' : 'nej';
    report.meta.timeout = timedOut ? 'ja' : 'nej';
    report.meta.decodeError = decodeError ? 'ja' : 'nej';

    return report;
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

    if (!['http:', 'https:'].includes(parseResult.url.protocol.toLowerCase())) {
      updateStatus('Endast http/https tillåts');
      const report = createValidationReport(false);
      addReportError(report, 'URL_INVALID_PROTOCOL', 'Endast http/https tillåts');
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    state.lastUrl = urlString;

    const normalizedParams = normalizeParams(parseResult.params);
    const wmsReport = validateWmsGetMapParams(normalizedParams);
    wmsReport.meta.parameters = normalizedParams;
    appState.setReport(TOOL_KEY, wmsReport);
    if (!wmsReport.ok) {
      updateStatus('WMS-parametrar saknas eller är ogiltiga');
    }

    // Display parsed parameters
    if (elements.paramsEl) {
      const paramsText = Object.entries(normalizedParams)
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
        if (elements.previewImg.decode) {
          elements.previewImg
            .decode()
            .then(() => {
              updateStatus('Förhandsvisning laddad');
              appState.addLog(TOOL_KEY, 'OK', 'Bild laddad');
            })
            .catch(() => {
              updateStatus('Bild kunde inte avkodas');
              const report = buildTechReport({ decodeError: true });
              appState.setReport(TOOL_KEY, report);
              appState.addLog(TOOL_KEY, 'ERROR', 'Bild kunde inte avkodas');
              updateUI();
            });
        } else {
          updateStatus('Förhandsvisning laddad');
          appState.addLog(TOOL_KEY, 'OK', 'Bild laddad');
        }
      };

      elements.previewImg.onerror = () => {
        if (elements.fallback) elements.fallback.style.display = 'block';
        elements.previewImg.style.display = 'none';
        updateStatus('Kunde inte ladda bild');
        const report = buildTechReport({ corsLikely: true, fetchError: true });
        appState.setReport(TOOL_KEY, report);
        appState.addLog(TOOL_KEY, 'ERROR', 'Bildladdning misslyckades');
        updateUI();
      };
    }

    const safeUrl = safeUrlForLog(urlString);
    appState.addLog(TOOL_KEY, 'INFO', `Förhandsgranskar: ${safeUrl}`);

    const t0 = performance.now();
    fetchWithTimeout(urlString, 8000, { method: 'GET' }).then((result) => {
      const durationMs = performance.now() - t0;

      if (!result.ok) {
        const corsLikely = result.error && result.error.name === 'TypeError' && !result.timedOut;
        const techReport = buildTechReport({
          durationMs,
          corsLikely,
          timedOut: result.timedOut,
          fetchError: result.error,
        });
        appState.setReport(TOOL_KEY, mergeReports(wmsReport, techReport));
        updateStatus(result.timedOut ? 'Förfrågan tog för lång tid' : 'Kunde inte hämta data');
        updateUI();
        return;
      }

      const status = result.response.status;
      const contentType = result.response.headers.get('content-type') || '';
      const techReport = buildTechReport({ status, contentType, durationMs });
      appState.setReport(TOOL_KEY, mergeReports(wmsReport, techReport));
      updateUI();
    });
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
