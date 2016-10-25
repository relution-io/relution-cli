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
            if (_this._callsCollection.length >= 5) {
                return _this._pleaseFilterCalls(_this._callsCollection)
                    .exhaustMap(function (answers) {
                    if (answers.callsFilter && answers.callsFilter.length > 0) {
                        calls = _this._callsCollection.filter(_this._filterCallsByName, answers.callsFilter);
                        return _this._chooseCalls(calls);
                    }
                    return _this._chooseCalls(_this._callsCollection);
                });
            }
            return _this._chooseCalls(_this._callsCollection);
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
            .map(function () {
            var exec = require('child_process').exec;
            exec("tsc -p " + process.cwd());
        })
            .exhaustMap(function () {
            return _this.connection._parent.staticCommands.project.deploy([choosedServer.id]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpTGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9jb25uZWN0aW9uL0FwaUxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLHVCQUE4QixRQUFRLENBQUMsQ0FBQTtBQUN2QywwQkFBOEIsMEJBQTBCLENBQUMsQ0FBQTtBQUN6RCxnQ0FBOEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRCxvQkFBa0IsaUJBQWlCLENBQUMsQ0FBQTtBQUVwQyw2QkFBMkIsMEJBQTBCLENBQUMsQ0FBQTtBQUV0RDtJQVdFLGlCQUFtQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBSnpDOztXQUVHO1FBQ0ssU0FBSSxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7UUFpQmpCLHVCQUFrQixHQUFHLFVBQVUsSUFBVTtZQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO0lBbEIwQyxDQUFDO0lBRXJDLGdDQUFjLEdBQXRCLFVBQXVCLEtBQWtCO1FBQXpDLGlCQVlDO1FBWEMsSUFBSSxNQUFNLEdBQTRGLEVBQUUsQ0FBQztRQUN6RyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixPQUFPLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxjQUFZLElBQUksQ0FBQyxJQUFNLENBQUM7Z0JBQzdFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbEIsS0FBSyxFQUFF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