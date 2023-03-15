'use strict';

(function() {
  if (window.ui5ErrorCollector) return;

  /**
   * @typedef UI5ErrorLogEvent
   * @type {object}
   * @property {string} type - Log event type
   * @property {string} timestamp - When event was logged
   * @property {string} uri - Where event was logged
   * @property {?string} stack - Error stack
   * @property {string} message - Error message
   * @property {?string} component - UI5 Log component
   * @property {number} level - Log level
   * @property {?number} elapsedTimestamp - Elapsed time since page load
   * @property {?string} filename - File which triggered the error
   */

  /**
   * @typedef UI5ErrorUi5BaseLogEntry
   * @type {object}
   * @property {number} timestamp - When event was logged
   * @property {string} message - Error message
   * @property {?string} component - UI5 Log component
   * @property {number} level - Log level
   */

  /**
   * @typedef UI5ErrorConfiguration
   * @type {object}
   * @property {number} lastSync - Last time sync has occured
   * @property {string} serverUrl - Server URL
   * @property {?UI5ErroronSyncHookCallback} onSyncHook - On sync hook
   */

  /**
   * Callback provided to replace default sync with backend server
   *
   * @callback UI5ErroronSyncHookCallback
   * @param {string} serverUrl - Server URL
   * @param {UI5ErrorLogEvent[]} errors - List of captured errors
   */

  /**
   * Check whether UI5 library has been loaded
   */
  function checkUi5IsLoaded() {
    if (window.sap && sap.ui && sap.ui.require) {
      sap.ui.require(['sap/base/Log'], addUI5LogListener);
      clearInterval(CHECK_UI5_INTERVAL_ID);
    } else if (Date.now() - START_TIME > 60000) { // Await UI5 for 1 minute max
      clearInterval(CHECK_UI5_INTERVAL_ID);
    }
  }

  /**
   * Add custom UI5 log listener to capture all UI5 log events
   *
   * @param {module:sap/base/Log} Log UI5 Log module
   */
  function addUI5LogListener(Log) {
    const customLogListener = {
    /**
     * Handler for sap/base/Log onLogEntry
     *
     * @param {UI5ErrorUi5BaseLogEntry} evt - UI5 log event
     */
      onLogEntry: function logUi5LogEntry(evt) {
        logEvents.push(mapUi5LogEntry(evt));
      }
    };
    Log.addLogListener(customLogListener);
  }

  /**
   * Map UI5 log events
   *
   * @param {UI5ErrorUi5BaseLogEntry} evt - UI5 log event
   * @returns {UI5ErrorLogEvent} Mapped error, type = 'ui5'
   */
  function mapUi5LogEntry(evt) {
    const err = new Error(evt.message);
    return Object.assign({}, LOG_TEMPLATE, {
      type: 'ui5',
      timestamp: new Date(evt.timestamp || Date.now()).toJSON(),
      uri: window.location.href,
      stack: err.stack,
      message: evt.message,
      component: evt.component,
      level: evt.level
    });
  }

  /**
   * Map js error events
   *
   * @param {ErrorEvent} evt - Error event
   * @returns {UI5ErrorLogEvent} Mapped error, type = 'error'
   */
  function mapJsLogEntry(evt) {
    return Object.assign({}, LOG_TEMPLATE, {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: window.location.href,
      stack: evt.error.stack,
      message: evt.message,
      elapsedTimestamp: evt.timeStamp,
      filename: evt.filename,
      level: 1
    });
  }

  /**
   * Map Promise unhandledrejection events
   *
   * @param {PromiseRejectionEvent} evt - Error event
   * @returns {UI5ErrorLogEvent} Mapped error, type = 'unhandledrejection'
   */
  function mapPromiseLogEntry(evt) {
    return Object.assign({}, LOG_TEMPLATE, {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: window.location.href,
      message: evt.reason,
      elapsedTimestamp: evt.timeStamp,
      level: 1
    });
  }

  /**
   * Map Report API error events
   *
   * @param {Report} evt - Report API event
   * @returns {UI5ErrorLogEvent} Mapped error, type = [deprecation, intervention, crash]
   */
  function mapReportApiLogEntry(evt) {
    const body = evt.body || {};
    return Object.assign({}, LOG_TEMPLATE, {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: evt.url,
      message: body.message || body.reason,
      component: body.id,
      level: 1,
      filename: body.sourceFile
    });
  }

  /**
   * Get all log entries to be synced
   *
   * @returns {UI5ErrorLogEvent[]} Log entries
   */
  function getLogsToSync() {
    return logEvents.filter(function(log) {
      return new Date(log.timestamp) > new Date(CONFIG.lastSync);
    });
  }

  /**
   * Send errors to the server
   *
   */
  function sendLogsToServer() {
    const logsToSync = getLogsToSync();
    if (!CONFIG.serverUrl || logsToSync.length === 0) {
      return;
    }
    const payload = JSON.stringify(logsToSync);
    if (CONFIG.onSyncHook) {
      CONFIG.onSyncHook(CONFIG.serverUrl, logEvents);
    } else {
      navigator.sendBeacon(CONFIG.serverUrl, payload);
      setLastSync(Date.now());
      CONFIG.lastSync = Date.now();
    }
  }

  /**
   * Set configuration
   *
   * @param {object} opt - Config options
   * @param {string} opt.serverUrl - Server URL
   * @param {?UI5ErroronSyncHookCallback} opt.onSyncHook - On sync hook callback
   */
  function setConfiguration(opt) {
    const params = opt || {};
    CONFIG.serverUrl = params.serverUrl;
    if (typeof params.onSyncHook === 'function') {
      CONFIG.onSyncHook = params.onSyncHook;
    }
  }

  /**
   * Set last syncronization itme
   *
   * @param {number} timestamp - Last syncronization date time
   */
  function setLastSync(timestamp) {
    CONFIG.lastSync = timestamp;
  }

  /**
   * Get all captured errors
   *
   * @returns {UI5ErrorLogEvent[]} Captured errors
   */
  function getErrors() {
    return logEvents;
  }

  /**
   * Set ReportingObserver to collect and access reports from Reporting API
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API}
   */
  function setReportingObserver() {
    if (window.ReportingObserver) {
      const options = {
        types: ['deprecation', 'intervention', 'crash'],
        buffered: true
      };
      const observer = new ReportingObserver(function(reports) {
        reports.forEach(function(report) {
          logEvents.push(mapReportApiLogEntry(report));
        });
      }, options);
      observer.observe();
    }
  }

  /**
   * @type {UI5ErrorLogEvent[]}
   */
  const logEvents = [];
  /**
   * @type {UI5ErrorConfiguration}
   */
  const CONFIG = {
    lastSync: 0,
    serverUrl: '',
    onSyncHook: null
  };
  /**
   * @type {UI5ErrorLogEvent}
   */
  const LOG_TEMPLATE = {
    type: '',
    timestamp: '',
    uri: '',
    stack: null,
    message: '',
    component: null,
    level: 0,
    elapsedTimestamp: null,
    filename: null
  };
  const START_TIME = Date.now();
  const CHECK_UI5_INTERVAL_ID = setInterval(checkUi5IsLoaded, 300);
  checkUi5IsLoaded();
  setReportingObserver();

  window.addEventListener('error', function logError(evt) {
    logEvents.push(mapJsLogEntry(evt));
  });
  window.addEventListener('unhandledrejection', function logUnhandledRejection(evt) {
    logEvents.push(mapPromiseLogEntry(evt));
  });
  /* window.addEventListener('beforeunload', function onBeforeUnload() {
    sendLogsToServer();
  }); */
  document.addEventListener('visibilitychange', function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      sendLogsToServer();
    }
  });

  window.ui5ErrorCollector = {
    getErrors: getErrors,
    setConfiguration: setConfiguration,
    setLastSync: setLastSync
  };
}());
