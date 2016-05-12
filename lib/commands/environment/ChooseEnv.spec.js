"use strict";
var ChooseEnv_1 = require('./ChooseEnv');
var EnvModel_1 = require('./../../models/EnvModel');
var EnvCollection_1 = require('./../../collection/EnvCollection');
describe('Command Environment ChooseEnv', function () {
    var chooseEnv;
    var envCollection = new EnvCollection_1.EnvCollection();
    var collection = [];
    var mock = ['zend', 'foo', 'bar', 'dev', 'prod', 'atstart'];
    beforeEach(function () {
        collection = [];
        mock.forEach(function (name) {
            collection.push(new EnvModel_1.EnvModel(name, "./test/" + name + ".hjson", { name: name }));
        });
        envCollection.collection = collection;
        chooseEnv = new ChooseEnv_1.ChooseEnv(envCollection);
    });
    it('chooseEnv has a collection', function (done) {
        expect(chooseEnv.envCollection.collection.length).toBe(mock.length);
        expect(chooseEnv.promptName).toBe('env');
        expect(chooseEnv.envCollection.collection[0].name).toBe('zend');
        done();
    });
    it('chooseEnv has a prompt', function (done) {
        var prompt = chooseEnv.prompt()[0];
        expect(prompt.choices.length).toBe(mock.length + 1);
        expect(prompt.choices[0].name).toBe('atstart');
        done();
    });
    it('chooseEnv has a observable', function (done) {
        // chooseEnv.choose().subscribe((answers:any) => {
        //   expect(answers[chooseEnv.promptName]).toBeDefined();
        //   done();
        // });
        done();
    });
});
//# sourceMappingURL=ChooseEnv.spec.js.map