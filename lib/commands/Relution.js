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
        this.staticCommands = staticCommands;
        this.staticCommandRootKeys = Object.keys(staticCommands);
        this.commandDispatcher.subscribe(this.init.bind(this));
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
                case 'h':
                case 'help':
                    _this.help();
                    break;
                case '':
                    // this.rl.prompt();
                    break;
                default:
                    _this.init(line.trim().split(' '));
                    break;
            }
        });
    };
    Relution.prototype.init = function (args) {
        console.log('Relution', args);
        //only relution
        if (args[0] === this.name && args.length === 1) {
            return this.showCommands();
        }
        //not in reserved and like ['relution', 'server', 'add'] => ['server', 'add']
        if (args[0] === this.name && args.length >= 1 && this.reserved.indexOf(args[1]) === -1) {
            args.splice(0, 1);
        }
        //if from subcommand a method ?
        if (this.staticCommandRootKeys.indexOf(args[0]) !== -1) {
            //only ['server']
            if (args[0] === this.staticCommands[args[0]].name && args.length === 1) {
                console.log("trigger static " + args[0] + " showCommands");
                return this.staticCommands[args[0]].showCommands();
            }
            //['server', 'add']
            //not for relution delegate to subcommand
            console.log('trigger static command', this.staticCommands[args[0]][args[1]].toString());
            var subargs = this._copy(args);
            subargs.splice(0, 1);
            return this.subCommand(subargs, args[0]);
        }
        //no its a relution command like help or quit ['help']
        if (this.reserved.indexOf(args[0]) !== -1) {
            //[relution, help] => to ['help']
            if (args[0] === this.name) {
                args.splice(0, 1);
            }
            if (this[args[0]]) {
                if (args.length > 1) {
                    return this[args[0]](args);
                }
                return this[args[0]]();
            }
        }
    };
    /**
     * user help options
     */
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
            // this.rl.prompt();
        });
    };
    /**
    * trigger a subcommand an return if is completed
    */
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
    /**
     * flat the top commands is been overwritten because we need the subcommands two
     */
    Relution.prototype.flatCommands = function () {
        var list = Object.keys(this.commands);
        var subList = Object.keys(this.staticCommands);
        var av = subList.concat(list);
        return av;
    };
    return Relution;
}(Command_1.Command));
exports.Relution = Relution;
//# sourceMappingURL=Relution.js.map