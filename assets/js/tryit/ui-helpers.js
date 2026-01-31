/**
 * TryIt UI Helpers - Shared utilities for all tools
 *
 * Provides:
 * - Unified ValidationReport type and rendering
 * - Status message rendering
 * - Validation report rendering
 * - Run log management
 * - File downloads
 * - Text copy utilities
 */

/**
 * Unified ValidationReport Type
 * @typedef {Object} ValidationReport
 * @property {boolean} ok - True if validation passed
 * @property {Array<{code: string, message: string, field?: string, details?: string}>} errors - Array of errors
 * @property {Array<{code: string, message: string, field?: string, details?: string}>} warnings - Array of warnings
 * @property {Array<{code: string, description: string}>} fixesApplied - Fixes that were auto-applied
 * @property {Object} meta - Additional metadata (tool-specific)
 *
 * Error codes must be in English and uppercase (e.g., JSON_PARSE_ERROR, BBOX_OUT_OF_RANGE)
 * Messages rendered to UI should be Swedish
 */

/**
 * Swedish translations for common error/warning codes
 * Maps English codes to Swedish UI labels
 */
const ERROR_CODE_LABELS = {
  // JSON Tool
  JSON_PARSE_ERROR: 'JSON-parsefel',
  JSON_EMPTY_INPUT: 'Ingen input',
  GEOJSON_INVALID_COORDS: 'Ogiltiga koordinater',
  GEOJSON_COORD_ORDER: 'Koordinater verkar vara omvända',
  GEOJSON_EMPTY: 'Inga koordinater hittade',

  // URL Builder
  URL_INVALID_FORMAT: 'Ogiltigt URL-format',
  URL_MISSING_BASE: 'Bas-URL saknas',
  URL_MISSING_LAYER: 'Layer saknas',
  URL_INVALID_PROTOCOL: 'Ogiltigt protokoll',
  URL_MISSING_SERVICE: 'Service-parameter saknas',
  URL_MISSING_REQUEST: 'Request-parameter saknas',
  URL_MISSING_BBOX: 'BBOX saknas',
  URL_MISSING_CRS: 'CRS/SRS saknas',
  URL_MISSING_FORMAT: 'Format saknas',
  URL_INVALID_BBOX: 'BBOX-format ogiltigt',
  URL_MISSING_PARAM: 'Parameter saknas',
  'wms.missingParam': 'Obligatorisk parameter saknas',
  'wms.invalidService': 'SERVICE måste vara WMS',
  'wms.invalidRequest': 'REQUEST måste vara GetMap',
  'wms.invalidBbox': 'BBOX måste innehålla 4 tal',
  'wms.invalidSize': 'WIDTH/HEIGHT måste vara > 0',

  // BBOX Tool
  BBOX_EMPTY_INPUT: 'Ingen input',
  BBOX_INVALID_FORMAT: 'BBOX måste innehålla 4 värden',
  BBOX_INVALID_NUMBER: 'BBOX-värden måste vara tal',
  BBOX_OUT_OF_RANGE: 'BBOX-värden utanför giltigt område',
  BBOX_MIN_MAX_REVERSED: 'Min/Max är omkastade',
  'bbox.nonNumeric': 'BBOX-värden måste vara tal',
  'bbox.invalidFormat': 'BBOX måste innehålla exakt 4 värden',
  'bbox.outOfRange': 'BBOX-värden utanför giltigt område',
  'bbox.axisSwapped': 'Min/Max var omkastade',

  // Resolutions Tool
  RESOLUTION_EMPTY_INPUT: 'Ingen input',
  RESOLUTION_INVALID_FORMAT: 'Ogiltigt format',
  RESOLUTION_DUPLICATE: 'Duplikat resolution',
  RESOLUTION_OUT_OF_ORDER: 'Resolutioner inte i ordning',
  RESOLUTION_INVALID_VALUE: 'Resolution måste vara > 0',

  // Gridcalc Tool
  GRIDCALC_INVALID_INPUT: 'Ogiltig inmatning',
  GRIDCALC_INVALID_NUMBER: 'Värde måste vara tal',
  GRIDCALC_VALUE_TOO_SMALL: 'Värde för litet',
  GRIDCALC_VALUE_TOO_LARGE: 'Värde för stort',

  // SLD Tool
  SLD_PARSE_ERROR: 'XML-parsefel',
  SLD_EMPTY_INPUT: 'Ingen input',
  SLD_MISSING_ROOT: 'StyledLayerDescriptor saknas',
  SLD_MISSING_LAYER: 'NamedLayer eller UserLayer saknas',
  SLD_MISSING_STYLE: 'UserStyle saknas',
  SLD_MISSING_RULE: 'Rule saknas',
  SLD_MISSING_FEATURETYPESTYLE: 'FeatureTypeStyle saknas',
  SLD_INVALID_SCALE: 'Ogiltig scale-konfiguration',
  SLD_MISSING_SYMBOLIZER: 'Symbolizer saknas',
  SLD_MISSING_NAMESPACE: 'Namespace saknas',
  SLD_LINT_WARNING: 'Lint-varning',

  // Gridset Tool
  GRIDSET_INVALID_EXTENT: 'Ogiltig extent',
  GRIDSET_INVALID_RESOLUTION: 'Ogiltig resolution',
  GRIDSET_INVALID_TILES: 'Ogiltig tile-konfiguration',
};

