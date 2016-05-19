import {FileApi} from './FileApi';
import {RxFs} from './RxFs';

import * as fs from 'fs';
import * as path from 'path';

const Hjson = require('hjson');

describe('File api', () => {
  let api:FileApi;

  beforeEach(() => {
    api = new FileApi();
  });

  it('read from a folder files by ext', (done) => {

    api.fileList(api.path, '.hjson').subscribe(
      (file:any) => {
        if (file) {
          expect(typeof file).toEqual('string');
          expect(file.indexOf('.hjson')).toBeGreaterThan(-1);
        }
      },
      (e: Error) => {
        //console.error(e.message, e.stack);
        done();
      },
      () => {done();}
    );
  });

  it('copy a Object', (done) => {
    let a:any = {name: 'a'};
    let b:any = api.copyHjson(a);
    b.name = 'b';
    expect(a.name).toBe('a');
    expect(b.name).toBe('b');
    done();
  });

  it('write a hjson file to spec test folder', (done) => {
    //wtf
    api.path = `${__dirname}/../../spec/gentest/`;

    let neenv = `{
      //mycomment
      name: test
    }`;

    api.writeHjson(neenv, 'test').subscribe({
      next: (written:boolean) => {
        expect(written).toBe(true);
      },
      error: (e:Error) => {
        //console.error(e.message, e.stack);
        done();
      },
      complete: () => {
        let exist:boolean = fs.existsSync(`${api.path}/test.hjson`);
        expect(exist).toBe(true);
        done();
      }
    });
  });

  it('read a hjson file to spec test folder', (done) => {
    api.path = `${__dirname}/../../spec/gentest/`;
    let filePath:string = `${api.path}/test.${api.hjsonSuffix}`;
    api.readHjson(filePath).subscribe({
      next: (file:any) => {
        expect(file.path).toBeDefined();
        expect(file.path).toBe(filePath);
        expect(file.data).toBeDefined();
        expect(file.data.name).toBe('test');
      },
      error: (e:Error) => {
        //console.error(e.message, e.stack);
        done();
      },
      complete: () => {
        done();
      }
    });
  });

  it('create a structure folder', (done) => {
    //wtf
    let goalPath: string = path.join(`${__dirname}/../../spec/gentest/structureFolderTest`);

    api.mkdirStructureFolder(goalPath).subscribe(
      (log: any) => {
        //console.log('mylog', JSON.stringify(log, null, 2));
        expect(RxFs.exist(goalPath)).toBe(true);
        expect(RxFs.exist(`${goalPath}/.gitkeep`)).toBe(true);
      },
      (e:Error) => {
        //console.error(e.message, e.stack);
        done();
      },
      () => {
        //console.log('completed');
        RxFs.rmDir(goalPath).subscribe();
        done();
      }
    )
  });


});
