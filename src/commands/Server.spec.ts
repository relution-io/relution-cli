import {Server} from './Server';
const expect = require('expect.js');

describe('Command Server', () => {
  let server: Server = new Server();
  beforeEach(() => {
    server.preload().subscribe();
  });

  let commands: Array<string> = server.flatCommands();
  commands.forEach((method: string) => {
    it(`has ${method} as method`, (done) => {
      expect(server[method]).not.to.be(undefined);
      done();
    });
  });

  it('has server as name', (done) => {
    expect(server.name).to.be('server');
    done();
  });

});
