"use strict";
var Home_1 = require('./Home');
describe('Home Command', function () {
    var commandHome = null;
    beforeEach(function (done) {
        commandHome = new Home_1.Home();
        done();
    });
    it('should have a name', function (done) {
        console.log(commandHome);
        // expect(commandHome.name).tobe('Home');
        done();
    });
});
//# sourceMappingURL=Home.spec.js.map