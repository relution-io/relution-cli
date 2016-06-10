"use strict";
var html = require('common-tags').html;
var EnvironmentTemplate = (function () {
    function EnvironmentTemplate() {
        this.name = '';
    }
    Object.defineProperty(EnvironmentTemplate.prototype, "template", {
        get: function () {
            // i know the tabs incorrect but its better for templating
            // try it before you change that
            return ((_a = ["\n      {\n        //all vars are usable in your hjson files\n        name: ", "\n      }\n    "], _a.raw = ["\n      {\n        //all vars are usable in your hjson files\n        name: ", "\n      }\n    "], html(_a, this.name)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    EnvironmentTemplate.prototype.render = function (name) {
        this.name = name;
        return this.template;
    };
    return EnvironmentTemplate;
}());
exports.EnvironmentTemplate = EnvironmentTemplate;
//# sourceMappingURL=EnvironmentTemplate.js.map