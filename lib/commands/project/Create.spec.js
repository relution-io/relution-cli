"use strict";
var Create_1 = require('./Create');
var path = require('path');
var RxFs_1 = require('./../../utility/RxFs');
var expect = require('expect.js');
var rxjs_1 = require('@reactivex/rxjs');
describe('New Create', function () {
    var commandCreate;
    var commandRoot = path.join(process.cwd(), 'spec', 'gentest', 'create');
    before(function () {
        RxFs_1.RxFs.mkdir(commandRoot).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(commandRoot)).to.be(true);
            }
        });
        commandCreate = new Create_1.Create();
        commandCreate.npmInstall = function () {
            return rxjs_1.Observable.empty();
        };
        commandCreate.rootProjectFolder = commandRoot;
    });
    it('have templates', function (done) {
        expect(commandCreate.toGenTemplatesName).not.to.be(undefined);
        expect(commandCreate.toGenTemplatesName.length).to.be.greaterThan(0);
        done();
    });
    it('have folders to generate', function (done) {
        expect(commandCreate.emptyFolders).not.to.be(undefined);
        expect(commandCreate.emptyFolders.length).to.be.greaterThan(0);
        done();
    });
    it('create templates', function (done) {
        // commandCreate.publish('test', true).subscribe({
        //   complete: () => {
        //     commandCreate.emptyFolders.forEach((dir) => {
        //       expect(RxFs.exist(path.join(commandRoot, dir))).to.be(true);
        //     });
        //     done();
        //   }
        // })
    });
    after(function () {
        RxFs_1.RxFs.rmDir(commandRoot).subscribe({
            complete: function () {
                expect(RxFs_1.RxFs.exist(commandRoot)).to.be(false);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvcHJvamVjdC9DcmVhdGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQXFCLFVBQVUsQ0FBQyxDQUFBO0FBQ2hDLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLHFCQUFtQixzQkFBc0IsQ0FBQyxDQUFBO0FBQzFDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUUzQyxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLElBQUksYUFBcUIsQ0FBQztJQUMxQixJQUFJLFdBQVcsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sQ0FBQztRQUNMLFdBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2hDLFFBQVEsRUFBRTtnQkFDUixNQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUNILGFBQWEsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBQzdCLGFBQWEsQ0FBQyxVQUFVLEdBQUc7WUFDekIsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDO1FBQ0YsYUFBYSxDQUFDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLElBQUk7UUFDeEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxVQUFDLElBQUk7UUFDbEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFVBQUMsSUFBSTtRQUMxQixrREFBa0Q7UUFDbEQsc0JBQXNCO1FBQ3RCLG9EQUFvRDtRQUNwRCxxRUFBcUU7UUFDckUsVUFBVTtRQUNWLGNBQWM7UUFDZCxNQUFNO1FBQ04sS0FBSztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDO1FBQ0osV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDaEMsUUFBUSxFQUFFO2dCQUNSLE1BQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9