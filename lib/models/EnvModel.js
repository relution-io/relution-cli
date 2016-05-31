"use strict";
/**
 * Model to the Evironment
 */
var EnvModel = (function () {
    function EnvModel(name, path, data) {
        this.name = name;
        this.path = path;
        this.data = data;
    }
    Object.defineProperty(EnvModel.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (v) {
            this._data = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnvModel.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (v) {
            this._path = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnvModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    return EnvModel;
}());
exports.EnvModel = EnvModel;
//# sourceMappingURL=EnvModel.js.map