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
        this.interfaces = [];
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
    ConnectionGen.prototype._getMethod = function (model) {
        return ((_a = ["\n    /**\n      * ", "['", "']\n      *\n      * ", "\n      *\n      * @params input 'Object' ", "\n      * @return Promise ", "\n      */\n      public ", "(input: ", "): Q.Promise<", "> {\n        return connector.runCall(\n          this.name,\n          '", "',\n          input\n        );\n      }"], _a.raw = ["\n    /**\n      * ", "['", "']\n      *\n      * ", "\n      *\n      * @params input 'Object' ", "\n      * @return Promise ", "\n      */\n      public ", "(input: ", "): Q.Promise<", "> {\n        return connector.runCall(\n          this.name,\n          '", "',\n          input\n        );\n      }"], html(_a, this.name, model.name, model.action, model.inputModel, model.outputModel, model.name, model.inputModel || 'any', model.outputModel || "any", model.name)));
        var _a;
    };
    ConnectionGen.mapField = function (fieldDefinition) {
        return "" + fieldDefinition.name + (fieldDefinition.mandatory ? ': ' : '?: ') + fieldDefinition.dataTypeTS + ";";
    };
    ConnectionGen.prototype.toInterface = function (model) {
        return ((_a = ["\n      /**\n      * @interface ", "\n      */\n      export interface ", " {\n        ", "\n      }"], _a.raw = ["\n      /**\n      * @interface ", "\n      */\n      export interface ", " {\n        ", "\n      }"], html(_a, model.name, model.name, model.fieldDefinitions.map(ConnectionGen.mapField))) + '\n');
        var _a;
    };
    Object.defineProperty(ConnectionGen.prototype, "template", {
        get: function () {
            var date = new Date();
            return ((_a = ["\n    /**\n    * @file ", "/", ".gen.ts\n    * Created by Relution CLI on ", ".", ".", "\n    * Copyright (c)\n    * ", "\n    * All rights reserved.\n    */\n    import * as Q from 'q';\n    // Relution APIs\n    const connector = require('relution/connector.js');\n    ", "\n    export class ", "BaseConnection {\n      constructor(public name = '", "') {}\n\n      configureSession(properties: any) {\n        return connector.configureSession(this.name, properties);\n      }\n\n      ", "\n    }"], _a.raw = ["\n    /**\n    * @file ", "/", ".gen.ts\n    * Created by Relution CLI on ", ".", ".", "\n    * Copyright (c)\n    * ", "\n    * All rights reserved.\n    */\n    import * as Q from 'q';\n    // Relution APIs\n    const connector = require('relution/connector.js');\n    ", "\n    export class ", "BaseConnection {\n      constructor(public name = '", "') {}\n\n      configureSession(properties: any) {\n        return connector.configureSession(this.name, properties);\n      }\n\n      ", "\n    }"], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.interfaces ? this.interfaces.map(this.toInterface.bind(this)) : '', this.capitalizeFirstLetter(this.name), this.name, this.metaData.map(this._getMethod.bind(this)))) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionGen;
}());
exports.ConnectionGen = ConnectionGen;
//# sourceMappingURL=ConnectionGen.js.map