import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';
import {ServerCrud} from './server/ServerCrud';

import {ServerModelRc, ServerModel} from './../utility/ServerModelRc';
import {orderBy, partition, concat, map, findIndex} from 'lodash';

const PRESS_ENTER = ' or press enter';
export class Server extends Command {
  public tableHeader: Array<string> = ['Name', 'Server url', 'Default', 'Username'];
  public debug: boolean = true;
  public crudHelper: ServerCrud;

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
    update: {
      description: 'update a exist server from the Server list',
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

  constructor() {
    super('server');
  }

  preload(){
    return this.userRc.rcFileExist().subscribe(
      (exist: boolean) => {
        if (exist) {
          return this.userRc.streamRc().subscribe((data: any) => {
            this.config = data;
          });
        }
      },
      (e:any) => {
        console.error(e);
      },
      () => {
        this.crudHelper = new ServerCrud(this.userRc);
      }
    );
  }

  get addConfig(): Array<Object> {
    return [
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
        validate: (value: string) => {
          return Validator.notEmptyValidate(value);
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your Password',
        validate: (value: string) => {
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
  }

  list(name?: string) {
    let empty: Array<string> = ['', '', '', ''];
    let content: Array<any> = [empty];
    let _parts = partition(this.userRc.server, (server: ServerModelRc) => {
      return server.default
    });

    if (_parts[1]) {
      _parts[1] = orderBy(_parts[1], ['id'], ['asc']);
    }
    let _list: any = concat(_parts[0], _parts[1]);

    _list.forEach((model: ServerModelRc) => {
      content.push(model.toTableRow(), empty);
    });

    return Observable.create((observer: any) => {
      observer.next(this.table.sidebar(this.tableHeader, content));
      observer.complete();
    });
  }

  // updateServerChooserPrompt(id?: string) {
  //   let prompt: any = this.serverListPrompt('server', 'list', 'choose a Server');
  //   console.log('prompt', prompt);

  //   if (id && id.length) {
  //     prompt.default = () => { return id; }
  //   }

  //   return Observable.fromPromise(this.inquirer.prompt(prompt));
  // }

  // updateServer(prompt:any, oldServerId:string){
  //   return Observable.fromPromise(this.inquirer.prompt(prompt)).subscribe(
  //     (answers:any) => {
  //       let serverIndex:number = findIndex(this.userRc.config.server, {id: oldServerId});
  //       this.userRc.config.server[serverIndex] = answers;
  //       return this.userRc.updateRcFile().subscribe(
  //         () => {
  //           console.log(`${oldServerId} are updated`);
  //         },
  //         (e:Error) => {

  //         },
  //         () => {
  //           return this.init(['server'], this._parent);
  //         }
  //       );
  //     }
  //   );
  // }

  // updateWithoutId(){
  //   let serverId: string;
  //   return this.updateServerChooserPrompt().subscribe(
  //     (answers: any) => {
  //       if (answers.server === this.takeMeOut) {
  //         return this.init(['server'], this._parent);
  //       }
  //       serverId = this._copy(answers.server);
  //       let serverIndex:number = findIndex(this.userRc.config.server, {id: serverId});
  //       let defaults:any = this.userRc.config.server[serverIndex];
  //       console.log(serverIndex, defaults);
  //       let prompt:any = this.setDefaults(defaults);
  //       console.log('prompt', prompt);
  //       return this.updateServer(prompt, serverId);
  //     }
  //   );
  // }

  // updateWithId(id:string):any {
  //   let serverId = this._copy(id);
  //   return this.updateServerChooserPrompt(serverId).subscribe(
  //     (answers: any) => {
  //       console.log('update', answers);
  //       // if (answers.server === this.takeMeOut) {
  //       //   return this.init(['server'], this._parent);
  //       // }

  //       let serverIndex:number = findIndex(this.userRc.config.server, {id: serverId});
  //       console.log(serverId)
  //       // let defaults:any = this.userRc.config.server[serverIndex];
  //       // console.log(serverIndex, defaults);
  //       // let prompt:any = this.setDefaults(defaults);
  //       // console.log('prompt', prompt);
  //       // this.updateServer(prompt);
  //     },
  //     (e: any) => {

  //     },
  //     () => {

  //     }
  //   );
  // }

  // update(id?: Array<string>):any {
  //   console.log('id', id);
  //   debugger;
  //   if (!this.userRc && !this.userRc.config && !this.userRc.config.server){
  //     return Observable.throw('no server are available');
  //   }

  //   if (!id || !id.length) {
  //     return this.updateWithoutId();
  //   }
  //   let serverId = id[0];
  //   return Observable.from(this.updateWithId(serverId));
  // }
  // /**
  //  * create a prompt like this
  //  * ```json
  //  * [ { type: 'list',
  //   message: 'Select Server/s',
  //   name: 'server',
  //   choices:
  //    [ 'cordev',
  //      'cordev2',
  //      'local dev',
  //      'ibx',
  //      't.beckmann',
  //      'beckmann new',
  //      'mdmdev2',
  //      'Take me out of here' ],
  //   validate: [Function] } ]
  //  * ```
  //  */
  // serverListPrompt(name: string = 'server', type: string = 'checkbox', message: string = 'Select Server/s') {
  //   let choices = map(this.userRc.config.server, 'id');
  //   choices.push(this.takeMeOut);
  //   return [
  //     {
  //       type: type,
  //       message: message,
  //       name: name,
  //       choices: choices,
  //       validate: (answer: Array<string>): any => {
  //         if (answer.length < 1) {
  //           return 'You must choose at least one server.';
  //         }
  //         return true;
  //       }
  //     }
  //   ];
  // }

  // deletePrompt() {
  //   return Observable.fromPromise(this.inquirer.prompt(this.serverListPrompt()));
  // }

  // rm() {
  //   this.deletePrompt().subscribe((answers: any) => {
  //     let all: any = [];
  //     if (answers.server.indexOf(this.takeMeOut) !== -1) {
  //       if (answers.server.length > 1) {
  //         console.log(`I see you choose servers and "Take me out of here" so you get out without remove`);
  //       }
  //       return this.init(['server'], this._parent);
  //     }
  //     answers.server.forEach((id: string) => {
  //       all.push(this.userRc.removeServer(id));
  //     });
  //     Observable.forkJoin(all).subscribe(
  //       (server: string) => {
  //         console.log(`${answers.server} are removed`);
  //       },
  //       (e: any) => console.error(`Something get wrong on remove the server`),
  //       () => this.init(['server'], this._parent)
  //     );
  //   });
  // }

  // setDefaults(defaults: ServerModel) {
  //   let myPrompt:any = this.addConfig;
  //   myPrompt.forEach((item: any) => {
  //     console.log(item, defaults);
  //     item.default = () => { return defaults[item.name] };
  //     item.message += PRESS_ENTER;
  //   });
  //   return myPrompt;
  // }
  // /**
  //  * the add scenario
  //  * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/input.js
  //  */
  // addServerPrompt(id?: string) {
  //   //console.log('addServerPrompt');
  //   //for testing
  //   if (this.debug && !id) {
  //     this.setDefaults({
  //       id: id,
  //       serverUrl: 'https://coredev.com:1234',
  //       userName: 'pascal',
  //       password: 'foo',
  //       default: false
  //     });
  //   }

  //   //set default id
  //   if (id && id.length && id.match(Validator.stringNumberPattern)) {
  //     this.addConfig[0]['default'] = () => { return id.trim() };
  //   }
  //   return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
  // }
  /**
   * add method
   */
  add(params: Array<string>):any {
    console.log(params);
    return this.crudHelper.add(params).subscribe(
      () => {

      },
      (e:any) => {
        console.error(e);
      },
      () => {
        console.log('hi');
        return this.init(['server'], this._parent);
      }
    );
  }
}
