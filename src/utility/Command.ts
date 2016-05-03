import {Observable, Observer} from '@reactivex/rxjs';
import {UserRc} from './UserRc';
import {Table} from './Table';
import * as chalk from 'chalk';

const inquirer = require('inquirer');
const username =  require('username');

interface CommandInterface {
  name: string;
  commandDispatcher: any;
  config: Object;
  commands?: Object;
}
/**
 *
 * ```javascript
 * import {Command} from './../utility/Command';
 * export class Server extends Command {
 *   constructor() {
 *    super('server');
 *    this.commandDispatcher.subscribe(this.init.bind(this));
 *   }
 * }
 * ```
 */
const QUIT: string = 'quit';

export class Command implements CommandInterface {

  public name: string;
  public commandDispatcher: any;
  public directMode: boolean = false;
  public userRc: UserRc;
  public config: any;
  public commands: Object;
  public inquirer:any = inquirer;
  public reserved: Array<string> = ['help', QUIT];
  public table: Table;
  public tableHeader: Array<string> = ['Command', 'Subcommand', 'Param/s', 'Description'];
  // public inquirer: InquirerHelper = new InquirerHelper();


  constructor(name: string) {
    if (!name) {
      throw Error('Command need a name');
    }

    this.table = new Table();
    this.userRc = new UserRc();

    this.userRc.rcFileExist().subscribe((exist: boolean) => {
      if (exist) {
        this.userRc.streamRc().subscribe((data: any) => {
          this.config = data;
        });
      }
    });

    this.name = name;

    this.commandDispatcher = Observable.create((observer: any) => {
      if (process.argv.length <= 2) {
        observer.complete();
      }
      let args = this._copy(process.argv);
      args.splice(0, 2);
      observer.next(args);
      observer.complete();
    })
      .catch((e: any) => {
        throw new Error(e);
      })
      .filter((data: Array<string>) => {
        return data[0] === this.name;
      });
  }
  /**
   * @description shows a list of Available commands form the Command like this
   * ```bash
   * ┌─────────┬────────────┬─────────┬────────────────────────────────┐
     │ command │ subcommand │ params  │ description                    │
     │ server  │ create     │ <$name> │ add a new BaaS Server          │
     │ server  │ list       │ <$name> │ list all available BaaS Server │
     │ server  │ rm         │ <$name> │ remove a server form the list  │
     │ server  │ help       │ --      │ List the Server Command        │
     │ server  │ quit       │ --      │ Exit To Home                   │
     └─────────┴────────────┴─────────┴────────────────────────────────┘
   * ```
   */
  help(asArray: boolean = false) {
    console.log('help', asArray);
    return Observable.create((observer: any) => {
      let content: any = [['', '', '', '']];
      //[this.name, '', '', '']
      let i = 0;
      this.flatCommands().forEach((commandName: string) => {
        let command: Array<string> = [chalk.green(this.name), chalk.cyan(commandName)];
        if ( this.commands[commandName]) {
          if (commandName !== 'relution' ) {
            // && this.reserved.indexOf(commandName) === -1
            if (this.commands[commandName].vars) {
              let vars: Array<string> = Object.keys(this.commands[commandName].vars);
              vars.forEach((param) => {
                command.push(chalk.yellow(`<$${param}>`));
              })
            } else {
              command.push('--');
            }
            command.push(this.commands[commandName].description || '--');
            content.push(command);
            i++;
          }
        }
      });
      content.push(['', '', '', '']);
      if (!asArray) {
        observer.next(this.table.sidebar(this.tableHeader, content));
      } else {
        observer.next(content);
      }
      observer.complete();
    });
  }

  init(args: Array<string>, back:any) {
    console.log('Command.ts', args);
    //directly
    if (args[0] === this.name && args.length === 1) {
      return this.showCommands().subscribe((answers:Array<string>) => {
        // console.log('answers', answers);
        return this.init(answers[this.name], back);
      });
    }

    if (args.length >= 1 && args[0] === this.name && args[1] === QUIT) {
      return back.home()
    }

    //we have this method maybe help we get ['server', 'help', 'param']
    //build this.help('param');
    // console.log('this[args[0]]', this[args[0]]);
    if (this[args[0]]) {
      // console.log('args.length > 1', args.length > 1);
      if (args.length > 1) {
        args.splice(0,1);
        return this[args[0]](args);
      }
      return this[args[0]]();
    }

    // console.log('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
    //server add

    if (args[0] === this.name && this[args[1]] ) {

      if (args.length > 2) {
        console.log('args.length > 2', args.length > 2);
        args.splice(0,2);
        return this[args[1]](args);
      }
      return this[args[1]]().subscribe(
        (log:any) => {
          console.log(log);
        },
        (e:any) => {
          console.error(e);
          process.exit();
        },
        () => {
          this.init([this.name], back)
        }
      );
    }
  }

  _copy(org: any) {
    return JSON.parse(JSON.stringify(org));
  }

  flatCommands(): Array<string> {
    return Object.keys(this.commands);
  }

  setupCommandsForList() {
    let temp:Array<Object> = [];
    this.flatCommands().forEach((command) => {
      temp.push({
        name: command,
        value: [this.name, command]
      })
    })
    return temp;
  }

  showCommands(message: string = "Please Choose Your Option: ", type: string = 'list'): any {
    let questions = [
      {
        name: this.name,
        message: message,
        type: type,
        choices: this.setupCommandsForList(),
        filter: function (str: Array<string>) {
          return str;
        }
      }
    ];

    return Observable.create((observer: any) => {
      inquirer.prompt(questions).then((answers: Array<string>) => {
        observer.next(answers);
        observer.complete();
      });
    });
  }
}
