"use strict";
var Server_1 = require('./commands/Server');
var Tower_1 = require('./commands/Tower');
var staticCommands = {
    server: new Server_1.Server()
};
var relution = new Tower_1.Tower(staticCommands);
//# sourceMappingURL=cli.js.map