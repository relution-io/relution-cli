"use strict";
var fs = require('fs');
var _ = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var ServerModelRc_1 = require('./../../models/ServerModelRc');
var lodash_1 = require('lodash');
var inquirer = require('inquirer');
var DebugLog_1 = require('./../../utility/DebugLog');
var CertModelRc_1 = require('../../models/CertModelRc');
var RxFs_1 = require('../../utility/RxFs');
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
                    message: 'Server name :',
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
                    message: 'Enter the server url (https://....) :',
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
                    message: 'Enter your password :',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'confirm',
                    name: 'default',
                    default: false,
                    message: 'Set as default server ?'
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
        choices.push(this.server.i18n.CANCEL);
        return [
            {
                type: type,
                message: message,
                name: name,
                choices: choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return _this.server.i18n.YOU_MUST_CHOOSE('Server');
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
            if (answers.server.indexOf(_this.server.i18n.CANCEL) !== -1 && answers.server.length > 1) {
                DebugLog_1.DebugLog.warn("I see you choose \"servers\" and \"" + _this.server.i18n.CANCEL + "\" so you get out without remove.");
                return false;
            }
            return true;
        })
            .filter(function (answers) {
            return answers.server.indexOf(_this.server.i18n.CANCEL) === -1;
        })
            .exhaustMap(function (answers) {
            answers.server.forEach(function (serverId) {
                all.push(_this.removeServer(serverId));
            });
            return rxjs_1.Observable.forkJoin(all)
                .do(function () {
                DebugLog_1.DebugLog.info("Server " + answers.server.toString() + " removed.");
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
                return _this.server.debuglog.info("logged in as " + (userResp.givenName ? userResp.givenName + ' ' + userResp.surname : userResp.name));
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
                return answers.server !== _this.server.i18n.CANCEL;
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
                return answers.server !== _this.server.i18n.CANCEL;
            })
                .map(function (answers) {
                return _this._copy(answers.server);
            })
                .exhaustMap(function (id) {
                params[0] = id;
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
            return RxFs_1.RxFs.readFile(pfx.toString()).map(function (pfxContent) {
                return new CertModelRc_1.CertModelRc(_.defaults({
                    pfx: pfxContent
                }, answers));
            });
        }).filter(function (clientCertificate) {
            return !_.isEqual(_this._copy(server.clientCertificate), _this._copy(clientCertificate));
        }).map(function (clientCertificate) {
            server.clientCertificate = clientCertificate;
            return server;
        }).mergeMap(function (s) {
            return _this.server.relutionSDK.login(s, true);
        }).takeLast(1).mergeMap(function () {
            return _this.userRc.updateRcFile();
        });
    };
    return ServerCrud;
}());
exports.ServerCrud = ServerCrud;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyQ3J1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2ZXIvU2VydmVyQ3J1ZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFDekIsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0MsMEJBQXdCLDJCQUEyQixDQUFDLENBQUE7QUFDcEQsOEJBQW9ELDhCQUE4QixDQUFDLENBQUE7QUFFbkYsdUJBQTZCLFFBQVEsQ0FBQyxDQUFBO0FBRXRDLElBQVksUUFBUSxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ3JDLHlCQUF1QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xELDRCQUEwQiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3JELHFCQUFtQixvQkFBb0IsQ0FBQyxDQUFBO0FBR3hDOztHQUVHO0FBQ0gsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN4QixJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFFaEM7SUFNRSxvQkFBWSxVQUFrQjtRQUh2QixhQUFRLEdBQVEsUUFBUSxDQUFDO1FBT3hCLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFIOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFHTywrQkFBVSxHQUFsQjtRQUNFLElBQUksTUFBTSxHQUFHO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSwyREFBMkQ7U0FDckUsQ0FBQztRQUNGLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxN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