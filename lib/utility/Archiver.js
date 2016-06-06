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
//# sourceMappingURL=Archiver.js.map