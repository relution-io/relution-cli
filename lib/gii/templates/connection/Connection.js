"use strict";
var html = require('common-tags').html;
var pascalCase = require('pascal-case');
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
            return ((_a = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.ts\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    import {", "BaseConnection} from './", ".gen';\n    /**\n     * ", "Connection\n     */\n    export class ", "Connection extends ", "BaseConnection {\n      // user code goes here\n    }\n    "], _a.raw = ["\n    'use strict';\n    /**\n     * @file ", "/", ".gen.ts\n     * Simple MADP Application\n     *\n     * Created by Relution CLI on ", ".", ".", "\n     * Copyright (c)\n     * ", "\n     * All rights reserved.\n     */\n    import {", "BaseConnection} from './", ".gen';\n    /**\n     * ", "Connection\n     */\n    export class ", "Connection extends ", "BaseConnection {\n      // user code goes here\n    }\n    "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), pascalCase(this.name), this.name, pascalCase(this.name), pascalCase(this.name), pascalCase(this.name))) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL2Nvbm5lY3Rpb24vQ29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN6QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFMUM7O0dBRUc7QUFDSDtJQUFBO1FBQ1MsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQixTQUFJLEdBQVcsYUFBYSxDQUFDO0lBZ0N0QyxDQUFDO0lBN0JTLHlCQUFJLEdBQVosVUFBYSxHQUFXO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDbkIsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsc0JBQUksZ0NBQVE7YUFBWjtZQUNFLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdEIsTUFBTSxDQUFDLENBQUMsT0FBSSw2Q0FHRCxFQUFTLEdBQUksRUFBUyxxRkFHRCxFQUF5QixHQUFJLEVBQThCLEdBQUksRUFBa0IsaUNBRTVHLEVBQWtCLHNEQUdiLEVBQXFCLDBCQUEyQixFQUFTLDBCQUU5RCxFQUFxQix3Q0FFWCxFQUFxQixxQkFBc0IsRUFBcUIsNkRBRzlFLHNiQWxCTyxJQUFJLEtBR0QsSUFBSSxDQUFDLElBQUksRUFBSSxJQUFJLENBQUMsSUFBSSxFQUdELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUU1RyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBR2IsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBMkIsSUFBSSxDQUFDLElBQUksRUFFOUQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFFWCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFzQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUc5RSxHQUFHLElBQUksQ0FBQyxDQUFDOztRQUNaLENBQUM7OztPQUFBO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBbENELElBa0NDO0FBbENZLGtCQUFVLGFBa0N0QixDQUFBIn0=