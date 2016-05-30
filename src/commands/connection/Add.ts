import {Connection} from './../Connection';
import {RxFs} from './../../utility/RxFs';
import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {find, findIndex, orderBy} from 'lodash';
import {ServerModelInterface} from './../../models/ServerModelRc';
import * as Relution from 'relution-sdk';
import * as path from 'path';
import {ConnectionInterface, ConnectionModel} from './../../models/ConnectionModel';
import {Gii} from './../../gii/Gii';

/**
 * this class add a new Connection
 * 1. get name
 * 2. get description
 * 3. create folder for connection if is needed
 * 5. logon relution
 * 5. get Connector Provider
 * 6. get Protocols to connector provider
 * 7. save the result to project
 */
export class AddConnection {
  /**
   * parnt command Connection
   */
  private _connection: Connection;
  /**
   * the key which is the server from the prompt available
   */
  private _promptkey: string = 'connectserver';
  /**
   * url to get protocols
   */
  private _protocolsUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.protocol';
  /**
   * api to get conectorProvider
   */
  private _providerUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.connectorProvider';
  /**
   * the default server
   */
  private _defaultServer: string;
  /**
   * where the connection hav to be save
   */
  private _rootFolder: string = `${process.cwd()}/connections/`;
  /**
   * the connectionModel
   */
  public connectionModel: ConnectionModel;
  /**
   * template renderer
   */
  private _gii = new Gii();

  constructor(command: Connection) {
    this.connection = command;
  }

