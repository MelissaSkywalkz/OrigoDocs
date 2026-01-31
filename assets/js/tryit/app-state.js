/**
 * TryIt Application State Management
 *
 * Centralized state for all Try It lab tools.
 * Single source of truth for: logs, validation reports, ui state
 */

class AppState {
  constructor() {
    // Tool logs: { [toolKey]: [...log entries] }
    this.logs = {};

    // Validation reports: { [toolKey]: ValidationReport }
    this.reports = {};

    // Tool-specific state (optional)
    this.toolData = {};

    // Global ui state
    this.ui = {
      advancedMode: {},
    };
  }

  /**
   * Add a log entry to a tool
   * @param {string} toolKey - Tool identifier
   * @param {string} level - Log level (INFO, OK, WARN, ERROR)
   * @param {string} message - Log message
   */
  addLog(toolKey, level, message) {
    if (!this.logs[toolKey]) {
      this.logs[toolKey] = [];
    }

    const timestamp = new Date().toLocaleTimeString('sv-SE');
    const prefix = `[${timestamp}] [${level}]`;
    const entry = `${prefix} ${message}`;

    this.logs[toolKey].push(entry);

    // Keep last 20 entries
    if (this.logs[toolKey].length > 20) {
      this.logs[toolKey].shift();
    }

    return entry;
  }

  /**
   * Get all logs for a tool
   * @param {string} toolKey
   * @returns {string[]}
   */
  getLogs(toolKey) {
    return this.logs[toolKey] || [];
  }

  /**
   * Set validation report for a tool
   * @param {string} toolKey
   * @param {object} report - ValidationReport object
   */
  setReport(toolKey, lines) {
    this.reports[toolKey] = lines;
  }

  /**
   * Get validation report for a tool
   * @param {string} toolKey
   * @returns {object|null}
   */
  getReport(toolKey) {
    return this.reports[toolKey] || null;
  }

  /**
   * Store tool-specific data
   * @param {string} toolKey
   * @param {string} key
   * @param {any} value
   */
  setToolData(toolKey, key, value) {
    if (!this.toolData[toolKey]) {
      this.toolData[toolKey] = {};
    }
    this.toolData[toolKey][key] = value;
  }

  /**
   * Retrieve tool-specific data
   * @param {string} toolKey
   * @param {string} key
   * @returns {any}
   */
  getToolData(toolKey, key) {
    return this.toolData[toolKey]?.[key];
  }

  /**
   * Set advanced mode state for a tool
   * @param {string} toolKey
   * @param {boolean} enabled
   */
  setAdvancedMode(toolKey, enabled) {
    this.ui.advancedMode[toolKey] = enabled;
  }

  /**
   * Get advanced mode state for a tool
   * @param {string} toolKey
   * @returns {boolean}
   */
  isAdvancedMode(toolKey) {
    return this.ui.advancedMode[toolKey] || false;
  }

  /**
   * Clear all state for a tool
   * @param {string} toolKey
   */
  clearTool(toolKey) {
    delete this.logs[toolKey];
    delete this.reports[toolKey];
    delete this.toolData[toolKey];
    delete this.ui.advancedMode[toolKey];
  }

  /**
   * Clear all state
   */
  clearAll() {
    this.logs = {};
    this.reports = {};
    this.toolData = {};
    this.ui.advancedMode = {};
  }
}

// Global singleton instance
window.appState = new AppState();
