"use strict";
var Project_1 = require('./Project');
var expect = require('expect.js');
describe('Command Project', function () {
    var project = new Project_1.Project();
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
    it('has project as name', function (done) {
        expect(project.name).to.be('project');
        done();
    });
});
//# sourceMappingURL=Project.spec.js.map