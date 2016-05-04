"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./../utility/Command');
var Validator_1 = require('./../utility/Validator');
var ServerModelRc_1 = require('./../utility/ServerModelRc');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
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
        this.addConfig = [
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
        this.commandDispatcher.subscribe(this.init.bind(this));
    }
    Server.prototype.list = function (name) {
        console.log(this.config);
    };
    Server.prototype.create = function (name) {
        console.log('create');
    };
    Server.prototype.rm = function (name) {
        console.log('rm');
    };
    /**
     * the add scenario
     * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/input.js
     */
    Server.prototype.addServerPrompt = function (name) {
        console.log('addServerPrompt');
        //for testing
        if (this.debug) {
            this.addConfig[1]['default'] = function () { return 'https://coredev.com:1234'; };
            this.addConfig[2]['default'] = function () { return 'pascal'; };
            this.addConfig[3]['default'] = function () { return 'blubber'; };
        }
        //set default name
        if (name && name.length && name.match(Validator_1.Validator.stringNumberPattern)) {
            this.addConfig[0]['default'] = function () { return name.trim(); };
        }
        else {
            console.log('name is not correct');
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(this.addConfig));
    };
    /**
     * add method
     */
    Server.prototype.add = function (params) {
        var _this = this;
        console.log(params);
        var name = '';
        if (params && params.length) {
            name = params[0].trim();
        }
        console.log('add', name);
        this.addServerPrompt(name).subscribe(function (answers) {
            console.log(answers);
            var model = new ServerModelRc_1.ServerModelRc(answers);
            _this.userRc.addServer(model).subscribe(function (isSaved) {
                console.log(isSaved);
            });
        });
        // return Observable.create((observer:any) => {
        // }).subscribe((answers:any) => {
        //   console.log(answers);
        // });
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map