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
    Connection.prototype.capitalizeFirstLetter = function (name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    Connection.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    Object.defineProperty(Connection.prototype, "template", {
        get: function () {
            var date = new Date();
            return ((_a = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.ts\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    import {", "BaseConnection} from './", ".gen';\n    /**\n     * ", "Connection\n     */\n    export class ", "Connection extends ", "BaseConnection {\n      // user code goes here\n    }\n    "], _a.raw = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.ts\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    import {", "BaseConnection} from './", ".gen';\n    /**\n     * ", "Connection\n     */\n    export class ", "Connection extends ", "BaseConnection {\n      // user code goes here\n    }\n    "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.capitalizeFirstLetter(this.name), this.name, this.capitalizeFirstLetter(this.name), this.capitalizeFirstLetter(this.name), this.capitalizeFirstLetter(this.name))) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map