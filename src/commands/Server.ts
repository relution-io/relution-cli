import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';

export class Server extends Command {

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

  addServerPrompt(name: string) {
    if (name && name.length) {
      this.addConfig[0]['value'] = name.trim();
    }
    return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
  }

  add(name: string) {
    console.log(__filename);
    // .subscribe(
    //   (answers: Object) => {
    //     console.log('add answers', answers);
    //     return answers;
    //   },
    //   (e: ErrorConstructor) => {
    //     return e;
    //   }, () => {
    //     console.log('completed');
    //   }
    // );
    this.addServerPrompt(name);
    // .subscribe((a:any) => {
    //   console.log(a);
    // });

    return Observable.create((observer:any) => {
      observer.next(1000);
    })
  }
}
