"use strict";
var html = require('common-tags').html;
/**
 * ConnectionGen
 */
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
    ConnectionGen.prototype.capitalizeFirstLetter = function (name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    Object.defineProperty(ConnectionGen.prototype, "template", {
        get: function () {
            var _this = this;
            var date = new Date();
            return ((_a = ["\n      /**\n       * @file ", "/", ".gen.ts\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      const connector = require('relution/connector.js');\n\n      export class ", "BaseConnection {\n        constructor(public name = '", "') {\n\n        }\n\n        configureSession(properties) {\n          return connector.configureSession(this.name, properties);\n        }\n\n        ", "\n      }\n  "], _a.raw = ["\n      /**\n       * @file ", "/", ".gen.ts\n       *\n       * Created by Relution CLI on ", ".", ".", "\n       * Copyright (c)\n       * ", "\n       * All rights reserved.\n       */\n\n      // Relution APIs\n      const connector = require('relution/connector.js');\n\n      export class ", "BaseConnection {\n        constructor(public name = '", "') {\n\n        }\n\n        configureSession(properties) {\n          return connector.configureSession(this.name, properties);\n        }\n\n        ", "\n      }\n  "], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.capitalizeFirstLetter(this.name), this.name, this.metaData.map(function (model) { return (" /**\n        * " + _this.name + "['" + model.name + "']\n        *\n        * " + model.action + "\n        *\n        * @params input \"Object\" " + model.inputModel + "\n        * @return Promise " + model.outputModel + "\n        */\n        public " + model.name + "(input) {\n          return connector.runCall(\n            this.name,\n            '" + model.name + "',\n            input\n          );\n        }\n      "); }))) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionGen;
}());
exports.ConnectionGen = ConnectionGen;
//# sourceMappingURL=ConnectionGen.js.map