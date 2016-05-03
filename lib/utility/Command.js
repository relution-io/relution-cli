"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var UserRc_1 = require('./UserRc');
var Table_1 = require('./Table');
var chalk = require('chalk');
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
var Command = (function () {
    function Command(name) {
        var _this = this;
        this.directMode = false;
        this.inquirer = inquirer;
        this.reserved = ['help', 'quit'];
        this.tableHeader = ['Command', 'Subcommand', 'Param/s', 'Description'];
        if (!name) {
            throw Error('Command need a name');
        }
        this.table = new Table_1.Table();
        this.userRc = new UserRc_1.UserRc();
        console.log(JSON.stringify(username, null, 2));
        username().then(function (username) {
            _this.username = username;
        });
        this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        });
        this.name = name;
        this.commandDispatcher = rxjs_1.Observable.create(function (observer) {
            if (process.argv.length <= 2) {
                observer.complete();
            }
            var args = _this._copy(process.argv);
            args.splice(0, 2);
            observer.next(args);
            observer.complete();
        })
            .catch(function (e) {
            throw new Error(e);
        })
            .filter(function (data) {
            return data[0] === _this.name;
        });
    }
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
    Command.prototype.init = function (args) {
        var _this = this;
        console.log('Command.ts', args);
        //directly
        if (args[0] === this.name && args.length === 1) {
            return this.showCommands().subscribe(function (answers) {
                return _this.init(answers);
            });
        }
        if (this[args[0]]) {
            if (args.length > 1) {
                args.splice(0, 1);
                return this[args[0]](args);
            }
            return this[args[0]]();
        }
        //server add
        if (args[0] === this.name && this[args[1]]) {
            if (args.length > 2) {
                args.splice(0, 2);
                return this[args[1]](args);
            }
            return this[args[1]]();
        }
        //not my command!
        return null;
    };
    Command.prototype._copy = function (org) {
        return JSON.parse(JSON.stringify(org));
    };
    /**
     * exit the app
     */
    Command.prototype.quit = function () {
        console.log("Have a Great Day! " + this.username);
        process.exit();
    };
    Command.prototype.flatCommands = function () {
        return Object.keys(this.commands);
    };
    Command.prototype.setupCommandsForList = function () {
        var temp = [];
        this.flatCommands().forEach(function (command) {
            temp.push({
                name: command,
                value: [command]
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
                    console.log(str);
                    return str.toLowerCase();
                }
            }
        ];
        return rxjs_1.Observable.fromPromise(inquirer.prompt(questions, function (answers) {
            return answers;
        }));
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map