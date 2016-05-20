import {Create} from './Create';
import * as path from 'path';
import {RxFs} from './../../utility/RxFs';

describe('New Create', () => {
  let commandCreate:Create;
  let commandRoot:string = path.join(process.cwd(), 'spec', 'gentest', 'create');
  beforeAll(() => {
    RxFs.mkdir(commandRoot).subscribe({
      complete: () => {
        expect(RxFs.exist(commandRoot)).toBe(true);
      }
    });
    commandCreate = new Create();
    commandCreate.rootProjectFolder = commandRoot;
  });

  it('have templates', (done) => {
    expect(commandCreate.toGenTemplatesName).toBeDefined();
    expect(commandCreate.toGenTemplatesName.length).toBeGreaterThan(0);
    done();
  });

  it('have folders to generate', (done) => {
    expect(commandCreate.emptyFolders).toBeDefined();
    expect(commandCreate.emptyFolders.length).toBeGreaterThan(0);
    done();
  });

  it('create templates', (done) => {
    commandCreate.publish('test', true).subscribe({
      complete: () => {
        commandCreate.emptyFolders.forEach((dir) => {
          expect(RxFs.exist(path.join(commandRoot, dir))).toBe(true);
        });
        done();
      }
    })
  });

  afterAll(() => {
    RxFs.rmDir(commandRoot).subscribe({
      complete: () => {
        expect(RxFs.exist(commandRoot)).toBe(false);
      }
    });
  });
})
