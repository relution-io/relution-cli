"use strict";
var html = require('common-tags').html;
/**
 * Connection
 */
var Connection = (function () {
    function Connection() {
        this.name = '';
        this.path = 'connections';
    }
    Connection.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    Object.defineProperty(Connection.prototype, "template", {
        get: function () {
            var date = new Date();
            return ((_a = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.js\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    module.exports = require('./", ".gen')();\n    // user code goes here\n\n    "], _a.raw = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.js\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    module.exports = require('./", ".gen')();\n    // user code goes here\n\n    "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.name)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map