"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var UserRc_1 = require('./../utility/UserRc');
var Table_1 = require('./../utility/Table');
var Welcome_1 = require('./../utility/Welcome');
var chalk = require('chalk');
var inquirer = require('inquirer');
var username = require('username');
/**
 * Command Tower all Commmands go inside here
 */
var Tower = (function () {
    function Tower(staticCommands) {
        var _this = this;
        this.userRc = new UserRc_1.UserRc();
        //where is this command available
        this.name = 'relution';
        //which one are reserved
        this.reserved = ['help', 'quit'];
        //standard Command Header
        this.tableHeader = ['Command', 'Subcommand', 'Param/s', 'Description'];
        //Back to home on this command
        this.reset = [this.name];
        //Tower commands
        this.commands = {
            help: {
                description: 'list available Commands'
            },
            quit: {
                description: 'Exit To Home'
            }
        };
        //process argV
        this.args = ['relution'];
        //for the table a empty divider
        this._rowDivider = ['', '', '', ''];
        this.table = new Table_1.Table();
        this.staticCommands = staticCommands;
        this.staticCommandRootKeys = Object.keys(staticCommands);
        this.args = this._copy(process.argv);
        //if the bin is used there are n params so we add it again to args
        if (this.args.length === 2) {
            this.args = this.reset;
        }
        else {
            this.args.splice(0, 2);
        }
        this.userRc.rcFileExist().subscribe(function (exist) {
            if (exist) {
                _this.userRc.streamRc().subscribe(function (data) {
                    _this.config = data;
                });
            }
        }, function (e) {
            console.log("no rc file ");
        }, function () {
            _this.init();
        });
        username().then(function (username) {
            _this.username = username;
            if (_this.args.length === 1) {
                Welcome_1.Welcome.greets(_this.username);
            }
        });
    }
    /**
     * reset the Tower to get start
     */
    Tower.prototype.home = function () {
        this.args = this._copy(this.reset);
        this.init();
    };
    /**
     * check available options
     */
    Tower.prototype.init = function () {
        var _this = this;
        // debugger;
        console.log('Relution', this.args);
        // console.log('this.staticCommandRootKeys', this.staticCommandRootKeys);
        if (this.args[0] === this.name || this.staticCommandRootKeys.indexOf(this.args[0]) !== -1) {
            // console.log('this.args[0] === this.name', this.args[0] === this.name);
            //only relution
            if (this.args.length === 1) {
                // console.log('this.args.length === 1', this.args.length === 1);
                return this.showCommands().subscribe(function (answers) {
                    if (answers[_this.name]) {
                        _this.args = answers[_this.name];
                    }
                    else {
                        _this.args = answers;
                    }
                    return _this.init();
                });
            }
            // console.log('this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]', this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]);
            if (this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]) {
                return this[this.args[1]]().subscribe(function (log) {
                    console.log(log);
                }, function (e) {
                    console.log("Something get wrong to use " + _this.args[1], e);
                }, function () {
                    _this.args = _this._copy(_this.reset);
                    _this.init();
                });
            }
            // console.log('hey iaam here');
            //if from subcommand a method ?
            if (this.staticCommandRootKeys.indexOf(this.args[1]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[0]) !== -1) {
                // console.log('this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1', this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1);
                var subArgs = this._copy(this.args);
                if (subArgs[0] === this.name) {
                    subArgs.splice(0, 1);
                }
                //only ['server']
                if (subArgs[0] === this.staticCommands[subArgs[0]].name && subArgs.length === 1) {
                    // console.log(`trigger static ${subArgs.toString()} showCommands`);
                    return this.staticCommands[subArgs[0]].init(subArgs, this);
                }
                else if (this.staticCommands[subArgs[0]][subArgs[1]]) {
                    var params = this._copy(subArgs);
                    params.splice(0, 1);
                    if (params.length) {
                        return this.staticCommands[subArgs[0]].init(params, this);
                    }
                }
                else {
                    console.error(subArgs.toString() + " command not found!");
                }
            }
        }
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
    Tower.prototype.help = function (asArray) {
        var _this = this;
        if (asArray === void 0) { asArray = false; }
        return rxjs_1.Observable.create(function (observer) {
            var content = [_this._rowDivider];
            //to say hello
            _this.flatCommands().forEach(function (commandName) {
                if (commandName !== _this.name && _this.reserved.indexOf(commandName) === -1) {
                    _this.staticCommands[commandName].help(true).subscribe(function (commands) {
                        commands.forEach(function (command) {
                            content.push(command);
                        });
                        //console.log(commands);
                    });
                }
                else if (_this.reserved.indexOf(commandName) !== -1) {
                    content.unshift([chalk.green(commandName), '', '', _this.commands[commandName].description]);
                }
            });
            content.unshift(_this._rowDivider);
            //to say hello
            if (!asArray) {
                observer.next(_this.table.sidebar(_this.tableHeader, content));
            }
            else {
                observer.next(content);
            }
            observer.complete();
        });
    };
    /**
     * merge the subcommand into a flat array with the available Tower Commands
     * ```json
     * [ 'server', 'help', 'quit' ]
     * ```
     */
    Tower.prototype.flatCommands = function () {
        var list = Object.keys(this.commands);
        var av = this.staticCommandRootKeys.concat(list);
        //console.log('av', av)
        return av;
    };
    /**
     * copy any
     */
    Tower.prototype._copy = function (org) {
        return JSON.parse(JSON.stringify(org));
    };
    /**
     * create a list of choices from the root commands
     * ```json
     * [ { name: 'server', value: [ 'relution', 'server' ] },
         { name: 'help', value: [ 'relution', 'help' ] },
         { name: 'quit', value: [ 'relution', 'quit' ] }
       ]
     * ```
     */
    Tower.prototype.setupCommandsForList = function () {
        var _this = this;
        var temp = [];
        this.flatCommands().forEach(function (command) {
            temp.push({
                name: command,
                value: [_this.name, command]
            });
        });
        // console.log(temp);
        return temp;
    };
    /**
     * prepare the choices fo the commands
     * looks like this
     * ```bash
     * ? Please Choose Your Option:  (Use arrow keys)
        ❯ server
          help
          quit
        ```
     */
    Tower.prototype.showCommands = function (message, type) {
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
    Tower.prototype.quit = function () {
        Welcome_1.Welcome.bye(this.username);
        process.exit();
    };
    return Tower;
}());
exports.Tower = Tower;
//# sourceMappingURL=Tower.js.map