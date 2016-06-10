"use strict";
var Archiver_1 = require('./Archiver');
var rxjs_1 = require('@reactivex/rxjs');
var RxFs_1 = require('./RxFs');
var path = require('path');
var chalk = require('chalk');
var figures = require('figures');
var Create_1 = require('./../commands/project/Create');
var expect = require('expect.js');
describe('Utility Archiver', function () {
    var commandCreate;
    var commandRoot = path.join(process.cwd(), 'spec', 'gentest', 'archiver');
    var archiver = new Archiver_1.Archiver(commandRoot);
    before(function () {
        commandCreate = new Create_1.Create();
        commandCreate.npmInstall = function () {
            return rxjs_1.Observable.empty();
        };
        commandCreate.rootProjectFolder = commandRoot;
        return RxFs_1.RxFs.mkdir(commandRoot).toPromise().then(function () {
            expect(RxFs_1.RxFs.exist(commandRoot)).to.be(true);
            return commandCreate.publish('test', true).toPromise();
        });
    });
    it('read files from without ignore', function (done) {
        archiver.createBundle().subscribe(function (log) {
            if (log.file || log.directory) {
                console.log(chalk.magenta(log.file ? "add file " + log.file : "add directory " + log.directory));
            }
            else if (log.zip) {
                console.log(chalk.green(log.message) + ' ' + figures.tick);
                expect(RxFs_1.RxFs.exist(log.zip)).to.be(true);
                done();
            }
            else if (log.processed) {
                console.log(chalk.green(log.processed) + ' ' + figures.tick);
            }
        });
    });
    after(function () {
        return RxFs_1.RxFs.rmDir(commandRoot).toPromise();
    });
});
//# sourceMappingURL=Archiver.spec.js.map