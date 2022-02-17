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
  const App = Controller.extend('openui5.errorcollector.controller.App', /** @lends openui5.errorcollector.controller.BaseController.prototype */ {});

  App.prototype.onAfterRendering = function() {
    this.byId('captureErrors').setHtmlText('<pre><code>' + JSON.stringify(ui5ErrorCollector.getErrors()) + '</code></pre>');
  };

  return App;
});
