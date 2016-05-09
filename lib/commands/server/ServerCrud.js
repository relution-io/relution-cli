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
    ServerCrud.prototype.add = function (params) {
        var _this = this;
        var name = '';
        if (params && params.length) {
            name = params[0].trim();
        }
        return rxjs_1.Observable.create(function (observer) {
            _this.createNewServer(name).subscribe(function (answers) {
                console.log('answers', answers);
                _this.addServer(new ServerModelRc_1.ServerModelRc(answers)).subscribe(function () {
                    console.log('done');
                    observer.complete();
                });
            });
        });
    };
    return ServerCrud;
}());
exports.ServerCrud = ServerCrud;
//# sourceMappingURL=ServerCrud.js.map