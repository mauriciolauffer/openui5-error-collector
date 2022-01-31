/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/base/Log',
  'sap/ui/core/Core',
  'sap/ui/core/UIComponent',
  'sap/ui/core/ComponentSupport'
],
/**
 * @param {sap.base.Log} Log - Log
 * @param {sap.ui.core.Core} Core - Core
 * @param {sap.ui.core.UIComponent} UIComponent - UIComponent
 * @param {object} oDataErrorHandler - OData error handler
 * @param {object} models - Models handler
 * @returns {sap.ui.core.UIComponent} UIComponent
 */
function(Log, Core, UIComponent) {
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
    this.getRouter().initialize();


    console.dir(Core);
    window.core = Core;
    window.logger = Log;
    const customLogListener = {
			onLogEntry: function (oLogEntry) {
        //debugger;
        console.log(111111);
        console.dir(arguments);
        console.dir(oLogEntry);
			}
    };
    //Log.addLogListener(customLogListener);
    //Log.addLogListener(customLogListener2);
    const logger = Log.getLogger('openui5.errorcollector');
    const logger1 = Log.getLogger();
    logger.info('x1');
    logger.error('x2');
    logger.warning('x3');
    logger1.info('x111');
    //logger1.error('x222');
    //logger1.warning('x333');
    console.dir(Log.getLogEntries());

    const prom = new Promise(function(resolve, reject) {
      console.log(33333333333);
      reject(12345);
    });
    prom.then(console.dir);
  };

  return Component;
});
