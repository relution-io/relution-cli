#!/usr/bin/env node --harmony
import {Server} from './commands/Server';
import {Environment} from './commands/Environment';
import {Tower} from './commands/Tower';
import {New} from './commands/New';
import {Deploy} from './commands/Deploy';
import {Connection} from './commands/Connection';
import {Push} from './commands/Push';

import {Observable} from '@reactivex/rxjs';
// const loader = require('cli-loader')();
// loader.start();
// all sub commands add to be here
let staticCommands = {
  server: new Server(),
  env: new Environment(),
  new: new New(),
  deploy: new Deploy(),
  connection: new Connection(),
  push: new Push()
};

// observable to wait for before loading the tower some commands need a some data befor it can be initialised
let all: any = [];
Object.keys(staticCommands).forEach((commandName: any) => {
  all.push(staticCommands[commandName].preload());
});

// preload done
Observable.forkJoin(all).subscribe(
  (a: any) => {
    // console.log(a);
  },
  (e: any) => {
    console.error('preload', e);
    process.exit();
  },
  () => {
    console.log(`cli is preloaded`);
    console.log(staticCommands.connection.connectionsDirTree);
    return new Tower(staticCommands);
  }
);
