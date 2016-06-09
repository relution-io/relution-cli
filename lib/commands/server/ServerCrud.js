"use strict";
var fs = require('fs');
var _ = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var ServerModelRc_1 = require('./../../models/ServerModelRc');
var lodash_1 = require('lodash');
var inquirer = require('inquirer');
var DebugLog_1 = require('./../../utility/DebugLog');
var CertModelRc_1 = require("../../models/CertModelRc");
var RxFs_1 = require("../../utility/RxFs");
/**
 * add a Server to Config from the UserRc and store it
 */
var ADD = 'add';
var UPDATE = 'update';
var CLIENTCERT = 'clientcert';
var ServerCrud = (function () {
    function ServerCrud(connection) {
        this.inquirer = inquirer;
        this._scenario = ADD;
        this.userRc = connection.userRc;
        this.server = connection;
    }
    ServerCrud.prototype._wannaTest = function () {
        var prompt = {
            type: 'confirm',
            name: 'testconnection',
            message: 'Would you like to test the server with the applied data ?'
        };
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    Object.defineProperty(ServerCrud.prototype, "addConfig", {
        get: function () {
            var _this = this;
            return [
                {
                    type: 'input',
                    name: 'id',
                    message: 'Server Name :',
                    validate: function (value) {
                        var test = lodash_1.findIndex(_this.userRc.server, { id: value });
                        if (!test && _this._scenario === ADD) {
                            DebugLog_1.DebugLog.error(new Error(_this.server.i18n.ALREADY_EXIST(value)));
                            return false;
                        }
                        var pass = value.match(Validator_1.Validator.stringNumberPattern);
                        if (pass) {
                            return true;
                        }
                        else {
                            return 'Please enter a valid Server name';
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'serverUrl',
                    message: 'Enter the server url (http://....) :',
                    validate: function (value) {
                        var pass = value.match(Validator_1.Validator.urlPattern);
                        if (pass) {
                            return true;
                        }
                        else {
                            return 'Please enter a valid url';
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'userName',
                    message: 'Enter your username :',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'Enter your Password :',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'confirm',
                    name: 'default',
                    default: false,
                    message: 'Set as Default Server ?'
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    ;
    ServerCrud.prototype._copy = function (org) {
        if (!_.isObject(org)) {
            return org;
        }
        return JSON.parse(JSON.stringify(org));
    };
    /**
     * toggle all server to default false
     */
    ServerCrud.prototype.falseyDefaultServer = function () {
        this.userRc.server.forEach(function (server) {
            if (server.default) {
                server.default = false;
            }
        });
    };
    /**
     * cheack if the server id already exist
     */
    ServerCrud.prototype.isUnique = function (server) {
        return lodash_1.findIndex(this.userRc.server, { id: server.id }) < 0;
    };
    /**
     * remove a server from the list
     */
    ServerCrud.prototype.removeServer = function (id) {
        var pos = lodash_1.findIndex(this.userRc.server, { id: id });
        if (pos < 0) {
            throw Error(id + " not exist!");
        }
        this.userRc.server.splice(pos, 1);
        return this.userRc.updateRcFile();
    };
    /**
     * add a server to the config server list.
     */
    ServerCrud.prototype.addServer = function (server, update) {
        if (update === void 0) { update = false; }
        if (!this.isUnique(server) && !update) {
            throw new Error(this.server.i18n.ALREADY_EXIST(server.id, 'Server'));
        }
        if (server.default) {
            this.falseyDefaultServer();
        }
        if (update) {
            var pos = lodash_1.findIndex(this.userRc.server, { id: server.id });
            if (pos) {
                this.userRc.server[pos] = server;
            }
        }
        else {
            this.userRc.server.push(server);
        }
        return this.userRc.updateRcFile();
    };
    ServerCrud.prototype.setDefaults = function (defaults) {
        var _this = this;
        var myPrompt = this.addConfig;
        if (defaults) {
            myPrompt.forEach(function (item) {
                item.default = function () { return defaults[item.name]; };
                item.message += _this.server.i18n.PRESS_ENTER;
            });
        }
        return myPrompt;
    };
    ServerCrud.prototype.createNewServer = function (id) {
        var prompt = this.addConfig;
        if (id) {
            prompt[0]['default'] = id;
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * return a prompt with available servers
     */
    ServerCrud.prototype.serverListPrompt = function (name, type, message) {
        var _this = this;
        if (name === void 0) { name = 'server'; }
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = 'Select Server(s) :'; }
        var choices = lodash_1.map(this.userRc.server, 'id');
        choices.push(this.server.i18n.TAKE_ME_OUT);
        return [
            {
                type: type,
                message: message,
                name: name,
                choices: choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return _this.server.i18n.YOU_MOUST_CHOOSE('Server');
                    }
                    return true;
                }
            }
        ];
    };
    /**
     * remove a server frm a list
     */
    ServerCrud.prototype.deletePrompt = function () {
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(this.serverListPrompt()));
    };
    /**
     * ```javascript
     * const crud = new ServerCrud(myuserRc)
     * crud.rm(id).subscribe(
        () => {
           console.log('on working porgress');
        },
        (e:any) => {
          console.error(e);
        },
        () => {
          console.log('complete');
        }
      );
     * ```
     */
    ServerCrud.prototype.rm = function (id) {
        var _this = this;
        var all = [];
        return this.deletePrompt()
            .filter(function (answers) {
            if (answers.server.indexOf(_this.server.i18n.TAKE_ME_OUT) !== -1 && answers.server.length > 1) {
                DebugLog_1.DebugLog.warn("I see you choose \"servers\" and \"" + _this.server.i18n.TAKE_ME_OUT + "\" so you get out without remove.");
                return false;
            }
            return true;
        })
            .filter(function (answers) {
            return answers.server.indexOf(_this.server.i18n.TAKE_ME_OUT) === -1;
        })
            .exhaustMap(function (answers) {
            answers.server.forEach(function (serverId) {
                all.push(_this.removeServer(serverId));
            });
            return rxjs_1.Observable.forkJoin(all)
                .do(function () {
                DebugLog_1.DebugLog.info("Server " + answers.server.toString() + " are removed.");
            });
        });
    };
    /**
     * @name add
     * @return Observable
     * @params Array<string>
     * @description add a server to the userrc file
     */
    ServerCrud.prototype.add = function (params) {
        var _this = this;
        // the name is here
        // console.log(params[0]);
        var name = '';
        var model;
        if (params && params[0] && params[0].length) {
            name = params[0].trim();
        }
        /**
           * enter name url ....
           */
        return this.createNewServer(name)
            .exhaustMap(function (answers) {
            model = new ServerModelRc_1.ServerModelRc(answers);
            return _this.addServer(model);
        })
            .exhaustMap(function () {
            return _this._wannaTest()
                .filter(function (answers) {
                return answers.testconnection;
            });
        })
            .exhaustMap(function (answers) {
            return _this.server.relutionSDK.login(model, true)
                .filter(function (resp) {
                return resp.user;
            })
                .map(function (resp) {
                var userResp = resp.user;
                return _this.server.log.info("logged in as " + (userResp.givenName ? userResp.givenName + ' ' + userResp.surname : userResp.name));
            });
        });
    };
    /**
     * chose a server from the list
     */
    ServerCrud.prototype._updateServerChooserPrompt = function (id) {
        var prompt = this.serverListPrompt('server', 'list', 'choose a Server');
        if (id && id.length) {
            prompt.default = function () { return id; };
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * inquirer a server with defaults
     */
    ServerCrud.prototype._updateWithId = function (id) {
        var serverId = this._copy(id);
        var serverIndex = lodash_1.findIndex(this.userRc.server, { id: serverId });
        var prompt = this.setDefaults(this.userRc.server[serverIndex]);
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * @name update
     * @return Observable
     * @params Array<string>
     */
    ServerCrud.prototype.update = function (params) {
        var _this = this;
        if (!this.userRc || !this.userRc.server) {
            return rxjs_1.Observable.throw(new Error('no servers available'));
        }
        this._scenario = UPDATE;
        var oldId = null;
        if (!params || !params.length) {
            /**
             * get server list
             */
            return this._updateServerChooserPrompt()
                .filter(function (answers) {
                return answers.server !== _this.server.i18n.TAKE_ME_OUT;
            })
                .map(function (answers) {
                return _this._copy(answers.server);
            })
                .exhaustMap(function (serverId) {
                oldId = _this._copy(serverId);
                return _this._updateWithId(serverId);
            })
                .exhaustMap(function (answers) {
                var serverIndex = lodash_1.findIndex(_this.userRc.server, { id: oldId });
                _this.userRc.server[serverIndex] = new ServerModelRc_1.ServerModelRc(answers);
                return _this.userRc.updateRcFile().do(function () {
                    DebugLog_1.DebugLog.info('Server is updated');
                });
            });
        }
        oldId = this._copy(params[0]);
        return this._updateWithId(params[0])
            .exhaustMap(function (answers) {
            var serverIndex = lodash_1.findIndex(_this.userRc.server, { id: oldId });
            _this.userRc.server[serverIndex] = new ServerModelRc_1.ServerModelRc(answers);
            return _this.userRc.updateRcFile()
                .do(function () {
                DebugLog_1.DebugLog.info('Server is updated');
            });
        });
    };
    Object.defineProperty(ServerCrud.prototype, "clientcertConfig", {
        get: function () {
            var _this = this;
            return [
                {
                    type: 'input',
                    name: 'pfx',
                    message: 'Client Certificate (file path, enter to clear) :',
                    validate: function (value) {
                        if (value && !fs.existsSync(value)) {
                            DebugLog_1.DebugLog.error(new Error(_this.server.i18n.SERVER_CLIENTCERT_NOT_FOUND));
                            return false;
                        }
                        return true;
                    }
                },
                {
                    type: 'password',
                    name: 'passphrase',
                    message: 'Passphrase (enter for none) :',
                    when: function (answers) { return !!answers['pfx']; }
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * @name clientcert
     */
    ServerCrud.prototype.clientcert = function (params) {
        var _this = this;
        if (params === void 0) { params = []; }
        if (!this.userRc || !this.userRc.server) {
            return rxjs_1.Observable.throw(new Error('no servers available'));
        }
        this._scenario = CLIENTCERT;
        var serverId = params[0];
        if (!serverId) {
            // get server list
            return this._updateServerChooserPrompt()
                .filter(function (answers) {
                return answers.server !== _this.server.i18n.TAKE_ME_OUT;
            })
                .map(function (answers) {
                return _this._copy(answers.server);
            })
                .exhaustMap(function (serverId) {
                params[0] = serverId;
                return _this.clientcert(params);
            });
        }
        var server = this.userRc.getServer(serverId);
        if (!server) {
            return rxjs_1.Observable.throw(new Error('unknown server: ' + serverId));
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(this.clientcertConfig)).mergeMap(function (answers) {
            var pfx = answers['pfx'];
            if (!pfx) {
                return rxjs_1.Observable.of(undefined);
            }
            return RxFs_1.RxFs.readFile(pfx).map(function (pfx) {
                return new CertModelRc_1.CertModelRc(_.defaults({
                    pfx: pfx
                }, answers));
            });
        }).filter(function (clientCertificate) {
            return !_.isEqual(_this._copy(server.clientCertificate), _this._copy(clientCertificate));
        }).map(function (clientCertificate) {
            server.clientCertificate = clientCertificate;
            return server;
        }).mergeMap(function (server) {
            return _this.server.relutionSDK.login(server, true);
        }).takeLast(1).mergeMap(function () {
            return _this.userRc.updateRcFile();
        });
    };
    return ServerCrud;
}());
exports.ServerCrud = ServerCrud;
//# sourceMappingURL=ServerCrud.js.map