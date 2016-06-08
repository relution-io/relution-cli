"use strict";
var html = require('common-tags').html;
var App = (function () {
    function App() {
        this.publishName = 'app.js';
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ((_a = ["\n      'use strict';\n      /**\n       * @file app.js\n       * Simple MADP Application\n       */\n      var Q = require('q');\n      Q.stopUnhandledRejectionTracking(); // requires use of Q's nextTick(cb)\n      Q.nextTick = process.nextTick;      // Q's nextTick(cb) is not compatible with thread-locals\n      //Q.longStackSupport = true;        // advanced diagnostic stack traces\n\n      var express = require('express');\n      var app = express();\n\n      app.use(express.bodyParser());\n\n      // global variables\n      global.app = app;\n\n      // install routes\n      require('./routes/routes');\n      require('./routes/connectors');\n\n      // starts express webserver\n      app.listen();\n    "], _a.raw = ["\n      'use strict';\n      /**\n       * @file app.js\n       * Simple MADP Application\n       */\n      var Q = require('q');\n      Q.stopUnhandledRejectionTracking(); // requires use of Q's nextTick(cb)\n      Q.nextTick = process.nextTick;      // Q's nextTick(cb) is not compatible with thread-locals\n      //Q.longStackSupport = true;        // advanced diagnostic stack traces\n\n      var express = require('express');\n      var app = express();\n\n      app.use(express.bodyParser());\n\n      // global variables\n      global.app = app;\n\n      // install routes\n      require('./routes/routes');\n      require('./routes/connectors');\n\n      // starts express webserver\n      app.listen();\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map