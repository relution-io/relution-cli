import * as path from 'path';
import * as chalk from 'chalk';

import {Command} from './Command';
import {FileApi} from './../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import {findIndex, map} from 'lodash';
import {AddConnection} from './connection/Add';
import {ApiList} from './connection/ApiList';
import {RenderMetamodelContainer} from './connection/RenderMetamodelContainer';
import {Observable} from '@reactivex/rxjs';
import {ConnectionModel} from './../models/ConnectionModel';
import * as Relution from 'relution-sdk';

export interface TreeDirectory {
  name: string;
  path: string;
  size: number;
  baseNameRelativ?: string;
  children?: Array<TreeDirectory>;
  connection?: ConnectionModel;
}

/**
 * Connection
 * ```bash
 * ┌────────────┬──────────┬──────────┬─────────────────────────┐
 * │ Options    │ Commands │ Param(s) │ Description             │
 * │            │          │          │                         │
 * │ connection │ add      │ <$name>  │ create a connection     │
 * │ connection │ help     │ --       │ List the Deploy Command │
 * │ connection │ back     │ --       │ Exit to Home            │
 * │            │          │          │                         │
 * └────────────┴──────────┴──────────┴─────────────────────────┘
 * ```
 */
export class Connection extends Command {
  public fileApi: FileApi = new FileApi();
  public rootFolder: string = path.join(process.cwd(), 'connections');
  private _uuidConnectionUrl: string;
  private _callsUrl: string;
  private _metaModelContainerUrl: string;


