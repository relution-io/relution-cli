"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var Validator_1 = require('./../utility/Validator');
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        _super.call(this, 'server');
        this.commands = {
            create: {
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
        this.config = [
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
        this.reserved = ['help', 'quit'];
        this.commandDispatcher.subscribe(this.init.bind(this));
    }
    Server.prototype.init = function (args) {
        _super.prototype.init.call(this, args);
        if (args.length === 1) {
            return this.help();
        }
        else if (args.length > 1 && this.reserved.indexOf(args[1]) === -1) {
            var vars = this._copy(args);
            vars.splice(0, 1);
            return this[args[1]](vars);
        }
        else if (args.length > 1 && this.reserved.indexOf(args[1]) !== -1) {
            //help() quit()
            return this[args[1]]();
        }
    };
    Server.prototype.list = function (name) {
        console.log(this.config);
    };
    Server.prototype.create = function (name) {
        console.log('create');
    };
    Server.prototype.rm = function (name) {
        console.log('rm');
    };
    return Server;
}(Command_1.Command));
exports.Server = Server;
//# sourceMappingURL=Server.js.map