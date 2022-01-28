/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/ui/core/mvc/Controller'
],
/**
 * @param {sap.ui.core.mvc.Controller} Controller - Controller
 * @returns {object} App controller
 */
function(Controller) {
  setTimeout(function() {
    const x1 = 1;
    x1 = 1;
  }, 500);
  return Controller.extend('openui5.errorcollector.controller.App', /** @lends openui5.errorcollector.controller.BaseController.prototype */ {});
});
