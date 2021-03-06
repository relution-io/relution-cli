import {Observable} from '@reactivex/rxjs';
import {Command} from './Command';
import {ServerCrud} from './server/ServerCrud';
import {ServerModelRc} from './../models/ServerModelRc';
import {orderBy, partition, concat} from 'lodash';
/**
 * Relution Server Command
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                                │
 * │         │          │          │                                            │
 * │ server  │ add      │ <$name>  │ Add a new Server to the config             │
 * │ server  │ list     │ <$name>  │ List all available Server from config      │
 * │ server  │ update   │ <$name>  │ Update a exist server from the Server list │
 * │ server  │ rm       │ <$name>  │ Remove a Server from the config            │
 * │ server  │ help     │ --       │ List the Server Command                    │
 * │ server  │ back     │ --       │ Exit to Home                               │
 * │         │          │          │                                            │
 * └─────────┴──────────┴──────────┴────────────────────────────────────────────┘
 * ```
 */
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
    clientcert: {
      description: this.i18n.SERVER_CLIENTCERT,
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
      description: this.i18n.HELP_COMMAND('Server')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  constructor() {
    super('server');
  }

  preload(): Observable<any> {
    return super.preload()
      .map(() => {
        this.crudHelper = new ServerCrud(this);
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
        return server.default;
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
      observer.next(this.table.sidebar(content, this.i18n.SERVER_LIST_TABLEHEADERS));
      observer.complete();
    });
  }

  /**
   * update existing Server
   */
  update(params?: Array<string>): Observable<any> {
    return this.crudHelper.update(params);
  }

  /**
   * Delete a Server from the RC file Object
   */
  rm(id?: string): Observable<any> {
    return this.crudHelper.rm(id);
  }

  /**
   * add method
   */
  add(params: Array<string>): Observable<any> {
    return this.crudHelper.add(params);
  }

  clientcert(params: Array<string>): Observable<any> {
    return this.crudHelper.clientcert(params);
  }
}
