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
              "q": "~1.4.1",
              "body-parser": "^1.5.2",
              "errorhandler": "^1.1.1",
              "express": "^4.8.0",
              "express-session": "^1.7.2",
              "jade": "^0.1.0",
              "method-override": "^2.1.2",
              "morgan": "^1.2.2",
              "multer": "^0.1.3",
              "serve-favicon": "^2.0.1"
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
            return ((_a = ["\n      {\n        \"name\": \"", "\",\n        \"version\": \"", "\",\n        \"main\": \"", "\",\n        \"description\": \"", "\",\n        \"dependencies\": {\n          \"lodash\": \"~4.5.1\",\n          \"q\": \"~1.4.1\",\n          \"body-parser\": \"^1.10.0\",\n          \"errorhandler\": \"^1.1.1\",\n          \"express\": \"^4.10.5\",\n          \"express-session\": \"^1.7.2\",\n          \"jade\": \"^0.1.0\",\n          \"method-override\": \"^2.1.2\",\n          \"morgan\": \"^1.2.2\",\n          \"multer\": \"^0.1.3\",\n          \"serve-favicon\": \"^2.0.1\"\n        },\n        \"engines\": {\n          \"node\": \">=4.4.0\"\n        },\n        \"devDependencies\": {\n          \"@types/body-parser\": \"^0.0.33\",\n          \"@types/es6-collections\": \"^0.5.29\",\n          \"@types/es6-promise\": \"^0.0.32\",\n          \"@types/express\": \"^4.0.32\",\n          \"@types/express-serve-static-core\": \"^4.0.37\",\n          \"@types/multer\": \"^0.0.32\",\n          \"@types/node\": \"^6.0.45\",\n          \"@types/q\": \"^0.0.32\",\n          \"@types/serve-static\": \"^1.7.31\",\n          \"@types/lodash\": \"^4.14.37\",\n          \"@types/mime\": \"^0.0.29\",\n          \"tslint\": \"^3.8.1\",\n          \"typedoc\": \"github:sierrasoftworks/typedoc#v1.8.10\",\n          \"typescript\": \"^2.0.3\"\n        },\n        \"scripts\": {\n          \"precommit\": \"npm run tslint\",\n          \"tslint\": \"tslint src/**/*.ts\",\n          \"build\": \"tsc -p .\",\n          \"api\": \"typedoc -p . --rootDir src --out www --module commonjs --stripInternal --name ", " --exclude **/*.spec.ts src typings/main.d.ts\",\n          \"serve-api\": \"http-server public/docs\",\n          \"watch\": \"tsc -p . -w\"\n        }\n      }\n\n    "], _a.raw = ["\n      {\n        \"name\": \"", "\",\n        \"version\": \"", "\",\n        \"main\": \"", "\",\n        \"description\": \"", "\",\n        \"dependencies\": {\n          \"lodash\": \"~4.5.1\",\n          \"q\": \"~1.4.1\",\n          \"body-parser\": \"^1.10.0\",\n          \"errorhandler\": \"^1.1.1\",\n          \"express\": \"^4.10.5\",\n          \"express-session\": \"^1.7.2\",\n          \"jade\": \"^0.1.0\",\n          \"method-override\": \"^2.1.2\",\n          \"morgan\": \"^1.2.2\",\n          \"multer\": \"^0.1.3\",\n          \"serve-favicon\": \"^2.0.1\"\n        },\n        \"engines\": {\n          \"node\": \">=4.4.0\"\n        },\n        \"devDependencies\": {\n          \"@types/body-parser\": \"^0.0.33\",\n          \"@types/es6-collections\": \"^0.5.29\",\n          \"@types/es6-promise\": \"^0.0.32\",\n          \"@types/express\": \"^4.0.32\",\n          \"@types/express-serve-static-core\": \"^4.0.37\",\n          \"@types/multer\": \"^0.0.32\",\n          \"@types/node\": \"^6.0.45\",\n          \"@types/q\": \"^0.0.32\",\n          \"@types/serve-static\": \"^1.7.31\",\n          \"@types/lodash\": \"^4.14.37\",\n          \"@types/mime\": \"^0.0.29\",\n          \"tslint\": \"^3.8.1\",\n          \"typedoc\": \"github:sierrasoftworks/typedoc#v1.8.10\",\n          \"typescript\": \"^2.0.3\"\n        },\n        \"scripts\": {\n          \"precommit\": \"npm run tslint\",\n          \"tslint\": \"tslint src/**/*.ts\",\n          \"build\": \"tsc -p .\",\n          \"api\": \"typedoc -p . --rootDir src --out www --module commonjs --stripInternal --name ", " --exclude **/*.spec.ts src typings/main.d.ts\",\n          \"serve-api\": \"http-server public/docs\",\n          \"watch\": \"tsc -p . -w\"\n        }\n      }\\n\n    "], html(_a, this.name, this.version, this.main, this.description, this.name)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return PackageJson;
}());
exports.PackageJson = PackageJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ2lpL3RlbXBsYXRlcy9uZXcvUGFja2FnZUpzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7SUFBQTtRQUNTLGdCQUFXLEdBQVcsY0FBYyxDQUFDO1FBQ3JDLFNBQUksR0FBVyxLQUFLLENBQUM7UUFDckIsU0FBSSxHQUFXLFFBQVEsQ0FBQztRQUN4QixnQkFBVyxHQUFXLHNCQUFvQixJQUFJLENBQUMsSUFBTSxDQUFDO1FBQ3RELFlBQU8sR0FBVyxPQUFPLENBQUM7SUFnRm5DLENBQUM7SUFsREMsc0JBQUksaUNBQVE7UUE3Qlo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E0Qkc7YUFDSDtZQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQUksaUNBRUcsRUFBUyw4QkFDTixFQUFZLDJCQUNmLEVBQVMsa0NBQ0YsRUFBZ0IsdzhDQXFDd0QsRUFBUywyS0FLdEcsMHdEQS9DTyxJQUFJLEtBRUcsSUFBSSxDQUFDLElBQUksRUFDTixJQUFJLENBQUMsT0FBTyxFQUNmLElBQUksQ0FBQyxJQUFJLEVBQ0YsSUFBSSxDQUFDLFdBQVcsRUFxQ3dELElBQUksQ0FBQyxJQUFJLEVBS3RHLENBQUMsQ0FBQzs7UUFDTCxDQUFDOzs7T0FBQTtJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXJGRCxJQXFGQztBQXJGWSxtQkFBVyxjQXFGdkIsQ0FBQSJ9