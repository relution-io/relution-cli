"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relution = require('relution-sdk');
var rxjs_1 = require('@reactivex/rxjs');
var inquirer = require('inquirer');
var Translation_1 = require('./../utility/Translation');
var Validator_1 = require('./../utility/Validator');
var chalk = require('chalk');
var FileApi_1 = require('./../utility/FileApi');
var path = require('path');
var hjson = require('hjson');
var stripIndents = require('common-tags').stripIndents;
var oneLineTrim = require('common-tags').oneLineTrim;
var commaListsOr = require('common-tags').commaListsOr;
var os = require('os');
;
/**
 * MetaModel extends Relution.model.MetaModel
 */
var MetaModel = (function (_super) {
    __extends(MetaModel, _super);
    function MetaModel(other) {
        _super.call(this, other);
        this.promptAlways = ['descriptorUrl', 'authentication'];
    }
    MetaModel.prototype._isList = function (fieldDefinition) {
        return fieldDefinition.enumDefinition ? true : false;
    };
    MetaModel.prototype.toHjson = function () {
        return '';
    };
    MetaModel.prototype.filterPrompts = function (fieldDefinition) {
        return fieldDefinition.defaultValue && fieldDefinition.mandatory || this.promptAlways.indexOf(fieldDefinition.name) !== -1;
    };
    MetaModel.prototype.prompt = function () {
        var _this = this;
        var questions = this.fieldDefinitions
            .filter(this.filterPrompts, this);
        // console.log('this.fieldDefinitions', this.fieldDefinitions);
        var prompt = [];
        if (questions.length) {
            questions.forEach(function (question) {
                if (_this._isList(question)) {
                    var choices = question.enumDefinition.items.map(function (item) {
                        return { name: item.label, value: item.value };
                    });
                    choices.push({
                        name: Translation_1.Translation.CANCEL,
                        value: Translation_1.Translation.CANCEL
                    });
                    prompt.push({
                        type: 'list',
                        name: question.name,
                        message: Translation_1.Translation.ENTER_SOMETHING_LABEL(chalk.magenta(question.label) + " (" + question.tooltip + ")"),
                        choices: choices
                    });
                }
                else {
                    prompt.push({
                        type: 'input',
                        name: question.name,
                        message: Translation_1.Translation.ENTER_SOMETHING_LABEL(chalk.magenta(question.label) + " (" + question.tooltip + ")"),
                        default: question.defaultValue,
                        validate: Validator_1.Validator.notEmptyValidate
                    });
                }
            });
        }
        return prompt;
    };
    MetaModel.prototype.questions = function () {
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.prompt()));
    };
    return MetaModel;
}(Relution.model.MetaModel));
exports.MetaModel = MetaModel;
/**
 * The Model for the CLI Connection Command
 */
