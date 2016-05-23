#!/usr/bin/env node
'use strict';
const Observable = require('@reactivex/rxjs').Observable;
const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const chokidar = require('chokidar');

let mocha = new Mocha();

let chokidarOptions = {
  persistent: true
};
let root = path.join(__dirname, 'lib');
let filteredTree = dirTree(root, ['.js']);
let testFiles = [];

let traverseFiles = (tree) => {
  if (tree.children) {
    return traverseFiles(tree.children);
  }

  // console.log(typeof tree);
  tree.forEach((branch) => {
    //console.log('branch', branch);
    if (branch.children) {
      return traverseFiles(branch.children);
    }
    // branch.path.indexOf('.spec') > -1
    if (branch.path) {
      testFiles.push(branch.path);
    }
  })
  return testFiles;
}

let watcher = chokidar.watch(root, chokidarOptions);

let addFile = (file) => {
  mocha.addFile(file);
};

let startMocha = () => {

  //reporter('list').ui('tdd')
  return mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures);
    });
  });
};

Observable.from(traverseFiles(filteredTree))
  .map((path) => {
    if (path.indexOf('.spec') < 0) {
      watcher.unwatch(path);
    }
    return path;
  })
  .filter((path) => {
    return path.indexOf('.spec') > -1;
  })
  .filter((path) => {
    return fs.existsSync(path);
  })
  .subscribe({
    next: (file) => {
      addFile(file);
    },
    error: (e) => {
      console.error(e);
    },
    complete: () => {
      startMocha();
    }
  });

Observable.fromEvent(watcher, 'add')
  .debounce(500)
  .map((path) => {
    console.log('added', path);
    if (path.indexOf('.spec') < 0) {
      watcher.unwatch(path);
    }
    return path;
  })
  .filter((path) => {
    return path.indexOf('.spec') > -1;
  })
  .subscribe(
    (file) => {
      addFile(file);
  },
    (e) => { console.error(e) },
    () => { startMocha() }
)

// watcher.on('change', (path) => {
//   console.log('path', path);
// })

let ev = Observable.fromEvent(watcher, 'change');
ev
  .debounce(1000)
  .subscribe((path) => {
    console.log('path', path);
    startMocha();
  })

