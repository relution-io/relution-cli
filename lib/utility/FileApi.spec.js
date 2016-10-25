"use strict";
var FileApi_1 = require('./FileApi');
var RxFs_1 = require('./RxFs');
var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
describe('File api', function () {
    var api;
    beforeEach(function () {
        api = new FileApi_1.FileApi();
    });
    it('read from a folder files by ext', function (done) {
        api.fileList(api.path, '.hjson').subscribe(function (file) {
            if (file) {
                expect(typeof file).to.be.equal('string');
                expect(file.indexOf('.hjson')).to.be.greaterThen(-1);
            }
        }, function (e) {
            // console.error(e.message, e.stack);
            done();
        }, function () { done(); });
    });
    it('copy a Object', function (done) {
        var a = { name: 'a' };
        var b = api.copyHjson(a);
        b.name = 'b';
        expect(a.name).to.be('a');
        expect(b.name).to.be('b');
        done();
    });
    it('write a hjson file to spec test folder', function (done) {
        api.path = __dirname + "/../../spec/gentest/";
        var neenv = "{\n      //mycomment\n      name: test\n    }";
        api.writeHjson(neenv, 'test').subscribe({
            next: function (written) {
                console.log(written);
                expect(RxFs_1.RxFs.exist(path.join(api.path, 'test.hjson'))).to.be(true);
            },
            error: function (e) {
                // console.error(e.message, e.stack);
                done();
            },
            complete: function () {
                var exist = fs.existsSync(api.path + "/test.hjson");
                expect(exist).to.be(true);
                done();
            }
        });
    });
    it('read a hjson file to spec test folder', function (done) {
        api.path = __dirname + "/../../spec/gentest/";
        var filePath = api.path + "/test." + api.hjsonSuffix;
        api.readHjson(filePath).subscribe({
            next: function (file) {
                expect(file.path).not.to.be(undefined);
                expect(file.path).to.be(filePath);
                expect(file.data).not.to.be(undefined);
                expect(file.data.name).to.be('test');
            },
            error: function (e) {
                // console.error(e.message, e.stack);
                done();
            },
            complete: function () {
                done();
            }
        });
    });
    it('create a structure folder', function (done) {
        var goalPath = path.join(__dirname + "/../../spec/gentest/structureFolderTest");
        api.mkdirStructureFolder(goalPath).subscribe(function (log) {
            // console.log('mylog', JSON.stringify(log, null, 2));
        }, function (e) {
            // console.error(e.message, e.stack);
            done();
        }, function () {
            // console.log('completed');
            expect(RxFs_1.RxFs.exist(goalPath)).to.be(true);
            expect(RxFs_1.RxFs.exist(goalPath + "/.gitkeep")).to.be(true);
            done();
        });
    });
    it('delete the structure Folder', function (done) {
        var goalPath = path.join(__dirname + "/../../spec/gentest/structureFolderTest");
        RxFs_1.RxFs.rmDir(goalPath).debounceTime(1000).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(goalPath)).to.be(false);
                done();
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZUFwaS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdHkvRmlsZUFwaS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBc0IsV0FBVyxDQUFDLENBQUE7QUFDbEMscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVwQyxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLElBQUksR0FBWSxDQUFDO0lBRWpCLFVBQVUsQ0FBQztRQUNULEdBQUcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxVQUFDLElBQUk7UUFFekMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FDeEMsVUFBQyxJQUFTO1lBQ1IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDSCxDQUFDLEVBQ0QsVUFBQyxDQUFRO1lBQ1AscUNBQXFDO1lBQ3JDLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxFQUNELGNBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQ2xCLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBQyxJQUFJO1FBQ3ZCLElBQUksQ0FBQyxHQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFRLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDYixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUUsVUFBQyxJQUFJO1FBQ2hELEdBQUcsQ0FBQyxJQUFJLEdBQU0sU0FBUyx5QkFBc0IsQ0FBQztRQUU5QyxJQUFJLEtBQUssR0FBRywrQ0FHVixDQUFDO1FBRUgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3RDLElBQUksRUFBRSxVQUFDLE9BQWdCO2dCQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixNQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUNELEtBQUssRUFBRSxVQUFDLENBQVE7Z0JBQ2QscUNBQXFDO2dCQUNyQyxJQUFJLEVBQUUsQ0FBQztZQUNULENBQUM7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxLQUFLLEdBQVksRUFBRSxDQUFDLFVBQVUsQ0FBSSxHQUFHLENBQUMsSUFBSSxnQkFBYSxDQUFDLENBQUM7Z0JBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixJQUFJLEVBQUUsQ0FBQztZQUNULENBQUM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxVQUFDLElBQUk7UUFDL0MsR0FBRyxDQUFDLElBQUksR0FBTSxTQUFTLHlCQUFzQixDQUFDO1FBQzlDLElBQUksUUFBUSxHQUFNLEdBQUcsQ0FBQyxJQUFJLGNBQVMsR0FBRyxDQUFDLFdBQWEsQ0FBQztRQUVyRCxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLEVBQUUsVUFBQyxJQUFTO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBQ0QsS0FBSyxFQUFFLFVBQUMsQ0FBUTtnQkFDZCxxQ0FBcUM7Z0JBQ3JDLElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQztZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsQ0FBQztZQUNULENBQUM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxVQUFDLElBQUk7UUFDbkMsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBSSxTQUFTLDRDQUF5QyxDQUFDLENBQUM7UUFFeEYsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FDMUMsVUFBQyxHQUFRO1lBQ1Asc0RBQXNEO1FBRXhELENBQUMsRUFDRCxVQUFDLENBQVE7WUFDUCxxQ0FBcUM7WUFDckMsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLEVBQ0Q7WUFDRSw0QkFBNEI7WUFDNUIsTUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFJLFFBQVEsY0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZELElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxVQUFDLElBQUk7UUFDckMsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBSSxTQUFTLDRDQUF5QyxDQUFDLENBQUM7UUFDeEYsV0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2hELFFBQVEsRUFBRTtnQkFDUixNQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==