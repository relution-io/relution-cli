import {Server} from './Server';

describe('Command Server', () => {
  let server:Server = new Server();
  beforeEach(() => {
    server.preload().subscribe();
  });

  let commands:Array<string> = server.flatCommands();
  commands.forEach((method:string) => {
    it(`has ${method} as method`, (done) => {
      expect(server[method]).toBeDefined();
      done();
    });
  });

  it('has server as name', (done) => {
    expect(server.name).toBe('server');
    done();
  });

})
