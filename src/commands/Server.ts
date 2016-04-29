import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';

export class Server extends Command {

  public commands: Object = {
    create: {
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

  public config: Array<Object> = [
    {
      type: 'input',
      name: 'name',
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
      name: 'baseUrl',
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
      name: 'username',
      message: 'Enter your username',
      validate: Validator.notEmptyValidate('Username')
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Password',
      validate: Validator.notEmptyValidate('Password')
    }
  ];
  public reserved: Array<string> = ['help', 'quit'];

  constructor() {
    super('server');
    this.commandDispatcher.subscribe(this.init.bind(this));
  }

  init(args:Array<string>):any {
    super.init(args);
    if (args.length ===  1) {
      return this.help();
    } else if (args.length > 1 && this.reserved.indexOf(args[1]) === -1) {
      let vars = this._copy(args);
      vars.splice(0, 1);
      return this[args[1]](vars);
    } else if (args.length > 1 && this.reserved.indexOf(args[1]) !== -1) {
      //help() quit()
      return this[args[1]]();
    }
  }

  list(name?:string){
    console.log(this.config);
  }

  create (name?:string){
    console.log('create');
  }

  rm (name?:string) {
    console.log('rm');
  }
}
