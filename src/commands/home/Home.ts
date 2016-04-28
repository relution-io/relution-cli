import {Command} from './../Command';
import {SubCommand} from './../SubCommand';

export class Home extends Command{
  constructor(){
    super('Home', [new SubCommand('start')]);
    console.log(this.commands);
  }
}
