import {Environment} from './Environment';
const expect = require('expect.js');
import * as sinon from 'sinon';
import * as path from 'path';
import {RxFs} from './../utility/RxFs';

describe('Command Environment', () => {
  let env: Environment = new Environment();
  let question: any;

  before(() => {
    question = env._addName;
    env.fsApi.path = path.join(process.cwd(), 'spec', 'gentest', 'env');
    return RxFs.mkdir(env.fsApi.path).toPromise().then(() => {
      expect(RxFs.exist(env.fsApi.path)).to.be(true);
      return env.preload().toPromise();
    });
  });

  it('have commands', (done) => {
    env.flatCommands().forEach((method: string) => {
      expect(env[method]).not.to.be(undefined);
    });
    done();
  });

  it('create a env with name dev', (done) => {
    sinon.stub(env.inquirer, 'prompt', (questions: any, cb: any) => {
      setTimeout(function () {
        cb({
          name: ['dev']
        });
      }, 0);
    });
    env.add().subscribe(
      (answers: any) => {
        console.log(answers);
      },
      (e: Error) => done(),
      () => done()
    );
  });

  it('has env as name', (done) => {
    expect(env.name).to.be('env');
    done();
  });

  after(() => {
    return RxFs.rmDir(env.fsApi.path).toPromise();
  });
});
