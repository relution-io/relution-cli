"use strict";
var chalk = require('chalk');
var figures = require('figures');
var ServerModelRc = (function () {
    function ServerModelRc(params) {
        if (params) {
            Object.assign(this, params);
            this.attributes = Object.keys(params);
        }
    }
    Object.defineProperty(ServerModelRc.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        set: function (v) {
            this._attributes = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (v) {
            this._id = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "serverUrl", {
        get: function () {
            return this._serverUrl;
        },
        set: function (v) {
            this._serverUrl = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        set: function (v) {
            this._userName = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (v) {
            this._password = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "clientcertificate", {
        get: function () {
            return this._clientcertificate;
        },
        set: function (v) {
            this._clientcertificate = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerModelRc.prototype, "default", {
        get: function () {
            return this._default;
        },
        set: function (v) {
            this._default = v;
        },
        enumerable: true,
        configurable: true
    });
    ServerModelRc.prototype.toTableRow = function () {
        return [
            chalk.magenta(this.id),
            chalk.yellow(this.serverUrl),
            this.default ? chalk.green(figures.tick) : chalk.red(figures.cross),
            chalk.yellow(this.userName)
        ];
    };
    ServerModelRc.prototype.toJson = function () {
        var _this = this;
        var model = {};
        this.attributes.forEach(function (attr) {
            if (attr && _this[attr] !== undefined) {
                model[attr] = _this[attr];
            }
        });
        return model;
    };
    return ServerModelRc;
}());
exports.ServerModelRc = ServerModelRc;
//# sourceMappingURL=ServerModelRc.js.map