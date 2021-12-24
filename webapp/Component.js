/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/base/Log',
  'sap/ui/core/UIComponent',
  'ui5/template/boilerplate/controller/ODataErrorHandler',
  'ui5/template/boilerplate/model/models',
  'sap/ui/core/ComponentSupport'
],
/**
 * @param {sap.base.Log} Log - Log
 * @param {sap.ui.core.UIComponent} UIComponent - UIComponent
 * @param {object} oDataErrorHandler - OData error handler
 * @param {object} models - Models handler
 * @returns {sap.ui.core.UIComponent} UIComponent
 */
function(Log, UIComponent, oDataErrorHandler, models) {
  const Component = UIComponent.extend('ui5.template.boilerplate.Component', /** @lends sap.ui.core.UIComponent.prototype */ {
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
    try {
      oDataErrorHandler.registerODataModel(this.getModel(), this.getModel('i18n').getResourceBundle());
    } catch (err) {
      this.logger.error(err);
    }
    models.setDevice(this);
    models.setMessage(this);
    models.setApp(this);
    UIComponent.prototype.init.apply(this, arguments);
    this.getRouter().initialize();
  };

  /**
   * The component is destroyed by UI5 automatically.
   * In this method, the ListSelector and ErrorHandler are destroyed.
   *
   * @public
   * @override
   */
  Component.prototype.destroy = function() {
    oDataErrorHandler = null;
    this.logger = null;
    UIComponent.prototype.destroy.apply(this, arguments);
  };

  return Component;
});
