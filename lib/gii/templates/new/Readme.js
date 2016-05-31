"use strict";
var PackageJson_1 = require('./PackageJson');
var html = require('common-tags').html;
var Readme = (function () {
    function Readme() {
        this.name = 'readme';
        this.publishName = 'README.md';
        this.package = new PackageJson_1.PackageJson();
    }
    Object.defineProperty(Readme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      #", " ", "\n\n      ", "\n    "], _a.raw = ["\n      #", " ", "\n\n      ", "\n    "], html(_a, this.name, this.package.version, this.package.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Readme;
}());
exports.Readme = Readme;
//# sourceMappingURL=Readme.js.map