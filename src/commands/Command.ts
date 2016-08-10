import {Observable} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import {UserRc} from './../utility/UserRc';
import {Table} from './../utility/Table';
import {Tower} from './../commands/Tower';
import {Translation} from './../utility/Translation';
import {DebugLog} from './../utility/DebugLog';
import {RelutionSdk} from './../utility/RelutionSDK';

const inquirer = require('inquirer');

interface CommandInterface {
  _parent: Tower;
  name: string;
  commandDispatcher: any;
  config: Object;
  commands?: Object;
  i18n: Translation;
  log: DebugLog;
  table: Table;
  userRc: UserRc;
  inquirer: any;
  relutionSDK: RelutionSdk;
  help: () => {};
  back: () => {};
  showCommands: () => {};
}

/**
 *
 * Important All Subcommand have to return an Observable
 * ##### Add a new Command
 *
 *```javascript
 *
 * import {Command} from './Command';
 *
 * export MyCommand extends Command{
 *  constructor(){
 *    super('myCommand');
 *  }
 *
 *  public commmands = {
 *    subcommand: {
 *      label: 'My Label', // is shown in the showCommands list
 *      description: 'My own Command', // is shown in the help as description
 *      method: 'mySubCommandMethod', // you can set the method if you want default MyCommand.subcommand()
 *      when: (): boolean => { // disabled ?
 *        return true;
 *      },
 *      why: () => { // why is it disabled
 *        return `is disabled why`;
 *      },
 *      vars: { // allow params on this subcommand
 *        name: {
 *          pos: 0
 *        }
 *      }
 *    }
 *  }
 * }
 *
 * public mySubCommandMethod(name?:string): Observable<empty> {
 *  return Observable.empty();
 * }
 *```
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
  preload(): any {
    return this.userRc.rcFileExist().do(
      (exist: boolean) => {
      // if (this.name === 'env') {
        // console.log(this.name);
      // }
      if (exist) {
        this.userRc.streamRc().do((data: any) => {
          this.config = data;
        });
      }
    },
    (e: Error) => {
      console.error(e);
    });
  }

  home() {
    return this.init([this.name]);
  }

  back() {
    return this.init([this.name]);
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
     │ server  │ back       │ --      │ Exit To Home                   │
     └─────────┴────────────┴─────────┴────────────────────────────────┘
   * ```
   */
  help(asArray = false) {
    // this.log.info('help', asArray);
    return Observable.create((observer: any) => {
      let content: any = [['', '', '', '']];
      // [this.name, '', '', '']
      let i = 0;
      this.flatCommands().forEach((commandName: string) => {
        let disabled = this.commandIsDisabled(this.commands[commandName], commandName, this.commands[commandName].description);
        let color = _.isNil(disabled) ? 'green' : 'red';
        let name: string = this.commands[commandName].label || commandName;
        let command: Array<string> = [chalk[color](this.name), chalk.cyan(name)];
        if (this.commands[commandName]) {
          if (commandName !== 'relution') {
            //  && this.reserved.indexOf(commandName) === -1
            if (this.commands[commandName].vars) {
              let vars: Array<string> = Object.keys(this.commands[commandName].vars);
              let params = '';
              vars.forEach((param, index) => {
                params += chalk.yellow(`<$${param}>`);
                // this.log.info(index, vars.length, index !== (vars.length -1));
                if (index !== (vars.length - 1)) {
                  params += ' ';
                }
              });
              if (params) {
                command.push(params);
              }
            } else {
              command.push('--');
            }
            if (disabled) {
              command.push(chalk['red'](disabled));
            } else {
              command.push(this.commands[commandName].description || '--');
            }
            content.push(command);
            i++;
          }
        }
      });
      content.push(['', '', '', '']);
      if (!asArray) {
        observer.next(this.table.sidebar(content, this.i18n.GENERAL_HELP_TABLEHEADERS));
      } else {
        observer.next(content);
      }
      observer.complete();
    });
  }

  commandIsDisabled(command: any, name: string, defaultWhy = `is not enabled`): string {
    if (command.when && !command.when()) {
      return command.why ? command.why() : defaultWhy;
    }
    return null;
  }

  init(args: Array<string>): any {
    // this.log.info(`Command.ts ${this.name}`, args);
    // console.log(JSON.stringify(args, null, 2));
    let myObservable: Observable<any>;

    // directly
    if (args[0] === this.name && args.length === 1) {
      // is the help or command without any params
      return this.showCommands().subscribe(
        (answers: Array<string>) => {
          return this.init(answers[this.name]);
        },
        (e: any) => this.log.error(e)
      );
    }

    if (args.length >= 1 && args[0] === this.name && args[1] === Translation.QUIT) {
      // back to Tower
      return this._parent.home();
    }

    // we have this method maybe help we get ['server', 'help', 'param']
    // build this.help('param');
    // this.log.info('this[args[0]]', this[args[0]]);
    if (this[args[0]]) {
      // this.log.info('args.length > 1', args.length > 1);
      if (args.length > 1) {
        let params = this._copy(args);
        params.splice(0, 1); // remove 'update' or 'create'
        myObservable = this[args[0]](params);
      } else {
        myObservable = this[args[0]]();
      }
    }

    // this.log.info('args[0] === this.name && this[args[1]]', args[0] === this.name && this[args[1]] !== undefined);
    // server add
    if (args[0] === this.name && this[args[1]]) {
      if (args.length > 2) {
        this.log.info('args.length > 2', args.length > 2);
        let subArgs: Array<string> = this._copy(args);
        subArgs.splice(0, 2);
        myObservable = this[args[1]](subArgs);
      } else {
        myObservable = this[args[1]]();
      }
    }
    // console.log(myObservable);
    return myObservable.subscribe(
      (log: any) => {
        if (log && log.length) {
          this.log.log('cyan', log);
        }
      },
      (e: any) => {
        this.log.error(e);
        this.home();
      },
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
      let name = this.commands[command].label || this.commands[command].name || command;
      let message = this.commandIsDisabled(this.commands[command], command);
      if (!_.isNil(message)) {
        // this.log.info(`"${chalk.magenta(name)}" is disabled because: ${message}`);
      }
      temp.push({
        disabled: message,
        name: name,
        value: [this.name, this.commands[command].method ? this.commands[command].method : command]
      });
    });
    return temp;
  }

  showCommands(message = `Please Choose Your ${this.name} Command: `, type = 'list'): any {
    // this.log.info(new Date().getTime());
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
    return Observable.fromPromise(inquirer.prompt(questions));
  }
}
