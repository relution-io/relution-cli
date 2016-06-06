#!/usr/bin/env node --harmony
"use strict";
var Server_1 = require('./commands/Server');
var Environment_1 = require('./commands/Environment');
var Tower_1 = require('./commands/Tower');
var New_1 = require('./commands/New');
var Deploy_1 = require('./commands/Deploy');
var Connection_1 = require('./commands/Connection');
var Push_1 = require('./commands/Push');
var rxjs_1 = require('@reactivex/rxjs');
// const loader = require('cli-loader')();
// loader.start();
// all sub commands add to be here
var staticCommands = {
    server: new Server_1.Server(),
    env: new Environment_1.Environment(),
    new: new New_1.New(),
    deploy: new Deploy_1.Deploy(),
    connection: new Connection_1.Connection(),
    push: new Push_1.Push()
};
// observable to wait for before loading the tower some commands need a some data befor it can be initialised
var all = [];
Object.keys(staticCommands).forEach(function (commandName) {
    all.push(staticCommands[commandName].preload());
});
// preload done
rxjs_1.Observable.forkJoin(all).subscribe(function () {
}, function (e) {
    console.error(e);
    // loader.stop();
    process.exit();
}, function () {
    // console.log(`cli is preloaded`);
    return new Tower_1.Tower(staticCommands);
    // loader.stop();
});
//# sourceMappingURL=cli.js.map