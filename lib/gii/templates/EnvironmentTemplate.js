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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52aXJvbm1lbnRUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL0Vudmlyb25tZW50VGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFHekM7SUFBQTtRQUNTLFNBQUksR0FBVyxFQUFFLENBQUM7SUFrQjNCLENBQUM7SUFmQyxzQkFBSSx5Q0FBUTthQUFaO1lBQ0UsMERBQTBEO1lBQzFELGdDQUFnQztZQUNoQyxNQUFNLENBQUEsQ0FBQyxPQUFJLDhFQUdDLEVBQVMsaUJBRXBCLGlIQUxNLElBQUksS0FHQyxJQUFJLENBQUMsSUFBSSxFQUVwQixDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFFTSxvQ0FBTSxHQUFiLFVBQWMsSUFBWTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLDJCQUFtQixzQkFtQi9CLENBQUEifQ==