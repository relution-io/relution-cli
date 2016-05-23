import {Tower} from './Tower';
import {Observable, Subscriber} from '@reactivex/rxjs';
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
    let temp:any = command.init();
    done();
  });

  it('quit command on relution', done => {
    // let temp:any = command.init(['relution', 'quit']);
    // expect(temp.isUnsubscribed).to.be(true);
    // expect(temp.syncErrorValue).to.be(null);
    // expect(temp.syncErrorThrown).to.be(false);
    done();
  });
});
