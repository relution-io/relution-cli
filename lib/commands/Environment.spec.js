"use strict";
var Environment_1 = require('./Environment');
var expect = require('expect.js');
describe('Command Environment', function () {
    var env = new Environment_1.Environment();
    beforeEach(function () {
        env.preload().subscribe();
    });
    var commands = env.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(env[method]).not.to.be(undefined);
            done();
        });
    });
    it('has env as name', function (done) {
        expect(env.name).to.be('env');
        done();
    });
});
//# sourceMappingURL=Environment.spec.js.map