/**
 * Create a new ValidationReport
 * @param {boolean} ok
 * @returns {ValidationReport}
 */
function createValidationReport(ok = true) {
  return {
    ok,
    errors: [],
    warnings: [],
    fixesApplied: [],
    meta: {},
  };
}

/**
 * Add error to ValidationReport
 * @param {ValidationReport} report
 * @param {string} code - English error code (e.g., JSON_PARSE_ERROR)
 * @param {string} message - Swedish message
 * @param {string} field - Optional field name
 * @param {string} details - Optional additional details
 */
function addReportError(report, code, message, field, details) {
  report.ok = false;
  report.errors.push({
    code,
    message,
    field: field || undefined,
    details: details || undefined,
  });
}

/**
 * Add warning to ValidationReport
 * @param {ValidationReport} report
 * @param {string} code - English warning code
 * @param {string} message - Swedish message
 * @param {string} field - Optional field name
 * @param {string} details - Optional additional details
 */
function addReportWarning(report, code, message, field, details) {
  report.warnings.push({
    code,
    message,
    field: field || undefined,
    details: details || undefined,
  });
}

/**
 * Add applied fix to ValidationReport
 * @param {ValidationReport} report
 * @param {string} code - Fix code (e.g., BBOX_NORMALIZED, RESOLUTION_SORTED)
 * @param {string} description - Swedish description
 */
function addReportFix(report, code, description) {
  report.fixesApplied.push({
    code,
    description,
  });
}

/**
 * Render ValidationReport to formatted string array
 * @param {ValidationReport} report
 * @returns {string[]}
 */
