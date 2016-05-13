"use strict";
var fs = require('fs');
var path = require('path');
var rxjs_1 = require('@reactivex/rxjs');
var Hjson = require('hjson');
var FileApi = (function () {
    function FileApi() {
        this.encode = 'utf8';
        this.hjsonSuffix = 'hjson';
        this.path = __dirname + "/../../devtest/";
        this.hjsonOptions = { keepWsc: true };
    }
    /**
     * read a hjson file by path
     *
     */
    FileApi.prototype.readHjson = function (path) {
        var _this = this;
        var readFileAsObservable = rxjs_1.Observable.bindNodeCallback(fs.readFile);
        var result = readFileAsObservable(path, 'utf8');
        return rxjs_1.Observable.create(function (observer) {
            result.subscribe(function (file) {
                observer.next({ path: path, data: Hjson.parse(file, _this.hjsonOptions) });
            }, function (e) { return console.error(e); }, function () { return observer.complete(); });
        });
    };
    FileApi.prototype.copyHjson = function (org) {
        var c = Hjson.stringify(org, this.hjsonOptions);
        return Hjson.parse(c, this.hjsonOptions);
    };
    /**
     * Hjson.stringify(value, options)
     */
    FileApi.prototype.writeHjson = function (content, fileName) {
        var writeFileAsObservable = rxjs_1.Observable.bindNodeCallback(fs.writeFile);
        var result = writeFileAsObservable("" + this.path + fileName + "." + this.hjsonSuffix, this.copyHjson(content), this.hjsonOptions);
        return rxjs_1.Observable.create(function (observer) {
            result.subscribe(function () {
                observer.next(true);
            }, function (err) {
                observer.error(err);
                observer.complete();
            }, function () { return observer.complete(); });
        });
    };
    // String -> [String]
    FileApi.prototype.fileList = function (dir, ext) {
        var files = [];
        if (!fs.existsSync(dir)) {
            return rxjs_1.Observable.throw(dir + " not exist or maybe not readable");
        }
        var loadingFiles = fs.readdirSync(dir);
        return rxjs_1.Observable.from(loadingFiles).filter(function (file) {
            return path.extname(file) === ext;
        });
    };
    return FileApi;
}());
exports.FileApi = FileApi;
//# sourceMappingURL=FileApi.js.map