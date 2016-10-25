"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var UserRc_1 = require('./../utility/UserRc');
var Table_1 = require('./../utility/Table');
var Greet_1 = require('./../utility/Greet');
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
    function Tower(staticCommands, argv) {
        var _this = this;
        if (argv === void 0) { argv = []; }
        this.userRc = new UserRc_1.UserRc();
        // where is this command available
        this.name = 'Relution CLI';
        this.commandInternName = 'relution';
        // which one are reserved
        this.reserved = ['help', 'quit'];
        // Back to home on this command
        this.reset = [this.commandInternName];
        // Tower commands
        this.commands = {
            help: {
                description: Translation_1.Translation.HELP_COMMAND(this.commandInternName)
            },
            quit: {
                description: 'Exit the Relution CLI'
            }
        };
        // process argV
        this.args = ['relution'];
        // for the table a empty divider
        this._rowDivider = ['', '', '', ''];
        this.table = new Table_1.Table();
        this.staticCommands = staticCommands;
        this.staticCommandRootKeys = Object.keys(staticCommands);
        this.staticCommandRootKeys.forEach(function (name) {
            staticCommands[name]._parent = _this;
        });
        // console.log('argv', argv);
        this.args = argv;
        if (this.args.length <= 0) {
            this.args = this.reset; // go interactive
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
        return this.init();
    };
    /**
     * check available options
     */
    Tower.prototype.init = function () {
        var _this = this;
        //  debugger;
        // console.log('Relution', this.args);
        // console.log('this.staticCommandRootKeys', this.staticCommandRootKeys);
        //  if (this.args[0] === this.commandInternName) {
        //    this.args.shift();
        //  }
        //  console.log(this.args);
        if (this.args[0] === this.commandInternName || this.staticCommandRootKeys.indexOf(this.args[0]) !== -1) {
            // console.log('this.args[0] === this.commandInternName', this.args[0] === this.commandInternName);
            // only relution
            if (this.args.length === 1) {
                //  console.log('this.args.length === 1', this.args.length === 1);
                return this.showCommands().subscribe(function (answers) {
                    if (answers[_this.commandInternName]) {
                        _this.args = answers[_this.commandInternName];
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
                if (subArgs[0] === this.commandInternName) {
                    subArgs.shift();
                }
                // only ['server']
                // debugger;
                if (subArgs[0] === this.staticCommands[subArgs[0]].name && subArgs.length === 1) {
                    //  console.log(`trigger static ${subArgs.toString()} showCommands`);
                    return this.staticCommands[subArgs[0]].init(subArgs);
                }
                else if (this.staticCommands[subArgs[0]][subArgs[1]]) {
                    var params = this._copy(subArgs);
                    params.shift();
                    if (params.length) {
                        return this.staticCommands[subArgs[0]].init(params);
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
                if (commandName !== _this.commandInternName && _this.reserved.indexOf(commandName) === -1) {
                    _this.staticCommands[commandName].help(true).subscribe(function (commands) {
                        commands.forEach(function (command) {
                            content.push(command);
                        });
                    });
                }
                else if (_this.reserved.indexOf(commandName) !== -1) {
                    content.unshift([chalk.green(commandName), '', '', _this.commands[commandName].description]);
                }
            });
            content.unshift(_this._rowDivider);
            // to say hello
            if (!asArray) {
                observer.next(_this.table.sidebar(content, Translation_1.Translation.GENERAL_HELP_TABLEHEADERS));
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
                value: [_this.commandInternName, command]
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
                name: this.commandInternName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvVG93ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBRTNDLElBQVksS0FBSyxXQUFNLE9BQU8sQ0FBQyxDQUFBO0FBRS9CLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBQzNDLHNCQUFvQixvQkFBb0IsQ0FBQyxDQUFBO0FBQ3pDLHNCQUFvQixvQkFBb0IsQ0FBQyxDQUFBO0FBSXpDLDRCQUEwQiwwQkFBMEIsQ0FBQyxDQUFBO0FBRXJELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNIO0lBdUNFLGVBQVksY0FBcUMsRUFBRSxJQUFtQjtRQXZDeEUsaUJBMlFDO1FBcE9vRCxvQkFBbUIsR0FBbkIsU0FBbUI7UUF0Qy9ELFdBQU0sR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBQ3JDLGtDQUFrQztRQUMzQixTQUFJLEdBQVcsY0FBYyxDQUFDO1FBQzlCLHNCQUFpQixHQUFHLFVBQVUsQ0FBQztRQVV0Qyx5QkFBeUI7UUFDbEIsYUFBUSxHQUFrQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUdsRCwrQkFBK0I7UUFDeEIsVUFBSyxHQUFrQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3ZELGlCQUFpQjtRQUNWLGFBQVEsR0FBVztZQUN4QixJQUFJLEVBQUU7Z0JBQ0osV0FBVyxFQUFFLHlCQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQzthQUM5RDtZQUNELElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsdUJBQXVCO2FBQ3JD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