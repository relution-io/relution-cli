"use strict";
var Environment_1 = require('./Environment');
var expect = require('expect.js');
var path = require('path');
var RxFs_1 = require('./../utility/RxFs');
describe('Command Environment', function () {
    var env = new Environment_1.Environment();
    // let question: any;
    var envFolder = path.join(process.cwd(), 'spec', 'gentest', 'env');
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
    env.flatCommands().forEach(function (method) {
        it("have command " + method, function (done) {
            expect(env[method]).not.to.be(undefined);
            done();
        });
    });
    it('have a root folder', function (done) {
        expect(env._rootFolder).to.be(envFolder);
        expect(RxFs_1.RxFs.exist(envFolder)).to.be(true);
        done();
    });
    it('envCollection has Model with name dev', function (done) {
        expect(env.envCollection.collection.length).to.be(1);
        expect(env.envCollection.collection[0].name).to.be(name);
        done();
    });
    after(function () {
        setTimeout(function () {
            return RxFs_1.RxFs.rmDir(env.fsApi.path).toPromise();
        }, 1800);
    });
});
//# sourceMappingURL=Environment.spec.js.map