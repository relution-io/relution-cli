"use strict";
var html = require('common-tags').html;
var App = (function () {
    function App() {
        this.publishName = 'app.ts';
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ((_a = ["\n      /**\n       * @file app.js\n       */\n      import * as express from 'express';\n      import * as bodyParser from 'body-parser';\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n\n      // global variables\n      global['app'] = app;\n\n      // install routes\n      require('./routes/routes').init(app);\n      require('./routes/connectors').init(app);\n      require('./routes/push').init(app);\n\n      // start express server\n      app.listen(app.get('port'));\n    "], _a.raw = ["\n      /**\n       * @file app.js\n       */\n      import * as express from 'express';\n      import * as bodyParser from 'body-parser';\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n\n      // global variables\n      global['app'] = app;\n\n      // install routes\n      require('./routes/routes').init(app);\n      require('./routes/connectors').init(app);\n      require('./routes/push').init(app);\n\n      // start express server\n      app.listen(app.get('port'));\n    "], html(_a)) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map