import {Observable, Observer} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {ServerModelRc, ServerModel} from './../../models/ServerModelRc';
import {findIndex, map} from 'lodash';
import {UserRc} from './../../utility/UserRc';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';
/**
 * add a Server to Config from the UserRc and store it
 */

const ADD = 'add';
const UPDATE = 'update';

export class ServerCrud {

  public userRc:UserRc;
  public inquirer:any = inquirer;

  constructor(userRc:UserRc) {
    this.userRc = userRc;
  }
  private _scenario:string = ADD;

  get addConfig(): Array<Object> {
    return [
      {
        type: 'input',
        name: 'id',
        message: 'Server Name',
        validate: (value: string): any => {
          let testNameModel:ServerModelRc = new ServerModelRc({
            id: value,
            default: false,
            serverUrl: '',
            userName: '',
            password: ''
          });

          if (!this.isUnique(testNameModel) && this._scenario === ADD){
            console.log(chalk.red(`\n Name ${value} already exist please choose another one`));
            return false;
          }

          let pass = value.match(Validator.stringNumberPattern);
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
  };
  _copy(org: any) {
    return JSON.parse(JSON.stringify(org));
  }
  /**
   * toggle all server to default false
   */
  public falseyDefaultServer(){
    this.userRc.server = [];
    this.userRc.config.server.forEach((server:any) => {
      if (server.default) {
        server.default = false;
      }
      this.userRc.server.push(new ServerModelRc(server));
    });
  }
  /**
   * cheack if the server id already exist
   */
  public isUnique(server:ServerModelRc) {
    let isUnique:boolean = true;
    this.userRc.config.server.forEach((cserver:any) => {
      if (cserver.id === server.id) {
        isUnique = false;
      }
    });
    return isUnique;
  }
  /**
   * remove a server from the list
   */
  public removeServer(id:string){
    let pos:number = findIndex(this.userRc.config.server, {id: id});
    if (pos !== -1) {
      this.userRc.config.server.splice(pos,1);
      return this.userRc.updateRcFile();
    }
    throw Error(`${id} not exist!`);
  }
  /**
   * add a server to the config server list.
   */
  addServer(server:ServerModelRc, update:boolean = false):any{
    if (!this.isUnique(server) && !update) {
      throw new Error(Translation.ALREADY_EXIST(server.id, 'Server'));
    }

    if (server.default) {
      this.falseyDefaultServer();
    }

    if (update) {
      let pos:number = findIndex(this.userRc.config.server, server.id);
      if (pos) {
        this.userRc.config.server[pos] = server.toJson();
        this.userRc.server[pos] = server.toJson();
      }
    } else {
      this.userRc.server.push(server);
      this.userRc.config.server.push(server.toJson());
    }
    return this.userRc.updateRcFile();
  }


  setDefaults(defaults: ServerModel) {
    let myPrompt:any = this.addConfig;

    if (defaults) {
      myPrompt.forEach((item: any) => {
        item.default = () => { return defaults[item.name] };
        item.message += Translation.PRESS_ENTER;
      });
    }

    return myPrompt;
  }

  createNewServer(id?: string){
    let prompt = this.addConfig;
    if (id) {
      prompt[0]['default']  = id;
    }
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * create a prompt like this
   * ```json
   * [ { type: 'list',
    message: 'Select Server/s',
    name: 'server',
    choices:
     [ 'cordev',
       'cordev2',
       'local dev',
       'ibx',
       't.beckmann',
       'beckmann new',
       'mdmdev2',
       'Take me out of here' ],
    validate: [Function] } ]
   * ```
   */
  serverListPrompt(name: string = 'server', type: string = 'checkbox', message: string = 'Select Server/s') {
    let choices = map(this.userRc.config.server, 'id');
    choices.push(Translation.TAKE_ME_OUT);
    return [
      {
        type: type,
        message: message,
        name: name,
        choices: choices,
        validate: (answer: Array<string>): any => {
          if (answer.length < 1) {
            return 'You must choose at least one server.';
          }
          return true;
        }
      }
    ];
  }

  /**
   * remove a server frm a list
   */
  deletePrompt() {
    return Observable.fromPromise(this.inquirer.prompt(this.serverListPrompt()));
  }
  /**
   * ```javascript
   * const crud = new ServerCrud(myuserRc)
   * crud.rm(id).subscribe(
      () => {
         console.log('on working porgress');
      },
      (e:any) => {
        console.error(e);
      },
      () => {
        console.log('complete');
      }
    );
   * ```
   */
  rm(id?:string):any {
    return Observable.create((observer:any) => {
      this.deletePrompt().subscribe((answers: any) => {
        let all: any = [];
        if (answers.server.indexOf(Translation.TAKE_ME_OUT) !== -1) {
          if (answers.server.length > 1) {
            console.log(`I see you choose servers and "Take me out of here" so you get out without remove`);
          }
          observer.complete();
        }

        answers.server.forEach((id: string) => {
          all.push(this.removeServer(id));
        });

        Observable.forkJoin(all).subscribe({complete: () => {
          observer.complete();
        }});
      });
    })
  }
  /**
   * @name add
   * @return Observable
   * @params Array<string>
   * @description add a server to the userrc file
   */
  add(params?: Array<string>):any {
    // the name is here
    // console.log(params[0]);
    let name: string = '';
    if (params && params[0] && params[0].length) {
      name = params[0].trim();
    }
    return Observable.create((observer:any) => {
      this.createNewServer(name).subscribe((answers: ServerModel) => {
        this.addServer(new ServerModelRc(answers)).subscribe(
          {
            complete: () => {
              observer.complete();
            }
          }
        );
      });
    });
  }

  /**
   * chose a server from the list
   */
  private _updateServerChooserPrompt(id?: string) {
    let prompt: any = this.serverListPrompt('server', 'list', 'choose a Server');

    if (id && id.length) {
      prompt.default = () => { return id; }
    }

    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * no server id is given we set the user server list to choose one
   * @private
   */
  private _updateWithoutId(){
    return Observable.create((observer:any) => {
      this._updateServerChooserPrompt().subscribe(
        (answers: any) => {observer.next(this._copy(answers.server));},
        (e:any) => console.error(e),
        () => observer.complete
      );
    });
  }
  /**
   * inquirer a server with defaults
   */
  private _updateWithId(id:string):any {
    let serverId = this._copy(id);
    let serverIndex = findIndex(this.userRc.config.server, {id:serverId});
    let prompt = this.setDefaults(this.userRc.config.server[serverIndex]);
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * ```javascript
   * const crudHelper = new ServerCrud(userRc);
   * crudHelper.update(params).subscribe(
      () => {

      },
      (e:any) => {
        console.error(e);
      },
      () => {
        console.log('server added');
      }
    );
   * ```
   * @name update
   * @return Observable
   * @params Array<string>
   */
  update(params?: Array<string>):any {
    if (!this.userRc && !this.userRc.config && !this.userRc.config.server){
      return Observable.throw(new Error('no server are available'));
    }
    this._scenario = UPDATE;
    if (!params || !params.length) {
      return Observable.create((observer:any)=>{
        this._updateWithoutId().subscribe((serverId: string) => {
          if (serverId === Translation.TAKE_ME_OUT) {
            return observer.complete();
          }
          //maybe the user rename the server
          let oldId = this._copy(serverId);
          this._updateWithId(serverId).subscribe(
            (answers:ServerModel) => {
              let serverIndex = findIndex(this.userRc.config.server, {id: oldId});
              this.userRc.config.server[serverIndex] = answers;
              this.userRc.updateRcFile().subscribe(() => observer.complete);
            },
            (e:any) => console.error(e),
            () => {
              observer.complete();
            }
          );
      })
    });;
    }
    let serverId = params[0];
    return Observable.from(this._updateWithId(serverId));
  }
}
