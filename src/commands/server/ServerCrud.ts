import * as fs from 'fs';
import * as _ from 'lodash';

import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {ServerModelRcInterface, ServerModelRc} from './../../models/ServerModelRc';
import {Server} from './../Server';
import {findIndex, map} from 'lodash';
import {UserRc} from './../../utility/UserRc';
import * as inquirer from 'inquirer';
import {DebugLog} from './../../utility/DebugLog';
import {CertModelRc} from '../../models/CertModelRc';
import {RxFs} from '../../utility/RxFs';
import {CertModelRcInterface} from '../../models/CertModelRc';

/**
 * add a Server to Config from the UserRc and store it
 */
const ADD = 'add';
const UPDATE = 'update';
const CLIENTCERT = 'clientcert';

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
    };
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  get addConfig(): Array<Object> {
    return [
      {
        type: 'input',
        name: 'id',
        message: 'Server name :',
        validate: (value: string): any => {
          let test: number = findIndex(this.userRc.server, { id: value });
          if (!test && this._scenario === ADD) {
            DebugLog.error(new Error(this.server.i18n.ALREADY_EXIST(value)));
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
        message: 'Enter the server url (https://....) :',
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
        message: 'Enter your password :',
        validate: (value: string) => {
          return Validator.notEmptyValidate(value);
        }
      },
      {
        type: 'confirm',
        name: 'default',
        default: false,
        message: 'Set as default server ?'
      }
    ];
  };

  _copy(org: any) {
    if (!_.isObject(org)) {
      return org;
    }
    return JSON.parse(JSON.stringify(org));
  }
  /**
   * toggle all server to default false
   */
  public falseyDefaultServer() {
    this.userRc.server.forEach((server: any) => {
      if (server.default) {
        server.default = false;
      }
    });
  }
  /**
   * cheack if the server id already exist
   */
  public isUnique(server: ServerModelRc) {
    return findIndex(this.userRc.server, { id: server.id }) < 0;
  }
  /**
   * remove a server from the list
   */
  public removeServer(id: string) {
    let pos: number = findIndex(this.userRc.server, { id: id });
    if (pos < 0) {
      throw Error(`${id} not exist!`);
    }

    this.userRc.server.splice(pos, 1);
    return this.userRc.updateRcFile();
  }
  /**
   * add a server to the config server list.
   */
  public addServer(server: ServerModelRc, update = false): any {
    if (!this.isUnique(server) && !update) {
      throw new Error(this.server.i18n.ALREADY_EXIST(server.id, 'Server'));
    }
    if (server.default) {
      this.falseyDefaultServer();
    }

    if (update) {
      let pos: number = findIndex(this.userRc.server, { id: server.id });
      if (pos) {
        this.userRc.server[pos] = server;
      }
    } else {
      this.userRc.server.push(server);
    }
    return this.userRc.updateRcFile();
  }

  setDefaults(defaults: ServerModelRcInterface) {
    let myPrompt: any = this.addConfig;

    if (defaults) {
      myPrompt.forEach((item: any) => {
        item.default = () => { return defaults[item.name]; };
        item.message += this.server.i18n.PRESS_ENTER;
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
    let choices = map(this.userRc.server, 'id');
    choices.push(this.server.i18n.CANCEL);
    return [
      {
        type: type,
        message: message,
        name: name,
        choices: choices,
        validate: (answer: Array<string>): any => {
          if (answer.length < 1) {
            return this.server.i18n.YOU_MUST_CHOOSE('Server');
          }
          return true;
        }
      }
    ];
  }

  /**
   * remove a server frm a list
   */
  deletePrompt(): any {
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
    let all: any = [];
    return this.deletePrompt()
      .filter((answers: { server: Array<string> }) => {
        if (answers.server.indexOf(this.server.i18n.CANCEL) !== -1 && answers.server.length > 1) {
          DebugLog.warn(`I see you choose "servers" and "${this.server.i18n.CANCEL}" so you get out without remove.`);
          return false;
        }
        return true;
      })
      .filter((answers: { server: Array<string> }) => {
        return answers.server.indexOf(this.server.i18n.CANCEL) === -1;
      })
      .exhaustMap((answers: { server: Array<string> }) => {
        answers.server.forEach((serverId: string) => {
          all.push(this.removeServer(serverId));
        });
        return Observable.forkJoin(all)
          .do(() => {
            DebugLog.info(`Server ${answers.server.toString()} removed.`);
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
      .exhaustMap((answers: ServerModelRcInterface) => {
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
        return this.server.relutionSDK.login(model, true)
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
      prompt.default = () => { return id; };
    }

    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * inquirer a server with defaults
   */
  private _updateWithId(id: string): any {
    let serverId = this._copy(id);
    let serverIndex = findIndex(this.userRc.server, { id: serverId });
    let prompt = this.setDefaults(this.userRc.server[serverIndex]);
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * @name update
   * @return Observable
   * @params Array<string>
   */
  update(params?: Array<string>): any {
    if (!this.userRc || !this.userRc.server) {
      return Observable.throw(new Error('no servers available'));
    }
    this._scenario = UPDATE;
    let oldId: any = null;
    if (!params || !params.length) {
      /**
       * get server list
       */
      return this._updateServerChooserPrompt()
        .filter((answers: { server: string }) => {
          return answers.server !== this.server.i18n.CANCEL;
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
        .exhaustMap((answers: ServerModelRcInterface) => {
          let serverIndex = findIndex(this.userRc.server, { id: oldId });
          this.userRc.server[serverIndex] = new ServerModelRc(answers);
          return this.userRc.updateRcFile().do(() => {
            DebugLog.info('Server is updated');
          });
        });
    }
    oldId = this._copy(params[0]);
    return this._updateWithId(params[0])
      .exhaustMap((answers: ServerModelRcInterface) => {
        let serverIndex = findIndex(this.userRc.server, { id: oldId });
        this.userRc.server[serverIndex] = new ServerModelRc(answers);

        return this.userRc.updateRcFile()
          .do(() => {
            DebugLog.info('Server is updated');
          });
      });
  }

  get clientcertConfig(): Array<inquirer.Question> {
    return [
      {
        type: 'input',
        name: 'pfx',
        message: 'Client Certificate (file path, enter to clear) :',
        validate: (value: string): any => {
          if (value && !fs.existsSync(value)) {
            DebugLog.error(new Error(this.server.i18n.SERVER_CLIENTCERT_NOT_FOUND));
            return false;
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'passphrase',
        message: 'Passphrase (enter for none) :',
        when: (answers: inquirer.Answers) => !!answers['pfx']
      }
    ];
  };

  /**
   * @name clientcert
   */
  clientcert(params: Array<string> = []): any {
    if (!this.userRc || !this.userRc.server) {
      return Observable.throw(new Error('no servers available'));
    }
    this._scenario = CLIENTCERT;

    const serverId = params[0];
    if (!serverId) {
      // get server list
      return this._updateServerChooserPrompt()
        .filter((answers: { server: string }) => {
          return answers.server !== this.server.i18n.CANCEL;
        })
        .map((answers: { server: string }) => {
          return this._copy(answers.server);
        })
        /**
         * update server with defaults
         */
        .exhaustMap((id: string) => {
          params[0] = id;
          return this.clientcert(params);
        });
    }

    const server = this.userRc.getServer(serverId);
    if (!server) {
      return Observable.throw(new Error('unknown server: ' + serverId));
    }

    return Observable.fromPromise(this.inquirer.prompt(this.clientcertConfig)).mergeMap((answers: CertModelRcInterface) => {
      const pfx = answers['pfx'];
      if (!pfx) {
        return Observable.of(undefined);
      }

      return RxFs.readFile(pfx).map((pfxContent: Buffer) => {
        return new CertModelRc(_.defaults({
          pfx: pfxContent
        }, answers));
      });
    }).filter((clientCertificate?: CertModelRc) => {
      return !_.isEqual(this._copy(server.clientCertificate), this._copy(clientCertificate));
    }).map((clientCertificate?: CertModelRc) => {
      server.clientCertificate = clientCertificate;
      return server;
    }).mergeMap((s) => {
      return this.server.relutionSDK.login(s, true);
    }).takeLast(1).mergeMap(() => {
      return this.userRc.updateRcFile();
    });
  }
}
