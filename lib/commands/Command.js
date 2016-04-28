"use strict";
var Command = (function () {
    function Command() {
    }
    Object.defineProperty(Command.prototype, "name", {
        /**
         * return the command name as a String
         */
        get: function () {
            return this.name;
        },
        /**
         * set the Command Root Name
         */
        set: function (v) {
            this.name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Command.prototype, "commands", {
        /**
         * get all availables subcommands from a Command
         */
        get: function () {
            return this.commands;
        },
        /**
         * return the command name as a String
         */
        set: function (v) {
            this.commands = v;
        },
        enumerable: true,
        configurable: true
    });
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map