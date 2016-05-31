"use strict";
var Server_1 = require('./Server');
var expect = require('expect.js');
describe('Command Server', function () {
    var server = new Server_1.Server();
    beforeEach(function () {
        server.preload().subscribe();
    });
    var commands = server.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(server[method]).not.to.be(undefined);
            done();
        });
    });
    it('has server as name', function (done) {
        expect(server.name).to.be('server');
        done();
    });
});
//# sourceMappingURL=Server.spec.js.map