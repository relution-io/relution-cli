#!/usr/bin/env node --harmony
import {Observable} from '@reactivex/rxjs';
import * as RelutionSDK from './utility/RelutionSDK';
import * as _ from 'lodash';

import {Server} from './commands/Server';
import {Environment} from './commands/Environment';
import {Tower} from './commands/Tower';
import {Project} from './commands/Project';
import {Connection} from './commands/Connection';
import {Push} from './commands/Push';
import {Command} from './commands/Command';

// command line preprocessing
let argv = new Array<string>(...process.argv);
// console.log(argv);
argv.splice(0, 2); // node cli.js
RelutionSDK.initFromArgs(argv);

// console.log('2', argv);
// all sub commands add to be here
const staticCommands: _.Dictionary<Command>  = {
  server: new Server(),
  project: new Project(),
  env: new Environment(),
  connection: new Connection(),
  push: new Push()
};

// observable to wait for before loading the tower some commands need a some data befor it can be initialised
const all = Object.keys(staticCommands).map((commandName: any) => {
  return staticCommands[commandName].preload().defaultIfEmpty();
});

// preload done
Observable.forkJoin(all).subscribe(
  (a: any) => {
    // console.log(a);
  },
  (e: any) => {
    console.error('preload', e);
    process.exit(-1);
  },
  () => {
    // console.log('test', argv);
    return new Tower(staticCommands, argv);
  }
);
