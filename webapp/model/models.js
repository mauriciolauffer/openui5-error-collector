/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/ui/core/Core',
  'sap/ui/Device'
],
/**
 * @param {sap.ui.core.Core} Core - UI5 core
 * @param {sap.ui.Device} Device - Device
 * @returns {object} Model handler
 */
function(Core, Device) {
  return {

    setDevice: function(control) {
      const model = control.getModel('device');
      model.setDefaultBindingMode('OneWay');
      model.setProperty('/', Device);
    },

    setMessage: function(control) {
      control.setModel(Core.getMessageManager().getMessageModel(), 'message');
    },

    setApp: function(control) {
      const appModelData = {
        views: {
          main: {
            busy: false,
            sideExpanded: false
          },
          app: {
            busy: false
          }
        }
      };
      const model = control.getModel('app');
      model.setProperty('/', appModelData);
    }

  };
});
