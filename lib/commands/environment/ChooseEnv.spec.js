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
    // it('chooseEnv has a observable', (done) => {
    //   chooseEnv.choose().subscribe(
    //     (answers: any) => {
    //       expect(answers[chooseEnv.promptName]).to.beDefined();
    //     },
    //     () => {
    //       done();
    //     },
    //     () => {
    //       done();
    //     }
    //   );
    // });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvb3NlRW52LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvZW52aXJvbm1lbnQvQ2hvb3NlRW52LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUF3QixhQUFhLENBQUMsQ0FBQTtBQUN0Qyx5QkFBdUIseUJBQXlCLENBQUMsQ0FBQTtBQUNqRCw4QkFBNEIsa0NBQWtDLENBQUMsQ0FBQTtBQUMvRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFcEMsUUFBUSxDQUFDLCtCQUErQixFQUFFO0lBQ3hDLElBQUksU0FBb0IsQ0FBQztJQUN6QixJQUFJLGFBQWEsR0FBa0IsSUFBSSw2QkFBYSxFQUFFLENBQUM7SUFFdkQsSUFBSSxVQUFVLEdBQW9CLEVBQUUsQ0FBQztJQUNyQyxJQUFJLElBQUksR0FBa0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTNFLE1BQU0sQ0FBQztRQUNMLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVk7WUFDeEIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFRLENBQUMsSUFBSSxFQUFFLFlBQVUsSUFBSSxXQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDdEMsU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxVQUFDLElBQUk7UUFDcEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRSxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFLFVBQUMsSUFBSTtRQUNoQyxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBR0gsK0NBQStDO0lBQy9DLGtDQUFrQztJQUNsQywwQkFBMEI7SUFDMUIsOERBQThEO0lBQzlELFNBQVM7SUFDVCxjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLFNBQVM7SUFDVCxjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtBQUNSLENBQUMsQ0FBQyxDQUFDIn0=