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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbkdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL2Nvbm5lY3Rpb24vQ29ubmVjdGlvbkdlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsMEJBQXdCLDRCQUE0QixDQUFDLENBQUE7QUFHckQsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN6QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDOztHQUVHO0FBQ0g7SUFBQTtRQUNTLFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFXLGFBQWEsQ0FBQztRQUM3QixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUVoQyxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBQ3JCLGdCQUFXLEdBQVksS0FBSyxDQUFDO0lBZ0h0QyxDQUFDO0lBL0dDOztPQUVHO0lBQ0ssNEJBQUksR0FBWixVQUFhLEdBQVc7UUFDdEIsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNuQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFDRDs7T0FFRztJQUNZLDBCQUFZLEdBQTNCLFVBQTRCLFdBQW1CO1FBQzdDLElBQUksSUFBSSxHQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMscUJBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNEOztPQUVHO0lBQ0ssa0NBQVUsR0FBbEIsVUFBb0IsS0FBZ0I7UUFDbEMsSUFBTSxLQUFLLEdB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