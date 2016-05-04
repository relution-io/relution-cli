"use strict";
exports.assign = Object.assign ? Object.assign : function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return;
};
var ServerModelRc = (function () {
    function ServerModelRc(params) {
        if (params) {
            Object.assign(this, params);
            this.attributes = Object.keys(params);
            console.log('params', this.attributes);
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
    Object.defineProperty(ServerModelRc.prototype, "asDefault", {
        get: function () {
            return this._asDefault;
        },
        set: function (v) {
            this._asDefault = v;
        },
        enumerable: true,
        configurable: true
    });
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