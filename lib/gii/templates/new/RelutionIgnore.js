"use strict";
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
            return ("\nclient/**/*.*\n/node_modules\n").trim();
        },
        enumerable: true,
        configurable: true
    });
    return RelutionIgnore;
}());
exports.RelutionIgnore = RelutionIgnore;
//# sourceMappingURL=RelutionIgnore.js.map