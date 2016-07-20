"use strict";
var html = require('common-tags').html;
var Routes = (function () {
    function Routes() {
        this.name = 'routes';
        this.publishName = 'routes.ts';
        this.parentFolder = 'routes';
    }
    Object.defineProperty(Routes.prototype, "template", {
        get: function () {
            return ((_a = ["\n        /**\n        * @file routes.ts\n        */\n        const about = require('../package.json');\n\n        export function init(app) {\n          app.get('/index.json',\n            /**\n            * provides an overview of available API, state, etc.\n            *\n            * @param req unused.\n            * @param res body is an informal JSON that can be used for health monitoring, for example.\n            * @return {*} unspecified value.\n            */\n            function getRoutes(req: any, res: any) {\n              const index = {\n                name: about.name,\n                version: about.version,\n                description: about.description,\n                routes: app.routes\n              };\n              return res.json(index);\n          });\n        }\n\n    "], _a.raw = ["\n        /**\n        * @file routes.ts\n        */\n        const about = require('../package.json');\n\n        export function init(app) {\n          app.get('/index.json',\n            /**\n            * provides an overview of available API, state, etc.\n            *\n            * @param req unused.\n            * @param res body is an informal JSON that can be used for health monitoring, for example.\n            * @return {*} unspecified value.\n            */\n            function getRoutes(req: any, res: any) {\n              const index = {\n                name: about.name,\n                version: about.version,\n                description: about.description,\n                routes: app.routes\n              };\n              return res.json(index);\n          });\n        }\\n\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Routes;
}());
exports.Routes = Routes;
//# sourceMappingURL=Routes.js.map