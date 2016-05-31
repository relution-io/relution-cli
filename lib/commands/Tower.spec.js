"use strict";
var Tower_1 = require('./Tower');
var expect = require('expect.js');
describe('Commands Tower Relution', function () {
    var command;
    beforeEach(function () {
        command = new Tower_1.Tower({});
    });
    it('has name relution', function (done) {
        expect(command.name).to.equal('relution');
        done();
    });
    it('help command on relution', function (done) {
        expect(command.help).to.be(!undefined);
        done();
    });
    it('quit command on relution', function (done) {
        expect(command.quit).to.be(!undefined);
        done();
    });
});
//# sourceMappingURL=Tower.spec.js.map