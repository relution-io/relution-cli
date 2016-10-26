"use strict";
var FileApi_1 = require('./../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var DebugLog_1 = require('./../utility/DebugLog');
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
        this.pushRootFolder = process.cwd() + "/push";
        this._providers = [];
        this._fileApi = new FileApi_1.FileApi();
        if (RxFs_1.RxFs.exist(this.pushRootFolder)) {
            this.loadModels().subscribe({
                error: function (e) {
                    DebugLog_1.DebugLog.error(e);
                }
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaENvbGxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29sbGVjdGlvbi9QdXNoQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQXNCLHNCQUFzQixDQUFDLENBQUE7QUFDN0MscUJBQW9CLG1CQUFtQixDQUFDLENBQUE7QUFDeEMseUJBQXVCLHVCQUF1QixDQUFDLENBQUE7QUFDL0MsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFLNUIsQ0FBQztBQU1ELENBQUM7QUFFRjtJQWNFLG1CQUFZLE1BQWtDO1FBZGhELGlCQWtEQztRQW5DRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUNqQyxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFTSwwQkFBTSxHQUFiO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEIsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzNCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUNELHNCQUFXLDJCQUFJO2FBQWY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO2FBRUQsVUFBZ0IsQ0FBUztZQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFXLDJCQUFJO2FBQWY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO2FBRUQsVUFBZ0IsQ0FBUztZQUN2QixJ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