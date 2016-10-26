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
     * @return an empty Observable.
     */
    RxFs.writeFile = function (filename, data) {
        // following can not deduce return type
        var write = rxjs_1.Observable.bindNodeCallback(fs.writeFile);
        return write(filename, data);
    };
    RxFs.readFile = rxjs_1.Observable.bindNodeCallback(fs.readFile);
    return RxFs;
}());
exports.RxFs = RxFs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnhGcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXR5L1J4RnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQzs7R0FFRztBQUNIO0lBQUE7SUEwREEsQ0FBQztJQXhEQzs7OztPQUlHO0lBQ0ksVUFBSyxHQUFaLFVBQWEsSUFBWTtRQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksVUFBSyxHQUFaLFVBQWEsSUFBWSxFQUFFLElBQWtCO1FBQWxCLG9CQUFrQixHQUFsQixhQUFrQjtRQUMzQyxJQUFJLEtBQUssR0FBUSxpQkFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksVUFBSyxHQUFaLFVBQWEsR0FBVztRQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBSSxHQUFHLGlCQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFDRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxRQUFhO1lBQ3JDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBQyxDQUFRLEVBQUUsSUFBUztnQkFDOUIsd0JBQXdCO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNOLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUlEOzs7OztPQUtHO0lBQ0ksY0FBUyxHQUFoQixVQUFpQixRQUFnQixFQUFFLElBQVM7UUFDMUMsdUNBQXVDO1FBQ3ZDLElBQUksS0FBSyxHQUFRLGlCQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFaTSxhQUFRLEdBQUcsaUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFhN0QsV0FBQztBQUFELENBQUMsQUExREQsSUEwREM7QUExRFksWUFBSSxPQTBEaEIsQ0FBQSJ9