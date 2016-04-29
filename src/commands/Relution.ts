import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
let readline = require('readline');

export class Relution extends Command {
  public rl: any;
  public staticCommands: Object;
  public args: Array<string> = [];
  public reserved: Array<string> = ['help', 'quit', 'relution'];

  constructor(staticCommands:Object) {
    super('relution');
    this.rl = readline.createInterface(process.stdin, process.stdout);
    this.rl.setPrompt('$relution: ');
    this.rl.prompt();
    this.staticCommands = staticCommands;
    this.commandDispatcher.subscribe(this.init.bind(this));
  }

  init(args:Array<string>) {

    super.init(args);
    let subcommand:any = null;

    Object.keys(this.staticCommands).forEach((command) => {
      if (this.staticCommands[command].name === args[1]) {
        if (!this.staticCommands[command].init) {
          throw new Error('a commmand need a init Method');
        }
        subcommand = command;
      }
    });

    let subargs = this._copy(args);
    subargs.splice(0, 1);

    if (subcommand) {
      return this.subCommand(subargs, subcommand).subscribe(
        (scenario:any) => {
          console.log(scenario);
        },
        (e:any) => {
          throw Error(e);
        },
        () => {
          console.log('subcommand done', subargs)
        }
      );
    }
  }

  subCommand(args: Array<string>, command: string){
    return Observable.create((observer:any) => {
      this.staticCommands[command].init(args).subscribe(
        (scenario: any) => {
          observer.next(scenario)
        },
        (e:any) => {
          observer.error(e);
        },
        () => {
          observer.complete();
        }
       );
    });
  }
}
