import {Command} from './Command';
const expect = require('expect.js');

describe('Utility Command', () => {
  let command:Command;

  beforeEach(() => {
    command = new Command('test');
    command.commands = {
      create: {
        description: 'test the commands'
      },
      help: {
        description: 'whatever'
      }
    }
    return command;
  });

  it('has a name', done => {
    expect(command.name).toEqual('test');
    done();
  });

  it('has commands', done => {
    expect(command.flatCommands()).toEqual(['create', 'help']);
    expect(command.showCommands).not.toBeUndefined();
    done();
  });

  it('has a help method', done => {
    expect(command.help).not.toBeUndefined();
    done();
  });

  it('has a home method', done => {
    expect(command.home).not.toBeUndefined();
    done();
  });
});

