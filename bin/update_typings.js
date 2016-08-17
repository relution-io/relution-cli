#!/usr/bin/env node --harmony
const fs = require('fs');
const path = require('path');
const Observable = require('@reactivex/rxjs').Observable;
const typingsJson = require(path.join(__dirname, '..', 'typings.json'));
const exec = require('child_process').exec;
const installPrefix = 'typings install';
const config = {
  prefix: {
    globalDependencies: 'dt~',
    dependencies: 'npm~'
  },
  suffix: {
    globalDependencies: '--global --save',
    dependencies: '--save'
  }
};

Observable.from(['globalDependencies', 'dependencies'])
.subscribe(
  (key) => {
    if (typingsJson[key]) {
      let cmd = '';
      Object.keys(typingsJson[key]).forEach((name) => {
        cmd += ` ${config.prefix[key]}${name}`;
      });

      exec(`${installPrefix}${cmd} ${config.suffix[key]}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(stdout);
      });
    } else {
      console.log(`${key} not exist`);
    }
  },
  (e) => console.error(e)
);
