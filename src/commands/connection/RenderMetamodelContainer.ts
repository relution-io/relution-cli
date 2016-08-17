import * as Relution from 'relution-sdk';
import * as path from 'path';
import {find} from 'lodash';

import {Connection, TreeDirectory} from './../Connection';
import {Observable} from '@reactivex/rxjs';
import {CallModel} from './../../models/CallModel';
import {ConnectionModel} from './../../models/ConnectionModel';
import {Gii} from './../../gii/Gii';

export class RenderMetamodelContainer {

  private _gii = new Gii();
  /**
   * the default server
   */
  private _defaultServer: string;
  private _modelFactory = Relution.model.TypeScriptModelFactory;
  constructor(public connection: Connection) {}

  private _chooseConnection(): any | Observable<any> {
    let choices = this.connection.getConnectionNames();
    choices.push({name: this.connection.i18n.CANCEL, value: this.connection.i18n.CANCEL});

    return Observable.fromPromise(
      this.connection.inquirer.prompt({
        type: 'list',
        name: 'connectionname',
        message: this.connection.i18n.CHOOSE_LIST('Name'),
        choices: choices
      })
    );
  }

  public create() {
    let treeDirectory: TreeDirectory;
    let relutionHjson: any;
    let choosedServer: any;
    const template = this._gii.getTemplateByName('connectionGen');
    const connectionModel: ConnectionModel = new ConnectionModel();
    /**
     * choose a connection from the local file system
     */
    return this._chooseConnection()
      .exhaustMap((answers: { connectionname: TreeDirectory }) => {
        treeDirectory = answers.connectionname;
        return connectionModel.fromJson(treeDirectory.path);
      })
      /**
       * read the config file to get the app uuid
       */
      .exhaustMap((choosedConnection: ConnectionModel) => {
        return this.connection.fileApi.readHjson(path.join(process.cwd(), 'relution.hjson'));
      })
      /**
       * server choose
       */
      .exhaustMap((resp: { data: any, path: string }) => {
        relutionHjson = resp.data;
        return this.connection.helperAdd.getServerPrompt();
      })
      /**
       * login on relution
       */
      .exhaustMap((server: { connectserver: string }) => {
        this._defaultServer = this.connection.helperAdd.defaultServer;

        if (server.connectserver.toString().trim() === this._defaultServer.toString().trim()) {
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
       * get the connection uuid from the server
       */
      .exhaustMap((resp: { user: Relution.security.User }) => {
        return this.connection.getConnectionUUid(relutionHjson.uuid, connectionModel.name);
      })
      /**
       * get the metamodelContainer from the server
       */
      .exhaustMap((resp: { empty: boolean, items: Array<{calls: Array<CallModel>, metadata: Array<any>, containerUuid: string, uuid: string, aclEntries: Array<String>, effectivePermissions: String }> }) => {
        // console.log('resp', resp.items[0].calls);
        template.instance.name = connectionModel.name;
        template.instance.path = path.dirname(connectionModel.name);
        const connection = resp.items[0];
        Object.keys(connection.calls).forEach((callName: string) => {
          template.instance.metaData.push(connection.calls[callName]);
        });
        return this.connection.getConnectionMetamodelContainer(connection.containerUuid).map((resp: any) => {
          return this._modelFactory.instance.fromJSON(JSON.stringify(resp));
        });
      })
      /**
       * create a new Template
       */
      .exhaustMap((modelContainer: Relution.model.TypeScriptModelContainer) => {
        // console.log('modelContainer', JSON.stringify(modelContainer, null, 2));
        modelContainer.models.forEach((metaModel: Relution.model.TypeScriptMetaModel) => {
          template.instance.interfaces.push(metaModel);
        });
        // console.log(template.instance.template);
        return this.connection.fileApi.writeFile(template.instance.template, `${template.instance.name}.gen.ts`, this.connection.rootFolder);
      })
      .do({
        complete: () => {
          const exec = require('child_process').exec;
          exec('tsc -p .');
          return this.connection.debuglog.info(`${connectionModel.name} are updated!`);
        }
      });
  }
}
