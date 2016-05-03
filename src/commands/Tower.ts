import {Observable, Observer} from '@reactivex/rxjs';
import {UserRc} from './../utility/UserRc';
import {Table} from './../utility/Table';
import {Command} from './../utility/Command';

import * as chalk from 'chalk';

const inquirer = require('inquirer');
const username = require('username');

/**
 * Command Tower all Commmands gooin inside here
 */
export class Tower {
  public name: string = 'relution';
  public staticCommands: Object;
  public staticCommandRootKeys: Array<string>;
  public reserved: Array<string> = ['help', 'quit'];

  public table: Table;
  public tableHeader: Array<string> = ['Command', 'Subcommand', 'Param/s', 'Description'];
  public reset:Array<string> = [this.name];

  public commands: Object = {
    help: {
      description: 'list available Commands'
    },
    quit: {
      description: 'Exit To Home'
    }
  };

  public args: Array<string> = [];
  private _emptyRow: Array<string> = ['', '', '', ''];

  constructor(staticCommands: Object) {
    this.table = new Table();

    this.staticCommands = staticCommands;
    this.staticCommandRootKeys = Object.keys(staticCommands);

    this.args = this._copy(process.argv);
    this.args.splice(0, 2);
    this.init();
  }

  /**
   * check available options
   */
  init() {
    console.log('Relution', this.args);
    //debugger;
    // //only relution
    if (this.args[0] === this.name) {
      console.log('this.args[0] === this.name', this.args[0] === this.name);
      if (this.args.length === 1) {
        return this.showCommands().subscribe((answers: any) => {
          console.log('wtf');
          if (answers[this.name]) {
            this.args = answers[this.name];
          } else {
            this.args = answers;
          }

          return this.init();
        });
      }

      if (this.args.length >= 1 && this.reserved.indexOf(this.args[1]) !== -1 && this[this.args[1]]) {
        return this[this.args[1]]().subscribe(
          (log: any) => {

            console.log(log);
          },
          (e: ErrorConstructor) => {
            console.log(`Something get wrong to use ${this.args[1]}`, e)
          },
          () => {
            this.args = ['relution'];
            this.init();
          });
      }

      // //if from subcommand a method ?

      if (this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1) {
        //console.log('this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1', this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1);
        let subArgs = this._copy(this.args);
        if (subArgs.length > 1) {
          subArgs.splice(0, 1);
        }
        //console.log('static', subArgs);

        //only ['server']
        if (subArgs[0] === this.staticCommands[subArgs[0]].name && subArgs.length === 1) {
          console.log(`trigger static ${subArgs[1]} showCommands`);
          return this.staticCommands[subArgs[0]].showCommands().subscribe((log: any) => {
            console.log(log);
          });
        }

        //['server', 'add']
        //not for relution delegate to subcommand
        if (this.staticCommands[subArgs[0]][subArgs[1]]) {
          let params = this._copy(subArgs);
          params.splice(0, 2);

          if (params.length) {
            return this.staticCommands[subArgs[0]][subArgs[1]](params).subscribe((log: any) => {
              console.log(log);
            });
          }

          return this.staticCommands[subArgs[0]][subArgs[1]]().subscribe((log: any) => {
            console.log('static');
            console.log(log);
          });
        }
      }
    }
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
    return Observable.create((observer: any) => {
      let content: any = [this._emptyRow];
      this.flatCommands().forEach((commandName: string) => {
        if (commandName !== this.name && this.reserved.indexOf(commandName) === -1) {
          this.staticCommands[commandName].help(true).subscribe(
            (commands: Array<string>) => {
              commands.forEach((command: any) => {
                content.push(command);
              });
              console.log(commands);
            }
          );
        } else if (this.reserved.indexOf(commandName) !== -1) {
          content.unshift([chalk.green(this.name), chalk.cyan(commandName), '', this.commands[commandName].description]);
        }
      });
      content.unshift(this._emptyRow);
      if (!asArray) {
        observer.next(this.table.sidebar(this.tableHeader, content));
      } else {
        observer.next(content);
      }
      observer.complete();
    });
  }

  /**
   * merge the subcommand into a flat array with the available Tower Commands
   * ```json
   * [ 'server', 'help', 'quit' ]
   * ```
   */
  flatCommands() {
    let list: Array<string> = Object.keys(this.commands);
    let av: Array<string> = this.staticCommandRootKeys.concat(list);

    //console.log('av', av)
    return av;
  }
  /**
   * copy any
   */
  _copy(org: any) {
    return JSON.parse(JSON.stringify(org));
  }
  /**
   * create a list of choices from the root commands
   * ```json
   * [ { name: 'server', value: [ 'relution', 'server' ] },
       { name: 'help', value: [ 'relution', 'help' ] },
       { name: 'quit', value: [ 'relution', 'quit' ] }
     ]
   * ```
   */
  setupCommandsForList(): Array<Object> {
    let temp: Array<Object> = [];
    this.flatCommands().forEach((command) => {
      temp.push({
        name: command,
        value: [this.name, command]
      })
    })
    console.log(temp);
    return temp;
  }
  /**
   * prepare the choices fo the commands
   * looks like this
   * ```bash
   * ? Please Choose Your Option:  (Use arrow keys)
      ❯ server
        help
        quit
      ```
   */
  showCommands(message: string = "Please Choose Your Option: ", type: string = 'list'): any {
    let questions = [
      {
        name: this.name,
        message: message,
        type: type,
        choices: this.setupCommandsForList(),
        filter: function (str: Array<string>) {
          console.log('str', str);
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
