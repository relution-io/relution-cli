"use strict";
var html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 */
var RelutionIgnore = (function () {
    function RelutionIgnore() {
        this.publishName = '.relutionignore';
        this.name = 'relutionignore';
    }
    Object.defineProperty(RelutionIgnore.prototype, "template", {
        get: function () {
            return ((_a = ["\n      client/**/*.*\n      /node_modules\n      **/*.ts\n      *.DS_STORE\n      *.git\n    "], _a.raw = ["\n      client/**/*.*\n      /node_modules\n      **/*.ts\n      *.DS_STORE\n      *.git\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return RelutionIgnore;
}());
exports.RelutionIgnore = RelutionIgnore;
//# sourceMappingURL=RelutionIgnore.js.map