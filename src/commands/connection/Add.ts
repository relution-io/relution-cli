import {Connection} from './../Connection';
import {Observable} from '@reactivex/rxjs';
import {find, findIndex, orderBy} from 'lodash';
import {ServerModelInterface} from './../../models/ServerModelRc';
import * as Relution from 'relution-sdk';
import {ConnectionInterface, ConnectionModel} from './../../models/ConnectionModel';

/**
 * this class add a new Connection
 * 1. get name
 * 2. get description
 * 3. get Connector Provider
 * 4. get Protocols to connector provider
 */
export class AddConnection {

  private _connection: Connection;
  private _promptkey: string = 'connectserver';
  private _server: any;
  private _protocolsUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.protocol';
  private _providerUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.connectorProvider';
  private _defaultServer: string;
  private _rootFolder:string  = `${process.cwd()}/connections/`;
  constructor(command: Connection) {
    this.connection = command;
  }

  public _addConnectionNamePath():Observable<any>{
    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'input',
        name: 'connectionname',
        message: `Please enter name or an sep path('ews/ews-exchange')`
      })
    );
  }

  public _addConnectionDescription():Observable<any>{
    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'input',
        name: 'connectiondescription',
        message: `Please enter a description:`
      })
    );
  }
  /**
   * @return XMLHttpRequest
   */
  private _getProtocols(query: string): Observable<any> {
    return Observable.fromPromise(
      Relution.web.ajax(
      {
        method: 'GET',
        url: `${this._protocolsUrl}?query=${encodeURIComponent(query)}`
      })
    );
  }

  /**
   * return a prompt with protocols as value
   */
  private _chooseConnectorProvider(providers: Array<{value: string, label: string}>): Observable<any>{
    let choices: Array<{
      name: string,
      value: string,
      default: boolean
    }> = [];

    providers.forEach((protocol:{value:string, label:string}) => {
      choices.push({
        name: protocol.label,
        value: protocol.value,
        default: false
      });
    });

    choices = orderBy(choices, ['name'], ['asc']);
    choices.push({
      name: this.connection.i18n.TAKE_ME_OUT,
      value: this.connection.i18n.TAKE_ME_OUT,
      default: false
    });

    let prompt = [{
      type: 'list',
      name: 'connectionprovider',
      message: 'Please choose a Connector: ',
      choices: choices
    }];
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }
  /**
   * return a prompt with protocols as value
   */
  private _chooseProtocol(protocols: Array<{value: string, label: string}>): Observable<any>{
    let choices: Array<{
      name: string,
      value: string,
      default: boolean
    }> = [];

    protocols.forEach((protocol:{value:string, label:string}) => {
      choices.push({
        name: protocol.label,
        value: protocol.value,
        default: false
      });
    });

    choices = orderBy(choices, ['name'], ['asc']);
    choices.push({
      name: this.connection.i18n.TAKE_ME_OUT,
      value: this.connection.i18n.TAKE_ME_OUT,
      default: false
    });

    let prompt = [{
      type: 'list',
      name: 'protocol',
      message: 'Please choose a Protocol: ',
      choices: choices
    }];
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  private _getConnectorProvider(){
    return Observable.fromPromise(
      Relution.web.ajax(
      {
        method: 'GET',
        url: this._providerUrl
      })
    );
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

  add():Observable<any> {
    let choosedServer:any;
    let protocols: Array<{label: string, value: string}> = [];
    let connectionModel = new ConnectionModel();

    if (!this.connection.userRc.server.length) {
      return Observable.throw(new Error('Please a first a Server'));
    }
    /**
     * set a new connection name
     */
    return this._addConnectionNamePath()
    /**
     * add connection description
     */
    .map((answers: {connectionname:string}) => {
      connectionModel.name = answers.connectionname;
      return this._addConnectionDescription();
    })
    .exhaust()
    /**
     * add server
     */
    .map((answers: {connectiondescription:string}) => {
      connectionModel.description = answers.connectiondescription;
      return this.getServerPrompt();
    })
    .exhaust()
    .filter((server: {connectserver: string}) => {
      return server.connectserver !== this.connection.i18n.TAKE_ME_OUT;
    })
    /**
     * login on relution
     */
    .map((server:{connectserver:string}) => {
      if (server.connectserver.toString().trim() === this._defaultServer.toString().trim()) {
        choosedServer = find(this.connection.userRc.config.server, { default: true });
      } else {
        choosedServer = find(this.connection.userRc.config.server, { id: server.connectserver });
      }
      return this.connection.relutionSDK.login(choosedServer);
    })
    .exhaust()
    .filter((resp:{user: Relution.security.User}) => {
      return resp.user ? true : false;
    })
    /**
     * get the connectionProvider
     */
    .map( (resp:{user: Relution.security.User}) => {
      return this._getConnectorProvider();
    })
    .exhaust()
    .filter((resp:Array<{value:string, label:string}>) => {
      return resp.length > 0;
    })
    /**
     * choose the connection Provider
     */
    .map((resp:Array<{value:string, label:string}>) => {
      return this._chooseConnectorProvider(resp);
    })
    .exhaust()
    /**
     * get protocols by Provider from Server
     */
    .map((answers: {connectionprovider: string}) => {
      connectionModel.connectorProvider = answers.connectionprovider;
      return this._getProtocols(answers.connectionprovider);
    })
    .exhaust()
    .filter((resp:Array<{value:string, label:string}>) => {
      return resp.length > 0;
    })
    .map((protocols:any) => {
      protocols = protocols;
      return this._chooseProtocol(protocols);
    })
    .exhaust()
    .filter((answers: {protocol:string}) => {
      return answers.protocol !== this.connection.i18n.TAKE_ME_OUT;
    })
    /**
     * write file to the connections folder
     */
    .map((answers: {protocol:string}) => {
      connectionModel.type = answers.protocol;
      return this.connection.fileApi.writeHjson(connectionModel.toJson(), connectionModel.name, `${process.cwd()}/connections`);
    })
    .exhaust()
    .map((file: any) => {
      console.log('file', file);
    });
  }

  public get connection(): Connection {
    return this._connection;
  }

  public set connection(v: Connection) {
    this._connection = v;
  }
}
