"use strict";
var New_1 = require('./New');
describe('Command New', function () {
    var project = new New_1.New();
    beforeEach(function () {
        project.preload().subscribe();
    });
    var commands = project.flatCommands();
    commands.forEach(function (method) {
        it("has " + method + " as method", function (done) {
            expect(project[method]).toBeDefined();
            done();
        });
    });
    it('has new as name', function (done) {
        expect(project.name).toBe('new');
        done();
    });
});
//# sourceMappingURL=New.spec.js.map