"use strict";
var Hjson = require('hjson');
var EnvironmentTemplate = (function () {
    function EnvironmentTemplate() {
        this.name = '';
    }
    Object.defineProperty(EnvironmentTemplate.prototype, "template", {
        get: function () {
            return Hjson.parse("\n    {\n      //all vars are usable in your hjson files\n      name: " + this.name + "\n    }");
        },
        enumerable: true,
        configurable: true
    });
    EnvironmentTemplate.prototype.render = function (name) {
        this.name = name;
        console.log(this.template);
        return this.template;
    };
    return EnvironmentTemplate;
}());
exports.EnvironmentTemplate = EnvironmentTemplate;
//# sourceMappingURL=Environment.js.map