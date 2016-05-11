"use strict";
var ServerModelRc_1 = require('./ServerModelRc');
describe('ServerModelRc', function () {
    var model;
    var temp = {
        "default": false,
        "id": "beckmann new",
        "serverUrl": "http://10.21.4.60:8080",
        "userName": "ibxdev",
        "password": "ibxdev"
    };
    beforeEach(function () {
        model = new ServerModelRc_1.ServerModelRc(temp);
    });
    it('has attributes', function (done) {
        expect(model.attributes).toBeDefined();
        expect(model.attributes).toEqual(Object.keys(temp));
        done();
    });
    it('convert into a json object', function (done) {
        expect(model.toJson).toBeDefined();
        expect(Object.keys(model.toJson())).toEqual(Object.keys(temp));
        done();
    });
});
//# sourceMappingURL=ServerModelRc.spec.js.map