function renderValidationReport(report) {
  const lines = [];

  // Header
  lines.push('═══ VALIDERINGSRAPPORT ═══');
  lines.push('');

  // Status line
  if (report.errors.length > 0) {
    lines.push('[ERROR] Validering misslyckades');
  } else if (report.warnings.length > 0) {
    lines.push('[WARN] Godkänd med varningar');
  } else {
    lines.push('[OK] Validering godkänd');
  }

  lines.push('');

  // Errors section
  if (report.errors.length > 0) {
    lines.push('Fel:');
    report.errors.forEach((err) => {
      const label = err.message || ERROR_CODE_LABELS[err.code] || err.code;
      lines.push(`  [${err.code}] ${label}`);
      if (err.field) lines.push(`    Fält: ${err.field}`);
      if (err.details) lines.push(`    Detaljer: ${err.details}`);
    });
    lines.push('');
  }

  // Warnings section
  if (report.warnings.length > 0) {
    lines.push('Varningar:');
    report.warnings.forEach((warn) => {
      const label = warn.message || ERROR_CODE_LABELS[warn.code] || warn.code;
      lines.push(`  [${warn.code}] ${label}`);
      if (warn.field) lines.push(`    Fält: ${warn.field}`);
      if (warn.details) lines.push(`    Detaljer: ${warn.details}`);
    });
    lines.push('');
  }

  // Fixes applied section
  if (report.fixesApplied.length > 0) {
    lines.push('Tillämpad korrigering:');
    report.fixesApplied.forEach((fix) => {
      lines.push(`  [${fix.code}] ${fix.description}`);
    });
    lines.push('');
  }

  // Meta section (if present)
  if (Object.keys(report.meta).length > 0) {
    lines.push('Metadata:');
    Object.entries(report.meta).forEach(([key, value]) => {
      const displayValue = typeof value === 'object' ? JSON.stringify(value) : value;
      lines.push(`  ${key}: ${displayValue}`);
    });
  }

  return lines;
}

/**
 * Update tool status element
 * @param {HTMLElement} element - Status display element
 * @param {string} message - Status message
 */
function updateStatus(element, message) {
  if (element) {
    element.textContent = message;
  }
}

/**
 * Render validation report to DOM element
 * Accepts either ValidationReport object or string array for backwards compatibility
 * @param {HTMLElement} element - Report container
 * @param {ValidationReport|string[]} reportOrLines - Report object or string array
 */
function renderReport(element, reportOrLines) {
  if (!element) return;

  let lines;
  if (Array.isArray(reportOrLines)) {
    // Backwards compatibility with string arrays
    lines = reportOrLines;
  } else if (reportOrLines && typeof reportOrLines === 'object') {
    // New ValidationReport format
    lines = renderValidationReport(reportOrLines);
  } else {
    lines = [];
  }

  element.textContent = lines.join('\n');
}

/**
 * Render run log to DOM element
 * @param {HTMLElement} element - Log container
 * @param {string[]} entries - Log entries
 */
function renderRunLog(element, entries) {
  if (element) {
    element.textContent = (entries || []).join('\n');
    element.scrollTop = element.scrollHeight;
  }
}

/**
 * Format timestamp for deterministic filenames: YYYYMMDD-HHmmss
 * @returns {string}
 */
function formatTimestamp() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    '-' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

/**
 * Ensure Windows-friendly newlines for TXT exports
 * @param {string} content
 * @returns {string}
 */
function normalizeNewlines(content) {
  return content.replace(/\r?\n/g, '\r\n');
}

/**
 * Fetch with timeout support
 * @param {string} url
 * @param {number} ms
 * @param {RequestInit} options
 * @returns {Promise<{ok: boolean, response: Response|null, error: Error|null, timedOut: boolean}>}
 */
async function fetchWithTimeout(url, ms = 8000, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), ms);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return { ok: true, response, error: null, timedOut: false };
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return { ok: false, response: null, error, timedOut };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Strip credentials from URL before logging
 * @param {string} urlString
 * @returns {string}
 */
function safeUrlForLog(urlString) {
  try {
    const url = new URL(urlString, window.location.href);
    url.username = '';
    url.password = '';
    return url.toString();
  } catch {
    return urlString;
  }
}

/**
 * Copy text to clipboard with graceful error handling
 * @param {string} text
 * @returns {Promise<{ok: boolean, message: string}>}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true, message: 'Kopierat till urklipp.' };
    }

    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return { ok: true, message: 'Kopierat till urklipp.' };
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return { ok: false, message: 'Kunde inte kopiera till urklipp.' };
  }
}

/**
 * Download file to user's device
 * @param {string} filename - Filename
 * @param {string} content - File content
 * @param {string} mimeType - MIME type (default: text/plain)
 */
