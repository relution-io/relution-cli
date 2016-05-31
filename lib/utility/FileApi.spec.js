"use strict";
var FileApi_1 = require('./FileApi');
var RxFs_1 = require('./RxFs');
var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
describe('File api', function () {
    var api;
    beforeEach(function () {
        api = new FileApi_1.FileApi();
    });
    it('read from a folder files by ext', function (done) {
        api.fileList(api.path, '.hjson').subscribe(function (file) {
            if (file) {
                expect(typeof file).to.be.equal('string');
                expect(file.indexOf('.hjson')).to.be.greaterThen(-1);
            }
        }, function (e) {
            // console.error(e.message, e.stack);
            done();
        }, function () { done(); });
    });
    it('copy a Object', function (done) {
        var a = { name: 'a' };
        var b = api.copyHjson(a);
        b.name = 'b';
        expect(a.name).to.be('a');
        expect(b.name).to.be('b');
        done();
    });
    it('write a hjson file to spec test folder', function (done) {
        api.path = __dirname + "/../../spec/gentest/";
        var neenv = "{\n      //mycomment\n      name: test\n    }";
        api.writeHjson(neenv, 'test').subscribe({
            next: function (written) {
                console.log(written);
                expect(RxFs_1.RxFs.exist(path.join(api.path, 'test.hjson'))).to.be(true);
            },
            error: function (e) {
                // console.error(e.message, e.stack);
                done();
            },
            complete: function () {
                var exist = fs.existsSync(api.path + "/test.hjson");
                expect(exist).to.be(true);
                done();
            }
        });
    });
    it('read a hjson file to spec test folder', function (done) {
        api.path = __dirname + "/../../spec/gentest/";
        var filePath = api.path + "/test." + api.hjsonSuffix;
        api.readHjson(filePath).subscribe({
            next: function (file) {
                expect(file.path).not.to.be(undefined);
                expect(file.path).to.be(filePath);
                expect(file.data).not.to.be(undefined);
                expect(file.data.name).to.be('test');
            },
            error: function (e) {
                // console.error(e.message, e.stack);
                done();
            },
            complete: function () {
                done();
            }
        });
    });
    it('create a structure folder', function (done) {
        var goalPath = path.join(__dirname + "/../../spec/gentest/structureFolderTest");
        api.mkdirStructureFolder(goalPath).subscribe(function (log) {
            // console.log('mylog', JSON.stringify(log, null, 2));
        }, function (e) {
            // console.error(e.message, e.stack);
            done();
        }, function () {
            // console.log('completed');
            expect(RxFs_1.RxFs.exist(goalPath)).to.be(true);
            expect(RxFs_1.RxFs.exist(goalPath + "/.gitkeep")).to.be(true);
            done();
        });
    });
    it('delete the structure Folder', function (done) {
        var goalPath = path.join(__dirname + "/../../spec/gentest/structureFolderTest");
        RxFs_1.RxFs.rmDir(goalPath).debounceTime(1000).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(goalPath)).to.be(false);
                done();
            }
        });
    });
});
//# sourceMappingURL=FileApi.spec.js.map