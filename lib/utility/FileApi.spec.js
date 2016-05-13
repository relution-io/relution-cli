"use strict";
var FileApi_1 = require('./FileApi');
var fs = require('fs');
var Hjson = require('hjson');
describe('File api', function () {
    var api;
    beforeEach(function () {
        api = new FileApi_1.FileApi();
    });
    it('read from a folder files by ext', function (done) {
        api.fileList(api.path, '.hjson').subscribe(function (file) {
            if (file) {
                expect(typeof file).toEqual('string');
                expect(file.indexOf('.hjson')).toBeGreaterThan(-1);
            }
        }, function () { }, function () { done(); });
    });
    it('copy a Object', function (done) {
        var a = { name: 'a' };
        var b = api.copyHjson(a);
        b.name = 'b';
        expect(a.name).toBe('a');
        expect(b.name).toBe('b');
        done();
    });
    it('write a hjson file to spec test folder', function (done) {
        //wtf
        api.path = __dirname + "/../../spec/gentest/";
        var neenv = "{\n      //mycomment\n      name: test\n    }";
        api.writeHjson(neenv, 'test').subscribe({
            next: function (written) {
                expect(written).toBe(true);
            },
            error: function (e) {
                console.error(e);
            },
            complete: function () {
                var exist = fs.existsSync(api.path + "/test.hjson");
                expect(exist).toBe(true);
                done();
            }
        });
    });
    it('read a hjson file to spec test folder', function (done) {
        //wtf
        api.path = __dirname + "/../../spec/gentest/";
        var filePath = api.path + "/test." + api.hjsonSuffix;
        api.readHjson(filePath).subscribe({
            next: function (file) {
                expect(file.path).toBeDefined();
                expect(file.path).toBe(filePath);
                expect(file.data).toBeDefined();
                expect(file.data.name).toBe('test');
            },
            error: function (e) {
                console.error(e);
            },
            complete: function () {
                done();
            }
        });
    });
});
//# sourceMappingURL=FileApi.spec.js.map