import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
let readline = require('readline');

export class Relution extends Command {
  public rl: any;

  public staticCommands: Object;
  public args: Array<string> = [];
  public reserved: Array<string> = ['help', 'quit', 'relution'];
  public readlineEmitter: Observable<string>;
  public staticCommandRootKeys: Array<string>;

  public commands: Object = {
    help: {
      description: 'list available Commands'
    },
    quit: {
      description: 'Exit To Home'
    }
  };

  constructor(staticCommands: Object) {
    super('relution');
    this.staticCommands = staticCommands;
    this.staticCommandRootKeys = Object.keys(staticCommands);
    this.commandDispatcher.subscribe(this.init.bind(this));
  }

  /**
   * listen on the Terminal if the user is adding something
   */
  inputListener() {
    this.readlineEmitter.subscribe(
      (line) => {
        console.log('command coming', line);
        switch (line.trim()) {
          case 'q':
          case 'quit':
            this.quit();
            break;
          case 'h':
          case 'help':
            this.help();
            break;
          case '':
            // this.rl.prompt();
            break;
          default:
            this.init(line.trim().split(' '));
            break;
        }
      }
    )
  }

  init(args: Array<string>) {
    console.log('Relution', args);

    //only relution
    if (args[0] === this.name && args.length === 1) {
      return this.showCommands();
      // .subscribe((answers:Array<string>) => {
      //   return this.init(answers);
      // });
    }

    //not in reserved and like ['relution', 'server', 'add'] => ['server', 'add']
    if (args[0] === this.name && args.length >= 1 && this.reserved.indexOf(args[1]) === -1) {
      args.splice(0, 1);
    }

    //if from subcommand a method ?
    if (this.staticCommandRootKeys.indexOf(args[0]) !== -1) {

      //only ['server']
      if (args[0] === this.staticCommands[args[0]].name && args.length === 1) {
        console.log(`trigger static ${args[0]} showCommands`);
         return this.staticCommands[args[0]].showCommands();
      }
      //['server', 'add']
      //not for relution delegate to subcommand
      console.log('trigger static command', this.staticCommands[args[0]][args[1]].toString());
      let subargs = this._copy(args);
      subargs.splice(0, 1);
      return this.subCommand(subargs, args[0]);
    }

    //no its a relution command like help or quit ['help']
    if (this.reserved.indexOf(args[0]) !== -1 ) {
      //[relution, help] => to ['help']
      if (args[0] === this.name) {
        args.splice(0, 1);
      }

      if (this[args[0]]) {
        if (args.length > 1) {
          return this[args[0]](args);
        }
        return this[args[0]]();
      }
    }
  }
  /**
   * user help options
   */
  help() {
    let comp: any = [];
    let helpBatch: any = [super.help(true)];

    Object.keys(this.staticCommands).forEach((command) => {
      helpBatch.push(this.staticCommands[command].help(true));
    });

    return Observable.forkJoin(helpBatch).subscribe(
      (comm: any) => {
        comm.forEach((ob: any) => {
          ob.forEach((o: any) => {
            comp.push(o);
          })
        });
      },
      (e: Error) => {
        console.error(e);
      },
      () => {
        console.log(this.table.sidebar(this.tableHeader, comp));
        // this.rl.prompt();
      }
    );
  }

   /**
   * trigger a subcommand an return if is completed
   */
  subCommand(args: Array<string>, command: string) {
    return Observable.create((observer: any) => {
      this.staticCommands[command].init(args).subscribe(
        (scenario: any) => {
          observer.next(scenario)
        },
        (e: any) => {
          observer.error(e);
        },
        () => {
          observer.complete();
        }
      );
    });
  }


  /**
   * flat the top commands is been overwritten because we need the subcommands two
   */
  flatCommands(){
    let list:Array<string> = Object.keys(this.commands);
    let subList:Array<string> = Object.keys(this.staticCommands);
    let av:Array<string> = subList.concat(list);
    return av;
  }
}
