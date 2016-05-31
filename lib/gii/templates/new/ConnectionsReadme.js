"use strict";
var html = require('common-tags').html;
var ConnectionsReadme = (function () {
    function ConnectionsReadme() {
        this.name = 'connectionsreadme';
        this.parentFolder = 'connections';
        this.publishName = 'README.md';
        this.description = "\n    This folder contains definitions of the 3rd-tier backend servers used by the application.\n    ```bash\n      relution connections help\n    ```";
    }
    Object.defineProperty(ConnectionsReadme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      ", "\n    "], _a.raw = ["\n      ", "\n    "], html(_a, this.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionsReadme;
}());
exports.ConnectionsReadme = ConnectionsReadme;
//# sourceMappingURL=ConnectionsReadme.js.map