var ConnectionModel = (function () {
    function ConnectionModel(params) {
        var _this = this;
        this._name = '';
        this._protocol = '';
        this._connectorProvider = '';
        this._description = 'Auto Generated';
        this._properties = {};
        this._calls = {};
        this._fileApi = new FileApi_1.FileApi();
        if (params) {
            Object.keys(params).forEach(function (key) {
                _this[key] = params[key];
            });
        }
    }
    Object.defineProperty(ConnectionModel.prototype, "metaModel", {
        get: function () {
            return this._metaModel;
        },
        set: function (v) {
            this._metaModel = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "calls", {
        get: function () {
            return this._calls;
        },
        set: function (v) {
            this._calls = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "protocol", {
        get: function () {
            return this._protocol;
        },
        set: function (v) {
            this._protocol = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (v) {
            this._description = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        set: function (v) {
            this._properties = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectionModel.prototype, "connectorProvider", {
        get: function () {
            return this._connectorProvider;
        },
        set: function (v) {
            this._connectorProvider = v;
        },
        enumerable: true,
        configurable: true
    });
    ConnectionModel.prototype.getCommentvalue = function (fieldDefinition) {
        var comment = '';
        if (fieldDefinition.enumDefinition && fieldDefinition.enumDefinition.items && fieldDefinition.enumDefinition.items.length) {
            // console.log(fieldDefinition.enumDefinition.items);
            var values = fieldDefinition.enumDefinition.items.map(function (item) { return item.value; });
            comment += (_a = ["//", ": ", ""], _a.raw = ["//", ": ", ""], commaListsOr(_a, fieldDefinition.name, values));
        }
        else {
            comment += "//" + fieldDefinition.name + ": " + (fieldDefinition.defaultValue || fieldDefinition.dataType);
        }
        return (_b = ["", ""], _b.raw = ["", ""], stripIndents(_b, comment));
        var _a, _b;
    };
    /**
     * create a comment for the properties in the connnection.hjson
     * and looks like
     * /**
     *  * @name oAuthProviderType
     *  * @description Type of OAuth Provider.
     *  * @dataType java.lang.String
     *  *\/
     *  //oAuthProviderType: oauth1, oauth2, saml, openID or cas
     * @return string
     */
    ConnectionModel.prototype._fieldDefinitionComment = function (fieldDefinition) {
        var definition = (_a = ["", ""], _a.raw = ["", ""], oneLineTrim(_a, fieldDefinition.tooltip)).replace('*/', '');
        return ((_b = ["\n      /**\n       * @name ", "\n       * @description ", "\n       * @dataType ", "\n       */\n      ", "\n    "], _b.raw = ["\n      /**\n       * @name ", "\n       * @description ", "\n       * @dataType ", "\n       */\n      ", "\n    "], stripIndents(_b, fieldDefinition.name, definition, fieldDefinition.dataType, this.getCommentvalue(fieldDefinition))));
        var _a, _b;
    };
    ConnectionModel.prototype.getProperties = function () {
        var _this = this;
        var properties = this._fileApi.copyHjson({});
        this.metaModel.fieldDefinitions.forEach(function (fieldDefinition) {
            // console.log(fieldDefinition)
            if (fieldDefinition.defaultValue && fieldDefinition.mandatory || _this.metaModel.promptAlways.indexOf(fieldDefinition.name) !== -1) {
                properties[fieldDefinition.name] = fieldDefinition.defaultValue;
            }
            else {
                properties.__WSC__.c[''] += ("" + os.EOL + _this._fieldDefinitionComment(fieldDefinition) + "\n");
            }
        });
        return properties;
    };
    ConnectionModel.prototype.toJson = function () {
        var myJson = {
            name: path.basename(this.name),
            connectorProvider: this.connectorProvider,
            description: this.description,
            protocol: this.protocol,
            calls: this.calls || {},
            properties: this.properties
        };
        // console.log(hjson.stringify(myJson, {keepWsc: true}));
        return hjson.stringify(myJson, { keepWsc: true });
    };
    ConnectionModel.prototype.fromJson = function (path) {
        var _this = this;
        return this._fileApi.readHjson(path)
            .map(function (connectionHjson) {
            _this.name = connectionHjson.data.name;
            _this.connectorProvider = connectionHjson.data.connectorProvider;
            _this.description = connectionHjson.data.description;
            _this.protocol = connectionHjson.data.protocol;
            _this.properties = connectionHjson.data.properties;
            _this.calls = connectionHjson.data.calls;
            return _this;
        });
    };
    /**
     * add to the calls on the connection.hjson
     * "calls":  {
     * /**
     * * @inputModel: _KP_MOB_DEMANDORDER_GETMessage
     * * @outpuModel: MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET
     * *\/
     * "getAccount": "MOBILE_SST_NEWNEW/_-KP_MOB_DEMANDORDER_GET",
     */
    ConnectionModel.prototype.getCallsForHjson = function (calls) {
        var _this = this;
        var outputCalls = this._fileApi.copyHjson({});
        outputCalls['__WSC__'].c[''] = "// please add APIs in use by the backend here";
        calls.forEach(function (call) {
            outputCalls[call.name] = call.action;
            outputCalls = _this._fileApi.copyHjson(outputCalls);
            // outputCalls['__WSC__'].c[call.name] =
            // `/**
            // * @inputModel: ${call.inputModel}
            // * @outpuModel: ${call.outputModel}
            // */
            // `;
        });
        return outputCalls;
    };
    return ConnectionModel;
}());
exports.ConnectionModel = ConnectionModel;
//# sourceMappingURL=ConnectionModel.js.map