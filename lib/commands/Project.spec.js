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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL1Byb2plY3Quc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQXNCLFdBQVcsQ0FBQyxDQUFBO0FBQ2xDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVwQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsSUFBSSxPQUFPLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFDckMsVUFBVSxDQUFDO1FBQ1QsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxRQUFRLEdBQWtCLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyRCxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBYztRQUM5QixFQUFFLENBQUMsU0FBTyxNQUFNLGVBQVksRUFBRSxVQUFDLElBQUk7WUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxVQUFDLElBQUk7UUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9