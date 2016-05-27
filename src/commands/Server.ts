import {Observable} from '@reactivex/rxjs';
import {Command} from './../utility/Command';
import {Validator} from './../utility/Validator';
import {ServerCrud} from './server/ServerCrud';

import {ServerModelRc, ServerModelInterface} from './../models/ServerModelRc';
import {orderBy, partition, concat, map, findIndex} from 'lodash';


const PRESS_ENTER = ' or press enter';

export class Server extends Command {
  public tableHeader: Array<string> = ['Name', 'Server url', 'Default', 'Username'];
  public debug: boolean = true;
  public crudHelper: ServerCrud;

  public commands: Object = {
    add: {
      description: this.i18n.SERVER_ADD,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    list: {
      description: this.i18n.SERVER_LIST,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    update: {
      description: this.i18n.SERVER_UPDATE,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    rm: {
      description: this.i18n.SERVER_RM,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.LIST_COMMAND('Server')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  constructor() {
    super('server');
  }

  preload():Observable<any> {
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
    let _parts = partition(
      this.userRc.server,
      (server: ServerModelRc) => {
        return server.default
      }
    );

    if (_parts[1]) {
      _parts[1] = orderBy(_parts[1], ['id'], ['asc']);
    }
    let _list: any = concat(_parts[0], _parts[1]);

    _list.forEach((model: ServerModelRc) => {
      content.push(model.toTableRow(), empty);
    });

    return Observable.create((observer: any) => {
      observer.next(this.table.sidebar(content));
      observer.complete();
    });
  }

  /**
   * update existing Server
   */
  update(params?: Array<string>):Observable<any> {
    return this.crudHelper.update(params);
  }

  /**
   * Delete a Server from the RC file Object
   */
  rm(id?:string):Observable<any> {
    return this.crudHelper.rm(id);
  }
  /**
   * add method
   */
  add(params: Array<string>):Observable<any> {
    return this.crudHelper.add(params);
  }
}
