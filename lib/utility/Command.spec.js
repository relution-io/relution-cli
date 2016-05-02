"use strict";
var Command_1 = require('./Command');
describe('Utility Command', function () {
    var command;
    beforeEach(function () {
        command = new Command_1.Command('test');
        command.commands = {
            create: {
                description: 'test the commands'
            }
        };
        return command;
    });
    it('has a name', function (done) {
        expect(command.name).toEqual('test');
        done();
    });
    it('has commands', function (done) {
        expect(command.flatCommands()).toEqual(['create']);
        expect(command.help).not.toBeUndefined();
        expect(command.quit).not.toBeUndefined();
        expect(command.showCommands).not.toBeUndefined();
        done();
    });
    it('has command inquirer list', function (done) {
        command.showCommands();
        done();
    });
});
//# sourceMappingURL=Command.spec.js.map