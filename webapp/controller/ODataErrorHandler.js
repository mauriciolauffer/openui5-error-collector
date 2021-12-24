/**
 * ${copyright}
 */

'use strict';

sap.ui.define([
  'sap/m/MessageBox'
],
/**
 * @param {sap.m.MessageBox} MessageBox - Message popup
 * @returns {object} OData error handler
 */
function(MessageBox) {
  /**
   * Handles application errors by automatically attaching to the model events and displaying errors when needed.
   *
   * @class
   * @public
   * @alias ui5.template.boilerplate.controller.ODataErrorHandler
   */
  const ODataErrorHandler = function() {
    this._isMessageOpen = false;
  };

  /**
   * Register ODataModel for error handling
   *
   * @param {sap.ui.model.odata.v2.ODataModel} odataModel reference to the oData Model
   * @param {sap.ui.model.resource.ResourceModel} resourceBundle reference to the resource bundle
   * @public
   * @alias ui5.template.boilerplate.controller.ODataErrorHandler
   */
  ODataErrorHandler.prototype.registerODataModel = function(odataModel, resourceBundle) {
    this._errorMessage = resourceBundle.getText('oDataErrorMessage');

    if (odataModel.isMetadataLoadingFailed()) {
      this._showServiceError(resourceBundle.getText('oDataErrorMessage'), resourceBundle.getText('metadataLoadingError'));
    }

    odataModel.attachMetadataFailed(function _onMetadataFailed(evt) {
      this._showServiceError(resourceBundle.getText('oDataErrorMessage'), evt.getParameter('response'));
    }.bind(this), this);

    odataModel.attachRequestFailed(function _onRequestFailed(evt) {
      const response = evt.getParameter('response');
      // An entity that was not found in the service is also throwing a 404 error in oData.
      // We already cover this case with a notFound target so we skip it here.
      // A request that cannot be sent to the server is a technical error that we have to handle though
      if (response.statusCode !== '404' ||
          (response.statusCode === 404 && response.responseText.indexOf('Cannot POST') === 0)) {
        this._showServiceError(resourceBundle.getText('oDataErrorMessage'), response);
      }
    }.bind(this), this);
  };

  /**
   * Shows a {@link sap.m.MessageBox} when a service call has failed.
   * Only the first error message will be display.
   *
   * @param {string} message - Message text
   * @param {string} errorDetails - A technical error to be displayed on request
   */
  ODataErrorHandler.prototype._showServiceError = function(message, errorDetails) {
    if (this._isMessageOpen) {
      return;
    }
    this._isMessageOpen = true;
    MessageBox.error(message, {
      details: errorDetails,
      actions: [MessageBox.Action.CLOSE],
      onClose: this._onCloseMessage.bind(this)
    });
  };

  /**
   *
   * Set isMessageOpen to false
   */
  ODataErrorHandler.prototype._onCloseMessage = function() {
    this._isMessageOpen = false;
  };

  return new ODataErrorHandler();
});
