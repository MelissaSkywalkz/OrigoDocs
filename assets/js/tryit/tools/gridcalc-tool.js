/**
 * Gridcalc Tool Module
 * Calculates tile sizes, cache estimates, and seed recommendations
 */

const gridcalcTool = (() => {
  const TOOL_KEY = 'gridcalc';
  // Pixel size assumption: 0.28 mm (OGC standard)
  // Resolution (m/px) = ScaleDenominator * pixelSizeMeters
  // ScaleDenominator = Resolution / pixelSizeMeters
  const PIXEL_SIZE_M = 0.00028;
  const RESOLUTION_DECIMALS = 4;
  const SCALE_DECIMALS = 0;

  let elements = {
    resolution: null,
    scale: null,
    tile: null,
    meta: null,
    bboxwidth: null,
    bboxheight: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
    tileKbInput: null,
    compressionInput: null,
    estimatorOutput: null,
  };

  let state = {
    lastCalculation: null,
  };

  function init(block) {
    if (!block) return false;

    elements.resolution = block.querySelector('#gridcalc-resolution');
    elements.scale = block.querySelector('#gridcalc-scale');
    elements.tile = block.querySelector('#gridcalc-tile');
    elements.meta = block.querySelector('#gridcalc-meta');
    elements.bboxwidth = block.querySelector('#gridcalc-bboxwidth');
    elements.bboxheight = block.querySelector('#gridcalc-bboxheight');
    elements.output = block.querySelector('#gridcalc-output');
    elements.status = block.querySelector('#gridcalc-status');
    elements.reportEl = block.querySelector('#gridcalc-validation');
    elements.logEl = block.querySelector('#gridcalc-runlog');
    elements.tileKbInput = block.querySelector('#gridcalc-tilekb');
    elements.compressionInput = block.querySelector('#gridcalc-compression');
    elements.estimatorOutput = block.querySelector('#gridcalc-estimator-output');

    if (!elements.resolution || !elements.output || !elements.status) return false;

    block.querySelectorAll('[data-gridcalc-action]').forEach((btn) => {
      btn.addEventListener('click', () => handleAction(btn.dataset.gridcalcAction));
    });

    appState.addLog(TOOL_KEY, 'INFO', 'Gridcalc-verktyg initierat');
    calculate('init');
    updateUI();
    return true;
  }

  function handleAction(action) {
    switch (action) {
      case 'from-resolution':
        fromResolution();
        break;
      case 'from-scale':
        fromScale();
        break;
      case 'estimate-cache':
        estimateCache();
        break;
      case 'preset':
        setPreset();
        break;
      case 'copy':
        copyOutput();
        break;
      case 'download-txt':
        downloadTxt();
        break;
      case 'download-json':
        downloadJson();
        break;
      case 'clear':
        actionClear();
        break;
    }
  }

  function parseInputs() {
    return {
      resolution: parseFloat(elements.resolution?.value || 0),
      scale: parseFloat(elements.scale?.value || 0),
      tile: parseFloat(elements.tile?.value || 256),
      meta: parseFloat(elements.meta?.value || 4),
      bboxwidth: parseFloat(elements.bboxwidth?.value || 100000),
      bboxheight: parseFloat(elements.bboxheight?.value || 100000),
    };
  }

  function calculate(source = 'manual') {
    const inputs = parseInputs();
    const report = createValidationReport(true);

    if (!Number.isFinite(inputs.resolution) || inputs.resolution <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Resolution måste vara > 0', 'resolution');
    }
    if (!Number.isFinite(inputs.scale) || inputs.scale <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Skala måste vara > 0', 'scale');
    }
    if (!Number.isFinite(inputs.tile) || inputs.tile <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Tile size måste vara > 0', 'tile');
    }
    if (!Number.isFinite(inputs.meta) || inputs.meta <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Metatile måste vara > 0', 'meta');
    }
    if (!Number.isFinite(inputs.bboxwidth) || inputs.bboxwidth <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'BBOX-bredd måste vara > 0', 'bboxwidth');
    }
    if (!Number.isFinite(inputs.bboxheight) || inputs.bboxheight <= 0) {
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'BBOX-höjd måste vara > 0', 'bboxheight');
    }

    if (report.errors.length > 0) {
      if (elements.output) elements.output.value = '';
      const firstError = report.errors[0]?.message || 'Ogiltig inmatning';
      updateStatus(firstError);
      appState.addLog(TOOL_KEY, 'ERROR', firstError);
      appState.setReport(TOOL_KEY, report);
      updateUI();
      return;
    }

    const tileSpanM = inputs.resolution * inputs.tile;
    const metaSpanM = tileSpanM * inputs.meta;
    const tilesX = Math.ceil(inputs.bboxwidth / tileSpanM);
    const tilesY = Math.ceil(inputs.bboxheight / tileSpanM);
    const totalTiles = tilesX * tilesY;

    let seedRec = '';
    if (totalTiles < 5000) seedRec = 'Seed hela området.';
    else if (totalTiles <= 50000) seedRec = 'Seed selektivt (prioritera kärnområde).';
    else seedRec = 'Seed vid behov.';

    const output = [
      `Resolution: ${inputs.resolution.toFixed(4)} m/px`,
      `Skala: 1:${inputs.scale.toFixed(0)}`,
      `Tile-spann (${inputs.tile}px): ${tileSpanM.toFixed(2)} m`,
      `Meta-spann (${inputs.meta}×${inputs.meta}): ${metaSpanM.toFixed(2)} m`,
      `Antal tiles: ${formatNumber(totalTiles)}`,
      `Rekommendation: ${seedRec}`,
    ].join('\n');

    if (elements.output) elements.output.value = output;

    state.lastCalculation = {
      inputs,
      derived: { tileSpanM, metaSpanM, tilesX, tilesY, totalTiles, seedRec },
    };

    updateStatus('Beräknad.');
    appState.addLog(TOOL_KEY, 'OK', `Beräkning från ${source}: ${formatNumber(totalTiles)} tiles`);

    report.meta.resolution = inputs.resolution.toFixed(4);
    report.meta.scale = inputs.scale.toFixed(0);
    report.meta.tiles = formatNumber(totalTiles);
    report.meta.tileSpanM = tileSpanM.toFixed(2);
    report.meta.metaSpanM = metaSpanM.toFixed(2);
    report.meta.seedRecommendation = seedRec;
    report.meta.pixelSizeMeters = PIXEL_SIZE_M;
    report.meta.rounding = `Resolution: ${RESOLUTION_DECIMALS} decimals, Scale: ${SCALE_DECIMALS} decimals`;

    appState.setReport(TOOL_KEY, report);
    updateUI();
  }

  function fromResolution() {
    const res = parseFloat(elements.resolution?.value || 0);
    if (!Number.isFinite(res) || res <= 0) {
      const report = createValidationReport(false);
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Resolution måste vara > 0', 'resolution');
      appState.setReport(TOOL_KEY, report);
      updateStatus('Ogiltig resolution');
      updateUI();
      return;
    }
    const scale = res / PIXEL_SIZE_M;
    if (elements.scale) elements.scale.value = scale.toFixed(SCALE_DECIMALS);
    const report = createValidationReport(true);
    addReportWarning(
      report,
      'GRIDCALC_PIXEL_SIZE_ASSUMPTION',
      'Antar pixelstorlek 0,28 mm (kan skilja mellan system)'
    );
    report.meta.rounding = `Skala avrundad till ${SCALE_DECIMALS} decimaler`;
    report.meta.pixelSizeMeters = PIXEL_SIZE_M;
    appState.setReport(TOOL_KEY, report);
    calculate('resolution');
  }

  function fromScale() {
    const scale = parseFloat(elements.scale?.value || 0);
    if (!Number.isFinite(scale) || scale <= 0) {
      const report = createValidationReport(false);
      addReportError(report, 'GRIDCALC_INVALID_NUMBER', 'Skala måste vara > 0', 'scale');
      appState.setReport(TOOL_KEY, report);
      updateStatus('Ogiltig skala');
      updateUI();
      return;
    }
    const resolution = scale * PIXEL_SIZE_M;
    if (elements.resolution) elements.resolution.value = resolution.toFixed(RESOLUTION_DECIMALS);
    const report = createValidationReport(true);
    addReportWarning(
      report,
      'GRIDCALC_PIXEL_SIZE_ASSUMPTION',
      'Antar pixelstorlek 0,28 mm (kan skilja mellan system)'
    );
    report.meta.rounding = `Resolution avrundad till ${RESOLUTION_DECIMALS} decimaler`;
    report.meta.pixelSizeMeters = PIXEL_SIZE_M;
    appState.setReport(TOOL_KEY, report);
    calculate('scale');
  }

  function setPreset() {
    if (elements.resolution) elements.resolution.value = '100';
    if (elements.scale) elements.scale.value = (100 / PIXEL_SIZE_M).toFixed(0);
    if (elements.tile) elements.tile.value = '256';
    if (elements.meta) elements.meta.value = '4';
    if (elements.bboxwidth) elements.bboxwidth.value = '100000';
    if (elements.bboxheight) elements.bboxheight.value = '100000';

    updateStatus('Preset applicerad');
    appState.addLog(TOOL_KEY, 'INFO', 'Preset 256/4x4 applicerad');
    calculate('preset');
  }

  async function copyOutput() {
    const text = elements.output?.value;
    if (!text) {
      updateStatus('Beräkna först');
      return;
    }

    const result = await copyToClipboard(text);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'Resultat kopierat');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }
    updateUI();
  }

  function estimateCache() {
    if (!state.lastCalculation) {
      updateStatus('Beräkna grid först');
      return;
    }

    const tileKb = parseFloat(elements.tileKbInput?.value || 20);
    const compression = parseFloat(elements.compressionInput?.value || 1.0);

    if (!Number.isFinite(tileKb) || tileKb <= 0) {
      updateStatus('Ogiltig tile-storlek (KB)');
      return;
    }

    if (!Number.isFinite(compression) || compression <= 0) {
      updateStatus('Ogiltig komprimeringsfaktor');
      return;
    }

    const formatBigInt = (value) => {
      const str = value.toString();
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const bytesToHuman = (bytesBig) => {
      const KB = 1024n;
      const MB = KB * 1024n;
      const GB = MB * 1024n;

      const asNumber = (big) => Number(big) / 1024 / 1024 / 1024;

      if (bytesBig >= GB) {
        return { label: `${asNumber(bytesBig).toFixed(2)} GB`, gb: asNumber(bytesBig) };
      }
      if (bytesBig >= MB) {
        return { label: `${(Number(bytesBig) / 1024 / 1024).toFixed(2)} MB`, gb: asNumber(bytesBig) };
      }
      if (bytesBig >= KB) {
        return { label: `${(Number(bytesBig) / 1024).toFixed(2)} KB`, gb: asNumber(bytesBig) };
      }

      return { label: `${bytesBig.toString()} B`, gb: asNumber(bytesBig) };
    };

    const totalTilesNum = state.lastCalculation.derived.totalTiles;
    const totalTiles = BigInt(Math.max(0, Math.round(totalTilesNum)));

    const bytesPerTile = BigInt(Math.max(1, Math.round(tileKb * 1024)));
    const compressionScale = 1000n;
    const compressionScaled = BigInt(Math.max(1, Math.round(compression * Number(compressionScale))));

    const totalBytes = (totalTiles * bytesPerTile * compressionScaled) / compressionScale;
    const human = bytesToHuman(totalBytes);
    const warnThresholdGb = 50;
    const warnOver = Number.isFinite(human.gb) && human.gb > warnThresholdGb;

    const estimatorText = [
      'Cache Estimator Report',
      '',
      `Avg tile size: ${tileKb} KB`,
      `Compression: ${compression}x`,
      `Total tiles: ${formatBigInt(totalTiles)}`,
      `Estimated size: ${human.label}`,
      warnOver ? `Warning: Estimate exceeds ${warnThresholdGb} GB` : 'Warning: None',
    ].join('\n');

    if (elements.estimatorOutput) elements.estimatorOutput.textContent = estimatorText;

    updateStatus(warnOver ? 'Cache-estimat klart (stor volym)' : 'Cache-estimat beräknat');
    appState.addLog(TOOL_KEY, 'OK', `Cache-estimat: ${human.label}`);
    updateUI();
  }

  function downloadTxt() {
    if (!state.lastCalculation) {
      updateStatus('Beräkna först');
      return;
    }

    const inp = state.lastCalculation.inputs;
    const der = state.lastCalculation.derived;

    const content = [
      '═══ GRIDCALC RAPPORT ═══',
      '',
      'INMATNING:',
      `  Resolution: ${inp.resolution.toFixed(4)} m/px`,
      `  Skala: 1:${inp.scale.toFixed(0)}`,
      `  Tile-storlek: ${inp.tile} px`,
      `  Metatile: ${inp.meta}×${inp.meta}`,
      `  BBOX: ${inp.bboxwidth.toFixed(0)} × ${inp.bboxheight.toFixed(0)} m`,
      '',
      'BERÄKNAT:',
      `  Tile-spann: ${der.tileSpanM.toFixed(2)} m`,
      `  Meta-spann: ${der.metaSpanM.toFixed(2)} m`,
      `  Tiles X/Y: ${der.tilesX} / ${der.tilesY}`,
      `  Antal tiles: ${formatNumber(der.totalTiles)}`,
      `  Rekommendation: ${der.seedRec}`,
    ].join('\n');

    const filename = `gridcalc-${formatTimestamp()}.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'TXT nedladdat');
    updateUI();
  }

  function downloadJson() {
    if (!state.lastCalculation) {
      updateStatus('Beräkna först');
      return;
    }

    const jsonData = {
      ...state.lastCalculation,
    };

    const filename = `gridcalc-${formatTimestamp()}.json`;
    const result = exportFile({
      filename,
      mime: 'application/json',
      content: JSON.stringify(jsonData, null, 2),
    });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'JSON nedladdat');
    updateUI();
  }

  function actionClear() {
    if (elements.resolution) elements.resolution.value = '100';
    if (elements.tile) elements.tile.value = '256';
    if (elements.meta) elements.meta.value = '4';
    if (elements.bboxwidth) elements.bboxwidth.value = '100000';
    if (elements.bboxheight) elements.bboxheight.value = '100000';
    if (elements.output) elements.output.value = '';
    if (elements.estimatorOutput) elements.estimatorOutput.textContent = '';
    updateStatus('');
    state.lastCalculation = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  function updateStatus(message) {
    if (elements.status) elements.status.textContent = message;
  }

  function updateUI() {
    if (elements.reportEl) renderReport(elements.reportEl, appState.getReport(TOOL_KEY));
    if (elements.logEl) renderRunLog(elements.logEl, appState.getLogs(TOOL_KEY));
  }

  return { init, getState: () => state };
})();
