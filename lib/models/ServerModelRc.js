"use strict";
var _ = require('lodash');
var CertModelRc_1 = require('./CertModelRc');
var chalk = require('chalk');
var figures = require('figures');
var ServerModelRc = (function () {
    function ServerModelRc(params) {
        this.fromJSON(params);
    }
    ServerModelRc.prototype.fromJSON = function (params) {
        _.assignWith(this, params, function (objValue, srcValue, key) {
            if (ServerModelRc.attributes.indexOf(key) >= 0) {
                if (key === 'clientCertificate') {
                    srcValue = new CertModelRc_1.CertModelRc(srcValue);
                }
                return srcValue;
            }
        });
    };
    ServerModelRc.prototype.toJSON = function () {
        var _this = this;
        var model = {};
        ServerModelRc.attributes.forEach(function (attr) {
            if (attr && _this[attr] !== undefined) {
                model[attr] = _this[attr];
            }
        });
        return model;
    };
    ServerModelRc.prototype.toTableRow = function () {
        return [
            chalk.magenta(this.id),
            chalk.yellow(this.serverUrl),
            this.default ? chalk.green(figures.tick) : chalk.red(figures.cross),
            chalk.yellow(this.userName)
        ];
    };
    ServerModelRc.attributes = ['id', 'default', 'serverUrl', 'userName', 'password', 'clientCertificate'];
    return ServerModelRc;
}());
exports.ServerModelRc = ServerModelRc;
//# sourceMappingURL=ServerModelRc.js.map