#!/usr/bin/env node
"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Commands = require('./commands/Commands');
var path = require('path');
var nopt = require('nopt');
var pkg = require('./../package.json');
var readline = require('readline');
/**
 * @class Tower
 */
var Tower = (function () {
    function Tower(argv) {
        console.log(Commands.home);
        debugger;
        //use the prompt
        if (!argv) {
            this.rl = readline.createInterface(process.stdin, process.stdout);
            this.rl.setPrompt('$relution: ');
            this.rl.prompt();
        }
        else {
            //use it directly
            this.userArgs = argv;
            console.log(this.userArgs);
        }
    }
    Tower.prototype.addListener = function () {
        var _this = this;
        this.dispatcher = rxjs_1.Observable.create(function (observer) {
            _this.rl.on('line', function (line) {
                console.log(line);
                switch (line.trim()) {
                    case 'q':
                    case 'quit':
                        _this.exit();
                        break;
                    case '':
                        _this.rl.prompt();
                        break;
                    default:
                        observer.next(line.trim().split(' '));
                        console.log(JSON.stringify(line.trim().split(' '), null, 2));
                        break;
                }
                _this.rl.prompt();
            }).on('close', function () {
                observer.complete();
            }).on('error', function (e) {
                console.log(e);
            });
        });
        console.log(this.dispatcher);
    };
    Tower.prototype.exit = function () {
        console.log('Have a great day!');
        process.exit(0);
    };
    return Tower;
}());
var cli;
if (process.argv.length >= 2) {
    var args = process.argv.splice(0, 2);
    cli = new Tower(args);
}
else {
    cli = new Tower();
    cli.addListener();
    cli.dispatcher.subscribe({
        next: function (x) { return console.log('got value ' + x); },
        error: function (err) { return console.error('something wrong occurred: ' + err); },
        complete: function () { return console.log('done'); },
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cli;
//# sourceMappingURL=Tower.js.map