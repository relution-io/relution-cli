import {Observable, Observer} from '@reactivex/rxjs';
import {UserRc} from './UserRc';
import {Table} from './Table';

interface CommandInterface{
  name: string;
  commandDispatcher: any;
  config: Object;
  commands? : Object;
}

export class Command implements CommandInterface {

  public name: string;
  public commandDispatcher: any;
  public directMode: boolean = false;
  public userRc: UserRc;
  public config: any;
  public commands: Object;
  public table: Table;

  constructor(name:string) {
    if (!name) {
      throw Error('Command need a name');
    }
    this.table = new Table();
    this.userRc = new UserRc();

    this.userRc.rcFileExist().subscribe((exist: boolean) => {
      if (exist) {
        this.userRc.streamRc().subscribe((data:any) => {
          this.config = data;
        });
      }
    });

    this.name = name;

    this.commandDispatcher = Observable.create((observer:any) => {
      if (process.argv.length <= 2) {
        observer.complete();
      }
      let args = this._copy(process.argv);
      args.splice(0, 2);
      observer.next(args);
      observer.complete();
    })
      .catch((e:any) => {
        throw new Error(e);
      })
      .filter((data:Array<string>) => {
        //console.log(data[2] === this.name, data[2], this.name);
        return data[0] === this.name;
      });
  }

  help() {
    return Observable.create((observer:any) => {
      let header:any = ['command', 'subcommand', 'params', 'description'];
      let content:any = [];
      //[this.name, '', '', '']
      if (this.commands) {
        let i = 0;
        Object.keys(this.commands).forEach((commandName:string) => {
          let command:Array<string> =  [chalk.green(this.name), chalk.cyan(commandName)];

          if (this.commands[commandName].vars) {
            let vars:Array<string> = Object.keys(this.commands[commandName].vars);
            vars.forEach((param) => {
              command.push(chalk.yellow(`<$${param}>`));
            })
          } else {
            command.push('--');
          }
          command.push(this.commands[commandName].description||'--');
          content.push(command);
          i++;
        });
        observer.next(this.table.sidebar(header, content));
      }
      observer.complete();
    });
  }

  init(args:Array<string>) {
    console.log(this.name, args);
  }

  _copy(org:any) {
    return JSON.parse(JSON.stringify(org));
  }
}
