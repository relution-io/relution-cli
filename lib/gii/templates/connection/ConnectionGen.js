"use strict";
var html = require('common-tags').html;
var ConnectionGen = (function () {
    function ConnectionGen() {
        this.name = '';
        this.path = 'connections';
    }
    ConnectionGen.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    Object.defineProperty(ConnectionGen.prototype, "template", {
        get: function () {
            var date = new Date();
            return ((_a = ["\n      'use strict';\n      /**\n       * @file ", "/", ".gen.js\n       * Simple MADP Application\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      var connector = require('relution/connector.js');\n\n      var factory = function ", "_factory() {\n        if (!this) {\n          return new factory();\n        }\n      }\n      factory.prototype = {\n        name: '", "'\n      };\n\n      factory.prototype.configureSession = function ", "_configureSession(properties) {\n        return connector.configureSession('", "', properties);\n      }\n\n      // generated calls go here\n\n      module.exports = factory;\n    "], _a.raw = ["\n      'use strict';\n      /**\n       * @file ", "/", ".gen.js\n       * Simple MADP Application\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      var connector = require('relution/connector.js');\n\n      var factory = function ", "_factory() {\n        if (!this) {\n          return new factory();\n        }\n      }\n      factory.prototype = {\n        name: '", "'\n      };\n\n      factory.prototype.configureSession = function ", "_configureSession(properties) {\n        return connector.configureSession('", "', properties);\n      }\n\n      // generated calls go here\n\n      module.exports = factory;\n    "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.name, this.name, this.name, this.name)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionGen;
}());
exports.ConnectionGen = ConnectionGen;
//# sourceMappingURL=ConnectionGen.js.map