function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export file with safe defaults and graceful error handling
 * Ensures UTF-8, Windows newlines for TXT, and supports deterministic filenames
 * @param {{filename: string, mime: string, content: string}} payload
 * @returns {{ok: boolean, message: string}}
 */
function exportFile({ filename, mime, content }) {
  try {
    let finalContent = content ?? '';
    const lowerName = (filename || '').toLowerCase();

    if (mime === 'text/plain' || lowerName.endsWith('.txt')) {
      finalContent = normalizeNewlines(finalContent);
    }

    let finalMime = mime || 'text/plain';
    if (!/charset=/i.test(finalMime)) {
      finalMime = `${finalMime};charset=utf-8`;
    }

    downloadFile(filename, finalContent, finalMime);
    return { ok: true, message: 'Fil exporterad.' };
  } catch (error) {
    console.error('Export failed:', error);
    return { ok: false, message: 'Kunde inte exportera fil.' };
  }
}

/**
 * Toggle advanced panel visibility
 * @param {HTMLElement} panel - Panel element
 * @param {boolean} visible
 */
function toggleAdvancedPanel(panel, visible) {
  if (panel) {
    panel.style.display = visible ? 'block' : 'none';
  }
}

/**
 * Generate validation report header with status
 * @param {string} status - Status (OK, WARN, ERROR)
 * @param {string[]} lines - Report lines
 * @returns {string[]}
 */
function generateValidationReport(status, lines = []) {
  const report = ['═══ VALIDERINGSRAPPORT ═══', '', `Status: ${status}`, '', ...lines];
  return report;
}

/**
 * Parse numbers from input, with error handling
 * @param {HTMLElement} input - Input element
 * @param {object} options - Parse options
 * @returns {object} { value, error, warnings }
 */
function parseNumberInput(input, options = {}) {
  const { required = false, min = null, max = null, integer = false, label = 'Value' } = options;

  const text = (input?.value || '').trim();

  if (!text) {
    if (required) {
      return {
        value: null,
        error: `${label} måste vara angiven`,
        warnings: [],
      };
    }
    return {
      value: null,
      error: null,
      warnings: [],
    };
  }

  const value = parseFloat(text);

  if (isNaN(value)) {
    return {
      value: null,
      error: `${label} måste vara ett tal`,
      warnings: [],
    };
  }

  if (!isFinite(value)) {
    return {
      value: null,
      error: `${label} måste vara ett ändligt tal`,
      warnings: [],
    };
  }

  const warnings = [];

  if (integer && !Number.isInteger(value)) {
    warnings.push(`${label} bör vara ett heltal (är ${value})`);
  }

  if (min !== null && value < min) {
    return {
      value: null,
      error: `${label} måste vara minst ${min}`,
      warnings,
    };
  }

  if (max !== null && value > max) {
    return {
      value: null,
      error: `${label} får högst vara ${max}`,
      warnings,
    };
  }

  return {
    value,
    error: null,
    warnings,
  };
}

/**
 * Scroll element into view
 * @param {HTMLElement} element
 * @param {object} options - ScrollIntoView options
 */
function scrollIntoView(element, options = {}) {
  if (element) {
    element.scrollIntoView({
      behavior: options.behavior || 'smooth',
      block: options.block || 'start',
    });
  }
}

/**
 * Format large numbers with locale
 * @param {number} num
 * @param {string} locale
 * @returns {string}
 */
function formatNumber(num, locale = 'sv-SE') {
  return num.toLocaleString(locale);
}

/**
 * Create validation issue entry
 * @param {string} severity - ok, warn, error
 * @param {string} message
 * @returns {object}
 */
function createValidationIssue(severity, message) {
  return {
    severity,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Batch download multiple files
 * Not directly supported, but can offer export as ZIP-like container
 * @deprecated Use individual downloadFile calls instead
 */
function batchDownload(files) {
  files.forEach(({ filename, content, mimeType }) => {
    downloadFile(filename, content, mimeType);
  });
}
