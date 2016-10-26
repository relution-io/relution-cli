"use strict";
var RelutionHjson_1 = require('./RelutionHjson');
var FileApi_1 = require('./../../../utility/FileApi');
var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
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
                expect(rHjson[key]).to.be("/" + dummy[key]);
            }
            else if (key === 'server') {
                expect(rHjson[key]).to.be("./" + dummy[key]);
            }
            else {
                expect(rHjson[key]).to.be(dummy[key]);
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
                expect(stats.blocks).to.be(8);
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
                        expect(data[key]).to.be("/" + dummy[key]);
                    }
                    else if (key === 'server') {
                        expect(data[key]).to.be("./" + dummy[key]);
                    }
                    else {
                        expect(data[key]).to.be(dummy[key]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdXRpb25IanNvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L1JlbHV0aW9uSGpzb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQXFELGlCQUFpQixDQUFDLENBQUE7QUFDdkUsd0JBQXNCLDRCQUE0QixDQUFDLENBQUE7QUFDbkQsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFDekIsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFDN0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXBDLElBQUksS0FBSyxHQUFRO0lBQ2YsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLHNDQUFzQztJQUM1QyxNQUFNLEVBQUUsU0FBUztJQUNqQixXQUFXLEVBQUUsb0JBQW9CO0lBQ2pDLE9BQU8sRUFBRSxLQUFLO0lBQ2QsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLGlCQUFpQjtDQUM3QixDQUFDO0FBQ0YsSUFBSSxTQUFTLEdBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFHbEQsUUFBUSxDQUFDLCtCQUErQixFQUFFO0lBQ3hDLElBQUksTUFBTSxHQUEwQixJQUFJLDZCQUFxQixFQUFFLENBQUM7SUFDaEUsSUFBSSxLQUFLLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFDbkMsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakcsSUFBSSxhQUFxQixDQUFDO0lBRTFCLFVBQVUsQ0FBQztRQUVULEtBQUssQ0FBQyxJQUFJLEdBQU0sV0FBVyxNQUFHLENBQUM7UUFDL0IsYUFBYSxHQUFHLEtBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsV0FBYSxDQUFDO1FBRXJELFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFRO1lBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFRO1FBQ3pCLEVBQUUsQ0FBQyxrQkFBZ0IsR0FBSyxFQUFFLFVBQUMsSUFBSTtZQUU3QixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBSSxLQUFLLENBQUMsR0FBRyxDQUFHLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFLLEtBQUssQ0FBQyxHQUFHLENBQUcsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLFVBQUMsSUFBSTtRQUN0RCxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3RELEtBQUssRUFBRSxVQUFDLENBQU07Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixDQUFDO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksS0FBSyxHQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFhLENBQUMsQ0FBQztnQkFDbkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLEVBQUUsQ0FBQztZQUNULENBQUM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLDZCQUE2QixFQUFFO0lBQ3RDLElBQUksTUFBTSxHQUEwQixJQUFJLDZCQUFxQixFQUFFLENBQUM7SUFDaEUsSUFBSSxLQUFLLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFDbkMsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakcsSUFBSSxhQUFxQixDQUFDO0lBQzFCLElBQUksSUFBSSxHQUFRLElBQUksQ0FBQztJQUNyQixLQUFLLENBQUMsSUFBSSxHQUFNLFdBQVcsTUFBRyxDQUFDO0lBQy9CLGFBQWEsR0FBRyxLQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQWEsQ0FBQztJQUVyRCxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBUTtRQUN6QixFQUFFLENBQUMsOEJBQTRCLEdBQUssRUFBRSxVQUFDLElBQUk7WUFDekMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxVQUFDLE1BQVc7b0JBQ2hCLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQUksS0FBSyxDQUFDLEdBQUcsQ0FBRyxDQUFDLENBQUM7b0JBQzVDLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFLLEtBQUssQ0FBQyxHQUFHLENBQUcsQ0FBQyxDQUFDO29CQUM3QyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxDQUFDO29CQUNELElBQUksRUFBRSxDQUFDO2dCQUNULENBQUM7Z0JBQ0QsS0FBSyxFQUFFLFVBQUMsQ0FBTTtvQkFDWixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=