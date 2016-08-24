"use strict";
var Create_1 = require('./Create');
var path = require('path');
var RxFs_1 = require('./../../utility/RxFs');
var expect = require('expect.js');
var rxjs_1 = require('@reactivex/rxjs');
describe('New Create', function () {
    var commandCreate;
    var commandRoot = path.join(process.cwd(), 'spec', 'gentest', 'create');
    before(function () {
        RxFs_1.RxFs.mkdir(commandRoot).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(commandRoot)).to.be(true);
            }
        });
        commandCreate = new Create_1.Create();
        commandCreate.npmInstall = function () {
            return rxjs_1.Observable.empty();
        };
        commandCreate.rootProjectFolder = commandRoot;
    });
    it('have templates', function (done) {
        expect(commandCreate.toGenTemplatesName).not.to.be(undefined);
        expect(commandCreate.toGenTemplatesName.length).to.be.greaterThan(0);
        done();
    });
    it('have folders to generate', function (done) {
        expect(commandCreate.emptyFolders).not.to.be(undefined);
        expect(commandCreate.emptyFolders.length).to.be.greaterThan(0);
        done();
    });
    it('create templates', function (done) {
        // commandCreate.publish('test', true).subscribe({
        //   complete: () => {
        //     commandCreate.emptyFolders.forEach((dir) => {
        //       expect(RxFs.exist(path.join(commandRoot, dir))).to.be(true);
        //     });
        //     done();
        //   }
        // })
    });
    after(function () {
        RxFs_1.RxFs.rmDir(commandRoot).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(commandRoot)).to.be(false);
            }
        });
    });
});
//# sourceMappingURL=Create.spec.js.map