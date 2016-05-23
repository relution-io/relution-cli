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
    expect(command.name).to.equal('test');
    done();
  });

  it('has commands', done => {
    expect(command.flatCommands().toString()).to.equal(['create', 'help'].toString());
    expect(command.showCommands).not.to.be(undefined);
    done();
  });

  it('has a help method', done => {
    expect(command.help).not.to.be(undefined);
    done();
  });

  it('has a home method', done => {
    expect(command.home).not.to.be(undefined);
    done();
  });
});

