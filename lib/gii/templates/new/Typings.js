"use strict";
var html = require('common-tags').html;
var TypingsJson = (function () {
    function TypingsJson() {
        this.publishName = 'typings.json';
        this.name = '';
        this.main = '';
    }
    Object.defineProperty(TypingsJson.prototype, "template", {
        get: function () {
            return ((_a = ["\n      {\n      \"globalDependencies\": {\n        \"body-parser\": \"registry:dt/body-parser#0.0.0+20160619023215\",\n        \"es6-collections\": \"registry:dt/es6-collections#0.5.1+20160316155526\",\n        \"es6-promise\": \"registry:dt/es6-promise#0.0.0+20160614011821\",\n        \"express\": \"registry:dt/express#4.0.0+20160708185218\",\n        \"express-serve-static-core\": \"registry:dt/express-serve-static-core#4.0.0+20160819131900\",\n        \"multer\": \"registry:dt/multer#0.0.0+20160818200730\",\n        \"node\": \"registry:dt/node#6.0.0+20160818175514\",\n        \"q\": \"registry:dt/q#0.0.0+20160613154756\",\n        \"serve-static\": \"registry:dt/serve-static#0.0.0+20160606155157\"\n      },\n      \"dependencies\": {\n        \"lodash\": \"registry:npm/lodash#4.0.0+20160723033700\",\n        \"mime\": \"registry:npm/mime#1.3.0+20160723033700\"\n      }\n    }\n    \n\n    "], _a.raw = ["\n      {\n      \"globalDependencies\": {\n        \"body-parser\": \"registry:dt/body-parser#0.0.0+20160619023215\",\n        \"es6-collections\": \"registry:dt/es6-collections#0.5.1+20160316155526\",\n        \"es6-promise\": \"registry:dt/es6-promise#0.0.0+20160614011821\",\n        \"express\": \"registry:dt/express#4.0.0+20160708185218\",\n        \"express-serve-static-core\": \"registry:dt/express-serve-static-core#4.0.0+20160819131900\",\n        \"multer\": \"registry:dt/multer#0.0.0+20160818200730\",\n        \"node\": \"registry:dt/node#6.0.0+20160818175514\",\n        \"q\": \"registry:dt/q#0.0.0+20160613154756\",\n        \"serve-static\": \"registry:dt/serve-static#0.0.0+20160606155157\"\n      },\n      \"dependencies\": {\n        \"lodash\": \"registry:npm/lodash#4.0.0+20160723033700\",\n        \"mime\": \"registry:npm/mime#1.3.0+20160723033700\"\n      }\n    }\n    \\n\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return TypingsJson;
}());
exports.TypingsJson = TypingsJson;
//# sourceMappingURL=Typings.js.map