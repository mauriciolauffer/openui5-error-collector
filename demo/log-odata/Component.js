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

    const logModel = this.getModel('log');

    ui5ErrorCollector.setConfiguration({
      serverUrl: logModel._getServerUrl(),
      onSyncHook: function myCustomOnSyncHook(serverUrl, errors) {
        errors.forEach(function(errorLog) {
          logModel.createEntry('/LogEntrySet', {
            properties: errorLog
          });
        });
        logModel.submitChanges({
          success: logger.info,
          error: logger.error
        });
      }
    });
  };

  return Component;
});
