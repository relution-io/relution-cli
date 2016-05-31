"use strict";
var RxFs_1 = require('./RxFs');
var path = require('path');
var expect = require('expect.js');
describe('Utility RxFs', function () {
    it('create a folder', function (done) {
        var testPath = "" + path.join(__dirname, '..', '..', 'spec', 'gentest', 'app');
        RxFs_1.RxFs.mkdir(testPath).subscribe(function (log) {
            expect(RxFs_1.RxFs.exist(testPath)).to.be(true);
        }, function (e) {
            // console.error(e.message, e);
            done();
        }, function () {
            done();
        });
    });
    it('create a file', function (done) {
        var testPath = path.join(__dirname, '..', '..', 'spec', 'gentest', 'app') + "/.gitkeep";
        RxFs_1.RxFs.writeFile(testPath, '').subscribe(function (log) {
            expect(RxFs_1.RxFs.exist(testPath)).to.be(true);
        }, function (e) {
            console.error(e.message, e);
            done();
        }, function () {
            done();
        });
    });
    it('deleta a folder with files', function (done) {
        var testPath = path.join(__dirname, '..', '..', 'spec', 'gentest', 'app');
        RxFs_1.RxFs.rmDir(testPath).subscribe(function (log) {
            // console.log('log', log);
            expect(RxFs_1.RxFs.exist(testPath)).to.be(false);
        }, function (e) {
            console.error(e.message, e.stack);
            done();
        }, function () {
            done();
        });
    });
});
//# sourceMappingURL=RxFs.spec.js.map