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
  }, 200);
  const App = Controller.extend('openui5.errorcollector.controller.App', /** @lends openui5.errorcollector.controller.BaseController.prototype */ {});

  App.prototype.onAfterRendering = function() {
    setTimeout(function() {
      this.byId('captureErrors');
    }, 0);

    setTimeout(function() {
      const errors = ui5ErrorCollector.getErrors();
      const html = '<pre><code>' + JSON.stringify(errors, null, 2) + '</code></pre>';
      this.byId('captureErrors').setHtmlText(html);
    }.bind(this), 500);
  };

  return App;
});
