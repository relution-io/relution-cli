"use strict";
var html = require('common-tags').html;
var PushReadme = (function () {
    function PushReadme() {
        this.name = 'pushreadme';
        this.parentFolder = 'push';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains push service metadata used by the backend application.\n    ```bash\n      relution push help\n    ```";
    }
    Object.defineProperty(PushReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return PushReadme;
}());
exports.PushReadme = PushReadme;
//# sourceMappingURL=PushReadme.js.map