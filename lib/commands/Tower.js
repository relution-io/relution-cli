"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var RelutionSDK = require('../utility/RelutionSDK');
var UserRc_1 = require('./../utility/UserRc');
var Table_1 = require('./../utility/Table');
var Greet_1 = require('./../utility/Greet');
var chalk = require('chalk');
var Translation_1 = require('./../utility/Translation');
var inquirer = require('inquirer');
var usernameLib = require('username');
/**
 * Command Tower all Commmands go inside here
 * ```bash
 * ┌────────────┬──────────┬─────────────────┬───────────────────────────────────────────────┐
 * │ Options    │ Commands │ Param(s)        │ Description                                   │
 * │            │          │                 │                                               │
 * │ quit       │          │                 │ Exit Relution CLI                             │
 * │ help       │          │                 │ List the relution Command                     │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ server     │ add      │ <$name>         │ Add a new Server to the config                │
 * │ server     │ list     │ <$name>         │ List all available Server from config         │
 * │ server     │ update   │ <$name>         │ Update a exist server from the Server list    │
 * │ server     │ rm       │ <$name>         │ Remove a Server from the config               │
 * │ server     │ help     │ --              │ List the Server Command                       │
 * │ server     │ quit     │ --              │ Exit to Home                                  │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ env        │ add      │ <$name>         │ add a new Environment                         │
 * │ env        │ update   │ <$name>         │ Add a new key value pair to your Environment. │
 * │ env        │ copy     │ <$from> <$name> │ copy a exist Environment                      │
 * │ env        │ list     │ --              │ List all environments by name                 │
 * │ env        │ help     │ --              │ List the Environment Command                  │
 * │ env        │ quit     │ --              │ Exit To Home                                  │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ new        │ create   │ <$name>         │ create a new Project in Folder                │
 * │ new        │ help     │ --              │ List the New Command                          │
 * │ new        │ quit     │ --              │ Exit to Home                                  │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ deploy     │ deploy   │ <$name>         │ deploy your Baas to the server                │
 * │ deploy     │ help     │ --              │ List the Deploy Command                       │
 * │ deploy     │ quit     │ --              │ Exit to Home                                  │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ connection │ add      │ <$name>         │ create a connection                           │
 * │ connection │ help     │ --              │ List the Deploy Command                       │
 * │ connection │ quit     │ --              │ Exit to Home                                  │
 * │            │          │                 │                                               │
 * │            │          │                 │                                               │
 * │ push       │ add      │ <$name>         │ create a push config                          │
 * │ push       │ list     │ --              │ list available push configs                   │
 * │ push       │ help     │ --              │ List the Push Command                         │
 * │ push       │ quit     │ --              │ Exit to Home                                  │
 * │            │          │                 │                                               │
 * └────────────┴──────────┴─────────────────┴───────────────────────────────────────────────┘
    ```

 */
var Tower = (function () {
    function Tower(staticCommands) {
        var _this = this;
        this.userRc = new UserRc_1.UserRc();
        // where is this command available
        this.name = 'relution';
        // which one are reserved
        this.reserved = ['help', 'quit'];
        // Back to home on this command
        this.reset = [this.name];
        // Tower commands
        this.commands = {
            help: {
                description: Translation_1.Translation.LIST_COMMAND(this.name)
            },
            quit: {
                description: 'Exit Relution CLI'
            }
        };
        // process argV
        this.args = ['relution'];
        // for the table a empty divider
        this._rowDivider = ['', '', '', ''];
        this.table = new Table_1.Table();
        this.staticCommands = staticCommands;
        this.staticCommandRootKeys = Object.keys(staticCommands);
        this.args = this._copy(process.argv);
        this.args.splice(0, 2); // node cli.js
        RelutionSDK.initFromArgs(this.args);
        if (this.args.length <= 0) {
            // go interactive
            this.args = this.reset;
        }
        this.userRc.rcFileExist()
            .exhaustMap(function (exist) {
            return _this.userRc.streamRc()
                .map(function (data) {
                _this.config = data;
            });
        })
            .exhaustMap(function (data) {
            return rxjs_1.Observable.fromPromise(usernameLib());
        })
            .map(function (username) {
            _this.username = username;
            if (_this.args.length === 1) {
                Greet_1.Greet.hello(_this.username);
            }
        })
            .subscribe({
            complete: function () { return _this.init(); }
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
        //  debugger;
        //  console.log('Relution', this.args);
        //  console.log('this.staticCommandRootKeys', this.staticCommandRootKeys);
        if (this.args[0] === this.name || this.staticCommandRootKeys.indexOf(this.args[0]) !== -1) {
            //  console.log('this.args[0] === this.name', this.args[0] === this.name);
            // only relution
            if (this.args.length === 1) {
                //  console.log('this.args.length === 1', this.args.length === 1);
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
            //  console.log('this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]', this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]);
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
            //  console.log('hey iaam here');
            // if from subcommand a method ?
            if (this.staticCommandRootKeys.indexOf(this.args[1]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[0]) !== -1) {
                //  console.log('this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1', this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1);
                var subArgs = this._copy(this.args);
                if (subArgs[0] === this.name) {
                    subArgs.splice(0, 1);
                }
                // only ['server']
                if (subArgs[0] === this.staticCommands[subArgs[0]].name && subArgs.length === 1) {
                    //  console.log(`trigger static ${subArgs.toString()} showCommands`);
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
        // console.log('help tower', this.staticCommandRootKeys);
        return rxjs_1.Observable.create(function (observer) {
            var content = [_this._rowDivider];
            // to say hello
            _this.flatCommands().forEach(function (commandName) {
                if (commandName !== _this.name && _this.reserved.indexOf(commandName) === -1) {
                    _this.staticCommands[commandName].help(true).subscribe(function (commands) {
                        // console.log(commands, commandName);
                        commands.forEach(function (command) {
                            content.push(command);
                        });
                        // console.log(commands);
                    });
                }
                else if (_this.reserved.indexOf(commandName) !== -1) {
                    content.unshift([chalk.green(commandName), '', '', _this.commands[commandName].description]);
                }
            });
            content.unshift(_this._rowDivider);
            // to say hello
            if (!asArray) {
                observer.next(_this.table.sidebar(content));
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
        // console.log('av', av)
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
        //  console.log(temp);
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
        if (message === void 0) { message = 'Please Choose Your Option: '; }
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
    /**
     * quit relution-cli
     */
    Tower.prototype.quit = function () {
        Greet_1.Greet.bye(this.username);
        process.exit();
    };
    return Tower;
}());
exports.Tower = Tower;
//# sourceMappingURL=Tower.js.map