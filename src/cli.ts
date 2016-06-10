#!/usr/bin/env node --harmony
import {Observable} from '@reactivex/rxjs';
import * as RelutionSDK from './utility/RelutionSDK';

import {Server} from './commands/Server';
import {Environment} from './commands/Environment';
import {Tower} from './commands/Tower';
import {New} from './commands/New';
import {Deploy} from './commands/Deploy';
import {Connection} from './commands/Connection';
import {Push} from './commands/Push';

// command line preprocessing
let argv = new Array<string>(...process.argv);
argv.splice(0, 2); // node cli.js
RelutionSDK.initFromArgs(argv);

// all sub commands add to be here
const staticCommands = {
  server: new Server(),
  env: new Environment(),
  new: new New(),
  deploy: new Deploy(),
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
    return new Tower(staticCommands, argv);
  }
);
