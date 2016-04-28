"use strict";
var SubCommand = (function () {
    function SubCommand(name, vars) {
        if (!name || !name.length) {
            throw new Error('Subcommand need a name');
        }
        this.name = name;
        if (vars) {
            this.vars = vars;
        }
    }
    return SubCommand;
}());
exports.SubCommand = SubCommand;
//# sourceMappingURL=SubCommand.js.map