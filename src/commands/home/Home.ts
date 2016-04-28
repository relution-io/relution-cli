import {Command} from './../Command';
import {SubCommand} from './../SubCommand';

export class Home extends Command{
  constructor(){
    super();
    this.name = 'Home';
    this.commands = [new SubCommand('start')];
    console.log(this.commands);
  }
}
