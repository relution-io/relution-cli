"use strict";
var EnvCollection_1 = require('./EnvCollection');
describe('EnVCollection a subset of environments', function () {
    it('load collection', function (done) {
        var envCollection = new EnvCollection_1.EnvCollection();
        envCollection.getEnvironments().subscribe({
            complete: function () {
                console.log('envCollection.collection', envCollection.collection);
                expect(envCollection.collection.length).toBeGreaterThan(0);
                done();
            }
        });
    });
});
//# sourceMappingURL=EnvCollection.spec.js.map