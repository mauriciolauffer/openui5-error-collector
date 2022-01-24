'use strict';

(function() {
  if (window.ui5ErrorCollector) return;

  /**
   *
   */
  function checkUi5IsLoaded() {
    console.log(88888);
    if (window.sap && window.sap.ui && window.sap.ui.require) {
      addUI5LogListener();
      clearInterval(intervalId);
    } else if (Date.now() - startTime > 60000) { // Await ui5 for 1 minute max
      console.log(87878787);
      clearInterval(intervalId);
    }
  }

  /**
   *
   */
  function addUI5LogListener() {
    sap.ui.require(['sap/base/Log'], function(Log) {
      const customLogListener = {
        onLogEntry: function(evt) {
          logEvents.push(captureUi5LogEntry(evt));
        }
      };
      Log.addLogListener(customLogListener);
    });
  }

  /**
   * @param evt
   */
  function captureUi5LogEntry(evt) {
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
   * @param evt
   */
  function captureJsLogEntry(evt) {
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
   * @param evt
   */
  function capturePromiseLogEntry(evt) {
    return {
      type: evt.type,
      timestamp: new Date().toJSON(),
      uri: evt.target.location.href,
      message: evt.reason,
      elapsedTimestamp: evt.timeStamp
    };
  }

  window.addEventListener('error', function(evt) {
    logEvents.push(captureJsLogEntry(evt));
  });

  window.addEventListener('unhandledrejection', function(evt) {
    logEvents.push(capturePromiseLogEntry(evt));
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
