import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';
import {ServerModelRc, ServerModel} from './../utility/ServerModelRc';

export class Server extends Command {
  public tableHeader: Array<string> = ['Name', 'Server url', 'Default', 'Username'];
  public debug:boolean = true;

  public commands: Object = {
    add: {
      description: 'add a new BaaS Server',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    list: {
      description: 'list all available BaaS Server',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    rm: {
      description: 'remove a server form the list',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: 'List the Server Command'
    },
    quit: {
      description: 'Exit To Home'
    }
  };

  public addConfig: Array<Object> = [
    {
      type: 'input',
      name: 'id',
      message: 'Server Name',
      validate: (value: string): any => {
        var pass = value.match(Validator.stringNumberPattern);
        if (pass) {
          return true;
        } else {
          return 'Please enter a valid Server name';
        }
      }
    },
    {
      type: 'input',
      name: 'serverUrl',
      message: 'Enter the server url (http://....)',
      validate: (value: string): any => {
        var pass = value.match(Validator.urlPattern);

        if (pass) {
          return true;
        } else {
          return 'Please enter a valid url';
        }
      }
    },
    {
      type: 'input',
      name: 'userName',
      message: 'Enter your username',
      validate: (value:string) => {
        return Validator.notEmptyValidate(value);
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Password',
      validate: (value:string) => {
        return Validator.notEmptyValidate(value);
      }
    },
    {
      type: 'confirm',
      name: 'default',
      default: false,
      message: 'Set as Default Server ?'
    }
  ];

  constructor() {
    super('server');
    this.commandDispatcher.subscribe(this.init.bind(this));
  }

  list(name?: string) {
    let empty:Array<string> = ['','','',''];
    let content:Array<any> = [empty];
    this.userRc.server.forEach((model:ServerModelRc) => {
      content.push(model.toTableRow(), empty);
    })
    return Observable.create((observer:any) => {
      observer.next(this.table.sidebar(this.tableHeader, content));
      observer.complete();
    });
  }

  update(id:string) {

  }
  rm(name?: string) {
    console.log('rm');
  }

  setDefaults(defaults:ServerModel) {
    this.addConfig.forEach((item:any) => {
      item.default = () => {return defaults[item.name]};
    })
  }
  /**
   * the add scenario
   * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/input.js
   */
  addServerPrompt(id: string) {
    //console.log('addServerPrompt');
    //for testing
    if (this.debug) {
      this.setDefaults({
        id: id,
        serverUrl: 'https://coredev.com:1234',
        userName: 'pascal',
        password: 'foo',
        default: false
      });
    }

    //set default id
    if (id && id.length && id.match(Validator.stringNumberPattern)) {
      this.addConfig[0]['default'] = () => {return id.trim()};
    }
    return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
  }
  /**
   * add method
   */
  add(params: Array<string>) {
    let name:string = '';
    if (params && params.length) {
      name = params[0].trim();
    }
    this.addServerPrompt(name).subscribe((answers:ServerModel) => {
      let model = new ServerModelRc(answers);
      this.userRc.addServer(model).subscribe(
        (isSaved:boolean) => {},
        (e:any) => console.error(`Something get wrong on add the server ${model.id}`),
        () => this.init(['server'], this._parent)
      );
    });
  }
}
