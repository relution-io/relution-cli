import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
let readline = require('readline');

export class Relution extends Command {
  public rl: any;
  public staticCommands: Object;
  public args: Array<string> = [];
  public reserved: Array<string> = ['help', 'quit', 'relution'];

  public commands: Object = {
    help: {
      description: 'list available Commands'
    },
    quit: {
      description: 'Exit To Home'
    }
  };
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
    } else if ( args[1] === 'help') {
      return this.help();
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

  help () {
    let header: any = ['Command', 'Subcommand', 'Param/s', 'Description'];
    let comp:any = [];
    let helpBatch: any = [super.help(true)];

    Object.keys(this.staticCommands).forEach((command) => {
      helpBatch.push(this.staticCommands[command].help(true));
    });

    return Observable.forkJoin(helpBatch).subscribe(
      (comm:any) => {
        comm.forEach((ob:any) => {
          ob.forEach((o:any) => {
            comp.push(o);
          })
        });
      },
      (e:Error) => {
        console.error(e);
      },
      () => {
        console.log(this.table.sidebar(header, comp));
      }
    );
  }
}
