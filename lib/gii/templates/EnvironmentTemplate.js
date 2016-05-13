"use strict";
var Hjson = require('hjson');
var EnvironmentTemplate = (function () {
    function EnvironmentTemplate() {
        this.name = '';
    }
    Object.defineProperty(EnvironmentTemplate.prototype, "template", {
        /**
         *   Hjson.parse(text, options)
            options {
              keepWsc     boolean, keep white space and comments. This is useful
                          if you want to edit an hjson file and save it while
                          preserving comments (default false)
            }
            This method parses Hjson text to produce an object or array.
            It can throw a SyntaxError exception.
            Hjson.stringify(value, options)
         */
        get: function () {
            //i know the tabs incorrect but its better for templating
            // try it before you change that
            return ("\n{\n  //all vars are usable in your hjson files\n  name: " + this.name + "\n}");
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