"use strict";
var Validator_1 = require('../../../utility/Validator');
var Relution = require('relution-sdk');
var html = require('common-tags').html;
var camelCase = require('camel-case');
var pascalCase = require('pascal-case');
/**
 * ConnectionGen
 */
var ConnectionGen = (function () {
    function ConnectionGen() {
        this.name = '';
        this.path = 'connections';
        this.metaData = [];
        this.interfaces = [];
        this.interfaceOn = false;
    }
    ConnectionGen.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    ConnectionGen._isValidName = function (_testString) {
        var pass = _testString.match(Validator_1.Validator.namePattern);
        return pass;
    };
    ConnectionGen.prototype._getMethod = function (model) {
        var input = this.interfaceOn ? pascalCase(model.inputModel) : 'any';
        var output = this.interfaceOn ? pascalCase(model.outputModel) : 'any';
        return ((_a = ["\n    /**\n      * ", "['", "']\n      *\n      * ", "\n      *\n      * @params input 'Object' ", "\n      * @return Promise ", "\n      */\n      public ", "(input: ", "): Q.Promise<", "> {\n        return connector.runCall(\n          this.name,\n          '", "',\n          input\n        );\n      }"], _a.raw = ["\n    /**\n      * ", "['", "']\n      *\n      * ", "\n      *\n      * @params input 'Object' ", "\n      * @return Promise ", "\n      */\n      public ", "(input: ", "): Q.Promise<", "> {\n        return connector.runCall(\n          this.name,\n          '", "',\n          input\n        );\n      }"], html(_a, this.name, camelCase(model.name), model.action, input, output, camelCase(model.name), input, output, model.name)));
        var _a;
    };
    ConnectionGen._mapField = function (fieldDefinition) {
        var relutionTypes = Object.keys(Relution.model.TypeScriptFieldDefinition.typeMapping).map(function (key) {
            return Relution.model.TypeScriptFieldDefinition.typeMapping[key];
        });
        var pass = ConnectionGen._isValidName(fieldDefinition.name);
        var value = fieldDefinition.dataTypeTS;
        if (relutionTypes.indexOf(fieldDefinition.dataTypeTS) === -1) {
            if (value.indexOf('[]') !== -1) {
                value = pascalCase(fieldDefinition.dataTypeTS) + "[]";
            }
            else {
                value = pascalCase(fieldDefinition.dataTypeTS);
            }
        }
        if (pass) {
            return "" + fieldDefinition.name + (fieldDefinition.mandatory ? ': ' : '?: ') + value + ";";
        }
        return "'" + fieldDefinition.name + "'" + (fieldDefinition.mandatory ? ': ' : '?: ') + value + ";";
    };
    ConnectionGen.prototype.toInterface = function (model) {
        return ((_a = ["\n      /**\n      * @interface ", "\n      */\n      export interface ", " {\n        ", "\n      }"], _a.raw = ["\n      /**\n      * @interface ", "\n      */\n      export interface ", " {\n        ", "\n      }"], html(_a, pascalCase(model.name), pascalCase(model.name), model.fieldDefinitions.map(ConnectionGen._mapField))) + '\n');
        var _a;
    };
    Object.defineProperty(ConnectionGen.prototype, "template", {
        get: function () {
            var date = new Date();
            return ((_a = ["\n    /**\n    * @file ", "/", ".gen.ts\n    * Created by Relution CLI on ", ".", ".", "\n    * Copyright (c)\n    * ", "\n    * All rights reserved.\n    */\n    import * as Q from 'q';\n    // Relution APIs\n    const connector = require('relution/connector.js');\n    ", "\n    export class ", "BaseConnection {\n      constructor(public name = '", "') {}\n\n      configureSession(properties: any) {\n        return connector.configureSession(this.name, properties);\n      }\n\n      ", "\n    }"], _a.raw = ["\n    /**\n    * @file ", "/", ".gen.ts\n    * Created by Relution CLI on ", ".", ".", "\n    * Copyright (c)\n    * ", "\n    * All rights reserved.\n    */\n    import * as Q from 'q';\n    // Relution APIs\n    const connector = require('relution/connector.js');\n    ", "\n    export class ", "BaseConnection {\n      constructor(public name = '", "') {}\n\n      configureSession(properties: any) {\n        return connector.configureSession(this.name, properties);\n      }\n\n      ", "\n    }"], html(_a, this.path, this.name, this._pad(date.getDate()), this._pad(date.getMonth() + 1), date.getFullYear(), date.getFullYear(), this.interfaces ? this.interfaces.map(this.toInterface.bind(this)) : '', pascalCase(this.name), this.name, this.metaData.map(this._getMethod.bind(this)))) + '\n');
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return ConnectionGen;
}());
exports.ConnectionGen = ConnectionGen;
//# sourceMappingURL=ConnectionGen.js.map