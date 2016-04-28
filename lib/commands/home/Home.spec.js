"use strict";
var Home_1 = require('./Home');
describe('Home Command', function () {
    var commandHome = new Home_1.Home();
    beforeEach(function () {
        commandHome = new Home_1.Home();
    });
    it('should have a name', function (done) {
        console.log('commandHome');
        console.log(commandHome);
        // expect(commandHome.name).tobe('Home');
        done();
    });
});
//# sourceMappingURL=Home.spec.js.map