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
    }
    /**
     * Hjson.stringify(value, options)
     */
    FileApi.prototype.writeHjson = function (content, fileName) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            fs.writeFile("" + _this.path + fileName + "." + _this.hjsonSuffix, Hjson.stringify(content, { keepWsc: true }), _this.encode, function (err) {
                if (err) {
                    return observer.error(err);
                }
                observer.next(true);
                observer.complete();
            });
        });
    };
    // String -> [String]
    FileApi.prototype.fileList = function (dir, ext) {
        var files = [];
        return rxjs_1.Observable.create(function (observer) {
            if (!fs.existsSync(dir)) {
                return observer.error(dir + " not exist or maybe not readable");
            }
            var loadingFiles = fs.readdirSync(dir);
            rxjs_1.Observable.from(loadingFiles)
                .filter(function (file) {
                return path.extname(file) === ext;
            })
                .subscribe(function (file) {
                files.push(file);
            }, function (e) { observer.error(e); }, function () {
                observer.next(files);
                observer.complete();
            });
        });
    };
    return FileApi;
}());
exports.FileApi = FileApi;
//# sourceMappingURL=FileApi.js.map