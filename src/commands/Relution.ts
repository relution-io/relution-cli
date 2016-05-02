import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
let readline = require('readline');

export class Relution extends Command {
  public rl: any;

  public staticCommands: Object;
  public args: Array<string> = [];
  public reserved: Array<string> = ['help', 'quit', 'relution'];
  public readlineEmitter: Observable<string>;

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

    //Terminal input watcher
    this.rl = readline.createInterface(process.stdin, process.stdout);
    this.rl.setPrompt('$relution: ');
    this.rl.prompt();

    this.readlineEmitter = Observable.fromEvent<string>(this.rl, 'line');
    this.staticCommands = staticCommands;
    this.commandDispatcher.subscribe(this.init.bind(this));
    this.inputListener();
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
            this.rl.prompt();
            break;
          default:
            this.init(line.trim().split(' '));
            break;
        }
      }
    )
  }

  init(args: Array<string>) {
    super.init(args);
    console.log('args', args);

    let subcommand = this.isSubcommand(args);
    if (subcommand.length) {
      //not for relution delegate to subcommand
      console.log('yeah iam subcommand', subcommand);
      let subargs = this._copy(args);
      subargs.splice(0, 1);
      return this.subCommand(subargs, args[0]).subscribe(
        (scenario: any) => {
          console.log(scenario);
        },
        (e: any) => {
          throw Error(e);
        },
        () => {
          console.log('subcommand done', subargs)
          this.rl.prompt();
        }
      );

    } else if (args[0] === this.name && args[1] === 'help') {
      //relution help
      return this.help();
    } else if (args[0] === this.name && args[1] === 'quit') {
      //relution quit
      return this.quit();
    } else if (args[0] === this.name && args.length === 1) {
      //only relution
      console.log('only prompt');
      return this.showCommands().subscribe((answer:any) => {
        console.log(JSON.stringify(answer, null, 2));
        console.log(answer[this.name]);
        let subcommand:string = this.isSubcommand([answer[this.name]]);
        console.log( subcommand )
        if (subcommand.length) {
          return this.subCommand([], subcommand).subscribe((response:any) => {
            console.log(response);
            this.rl.prompt();
          }, (e:any) => {
            console.log(e);
          }, () => {
            console.log('done');
          });
        } else {
          this[answer[this.name]]().subscribe(() => {
            this.rl.prompt();
          });
        }
      })
    } else {
      console.log('this command is not available');
      return this.showCommands().subscribe(() => {
        this.rl.prompt();
      });
    }
  }

  /**
   * if is available in subcommands
   */
  isSubcommand(args:Array<string>): string {
    let subcommand: any = null;
    if (args[0] !== this.name) {
      Object.keys(this.staticCommands).forEach((command) => {
        if (this.staticCommands[command].name === args[0]) {
          if (!this.staticCommands[command].init) {
            throw new Error(`a commmand need a init Method ${args[0]}`);
          }
          subcommand = command;
        }
      });
      return subcommand;
    }
    return '';
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
        this.rl.prompt();
      }
    );
  }

  /**
   * flat the top commands
   */
  flatCommands(){
    let list:Array<string> = Object.keys(this.commands);
    let subList:Array<string> = Object.keys(this.staticCommands);
    let av:Array<string> = subList.concat(list);
    return av;
  }
}
