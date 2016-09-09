"use strict";
var html = require('common-tags').html;
var TsConfigJson = (function () {
    function TsConfigJson() {
        this.publishName = 'tsconfig.json';
        this.name = 'tsconfig';
    }
    Object.defineProperty(TsConfigJson.prototype, "template", {
        get: function () {
            return ((_a = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"ES5\",\n          \"module\": \"commonjs\",\n          \"declaration\": false,\n          \"sourceMap\": true,\n          \"rootDir\": \"./\",\n          \"outDir\": \"./\",\n          \"pretty\": true,\n          \"stripInternal\": true,\n          \"noEmitOnError\": true,\n          \"noImplicitAny\": false,\n          \"suppressImplicitAnyIndexErrors\": true,\n          \"noFallthroughCasesInSwitch\": true,\n          \"noImplicitReturns\": false,\n          \"forceConsistentCasingInFileNames\": true,\n          \"newLine\": \"lf\"\n        },\n        \"filesGlob\": [\n          \"**/!(*.d).ts\",\n          \"!node_modules/**/*.d.ts\",\n          \"!node_modules/**/*.ts\",\n          \"typings/index.d.ts\"\n        ]\n      }\n\n    "], _a.raw = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"ES5\",\n          \"module\": \"commonjs\",\n          \"declaration\": false,\n          \"sourceMap\": true,\n          \"rootDir\": \"./\",\n          \"outDir\": \"./\",\n          \"pretty\": true,\n          \"stripInternal\": true,\n          \"noEmitOnError\": true,\n          \"noImplicitAny\": false,\n          \"suppressImplicitAnyIndexErrors\": true,\n          \"noFallthroughCasesInSwitch\": true,\n          \"noImplicitReturns\": false,\n          \"forceConsistentCasingInFileNames\": true,\n          \"newLine\": \"lf\"\n        },\n        \"filesGlob\": [\n          \"**/!(*.d).ts\",\n          \"!node_modules/**/*.d.ts\",\n          \"!node_modules/**/*.ts\",\n          \"typings/index.d.ts\"\n        ]\n      }\\n\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return TsConfigJson;
}());
exports.TsConfigJson = TsConfigJson;
//# sourceMappingURL=TsConfigJson.js.map