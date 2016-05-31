"use strict";
var html = require('common-tags').html;
var EnvReadme = (function () {
    function EnvReadme() {
        this.name = 'envreadme';
        this.parentFolder = 'env';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains configuration data of different deployment environments.\n    ```bash\n      relution env help\n    ```";
    }
    Object.defineProperty(EnvReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return EnvReadme;
}());
exports.EnvReadme = EnvReadme;
//# sourceMappingURL=EnvReadme.js.map