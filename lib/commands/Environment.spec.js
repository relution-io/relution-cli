"use strict";
var Environment_1 = require('./Environment');
var expect = require('expect.js');
var sinon = require('sinon');
var path = require('path');
var RxFs_1 = require('./../utility/RxFs');
describe('Command Environment', function () {
    var env = new Environment_1.Environment();
    var question;
    before(function () {
        question = env._addName;
        env.fsApi.path = path.join(process.cwd(), 'spec', 'gentest', 'env');
        return RxFs_1.RxFs.mkdir(env.fsApi.path).toPromise().then(function () {
            expect(RxFs_1.RxFs.exist(env.fsApi.path)).to.be(true);
            return env.preload().toPromise();
        });
    });
    it('have commands', function (done) {
        env.flatCommands().forEach(function (method) {
            expect(env[method]).not.to.be(undefined);
        });
        done();
    });
    it('create a env with name dev', function (done) {
        sinon.stub(env.inquirer, 'prompt', function (questions, cb) {
            setTimeout(function () {
                cb({
                    name: ['dev']
                });
            }, 0);
        });
        env.add().subscribe(function (answers) {
            console.log(answers);
        }, function (e) { return done(); }, function () { return done(); });
    });
    it('has env as name', function (done) {
        expect(env.name).to.be('env');
        done();
    });
    after(function () {
        return RxFs_1.RxFs.rmDir(env.fsApi.path).toPromise();
    });
});
//# sourceMappingURL=Environment.spec.js.map