"use strict";
var fIgnore = require('fstream-ignore');
var rxjs_1 = require('@reactivex/rxjs');
var archive = require('archiver');
var fs = require('fs');
var os = require('os');
var path = require('path');
var Archiver = (function () {
    function Archiver(path) {
        if (path === void 0) { path = process.cwd(); }
        this._relIgnore = '.relutionignore';
        this.zipFilePath = '';
        this.path = path;
    }
    /**
     * zip all files which not in .relutionignore and next the zip path
     * @return Observable
     */
    Archiver.prototype.createBundle = function (zipPath) {
        var _this = this;
        var count = 0;
        if (!zipPath) {
            this.zipFilePath = path.resolve(os.tmpdir() + '/relution_app_' + Date.now() + '.zip');
        }
        else {
            this.zipFilePath = zipPath;
        }
        var output = fs.createWriteStream(this.zipFilePath);
        /**
         * @link [archiver](https://github.com/archiverjs/node-archiver)
         */
        var archiver = archive('zip');
        // console.log(this.zipFilePath);
        return rxjs_1.Observable.create(function (observer) {
            /**
             * @link [fstream-ignore](https://github.com/npm/fstream-ignore)
             */
            var zipFiles = fIgnore({
                path: _this.path,
                ignoreFiles: [_this._relIgnore]
            });
            zipFiles.on('child', function (c) {
                var name = c.path.substr(c.root.path.length + 1);
                if (c.type === 'File') {
                    ++count;
                    archiver.append(c, { name: name });
                    observer.next({ file: name });
                }
                else if (c.type === 'Directory') {
                    archiver.append(null, { name: name + '/' });
                    observer.next({ directory: name });
                }
            });
            zipFiles.on('end', function () {
                archiver.finalize();
                observer.next({ processed: "Processed " + count + " files" });
            });
            output.on('finish', function () {
                /**
                 * readstream for the formdata
                 */
                observer.next({
                    zip: _this.zipFilePath,
                    message: "Zip created at " + _this.zipFilePath,
                    readStream: fs.createReadStream(_this.zipFilePath)
                });
                observer.complete();
            });
            output.on('error', function (e) {
                observer.error(e);
            });
            archiver.pipe(output);
        });
    };
    Object.defineProperty(Archiver.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (v) {
            this._path = v;
        },
        enumerable: true,
        configurable: true
    });
    return Archiver;
}());
exports.Archiver = Archiver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJjaGl2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9BcmNoaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUMscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0MsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBRTdCO0lBUUUsa0JBQVksSUFBNEI7UUFBNUIsb0JBQTRCLEdBQTVCLE9BQWUsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUhoQyxlQUFVLEdBQVcsaUJBQWlCLENBQUM7UUFDeEMsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFHOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNEOzs7T0FHRztJQUNILCtCQUFZLEdBQVosVUFBYSxPQUFnQjtRQUE3QixpQkEyREM7UUExREMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDN0IsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FB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