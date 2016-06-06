import {Create} from './Create';
import * as path from 'path';
import {RxFs} from './../../utility/RxFs';
const expect = require('expect.js');
import {Observable} from '@reactivex/rxjs';

describe('New Create', () => {
  let commandCreate: Create;
  let commandRoot: string = path.join(process.cwd(), 'spec', 'gentest', 'create');
  before(() => {
    RxFs.mkdir(commandRoot).subscribe({
      complete: () => {
        expect(RxFs.exist(commandRoot)).to.be(true);
      }
    });
    commandCreate = new Create();
    commandCreate.npmInstall = () => {
      return Observable.empty();
    };
    commandCreate.rootProjectFolder = commandRoot;
  });

  it('have templates', (done) => {
    expect(commandCreate.toGenTemplatesName).not.to.be(undefined);
    expect(commandCreate.toGenTemplatesName.length).to.be.greaterThan(0);
    done();
  });

  it('have folders to generate', (done) => {
    expect(commandCreate.emptyFolders).not.to.be(undefined);
    expect(commandCreate.emptyFolders.length).to.be.greaterThan(0);
    done();
  });

  it('create templates', (done) => {
    // commandCreate.publish('test', true).subscribe({
    //   complete: () => {
    //     commandCreate.emptyFolders.forEach((dir) => {
    //       expect(RxFs.exist(path.join(commandRoot, dir))).to.be(true);
    //     });
    //     done();
    //   }
    // })
  });

  after(() => {
    RxFs.rmDir(commandRoot).subscribe({
      complete: () => {
        expect(RxFs.exist(commandRoot)).to.be(false);
      }
    });
  });
})
