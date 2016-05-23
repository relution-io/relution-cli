import {RelutionHjson as RelutionHjsonTemplate} from './RelutionHjson';
import {FileApi} from './../../../utility/FileApi';
import * as fs from 'fs';
import * as path from 'path';
const expect = require('expect.js');

let dummy: any = {
  name: 'testfoobar',
  uuid: '0eb20550-1c09-11e6-a4a9-3bb21d599b6c',
  server: 'test.js',
  description: 'my own description',
  private: false,
  directoryIndex: true,
  baseAlias: 'testfoobarAlias'
};
let dummyKeys: Array<string> = Object.keys(dummy);


describe('create RelutionHjson Template', () => {
  let rHjson: RelutionHjsonTemplate = new RelutionHjsonTemplate();
  let fsApi: FileApi = new FileApi();
  let devtestPath: string = path.join(__dirname, '..', '..', '..', '..', 'spec', 'gentest', 'new');
  let readHjsonPath: string;

  beforeEach(() => {

    fsApi.path = `${devtestPath}/`;
    readHjsonPath = `${fsApi.path}${rHjson.publishName}`;

    dummyKeys.forEach((key: any) => {
      rHjson[key] = dummy[key];
    });
  });

  dummyKeys.forEach((key: any) => {
    it(`has a public ${key}`, (done) => {
      if (key === 'baseAlias') {
        expect(rHjson[key]).toBe(`/${dummy[key]}`);
      } else if (key === 'server') {
        expect(rHjson[key]).toBe(`./${dummy[key]}`);
      } else {
        expect(rHjson[key]).toBe(dummy[key]);
      }
      done();
    });
  });

  it('generate a relution.hjson file with template', (done) => {
    fsApi.writeHjson(rHjson.template, 'relution').subscribe({
      error: (e: any) => {
        console.error(e);
      },
      complete: () => {
        let stats: any = fs.statSync(`${fsApi.path}${rHjson.publishName}`);
        expect(stats.blocks).toBe(8);
        done();
      }
    });
  });
});

describe('read RelutionHjson Template', () => {
  let rHjson: RelutionHjsonTemplate = new RelutionHjsonTemplate();
  let fsApi: FileApi = new FileApi();
  let devtestPath: string = path.join(__dirname, '..', '..', '..', '..', 'spec', 'gentest', 'new');
  let readHjsonPath: string;
  let data: any = null;
  fsApi.path = `${devtestPath}/`;
  readHjsonPath = `${fsApi.path}${rHjson.publishName}`;

  dummyKeys.forEach((key: any) => {
    it(`relution.hjson has a key ${key}`, (done) => {
      fsApi.readHjson(readHjsonPath).subscribe({
        next: (result: any) => {
          data = fsApi.copyHjson(result.data);
          if (key === 'baseAlias') {
            expect(data[key]).toBe(`/${dummy[key]}`);
          } else if (key === 'server') {
            expect(data[key]).toBe(`./${dummy[key]}`);
          } else {
            expect(data[key]).toBe(dummy[key]);
          }
          done();
        },
        error: (e: any) => {
          console.error(e);
        }
      });
    });
  });
});
