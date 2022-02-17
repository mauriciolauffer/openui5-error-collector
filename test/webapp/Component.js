/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/base/Log',
  'sap/ui/core/UIComponent',
  'sap/ui/core/ComponentSupport'
],
/**
 * @param {sap.base.Log} Log - Log
 * @param {sap.ui.core.UIComponent} UIComponent - UIComponent
 * @returns {sap.ui.core.UIComponent} UIComponent
 */
function(Log, UIComponent) {
  const Component = UIComponent.extend('openui5.errorcollector.Component', /** @lends sap.ui.core.UIComponent.prototype */ {
    metadata: {
      manifest: 'json'
    }
  });

  /**
   * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
   *
   * @public
   * @override
   */
  Component.prototype.init = function() {
    this.logger = Log.getLogger(this.getMetadata().getManifestEntry('sap.app').id);
    UIComponent.prototype.init.apply(this, arguments);


    const logger = Log.getLogger('openui5.errorcollector');
    const logger1 = Log.getLogger();
    logger.info('x1');
    logger.error('x2');
    logger.warning('x3');
    logger1.info('x111');
    logger1.error('x222');
    logger1.warning('x333');

    jQuery.sap.syncGet('./');
    jQuery.ajax({url: './', async: false});
    jQuery.sap.resources({url: 'i18n/i18n.properties'});

    /**
     * Callback provided to replace default sync with backend server
     *
     * @param {string} serverUrl - Server URL
     * @param {UI5ErrorLogEvent[]} errors - List of captured errors, same as ui5ErrorCollector.getErrors() results
     */
    function myCustomOnSyncHook(serverUrl, errors) {
      // Go crazy, do whatever you wanna here...
      const payload = JSON.stringify(errors);
      fetch(serverUrl, {body: payload, method: 'POST'});
      $.ajax(serverUrl, {body: payload});
    }
    ui5ErrorCollector.setConfiguration({
      serverUrl: '/demo/index.html',
      onSyncHook: myCustomOnSyncHook
    });

    const prom = new Promise(function(resolve, reject) {
      reject(12345);
    });
    prom.then(console.dir);
  };

  return Component;
});
