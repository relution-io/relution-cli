import { Command } from './Command';
import {ServerModelRc} from './../models/ServerModelRc';
import {Deploy} from './project/Deploy';
import {find} from 'lodash';
import {FileApi} from '../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import * as os from 'os';
import * as path from 'path';
import * as Relution from 'relution-sdk';

import {Observable} from '@reactivex/rxjs';

export class Debugger extends Command {

  private _deployCommand: Deploy;
  private _relutionHjson: any;
  private _fileApi: FileApi = new FileApi();

  public commands: Object = {
    open: {
      when: () => {
        return RxFs.exist(path.join(this._deployCommand.projectDir, 'relution.hjson'));
      },
      why: () => {
        return this.i18n.DEBUGGER_OPEN_WHY;
      },
      description: this.i18n.DEBUGGER_OPEN_DESCRIPTION,
      vars: {
        server: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.HELP_COMMAND('Debugger')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  constructor() {
    super('debug');
    this._deployCommand = new Deploy(this);
  }

  public open() {
    let choosedServer: ServerModelRc;
    /**
     * get the relution.hjson
     */
    return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
    /**
     * get a server from inquirer
     */
    .exhaustMap((relutionHjson: { data: any, path: string }) => {
      this._relutionHjson = relutionHjson.data;
      return this._deployCommand.getServerPrompt();
    })
    .filter((server: { deployserver: string }) => {
      return server.deployserver !== this.i18n.CANCEL;
    })
    /**
     * logged in on server
     */
    .mergeMap((server: { deployserver: string }) => {
      if (server.deployserver.toString().trim() === this._deployCommand.defaultServer.trim()) {
        choosedServer = find(this.userRc.server, { default: true });
      } else {
        choosedServer = find(this.userRc.server, { id: server.deployserver });
      }
      return this.relutionSDK.login(choosedServer);
    })
    .mergeMap((resp: any) => {
      const exec = require('child_process').exec;
      const redirect = Relution.web.resolveUrl('node-inspector', { application: this._relutionHjson.name });
      const url = `${choosedServer.serverUrl}/gofer/security-login?j_username=${choosedServer.userName}&j_password=${choosedServer.password}&redirect=${redirect}`;
      let cmd = 'open --fresh';
      if (os.platform() === 'win32') {
        cmd = 'start';
      }
      return Observable.create((observer: any) => {
        return exec(`${cmd} "${url}"`, (error: Error, stdout: any, stderr: any) => {
          if (error) {
            observer.error(`exec error: ${error}`);
            return;
          }
          observer.next(`Debugger will open ${redirect} please wait`);
          observer.complete();
        });
      });
    });
  }
}


