"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var Translation_1 = require('./../../utility/Translation');
var ServerModelRc_1 = require('./../../utility/ServerModelRc');
var lodash_1 = require('lodash');
var inquirer = require('inquirer');
/**
 * add a Server to Config from the UserRc and store it
 */
var ServerCrud = (function () {
    function ServerCrud(userRc) {
        this.inquirer = inquirer;
        this.userRc = userRc;
    }
    Object.defineProperty(ServerCrud.prototype, "addConfig", {
        get: function () {
            return [
                {
                    type: 'input',
                    name: 'id',
                    message: 'Server Name',
                    validate: function (value) {
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
                    message: 'Enter the server url (http://....)',
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
                    message: 'Enter your username',
                    validate: function (value) {
                        return Validator_1.Validator.notEmptyValidate(value);
                    }
                },
                {
                    type: 'password',
                    name: 'password',
                    message: 'Enter your Password',
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
            throw new Error("Server " + server.id + " already exist please use update!");
        }
        if (server.default) {
            this.falseyDefaultServer();
        }
        if (update) {
            var pos = lodash_1.findIndex(this.userRc.config.server, server.id);
            if (pos) {
                this.userRc.config.server[pos] = server.toJson();
                this.userRc.server[pos] = server.toJson();
            }
        }
        else {
            this.userRc.server.push(server);
            this.userRc.config.server.push(server.toJson());
        }
        return this.userRc.updateRcFile();
    };
    ServerCrud.prototype.setDefaults = function (defaults) {
        var myPrompt = this.addConfig;
        myPrompt.forEach(function (item) {
            console.log(item, defaults);
            item.default = function () { return defaults[item.name]; };
            item.message += Translation_1.Translation.PRESS_ENTER;
        });
        return myPrompt;
    };
    ServerCrud.prototype.createNewServer = function (id) {
        //console.log('addServerPrompt');
        //for testing
        if (!id) {
            this.setDefaults({
                id: id,
                serverUrl: 'https://coredev.com:1234',
                userName: 'pascal',
                password: 'foo',
                default: this.userRc.config.server.length ? false : true
            });
        }
        //set default id
        if (id && id.length && id.match(Validator_1.Validator.stringNumberPattern)) {
            this.addConfig[0]['default'] = function () { return id.trim(); };
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(this.addConfig));
    };
    /**
     * create a prompt like this
     * ```json
     * [ { type: 'list',
      message: 'Select Server/s',
      name: 'server',
      choices:
       [ 'cordev',
         'cordev2',
         'local dev',
         'ibx',
         't.beckmann',
         'beckmann new',
         'mdmdev2',
         'Take me out of here' ],
      validate: [Function] } ]
     * ```
     */
    ServerCrud.prototype.serverListPrompt = function (name, type, message) {
        if (name === void 0) { name = 'server'; }
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = 'Select Server/s'; }
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
                        return 'You must choose at least one server.';
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
        return rxjs_1.Observable.create(function (observer) {
            _this.deletePrompt().subscribe(function (answers) {
                var all = [];
                if (answers.server.indexOf(Translation_1.Translation.TAKE_ME_OUT) !== -1) {
                    if (answers.server.length > 1) {
                        console.log("I see you choose servers and \"Take me out of here\" so you get out without remove");
                    }
                    observer.complete();
                }
                answers.server.forEach(function (id) {
                    all.push(_this.removeServer(id));
                });
                rxjs_1.Observable.forkJoin(all).subscribe({ complete: function () {
                        observer.complete();
                    } });
            });
        });
    };
    ServerCrud.prototype.add = function (params) {
        var _this = this;
        var name = '';
        if (params && params.length) {
            name = params[0].trim();
        }
        return rxjs_1.Observable.create(function (observer) {
            _this.createNewServer(name).subscribe(function (answers) {
                _this.addServer(new ServerModelRc_1.ServerModelRc(answers)).subscribe(function () {
                    observer.complete();
                });
            });
        });
    };
    ServerCrud.prototype.updateServerChooserPrompt = function (id) {
        var prompt = this.serverListPrompt('server', 'list', 'choose a Server');
        console.log('prompt', prompt);
        if (id && id.length) {
            prompt.default = function () { return id; };
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    ServerCrud.prototype.updateServer = function (prompt, oldServerId) {
        var _this = this;
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt)).subscribe(function (answers) {
            var serverIndex = lodash_1.findIndex(_this.userRc.config.server, { id: oldServerId });
            _this.userRc.config.server[serverIndex] = answers;
            return _this.userRc.updateRcFile();
        });
    };
    ServerCrud.prototype.updateWithoutId = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _this.updateServerChooserPrompt().subscribe(function (answers) { observer.next(_this._copy(answers.server)); }, function (e) { return console.error(e); }, function () { return observer.complete; });
        });
    };
    ServerCrud.prototype.updateWithId = function (id) {
        var serverId = this._copy(id);
        var serverIndex = lodash_1.findIndex(this.userRc.config.server, { id: serverId });
        var prompt = this.setDefaults(this.userRc.config.server[serverIndex]);
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * ```javascript
     * const crudHelper = new ServerCrud(userRc);
     * crudHelper.update(params).subscribe(
        () => {
  
        },
        (e:any) => {
          console.error(e);
        },
        () => {
          console.log('server added');
        }
      );
     * ```
     */
    ServerCrud.prototype.update = function (params) {
        var _this = this;
        if (!this.userRc && !this.userRc.config && !this.userRc.config.server) {
            return rxjs_1.Observable.throw('no server are available');
        }
        if (!params || !params.length) {
            return rxjs_1.Observable.create(function (observer) {
                _this.updateWithoutId().subscribe(function (serverId) {
                    if (serverId === Translation_1.Translation.TAKE_ME_OUT) {
                        observer.complete();
                    }
                    //maybe the user rename the server
                    var oldId = _this._copy(serverId);
                    _this.updateWithId(serverId).subscribe(function (answers) {
                        var serverIndex = lodash_1.findIndex(_this.userRc.config.server, { id: oldId });
                        _this.userRc.config.server[serverIndex] = answers;
                        _this.userRc.updateRcFile().subscribe(function () { return observer.complete; });
                    }, function (e) { return console.error(e); }, function () {
                        observer.complete();
                    });
                });
            });
            ;
        }
        var serverId = params[0];
        return rxjs_1.Observable.from(this.updateWithId(serverId));
    };
    return ServerCrud;
}());
exports.ServerCrud = ServerCrud;
//# sourceMappingURL=ServerCrud.js.map