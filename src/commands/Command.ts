import {SubCommand} from './SubCommand';

interface CommandInterface{
  name : String;
  commands:[SubCommand];
}

export class Command implements CommandInterface{
  /**
   * set the Command Root Name
   */
  public set name(v : string) {
    this.name = v;
  }
  /**
   * return the command name as a String
   */
  public get name() : string {
    return this.name;
  }
  /**
   * return the command name as a String
   */
  public set commands(v : [SubCommand]) {
    this.commands = v;
  }
  /**
   * get all availables subcommands from a Command
   */
  public get commands() : [SubCommand] {
    return this.commands;
  }
}
