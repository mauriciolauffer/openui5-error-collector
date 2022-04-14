# openui5-error-collector

[![npm](https://img.shields.io/npm/v/openui5-error-collector)](https://www.npmjs.com/package/openui5-error-collector)  [![test](https://github.com/mauriciolauffer/openui5-error-collector/actions/workflows/test.yml/badge.svg)](https://github.com/mauriciolauffer/openui5-error-collector/actions/workflows/test.yml)

This library collects javascript errors and can send them to a backend, if errors need to be logged and saved for further analysis:

* vanilla js errors (reference, syntax, type, etc)
* Promises with unhandled rejections
* UI5 log events from [sap/base/Log](https://openui5.hana.ondemand.com/index.html#/api/module:sap/base/Log)
* errors from [Report API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API)

## Demo

You can check out a live demo here:

<https://mauriciolauffer.github.io/openui5-error-collector/demo/index.html>

## Project Structure

* demo - Library's live demo
* dist - Distribution folder which contains the library ready to use
* src  - Development folder
* test - Testing framework for the library

## Getting started

### Installation

Install openui5-error-collector as an npm module

```sh
$ npm install openui5-error-collector
```

### How to use

Import openui5-error-collector to your UI5 application as a regular javascript file. You should import it before `sap-ui-bootstrap` to  capture UI5 bootstrap errors as well.

```html
<script async src="dist/ui5ErrorCollector.min.js"></script>
<script async id="sap-ui-bootstrap" src="/resources/sap-ui-core.js" ... ></script>
```

Once imported, all errros will be automatically captured. It also exposes a global variable `ui5ErrorCollector`, eg, `window.ui5ErrorCollector` which can be used to get the errors and to set the details to send them to a backend server.

#### Sending errors to a backend

Developers can send all errors to a backend server setting `serverUrl` with method `ui5ErrorCollector.setConfiguration`. Once `serverUrl` is set, errors'll be sent to it using `navigator.sendBeacon` (this is not supported by IE11).

```js
ui5ErrorCollector.setConfiguration({
  serverUrl: 'https://my-backend-server.com'
});
```

To make it compatible with IE11, or to add any extra logic when synchronizing (transform the payload, send to multiple backends, etc), a callback `onSyncHook` ca be passed to method `ui5ErrorCollector.setConfiguration`. This'll replace the default behaviour and use the provided callback `onSyncHook` rather than `navigator.sendBeacon`.

```js
/**
 * Callback provided to replace default sync with backend server
 *
 * @param {string} serverUrl - Server URL
 * @param {UI5ErrorLogEvent[]} errors - List of captured errors, same as ui5ErrorCollector.getErrors() results
 * @param {UI5ErrorLogEvent[]} logsToSync - List of captured errors since the last call
 */
function myCustomOnSyncHook(serverUrl, errors, logsToSync) {
  // Go crazy, do whatever you wanna here...
  const payload = JSON.stringify(errors);
  fetch(serverUrl, {body: payload, method: 'POST'});
  $.ajax(serverUrl, {body: payload, method: 'POST'});
}

ui5ErrorCollector.setConfiguration({
  serverUrl: 'https://my-backend-server.com',
  onSyncHook: myCustomOnSyncHook
});
```

#### Retrieving errors

Mehod `ui5ErrorCollector.getErrors` will return all captured errors.

```js
ui5ErrorCollector.getErrors(); // Which returns an array of the following object:

/**
* @type {object}
* @property {string} type - Log event type
* @property {string} timestamp - When event was logged
* @property {string} uri - Where event was logged
* @property {?string} stack - Error stack
* @property {string} message - Error message
* @property {?string} component - UI5 Log component
* @property {number} level - Log level
* @property {?number} elapsedTimestamp - Elapsed time since page load
* @property {?string} filename - File which triggered the error
*/

// Some data sample:
[
  {
      "type": "error",
      "timestamp": "2022-02-14T05:59:02.987Z",
      "uri": "http://localhost:3000/test/webapp/index.html",
      "stack": "TypeError: Cannot read properties of undefined (reading 'substring')\n    at http://localhost:3000/test/webapp/index.html:30:40",
      "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'substring')",
      "component": null,
      "level": 1,
      "elapsedTimestamp": 755.1999999880791,
      "filename": "http://localhost:3000/test/webapp/index.html"
  },
  {
      "type": "deprecation",
      "timestamp": "2022-02-14T05:59:03.294Z",
      "uri": "http://localhost:3000/test/webapp/index.html",
      "stack": null,
      "message": "Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.",
      "component": "XMLHttpRequestSynchronousInNonWorkerOutsideBeforeUnload",
      "level": 1,
      "elapsedTimestamp": null,
      "filename": "https://openui5.hana.ondemand.com/resources/sap-ui-core.js"
  },
  {
      "type": "ui5",
      "timestamp": "2022-02-14T05:59:03.880Z",
      "uri": "http://localhost:3000/test/webapp/index.html",
      "stack": "Error: failed to load JavaScript resource: openui5/errorcollector/Component-preload.js\n    at mapUi5LogEntry (http://localhost:3000/src/ui5ErrorCollector.js:39:17)\n    at Object.logUi5LogEntry [as onLogEntry] (http://localhost:3000/src/ui5ErrorCollector.js:26:24)\n    at Object.onLogEntry (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:124:143)\n    at f (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:135:551)\n    at Object.L.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:126:27)\n    at h.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:141:109)\n    at HTMLScriptElement.p (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:60:413)",
      "message": "failed to load JavaScript resource: openui5/errorcollector/Component-preload.js",
      "component": "sap.ui.ModuleSystem",
      "level": 1,
      "elapsedTimestamp": null,
      "filename": null
  },
  {
      "type": "unhandledrejection",
      "timestamp": "2022-02-14T05:59:05.316Z",
      "uri": "http://localhost:3000/test/webapp/index.html",
      "stack": null,
      "message": 12345,
      "component": null,
      "level": 1,
      "elapsedTimestamp": 3084.199999988079,
      "filename": null
  }
]
```

## Author

Mauricio Lauffer

[![linkedin-shield](https://img.shields.io/badge/LinkedIn-555?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/mauriciolauffer) [![npm-shield](https://img.shields.io/badge/NPM-555?style=for-the-badge&logo=npm)](https://npmjs.com/~mauriciolauffer) [![github-shield](https://img.shields.io/badge/GitHub-555?style=for-the-badge&logo=github)](https://github.com/mauriciolauffer) [![sap-shield](https://img.shields.io/badge/SAP-555?style=for-the-badge&logo=sap&logoColor=white)](https://people.sap.com/mauriciolauffer) [![credly-shield](https://img.shields.io/badge/Credly-555?style=for-the-badge&logo=credly&logoColor=white)](https://www.credly.com/users/mauricio-lauffer/badges)
