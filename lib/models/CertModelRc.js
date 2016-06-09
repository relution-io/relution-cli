"use strict";
var _ = require('lodash');
/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
var CertModelRc = (function () {
    function CertModelRc(params) {
        this.fromJSON(params);
    }
    CertModelRc.prototype.fromJSON = function (params) {
        _.assignWith(this, params, function (objValue, srcValue, key) {
            if (CertModelRc.attributes.indexOf(key) >= 0) {
                if (key === 'pfx' && _.isString(srcValue)) {
                    srcValue = new Buffer(srcValue, 'base64');
                }
                return srcValue;
            }
        });
    };
    CertModelRc.prototype.toJSON = function () {
        var _this = this;
        var model = {};
        CertModelRc.attributes.forEach(function (attr) {
            var value = _this[attr];
            if (value !== undefined) {
                if (_.isBuffer(value)) {
                    value = value.toString('base64');
                }
                model[attr] = value;
            }
        });
        return model;
    };
    CertModelRc.attributes = ['pfx', 'passphrase'];
    return CertModelRc;
}());
exports.CertModelRc = CertModelRc;
//# sourceMappingURL=CertModelRc.js.map