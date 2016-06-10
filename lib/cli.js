#!/usr/bin/env node --harmony
"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var RelutionSDK = require('./utility/RelutionSDK');
var Server_1 = require('./commands/Server');
var Environment_1 = require('./commands/Environment');
var Tower_1 = require('./commands/Tower');
var New_1 = require('./commands/New');
var Deploy_1 = require('./commands/Deploy');
var Connection_1 = require('./commands/Connection');
var Push_1 = require('./commands/Push');
// command line preprocessing
var argv = new (Array.bind.apply(Array, [void 0].concat(process.argv)))();
argv.splice(0, 2); // node cli.js
RelutionSDK.initFromArgs(argv);
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
    return new Tower_1.Tower(staticCommands, argv);
});
//# sourceMappingURL=cli.js.map