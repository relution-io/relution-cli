"use strict";
var Environment_1 = require('./Environment');
describe('Command Environment', function () {
    var env = new Environment_1.Environment();
    beforeEach(function () {
        env.preload().subscribe();
    });
    var commands = env.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(env[method]).toBeDefined();
            done();
        });
    });
    it('has env as name', function (done) {
        expect(env.name).toBe('env');
        done();
    });
});
//# sourceMappingURL=Environment.spec.js.map