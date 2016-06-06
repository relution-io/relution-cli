"use strict";
var Relution = require('relution-sdk');
var rxjs_1 = require('@reactivex/rxjs');
var path = require('path');
var lodash_1 = require('lodash');
var CallModel = (function () {
    function CallModel(connectionId, outputModel, name, inputModel, action) {
        this.connectionId = connectionId;
        this.outputModel = outputModel;
        this.name = name;
        this.inputModel = inputModel;
        this.action = action;
    }
    return CallModel;
}());
var ApiList = (function () {
    function ApiList(connection) {
        this.connection = connection;
        this._connectionFilter = {
            'type': 'logOp',
            'operation': 'AND',
            'filters': [
                {
                    'type': 'string',
                    'fieldName': 'application',
                    'value': ''
                },
                {
                    'type': 'string',
                    'fieldName': 'name',
                    'value': ''
                }
            ]
        };
        this._filterCallsByName = function (call) {
            return call.name.indexOf(this) !== -1;
        };
    }
    Object.defineProperty(ApiList.prototype, "callsUrl", {
        get: function () {
            return this._callsUrl;
        },
        set: function (v) {
            this._callsUrl = "/mcap/connector/rest/connectors/" + v + "/calls";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiList.prototype, "uuidConnectionUrl", {
        get: function () {
            return this._uuidConnectionUrl;
        },
        enumerable: true,
        configurable: true
    });
    ApiList.prototype.setUuidConnectionUrl = function (uuid, connectionName) {
        this._connectionFilter.filters[0].value = uuid;
        this._connectionFilter.filters[1].value = connectionName;
        var query = encodeURIComponent("" + JSON.stringify(this._connectionFilter));
        this._uuidConnectionUrl = ("/mcap/connector/rest/connectors/?filter=" + query + "&field=uuid");
    };
    ApiList.prototype._pleaseFilterCalls = function (calls) {
        var prompt = {
            type: 'input',
            message: "We found " + calls.length + " " + (calls.length === 1 ? "call" : "calls") + " you can filter by Name " + this.connection.i18n.PRESS_ENTER + " ?",
            name: 'callsFilter'
        };
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    ApiList.prototype._getConnectionUUid = function (appUUid, connectionName) {
        this.setUuidConnectionUrl(appUUid, connectionName);
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this.uuidConnectionUrl
        }));
    };
    ApiList.prototype._getConnectionCalls = function (connectionUuid) {
        this.callsUrl = connectionUuid;
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this.callsUrl
        }));
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
                    _this.connection.log.warn("You must choose at least one topping.");
                    return false;
                }
                return true;
            }
        };
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    ApiList.prototype._chooseConnection = function () {
        var choices = this.connection.getConnectionNames();
        choices.push(this.connection.i18n.TAKE_ME_OUT);
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'list',
            name: 'connectionname',
            message: this.connection.i18n.CHOOSE_LIST('Name'),
            choices: choices
        }));
    };
    ApiList.prototype.apiList = function (name) {
        var _this = this;
        var choosedConnectionName = '';
        var relutionHjson;
        var choosedServer;
        var calls;
        /**
        * get the server connection name
        */
        return this._chooseConnection()
            .filter(function (answers) {
            return answers.connectionname !== _this.connection.i18n.TAKE_ME_OUT;
        })
            .exhaustMap(function (answers) {
            choosedConnectionName = answers.connectionname;
            return _this.connection.fileApi.readHjson(path.join(process.cwd(), 'relution.hjson'));
        })
            .exhaustMap(function (resp) {
            relutionHjson = resp.data;
            // console.log(relutionHjson);
            return _this.connection.helperAdd.getServerPrompt();
        })
            .exhaustMap(function (server) {
            _this._defaultServer = _this.connection.helperAdd.defaultServer;
            if (server.connectserver.toString().trim() === _this._defaultServer.toString().trim()) {
                choosedServer = lodash_1.find(_this.connection.userRc.config.server, { default: true });
            }
            else {
                choosedServer = lodash_1.find(_this.connection.userRc.config.server, { id: server.connectserver });
            }
            return _this.connection.relutionSDK.login(choosedServer)
                .filter(function (resp) {
                return resp.user ? true : false;
            });
        })
            .exhaustMap(function (resp) {
            return _this._getConnectionUUid(relutionHjson.uuid, choosedConnectionName);
        })
            .exhaustMap(function (resp) {
            // console.log(resp.items[0].uuid);
            return _this._getConnectionCalls(resp.items[0].uuid);
        })
            .exhaustMap(function (callsResp) {
            _this._callsCollection = [];
            // console.log(Object.keys(callsResp).length);
            Object.keys(callsResp).forEach(function (key) {
                var params = callsResp[key];
                var model = new CallModel(params.connectionId, params.outputModel, params.name, params.inputModel, params.action);
                _this._callsCollection.push(model);
            });
            /**
             * Prompt a Filter
             */
            // console.log(this._callsCollection);
            return _this._pleaseFilterCalls(_this._callsCollection)
                .map(function (answers) {
                if (answers.callsFilter && answers.callsFilter.length < 0) {
                    calls = _this._callsCollection.filter(_this._filterCallsByName, answers.callsFilter);
                    return _this._chooseCalls(calls);
                }
                return _this._chooseCalls(_this._callsCollection);
            });
        })
            .exhaustMap(function (answers) {
            console.log('answers', answers);
            return rxjs_1.Observable.empty();
        });
    };
    return ApiList;
}());
exports.ApiList = ApiList;
;
//# sourceMappingURL=ApiList.js.map