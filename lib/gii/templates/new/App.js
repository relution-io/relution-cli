"use strict";
var html = require('common-tags').html;
var App = (function () {
    function App() {
        this.publishName = 'app.ts';
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ((_a = ["\n      /**\n       * @file app.js\n       * Simple MADP Application\n       */\n      const http = require('http');\n      const express = require('express');\n      const bodyParser = require('body-parser');\n      const multer = require('multer');\n      const errorHandler = require('errorhandler');\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n      app.use(multer());\n\n      // global variables\n      global['app'] = app;\n\n      // install routes\n      require('./routes/routes');\n      require('./routes/connectors');\n      require('./routes/push');\n\n      // error handling middleware should be loaded after the loading the routes\n      if ('development' == app.get('env')) {\n        app.use(errorHandler());\n      }\n      // starts express webserver\n      const server = http.createServer(app);\n      server.listen(app.get('port'), () => {\n        console.log('Express server listening on port ' + app.get('port'));\n      });\n\n    "], _a.raw = ["\n      /**\n       * @file app.js\n       * Simple MADP Application\n       */\n      const http = require('http');\n      const express = require('express');\n      const bodyParser = require('body-parser');\n      const multer = require('multer');\n      const errorHandler = require('errorhandler');\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n      app.use(multer());\n\n      // global variables\n      global['app'] = app;\n\n      // install routes\n      require('./routes/routes');\n      require('./routes/connectors');\n      require('./routes/push');\n\n      // error handling middleware should be loaded after the loading the routes\n      if ('development' == app.get('env')) {\n        app.use(errorHandler());\n      }\n      // starts express webserver\n      const server = http.createServer(app);\n      server.listen(app.get('port'), () => {\n        console.log('Express server listening on port ' + app.get('port'));\n      });\\n\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map