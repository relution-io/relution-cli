"use strict";
var Relution_1 = require('./Relution');
describe('Commands Relution', function () {
    var command;
    beforeEach(function () {
        command = new Relution_1.Relution({});
    });
    it('has name relution', function (done) {
        expect(command.name).toEqual('relution');
        done();
    });
    it('help command on relution', function (done) {
        var temp = command.init(['relution', 'help']);
        expect(temp.isUnsubscribed).toBe(true);
        expect(temp.syncErrorValue).toBe(null);
        expect(temp.syncErrorThrown).toBe(false);
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
//# sourceMappingURL=Relution.spec.js.map