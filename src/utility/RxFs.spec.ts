import {RxFs} from './RxFs';
import * as path from 'path';
const expect = require('expect.js');
describe('Utility RxFs', () => {

  it('create a folder', (done) => {
    let testPath = `${path.join(__dirname, '..', '..', 'spec', 'gentest', 'app')}`;
    RxFs.mkdir(testPath).subscribe(
      (log: any) => {
        expect(RxFs.exist(testPath)).to.be(true);
      },
      (e: Error) => {
        // console.error(e.message, e);
        done();
      },
      () => {
        done();
      }
    );
  });

  it('create a file', (done) => {
    let testPath = `${path.join(__dirname, '..', '..', 'spec', 'gentest', 'app')}/.gitkeep`;
    RxFs.writeFile(testPath, '').subscribe(
      (log: any) => {
        expect(RxFs.exist(testPath)).to.be(true);
      },
      (e: Error) => {
        console.error(e.message, e);
        done();
      },
      () => {
        done();
      }
    );
  });

  it('deleta a folder with files', (done) => {
    let testPath: string = path.join(__dirname, '..', '..', 'spec', 'gentest', 'app');

    RxFs.rmDir(testPath).subscribe(
      (log: any) => {
        // console.log('log', log);
        expect(RxFs.exist(testPath)).to.be(false);
      },
      (e: Error) => {
        console.error(e.message, e.stack);
        done();
      },
      () => {
        done();
      }
    );
  });
});
