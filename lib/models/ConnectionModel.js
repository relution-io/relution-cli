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
                properties[ConnectionModel.HJSON_COMMENT_PREFIX].c[''] += ("" + os.EOL + _this._fieldDefinitionComment(fieldDefinition) + "\n");
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
        outputCalls[ConnectionModel.HJSON_COMMENT_PREFIX].c[''] = "// please add APIs in use by the backend here";
        calls.forEach(function (call) {
            outputCalls[call.name] = call.action;
            outputCalls = _this._fileApi.copyHjson(outputCalls);
            // outputCalls[ConnectionModel.HJSON_COMMENT_PREFIX'].c[call.name] =
            // `/**
            // * @inputModel: ${call.inputModel}
            // * @outpuModel: ${call.outputModel}
            // */
            // `;
        });
        return outputCalls;
    };
    ConnectionModel.HJSON_COMMENT_PREFIX = '__WSC__'; //please notice in hjson > 2.0 it is __COMMENTS__
    return ConnectionModel;
}());
exports.ConnectionModel = ConnectionModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbk1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9Db25uZWN0aW9uTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0MsSUFBWSxRQUFRLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDckMsNEJBQTBCLDBCQUEwQixDQUFDLENBQUE7QUFDckQsMEJBQXdCLHdCQUF3QixDQUFDLENBQUE7QUFDakQsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFDL0Isd0JBQXNCLHNCQUFzQixDQUFDLENBQUE7QUFDN0MsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDekQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUN2RCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBR3pELElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBVXhCLENBQUM7QUFDRjs7R0FFRztBQUNIO0lBQStCLDZCQUF3QjtJQUNyRCxtQkFBWSxLQUFpQjtRQUMzQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUVSLGlCQUFZLEdBQWtCLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFEekUsQ0FBQztJQUdPLDJCQUFPLEdBQWYsVUFBZ0IsZUFBK0M7UUFDN0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN2RCxDQUFDO0lBRUQsMkJBQU8s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