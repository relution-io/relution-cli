"use strict";
var html = require('common-tags').html;
var stripIndents = require('common-tags').stripIndents;
var ConnectionGen = (function () {
    function ConnectionGen() {
        this.name = '';
        this.path = 'connections';
        this.metaData = [];
    }
    ConnectionGen.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    Object.defineProperty(ConnectionGen.prototype, "template", {
        get: function () {
            var _this = this;
            var date = new Date();
            return ((_a = ["\n      'use strict';\n      /**\n       * @file ", "/", ".gen.js\n       * Simple MADP Application\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      var connector = require('relution/connector.js');\n\n      var factory = function ", "_factory() {\n        if (!this) {\n          return new factory();\n        }\n      }\n      factory.prototype = {\n        name: '", "'\n      };\n\n      factory.prototype.configureSession = function ", "_configureSession(properties) {\n        return connector.configureSession('", "', properties);\n      }\n\n      // generated calls go here\n\n      module.exports = factory;\n\n    ", "\n  "], _a.raw = ["\n      'use strict';\n      /**\n       * @file ", "/", ".gen.js\n       * Simple MADP Application\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      var connector = require('relution/connector.js');\n\n      var factory = function ", "_factory() {\n        if (!this) {\n          return new factory();\n        }\n      }\n      factory.prototype = {\n        name: '", "'\n      };\n\n      factory.prototype.configureSession = function ", "_configureSession(properties) {\n        return connector.configureSession('", "', properties);\n      }\n\n      // generated calls go here\n\n      module.exports = factory;\n\n    ", "\n  "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.name, this.name, this.name, this.name, this.metaData.map(function (model) { return (" /**\n      * " + _this.name + "['" + model.name + "']\n      *\n      * " + model.action + "\n      *\n      * @params input \"Object\" " + model.inputModel + "\n      * @return Promise " + model.outputModel + "\n      */\n      module.exports['" + model.name + "'] = function(input) {\n        return connector.runCall(\n          '" + _this.name + "',\n          '" + model.name + "',\n          input\n        );\n      };\n    "); }))));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionGen;
}());
exports.ConnectionGen = ConnectionGen;
//# sourceMappingURL=ConnectionGen.js.map