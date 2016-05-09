import {Observable, Observer} from '@reactivex/rxjs';
import {UserRc} from './../utility/UserRc';
import {Table} from './../utility/Table';
import {Command} from './../utility/Command';
import {Welcome} from './../utility/Welcome';
import * as chalk from 'chalk';

const inquirer = require('inquirer');
const username = require('username');

/**
 * Command Tower all Commmands go inside here
 */
export class Tower {
  public userRc:UserRc = new UserRc();
  //where is this command available
  public name: string = 'relution';
  //all commands are available
  public staticCommands: Object;
  //helper to get keys from subcommand
  public staticCommandRootKeys: Array<string>;
  //which one are reserved
  public reserved: Array<string> = ['help', 'quit'];
  //create a Table in the Terminal
  public table: Table;
  //standard Command Header
  public tableHeader: Array<string> = ['Command', 'Subcommand', 'Param/s', 'Description'];
  //Back to home on this command
  public reset:Array<string> = [this.name];
  //Tower commands
  public commands: Object = {
    help: {
      description: 'list available Commands'
    },
    quit: {
      description: 'Exit To Home'
    }
  };

  public config:Array<Object>;

  //process argV
  public args: Array<string> = ['relution'];
  //for the table a empty divider
  private _rowDivider: Array<string> = ['', '', '', ''];
  //to say hello
  public username: string;

  constructor(staticCommands: Object) {
    this.table = new Table();
    this.staticCommands = staticCommands;
    this.staticCommandRootKeys = Object.keys(staticCommands);
    this.args = this._copy(process.argv);

    //if the bin is used there are n params so we add it again to args
    if (this.args.length === 2) {
      this.args = this.reset;
    } else {
      this.args.splice(0, 2);
    }
    this.userRc.rcFileExist().subscribe((exist: boolean) => {
      if (exist) {
        this.userRc.streamRc().subscribe((data: any) => {
          this.config = data;
        });
      }
    },
    (e:any) => {
      console.log(`no rc file `);
    },
     () => {
      this.init();
    });

    username().then( (username:string) => {
      this.username = username;
      if (this.args.length === 1) {
        Welcome.greets(this.username);
      }

    });
  }
  /**
   * reset the Tower to get start
   */
  home(){
    this.args = this._copy(this.reset);
    this.init();
  }
  /**
   * check available options
   */
  init() {
    // debugger;
    console.log('Relution', this.args);
    if (this.args[0] === this.name) {
      //console.log('this.args[0] === this.name', this.args[0] === this.name);
      //only relution
      if (this.args.length === 1) {
        // console.log('this.args.length === 1', this.args.length === 1);
        return this.showCommands().subscribe((answers: any) => {
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
            this.args = this._copy(this.reset);
            this.init();
          });
      }


      //if from subcommand a method ?
      if (this.staticCommandRootKeys.indexOf(this.args[1]) !== -1) {
        //console.log('this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1', this.staticCommandRootKeys.indexOf(this.args[0]) !== -1 || this.staticCommandRootKeys.indexOf(this.args[1]) !== -1);
        let subArgs = this._copy(this.args);
        if (subArgs[0] === this.name) {
          subArgs.splice(0, 1);
        }
        //only ['server']
        if (subArgs[0] === this.staticCommands[subArgs[0]].name && subArgs.length === 1) {
          console.log(`trigger static ${subArgs.toString()} showCommands`);
          return this.staticCommands[subArgs[0]].init(subArgs, this);
        //only ['server', 'add', 'name']
        } else if (this.staticCommands[subArgs[0]][subArgs[1]]) {
          let params = this._copy(subArgs);
          params.splice(0, 1);
          if (params.length) {
            return this.staticCommands[subArgs[0]].init(params, this);
          }

        } else {
          console.error(`${subArgs.toString()} command not found!`);
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
    return Observable.create((observer:any) => {
      let content: any = [this._rowDivider];
      //to say hello
      this.flatCommands().forEach((commandName: string) => {
        if (commandName !== this.name && this.reserved.indexOf(commandName) === -1) {
          this.staticCommands[commandName].help(true).subscribe(
            (commands: Array<string>) => {
              commands.forEach((command: any) => {
                content.push(command);
              });
              //console.log(commands);
            }
          );
        } else if (this.reserved.indexOf(commandName) !== -1) {
          content.unshift([chalk.green(commandName), '', '', this.commands[commandName].description]);
        }
     });
      content.unshift(this._rowDivider);
      //to say hello
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
    // console.log(temp);
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

  quit(){
    Welcome.bye(this.username);
    process.exit();
  }
}
