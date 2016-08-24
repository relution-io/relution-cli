"use strict";
var Environment_1 = require('./../commands/Environment');
var RxFs_1 = require('./../utility/RxFs');
var expect = require('expect.js');
var path = require('path');
describe('EnVCollection a subset of environments', function () {
    var env = new Environment_1.Environment();
    // let question: any;
    var envFolder = path.join(process.cwd(), 'spec', 'gentest', 'envcollectiontest');
    var name = 'dev';
    before(function () {
        env.fsApi.path = envFolder;
        env._rootFolder = envFolder;
        env.envCollection.envFolder = envFolder;
        if (!RxFs_1.RxFs.exist(envFolder)) {
            return RxFs_1.RxFs.mkdir(envFolder).toPromise().then(function () {
                return env.preload().toPromise().then(function () {
                    return env.createEnvironment(name).toPromise();
                });
            });
        }
        return env.preload().toPromise().then(function () {
            return env.createEnvironment(name).toPromise();
        });
    });
    it('has collection with entry dev', function (done) {
        console.log(env.envCollection.flatEnvArray());
        expect(env.envCollection.collection.length).to.be.greaterThan(0);
        expect(env.envCollection.flatEnvArray().indexOf('dev')).to.be.greaterThan(-1);
        done();
    });
    it('read a environment "dev"', function (done) {
        // let envModel: EnvModel = env.envCollection.isUnique('dev');
        expect(env.envCollection.collection[0].name).to.be(name);
        done();
    });
    after(function () {
        RxFs_1.RxFs.rmDir(env.fsApi.path).subscribe({
            complete: function () {
                console.log(env.fsApi.path + " is removed.");
            }
        });
    });
});
//# sourceMappingURL=EnvCollection.spec.js.map