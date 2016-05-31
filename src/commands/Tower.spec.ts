import {Tower} from './Tower';
const expect = require('expect.js');

describe('Commands Tower Relution', () => {
  let command: Tower;

  beforeEach(() => {
    command = new Tower({});
  });

  it('has name relution', done => {
    expect(command.name).to.equal('relution');
    done();
  });

  it('help command on relution', done => {
    expect(command.help).to.be(!undefined);
    done();
  });

  it('quit command on relution', done => {
    expect(command.quit).to.be(!undefined);
    done();
  });
});
