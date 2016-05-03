"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('@reactivex/rxjs');
var Command_1 = require('./../utility/Command');
var Validator_1 = require('./../utility/Validator');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
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
                name: 'name',
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
                name: 'baseUrl',
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
                name: 'username',
                message: 'Enter your username',
                validate: Validator_1.Validator.notEmptyValidate('Username')
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your Password',
                validate: Validator_1.Validator.notEmptyValidate('Password')
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
    Server.prototype.addServerPrompt = function (name) {
        if (name && name.length) {
            this.addConfig[0]['value'] = name.trim();
        }
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(this.addConfig));
    };
    Server.prototype.add = function (name) {
        console.log(__filename);
        // .subscribe(
        //   (answers: Object) => {
        //     console.log('add answers', answers);
        //     return answers;
        //   },
        //   (e: ErrorConstructor) => {
        //     return e;
        //   }, () => {
        //     console.log('completed');
        //   }
        // );
        this.addServerPrompt(name);
        // .subscribe((a:any) => {
        //   console.log(a);
        // });
        return rxjs_1.Observable.create(function (observer) {
            observer.next(1000);
        });
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map