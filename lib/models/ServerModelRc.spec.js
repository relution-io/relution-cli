"use strict";
var ServerModelRc_1 = require('./ServerModelRc');
var expect = require('expect.js');
describe('ServerModelRc', function () {
    var model;
    var temp = {
        'default': false,
        'id': 'beckmann new',
        'serverUrl': 'http://10.21.4.60:8080',
        'userName': 'ibxdev',
        'password': 'ibxdev'
    };
    beforeEach(function () {
        model = new ServerModelRc_1.ServerModelRc(temp);
    });
    it('convert into a json object', function (done) {
        expect(model.toJSON).not.to.be(undefined);
        expect(Object.keys(model.toJSON()).toString()).to.be.equal(Object.keys(temp).toString());
        done();
    });
});
//# sourceMappingURL=ServerModelRc.spec.js.map