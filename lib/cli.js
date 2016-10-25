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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLElBQVksV0FBVyxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFHckQsdUJBQXFCLG1CQUFtQixDQUFDLENBQUE7QUFDekMsNEJBQTBCLHdCQUF3QixDQUFDLENBQUE7QUFDbkQsc0JBQW9CLGtCQUFrQixDQUFDLENBQUE7QUFDdkMsd0JBQXNCLG9CQUFvQixDQUFDLENBQUE7QUFDM0MsMkJBQXlCLHVCQUF1QixDQUFDLENBQUE7QUFDakQscUJBQW1CLGlCQUFpQixDQUFDLENBQUE7QUFHckMsNkJBQTZCO0FBQzdCLElBQUksSUFBSSxHQUFHLEtBQUksS0FBSyxZQUFMLEtBQUssa0JBQVksT0FBTyxDQUFDLElBQUksS0FBQyxDQUFDO0FBQzlDLHFCQUFxQjtBQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7QUFDakMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUUvQiwwQkFBMEI7QUFDMUIsa0NBQWtDO0FBQ2xDLElBQU0sY0FBYyxHQUEyQjtJQUM3QyxNQUFNLEVBQUUsSUFBSSxlQUFNLEVBQUU7SUFDcEIsT0FBTyxFQUFFLElBQUksaUJBQU8sRUFBRTtJQUN0QixHQUFHLEVBQUUsSUFBSSx5QkFBVyxFQUFFO0lBQ3RCLFVBQVUsRUFBRSxJQUFJLHVCQUFVLEVBQUU7SUFDNUIsSUFBSSxFQUFFLElBQUksV0FBSSxFQUFFO0NBQ2pCLENBQUM7QUFFRiw2R0FBNkc7QUFDN0csSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxXQUFnQjtJQUMzRCxNQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2hFLENBQUMsQ0FBQyxDQUFDO0FBRUgsZUFBZTtBQUNmLGlCQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FDaEMsVUFBQyxDQUFNO0lBQ0wsa0JBQWtCO0FBQ3BCLENBQUMsRUFDRCxVQUFDLENBQU07SUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxDQUFDLElBQUksYUFBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQ0YsQ0FBQyJ9