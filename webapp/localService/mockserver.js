'use strict';

sap.ui.define([
  'sap/ui/core/util/MockServer',
  'ui5/template/boilerplate/Component'
],
/**
 * @param {sap.ui.core.util.MockServer} MockServer - Mock server
 * @param {sap.ui.core.UIComponent} Component - Main app component
 * @returns {object} Mock server
 */
function(MockServer, Component) {
  return {
    init: function() {
      const manifestApp = Component.getMetadata().getManifestEntry('sap.app');
      const mainDataSource = manifestApp.dataSources['mainService'];
      const metadataUrl = '../../' + mainDataSource.settings.localUri;
      const mockServerUrl = /.*\/$/.test(mainDataSource.uri) ? mainDataSource.uri : mainDataSource.uri + '/';
      const mockServer = new MockServer({rootUri: mockServerUrl});

      MockServer.config({
        autoRespond: true,
        autoRespondAfter: 10
      });

      mockServer.simulate(metadataUrl, {
        bGenerateMissingMockData: true
      });

      mockServer.start();
    }
  };
});
