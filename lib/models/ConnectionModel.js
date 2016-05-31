"use strict";
;
var ConnectionModel = (function () {
    function ConnectionModel(params) {
        var _this = this;
        this._name = '';
        this._type = '';
        this._connectorProvider = '';
        this._description = 'Auto Generated';
        this._properties = {};
        this._calls = {};
        if (params) {
            Object.keys(params).forEach(function (key) {
                _this[key] = params[key];
            });
        }
    }
    Object.defineProperty(ConnectionModel.prototype, "calls", {
        get: function () {
            return this._calls;
        },
        set: function (v) {
            this._calls = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            this._type = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (v) {
            this._description = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        set: function (v) {
            this._properties = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "connectorProvider", {
        get: function () {
            return this._connectorProvider;
        },
        set: function (v) {
            this._connectorProvider = v;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionModel.prototype.toJson = function () {
        return JSON.stringify({
            name: this.name,
            connectorProvider: this.connectorProvider,
            description: this.description,
            type: this.type,
            calls: this.calls || {},
            properties: this.properties || {}
        }, null, 2);
    };
    return ConnectionModel;
}());
exports.ConnectionModel = ConnectionModel;
//# sourceMappingURL=ConnectionModel.js.map