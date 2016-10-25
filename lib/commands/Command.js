"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var _ = require('lodash');
var UserRc_1 = require('./../utility/UserRc');
var Table_1 = require('./../utility/Table');
var Translation_1 = require('./../utility/Translation');
var DebugLog_1 = require('./../utility/DebugLog');
var RelutionSDK_1 = require('./../utility/RelutionSDK');
var inquirer = require('inquirer');
/**
 *
 * Important All Subcommand have to return an Observable
 * ##### Add a new Command
 *
 *```javascript
 *
 * import {Command} from './Command';
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
        this.color = chalk;
        this.inquirer = inquirer;
        this.i18n = Translation_1.Translation;
        this.debuglog = DebugLog_1.DebugLog;
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
        return this.init([this.name]);
    };
    Command.prototype.back = function () {
        return this.init([this.name]);
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
        // this.debuglog.info('help', asArray);
        return rxjs_1.Observable.create(function (observer) {
            var content = [['', '', '', '']];
            // [this.name, '', '', '']
            var i = 0;
            _this.flatCommands().forEach(function (commandName) {
                var disabled = _this.commandIsDisabled(_this.commands[commandName], commandName, _this.commands[commandName].description);
                var color = _.isNil(disabled) ? 'green' : 'red';
                var name = _this.commands[commandName].label || commandName;
                var command = [chalk[color](_this.name), chalk.cyan(name)];
                if (_this.commands[commandName]) {
                    if (commandName !== 'relution') {
                        //  && this.reserved.indexOf(commandName) === -1
                        if (_this.commands[commandName].vars) {
                            var vars_1 = Object.keys(_this.commands[commandName].vars);
                            var params_1 = '';
                            vars_1.forEach(function (param, index) {
                                params_1 += chalk.yellow("<$" + param + ">");
                                // this.debuglog.info(index, vars.length, index !== (vars.length -1));
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
                        if (disabled) {
                            command.push(chalk['red'](disabled));
                        }
                        else {
                            command.push(_this.commands[commandName].description || '--');
                        }
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
    Command.prototype.commandIsDisabled = function (command, name, defaultWhy) {
        if (defaultWhy === void 0) { defaultWhy = "is not enabled"; }
        if (command.when && !command.when()) {
            return command.why ? command.why() : defaultWhy;
        }
        return null;
    };
    Command.prototype.init = function (args) {
        var _this = this;
        // this.debuglog.info(`Command.ts ${this.name}`, args);
        // console.log(JSON.stringify(args, null, 2));
        var myObservable;
        // directly
        if (args[0] === this.name && args.length === 1) {
            // is the help or command without any params
            return this.showCommands().subscribe(function (answers) {
                return _this.init(answers[_this.name]);
            }, function (e) { return _this.debuglog.error(e); });
        }
        if (args.length >= 1 && args[0] === this.name && args[1] === Translation_1.Translation.QUIT) {
            // back to Tower
            return this._parent.home();
        }
        // we have this method maybe help we get ['server', 'help', 'param']
        // build this.help('param');
        // this.debuglog.info('this[args[0]]', this[args[0]]);
        if (this[args[0]]) {
            // this.debuglog.info('args.length > 1', args.length > 1);
            if (args.length > 1) {
                var params = this._copy(args);
                params.shift(); // remove 'update' or 'create'
                myObservable = this[args[0]](params);
            }
            else {
                myObservable = this[args[0]]();
            }
        }
        // this.debuglog.info('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
        // server add
        if (args[0] === this.name && this[args[1]]) {
            if (args.length > 2) {
                this.debuglog.info('args.length > 2', args.length > 2);
                var subArgs = this._copy(args);
                subArgs.splice(0, 2);
                myObservable = this[args[1]](subArgs);
            }
            else {
                myObservable = this[args[1]]();
            }
        }
        // console.log(myObservable);
        return myObservable.subscribe(function (log) {
            if (log && log.length) {
                _this.debuglog.log('cyan', log);
            }
        }, function (e) {
            _this.debuglog.error(e);
            _this.home();
        }, function () {
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
            var name = _this.commands[command].label || _this.commands[command].name || command;
            var message = _this.commandIsDisabled(_this.commands[command], command);
            if (!_.isNil(message)) {
            }
            temp.push({
                disabled: message,
                name: name,
                value: [_this.name, _this.commands[command].method ? _this.commands[command].method : command]
            });
        });
        return temp;
    };
    Command.prototype.showCommands = function (message, type) {
        if (message === void 0) { message = "Please Choose Your " + this.name + " Command: "; }
        if (type === void 0) { type = 'list'; }
        // this.debuglog.info(new Date().getTime());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUMvQixJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUU1Qix1QkFBcUIscUJBQXFCLENBQUMsQ0FBQTtBQUMzQyxzQkFBb0Isb0JBQW9CLENBQUMsQ0FBQTtBQUV6Qyw0QkFBMEIsMEJBQTBCLENBQUMsQ0FBQTtBQUNyRCx5QkFBdUIsdUJBQXVCLENBQUMsQ0FBQTtBQUMvQyw0QkFBMEIsMEJBQTBCLENBQUMsQ0FBQTtBQUVyRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFtQnJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNIO0lBbUJFLGlCQUFZLElBQVk7UUFuQjFCLGlCQThPQztRQXhPUSxlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBRzlCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxhQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLFNBQUksR0FBRyx5QkFBVyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxtQkFBUSxDQUFDO1FBQ3BCLGFBQVEsR0FBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxVQUFLLEdBQVUsSUFBSSxhQUFLLEVBQUUsQ0FBQztRQUUzQixnQkFBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1FBR3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDckMsQ0FB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