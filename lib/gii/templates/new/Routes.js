"use strict";
var html = require('common-tags').html;
var Routes = (function () {
    function Routes() {
        this.name = 'routes';
        this.publishName = 'routes.js';
        this.parentFolder = 'routes';
    }
    Object.defineProperty(Routes.prototype, "template", {
        get: function () {
            return ((_a = ["\n      'use strict';\n      /**\n       * @file routes.js\n       *\n       */\n\n      var about = require('../package.json');\n      module.exports = (function routes(app) {\n\n        // lists all available API.\n        app.get('/index.json',\n          /**\n           * provides an overview of available API, state, etc.\n           *\n           * @param req unused.\n           * @param res body is an informal JSON that can be used for health monitoring, for example.\n           * @return {*} unspecified value.\n           */\n          function getRoutes(req, res) {\n            var index = {\n              name: about.name,\n              version: about.version,\n              description: about.description,\n              routes: app.routes\n            };\n            return res.json(index);\n          }\n        );\n      })(global.app);\n    "], _a.raw = ["\n      'use strict';\n      /**\n       * @file routes.js\n       *\n       */\n\n      var about = require('../package.json');\n      module.exports = (function routes(app) {\n\n        // lists all available API.\n        app.get('/index.json',\n          /**\n           * provides an overview of available API, state, etc.\n           *\n           * @param req unused.\n           * @param res body is an informal JSON that can be used for health monitoring, for example.\n           * @return {*} unspecified value.\n           */\n          function getRoutes(req, res) {\n            var index = {\n              name: about.name,\n              version: about.version,\n              description: about.description,\n              routes: app.routes\n            };\n            return res.json(index);\n          }\n        );\n      })(global.app);\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Routes;
}());
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map