import {Command} from './../utility/Command';
import {FileApi} from './../utility/FileApi';
import * as path from 'path';
import {AddConnection} from './connection/Add';
import {Observable} from '@reactivex/rxjs';

export /**
 * Connection
 */
class Connection extends Command {
  public fileApi: FileApi = new FileApi();
  public connectionRoot: string = path.join(process.cwd(), 'connections');
  public commands: any = {
    add: {
      description: 'create a connection',
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

  constructor() {
    super('connection');
  }

  add(path?: string): Observable<any> {
    return this.helperAdd.add();
  }
}
