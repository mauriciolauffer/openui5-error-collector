'use strict';

sap.ui.require([
  'ui5/template/boilerplate/localService/mockserver'
],
/**
 * @param {object} mockserver - Mock server
 */
function(mockserver) {
  mockserver.init();
  sap.ui.require(['sap/ui/core/ComponentSupport']);
});
