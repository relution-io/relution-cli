import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {ServerModelRc, ServerModelInterface} from './../../models/ServerModelRc';
import {Server} from './../Server';
import {findIndex, map} from 'lodash';
import {UserRc} from './../../utility/UserRc';
import * as inquirer from 'inquirer';
import {DebugLog} from './../../utility/DebugLog';
/**
 * add a Server to Config from the UserRc and store it
 */

const ADD = 'add';
const UPDATE = 'update';

export class ServerCrud {

  public userRc: UserRc;
  public inquirer: any = inquirer;
  public server: Server;

  constructor(connection: Server) {
    this.userRc = connection.userRc;
    this.server = connection;
  }
  private _scenario: string = ADD;

  private _wannaTest() {
    let prompt = {
      type: 'confirm',
      name: 'testconnection',
      message: 'Would you like to test the server with the applied data ?'
    }
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  get addConfig(): Array<Object> {
    return [
      {
        type: 'input',
        name: 'id',
        message: 'Server Name :',
        validate: (value: string): any => {
          let test: number = findIndex(this.userRc.config.server, { id: value });
          if (!test && this._scenario === ADD) {
            DebugLog.error(new Error(Translation.ALREADY_EXIST(value)));
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
        message: 'Enter the server url (http://....) :',
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
        message: 'Enter your username :',
        validate: (value: string) => {
          return Validator.notEmptyValidate(value);
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your Password :',
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
  public falseyDefaultServer() {
    this.userRc.server = [];
    this.userRc.config.server.forEach((server: any) => {
      if (server.default) {
        server.default = false;
      }
      this.userRc.server.push(new ServerModelRc(server));
    });
  }
  /**
   * cheack if the server id already exist
   */
  public isUnique(server: ServerModelRc) {
    let isUnique = true;
    this.userRc.config.server.forEach((cserver: any) => {
      if (cserver.id === server.id) {
        isUnique = false;
      }
    });
    return isUnique;
  }
  /**
   * remove a server from the list
   */
  public removeServer(id: string) {
    let pos: number = findIndex(this.userRc.config.server, { id: id });
    if (pos !== -1) {
      this.userRc.config.server.splice(pos, 1);
      return this.userRc.updateRcFile();
    }
    throw Error(`${id} not exist!`);
  }
  /**
   * add a server to the config server list.
   */
  public addServer(server: ServerModelRc, update = false): any {
    if (!this.isUnique(server) && !update) {
      throw new Error(Translation.ALREADY_EXIST(server.id, 'Server'));
    }
    if (server.default) {
      this.falseyDefaultServer();
    }

    if (update) {
      let pos: number = findIndex(this.userRc.config.server, server.id);
      if (pos) {
        this.userRc.config.server[pos] = server.toJson();
        this.userRc.server[pos] = server;
      }
    } else {
      this.userRc.config.server.push(server.toJson());
      this.userRc.server.push(server);
    }
    return this.userRc.updateRcFile();
  }


  setDefaults(defaults: ServerModelInterface) {
    let myPrompt: any = this.addConfig;

    if (defaults) {
      myPrompt.forEach((item: any) => {
        item.default = () => { return defaults[item.name] };
        item.message += Translation.PRESS_ENTER;
      });
    }

    return myPrompt;
  }

  createNewServer(id?: string): any {
    let prompt = this.addConfig;
    if (id) {
      prompt[0]['default'] = id;
    }
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * return a prompt with available servers
   */
  serverListPrompt(name = 'server', type = 'checkbox', message = 'Select Server(s) :') {
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
            return Translation.YOU_MOUST_CHOOSE('Server');
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
  rm(id?: string): any {
    return Observable.create((observer: any) => {
      this.deletePrompt().subscribe((answers: any) => {
        let all: any = [];
        if (answers.server.indexOf(Translation.TAKE_ME_OUT) !== -1) {
          if (answers.server.length > 1) {
            DebugLog.warn(`I see you choose servers and "Take me out of here" so you get out without remove`);
          }
          observer.complete();
        }

        answers.server.forEach((serverId: string) => {
          all.push(this.removeServer(serverId));
        });

        Observable.forkJoin(all).subscribe({
          complete: () => {
            observer.complete();
          }
        });
      });
    });
  }
  /**
   * @name add
   * @return Observable
   * @params Array<string>
   * @description add a server to the userrc file
   */
  add(params?: Array<string>): any {
    // the name is here
    // console.log(params[0]);
    let name = '';
    let model: ServerModelRc;
    if (params && params[0] && params[0].length) {
      name = params[0].trim();
    }
    /**
       * enter name url ....
       */
    return this.createNewServer(name)
      /**
       * write a ServerModelInterface  into the relutionrc
       */
      .exhaustMap((answers: ServerModelInterface) => {
        model = new ServerModelRc(answers);
        return this.addServer(model);
      })
      /**
       * wanna test connection on your server ?
       */
      .exhaustMap(() => {
        return this._wannaTest()
          .filter((answers: { testconnection: boolean }) => {
            return answers.testconnection;
          });
      })
      /**
       * yes i want test login
       */
      .exhaustMap((answers: { testconnection: boolean }) => {
        return this.server.relutionSDK.login(model)
          .filter((resp: any) => {
            return resp.user;
          })
          .map((resp: any) => {
            let userResp = resp.user;
            return this.server.log.info(`logged in as ${userResp.givenName ? userResp.givenName + ' ' + userResp.surname : userResp.name}`);
          });
      });

  }

  /**
   * chose a server from the list
   */
  private _updateServerChooserPrompt(id?: string): any {
    let prompt: any = this.serverListPrompt('server', 'list', 'choose a Server');

    if (id && id.length) {
      prompt.default = () => { return id; }
    }

    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * inquirer a server with defaults
   */
  private _updateWithId(id: string): any {
    let serverId = this._copy(id);
    let serverIndex = findIndex(this.userRc.config.server, { id: serverId });
    let prompt = this.setDefaults(this.userRc.config.server[serverIndex]);
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * @name update
   * @return Observable
   * @params Array<string>
   */
  update(params?: Array<string>): any {
    if (!this.userRc && !this.userRc.config && !this.userRc.config.server) {
      return Observable.throw(new Error('no server are available'));
    }
    this._scenario = UPDATE;
    let oldId: any = null;
    if (!params || !params.length) {
      /**
       * get server list
       */
      return this._updateServerChooserPrompt()
        .filter((answers: { server: string }) => {
          return answers.server !== Translation.TAKE_ME_OUT;
        })
        .map((answers: { server: string }) => {
          return this._copy(answers.server);
        })
        /**
         * update server with defaults
         */
        .exhaustMap((serverId: string) => {
          oldId = this._copy(serverId);
          return this._updateWithId(serverId);
        })
        /**
         * write to relutionrc
         */
        .exhaustMap((answers: ServerModelInterface) => {
          let serverIndex = findIndex(this.userRc.config.server, { id: oldId });
          this.userRc.config.server[serverIndex] = answers;
          return this.userRc.updateRcFile().do(() => {
            DebugLog.info('Server is updated');
          });
        });
    }
    oldId = this._copy(params[0]);
    return this._updateWithId(params[0])
      .exhaustMap((answers: ServerModelInterface) => {
        let serverIndex = findIndex(this.userRc.config.server, { id: oldId });
        this.userRc.config.server[serverIndex] = answers;

        return this.userRc.updateRcFile()
          .do(() => {
            DebugLog.info('Server is updated');
          });
      });
  }
}
