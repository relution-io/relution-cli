import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';
import {ServerCrud} from './server/ServerCrud';

import {ServerModelRc, ServerModel} from './../models/ServerModelRc';
import {orderBy, partition, concat, map, findIndex} from 'lodash';

const PRESS_ENTER = ' or press enter';
export class Server extends Command {
  public tableHeader: Array<string> = ['Name', 'Server url', 'Default', 'Username'];
  public debug: boolean = true;
  public crudHelper: ServerCrud;

  public commands: Object = {
    add: {
      description: 'add a new BaaS Server',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    list: {
      description: 'list all available BaaS Server',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    update: {
      description: 'update a exist server from the Server list',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    rm: {
      description: 'remove a server form the list',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: 'List the Server Command'
    },
    quit: {
      description: 'Exit To Home'
    }
  };

  constructor() {
    super('server');
  }

  preload(){
    return Observable.create((observer: any) => {
      super.preload().subscribe({complete: () => {
        this.crudHelper = new ServerCrud(this.userRc);
        observer.complete();
      }})
    });
  }

  /**
   * list available Server
   */
  list(name?: string) {
    let empty: Array<string> = ['', '', '', ''];
    let content: Array<any> = [empty];
    let _parts = partition(this.userRc.server, (server: ServerModelRc) => {
      return server.default
    });

    if (_parts[1]) {
      _parts[1] = orderBy(_parts[1], ['id'], ['asc']);
    }
    let _list: any = concat(_parts[0], _parts[1]);

    _list.forEach((model: ServerModelRc) => {
      content.push(model.toTableRow(), empty);
    });

    return Observable.create((observer: any) => {
      observer.next(this.table.sidebar(this.tableHeader, content));
      observer.complete();
    });
  }

  /**
   * update existing Server
   */
  update(params?: Array<string>):any {
    this.crudHelper.update(params).subscribe(
      () => {},
      (e:any) => console.error(e),
      () => {
        return this.init([this.name], this._parent);
      }
    );
  }

  /**
   * Delete a Server from the RC file Object
   */
  rm(id?:string):any {
    this.crudHelper.rm(id).subscribe(
      () => {},
      (e:any) => console.error(e),
      () => {
        return this.init([this.name], this._parent);
      }
    );
  }
  /**
   * add method
   */
  add(params: Array<string>):any {
    return this.crudHelper.add(params).subscribe(
      () => {},
      (e:any) => console.error(e),
      () => {
        return this.init([this.name], this._parent);
      }
    );
  }
}
