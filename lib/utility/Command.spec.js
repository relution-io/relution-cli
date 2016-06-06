"use strict";
var Command_1 = require('./Command');
var expect = require('expect.js');
describe('Utility Command', function () {
    var command;
    beforeEach(function () {
        command = new Command_1.Command('test');
        command.commands = {
            create: {
                description: 'test the commands'
            },
            help: {
                description: 'whatever'
            }
        };
        return command;
    });
    it('has a name', function (done) {
        expect(command.name).to.equal('test');
        done();
    });
    it('has commands', function (done) {
        expect(command.flatCommands().toString()).to.equal(['create', 'help'].toString());
        expect(command.showCommands).not.to.be(undefined);
        done();
    });
    it('has a help method', function (done) {
        expect(command.help).not.to.be(undefined);
        done();
    });
    it('has a home method', function (done) {
        expect(command.home).not.to.be(undefined);
        done();
    });
});
//# sourceMappingURL=Command.spec.js.map