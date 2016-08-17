import {Connection} from './../Connection';
import {RxFs} from './../../utility/RxFs';
import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {find, findIndex, orderBy} from 'lodash';
import * as Relution from 'relution-sdk';
import * as path from 'path';
import {ConnectionModel, MetaModel} from './../../models/ConnectionModel';
import {Gii} from './../../gii/Gii';
import * as chalk from 'chalk';

/**
 * this class add a new Connection
 * 1. get name
 * 2. get description
 * 3. create folder for connection if is needed
 * 5. logon relution
 * 5. get Connector Provider
 * 6. get Protocols to connector provider
 * 7. get metadata to protocols
 * 7. save the result to project
 */
export class AddConnection {
  /**
   * parent command Connection
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
   * api to get metadata
   * pid is the provider protocol
   * bsp. /gofer/meta-model/meta-type-adapter/rest/meta-type-adapters?pid=com.mwaysolutions.mcap.connector.http.RestConnectionConfig
   */
  private _metaDataUrl = '/gofer/meta-model/meta-type-adapter/rest/meta-type-adapters?pid=';
  /**
   * the default server
   */
  public defaultServer: string;
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
  /**
   * return the path for the folder where it have to be create
   */
  public get connectionHomeFolder() {
    let myPath = path.dirname(this.connectionModel.name);
    if (myPath === '.') {
      return this._rootFolder;
    }
    return path.join(this._rootFolder, myPath);
  }
  /**
   * return the connection name without file name
   */
  public get connectionName() {
    return path.basename(this.connectionModel.name);
  }

  public getMetadata(provider: string): any {
    return Observable.fromPromise(
      Relution.web.ajax(
        {
          method: 'GET',
          url: `${this._metaDataUrl}${encodeURIComponent(provider)}`
        })
    );
  }
  /**
   * input for enter name
   */
  public _addConnectionNamePath(): any {
    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'input',
        name: 'connectionname',
        message: `Please enter name or an sep path('ews/ews-exchange')`,
        validate: (value: string): boolean => {
          let connections = this.connection.getConnectionNames();
          let notEmpty = Validator.notEmptyValidate(value);
          let isUnique = true;

          if (!notEmpty) {
            this.connection.debuglog.error(new Error(`Name can not be empty`));
            return false;
          }

          connections.forEach((item) => {
            if (item.value.connection && item.value.connection.name === value) {
              this.connection.debuglog.error(new Error(`"${chalk.magenta(value)}" already exists! Please choose another one or remove the "${chalk.magenta(value + '.hjson')}" before.`));
              isUnique = false;
            }
          });
          return isUnique;
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
        validate: (value: string): boolean => {
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
   * return a prompt with providers as value
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
      name: this.connection.i18n.CANCEL,
      value: this.connection.i18n.CANCEL,
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
        value: protocol.value,
        default: false
      });
    });

    choices = orderBy(choices, ['name'], ['asc']);
    choices.push({
      name: this.connection.i18n.CANCEL,
      value: this.connection.i18n.CANCEL,
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
      message: `${path} already exists you want to overwrite it ?`
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
    let folder = this.connectionHomeFolder;
    if (RxFs.exist(`${folder}/${this.connectionName}.hjson`)) {
      return this._alreadyExist(`${folder}/${this.connectionName}.hjson`);
    }
    return this.connection.fileApi.mkdirp(folder);
  }

  /**
   * choose first on which Server the App has to be deployed
   */
  getServerPrompt(): Observable<any> {
    this.defaultServer = 'default';
    let prompt = this.connection._copy(this.connection._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server'));
    let indexDefault: number = findIndex(this.connection.userRc.server, { default: true });
    if (indexDefault > -1) {
      this.defaultServer += ` ${prompt[0].choices[indexDefault]}`;
      prompt[0].choices.splice(indexDefault, 1);
      prompt[0].choices.unshift(this.defaultServer);
    }
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  add(): Observable<any> {
    let choosedServer: any;
    this.connectionModel = new ConnectionModel();
    let fileWritten = true;
    if (!this.connection.userRc.server.length) {
      return Observable.throw(new Error('Please add a Server firstly!'));
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
            return server.connectserver !== this.connection.i18n.CANCEL;
          });
      })

      /**
       * login on relution
       */
      .exhaustMap((server: { connectserver: string }) => {
        if (server.connectserver.toString().trim() === this.defaultServer.toString().trim()) {
          choosedServer = find(this.connection.userRc.server, { default: true });
        } else {
          choosedServer = find(this.connection.userRc.server, { id: server.connectserver });
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
          .filter((response: Array<{ value: string, label: string }>) => {
            return response.length > 0;
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
            // console.log(resp);
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
            return answers.protocol !== this.connection.i18n.CANCEL;
          });
      })
      /**
       * create the folder if is needed
       */
      .exhaustMap((answers: { protocol: string }) => {
        this.connectionModel.protocol = answers.protocol;
        return this.getMetadata(this.connectionModel.protocol);
      })
      .exhaustMap((resp: any) => {
        // console.log('resp', resp);
        if (resp.metaModels && resp.metaModels.length) {
          this.connectionModel.metaModel = new MetaModel().fromJSON(resp.metaModels[0]);
          // console.log('this.connectionModel.metaModel.prompt', this.connectionModel.metaModel.prompt);
          return this.connectionModel.metaModel.questions()
            .exhaustMap((answers: any) => {
              // console.log('answers', answers);
              Object.keys(answers).forEach((key) => {
                if (key !== this.connection.i18n.CANCEL) {
                  this.connectionModel.metaModel.fieldDefinitions.index[key].defaultValue = answers[key];
                  // console.log(this.connectionModel.metaModel.fieldDefinitions[key]);
                }
              });
              return this._createConnectionFolder();
            });
        } else {
          return this._createConnectionFolder();
        }
      })
      /**
       * write name.hjson file to the connections folder if the user want to overwrite or the connection is new
       */
      .exhaustMap((written: { connectionOverwrite: boolean } | any) => {
        this.connectionModel.properties = this.connectionModel.getProperties();
        let template = this.connectionModel.toJson();
        if (written && written.connectionOverwrite === false) {
          fileWritten = written.connectionOverwrite;
          return Observable.create((observer: any) => {
            this.connection.debuglog.warn(`Connection add ${this.connectionName} canceled.`);
            return observer.complete();
          });
        }

        return this.connection.fileApi.writeHjson(template, this.connectionName, this._rootFolder);
      })
      /**
       * write name.gen.ts file to the connections folder
       */
      .exhaustMap(() => {
        let template = this._gii.getTemplateByName('connectionGen');
        template.instance.name = this.connectionName;
        template.instance.path = path.dirname(this.connectionModel.name);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.gen.ts`, this.connectionHomeFolder);
      })
      /**
       * write name.ts file to the connections folder
       */
      .exhaustMap(() => {
        let template = this._gii.getTemplateByName('connection');
        template.instance.name = this.connectionName;
        template.instance.path = path.dirname(this.connectionModel.name);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.ts`, this._rootFolder);
      })
      .exhaustMap(() => {
        return this.connection.streamConnectionFromFileSystem();
      })
      .do({
        complete: (file: any) => {
          const exec = require('child_process').exec;
          exec('tsc -p .');
          this.connection.debuglog.info(`Connection ${this.connectionModel.name} are created. Please Deploy your Connection before you can update it.`);
        }
      });
  }

  public get connection(): Connection {
    return this._connection;
  }

  public set connection(v: Connection) {
    this._connection = v;
  }
}
