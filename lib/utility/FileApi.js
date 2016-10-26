"use strict";
var fs = require('fs');
var path = require('path');
var rxjs_1 = require('@reactivex/rxjs');
var RxFs_1 = require('./RxFs');
var mkdirp = require('mkdirp');
var dirTree = require('directory-tree');
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
        this.rxFs = RxFs_1.RxFs;
    }
    /**
     * create a Folder with a .gitkeep file
     */
    FileApi.prototype.mkdirStructureFolder = function (path) {
        var exist = RxFs_1.RxFs.exist(path);
        if (exist) {
            return rxjs_1.Observable.throw(new Error(path + " already exist"));
        }
        return RxFs_1.RxFs.mkdir(path);
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
     * read the comments is avalaible in data.__WSC__
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
            return rxjs_1.Observable.throw(new Error(dir + " does not exist or may not be readable"));
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
    /**
     * read recurisv a folder and get all files by filter
     */
    FileApi.prototype.dirTree = function (folderPath, filter) {
        if (filter && filter.length) {
            return dirTree(folderPath, filter);
        }
        return dirTree(folderPath);
    };
    return FileApi;
}());
exports.FileApi = FileApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZUFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXR5L0ZpbGVBcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUM1QixJQUFZLE1BQU0sV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUNqQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFL0I7SUFBQTtRQUNFLHlCQUF5QjtRQUNsQixXQUFNLEdBQVcsTUFBTSxDQUFDO1FBQy9CLHVCQUF1QjtRQUNoQixnQkFBVyxHQUFXLE9BQU8sQ0FBQztRQUNyQyxPQUFPO1FBQ0EsU0FBSSxHQUFjLFNBQVMsb0JBQWlCLENBQUM7UUFDcEQscUJBQXFCO1FBQ2QsaUJBQVksR0FBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN0QyxTQUFJLEdBQUcsV0FBSSxDQUFDO0lBMkdyQixDQUFDO0lBMUdDOztPQUVHO0lBQ0gsc0NBQW9CLEdBQXBCLFVBQXFCLElBQVk7UUFDL0IsSUFBSSxLQUFLLEdBQVEsV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFJLElBQUksbUJBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxNQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09B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