  public get path() {
    let myPath = path.dirname(this.connectionModel.name);
    if (myPath === '.') {
      return this._rootFolder;
    }
    return path.join(this._rootFolder, myPath);
  }
  /**
   * return the connection name without folder
   */
  public get connectionName() {
    return path.basename(this.connectionModel.name);
  }
  /**
   * input for enter name
   */
  public _addConnectionNamePath(): Observable<any> {
    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'input',
        name: 'connectionname',
        message: `Please enter name or an sep path('ews/ews-exchange')`,
        validate: (value:string):boolean => {
          return Validator.notEmptyValidate(value);
        }
      })
    );
  }
  /**
   * input for enter description
   */
  public _addConnectionDescription(): Observable<any> {
    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'input',
        name: 'connectiondescription',
        message: `Please enter a description:`,
        validate: (value:string):boolean => {
          return Validator.notEmptyValidate(value);
        }
      })
    );
  }
  /**
   * get the protocols from the server
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
  private _chooseConnectorProvider(providers: Array<{ value: string, label: string }>): Observable<any> {
    let choices: Array<{
      name: string,
      value: string,
      default: boolean
    }> = [];

    providers.forEach((protocol: { value: string, label: string }) => {
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
  private _chooseProtocol(protocols: Array<{ value: string, label: string }>): Observable<any> {
    let choices: Array<{
      name: string,
      value: string,
      default: boolean
    }> = [];

    protocols.forEach((protocol: { value: string, label: string }) => {
      choices.push({
        name: protocol.label,
        value: protocol.label.toLowerCase(),
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
  /**
   * checked if the connection already exist
   */
  private _alreadyExist(path: string): Observable<any> {
    let prompt = {
      type: 'confirm',
      name: 'connectionOverwrite',
      message: `${path} already exist you want to overwrite it ?`
    };
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }
  /**
   * get the porviders from the server
   */
  private _getConnectorProvider() {
    return Observable.fromPromise(
      Relution.web.ajax(
        {
          method: 'GET',
          url: this._providerUrl
        })
    );
  }
  /**
   * if is a subfolder we have to create it if is connection exist the user have to be confirm the overwrite
   */
  private _createConnectionFolder() {
    let folder = this.path;
    if (RxFs.exist(`${folder}/${this.connectionName}.hjson`)) {
      let write: boolean = false;
      return this._alreadyExist(`${folder}/${this.connectionName}.hjson`);
    }
    return this.connection.fileApi.mkdirp(folder);
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

  add(): Observable<any> {
    let choosedServer: any;
    let protocols: Array<{ label: string, value: string }> = [];
    this.connectionModel = new ConnectionModel();

    if (!this.connection.userRc.server.length) {
      return Observable.throw(new Error('Please add first a Server!'));
    }
    /**
     * set a new connection name
     */
    return this._addConnectionNamePath()
      /**
       * add connection description
       */
      .exhaustMap((answers: { connectionname: string }) => {
        this.connectionModel.name = answers.connectionname;
        return this._addConnectionDescription();
      })
      /**
       * add server
       */
      .exhaustMap((answers: { connectiondescription: string }) => {
        this.connectionModel.description = answers.connectiondescription;
        return this.getServerPrompt()
          .filter((server: { connectserver: string }) => {
            return server.connectserver !== this.connection.i18n.TAKE_ME_OUT;
          });
      })

      /**
       * login on relution
       */
      .exhaustMap((server: { connectserver: string }) => {
        if (server.connectserver.toString().trim() === this._defaultServer.toString().trim()) {
          choosedServer = find(this.connection.userRc.config.server, { default: true });
        } else {
          choosedServer = find(this.connection.userRc.config.server, { id: server.connectserver });
        }
        return this.connection.relutionSDK.login(choosedServer)
          .filter((resp: { user: Relution.security.User }) => {
            return resp.user ? true : false;
          });
      })

      /**
       * get the connectionProvider
       */
      .exhaustMap((resp: { user: Relution.security.User }) => {
        return this._getConnectorProvider()
          .filter((resp: Array<{ value: string, label: string }>) => {
            return resp.length > 0;
          });
      })
      /**
       * choose the connection Provider
       */
      .exhaustMap((resp: Array<{ value: string, label: string }>) => {
        return this._chooseConnectorProvider(resp);
      })
      /**
       * get protocols by Provider from Server
       */
      .exhaustMap((answers: { connectionprovider: string }) => {
        this.connectionModel.connectorProvider = answers.connectionprovider;
        return this._getProtocols(answers.connectionprovider)
          .filter((resp: Array<{ value: string, label: string }>) => {
            return resp.length > 0;
          });
      })
      /**
       * choose the protocol
       */
      .exhaustMap((protocols: any) => {
        protocols = protocols;
        return this._chooseProtocol(protocols)
          .filter((answers: { protocol: string }) => {
            return answers.protocol !== this.connection.i18n.TAKE_ME_OUT;
          });
      })
      /**
       * create the folder if is needed
       */
      .exhaustMap((answers: { protocol: string }) => {
        this.connectionModel.type = answers.protocol;
        return this._createConnectionFolder();
      })
      /**
       * write name.hjson file to the connections folder if the user want to overwrite or the connection is new
       */
      .exhaustMap((writen:{connectionOverwrite:boolean}|any) => {
        if (writen && !writen.connectionOverwrite) {
          return Observable.create((observer:any) => {
            observer.next(`Connection add ${this.connectionName} canceled`);
            observer.complete();
          });
        }
        return this.connection.fileApi.writeHjson(this.connectionModel.toJson(), this.connectionName, this.path);
      })
      /**
       * write name.gen.js file to the connections folder
       */
      .exhaustMap(() => {
        let template = this._gii.getTemplateByName('connectionGen');
        template.instance.name = this.connectionName;
        template.instance.path = path.dirname(this.connectionModel.name);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.gen.js`, this.path);
      })
      /**
       * write name.js file to the connections folder
       */
      .exhaustMap(() => {
        let template = this._gii.getTemplateByName('connection');
        template.instance.name = this.connectionName;
        template.instance.path = path.dirname(this.connectionModel.name);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.js`, this.path);
      })
      .do((file: any) => {
        return this.connection.log.info(`Connection ${this.connectionModel.name} are created. Please Deploy your Connection before you can update it.`)
      });
  }

  public get connection(): Connection {
    return this._connection;
  }

  public set connection(v: Connection) {
    this._connection = v;
  }
}
