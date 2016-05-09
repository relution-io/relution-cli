"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./../utility/Command');
var Validator_1 = require('./../utility/Validator');
var ServerCrud_1 = require('./server/ServerCrud');
var lodash_1 = require('lodash');
var PRESS_ENTER = ' or press enter';
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
        this.tableHeader = ['Name', 'Server url', 'Default', 'Username'];
        this.debug = true;
        this.commands = {
            add: {
                description: 'add a new BaaS Server',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            list: {
                description: 'list all available BaaS Server',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            update: {
                description: 'update a exist server from the Server list',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            rm: {
                description: 'remove a server form the list',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: 'List the Server Command'
            },
            quit: {
                description: 'Exit To Home'
            }
        };
    }
    Server.prototype.preload = function () {
        var _this = this;
        return this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                return _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        }, function (e) {
            console.error(e);
        }, function () {
            _this.crudHelper = new ServerCrud_1.ServerCrud(_this.userRc);
        });
    };
    Object.defineProperty(Server.prototype, "addConfig", {
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
    /**
     * list available Server
     */
    Server.prototype.list = function (name) {
        var _this = this;
        var empty = ['', '', '', ''];
        var content = [empty];
        var _parts = lodash_1.partition(this.userRc.server, function (server) {
            return server.default;
        });
        if (_parts[1]) {
            _parts[1] = lodash_1.orderBy(_parts[1], ['id'], ['asc']);
        }
        var _list = lodash_1.concat(_parts[0], _parts[1]);
        _list.forEach(function (model) {
            content.push(model.toTableRow(), empty);
        });
        return rxjs_1.Observable.create(function (observer) {
            observer.next(_this.table.sidebar(_this.tableHeader, content));
            observer.complete();
        });
    };
    /**
     * update existing Server
     */
    Server.prototype.update = function (params) {
        var _this = this;
        console.log('update');
        this.crudHelper.update(params).subscribe(function () {
        }, function (e) {
            console.error(e);
        }, function () {
            return _this.init([_this.name], _this._parent);
        });
    };
    /**
     * Delete a Server from the RC file Object
     */
    Server.prototype.rm = function (id) {
        var _this = this;
        this.crudHelper.rm(id).subscribe(function () {
        }, function (e) {
            console.error(e);
        }, function () {
            return _this.init([_this.name], _this._parent);
        });
    };
    /**
     * add method
     */
    Server.prototype.add = function (params) {
        var _this = this;
        console.log(params);
        return this.crudHelper.add(params).subscribe(function () {
        }, function (e) {
            console.error(e);
        }, function () {
            console.log('hi');
            return _this.init([_this.name], _this._parent);
        });
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map