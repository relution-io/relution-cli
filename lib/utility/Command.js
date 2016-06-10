"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var UserRc_1 = require('./UserRc');
var Table_1 = require('./Table');
var Translation_1 = require('./Translation');
var DebugLog_1 = require('./DebugLog');
var RelutionSDK_1 = require('./RelutionSDK');
var inquirer = require('inquirer');
/**
 *
 * Important All Subcommand have to return an Observable
 * ##### Add a new Command
 *
 *```javascript
 *
 * import {Command} from './../utility/Command';
 *
 * export MyCommand extends Command{
 *  constructor(){
 *    super('myCommand');
 *  }
 *
 *  public commmands = {
 *    subcommand: {
 *      label: 'My Label', // is shown in the showCommands list
 *      description: 'My own Command', // is shown in the help as description
 *      method: 'mySubCommandMethod', // you can set the method if you want default MyCommand.subcommand()
 *      when: (): boolean => { // disabled ?
 *        return true;
 *      },
 *      why: () => { // why is it disabled
 *        return `is disabled why`;
 *      },
 *      vars: { // allow params on this subcommand
 *        name: {
 *          pos: 0
 *        }
 *      }
 *    }
 *  }
 * }
 *
 * public mySubCommandMethod(name?:string): Observable<empty> {
 *  return Observable.empty();
 * }
 *```
 */
var Command = (function () {
    function Command(name) {
        var _this = this;
        this.directMode = false;
        this.userRc = new UserRc_1.UserRc();
        this.inquirer = inquirer;
        this.i18n = Translation_1.Translation;
        this.log = DebugLog_1.DebugLog;
        this.reserved = ['help', this.i18n.QUIT];
        this.table = new Table_1.Table();
        this.relutionSDK = new RelutionSDK_1.RelutionSdk();
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
        return this.userRc.rcFileExist().do(function (exist) {
            // if (this.name === 'env') {
            // console.log(this.name);
            // }
            if (exist) {
                _this.userRc.streamRc().do(function (data) {
                    _this.config = data;
                });
            }
        }, function (e) {
            console.error(e);
        });
    };
    Command.prototype.home = function () {
        return this.init([this.name], this._parent);
    };
    Command.prototype.back = function () {
        return this.init([this.name], this._parent);
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
       │ server  │ back       │ --      │ Exit To Home                   │
       └─────────┴────────────┴─────────┴────────────────────────────────┘
     * ```
     */
    Command.prototype.help = function (asArray) {
        var _this = this;
        if (asArray === void 0) { asArray = false; }
        // this.log.info('help', asArray);
        return rxjs_1.Observable.create(function (observer) {
            var content = [['', '', '', '']];
            // [this.name, '', '', '']
            var i = 0;
            _this.flatCommands().forEach(function (commandName) {
                var color = _this.commandIsDisabled(_this.commands[commandName], commandName) ? 'red' : 'green';
                var name = _this.commands[commandName].label ? _this.commands[commandName].label : commandName;
                var command = [chalk[color](_this.name), chalk.cyan(name)];
                if (_this.commands[commandName]) {
                    if (commandName !== 'relution') {
                        //  && this.reserved.indexOf(commandName) === -1
                        if (_this.commands[commandName].vars) {
                            var vars_1 = Object.keys(_this.commands[commandName].vars);
                            var params_1 = '';
                            vars_1.forEach(function (param, index) {
                                params_1 += chalk.yellow("<$" + param + ">");
                                // this.log.info(index, vars.length, index !== (vars.length -1));
                                if (index !== (vars_1.length - 1)) {
                                    params_1 += ' ';
                                }
                            });
                            if (params_1) {
                                command.push(params_1);
                            }
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
                observer.next(_this.table.sidebar(content, _this.i18n.GENERAL_HELP_TABLEHEADERS));
            }
            else {
                observer.next(content);
            }
            observer.complete();
        });
    };
    Command.prototype.commandIsDisabled = function (command, name) {
        if (command.when && !command.when()) {
            var message = command.why ? command.why() : "is not enabled";
            this.log.info("\"" + chalk.magenta(this.name) + " " + chalk.magenta(name) + "\" is disabled because: " + message);
            return true;
        }
        return false;
    };
    Command.prototype.init = function (args, back) {
        var _this = this;
        // this.log.info(`Command.ts ${this.name}`, args);
        this._parent = back;
        var myObservable;
        // directly
        if (args[0] === this.name && args.length === 1) {
            // is the help or command without any params
            return this.showCommands().subscribe(function (answers) {
                return _this.init(answers[_this.name], _this._parent);
            }, function (e) { return _this.log.error(e); });
        }
        if (args.length >= 1 && args[0] === this.name && args[1] === Translation_1.Translation.QUIT) {
            // back to Tower
            return this._parent.home();
        }
        // we have this method maybe help we get ['server', 'help', 'param']
        // build this.help('param');
        // this.log.info('this[args[0]]', this[args[0]]);
        if (this[args[0]]) {
            // this.log.info('args.length > 1', args.length > 1);
            if (args.length > 1) {
                var params = this._copy(args);
                params.splice(0, 1); // remove 'update' or 'create'
                myObservable = this[args[0]](params);
            }
            else {
                myObservable = this[args[0]]();
            }
        }
        // this.log.info('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
        // server add
        if (args[0] === this.name && this[args[1]]) {
            if (args.length > 2) {
                this.log.info('args.length > 2', args.length > 2);
                var subArgs = this._copy(args);
                subArgs.splice(0, 2);
                myObservable = this[args[1]](subArgs);
            }
            else {
                myObservable = this[args[1]]();
            }
        }
        return myObservable.subscribe(function (log) {
            if (log && log.length) {
                _this.log.log('cyan', log);
            }
        }, function (e) { return _this.log.error(e); }, function () {
            _this.home();
        });
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
                disabled: _this.commandIsDisabled(_this.commands[command], command),
                name: _this.commands[command].label ? _this.commands[command].label : command,
                value: [_this.name, _this.commands[command].method ? _this.commands[command].method : command]
            });
        });
        return temp;
    };
    Command.prototype.showCommands = function (message, type) {
        if (message === void 0) { message = "Please Choose Your " + this.name + " Command: "; }
        if (type === void 0) { type = 'list'; }
        // this.log.info(new Date().getTime());
        if (!this.commands) {
            return rxjs_1.Observable.throw(new Error("Command " + this.name + " has no commands!"));
        }
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
        return rxjs_1.Observable.fromPromise(inquirer.prompt(questions));
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map