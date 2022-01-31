'use strict';

(function() {
  if (window.ui5ErrorCollector) return;

  /**
   * Check whether UI5 library has been loaded
   */
  function checkUi5IsLoaded() {
    if (window.sap && window.sap.ui && window.sap.ui.require) {
      addUI5LogListener();
      clearInterval(intervalId);
    } else if (Date.now() - startTime > 60000) { // Await ui5 for 1 minute max
      clearInterval(intervalId);
    }
  }

  /**
   * Add custom UI5 log listener to capture all ui5 log events
   */
  function addUI5LogListener() {
    sap.ui.require(['sap/base/Log'], function(Log) {
      const customLogListener = {
        onLogEntry: function(evt) {
          logEvents.push(mapUi5LogEntry(evt));
        }
      };
      Log.addLogListener(customLogListener);
    });
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
   * Capture all js errors
   */
  window.addEventListener('error', function(evt) {
    logEvents.push(mapJsLogEntry(evt));
  });

  /**
   * Capture Promise unhandled rejections
   */
  window.addEventListener('unhandledrejection', function(evt) {
    logEvents.push(mapPromiseLogEntry(evt));
  });


  /**
   *
   */
  function ErrorCollector() {
    this._logEvents = logEvents;
    /* this._syncInterval = null;
    this._hasSyncOnUnload = true;
    this._isSyncOn = true;
    this._lastSync = null;
    this._serverUrl = true;
    navigator.userAgent;
    navigator.language; */
  }

  /* ErrorCollector.prototype.config = function({syncInterval, syncOnUnload, serverUrl}) {
    console.dir(arguments);
  }; */

  const logEvents = [];
  const startTime = Date.now();
  const intervalId = setInterval(checkUi5IsLoaded, 300);
  checkUi5IsLoaded();
  window.ui5ErrorCollector = new ErrorCollector();
}());
