'use strict';

(function() {
  if (window.ui5ErrorCollector) return;

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
      onLogEntry: function logUi5LogEntry(evt) {
        logEvents.push(mapUi5LogEntry(evt));
      }
    };
    Log.addLogListener(customLogListener);
  }

  /**
   * Map UI5 log events
   *
   * @param {object} evt UI5 log event
   * @returns {object} Mapped error, type = 'ui5'
   */
  function mapUi5LogEntry(evt) {
    const err = new Error(evt.message);
    return {
      type: 'ui5',
      timestamp: new Date(evt.timestamp || Date.now()).toJSON(),
      uri: window.location.href,
      stack: err.stack,
      message: evt.message,
      component: evt.component,
      level: evt.level
    };
  }

  /**
   * Map js error events
   *
   * @param {ErrorEvent} evt Error event
   * @returns {object} Mapped error, type = 'error'
   */
  function mapJsLogEntry(evt) {
    return {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: evt.target.location.href,
      stack: evt.error.stack,
      message: evt.message,
      elapsedTimestamp: evt.timeStamp,
      filename: evt.filename
    };
  }

  /**
   * Map Promise unhandledrejection events
   *
   * @param {PromiseRejectionEvent} evt Error event
   * @returns {object} Mapped error, type = 'unhandledrejection'
   */
  function mapPromiseLogEntry(evt) {
    return {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: evt.target.location.href,
      message: evt.reason,
      elapsedTimestamp: evt.timeStamp
    };
  }

  /**
   * Get all log entries to be synced
   *
   * @returns {object[]} Log entries
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
    if (!CONFIG.hasSyncOnExit) {
      return;
    }
    const logsToSync = getLogsToSync();
    if (logsToSync.length === 0) {
      return;
    }
    const payload = JSON.stringify(logsToSync);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(CONFIG.serverUrl, payload);
      CONFIG.lastSync = Date.now();
      return;
    }
    fetch(CONFIG.serverUrl, {
      body: payload,
      method: 'POST'
    })
        .then(function(res) {
          if (res.ok) {
            CONFIG.lastSync = Date.now();
          }
        });
  }

  /**
   * Set configuration
   *
   * @param {object} opt errors
   * @param {boolean} opt.hasSyncOnExit Sync on exit
   * @param {string} opt.serverUrl Server URL
   */
  function setConfiguration(opt) {
    const params = opt || {};
    CONFIG.hasSyncOnExit = params.hasSyncOnExit;
    CONFIG.serverUrl = params.serverUrl;
  }

  /**
   * Get all captured errors
   *
   * @returns {object[]} Captured errors
   */
  function getErrors() {
    return logEvents;
  }

  /**
   * @type {object[]}
   */
  const logEvents = [];
  const CONFIG = {
    hasSyncOnExit: false,
    lastSync: 0,
    serverUrl: ''
  };
  const START_TIME = Date.now();
  const CHECK_UI5_INTERVAL_ID = setInterval(checkUi5IsLoaded, 300);
  checkUi5IsLoaded();

  window.addEventListener('error', function logError(evt) {
    logEvents.push(mapJsLogEntry(evt));
  });

  window.addEventListener('unhandledrejection', function logUnhandledRejection(evt) {
    logEvents.push(mapPromiseLogEntry(evt));
  });

  window.addEventListener('beforeunload', function onBeforeUnload() {
    sendLogsToServer();
  });

  document.addEventListener('visibilitychange', function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      sendLogsToServer();
    }
  });

  window.ui5ErrorCollector = {
    getErrors: getErrors,
    setConfiguration: setConfiguration
  };
}());
