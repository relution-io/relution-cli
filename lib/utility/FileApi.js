"use strict";
var fs = require('fs');
var path = require('path');
var rxjs_1 = require('@reactivex/rxjs');
var RxFs_1 = require('./RxFs');
var mkdirp = require('mkdirp');
var hjson = require('hjson');
var FileApi = (function () {
    function FileApi() {
        // standard file encoding
        this.encode = 'utf8';
        // hjson extension name
        this.hjsonSuffix = 'hjson';
        // test
        this.path = __dirname + "/../../devtest/";
        // options abouthjson
        this.hjsonOptions = { keepWsc: true };
    }
    /**
     * create a Folder with a .gitkeep file
     */
    FileApi.prototype.mkdirStructureFolder = function (path) {
        var exist = RxFs_1.RxFs.exist(path);
        if (exist) {
            return rxjs_1.Observable.throw(new Error(path + " already exist"));
        }
        return rxjs_1.Observable.create(function (observer) {
            RxFs_1.RxFs.mkdir(path).subscribe({
                next: function (folder) {
                    observer.next(folder);
                },
                complete: function () {
                    RxFs_1.RxFs.writeFile(path + "/.gitkeep", '').subscribe({
                        complete: function () { return observer.complete(); }
                    });
                }
            });
        });
    };
    /**
     * create a folder nested
     */
    FileApi.prototype.mkdirp = function (path) {
        var writer = rxjs_1.Observable.bindNodeCallback(mkdirp);
        return writer(path);
    };
    /**
     * read a hjson file by path
     * on next you will get following:
     * ```json
     * {
     *  path: path,
     *  data: Hjson.parse(file, this.hjsonOptions)
     * }
     * ```
     * @returns Observable
     */
    FileApi.prototype.readHjson = function (path) {
        var _this = this;
        var readFileAsObservable = rxjs_1.Observable.bindNodeCallback(fs.readFile);
        var result = readFileAsObservable(path, 'utf8');
        return rxjs_1.Observable.create(function (observer) {
            result.subscribe(function (file) {
                observer.next({
                    path: path,
                    data: hjson.parse(file, _this.hjsonOptions)
                });
            }, function (e) { return observer.error(e); }, function () { return observer.complete(); });
        });
    };
    /**
     * copy a exist hjson Object
     */
    FileApi.prototype.copyHjson = function (org) {
        var c = hjson.stringify(org, this.hjsonOptions);
        return hjson.parse(c, this.hjsonOptions);
    };
    /**
     * Hjson.stringify(value, options)
     *   Hjson.parse(text, options)
        options {
          keepWsc     boolean, keep white space and comments. This is useful
                      if you want to edit an hjson file and save it while
                      preserving comments (default false)
        }
        This method parses Hjson text to produce an object or array.
        It can throw a SyntaxError exception.
        Hjson.stringify(value, options)
     */
    FileApi.prototype.writeHjson = function (content, fileName, path) {
        if (path === void 0) { path = this.path; }
        return RxFs_1.RxFs.writeFile(path + "/" + fileName + "." + this.hjsonSuffix, this.copyHjson(content));
    };
    /**
     * write a file
     */
    FileApi.prototype.writeFile = function (content, fileName, path) {
        if (path === void 0) { path = process.cwd(); }
        return RxFs_1.RxFs.writeFile(path + "/" + fileName, content);
    };
    // String -> [String]
    FileApi.prototype.fileList = function (dir, ext) {
        if (!fs.existsSync(dir)) {
            return rxjs_1.Observable.throw(dir + " not exist or maybe not readable");
        }
        var loadingFiles = fs.readdirSync(dir);
        // files by extension
        if (ext && ext.length) {
            return rxjs_1.Observable.from(loadingFiles).filter(function (file) {
                return path.extname(file) === ext;
            });
        }
        // all
        return rxjs_1.Observable.from(loadingFiles);
    };
    return FileApi;
}());
exports.FileApi = FileApi;
//# sourceMappingURL=FileApi.js.map