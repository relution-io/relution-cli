"use strict";
var PackageJson_1 = require('./PackageJson');
var html = require('common-tags').html;
var ModelReadme = (function () {
    function ModelReadme() {
        this.name = 'modelreadme';
        this.parentFolder = 'models';
        this.publishName = 'README.md';
        this.package = new PackageJson_1.PackageJson();
        this.description = "\n    This folder contains model definitions of the data managed by the backend application.\n    ```bash\n      relution model help\n    ```";
    }
    Object.defineProperty(ModelReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ModelReadme;
}());
exports.ModelReadme = ModelReadme;
//# sourceMappingURL=ModelReadme.js.map