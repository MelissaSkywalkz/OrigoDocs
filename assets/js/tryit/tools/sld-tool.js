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
    fixesPreview: null,
    fixesPreviewWrapper: null,
  };

  let state = {
    lastValidSld: null,
    lastParsedDoc: null,
    fixes: [],
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
    elements.fixesPreview = block.querySelector('#sld-fixes-preview');
    elements.fixesPreviewWrapper = block.querySelector('#sld-fixes-preview-wrapper');

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
      case 'suggest-fixes':
        actionSuggestFixes();
        break;
      case 'apply-fixes':
        actionApplyFixes();
        break;
      case 'reset-fixes':
        actionResetFixes();
        break;
    }
  }

  function formatXmlForDiff(xml) {
    const reg = /(>)(<)(\/?)/g;
    let formatted = '';
    let pad = 0;
    xml
      .replace(reg, '$1\n$2$3')
      .split('\n')
      .forEach((node) => {
        let indent = 0;
        if (node.match(/^<\//)) {
          if (pad > 0) pad -= 1;
        } else if (node.match(/^<[^!?].*>$/) && !node.endsWith('/>') && !node.includes('</')) {
          indent = 1;
        }
        formatted += '  '.repeat(pad) + node + '\n';
        pad += indent;
      });
    return formatted.trim();
  }

  function diffChangedLines(beforeText, afterText) {
    const beforeLines = beforeText.split('\n');
    const afterLines = afterText.split('\n');
    const max = Math.max(beforeLines.length, afterLines.length);
    const diff = [];

    for (let i = 0; i < max; i += 1) {
      const beforeLine = beforeLines[i] ?? '';
      const afterLine = afterLines[i] ?? '';
      if (beforeLine !== afterLine) {
        if (beforeLine) diff.push(`- ${beforeLine}`);
        if (afterLine) diff.push(`+ ${afterLine}`);
      }
    }

    return diff.length ? diff.join('\n') : 'Inga ändringar.';
  }

  function buildFixes(doc) {
    const fixes = [];
    const root = doc.documentElement;

    if (root && !root.getAttribute('xmlns')) {
      fixes.push({
        id: 'fix-xmlns',
        code: 'SLD_ADD_XMLNS',
        label: 'Lägg till xmlns på StyledLayerDescriptor',
        apply: (d) => d.documentElement.setAttribute('xmlns', 'http://www.opengis.net/sld'),
      });
    }

    if (root && !root.getAttribute('version')) {
      fixes.push({
        id: 'fix-version',
        code: 'SLD_ADD_VERSION',
        label: 'Lägg till version="1.1.0"',
        apply: (d) => d.documentElement.setAttribute('version', '1.1.0'),
      });
    }

    return fixes;
  }

  function renderFixesList(fixes) {
    if (!elements.fixesDiv) return;
    elements.fixesDiv.innerHTML = '';

    if (!fixes.length) {
      elements.fixesDiv.textContent = 'Inga fixes hittades.';
      return;
    }

    const list = document.createElement('div');
    fixes.forEach((fix) => {
      const row = document.createElement('label');
      row.style.display = 'flex';
      row.style.gap = '0.5rem';
      row.style.alignItems = 'center';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.fixId = fix.id;
      checkbox.addEventListener('change', () => updateFixPreview());

      const text = document.createElement('span');
      text.textContent = fix.label;

      row.appendChild(checkbox);
      row.appendChild(text);
      list.appendChild(row);
    });

    elements.fixesDiv.appendChild(list);
  }

  function getSelectedFixes() {
    if (!elements.fixesDiv) return [];
    const selected = Array.from(elements.fixesDiv.querySelectorAll('input[type="checkbox"]'))
      .filter((el) => el.checked)
      .map((el) => el.dataset.fixId);
    return state.fixes.filter((fix) => selected.includes(fix.id));
  }

  function updateFixPreview() {
    if (!elements.fixesPreview || !elements.fixesPreviewWrapper) return;

    const selected = getSelectedFixes();
    if (!selected.length) {
      elements.fixesPreviewWrapper.style.display = 'none';
      elements.fixesPreview.textContent = '';
      return;
    }

    const parseResult = parseSld();
    if (!parseResult.valid) {
      elements.fixesPreviewWrapper.style.display = 'none';
      elements.fixesPreview.textContent = '';
      return;
    }

    const serializer = new XMLSerializer();
    const before = formatXmlForDiff(serializer.serializeToString(parseResult.doc));

    const cloned = parseResult.doc.cloneNode(true);
    selected.forEach((fix) => fix.apply(cloned));
    const after = formatXmlForDiff(serializer.serializeToString(cloned));

    elements.fixesPreviewWrapper.style.display = 'block';
    elements.fixesPreview.textContent = diffChangedLines(before, after);
  }

  function actionSuggestFixes() {
    const parseResult = parseSld();
    if (!parseResult.valid) {
      updateStatus('Validera SLD först');
      return;
    }

    state.fixes = buildFixes(parseResult.doc);
    renderFixesList(state.fixes);
    updateFixPreview();
    updateStatus('Fixes uppdaterade.');
    appState.addLog(TOOL_KEY, 'INFO', `Fixes hittade: ${state.fixes.length}`);
    updateUI();
  }

  function actionApplyFixes() {
    const parseResult = parseSld();
    if (!parseResult.valid) {
      updateStatus('Validera SLD först');
      return;
    }

    const selected = getSelectedFixes();
    if (!selected.length) {
      updateStatus('Inga fixes valda');
      return;
    }

    const doc = parseResult.doc.cloneNode(true);
    selected.forEach((fix) => fix.apply(doc));

    const serializer = new XMLSerializer();
    const updated = formatXmlForDiff(serializer.serializeToString(doc));
    if (elements.input) elements.input.value = updated;

    const report = appState.getReport(TOOL_KEY) || createValidationReport(true);
    selected.forEach((fix) => {
      addReportFix(report, fix.code, fix.label);
    });
    appState.setReport(TOOL_KEY, report);

    updateStatus('Fixes applicerade');
    appState.addLog(TOOL_KEY, 'OK', `Fixes applicerade: ${selected.length}`);
    updateFixPreview();
    updateUI();
  }

  function actionResetFixes() {
    state.fixes = [];
    if (elements.fixesDiv) elements.fixesDiv.textContent = '';
    if (elements.fixesPreview) elements.fixesPreview.textContent = '';
    if (elements.fixesPreviewWrapper) elements.fixesPreviewWrapper.style.display = 'none';
    updateStatus('Fixes återställda');
    appState.addLog(TOOL_KEY, 'INFO', 'Fixes återställda');
    updateUI();
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
    const text = elements.input.value.trim();
    if (!text) {
      updateStatus('SLD tomt');
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    const parserError = doc.querySelector('parsererror');

    if (parserError || !doc.documentElement) {
      const report = createValidationReport(false);
      addReportError(report, 'SLD_LINT_PARSE_ERROR', 'XML-parsefel');
      appState.setReport(TOOL_KEY, report);
      updateStatus('XML-parsefel');
      appState.addLog(TOOL_KEY, 'ERROR', 'Lint misslyckades: parse-fel');
      updateUI();
      return;
    }

    const report = createValidationReport(true);
    const root = doc.documentElement;

    if (!root.getAttribute('xmlns') && !root.namespaceURI) {
      addReportWarning(
        report,
        'SLD_LINT_MISSING_NAMESPACE',
        'Saknad xmlns på StyledLayerDescriptor',
      );
    }

    if (!root.getAttribute('version')) {
      addReportWarning(report, 'SLD_LINT_MISSING_VERSION', 'Saknad version på StyledLayerDescriptor');
    }

    const namedLayer = doc.querySelector('NamedLayer');
    if (namedLayer && !namedLayer.querySelector('Title')) {
      addReportWarning(report, 'SLD_LINT_MISSING_TITLE', 'NamedLayer saknar Title');
    }

    const rules = doc.querySelectorAll('Rule');
    rules.forEach((rule, idx) => {
      const symbolizers = rule.querySelectorAll(
        'PointSymbolizer, LineSymbolizer, PolygonSymbolizer, TextSymbolizer, RasterSymbolizer',
      );

      if (!rule.closest('FeatureTypeStyle')) {
        addReportWarning(
          report,
          'SLD_LINT_INVALID_RULE_STRUCTURE',
          `Rule ${idx + 1} saknar FeatureTypeStyle`,
        );
      }

      if (rule.querySelector('Filter') && rule.querySelector('ElseFilter')) {
        addReportWarning(
          report,
          'SLD_LINT_INVALID_RULE_STRUCTURE',
          `Rule ${idx + 1} har både Filter och ElseFilter`,
        );
      }

      if (symbolizers.length === 0) {
        addReportWarning(
          report,
          'SLD_LINT_INVALID_RULE_STRUCTURE',
          `Rule ${idx + 1} saknar Symbolizer`,
        );
      }

      const rasterSymbolizers = rule.querySelectorAll('RasterSymbolizer');
      const vectorSymbolizers = rule.querySelectorAll(
        'PointSymbolizer, LineSymbolizer, PolygonSymbolizer, TextSymbolizer',
      );
      if (rasterSymbolizers.length > 0 && vectorSymbolizers.length > 0) {
        addReportWarning(
          report,
          'SLD_LINT_UNSUPPORTED_SYMBOLIZER_COMBINATION',
          `Rule ${idx + 1} blandar RasterSymbolizer med andra symbolizers`,
        );
      }
    });

    appState.setReport(TOOL_KEY, report);
    const total = report.warnings.length + report.errors.length;
    updateStatus(total === 0 ? 'Lint OK' : `${total} problem`);
    appState.addLog(TOOL_KEY, total === 0 ? 'OK' : 'WARN', `Lint: ${total} problem`);
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
