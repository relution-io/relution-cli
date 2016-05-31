"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var Translation_1 = require('./../../utility/Translation');
var ServerModelRc_1 = require('./../../models/ServerModelRc');
var lodash_1 = require('lodash');
var inquirer = require('inquirer');
var DebugLog_1 = require('./../../utility/DebugLog');
/**
 * add a Server to Config from the UserRc and store it
 */
var ADD = 'add';
var UPDATE = 'update';
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
                        var test = lodash_1.findIndex(_this.userRc.config.server, { id: value });
                        if (!test && _this._scenario === ADD) {
                            DebugLog_1.DebugLog.error(new Error(Translation_1.Translation.ALREADY_EXIST(value)));
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
        return JSON.parse(JSON.stringify(org));
    };
    /**
     * toggle all server to default false
     */
    ServerCrud.prototype.falseyDefaultServer = function () {
        var _this = this;
        this.userRc.server = [];
        this.userRc.config.server.forEach(function (server) {
            if (server.default) {
                server.default = false;
            }
            _this.userRc.server.push(new ServerModelRc_1.ServerModelRc(server));
        });
    };
    /**
     * cheack if the server id already exist
     */
    ServerCrud.prototype.isUnique = function (server) {
        var isUnique = true;
        this.userRc.config.server.forEach(function (cserver) {
            if (cserver.id === server.id) {
                isUnique = false;
            }
        });
        return isUnique;
    };
    /**
     * remove a server from the list
     */
    ServerCrud.prototype.removeServer = function (id) {
        var pos = lodash_1.findIndex(this.userRc.config.server, { id: id });
        if (pos !== -1) {
            this.userRc.config.server.splice(pos, 1);
            return this.userRc.updateRcFile();
        }
        throw Error(id + " not exist!");
    };
    /**
     * add a server to the config server list.
     */
    ServerCrud.prototype.addServer = function (server, update) {
        if (update === void 0) { update = false; }
        if (!this.isUnique(server) && !update) {
            throw new Error(Translation_1.Translation.ALREADY_EXIST(server.id, 'Server'));
        }
        if (server.default) {
            this.falseyDefaultServer();
        }
        if (update) {
            var pos = lodash_1.findIndex(this.userRc.config.server, server.id);
            if (pos) {
                this.userRc.config.server[pos] = server.toJson();
                this.userRc.server[pos] = server;
            }
        }
        else {
            this.userRc.config.server.push(server.toJson());
            this.userRc.server.push(server);
        }
        return this.userRc.updateRcFile();
    };
    ServerCrud.prototype.setDefaults = function (defaults) {
        var myPrompt = this.addConfig;
        if (defaults) {
            myPrompt.forEach(function (item) {
                item.default = function () { return defaults[item.name]; };
                item.message += Translation_1.Translation.PRESS_ENTER;
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
        if (name === void 0) { name = 'server'; }
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = 'Select Server(s) :'; }
        var choices = lodash_1.map(this.userRc.config.server, 'id');
        choices.push(Translation_1.Translation.TAKE_ME_OUT);
        return [
            {
                type: type,
                message: message,
                name: name,
                choices: choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return Translation_1.Translation.YOU_MOUST_CHOOSE('Server');
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
            if (answers.server.indexOf(Translation_1.Translation.TAKE_ME_OUT) !== -1 && answers.server.length > 1) {
                DebugLog_1.DebugLog.warn("I see you choose servers and \"Take me out of here\" so you get out without remove");
                return false;
            }
            return true;
        })
            .filter(function (answers) {
            return answers.server.indexOf(Translation_1.Translation.TAKE_ME_OUT) === -1;
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
            return _this.server.relutionSDK.login(model)
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
        var serverIndex = lodash_1.findIndex(this.userRc.config.server, { id: serverId });
        var prompt = this.setDefaults(this.userRc.config.server[serverIndex]);
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * @name update
     * @return Observable
     * @params Array<string>
     */
    ServerCrud.prototype.update = function (params) {
        var _this = this;
        if (!this.userRc && !this.userRc.config && !this.userRc.config.server) {
            return rxjs_1.Observable.throw(new Error('no server are available'));
        }
        this._scenario = UPDATE;
        var oldId = null;
        if (!params || !params.length) {
            /**
             * get server list
             */
            return this._updateServerChooserPrompt()
                .filter(function (answers) {
                return answers.server !== Translation_1.Translation.TAKE_ME_OUT;
            })
                .map(function (answers) {
                return _this._copy(answers.server);
            })
                .exhaustMap(function (serverId) {
                oldId = _this._copy(serverId);
                return _this._updateWithId(serverId);
            })
                .exhaustMap(function (answers) {
                var serverIndex = lodash_1.findIndex(_this.userRc.config.server, { id: oldId });
                _this.userRc.config.server[serverIndex] = answers;
                return _this.userRc.updateRcFile().do(function () {
                    DebugLog_1.DebugLog.info('Server is updated');
                });
            });
        }
        oldId = this._copy(params[0]);
        return this._updateWithId(params[0])
            .exhaustMap(function (answers) {
            var serverIndex = lodash_1.findIndex(_this.userRc.config.server, { id: oldId });
            _this.userRc.config.server[serverIndex] = answers;
            return _this.userRc.updateRcFile()
                .do(function () {
                DebugLog_1.DebugLog.info('Server is updated');
            });
        });
    };
    return ServerCrud;
}());
exports.ServerCrud = ServerCrud;
//# sourceMappingURL=ServerCrud.js.map