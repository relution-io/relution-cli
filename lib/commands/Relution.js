"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var rxjs_1 = require('@reactivex/rxjs');
var readline = require('readline');
var Relution = (function (_super) {
    __extends(Relution, _super);
    function Relution(staticCommands) {
        _super.call(this, 'relution');
        this.args = [];
        this.reserved = ['help', 'quit', 'relution'];
        this.commands = {
            help: {
                description: 'list available Commands'
            },
            quit: {
                description: 'Exit To Home'
            }
        };
        //Terminal input watcher
        this.rl = readline.createInterface(process.stdin, process.stdout);
        this.rl.setPrompt('$relution: ');
        this.rl.prompt();
        this.readlineEmitter = rxjs_1.Observable.fromEvent(this.rl, 'line');
        this.staticCommands = staticCommands;
        this.commandDispatcher.subscribe(this.init.bind(this));
        this.inputListener();
    }
    /**
     * listen on the Terminal if the user is adding something
     */
    Relution.prototype.inputListener = function () {
        var _this = this;
        this.readlineEmitter.subscribe(function (line) {
            console.log('command coming', line);
            switch (line.trim()) {
                case 'q':
                case 'quit':
                    _this.quit();
                    break;
                case '':
                    _this.rl.prompt();
                    break;
                default:
                    _this.init(line.trim().split(' '));
                    break;
            }
            _this.rl.prompt();
        });
    };
    Relution.prototype.init = function (args) {
        _super.prototype.init.call(this, args);
        console.log('args', args);
        var subcommand = this.isSubcommand(args);
        if (subcommand.length) {
            //not for relution delegate to subcommand
            console.log('yeah iam subcommand', subcommand);
            var subargs_1 = this._copy(args);
            subargs_1.splice(0, 1);
            return this.subCommand(subargs_1, args[0]).subscribe(function (scenario) {
                console.log(scenario);
            }, function (e) {
                throw Error(e);
            }, function () {
                console.log('subcommand done', subargs_1);
            });
        }
        else if (args[0] === this.name && args[1] === 'help') {
            //relution help
            return this.help();
        }
        else if (args[0] === this.name && args[1] === 'quit') {
            //relution quit
            return this.quit();
        }
        else if (args[0] === this.name) {
            //only relution
            console.log('only prompt');
        }
        else {
            console.log('this command is not available');
            return this.help();
        }
    };
    /**
     * if is available in subcommands
     */
    Relution.prototype.isSubcommand = function (args) {
        var _this = this;
        var subcommand = null;
        if (args[0] !== this.name) {
            Object.keys(this.staticCommands).forEach(function (command) {
                if (_this.staticCommands[command].name === args[0]) {
                    if (!_this.staticCommands[command].init) {
                        throw new Error('a commmand need a init Method');
                    }
                    subcommand = command;
                }
            });
            return subcommand;
        }
        return [];
    };
    Relution.prototype.subCommand = function (args, command) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _this.staticCommands[command].init(args).subscribe(function (scenario) {
                observer.next(scenario);
            }, function (e) {
                observer.error(e);
            }, function () {
                observer.complete();
            });
        });
    };
    Relution.prototype.help = function () {
        var _this = this;
        var comp = [];
        var helpBatch = [_super.prototype.help.call(this, true)];
        Object.keys(this.staticCommands).forEach(function (command) {
            helpBatch.push(_this.staticCommands[command].help(true));
        });
        return rxjs_1.Observable.forkJoin(helpBatch).subscribe(function (comm) {
            comm.forEach(function (ob) {
                ob.forEach(function (o) {
                    comp.push(o);
                });
            });
        }, function (e) {
            console.error(e);
        }, function () {
            console.log(_this.table.sidebar(_this.tableHeader, comp));
        });
    };
    /**
     * flat the top commands
     */
    Relution.prototype.flatCommands = function () {
        var list = Object.keys(this.commands);
        var subList = Object.keys(this.staticCommands);
        var av = subList.concat(list);
        return av;
    };
    /**
     *
     */
    Relution.prototype.flatCommandsToRadioList = function () {
        var commands = this.flatCommands();
    };
    return Relution;
}(Command_1.Command));
exports.Relution = Relution;
//# sourceMappingURL=Relution.js.map