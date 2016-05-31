"use strict";
var html = require('common-tags').html;
/**
 * Push
 */
var Push = (function () {
    function Push() {
        /**
         * filename
         */
        this.name = '';
    }
    Object.defineProperty(Push.prototype, "template", {
        get: function () {
            return ((_a = ["", ""], _a.raw = ["", ""], html(_a, JSON.stringify(this.model, null, 2))));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Push.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            this._type = v;
        },
        enumerable: true,
        configurable: true
    });
    return Push;
}());
exports.Push = Push;
//# sourceMappingURL=Push.js.map