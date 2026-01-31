/**
 * TryIt UI Helpers - Shared utilities for all tools
 *
 * Provides:
 * - Status message rendering
 * - Validation report rendering
 * - Run log management
 * - File downloads
 * - Text copy utilities
 */

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
 * @param {HTMLElement} element - Report container
 * @param {string[]} lines - Report lines
 */
function renderReport(element, lines) {
  if (element) {
    element.textContent = (lines || []).join('\n');
  }
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
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
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
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
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
