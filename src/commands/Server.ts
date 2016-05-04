import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';
import {ServerModelRc} from './../utility/ServerModelRc';

export class Server extends Command {
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
    console.log(this.config);
  }

  create(name?: string) {
    console.log('create');
  }

  rm(name?: string) {
    console.log('rm');
  }

  /**
   * the add scenario
   * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/input.js
   */
  addServerPrompt(name: string) {
    console.log('addServerPrompt');
    //for testing
    if (this.debug) {
      this.addConfig[1]['default'] = () => {return 'https://coredev.com:1234'};
      this.addConfig[2]['default'] = () => {return 'pascal'};
      this.addConfig[3]['default'] = () => {return 'blubber'};
    }

    //set default name
    if (name && name.length && name.match(Validator.stringNumberPattern)) {
      this.addConfig[0]['default'] = () => {return name.trim()};
    } else {
      console.log('name is not correct');
    }
    return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
  }
  /**
   * add method
   */
  add(params: Array<string>) {
    console.log(params);
    let name:string = '';
    if (params && params.length) {
      name = params[0].trim();
    }
    console.log('add', name);
    this.addServerPrompt(name).subscribe((answers:Array<string>) => {
        console.log(answers);
        let model = new ServerModelRc(answers);
        this.userRc.addServer(model).subscribe((isSaved:boolean) => {
          console.log(isSaved);
        });
      });
    // return Observable.create((observer:any) => {

    // }).subscribe((answers:any) => {
    //   console.log(answers);
    // });
  }
}
