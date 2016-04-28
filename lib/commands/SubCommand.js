"use strict";
var SubCommand = (function () {
    function SubCommand(name, vars) {
        this.name = name;
        if (vars) {
            this.vars = vars;
        }
    }
    Object.defineProperty(SubCommand.prototype, "name", {
        get: function () {
            return this.name;
        },
        set: function (v) {
            this.name = v;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(SubCommand.prototype, "vars", {
        get: function () {
            return this.vars;
        },
        set: function (v) {
            this.vars = v;
        },
        enumerable: true,
        configurable: true
    });
    return SubCommand;
}());
exports.SubCommand = SubCommand;
//# sourceMappingURL=SubCommand.js.map