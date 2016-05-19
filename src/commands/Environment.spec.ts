import {Environment} from './Environment';

describe('Command Environment', () => {
  let env:Environment = new Environment();
  beforeEach(() => {
    env.preload().subscribe();
  });

  let commands:Array<string> = env.flatCommands();
  commands.forEach((method:string) => {
    it(`has ${method} as method`, (done) => {
      expect(env[method]).toBeDefined();
      done();
    });
  });

  it('has env as name', (done) => {
    expect(env.name).toBe('env');
    done();
  });
})
