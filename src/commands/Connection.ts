import {Command} from './../utility/Command';
import {FileApi} from './../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import {findIndex, map} from 'lodash';
import * as path from 'path';
import {AddConnection} from './connection/Add';
import {ApiList} from './connection/ApiList';
import {Observable} from '@reactivex/rxjs';
import {ConnectionModel} from './../models/ConnectionModel';

interface TreeDirectory {
  name: string;
  path: string;
  size: number;
  baseNameRelativ?: string;
  children?: Array<TreeDirectory>;
  connection?: ConnectionModel;
}

export /**
 * Connection
 * ```bash
 * ┌────────────┬──────────┬──────────┬─────────────────────────┐
 * │ Options    │ Commands │ Param(s) │ Description             │
 * │            │          │          │                         │
 * │ connection │ add      │ <$name>  │ create a connection     │
 * │ connection │ help     │ --       │ List the Deploy Command │
 * │ connection │ quit     │ --       │ Exit to Home            │
 * │            │          │          │                         │
 * └────────────┴──────────┴──────────┴─────────────────────────┘
 * ```
 */
  class Connection extends Command {
  public fileApi: FileApi = new FileApi();
  public connectionRoot: string = path.join(process.cwd(), 'connections');

  public commands: any = {
    add: {
      when: this.addEnabled,
      why: this.addWhyDisabled,
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
        return this.connectionsDirTree.length < 0 ? true : false;
      },
      why: () => {
        return `Please add first a Connection for this feature.`;
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
    help: {
      description: this.i18n.LIST_COMMAND('Deploy')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };
  public helperAdd: AddConnection = new AddConnection(this);
  public helperApiList: ApiList = new ApiList(this);
  public connectionsDirTree: Array<TreeDirectory>;
  public rootFolder = `${process.cwd()}/connections`;

  constructor() {
    super('connection');
  }

  /**
   * get all Connections form the rootfolder
   */
  flatTree(tree: any, store: TreeDirectory[] = []): TreeDirectory[] {
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

  getConnectionNames(): string[] {
    return map(this.connectionsDirTree, (item: any) => {
      return item.connection.name;
    });
  }

  streamConnectionFromFileSystem() {
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
      }
    );
  }

  preload() {
    return Observable.create((observer: any) => {
      return this.streamConnectionFromFileSystem().subscribe({
        error: (e: Error) => {
          this.log.error(e);
          return super.preload();
        },
        complete: () => {
          return super.preload();
        }
      });
    });
  }

  apiList(name?: string) {
    return this.helperApiList.apiList();
  }

  add(path?: string): Observable<any> {
    return this.helperAdd.add();
  }
  /**
   * check if the connection add command is disabled
   */
  addEnabled(): boolean {
    if (!RxFs.exist(`${process.cwd()}/connections`)) {
      return false;
    }
    if (!this.userRc.server.length) {
      return false;
    }
    return true;
  }
  /**
   * return why is is not enabld
   */
  addWhyDisabled(): string {

    if (!RxFs.exist(`${process.cwd()}/connections`)) {
      return `Folder Connections not exist in ${process.cwd()}.`;
    }

    if (!this.userRc.server.length) {
      return `Please add first a Server to create a Connection.`;
    }
  }
}
