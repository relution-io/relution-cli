"use strict";
var RelutionHjson_1 = require('./RelutionHjson');
var FileApi_1 = require('./../../../utility/FileApi');
var fs = require('fs');
var path = require('path');
var dummy = {
    name: 'testfoobar',
    uuid: '0eb20550-1c09-11e6-a4a9-3bb21d599b6c',
    server: 'test.js',
    description: 'my own description',
    private: false,
    directoryIndex: true,
    baseAlias: 'testfoobarAlias'
};
var dummyKeys = Object.keys(dummy);
describe('create RelutionHjson Template', function () {
    var rHjson = new RelutionHjson_1.RelutionHjson();
    var fsApi = new FileApi_1.FileApi();
    var devtestPath = path.join(__dirname, '..', '..', '..', '..', 'spec', 'gentest', 'new');
    var readHjsonPath;
    beforeEach(function () {
        fsApi.path = devtestPath + "/";
        readHjsonPath = "" + fsApi.path + rHjson.publishName;
        dummyKeys.forEach(function (key) {
            rHjson[key] = dummy[key];
        });
    });
    dummyKeys.forEach(function (key) {
        it("has a public " + key, function (done) {
            if (key === 'baseAlias') {
                expect(rHjson[key]).toBe("/" + dummy[key]);
            }
            else if (key === 'server') {
                expect(rHjson[key]).toBe("./" + dummy[key]);
            }
            else {
                expect(rHjson[key]).toBe(dummy[key]);
            }
            done();
        });
    });
    it('generate a relution.hjson file with template', function (done) {
        fsApi.writeHjson(rHjson.template, 'relution').subscribe({
            error: function (e) {
                console.error(e);
            },
            complete: function () {
                var stats = fs.statSync("" + fsApi.path + rHjson.publishName);
                expect(stats.blocks).toBe(8);
                done();
            }
        });
    });
});
describe('read RelutionHjson Template', function () {
    var rHjson = new RelutionHjson_1.RelutionHjson();
    var fsApi = new FileApi_1.FileApi();
    var devtestPath = path.join(__dirname, '..', '..', '..', '..', 'spec', 'gentest', 'new');
    var readHjsonPath;
    var data = null;
    fsApi.path = devtestPath + "/";
    readHjsonPath = "" + fsApi.path + rHjson.publishName;
    dummyKeys.forEach(function (key) {
        it("relution.hjson has a key " + key, function (done) {
            fsApi.readHjson(readHjsonPath).subscribe({
                next: function (result) {
                    data = fsApi.copyHjson(result.data);
                    if (key === 'baseAlias') {
                        expect(data[key]).toBe("/" + dummy[key]);
                    }
                    else if (key === 'server') {
                        expect(data[key]).toBe("./" + dummy[key]);
                    }
                    else {
                        expect(data[key]).toBe(dummy[key]);
                    }
                    done();
                },
                error: function (e) {
                    console.error(e);
                }
            });
        });
    });
});
//# sourceMappingURL=RelutionHjson.spec.js.map