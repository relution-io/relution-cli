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
            return ((_a = ["\n        /**\n        * @file routes.ts\n        */\n        const about = require('../package.json');\n\n        export function init(app: any) {\n          app.get('/index.json',\n            /**\n            * provides an overview of available API, state, etc.\n            *\n            * @param req unused.\n            * @param res body is an informal JSON that can be used for health monitoring, for example.\n            * @return {*} unspecified value.\n            */\n            function getRoutes(req: any, res: any) {\n              const index = {\n                name: about.name,\n                version: about.version,\n                description: about.description,\n                routes: app.routes\n              };\n              return res.json(index);\n          });\n        }\n    "], _a.raw = ["\n        /**\n        * @file routes.ts\n        */\n        const about = require('../package.json');\n\n        export function init(app: any) {\n          app.get('/index.json',\n            /**\n            * provides an overview of available API, state, etc.\n            *\n            * @param req unused.\n            * @param res body is an informal JSON that can be used for health monitoring, for example.\n            * @return {*} unspecified value.\n            */\n            function getRoutes(req: any, res: any) {\n              const index = {\n                name: about.name,\n                version: about.version,\n                description: about.description,\n                routes: app.routes\n              };\n              return res.json(index);\n          });\n        }\n    "], html(_a)) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Routes;
}());
exports.Routes = Routes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L1JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6QztJQUFBO1FBQ1MsU0FBSSxHQUFXLFFBQVEsQ0FBQztRQUN4QixnQkFBVyxHQUFXLFdBQVcsQ0FBQztRQUNsQyxpQkFBWSxHQUFXLFFBQVEsQ0FBQztJQThCekMsQ0FBQztJQTVCQyxzQkFBSSw0QkFBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSxnekJBeUJYLGcwQkF6Qk8sSUFBSSxLQXlCWCxHQUFHLElBQUksQ0FBQyxDQUFDOztRQUNaLENBQUM7OztPQUFBO0lBQ0gsYUFBQztBQUFELENBQUMsQUFqQ0QsSUFpQ0M7QUFqQ1ksY0FBTSxTQWlDbEIsQ0FBQSJ9