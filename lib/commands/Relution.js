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
        this.rl = readline.createInterface(process.stdin, process.stdout);
        this.rl.setPrompt('$relution: ');
        this.rl.prompt();
        this.staticCommands = staticCommands;
        this.commandDispatcher.subscribe(this.init.bind(this));
    }
    Relution.prototype.init = function (args) {
        var _this = this;
        _super.prototype.init.call(this, args);
        var subcommand = null;
        Object.keys(this.staticCommands).forEach(function (command) {
            if (_this.staticCommands[command].name === args[1]) {
                if (!_this.staticCommands[command].init) {
                    throw new Error('a commmand need a init Method');
                }
                subcommand = command;
            }
        });
        var subargs = this._copy(args);
        subargs.splice(0, 1);
        if (subcommand) {
            return this.subCommand(subargs, subcommand).subscribe(function (scenario) {
                console.log(scenario);
            }, function (e) {
                throw Error(e);
            }, function () {
                console.log('subcommand done', subargs);
            });
        }
        else if (args[1] === 'help') {
            return this.help();
        }
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
        var header = ['Command', 'Subcommand', 'Param/s', 'Description'];
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
            console.log(_this.table.sidebar(header, comp));
        });
    };
    return Relution;
}(Command_1.Command));
exports.Relution = Relution;
//# sourceMappingURL=Relution.js.map