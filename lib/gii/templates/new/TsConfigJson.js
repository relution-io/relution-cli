"use strict";
var html = require('common-tags').html;
var TsConfigJson = (function () {
    function TsConfigJson() {
        this.publishName = 'tsconfig.json';
        this.name = 'tsconfig';
    }
    Object.defineProperty(TsConfigJson.prototype, "template", {
        get: function () {
            return ((_a = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"ES5\",\n          \"module\": \"commonjs\",\n          \"declaration\": false,\n          \"sourceMap\": true,\n          \"rootDir\": \"./\",\n          \"pretty\": true,\n          \"stripInternal\": true,\n          \"noEmitOnError\": true,\n          \"noImplicitAny\": false,\n          \"suppressImplicitAnyIndexErrors\": true,\n          \"noFallthroughCasesInSwitch\": true,\n          \"noImplicitReturns\": false,\n          \"forceConsistentCasingInFileNames\": true,\n          \"newLine\": \"LF\",\n          \"typeRoots\" : [\"./node_modules/@types\"]\n        },\n        \"include\": [\n          \"./**/*.ts\"\n        ],\n        \"exclude\": [\n          \"./**/*.d.ts\",\n          \"node_modules/**/*.d.ts\",\n          \"node_modules/**/*.ts\"\n        ]\n      }\n\n    "], _a.raw = ["\n      {\n        \"compilerOptions\": {\n          \"target\": \"ES5\",\n          \"module\": \"commonjs\",\n          \"declaration\": false,\n          \"sourceMap\": true,\n          \"rootDir\": \"./\",\n          \"pretty\": true,\n          \"stripInternal\": true,\n          \"noEmitOnError\": true,\n          \"noImplicitAny\": false,\n          \"suppressImplicitAnyIndexErrors\": true,\n          \"noFallthroughCasesInSwitch\": true,\n          \"noImplicitReturns\": false,\n          \"forceConsistentCasingInFileNames\": true,\n          \"newLine\": \"LF\",\n          \"typeRoots\" : [\"./node_modules/@types\"]\n        },\n        \"include\": [\n          \"./**/*.ts\"\n        ],\n        \"exclude\": [\n          \"./**/*.d.ts\",\n          \"node_modules/**/*.d.ts\",\n          \"node_modules/**/*.ts\"\n        ]\n      }\\n\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return TsConfigJson;
}());
exports.TsConfigJson = TsConfigJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHNDb25maWdKc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L1RzQ29uZmlnSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6QztJQUFBO1FBQ1MsZ0JBQVcsR0FBVyxlQUFlLENBQUM7UUFDdEMsU0FBSSxHQUFXLFVBQVUsQ0FBQztJQWlDbkMsQ0FBQztJQS9CQyxzQkFBSSxrQ0FBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSw4MUJBNEJYLCsyQkE1Qk8sSUFBSSxLQTRCWCxDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFDSCxtQkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksb0JBQVksZUFtQ3hCLENBQUEifQ==