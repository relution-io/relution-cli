import {Connection} from './../Connection';
import {Observable} from '@reactivex/rxjs';
import {find, findIndex} from 'lodash';
import {ServerModelRc} from './../../models/ServerModelRc';
import * as Relution from 'relution-sdk';

export class AddConnection {

  private _connection: Connection;
  private _promptkey: string = 'connectserver';
  private _server: any;
  private _protocolsUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.protocol';
  private _providerUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.connectorProvider';
  private _defaultServer: string;

  constructor(command: Connection) {
    this.connection = command;
  }

  private _getName() {

  }

  /**
   * choose first on which Server the App has to be deployed
   */
  getServerPrompt(): Observable<any> {
    this._defaultServer = 'default';
    let prompt = this.connection._copy(this.connection._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
    let indexDefault: number = findIndex(this.connection.userRc.config.server, { default: true });
    if (indexDefault > -1) {
      this._defaultServer += ` ${prompt[0].choices[indexDefault]}`
      prompt[0].choices.splice(indexDefault, 1);
      prompt[0].choices.unshift(this._defaultServer);
    }
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  add() {
    let choosedServer:ServerModelRc;

    return this.getServerPrompt()
    .map((server:{connectserver:string}) => {
      choosedServer = find(this.connection.userRc.server, { id: server.connectserver });
      console.log(server);
      return this.connection.relutionSDK.login(choosedServer);
    })
    .exhaust()
    .map( (resp:{user: Relution.security.User}) => {
      console.log(resp.user);
    })

    // return Observable.create((observer: any) => {
    //   .subscribe({
    //     next: (server: any) => {
    //       this.connection.log.debug(server[this._promptkey]);
    //       this.connection.log.debug(JSON.stringify(this.connection._parent.staticCommands.server, null, 2));
    //       this._server = this.connection._parent.staticCommands.env.envCollection.isUnique(server[this._promptkey]);

    //     },
    //     complete: () => {
    //       console.log(JSON.stringify(this._server, null, 2));
    //       observer.complete();
    //     }
    //   }
    //   );
    // });
  }

  public get connection(): Connection {
    return this._connection;
  }

  public set connection(v: Connection) {
    this._connection = v;
  }
}