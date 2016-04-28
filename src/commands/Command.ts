import {SubCommand} from './SubCommand';

interface CommandInterface{
  name : String;
  commands:[SubCommand];
}

export class Command implements CommandInterface{
  public name:string;
  public commands: [SubCommand];

  constructor(name: string, commands?: [SubCommand]) {

    if (!name || !name.length) {
      throw new Error('Command cant be used without a Name');
    }

    this.name = name;
    if (commands.length) {
      this.commands = commands;
    }
  }
}
