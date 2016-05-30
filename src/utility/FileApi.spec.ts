import {FileApi} from './FileApi';
import {RxFs} from './RxFs';
import * as fs from 'fs';
import * as path from 'path';
const expect = require('expect.js');

describe('File api', () => {
  let api: FileApi;

  beforeEach(() => {
    api = new FileApi();
  });

  it('read from a folder files by ext', (done) => {

    api.fileList(api.path, '.hjson').subscribe(
      (file: any) => {
        if (file) {
          expect(typeof file).to.be.equal('string');
          expect(file.indexOf('.hjson')).to.be.greaterThen(-1);
        }
      },
      (e: Error) => {
        // console.error(e.message, e.stack);
        done();
      },
      () => { done(); }
    );
  });

  it('copy a Object', (done) => {
    let a: any = { name: 'a' };
    let b: any = api.copyHjson(a);
    b.name = 'b';
    expect(a.name).to.be('a');
    expect(b.name).to.be('b');
    done();
  });

  it('write a hjson file to spec test folder', (done) => {
    api.path = `${__dirname}/../../spec/gentest/`;

    let neenv = `{
      //mycomment
      name: test
    }`;

    api.writeHjson(neenv, 'test').subscribe({
      next: (written: boolean) => {
        console.log(written);
        expect(RxFs.exist(path.join(api.path, 'test.hjson'))).to.be(true);
      },
      error: (e: Error) => {
        // console.error(e.message, e.stack);
        done();
      },
      complete: () => {
        let exist: boolean = fs.existsSync(`${api.path}/test.hjson`);
        expect(exist).to.be(true);
        done();
      }
    });
  });

  it('read a hjson file to spec test folder', (done) => {
    api.path = `${__dirname}/../../spec/gentest/`;
    let filePath = `${api.path}/test.${api.hjsonSuffix}`;

    api.readHjson(filePath).subscribe({
      next: (file: any) => {
        expect(file.path).not.to.be(undefined);
        expect(file.path).to.be(filePath);
        expect(file.data).not.to.be(undefined);
        expect(file.data.name).to.be('test');
      },
      error: (e: Error) => {
        // console.error(e.message, e.stack);
        done();
      },
      complete: () => {
        done();
      }
    });
  });

  it('create a structure folder', (done) => {
    let goalPath: string = path.join(`${__dirname}/../../spec/gentest/structureFolderTest`);

    api.mkdirStructureFolder(goalPath).subscribe(
      (log: any) => {
        // console.log('mylog', JSON.stringify(log, null, 2));

      },
      (e: Error) => {
        // console.error(e.message, e.stack);
        done();
      },
      () => {
        // console.log('completed');
        expect(RxFs.exist(goalPath)).to.be(true);
        expect(RxFs.exist(`${goalPath}/.gitkeep`)).to.be(true);
        done();
      }
    )
  });

  it('delete the structure Folder', (done) => {
    let goalPath: string = path.join(`${__dirname}/../../spec/gentest/structureFolderTest`);
    RxFs.rmDir(goalPath).debounceTime(1000).subscribe({
      complete: () => {
        expect(RxFs.exist(goalPath)).to.be(false);
        done();
      }
    });
  });

});
