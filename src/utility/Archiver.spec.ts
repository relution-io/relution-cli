import {Archiver} from './Archiver';
import {Observable} from '@reactivex/rxjs';
import {RxFs} from './RxFs';
import * as path from 'path';
import * as chalk from 'chalk';
const figures = require('figures');

import {Create} from './../commands/project/Create';
const expect = require('expect.js');

describe('Utility Archiver', () => {
  let commandCreate: Create;
  let commandRoot: string = path.join(process.cwd(), 'spec', 'gentest', 'archiver');
  let archiver: Archiver = new Archiver(commandRoot);

  before(() => {
    commandCreate = new Create();
    commandCreate.npmInstall = () => {
      return Observable.empty();
    };
    commandCreate.rootProjectFolder = commandRoot;
    return RxFs.mkdir(commandRoot).toPromise().then(() => {
      expect(RxFs.exist(commandRoot)).to.be(true);
      return commandCreate.publish('test', true).toPromise();
    });
  });

  it('read files from without ignore', (done) => {
    archiver.createBundle().subscribe(
      (log: any) => {
        if (log.file || log.directory) {
          console.log(chalk.magenta(log.file ? `add file ${log.file}` : `add directory ${log.directory}`));
        } else if (log.zip) {
          console.log(chalk.green(log.message) + ' ' + figures.tick);
          expect(RxFs.exist(log.zip)).to.be(true);
          done();
        } else if (log.processed) {
          console.log(chalk.green(log.processed) + ' ' + figures.tick);
        }
      }
    );
  });

  after(() => {
    return RxFs.rmDir(commandRoot).toPromise();
  });
});
