"use strict";
var New_1 = require('./New');
var expect = require('expect.js');
describe('Command New', function () {
    var project = new New_1.New();
    beforeEach(function () {
        project.preload().subscribe();
    });
    var commands = project.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(project[method]).not.to.be(undefined);
            done();
        });
    });
    it('has new as name', function (done) {
        expect(project.name).to.be('new');
        done();
    });
});
//# sourceMappingURL=New.spec.js.map