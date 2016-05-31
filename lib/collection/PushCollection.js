"use strict";
var FileApi_1 = require('./../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var path = require('path');
;
;
var PushModel = (function () {
    function PushModel(params) {
        var _this = this;
        if (params) {
            Object.keys(params[0]).forEach(function (key) {
                _this[key] = params[0][key];
            });
        }
    }
    PushModel.prototype.toJson = function () {
        return JSON.stringify({
            providers: this._providers
        }, null, 2);
    };
    Object.defineProperty(PushModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PushModel.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (v) {
            this._path = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PushModel.prototype, "providers", {
        get: function () {
            return this._providers;
        },
        set: function (v) {
            this._providers = v;
        },
        enumerable: true,
        configurable: true
    });
    return PushModel;
}());
exports.PushModel = PushModel;
;
;
;
/**
 * PushCollection
 */
var PushCollection = (function () {
    function PushCollection() {
        var _this = this;
        this.pushRootFolder = process.cwd() + "/push";
        this._providers = [];
        this._fileApi = new FileApi_1.FileApi();
        if (RxFs_1.RxFs.exist(this.pushRootFolder)) {
            console.log(this.pushRootFolder);
            this.loadModels().subscribe({ complete: function () { return console.log(_this._pushFiles); } });
        }
    }
    PushCollection.prototype.add = function (model) {
        var _this = this;
        return this._fileApi.writeHjson(model.toJson(), model.name, this.pushRootFolder)
            .exhaustMap(function (written) {
            return _this.loadModels();
        });
    };
    PushCollection.prototype.loadModels = function () {
        var _this = this;
        this._pushFiles = [];
        return this._fileApi.fileList(this.pushRootFolder, '.hjson')
            .map(function (file) {
            _this._pushFiles.push({
                name: path.basename(file, '.hjson'),
                path: path.join(_this.pushRootFolder, file)
            });
        });
    };
    Object.defineProperty(PushCollection.prototype, "providers", {
        get: function () {
            return this._providers;
        },
        set: function (v) {
            this._providers = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PushCollection.prototype, "pushConfigs", {
        get: function () {
            return this._pushConfigs;
        },
        set: function (v) {
            this._pushConfigs = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PushCollection.prototype, "pushFiles", {
        get: function () {
            return this._pushFiles;
        },
        set: function (v) {
            this._pushFiles = v;
        },
        enumerable: true,
        configurable: true
    });
    return PushCollection;
}());
exports.PushCollection = PushCollection;
//# sourceMappingURL=PushCollection.js.map