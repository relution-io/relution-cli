import {Connection} from './../Connection';
import {Observable} from '@reactivex/rxjs';

export class AddConnection {

  private _connection: Connection;
  private _promptkey: string = 'connectserver';
  private _server: any;
  private _protocolsUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.protocol';
  private _providerUrl = '/gofer/form/rest/enumerables/pairs/com.mwaysolutions.mcap.connector.domain.ServiceConnection.connectorProvider';

  constructor(command: Connection) {
    this.connection = command;
  }

  private _getName() {

  }

  private _getServer() {
    let prompt = this.connection._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server');
    return Observable.fromPromise(this.connection.inquirer.prompt(prompt));
  }

  add() {
    return Observable.create((observer: any) => {
      this._getServer().subscribe({
        next: (server: any) => {
          this.connection.log.debug(server[this._promptkey]);
          this.connection.log.debug(JSON.stringify(this.connection._parent.staticCommands.server, null, 2));
          this._server = this.connection._parent.staticCommands.env.envCollection.isUnique(server[this._promptkey]);

        },
        complete: () => {
          console.log(JSON.stringify(this._server, null, 2));
          observer.complete();
        }
      }
      );
    });
  }

  public get connection(): Connection {
    return this._connection;
  }

  public set connection(v: Connection) {
    this._connection = v;
  }
}
