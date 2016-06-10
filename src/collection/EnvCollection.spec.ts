import {Environment} from './../commands/Environment';
import {RxFs} from './../utility/RxFs';
const expect = require('expect.js');
import * as path from 'path';

describe('EnVCollection a subset of environments', () => {
  let env = new Environment();
  // let question: any;
  let envFolder = path.join(process.cwd(), 'spec', 'gentest', 'envcollectiontest');
  let name = 'dev';

  before(() => {
    env.fsApi.path = envFolder;
    env._rootFolder = envFolder;
    env.envCollection.envFolder = envFolder;
    if (!RxFs.exist(envFolder)) {
      return RxFs.mkdir(envFolder).toPromise().then(() => {
        return env.preload().toPromise().then(() => {
          return env.createEnvironment(name).toPromise();
        });
      });
    }

    return env.preload().toPromise().then(() => {
      return env.createEnvironment(name).toPromise();
    });
  });

  it('has collection with entry dev', (done) => {
    console.log(env.envCollection.flatEnvArray());
    expect(env.envCollection.collection.length).to.be.greaterThan(0);
    expect(env.envCollection.flatEnvArray().indexOf('dev')).to.be.greaterThan(-1);
    done();
  });

  it('read a environment "dev"', (done) => {
    // let envModel: EnvModel = env.envCollection.isUnique('dev');
    expect(env.envCollection.collection[0].name).to.be(name);
    done();
  });

  after(() => {
    RxFs.rmDir(env.fsApi.path).subscribe({
      complete: () => {
        console.log(`${env.fsApi.path} is removed.`);
      }
    });
  });

});
