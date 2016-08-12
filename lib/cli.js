#!/usr/bin/env node --harmony
"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var RelutionSDK = require('./utility/RelutionSDK');
var Server_1 = require('./commands/Server');
var Environment_1 = require('./commands/Environment');
var Tower_1 = require('./commands/Tower');
var Project_1 = require('./commands/Project');
var Connection_1 = require('./commands/Connection');
var Push_1 = require('./commands/Push');
var Logger_1 = require('./commands/Logger');
// command line preprocessing
var argv = new (Array.bind.apply(Array, [void 0].concat(process.argv)))();
// console.log(argv);
argv.splice(0, 2); // node cli.js
RelutionSDK.initFromArgs(argv);
// console.log('2', argv);
// all sub commands add to be here
var staticCommands = {
    server: new Server_1.Server(),
    project: new Project_1.Project(),
    env: new Environment_1.Environment(),
    connection: new Connection_1.Connection(),
    logger: new Logger_1.Logger(),
    push: new Push_1.Push()
};
// observable to wait for before loading the tower some commands need a some data befor it can be initialised
var all = Object.keys(staticCommands).map(function (commandName) {
    return staticCommands[commandName].preload().defaultIfEmpty();
});
// preload done
rxjs_1.Observable.forkJoin(all).subscribe(function (a) {
    // console.log(a);
}, function (e) {
    console.error('preload', e);
    process.exit(-1);
}, function () {
    // console.log('test', argv);
    return new Tower_1.Tower(staticCommands, argv);
});
//# sourceMappingURL=cli.js.map