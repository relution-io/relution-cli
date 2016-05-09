#!/usr/bin/env node
"use strict";
var Server_1 = require('./commands/Server');
var Tower_1 = require('./commands/Tower');
var rxjs_1 = require('@reactivex/rxjs');
// const loader = require('cli-loader')();
// loader.start();
//all sub commands add to be here
var staticCommands = {
    server: new Server_1.Server()
};
//observable to wait for before loading the tower some commands need a some data befor it can be initialised
var all = [];
Object.keys(staticCommands).forEach(function (commandName) {
    all.push(staticCommands[commandName].preload());
});
//preload done
rxjs_1.Observable.forkJoin([all]).subscribe(function () {
    //console.log(`cli is preloaded`);
}, function (e) {
    console.error(e);
    // loader.stop();
    process.exit();
}, function () {
    var relution = new Tower_1.Tower(staticCommands);
    // loader.stop();
});
//# sourceMappingURL=cli.js.map