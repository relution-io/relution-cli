"use strict";
var RxFs_1 = require('./../../utility/RxFs');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var lodash_1 = require('lodash');
var Relution = require('relution-sdk');
var path = require('path');
var ConnectionModel_1 = require('./../../models/ConnectionModel');
var Gii_1 = require('./../../gii/Gii');
var chalk = require('chalk');
var TsBeautifier_1 = require('./../../gii/TsBeautifier');
/**
 * this class add a new Connection
 * 1. get name
 * 2. get description
 * 3. create folder for connection if is needed
 * 5. logon relution
 * 5. get Connector Provider
 * 6. get Protocols to connector provider
 * 7. get metadata to protocols
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
         * api to get metadata
         * pid is the provider protocol
         * bsp. /gofer/meta-model/meta-type-adapter/rest/meta-type-adapters?pid=com.mwaysolutions.mcap.connector.http.RestConnectionConfig
         */
        this._metaDataUrl = '/gofer/meta-model/meta-type-adapter/rest/meta-type-adapters?pid=';
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
    Object.defineProperty(AddConnection.prototype, "connectionHomeFolder", {
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
    AddConnection.prototype.getMetadata = function (provider) {
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({
            method: 'GET',
            url: "" + this._metaDataUrl + encodeURIComponent(provider)
        }));
    };
    /**
     * input for enter name
     */
    AddConnection.prototype._addConnectionNamePath = function () {
        var _this = this;
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt({
            type: 'input',
            name: 'connectionname',
            message: "Please enter name or an sep path('ews/ews-exchange')",
            validate: function (value) {
                var connections = _this.connection.getConnectionNames();
                var notEmpty = Validator_1.Validator.notEmptyValidate(value);
                var isUnique = true;
                var pass = value.match(Validator_1.Validator.namePattern);
                if (!notEmpty) {
                    _this.connection.debuglog.error(new Error("Name can not be empty"));
                    return false;
                }
                if (pass) {
                    connections.forEach(function (item) {
                        if (item.value.connection && item.value.connection.name === value) {
                            _this.connection.debuglog.error(new Error("\"" + chalk.magenta(value) + "\" already exists! Please choose another one or remove the \"" + chalk.magenta(value + '.hjson') + "\" before."));
                            isUnique = false;
                        }
                    });
                    return isUnique;
                }
                else {
                    _this.connection.debuglog.error(new Error(_this.connection.i18n.NOT_ALLOWED(value, Validator_1.Validator.namePattern)));
                    return false;
                }
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
            message: "Please enter a description:"
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
     * return a prompt with providers as value
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
            name: this.connection.i18n.CANCEL,
            value: this.connection.i18n.CANCEL,
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
                value: protocol.value,
                default: false
            });
        });
        choices = lodash_1.orderBy(choices, ['name'], ['asc']);
        choices.push({
            name: this.connection.i18n.CANCEL,
            value: this.connection.i18n.CANCEL,
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
            message: path + " already exists you want to overwrite it ?"
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
        var folder = this.connectionHomeFolder;
        if (RxFs_1.RxFs.exist(folder + "/" + this.connectionName + ".hjson")) {
            return this._alreadyExist(folder + "/" + this.connectionName + ".hjson");
        }
        return this.connection.fileApi.mkdirp(folder);
    };
    /**
     * choose first on which Server the App has to be deployed
     */
    AddConnection.prototype.getServerPrompt = function () {
        this.defaultServer = 'default';
        var prompt = this.connection._copy(this.connection._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
        var indexDefault = lodash_1.findIndex(this.connection.userRc.server, { default: true });
        if (indexDefault > -1) {
            this.defaultServer += " " + prompt[0].choices[indexDefault];
            prompt[0].choices.splice(indexDefault, 1);
            prompt[0].choices.unshift(this.defaultServer);
        }
        return rxjs_1.Observable.fromPromise(this.connection.inquirer.prompt(prompt));
    };
    AddConnection.prototype.add = function () {
        var _this = this;
        var choosedServer;
        this.connectionModel = new ConnectionModel_1.ConnectionModel();
        var fileWritten = true;
        if (!this.connection.userRc.server.length) {
            return rxjs_1.Observable.throw(new Error('Please add a Server firstly!'));
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
                return server.connectserver !== _this.connection.i18n.CANCEL;
            });
        })
            .exhaustMap(function (server) {
            if (server.connectserver.toString().trim() === _this.defaultServer.toString().trim()) {
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
            return _this._getConnectorProvider()
                .filter(function (response) {
                return response.length > 0;
            });
        })
            .exhaustMap(function (resp) {
            return _this._chooseConnectorProvider(resp);
        })
            .exhaustMap(function (answers) {
            _this.connectionModel.connectorProvider = answers.connectionprovider;
            return _this._getProtocols(answers.connectionprovider)
                .filter(function (resp) {
                // console.log(resp);
                return resp.length > 0;
            });
        })
            .exhaustMap(function (protocols) {
            protocols = protocols;
            return _this._chooseProtocol(protocols)
                .filter(function (answers) {
                return answers.protocol !== _this.connection.i18n.CANCEL;
            });
        })
            .exhaustMap(function (answers) {
            _this.connectionModel.protocol = answers.protocol;
            return _this.getMetadata(_this.connectionModel.protocol);
        })
            .exhaustMap(function (resp) {
            // console.log('resp', resp);
            if (resp.metaModels && resp.metaModels.length) {
                _this.connectionModel.metaModel = new ConnectionModel_1.MetaModel().fromJSON(resp.metaModels[0]);
                // console.log('this.connectionModel.metaModel.prompt', this.connectionModel.metaModel.prompt);
                return _this.connectionModel.metaModel.questions()
                    .exhaustMap(function (answers) {
                    // console.log('answers', answers);
                    Object.keys(answers).forEach(function (key) {
                        if (key !== _this.connection.i18n.CANCEL) {
                            _this.connectionModel.metaModel.fieldDefinitions.index[key].defaultValue = answers[key];
                        }
                    });
                    return _this._createConnectionFolder();
                });
            }
            else {
                return _this._createConnectionFolder();
            }
        })
            .exhaustMap(function (written) {
            _this.connectionModel.properties = _this.connectionModel.getProperties();
            var template = _this.connectionModel.toJson();
            if (written && written.connectionOverwrite === false) {
                fileWritten = written.connectionOverwrite;
                return rxjs_1.Observable.create(function (observer) {
                    _this.connection.debuglog.warn("Connection add " + _this.connectionName + " canceled.");
                    return observer.complete();
                });
            }
            return _this.connection.fileApi.writeHjson(template, _this.connectionName, _this._rootFolder);
        })
            .exhaustMap(function () {
            var template = _this._gii.getTemplateByName('connectionGen');
            template.instance.name = _this.connectionName;
            template.instance.path = path.dirname(_this.connectionModel.name);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".gen.ts", _this.connectionHomeFolder)
                .exhaustMap(function () {
                return TsBeautifier_1.TsBeautifier.format([path.join(_this.connectionHomeFolder, template.instance.name + ".gen.ts")]);
            });
        })
            .exhaustMap(function () {
            var template = _this._gii.getTemplateByName('connection');
            template.instance.name = _this.connectionName;
            template.instance.path = path.dirname(_this.connectionModel.name);
            return _this.connection.fileApi.writeFile(template.instance.template, template.instance.name + ".ts", _this._rootFolder)
                .exhaustMap(function () {
                return TsBeautifier_1.TsBeautifier.format([path.join(_this._rootFolder, template.instance.name + ".ts")]);
            });
        })
            .exhaustMap(function () {
            return _this.connection.streamConnectionFromFileSystem();
        })
            .map(function () {
            var exec = require('child_process').exec;
            exec("tsc -p " + process.cwd());
        })
            .exhaustMap(function () {
            return _this.connection._parent.staticCommands.project.deploy([choosedServer.id]);
        })
            .do({
            complete: function (file) {
                _this.connection.debuglog.info("Connection " + _this.connectionModel.name + " are created. Please Deploy your Connection before you can update it.");
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2Nvbm5lY3Rpb24vQWRkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxxQkFBbUIsc0JBQXNCLENBQUMsQ0FBQTtBQUMxQyxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQywwQkFBd0IsMkJBQTJCLENBQUMsQ0FBQTtBQUNwRCx1QkFBdUMsUUFBUSxDQUFDLENBQUE7QUFDaEQsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFDN0IsZ0NBQXlDLGdDQUFnQyxDQUFDLENBQUE7QUFDMUUsb0JBQWtCLGlCQUFpQixDQUFDLENBQUE7QUFDcEMsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFDL0IsNkJBQTJCLDBCQUEwQixDQUFDLENBQUE7QUFFdEQ7Ozs7Ozs7Ozs7R0FVRztBQUNIO0lBdUNFLHVCQUFZLE9BQW1CO1FBbEMvQjs7V0FFRztRQUNLLGVBQVUsR0FBVyxlQUFlLENBQUM7UUFDN0M7O1dBRUc7UUFDSyxrQkFBYSxHQUFHLHVHQUF1RyxDQUFDO1FBQ2hJOztXQUVHO1FBQ0ssaUJBQVksR0FBRyxnSEFBZ0gsQ0FBQztRQUN4STs7OztXQUlHO1FBQ0ssaUJBQVksR0FBRyxrRUFBa0UsQ0FBQztRQUsxRjs7V0FFRztRQUNLLGdCQUFXLEdBQWMsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQkFBZSxDQUFDO1FBSzlEOztXQUVHO1FBQ0ssU0FBSSxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUlELHNCQUFXLCtDQUFvQjtRQUgvQjs7V0FFRzthQUNIO1lBQ0UsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxD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