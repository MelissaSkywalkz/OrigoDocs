/**
 * SLD Tool Module
 * Validates and formats SLD (Styled Layer Descriptor) documents
 */

const sldTool = (() => {
  const TOOL_KEY = 'sld';

  let elements = {
    input: null,
    output: null,
    status: null,
    reportEl: null,
    logEl: null,
    normalizedEl: null,
    fixesDiv: null,
  };

  let state = {
    lastValidSld: null,
    lastParsedDoc: null,
  };

  function init(block) {
    if (!block) return false;

    elements.input = block.querySelector('#sld-tryit-input');
    elements.output = block.querySelector('#sld-tryit-output');
    elements.status = block.querySelector('#sld-tryit-status');
    elements.reportEl = block.querySelector('#sld-validation');
    elements.logEl = block.querySelector('#sld-runlog');
    elements.normalizedEl = block.querySelector('#sld-normalized');
    elements.fixesDiv = block.querySelector('#sld-fixes');

    if (!elements.input || !elements.output || !elements.status) return false;

    block.querySelectorAll('[data-sld-action]').forEach((btn) => {
      btn.addEventListener('click', () => handleAction(btn.dataset.sldAction));
    });

    appState.addLog(TOOL_KEY, 'INFO', 'SLD-verktyg initierat');
    updateUI();
    return true;
  }

  function handleAction(action) {
    switch (action) {
      case 'check':
        actionCheck();
        break;
      case 'lint':
        actionLint();
        break;
      case 'template':
        actionLoadTemplate();
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
      case 'export-sld':
        actionExportSld();
        break;
      case 'export-txt':
        actionExportTxt();
        break;
      case 'export-lint-txt':
        actionExportLintTxt();
        break;
      case 'copy-lint':
        actionCopyLint();
        break;
    }
  }

  function parseSld() {
    const text = elements.input.value.trim();

    if (!text) {
      return { valid: false, doc: null, error: 'SLD tomt' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');

    if (doc.querySelector('parsererror')) {
      return {
        valid: false,
        doc: null,
        error: 'XML-parsefel',
      };
    }

    return { valid: true, doc, error: null };
  }

  function validateSld(doc) {
    const report = createValidationReport(true);

    // Check for StyledLayerDescriptor
    if (!doc.querySelector('StyledLayerDescriptor')) {
      addReportError(report, 'SLD_MISSING_ROOT', 'StyledLayerDescriptor saknas');
    }

    // Check for NamedLayer
    const namedLayers = doc.querySelectorAll('NamedLayer');
    if (namedLayers.length === 0) {
      addReportError(report, 'SLD_MISSING_LAYER', 'NamedLayer saknas');
    }

    // Check for UserStyle
    const userStyles = doc.querySelectorAll('UserStyle');
    if (userStyles.length === 0) {
      addReportError(report, 'SLD_MISSING_STYLE', 'UserStyle saknas');
    }

    // Check for FeatureTypeStyle
    const fts = doc.querySelectorAll('FeatureTypeStyle');
    if (fts.length === 0) {
      addReportError(report, 'SLD_MISSING_FEATURETYPESTYLE', 'FeatureTypeStyle saknas');
    }

    // Check for Symbolizers
    const symbolizers = doc.querySelectorAll(
      'PointSymbolizer, LineSymbolizer, PolygonSymbolizer, TextSymbolizer, RasterSymbolizer',
    );
    if (symbolizers.length === 0) {
      addReportError(report, 'SLD_MISSING_SYMBOLIZER', 'Symbolizer saknas');
    }

    report.meta.namedLayerCount = namedLayers.length;
    report.meta.userStyleCount = userStyles.length;
    report.meta.featureTypeStyleCount = fts.length;
    report.meta.symbolizerCount = symbolizers.length;

    return report;
  }

  function actionCheck() {
    const parseResult = parseSld();

    if (!parseResult.valid) {
      const report = createValidationReport(false);
      addReportError(report, 'SLD_PARSE_ERROR', `XML-parsefel: ${parseResult.error}`);
      appState.setReport(TOOL_KEY, report);
      updateStatus(`XML-parsefel: ${parseResult.error}`);
      appState.addLog(TOOL_KEY, 'ERROR', `Parse-fel: ${parseResult.error}`);
      updateUI();
      return;
    }

    const report = validateSld(parseResult.doc);
    state.lastValidSld = parseResult.doc;
    state.lastParsedDoc = parseResult.doc;

    appState.setReport(TOOL_KEY, report);
    if (elements.output) elements.output.textContent = elements.input.value;

    updateStatus(
      report.errors.length === 0 ? 'Validering OK' : `${report.errors.length} problem hittade`,
    );
    appState.addLog(
      TOOL_KEY,
      report.errors.length === 0 ? 'OK' : 'WARN',
      report.errors.length === 0 ? 'Validering OK' : `${report.errors.length} problem`,
    );
    updateUI();
  }

  function actionLint() {
    const parseResult = parseSld();

    if (!parseResult.valid) {
      const report = createValidationReport(false);
      addReportError(report, 'SLD_PARSE_ERROR', 'XML-parsefel');
      appState.setReport(TOOL_KEY, report);
      updateStatus('XML-parsefel');
      appState.addLog(TOOL_KEY, 'ERROR', 'Lint misslyckades: parse-fel');
      return;
    }

    const doc = parseResult.doc;

    // Lint checks
    const issues = [];

    // Check xmlns
    const sld = doc.documentElement;
    if (!sld.getAttribute('xmlns')) {
      issues.push('Saknad xmlns på StyledLayerDescriptor');
    }

    // Check version
    if (!sld.getAttribute('version')) {
      issues.push('Saknad version på StyledLayerDescriptor');
    }

    // Check Title
    const namedLayer = doc.querySelector('NamedLayer');
    if (namedLayer && !namedLayer.querySelector('Title')) {
      issues.push('NamedLayer saknar Title');
    }

    // Check empty rules
    const rules = doc.querySelectorAll('Rule');
    rules.forEach((rule, idx) => {
      const symbolizers = rule.querySelectorAll(
        'PointSymbolizer, LineSymbolizer, PolygonSymbolizer, TextSymbolizer',
      );
      if (symbolizers.length === 0) {
        issues.push(`Rule ${idx + 1} saknar Symbolizer`);
      }
    });

    const report = createValidationReport(true);
    issues.forEach((issue) => {
      addReportWarning(report, 'SLD_LINT_WARNING', issue);
    });

    appState.setReport(TOOL_KEY, report);
    updateStatus(issues.length === 0 ? 'Lint OK' : `${issues.length} problem`);
    appState.addLog(
      TOOL_KEY,
      issues.length === 0 ? 'OK' : 'WARN',
      `Lint: ${issues.length} problem`,
    );
    updateUI();
  }

  function actionLoadTemplate() {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.1.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>Layer</Name>
    <UserStyle>
      <Title>Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#0066ff</CssParameter>
                </Fill>
              </Mark>
              <Size>8</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

    if (elements.input) elements.input.value = template;
    updateStatus('Mall laddad');
    appState.addLog(TOOL_KEY, 'INFO', 'SLD-mall laddad');
    updateUI();
  }

  function actionPrettify() {
    const parseResult = parseSld();
    if (!parseResult.valid) {
      updateStatus('XML-parsefel');
      return;
    }

    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(parseResult.doc);

    // Basic formatting (add line breaks)
    const pretty = xml
      .replace(/></g, '>\n<')
      .split('\n')
      .map((line) => {
        const indent = line.match(/^(\s*)/)[1].length / 2;
        return '  '.repeat(Math.max(0, indent)) + line.trim();
      })
      .join('\n');

    if (elements.input) elements.input.value = pretty;
    updateStatus('Formaterad');
    appState.addLog(TOOL_KEY, 'OK', 'SLD formaterad');
    updateUI();
  }

  function actionMinify() {
    const parseResult = parseSld();
    if (!parseResult.valid) {
      updateStatus('XML-parsefel');
      return;
    }

    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(parseResult.doc);
    const minified = xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

    if (elements.input) elements.input.value = minified;
    updateStatus('Minifierad');
    appState.addLog(TOOL_KEY, 'OK', 'SLD minifierad');
    updateUI();
  }

  async function actionCopy() {
    const text = elements.input.value;
    if (!text) {
      updateStatus('Ingen data att kopiera');
      return;
    }

    const result = await copyToClipboard(text);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'SLD kopierad');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
    }
    updateUI();
  }

  function actionClear() {
    if (elements.input) elements.input.value = '';
    if (elements.output) elements.output.textContent = '';
    if (elements.normalizedEl) elements.normalizedEl.textContent = '';
    updateStatus('');
    state.lastValidSld = null;
    state.lastParsedDoc = null;
    appState.clearTool(TOOL_KEY);
    appState.addLog(TOOL_KEY, 'INFO', 'Formulär rensat');
    updateUI();
  }

  async function actionExportSld() {
    const text = elements.input.value;
    if (!text) {
      updateStatus('Ingen data');
      return;
    }

    const filename = `sld-${formatTimestamp()}.sld`;
    const result = exportFile({ filename, mime: 'application/xml', content: text });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'SLD exporterad');
    updateUI();
  }

  async function actionExportTxt() {
    const text = elements.input.value;
    if (!text) {
      updateStatus('Ingen data');
      return;
    }

    const filename = `sld-${formatTimestamp()}.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content: text });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'TXT exporterad');
    updateUI();
  }

  async function actionExportLintTxt() {
    const report = appState.getReport(TOOL_KEY);
    if (!report) {
      updateStatus('Ingen rapport');
      return;
    }

    const reportText = renderValidationReport(report).join('\n');
    const filename = `sld-${formatTimestamp()}-lint.txt`;
    const result = exportFile({ filename, mime: 'text/plain', content: reportText });
    updateStatus(result.message);
    appState.addLog(TOOL_KEY, 'OK', 'Lint-rapport exporterad');
    updateUI();
  }

  async function actionCopyLint() {
    const report = appState.getReport(TOOL_KEY);
    if (!report) {
      updateStatus('Ingen rapport');
      return;
    }

    const reportText = renderValidationReport(report).join('\n');
    const result = await copyToClipboard(reportText);
    if (result.ok) {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'OK', 'Lint-rapport kopierad');
    } else {
      updateStatus(result.message);
      appState.addLog(TOOL_KEY, 'ERROR', 'Kopieringen misslyckades');
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
