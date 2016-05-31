"use strict";
/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
var CertModelRc = (function () {
    function CertModelRc(cert, passphrase) {
        this._attributes = ['cert', 'passphrase'];
        this._cert = cert;
        this._passphrase = passphrase;
    }
    Object.defineProperty(CertModelRc.prototype, "cert", {
        get: function () {
            return this._cert;
        },
        set: function (v) {
            this._cert = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CertModelRc.prototype, "passphrase", {
        get: function () {
            return this._passphrase;
        },
        set: function (v) {
            this._passphrase = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CertModelRc.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        enumerable: true,
        configurable: true
    });
    CertModelRc.prototype.toJson = function () {
        var _this = this;
        var model = {};
        this.attributes.forEach(function (attr) {
            if (attr && _this[attr] !== undefined) {
                model[attr] = _this[attr];
            }
        });
        return model;
    };
    return CertModelRc;
}());
exports.CertModelRc = CertModelRc;
//# sourceMappingURL=CertModelRc.js.map