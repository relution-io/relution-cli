import {RxFs} from './RxFs';
import * as path from 'path';

describe('Utility RxFs', () => {

  it('create a folder', (done) => {
    let testPath: string = `${path.join(__dirname, '..', '..', 'spec', 'gentest', 'app')}`;
    RxFs.mkdir(testPath).subscribe(
      (log:any) => {
        expect(RxFs.exist(testPath)).toBe(true);
      },
      (e: Error) => {
        //console.error(e.message, e);
        done();
      },
      () => {
        done();
      }
    );
  });

  it('create a file', (done) => {
    let testPath: string = `${path.join(__dirname, '..', '..', 'spec', 'gentest', 'app')}/.gitkeep`;
    RxFs.writeFile(testPath, 'nur mit ?').subscribe(
      (log:any) => {
        expect(RxFs.exist(testPath)).toBe(true);
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
});
