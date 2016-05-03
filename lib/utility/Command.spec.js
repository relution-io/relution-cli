"use strict";
var Command_1 = require('./Command');
describe('Utility Command', function () {
    var command;
    beforeEach(function () {
        command = new Command_1.Command('test');
        command.commands = {
            create: {
                description: 'test the commands'
            },
            help: {
                description: 'whatver'
            }
        };
        return command;
    });
    it('has a name', function (done) {
        expect(command.name).toEqual('test');
        done();
    });
    it('has commands', function (done) {
        expect(command.flatCommands()).toEqual(['create', 'help']);
        expect(command.showCommands).not.toBeUndefined();
        done();
    });
    it('has a help method', function (done) {
        expect(command.help).not.toBeUndefined();
        done();
    });
});
//# sourceMappingURL=Command.spec.js.map