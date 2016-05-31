"use strict";
var RxFs_1 = require('./../../utility/RxFs');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var lodash_1 = require('lodash');
var Relution = require('relution-sdk');
var path = require('path');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var Gii_1 = require('./../../gii/Gii');
/**
 * this class add a new Connection
 * 1. get name
 * 2. get description
 * 3. create folder for connection if is needed
 * 5. logon relution
 * 5. get Connector Provider
 * 6. get Protocols to connector provider
 * 7. save the result to project
 */
var AddConnection = (function () {
    function AddConnection(command) {
        /**
         * the key which is the server from the prompt available
         */
        this._promptkey = 'connectserver';
        /**
         * url to get protocols
         */
        this._protocolsUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.protocol';
        /**
         * api to get conectorProvider
         */
        this._providerUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.connectorProvider';
        /**
         * where the connection hav to be save
         */
        this._rootFolder = process.cwd() + "/connections/";
        /**
         * template renderer
         */
        this._gii = new Gii_1.Gii();
        this.connection = command;
    }
    Object.defineProperty(AddConnection.prototype, "path", {
        /**
         * return the path for the folder where it have to be create
         */
        get: function () {
            var myPath = path.dirname(this.connectionModel.name);
            if (myPath === '.') {
                return this._rootFolder;
            }
            return path.join(this._rootFolder, myPath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddConnection.prototype, "connectionName", {
        /**
         * return the connection name without file name
         */
        get: function () {
            return path.basename(this.connectionModel.name);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * input for enter name
     */
    AddConnection.prototype._addConnectionNamePath = function () {
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'input',
            name: 'connectionname',
            message: "Please enter name or an sep path('ews/ews-exchange')",
            validate: function (value) {
                return Validator_1.Validator.notEmptyValidate(value);
            }
        }));
    };
    /**
     * input for enter description
     */
    AddConnection.prototype._addConnectionDescription = function () {
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'input',
            name: 'connectiondescription',
            message: "Please enter a description:",
            validate: function (value) {
                return Validator_1.Validator.notEmptyValidate(value);
            }
        }));
    };
    /**
     * get the protocols from the server
     * @return XMLHttpRequest
     */
    AddConnection.prototype._getProtocols = function (query) {
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this._protocolsUrl + "?query=" + encodeURIComponent(query)
        }));
    };
    /**
     * return a prompt with protocols as value
     */
    AddConnection.prototype._chooseConnectorProvider = function (providers) {
        var choices = [];
        providers.forEach(function (protocol) {
            choices.push({
                name: protocol.label,
                value: protocol.value,
                default: false
            });
        });
        choices = lodash_1.orderBy(choices, ['name'], ['asc']);
        choices.push({
            name: this.connection.i18n.TAKE_ME_OUT,
            value: this.connection.i18n.TAKE_ME_OUT,
            default: false
        });
        var prompt = [{
                type: 'list',
                name: 'connectionprovider',
                message: 'Please choose a Connector: ',
                choices: choices
            }];
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    /**
     * return a prompt with protocols as value
     */
    AddConnection.prototype._chooseProtocol = function (protocols) {
        var choices = [];
        protocols.forEach(function (protocol) {
            choices.push({
                name: protocol.label,
                value: protocol.label.toLowerCase(),
                default: false
            });
        });
        choices = lodash_1.orderBy(choices, ['name'], ['asc']);
        choices.push({
            name: this.connection.i18n.TAKE_ME_OUT,
            value: this.connection.i18n.TAKE_ME_OUT,
            default: false
        });
        var prompt = [{
                type: 'list',
                name: 'protocol',
                message: 'Please choose a Protocol: ',
                choices: choices
            }];
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    /**
     * checked if the connection already exist
     */
    AddConnection.prototype._alreadyExist = function (path) {
        var prompt = {
            type: 'confirm',
            name: 'connectionOverwrite',
            message: path + " already exist you want to overwrite it ?"
        };
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    /**
     * get the porviders from the server
     */
    AddConnection.prototype._getConnectorProvider = function () {
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: this._providerUrl
        }));
    };
    /**
     * if is a subfolder we have to create it if is connection exist the user have to be confirm the overwrite
     */
    AddConnection.prototype._createConnectionFolder = function () {
        var folder = this.path;
        if (RxFs_1.RxFs.exist(folder + "/" + this.connectionName + ".hjson")) {
            return this._alreadyExist(folder + "/" + this.connectionName + ".hjson");
        }
        return this.connection.fileApi.mkdirp(folder);
    };
    /**
     * choose first on which Server the App has to be deployed
     */
    AddConnection.prototype.getServerPrompt = function () {
        this._defaultServer = 'default';
        var prompt = this.connection._copy(this.connection._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
        var indexDefault = lodash_1.findIndex(this.connection.userRc.config.server, { default: true });
        if (indexDefault > -1) {
            this._defaultServer += " " + prompt[0].choices[indexDefault];
            prompt[0].choices.splice(indexDefault, 1);
            prompt[0].choices.unshift(this._defaultServer);
        }
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    AddConnection.prototype.add = function () {
        var _this = this;
        var choosedServer;
        this.connectionModel = new ConnectionModel_1.ConnectionModel();
        if (!this.connection.userRc.server.length) {
            return rxjs_1.Observable.throw(new Error('Please add first a Server!'));
        }
        /**
         * set a new connection name
         */
        return this._addConnectionNamePath()
            .exhaustMap(function (answers) {
            _this.connectionModel.name = answers.connectionname;
            return _this._addConnectionDescription();
        })
            .exhaustMap(function (answers) {
            _this.connectionModel.description = answers.connectiondescription;
            return _this.getServerPrompt()
                .filter(function (server) {
                return server.connectserver !== _this.connection.i18n.TAKE_ME_OUT;
            });
        })
            .exhaustMap(function (server) {
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
            return _this._getConnectorProvider()
                .filter(function (resp) {
                return resp.length > 0;
            });
        })
            .exhaustMap(function (resp) {
            return _this._chooseConnectorProvider(resp);
        })
            .exhaustMap(function (answers) {
            _this.connectionModel.connectorProvider = answers.connectionprovider;
            return _this._getProtocols(answers.connectionprovider)
                .filter(function (resp) {
                return resp.length > 0;
            });
        })
            .exhaustMap(function (protocols) {
            protocols = protocols;
            return _this._chooseProtocol(protocols)
                .filter(function (answers) {
                return answers.protocol !== _this.connection.i18n.TAKE_ME_OUT;
            });
        })
            .exhaustMap(function (answers) {
            _this.connectionModel.type = answers.protocol;
            return _this._createConnectionFolder();
        })
            .exhaustMap(function (writen) {
            if (writen && !writen.connectionOverwrite) {
                return rxjs_1.Observable.create(function (observer) {
                    observer.next("Connection add " + _this.connectionName + " canceled");
                    observer.complete();
                });
            }
            return _this.connection.fileApi.writeHjson(_this.connectionModel.toJson(), _this.connectionName, _this.path);
        })
            .exhaustMap(function () {
            var template = _this._gii.getTemplateByName('connectionGen');
            template.instance.name = _this.connectionName;
            template.instance.path = path.dirname(_this.connectionModel.name);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".gen.js", _this.path);
        })
            .exhaustMap(function () {
            var template = _this._gii.getTemplateByName('connection');
            template.instance.name = _this.connectionName;
            template.instance.path = path.dirname(_this.connectionModel.name);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".js", _this.path);
        })
            .do(function (file) {
            return _this.connection.log.info("Connection " + _this.connectionModel.name + " are created. Please Deploy your Connection before you can update it.");
        });
    };
    Object.defineProperty(AddConnection.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        set: function (v) {
            this._connection = v;
        },
        enumerable: true,
        configurable: true
    });
    return AddConnection;
}());
exports.AddConnection = AddConnection;
//# sourceMappingURL=Add.js.map