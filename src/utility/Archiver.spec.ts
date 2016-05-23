import {Archiver} from './Archiver';
import {RxFs} from './RxFs';
import * as path from 'path';
import * as assert from 'assert';
import * as chalk from 'chalk';
const figures =  require('figures');

import {Create} from './../commands/new/Create';
const expect = require('expect.js');

describe('Utility Archiver', () => {
  let commandCreate: Create;
  let commandRoot: string = path.join(process.cwd(), 'spec', 'gentest', 'archiver');
  let archiver:Archiver = new Archiver(commandRoot);

  before((done) => {
    if (!RxFs.exist(commandRoot)) {
      commandCreate = new Create();
      commandCreate.rootProjectFolder = commandRoot;

      return RxFs.mkdir(commandRoot).subscribe({
        complete: () => {
          expect(RxFs.exist(commandRoot)).to.be(true);
          commandCreate.publish('test', true).subscribe({
            complete: () => {
              commandCreate.emptyFolders.forEach((dir) => {
                expect(RxFs.exist(path.join(commandRoot, dir))).to.be(true);
              });
              done();
            }
          });
        }
      });
    } else {
      commandCreate = new Create();
      commandCreate.rootProjectFolder = commandRoot;
    }
  });

  it('read files from without ignore', (done) => {
    archiver.projectFiles().subscribe((log:any) => {
      if (log.file || log.directory) {
        console.log(chalk.magenta(log.file ? `add file ${log.file}` : `add directory ${log.directory}`));
      } else if (log.zip) {
        console.log(chalk.green(log.message) +' ' + figures.tick);
        expect(RxFs.exist(log.zip)).to.be(true);
      } else if (log.processed) {
        console.log(chalk.green(log.processed) +' ' + figures.tick);
      }
    });
    done();

  })
  after(() => {
    // RxFs.rmDir(commandRoot).subscribe({
    //   complete: () => {
    //     expect(RxFs.exist(commandRoot)).to.be(false);
    //   }
    // });
  });
})
