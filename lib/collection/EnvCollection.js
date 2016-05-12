"use strict";
var EnvModel_1 = require('./../models/EnvModel');
var FileApi_1 = require('./../utility/FileApi');
var rxjs_1 = require('@reactivex/rxjs');
var lodash_1 = require('lodash');
var EnvCollection = (function () {
    function EnvCollection() {
        this.collection = [];
        this.envFiles = [];
        this.envFolder = process.cwd() + "/devtest";
        this.fsApi = new FileApi_1.FileApi();
    }
    EnvCollection.prototype.setCollection = function (observer) {
        var _this = this;
        var datas = [];
        var all = [];
        this.envFiles.forEach(function (file) {
            all.push(_this.fsApi.readHjson(_this.envFolder + "/" + file));
        });
        rxjs_1.Observable.forkJoin(all).subscribe(function (hjsons) {
            hjsons.forEach(function (data) {
                var model = new EnvModel_1.EnvModel(data.data.name, data.path);
                model.data = data.data;
                _this.collection.push(model);
            });
            observer.next(_this.collection);
        }, function () { }, function () { observer.complete(); });
    };
    EnvCollection.prototype.isUnique = function (name) {
        return lodash_1.find(this.collection, { name: name });
    };
    EnvCollection.prototype.getEnvironments = function () {
        var _this = this;
        this.envFiles = [];
        this.collection = [];
        return rxjs_1.Observable.create(function (observer) {
            _this.fsApi.fileList(_this.envFolder, '.hjson')
                .subscribe({
                next: function (filePath) {
                    _this.envFiles.push(filePath);
                },
                complete: function () {
                    return _this.setCollection(observer);
                }
            });
        });
    };
    EnvCollection.prototype.flatEnvArray = function () {
        var flat = [];
        this.collection.forEach(function (model) {
            flat.push(model.name);
        });
        return flat;
    };
    return EnvCollection;
}());
exports.EnvCollection = EnvCollection;
//# sourceMappingURL=EnvCollection.js.map