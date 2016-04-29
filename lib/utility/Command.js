"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var UserRc_1 = require('./UserRc');
var Table_1 = require('./Table');
var Command = (function () {
    function Command(name) {
        var _this = this;
        this.directMode = false;
        if (!name) {
            throw Error('Command need a name');
        }
        this.table = new Table_1.Table();
        this.userRc = new UserRc_1.UserRc();
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
            //console.log(data[2] === this.name, data[2], this.name);
            return data[0] === _this.name;
        });
    }
    Command.prototype.help = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var header = ['command', 'subcommand', 'params', 'description'];
            var content = [];
            //[this.name, '', '', '']
            if (_this.commands) {
                var i_1 = 0;
                Object.keys(_this.commands).forEach(function (commandName) {
                    var command = [_this.name, commandName];
                    if (_this.commands[commandName].vars) {
                        var vars = Object.keys(_this.commands[commandName].vars);
                        vars.forEach(function (param) {
                            command.push("<$" + param + ">");
                        });
                    }
                    else {
                        command.push('');
                    }
                    command.push(_this.commands[commandName].description || '');
                    content.push(command);
                    i_1++;
                });
                observer.next(_this.table.sidebar(header, content));
            }
            observer.complete();
        });
    };
    Command.prototype.init = function (args) {
        console.log(this.name, args);
    };
    Command.prototype._copy = function (org) {
        return JSON.parse(JSON.stringify(org));
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=Command.js.map