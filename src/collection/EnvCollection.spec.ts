import {EnvModel} from './../models/EnvModel';
import {Environment} from './../commands/Environment';
import {RxFs} from './../utility/RxFs';
const expect = require('expect.js');
import * as path from 'path';

describe('EnVCollection a subset of environments', () => {
  let command:Environment;

  before(() => {
    command = new Environment();
    command.fsApi.path = path.join(process.cwd(), 'spec', 'gentest', 'env') + '/';
    command.envCollection.envFolder = command.fsApi.path;
    console.log(command.fsApi.path);
    RxFs.mkdir(command.fsApi.path).subscribe({
      complete: () => {
        console.log(`${command.fsApi.path} is created.`);
      }
    });
  });

  it('create a environment "dev"', (done) => {
    command.add(['dev']).subscribe({
      next: (log:any) => {
        console.log(log);
      },
      complete:() => {
        expect(RxFs.exist(path.join(command.fsApi.path, 'dev.hjson'))).toBe(true);
        console.log('envCollection.collection', command.envCollection.collection);
        done();
      }
    });
  });

  it ('has collection with entry dev', (done) => {
    console.log(command.envCollection.flatEnvArray());
    expect(command.envCollection.collection.length).toBeGreaterThan(0);
    expect(command.envCollection.flatEnvArray().indexOf('dev')).toBeGreaterThan(-1);
    done();
  });

  it('read a environment "dev"', (done) => {
    let env:EnvModel = command.envCollection.isUnique('dev');
    expect(env.name).toBe('dev');
    done();
  });

  after(() => {
    RxFs.rmDir(command.fsApi.path).subscribe({
      complete: () => {
        console.log(`${command.fsApi.path} is removed.`);
      }
    });
  });
});
