"use strict";
var App = (function () {
    function App() {
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ("\n/**\n * " + name + "\n */\nvar express = require('express');\nvar app = express();\n// Assign middlewares\napp.use(express.bodyParser());\n// global variables\nglobal.app = app;\n// starts express webserver\napp.listen();\n    ");
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map