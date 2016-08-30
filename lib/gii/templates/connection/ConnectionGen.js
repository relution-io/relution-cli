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
    /**
     * month helper
     */
    ConnectionGen.prototype._pad = function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    };
    /**
     * check if the name
     */
    ConnectionGen._isValidName = function (_testString) {
        var pass = _testString.match(Validator_1.Validator.namePattern);
        return pass;
    };
    /**
     * return a function string
     */
    ConnectionGen.prototype._getMethod = function (model) {
        var input = this.interfaceOn ? pascalCase(model.inputModel) : 'any';
        var output = this.interfaceOn ? pascalCase(model.outputModel) : 'any';
        return ("\n      /**\n      * " + this.name + "['" + camelCase(model.name) + "']\n      *\n      * " + model.action + "\n      *\n      * @params input 'Object' " + input + "\n      * @return Promise " + output + "\n      */\n      public " + camelCase(model.name) + "(input: " + input + "): Q.Promise<" + output + "> {\n        return connector.runCall(\n          this.name,\n          '" + model.name + "',\n          input\n        );\n      }");
    };
    /**
     * map a field into a Interface
     */
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
    /**
     * return a String of Attributes with TypeScriptFieldDefinition.dataTypeTS
     */
    ConnectionGen.getInterfaceAttributesAsString = function (fieldDefinitions) {
        var template = '';
        fieldDefinitions.forEach(function (fieldDefinition, index) {
            var end = (index === (fieldDefinitions.length - 1)) ? '' : '\n';
            var attr = ConnectionGen._mapField(fieldDefinition);
            template += attr + end;
        });
        return template;
    };
    /**
     * create a Interface Template
     */
    ConnectionGen.prototype.toInterface = function (model) {
        return (("\n      /**\n      * @interface " + pascalCase(model.name) + "\n      */\n      export interface " + pascalCase(model.name) + " {\n        " + ConnectionGen.getInterfaceAttributesAsString(model.fieldDefinitions) + "\n      }") + '\n');
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