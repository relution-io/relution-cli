"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var UserRc_1 = require('./UserRc');
var Table_1 = require('./Table');
var inquirer = require('inquirer');
var username = require('username');
/**
 *
 * ```javascript
 * import {Command} from './../utility/Command';
 * export class Server extends Command {
 *   constructor() {
 *    super('server');
 *    this.commandDispatcher.subscribe(this.init.bind(this));
 *   }
 * }
 * ```
 */
var QUIT = 'quit';
var Command = (function () {
    function Command(name) {
        var _this = this;
        this.directMode = false;
        this.userRc = new UserRc_1.UserRc();
        this.inquirer = inquirer;
        this.reserved = ['help', QUIT];
        this.table = new Table_1.Table();
        this.tableHeader = ['Command', 'Subcommand', 'Param/s', 'Description'];
        if (!name) {
            throw Error('Command need a name');
        }
        this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        });
        this.name = name;
    }
    /**
     * preload data
     */
    Command.prototype.preload = function () {
        var _this = this;
        return this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                return _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        });
    };
    /**
     * @description shows a list of Available commands form the Command like this
     * ```bash
     * ┌─────────┬────────────┬─────────┬────────────────────────────────┐
       │ command │ subcommand │ params  │ description                    │
       │ server  │ create     │ <$name> │ add a new BaaS Server          │
       │ server  │ list       │ <$name> │ list all available BaaS Server │
       │ server  │ rm         │ <$name> │ remove a server form the list  │
       │ server  │ help       │ --      │ List the Server Command        │
       │ server  │ quit       │ --      │ Exit To Home                   │
       └─────────┴────────────┴─────────┴────────────────────────────────┘
     * ```
     */
    Command.prototype.help = function (asArray) {
        var _this = this;
        if (asArray === void 0) { asArray = false; }
        //console.log('help', asArray);
        return rxjs_1.Observable.create(function (observer) {
            var content = [['', '', '', '']];
            //[this.name, '', '', '']
            var i = 0;
            _this.flatCommands().forEach(function (commandName) {
                var command = [chalk.green(_this.name), chalk.cyan(commandName)];
                if (_this.commands[commandName]) {
                    if (commandName !== 'relution') {
                        // && this.reserved.indexOf(commandName) === -1
                        if (_this.commands[commandName].vars) {
                            var vars = Object.keys(_this.commands[commandName].vars);
                            vars.forEach(function (param) {
                                command.push(chalk.yellow("<$" + param + ">"));
                            });
                        }
                        else {
                            command.push('--');
                        }
                        command.push(_this.commands[commandName].description || '--');
                        content.push(command);
                        i++;
                    }
                }
            });
            content.push(['', '', '', '']);
            if (!asArray) {
                observer.next(_this.table.sidebar(_this.tableHeader, content));
            }
            else {
                observer.next(content);
            }
            observer.complete();
        });
    };
    Command.prototype.init = function (args, back) {
        var _this = this;
        console.log('Command.ts', args);
        debugger;
        this._parent = back;
        //directly
        if (args[0] === this.name && args.length === 1) {
            return this.showCommands().subscribe(function (answers) {
                // console.log('answers', answers);
                return _this.init(answers[_this.name], _this._parent);
            });
        }
        if (args.length >= 1 && args[0] === this.name && args[1] === QUIT) {
            return this._parent.home();
        }
        //we have this method maybe help we get ['server', 'help', 'param']
        //build this.help('param');
        // console.log('this[args[0]]', this[args[0]]);
        if (this[args[0]]) {
            // console.log('args.length > 1', args.length > 1);
            if (args.length > 1) {
                var params = this._copy(args);
                params.splice(0, 1); //remove 'update' or 'create'
                return this[args[0]](params);
            }
            return this[args[0]]();
        }
        // console.log('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
        //server add
        if (args[0] === this.name && this[args[1]]) {
            if (args.length > 2) {
                // console.log('args.length > 2', args.length > 2);
                var subArgs = this._copy(args);
                subArgs.splice(0, 2);
                return this[args[1]](subArgs);
            }
            return this[args[1]]().subscribe(function (log) {
                console.log(log);
            }, function (e) {
                console.error(e);
                process.exit();
            }, function () {
                _this.init([_this.name], _this._parent);
            });
        }
    };
    Command.prototype._copy = function (org) {
        return JSON.parse(JSON.stringify(org));
    };
    Command.prototype.flatCommands = function () {
        return Object.keys(this.commands);
    };
    Command.prototype.setupCommandsForList = function () {
        var _this = this;
        var temp = [];
        this.flatCommands().forEach(function (command) {
            temp.push({
                name: command,
                value: [_this.name, command]
            });
        });
        return temp;
    };
    Command.prototype.showCommands = function (message, type) {
        if (message === void 0) { message = "Please Choose Your Option: "; }
        if (type === void 0) { type = 'list'; }
        var questions = [
            {
                name: this.name,
                message: message,
                type: type,
                choices: this.setupCommandsForList(),
                filter: function (str) {
                    return str;
                }
            }
        ];
        return rxjs_1.Observable.create(function (observer) {
            inquirer.prompt(questions).then(function (answers) {
                observer.next(answers);
                observer.complete();
            });
        });
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map