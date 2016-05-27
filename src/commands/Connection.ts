import {Command} from './../utility/Command';
import {FileApi} from './../utility/FileApi';
import * as Relution from 'relution-sdk';
import * as path from 'path';
import {AddConnection} from './connection/Add';


export /**
 * Connection
 */
class Connection extends Command{
  public fileApi :FileApi = new FileApi();
  constructor(){
    super('connection');
  }

  public _connectionRoot: string = path.join(process.cwd(), 'connections');

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

  public helperAdd:AddConnection = new AddConnection(this);

  add(path?:string) {
    return this.helperAdd.add();
  }
}
