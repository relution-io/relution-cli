"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var path = require('path');
var lodash_1 = require('lodash');
var CallModel_1 = require('./../../models/CallModel');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var Gii_1 = require('./../../gii/Gii');
var TsBeautifier_1 = require('./../../gii/TsBeautifier');
var ApiList = (function () {
    function ApiList(connection) {
        this.connection = connection;
        /**
         * template renderer
         */
        this._gii = new Gii_1.Gii();
        this._filterCallsByName = function (call) {
            return call.name.indexOf(this) !== -1;
        };
    }
    ApiList.prototype._enterCallName = function (calls) {
        var _this = this;
        var prompt = [];
        calls.forEach(function (call) {
            prompt.push({
                type: 'input',
                name: call.name,
                message: _this.connection.i18n.ENTER_SOMETHING.concat("name for " + call.name),
                default: call.name,
                value: call
            });
        });
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    ApiList.prototype._pleaseFilterCalls = function (calls) {
        var prompt = {
            type: 'input',
            message: "We found " + calls.length + " " + (calls.length === 1 ? "call" : "calls") + " you can filter by Name " + this.connection.i18n.PRESS_ENTER + " ?",
            name: 'callsFilter'
        };
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    ApiList.prototype._chooseCalls = function (calls) {
        var _this = this;
        var choices = calls.map(function (call) {
            return {
                name: call.name,
                value: call,
                short: call.name.substr(0, 10)
            };
        });
        var prompt = {
            type: 'checkbox',
            message: "Please choose youre calls:",
            name: 'choosedCalls',
            choices: choices,
            paginated: calls.length < 10 ? true : false,
            validate: function (answer) {
                if (answer.length < 1) {
                    _this.connection.debuglog.warn("You must choose at least one topping.");
                    return false;
                }
                return true;
            }
        };
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    ApiList.prototype._chooseConnection = function () {
        var choices = this.connection.getConnectionNames();
        choices.push({ name: this.connection.i18n.CANCEL, value: this.connection.i18n.CANCEL });
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'list',
            name: 'connectionname',
            message: this.connection.i18n.CHOOSE_LIST('Name'),
            choices: choices
        }));
    };
    ApiList.prototype.apiList = function (name) {
        var _this = this;
        var relutionHjson;
        var choosedServer;
        var calls;
        var connectionModel = new ConnectionModel_1.ConnectionModel();
        var choosedCalls;
        var treeDirectory;
        /**
        * get the server connection name
        */
        return this._chooseConnection()
            .filter(function (answers) {
            return answers.connectionname !== _this.connection.i18n.CANCEL;
        })
            .exhaustMap(function (answers) {
            treeDirectory = answers.connectionname;
            return connectionModel.fromJson(treeDirectory.path);
        })
            .exhaustMap(function (newModel) {
            connectionModel = newModel;
            return _this.connection.fileApi.readHjson(path.join(process.cwd(), 'relution.hjson'));
        })
            .exhaustMap(function (resp) {
            relutionHjson = resp.data;
            return _this.connection.helperAdd.getServerPrompt();
        })
            .exhaustMap(function (server) {
            _this._defaultServer = _this.connection.helperAdd.defaultServer;
            if (server.connectserver.toString().trim() === _this._defaultServer.toString().trim()) {
                choosedServer = lodash_1.find(_this.connection.userRc.server, { default: true });
            }
            else {
                choosedServer = lodash_1.find(_this.connection.userRc.server, { id: server.connectserver });
            }
            return _this.connection.relutionSDK.login(choosedServer)
                .filter(function (resp) {
                return resp.user ? true : false;
            });
        })
            .exhaustMap(function (resp) {
            return _this.connection.getConnectionUUid(relutionHjson.uuid, connectionModel.name);
        })
            .exhaustMap(function (resp) {
            return _this.connection.getConnectionCalls(resp.items[0].uuid);
        })
            .exhaustMap(function (callsResp) {
            _this._callsCollection = [];
            // console.log(Object.keys(callsResp).length);
            Object.keys(callsResp).forEach(function (key) {
                var params = callsResp[key];
                var model = new CallModel_1.CallModel(params.connectionId, params.outputModel, params.name, params.inputModel, params.action);
                _this._callsCollection.push(model);
            });
            /**
             * Prompt a Filter
             */
            // console.log(this._callsCollection);
            return _this._pleaseFilterCalls(_this._callsCollection)
                .exhaustMap(function (answers) {
                if (answers.callsFilter && answers.callsFilter.length < 0) {
                    calls = _this._callsCollection.filter(_this._filterCallsByName, answers.callsFilter);
                    return _this._chooseCalls(calls);
                }
                return _this._chooseCalls(_this._callsCollection);
            });
        })
            .exhaustMap(function (answers) {
            choosedCalls = answers.choosedCalls;
            return _this._enterCallName(choosedCalls);
        })
            .exhaustMap(function (answers) {
            Object.keys(answers).forEach(function (key) {
                var index = lodash_1.findIndex(choosedCalls, { name: key });
                choosedCalls[index].name = answers[key];
            });
            connectionModel.calls = connectionModel.getCallsForHjson(choosedCalls);
            return _this.connection.fileApi.writeHjson(connectionModel.toJson(), treeDirectory.connection.name, path.dirname(treeDirectory.path));
        })
            .exhaustMap(function () {
            var template = _this._gii.getTemplateByName('connectionGen');
            template.instance.name = connectionModel.name;
            template.instance.path = path.dirname(connectionModel.name);
            template.instance.metaData = choosedCalls;
            // console.log(template.instance);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".gen.ts", _this.connection.rootFolder)
                .exhaustMap(function () {
                return TsBeautifier_1.TsBeautifier.format([path.join(_this.connection.rootFolder, template.instance.name + ".gen.ts")]);
            });
        })
            .do({
            complete: function () {
                return _this.connection.debuglog.info(connectionModel.name + " are updated!");
            }
        });
    };
    return ApiList;
}());
exports.ApiList = ApiList;
;
//# sourceMappingURL=ApiList.js.map