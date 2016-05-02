import {Relution} from './Relution';
import {Observable, Subscriber} from '@reactivex/rxjs';

describe('Commands Relution', () => {
  let command: Relution;

  beforeEach(() => {
    command = new Relution({});
  });

  it('has name relution', done => {
    expect(command.name).toEqual('relution');
    done();
  });

  it('help command on relution', done => {
    let temp:any = command.init(['relution', 'help']);
    expect(temp.isUnsubscribed).toBe(true);
    expect(temp.syncErrorValue).toBe(null);
    expect(temp.syncErrorThrown).toBe(false);
    done();
  });

  it('quit command on relution', done => {
    // let temp:any = command.init(['relution', 'quit']);
    // expect(temp.isUnsubscribed).toBe(true);
    // expect(temp.syncErrorValue).toBe(null);
    // expect(temp.syncErrorThrown).toBe(false);
    done();
  });
});
