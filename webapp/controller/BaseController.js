/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'ui5/template/boilerplate/model/formatter'
],
/**
 * @param {sap.ui.core.mvc.Controller} Controller - Controller
 * @param {object} formatter - Formatter
 * @returns {object} Base controller
 */
function(Controller, formatter) {
  const BaseController = Controller.extend('ui5.template.boilerplate.controller.BaseController', /** @lends sap.ui.core.mvc.Controller.prototype */ {});

  BaseController.prototype.formatter = formatter;

  /**
   * Convenience method for accessing the router in every controller of the application.
   *
   * @public
   * @returns {sap.ui.core.routing.Router} the router for this component
   */
  BaseController.prototype.getRouter = function() {
    return this.getOwnerComponent().getRouter();
  };

  /**
   * Convenience method for getting the view model by name in every controller of the application.
   *
   * @public
   * @param {string} name the model name
   * @returns {sap.ui.model.Model} the model instance
   */
  BaseController.prototype.getModel = function(name) {
    return this.getView().getModel(name);
  };

  /**
   * Convenience method for setting the view model in every controller of the application.
   *
   * @public
   * @param {sap.ui.model.Model} model the model instance
   * @param {string} name the model name
   * @returns {sap.ui.core.mvc.View} the view instance
   */
  BaseController.prototype.setModel = function(model, name) {
    return this.getView().setModel(model, name);
  };

  /**
   * Convenience method for getting the resource bundle.
   *
   * @public
   * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
   */
  BaseController.prototype.getResourceBundle = function() {
    return this.getOwnerComponent().getModel('i18n').getResourceBundle();
  };

  return BaseController;
});
