"use strict";
var Environment_1 = require('./../commands/Environment');
var RxFs_1 = require('./../utility/RxFs');
var expect = require('expect.js');
var path = require('path');
describe('EnVCollection a subset of environments', function () {
    var command;
    before(function () {
        command = new Environment_1.Environment();
        command.fsApi.path = path.join(process.cwd(), 'spec', 'gentest', 'env') + '/';
        command.envCollection.envFolder = command.fsApi.path;
        console.log(command.fsApi.path);
        RxFs_1.RxFs.mkdir(command.fsApi.path).subscribe({
            complete: function () {
                console.log(command.fsApi.path + " is created.");
            }
        });
    });
    it('create a environment "dev"', function (done) {
        command.add(['dev']).subscribe({
            next: function (log) {
                console.log(log);
            },
            complete: function () {
                expect(RxFs_1.RxFs.exist(path.join(command.fsApi.path, 'dev.hjson'))).to.be(true);
                console.log('envCollection.collection', command.envCollection.collection);
                done();
            }
        });
    });
    it('has collection with entry dev', function (done) {
        console.log(command.envCollection.flatEnvArray());
        expect(command.envCollection.collection.length).to.be.greaterThan(0);
        expect(command.envCollection.flatEnvArray().indexOf('dev')).to.be.greaterThan(-1);
        done();
    });
    it('read a environment "dev"', function (done) {
        var env = command.envCollection.isUnique('dev');
        expect(env.name).to.be('dev');
        done();
    });
    after(function () {
        RxFs_1.RxFs.rmDir(command.fsApi.path).subscribe({
            complete: function () {
                console.log(command.fsApi.path + " is removed.");
            }
        });
    });
});
//# sourceMappingURL=EnvCollection.spec.js.map