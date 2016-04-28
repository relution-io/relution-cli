"use strict";
var Command = (function () {
    function Command(name, commands) {
        if (!name || !name.length) {
            throw new Error('Command cant be used without a Name');
        }
        this.name = name;
        if (commands.length) {
            this.commands = commands;
        }
    }
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map