"use strict";
var ChooseEnv_1 = require('./ChooseEnv');
var EnvModel_1 = require('./../../models/EnvModel');
var EnvCollection_1 = require('./../../collection/EnvCollection');
var expect = require('expect.js');
describe('Command Environment ChooseEnv', function () {
    var chooseEnv;
    var envCollection = new EnvCollection_1.EnvCollection();
    var collection = [];
    var mock = ['zend', 'foo', 'bar', 'dev', 'prod', 'atstart'];
    before(function () {
        collection = [];
        mock.forEach(function (name) {
            collection.push(new EnvModel_1.EnvModel(name, "./test/" + name + ".hjson", { name: name }));
        });
        envCollection.collection = collection;
        chooseEnv = new ChooseEnv_1.ChooseEnv(envCollection);
    });
    it('chooseEnv has a collection', function (done) {
        expect(chooseEnv.envCollection.collection.length).to.be(mock.length);
        expect(chooseEnv.promptName).to.be('env');
        expect(chooseEnv.envCollection.collection[0].name).to.be('zend');
        done();
    });
    it('chooseEnv has a prompt', function (done) {
        var prompt = chooseEnv.prompt(chooseEnv.choices)[0];
        expect(prompt.choices.length).to.be(mock.length + 1);
        expect(prompt.choices[0].name).to.be('atstart');
        done();
    });
    it('chooseEnv has a observable', function (done) {
        chooseEnv.choose().subscribe(function (answers) {
            expect(answers[chooseEnv.promptName]).to.beDefined();
        }, function () {
            done();
        }, function () {
            done();
        });
    });
});
//# sourceMappingURL=ChooseEnv.spec.js.map