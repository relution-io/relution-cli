"use strict";
var html = require('common-tags').html;
var App = (function () {
    function App() {
        this.publishName = 'app.ts';
        this.name = 'app';
    }
    Object.defineProperty(App.prototype, "template", {
        get: function () {
            return ((_a = ["\n      /**\n       * @file app.js\n       */\n      import * as express from 'express';\n      import * as bodyParser from 'body-parser';\n      import {init as routesRoute} from './routes/routes';\n      import {init as pushRoute} from './routes/push';\n      import {init as connectorsRoute} from './routes/connectors';\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n\n      // global variables\n      global['app'] = app;\n      // install routes\n      routesRoute(app);\n      pushRoute(app);\n      connectorsRoute(app);\n      // start express server\n      app.listen(app.get('port'));\n    "], _a.raw = ["\n      /**\n       * @file app.js\n       */\n      import * as express from 'express';\n      import * as bodyParser from 'body-parser';\n      import {init as routesRoute} from './routes/routes';\n      import {init as pushRoute} from './routes/push';\n      import {init as connectorsRoute} from './routes/connectors';\n\n      const app = express();\n      app.use(bodyParser.json());\n      app.use(bodyParser.urlencoded({ extended: true }));\n\n      // global variables\n      global['app'] = app;\n      // install routes\n      routesRoute(app);\n      pushRoute(app);\n      connectorsRoute(app);\n      // start express server\n      app.listen(app.get('port'));\n    "], html(_a)) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return App;
}());
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L0FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6QztJQUFBO1FBQ1MsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0IsU0FBSSxHQUFXLEtBQUssQ0FBQztJQTJCOUIsQ0FBQztJQXpCQyxzQkFBSSx5QkFBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSwwcUJBc0JYLDByQkF0Qk8sSUFBSSxLQXNCWCxHQUFHLElBQUksQ0FBQyxDQUFDOztRQUNaLENBQUM7OztPQUFBO0lBQ0gsVUFBQztBQUFELENBQUMsQUE3QkQsSUE2QkM7QUE3QlksV0FBRyxNQTZCZixDQUFBIn0=