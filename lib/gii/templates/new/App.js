"use strict";
var html = require('common-tags').html;
var App = (function () {
    function App() {
        this.publishName = 'app.js';
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ((_a = ["\n      /**\n       * ", "\n       */\n      var express = require('express');\n      var app = express();\n      // Assign middlewares\n      app.use(express.bodyParser());\n      // global variables\n      global.app = app;\n      // starts express webserver\n      app.listen();\n\n    "], _a.raw = ["\n      /**\n       * ", "\n       */\n      var express = require('express');\n      var app = express();\n      // Assign middlewares\n      app.use(express.bodyParser());\n      // global variables\n      global.app = app;\n      // starts express webserver\n      app.listen();\\n\n    "], html(_a, this.name)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map