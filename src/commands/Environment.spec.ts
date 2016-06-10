import {Environment} from './Environment';
const expect = require('expect.js');
import * as path from 'path';
import {RxFs} from './../utility/RxFs';

describe('Command Environment', () => {
  let env = new Environment();
  // let question: any;
  let envFolder = path.join(process.cwd(), 'spec', 'gentest', 'env');
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

  env.flatCommands().forEach((method: string) => {
    it(`have command ${method}`, (done) => {
      expect(env[method]).not.to.be(undefined);
      done();
    });
  });

  it('have a root folder', (done) => {
    expect(env._rootFolder).to.be(envFolder);
    expect(RxFs.exist(envFolder)).to.be(true);
    done();
  });

  it('envCollection has Model with name dev', (done) => {
    expect(env.envCollection.collection.length).to.be(1);
    expect(env.envCollection.collection[0].name).to.be(name);
    done();
  });

  after(() => {
    setTimeout(() => {
      return RxFs.rmDir(env.fsApi.path).toPromise();
    }, 1800);
  });
});