  public commands: any = {
    add: {
      when: () => this.addEnabled(),
      why: () => this.addWhyDisabled(),
      label: this.i18n.CONNECTION_ADD_LABEL,
      method: 'add',
      description: this.i18n.CONNECTION_ADD_DESCRIPTION,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    apilist: {
      when: (): boolean => {
        return this.connectionsDirTree.length <= 0 ? false : true;
      },
      why: () => {
        return this.i18n.CONNECTION_ADD_CONNECTION_BEFORE;
      },
      label: this.i18n.CONNECTION_API_LIST_LABEL,
      method: 'apiList',
      description: this.i18n.CONNECTION_API_LIST_DESCRIPTION,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    createInterfaces: {
      label: this.i18n.CONNECTION_RENDER_METAMODEL_LABEL
    },
    list: {
      when: () => {
        return RxFs.exist(this.rootFolder);
      },
      why: () => {
        return this.i18n.FOLDER_NOT_EXIST(this.rootFolder);
      },
      description: this.i18n.LIST_AVAILABLE_CONFIG('Connections'),
    },
    help: {
      description: this.i18n.HELP_COMMAND('Connections')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };
  public helperAdd: AddConnection = new AddConnection(this);
  public helperApiList: ApiList = new ApiList(this);
  public helperMetaModelContainer = new RenderMetamodelContainer(this);
  public connectionsDirTree: Array<TreeDirectory> = [];

  constructor() {
    super('connection');
  }

  public preload() {
    return super.preload().exhaustMap(
      () => {
        return this.streamConnectionFromFileSystem();
      }
    );
  }

  set metaModelContainerUrl (containerUuid: string) {
    this._metaModelContainerUrl = `/gofer/meta-model/rest/modelContainers/${containerUuid}`;
  }

  get metaModelContainerUrl (): string {
    return this._metaModelContainerUrl;
  }

  public get callsUrl(): string {
    return this._callsUrl;
  }

  public set callsUrl(v: string) {
    this._callsUrl = `/mcap/connector/rest/connectors/${v}/calls`;
  }
  /**
   * get all Connections form the rootfolder
   */
  public flatTree(tree: any, store: TreeDirectory[] = []): TreeDirectory[] {
    if (!tree) {
      return store;
    };
    if (tree.children) {
      return this.flatTree(tree.children, store);
    }

    tree.forEach((branch: TreeDirectory) => {
      if (branch.children) {
        return this.flatTree(branch.children, store);
      }
      if (branch.path) {
        branch.baseNameRelativ = branch.path.replace(`${this.rootFolder}/`, '');
        store.push(branch);
      }
    });
    return store;
  }
  /**
   * Query Filter to get the connection from the Server
   */
  public connectionFilter = {
    'type': 'logOp',
    'operation': 'AND',
    'filters': [
      {
        'type': 'string',
        'fieldName': 'application',
        'value': ''
      },
      {
        'type': 'string',
        'fieldName': 'name',
        'value': ''
      }
    ]
  };
  /**
   * simple getter
   */
  public get uuidConnectionUrl(): string {
    return this._uuidConnectionUrl;
  }

  public setUuidConnectionUrl(uuid: string, connectionName: string) {
    this.connectionFilter.filters[0].value = uuid;
    this.connectionFilter.filters[1].value = connectionName;
    let query = encodeURIComponent(`${JSON.stringify(this.connectionFilter)}`);
    this._uuidConnectionUrl = (`/mcap/connector/rest/connectors/?filter=${query}&field=uuid&field=containerUuid&field=calls`);
  }

  public getConnectionNames(): {name: string, value: TreeDirectory | any}[] {
    return map(this.connectionsDirTree, (item: TreeDirectory) => {
      return {name: item.connection.name, value: item};
    });
  }

  /**
   * fetch the uuid from the server by query
   */
  public getConnectionUUid(appUUid: string, connectionName: string) {
    this.setUuidConnectionUrl(appUUid, connectionName);
    return Observable.fromPromise(
      Relution.web.ajax(
        {
          method: 'GET',
          url: this.uuidConnectionUrl
        })
    );
  }
  /**
   * return a list of availables calls for the connection
   */
  public getConnectionCalls(connectionUuid: string) {
    this.callsUrl = connectionUuid;
    return Observable.fromPromise(
      Relution.web.ajax(
        {
          method: 'GET',
          url: this.callsUrl
        })
    );
  }
  /**
   * return a list of availables metamodel for the connection
   */
  public getConnectionMetamodelContainer(containerUuid: string) {
    this.metaModelContainerUrl = containerUuid;
    return Observable.fromPromise(
      Relution.web.ajax({
        method: 'GET',
        url: this.metaModelContainerUrl
      })
    );
  }
  /**
   * return all connections from the connection folder
   */
  public streamConnectionFromFileSystem() {
    this.connectionsDirTree = this.flatTree(this.fileApi.dirTree(this.rootFolder, ['.hjson']));
    let forkjoin: any = [];
    this.connectionsDirTree.forEach((connection: TreeDirectory) => {
      forkjoin.push(this.fileApi.readHjson(connection.path));
    });

    return Observable.forkJoin(forkjoin).map(
      (hjsonsRead: Array<{ path: string, data: ConnectionModel }>) => {
        hjsonsRead.forEach((hjsonFile: { path: string, data: ConnectionModel }) => {
          let index: number = findIndex(this.connectionsDirTree, { path: hjsonFile.path });
          if (index > - 1) {
            this.connectionsDirTree[index].connection = new ConnectionModel(hjsonFile.data);
          }
        });
        return this.connectionsDirTree;
      }
    );
  }
  /**
   * Add some calls to the connection
   */
  public apiList(name?: string) {
    return this.helperApiList.apiList();
  }
  /**
   * create a new connection
   */
  public add(path?: string): Observable<any> {
    return this.helperAdd.add();
  }
  /**
   * check if the connection add command is disabled
   */
  public addEnabled(): boolean {
    if (!this.userRc.server.length) {
      return false;
    }
    if (!RxFs.exist(this.rootFolder)) {
      return false;
    }
    return true;
  }
  /**
   * return why is is not enabld
   */
  public addWhyDisabled(): string {
    if (!this.userRc.server.length) {
      return this.i18n.CONNECTION_ADD_SERVER_BEFORE;
    }

    if (!RxFs.exist(this.rootFolder)) {
      return this.i18n.FOLDER_NOT_EXIST(this.rootFolder);
    }
  }

  /**
   * shows all available connections
   * @returns Observable
   */
  public list() {
    return Observable.create((observer: any) => {
      let content: any = [['']];
      this.getConnectionNames().forEach((connection) => {
        let model: ConnectionModel = connection.value && connection.value.connection;
        content.push([
          chalk.yellow(connection.name),
          model && model.description || ''
        ]);
      });
      if (content.length < 1) {
        observer.complete();
      }
      observer.next(this.table.sidebar(content, this.i18n.CONNECTION_LIST_TABLEHEADERS));
      observer.complete();
    });
  }

  public createInterfaces() {
    return this.helperMetaModelContainer.create();
  }
}
