# openui5-error-collector

[![npm](https://img.shields.io/npm/v/openui5-error-collector)](https://www.npmjs.com/package/openui5-error-collector)
![NPM](https://img.shields.io/npm/l/openui5-error-collector)
[![linkedin-shield](https://img.shields.io/badge/LinkedIn-black?style=flat-square&logo=linkedin&colorB=555)](https://www.linkedin.com/in/mauriciolauffer)

This library collects all javascript errors, all Promises with unhandled rejections and all UI5 log events from sap/base/Log.

It exposes a global `ui5ErrorCollector`, eg, `window.ui5ErrorCollector`

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

## Author

Mauricio Lauffer

* LinkedIn: [https://www.linkedin.com/in/mauriciolauffer](https://www.linkedin.com/in/mauriciolauffer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
