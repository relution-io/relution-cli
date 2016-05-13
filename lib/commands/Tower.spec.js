"use strict";
var Tower_1 = require('./Tower');
describe('Commands Tower Relution', function () {
    var command;
    beforeEach(function () {
        command = new Tower_1.Tower({});
    });
    it('has name relution', function (done) {
        expect(command.name).toEqual('relution');
        done();
    });
    it('help command on relution', function (done) {
        var temp = command.init();
        done();
    });
    it('quit command on relution', function (done) {
        // let temp:any = command.init(['relution', 'quit']);
        // expect(temp.isUnsubscribed).toBe(true);
        // expect(temp.syncErrorValue).toBe(null);
        // expect(temp.syncErrorThrown).toBe(false);
        done();
    });
});
//# sourceMappingURL=Tower.spec.js.map