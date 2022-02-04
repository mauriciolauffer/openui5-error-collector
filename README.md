# openui5-error-collector

[![npm](https://img.shields.io/npm/v/openui5-error-collector)](https://www.npmjs.com/package/openui5-error-collector)
[![linkedin-shield](https://img.shields.io/badge/LinkedIn-black?style=flat-square&logo=linkedin&colorB=555)](https://www.linkedin.com/in/mauriciolauffer)

This library collects all javascript errors, all Promises with unhandled rejections and all UI5 log events from [sap/base/Log](https://openui5.hana.ondemand.com/index.html#/api/module:sap/base/Log).

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

Developers can send all errors to a backend server setting `serverUrl` and `hasSyncOnExit` with method `ui5ErrorCollector.setConfiguration`.

```js
ui5ErrorCollector.setConfiguration({
  serverUrl: 'https://my-backend-server.com',
  hasSyncOnExit: true
});
```

Mehod `ui5ErrorCollector.getErrors` will return all captured errors.

```js
ui5ErrorCollector.getErrors();

// Which returns an array of the following object:
  /**
   * @type {object}
   * @property {string} type - Log event type
   * @property {string} timestamp - When event was logged
   * @property {string} uri - Where event was logged
   * @property {string} stack - Error stack
   * @property {string} message - Error message
   * @property {string} component - UI5 Log component
   * @property {number} level - Log level
   * @property {number} elapsedTimestamp - Elapsed time since page load
   * @property {string} filename - File which triggered the error
   */

// Some data sample:
[
    {
        "type": "error",
        "timestamp": "2022-02-04T07:25:26.045Z",
        "uri": "http://localhost:3000/test/webapp/index.html",
        "stack": "TypeError: Cannot read properties of undefined (reading 'substring')\n    at http://localhost:3000/test/webapp/index.html:30:40",
        "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'substring')",
        "component": "",
        "level": 1,
        "elapsedTimestamp": 558.3000000119209,
        "filename": "http://localhost:3000/test/webapp/index.html"
    },
    {
        "type": "ui5",
        "timestamp": "2022-02-04T07:25:29.725Z",
        "uri": "http://localhost:3000/test/webapp/index.html",
        "stack": "Error: x2\n    at mapUi5LogEntry (http://localhost:3000/src/ui5ErrorCollector.js:39:17)\n    at Object.logUi5LogEntry [as onLogEntry] (http://localhost:3000/src/ui5ErrorCollector.js:26:24)\n    at Object.onLogEntry (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:124:143)\n    at f (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:135:551)\n    at Object.L.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:126:27)\n    at h.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:141:109)\n    at f.Component.init (http://localhost:3000/test/webapp/Component.js:56:12)\n    at https://openui5.hana.ondemand.com/resources/sap-ui-core.js:315:978\n    at f.constructor (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:315:1062)\n    at f.constructor (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:586:910)",
        "message": "Some ui5 log",
        "component": "openui5.errorcollector",
        "level": 1,
        "elapsedTimestamp": 0,
        "filename": ""
    },
    {
        "type": "unhandledrejection",
        "timestamp": "2022-02-04T07:25:29.728Z",
        "uri": "http://localhost:3000/test/webapp/index.html",
        "stack": "Error: x2\n    at mapUi5LogEntry (http://localhost:3000/src/ui5ErrorCollector.js:39:17)\n    at Object.logUi5LogEntry [as onLogEntry] (http://localhost:3000/src/ui5ErrorCollector.js:26:24)\n    at Object.onLogEntry (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:124:143)\n    at f (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:135:551)\n    at Object.L.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:126:27)\n    at h.error (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:141:109)\n    at f.Component.init (http://localhost:3000/test/webapp/Component.js:56:12)\n    at https://openui5.hana.ondemand.com/resources/sap-ui-core.js:315:978\n    at f.constructor (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:315:1062)\n    at f.constructor (https://openui5.hana.ondemand.com/resources/sap-ui-core.js:586:910)",
        "message": "Some Promise error",
        "component": "openui5.errorcollector",
        "level": 1,
        "elapsedTimestamp": 4241,
        "filename": ""
    }
]
```

## Author

Mauricio Lauffer

* LinkedIn: <https://www.linkedin.com/in/mauriciolauffer>
