import {Command} from './Command';

describe('Utility Command', () => {
  let command:Command;

  beforeEach(() => {
    command = new Command('test');
    command.commands = {
      create: {
        description: 'test the commands'
      }
    }
    return command;
  });

  it('has a name', done => {
    expect(command.name).toEqual('test');
    done();
  });

  it('has commands', done => {
    expect(command.flatCommands()).toEqual(['create']);
    expect(command.help).not.toBeUndefined();
    expect(command.quit).not.toBeUndefined();
    expect(command.showCommands).not.toBeUndefined();
    done();
  });

  it('has command inquirer list', done => {
    command.showCommands();
    done();
  });
});
