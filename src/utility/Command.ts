import {Observable, Observer} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import {UserRc} from './UserRc';
import {Table} from './Table';
import {Tower} from './../commands/Tower';
import {Translation} from './Translation';
import {DebugLog} from './DebugLog';
import {RelutionSdk} from './RelutionSDK';
const inquirer = require('inquirer');
const username = require('username');

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


export class Command implements CommandInterface {
  /**
   * Command name
   */
  public name: string;

  public commandDispatcher: any;

  public directMode: boolean = false;
  public userRc: UserRc = new UserRc();
  public config: any;
  public commands: Object;
  public inquirer = inquirer;

  public i18n = Translation;
  public log = DebugLog;
  public reserved: Array<string> = ['help', this.i18n.QUIT];
  public table: Table = new Table();
  public _parent: Tower;
  public relutionSDK = new RelutionSdk();
  constructor(name: string) {
    if (!name) {
      throw Error('Command need a name');
    }

    this.userRc.rcFileExist().subscribe((exist: boolean) => {
      if (exist) {
        this.userRc.streamRc().subscribe((data: any) => {
          this.config = data;
        });
      }
    });

    this.name = name;
  }
  /**
   * preload data
   */
  preload():Observable<any> {
    return Observable.create((observer:Observer<any>) => {
      this.userRc.rcFileExist().subscribe((exist: boolean) => {
        if (exist) {
          this.userRc.streamRc().subscribe((data: any) => {
            this.config = data;
            observer.complete();
          });
        }
      });
    });
  }

  home(){
    return this.init([this.name], this._parent);
  }

  quit(){
    return this.init([this.name], this._parent);
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
    //this.log.info('help', asArray);
    return Observable.create((observer: any) => {
      let content: any = [['', '', '', '']];
      //[this.name, '', '', '']
      let i = 0;
      this.flatCommands().forEach((commandName: string) => {
        let command: Array<string> = [chalk.green(this.name), chalk.cyan(commandName)];
        if (this.commands[commandName]) {
          if (commandName !== 'relution') {
            // && this.reserved.indexOf(commandName) === -1
            if (this.commands[commandName].vars) {
              let vars: Array<string> = Object.keys(this.commands[commandName].vars);
              let params:string = '';
              vars.forEach((param, index) => {
                params += chalk.yellow(`<$${param}>`);
                // this.log.info(index, vars.length, index !== (vars.length -1));
                if (index !== (vars.length -1) ){
                  params += ' ';
                }
              });
              if (params) {
                command.push(params);
              }
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
        observer.next(this.table.sidebar(content));
      } else {
        observer.next(content);
      }
      observer.complete();
    });
  }

  init(args: Array<string>, back: Tower) {
    // this.log.info(`Command.ts ${this.name}`, args);
    this._parent = back;
    let myObservable:Observable<any>;

    //directly
    if (args[0] === this.name && args.length === 1) {
      //is the help or command without any params
      return this.showCommands().subscribe(
        (answers: Array<string>) => {
          return this.init(answers[this.name], this._parent);
        },
        (e:any) => this.log.error(e)
      );
    }

    if (args.length >= 1 && args[0] === this.name && args[1] === Translation.QUIT) {
      // back to Tower
      return this._parent.home();
    }

    //we have this method maybe help we get ['server', 'help', 'param']
    //build this.help('param');
    // this.log.info('this[args[0]]', this[args[0]]);
    if (this[args[0]]) {
      // this.log.info('args.length > 1', args.length > 1);
      if (args.length > 1) {
        let params = this._copy(args);
        params.splice(0, 1);//remove 'update' or 'create'
        myObservable = this[args[0]](params);
      } else {
        myObservable =  this[args[0]]();
      }
    }

    // this.log.info('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
    //server add

    if (args[0] === this.name && this[args[1]]) {

      if (args.length > 2) {
        this.log.info('args.length > 2', args.length > 2);
        let subArgs: Array<string> = this._copy(args);
          subArgs.splice(0, 2);
          myObservable = this[args[1]](subArgs);
      } else {
        myObservable =  this[args[1]]();
      }
    }

    return myObservable.subscribe(
      (log: any) => {
        if (log && log.length) {
          this.log.log('cyan', log);
        }
      },
      (e:any) => this.log.error(e),
      () => {
        this.home();
      }
    );
  }

  _copy(org: any) {
    return JSON.parse(JSON.stringify(org));
  }

  flatCommands(): Array<string> {
    return Object.keys(this.commands);
  }

  setupCommandsForList() {
    let temp: Array<Object> = [];
    this.flatCommands().forEach((command) => {
      temp.push({
        name: command,
        value: [this.name, command]
      })
    })
    return temp;
  }

  showCommands(message: string = `Please Choose Your ${this.name} Command: `, type: string = 'list'): any {
    //this.log.info(new Date().getTime());
    if (!this.commands) {
      return Observable.throw(new Error(`Command ${this.name} has no commands!`));
    }
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
      }).catch((e:any) => {this.log.error(e)});
    });
  }
}
