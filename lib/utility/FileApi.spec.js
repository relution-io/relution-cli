"use strict";
var FileApi_1 = require('./FileApi');
describe('File api', function () {
    it('read from a folder files by ext', function (done) {
        var api = new FileApi_1.FileApi();
        api.fileList(__dirname + "/devtest", '.hjson').subscribe(function (files) {
            console.log(files);
            expect(typeof files).toEqual('Array');
        }, function () { }, function () { done(); });
    });
});
//# sourceMappingURL=FileApi.spec.js.map