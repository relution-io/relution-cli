"use strict";
var html = require('common-tags').html;
var PackageJson = (function () {
    function PackageJson() {
        this.publishName = 'package.json';
        this.name = 'app';
        this.main = 'app.js';
        this.description = "Auto description " + this.name;
        this.version = '0.0.1';
    }
    Object.defineProperty(PackageJson.prototype, "template", {
        /**
         * ```json
         * {
            "name": "madp-simple",
            "version": "1.0.0",
            "main": "app.js",
            "dependencies": {
              "lodash": "^4.5.1",
              "q": "~1.4.1"
            },
            "devDependencies": {
              "jsdoc": "git+https://github.com/jsdoc3/jsdoc.git"
            },
            "scripts": {
              "jsdoc": "jsdoc ./ -r -c ./conf.json -d ./../jsdocs",
              "startDoc": "http-server ./../jsdoc -p 6868"
            }
          }
         * ```
         */
        get: function () {
            return ((_a = ["\n      {\n        \"name\": \"", "\",\n        \"version\": \"", "\",\n        \"main\": \"", "\",\n        \"description\": \"", "\",\n        \"dependencies\": {\n          \"lodash\": \"~4.5.1\",\n          \"q\": \"~1.4.1\"\n        },\n        \"devDependencies\": {\n          \"jsdoc\": \"git+https://github.com/jsdoc3/jsdoc.git\"\n        },\n        \"scripts\": {\n          \"jsdoc\": \"jsdoc ./ -r -c ./conf.json -d ./../jsdocs\",\n          \"startDoc\": \"http-server ./../jsdoc -p 6868\"\n        }\n      }\n\n    "], _a.raw = ["\n      {\n        \"name\": \"", "\",\n        \"version\": \"", "\",\n        \"main\": \"", "\",\n        \"description\": \"", "\",\n        \"dependencies\": {\n          \"lodash\": \"~4.5.1\",\n          \"q\": \"~1.4.1\"\n        },\n        \"devDependencies\": {\n          \"jsdoc\": \"git+https://github.com/jsdoc3/jsdoc.git\"\n        },\n        \"scripts\": {\n          \"jsdoc\": \"jsdoc ./ -r -c ./conf.json -d ./../jsdocs\",\n          \"startDoc\": \"http-server ./../jsdoc -p 6868\"\n        }\n      }\\n\n    "], html(_a, this.name, this.version, this.main, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return PackageJson;
}());
exports.PackageJson = PackageJson;
//# sourceMappingURL=PackageJson.js.map