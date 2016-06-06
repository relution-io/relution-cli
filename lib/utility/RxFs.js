"use strict";
var fs = require('fs');
var rxjs_1 = require('@reactivex/rxjs');
var rimraf = require('rimraf');
/**
 * File Helper for the cli
 */
var RxFs = (function () {
    function RxFs() {
    }
    /**
     * get stats
     * @link [fs.statSync](https://nodejs.org/api/fs.html#fs_fs_statsync_path)
     * @return boolean
     */
    RxFs.exist = function (path) {
        return fs.existsSync(path);
    };
    /**
     * create a Folder
     * @link [fs.mkdirSync](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_mode)
     * @params path: string
     * @params mode?: string
     * @return Observable
     */
    RxFs.mkdir = function (path, mode) {
        if (mode === void 0) { mode = '0777'; }
        var write = rxjs_1.Observable.bindNodeCallback(fs.mkdir);
        return write(path, mode);
    };
    /**
     * @link [rimraf](https://github.com/isaacs/rimraf)
     * @params dir the dir path which one has to be deleted
     */
    RxFs.rmDir = function (dir) {
        if (!RxFs.exist(dir)) {
            return rxjs_1.Observable.throw(new Error(dir + " not exists."));
        }
        return rxjs_1.Observable.create(function (observer) {
            rimraf(dir, function (e, data) {
                // console.log(e, data);
                if (e) {
                    observer.error(e);
                    observer.complete();
                }
                else {
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    /**
     * create a File to filename
     * @link [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options)
     * @params filename, data, options
     */
    RxFs.writeFile = function (filename, data) {
        var write = rxjs_1.Observable.bindNodeCallback(fs.writeFile);
        return write(filename, data);
    };
    return RxFs;
}());
exports.RxFs = RxFs;
//# sourceMappingURL=RxFs.js.map