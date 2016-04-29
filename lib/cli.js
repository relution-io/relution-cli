"use strict";
var Server_1 = require('./commands/Server');
var Relution_1 = require('./commands/Relution');
var staticCommands = {
    server: new Server_1.Server()
};
if (process.argv[2] === 'relution') {
    var relution = new Relution_1.Relution(staticCommands);
}
//# sourceMappingURL=cli.js.map