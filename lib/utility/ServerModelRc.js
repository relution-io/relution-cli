"use strict";
var Validator_1 = require('./Validator');
exports.assign = Object.assign ? Object.assign : function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return;
};
var ServerModelRc = (function () {
    function ServerModelRc(params) {
        this.rules = {
            name: Validator_1.Validator.notEmptyValidate,
            baseUrl: Validator_1.Validator.url,
            username: Validator_1.Validator.notEmptyValidate,
            password: Validator_1.Validator.notEmptyValidate,
        };
        if (params) {
            Object.assign(params, this);
        }
    }
    ServerModelRc.prototype.validate = function () {
        var _this = this;
        this.errors = [];
        Object.keys(this.rules).forEach(function (param) {
            if (!_this.rules[param](_this[param])) {
                _this.errors.push({ name: param });
            }
        });
        return this.errors.length > 0;
    };
    ServerModelRc.prototype.withName = function (name) {
        return;
    };
    return ServerModelRc;
}());
exports.ServerModelRc = ServerModelRc;
//# sourceMappingURL=ServerModelRc.js.map