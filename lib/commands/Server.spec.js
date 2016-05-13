"use strict";
var Server_1 = require('./Server');
describe('Command Server', function () {
    var server = new Server_1.Server();
    beforeEach(function () {
        server.preload().subscribe();
    });
    var commands = server.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(server[method]).toBeDefined();
            done();
        });
    });
    it('has server as name', function (done) {
        expect(server.name).toBe('server');
        done();
    });
});
//# sourceMappingURL=Server.spec.js.map