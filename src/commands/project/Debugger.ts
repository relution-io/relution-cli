import * as os from 'os';
import * as path from 'path';
import * as Relution from 'relution-sdk';
import { find } from 'lodash';
import { Observable } from '@reactivex/rxjs';
import { Deploy } from './../project/Deploy';
import { FileApi } from '../../utility/FileApi';
import { ServerModelRc } from './../../models/ServerModelRc';
import { Command } from './../Command';
import { UserRc } from '../../utility/UserRc';
import { DebugLog } from '../../utility/DebugLog';
import { Translation } from '../../utility/Translation';
import { RelutionSdk } from '../../utility/RelutionSDK';
import { RxFs } from './../../utility/RxFs';

export class Debugger {

  private _deployCommand: Deploy;
  private _relutionHjson: any;
  private _fileApi: FileApi = new FileApi();
  private _owner: Command;
  private _userRc: UserRc;
  private _i18n: typeof Translation;
  private _relutionSDK: RelutionSdk;
  private _debuglog = DebugLog;
  private _inquirer: any;

  constructor(owner: Command) {
    this._owner = owner;
    this._userRc = owner.userRc;
    this._i18n = owner.i18n;
    this._relutionSDK = owner.relutionSDK;
    this._debuglog = owner.debuglog;
    this._inquirer = owner.inquirer;
    this._deployCommand = new Deploy(owner);
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
        return server.deployserver !== this._i18n.CANCEL;
      })
      /**
       * logged in on server
       */
      .mergeMap((server: { deployserver: string }) => {
        if (server.deployserver.toString().trim() === this._deployCommand.defaultServer.trim()) {
          choosedServer = find(this._userRc.server, { default: true });
        } else {
          choosedServer = find(this._userRc.server, { id: server.deployserver });
        }
        return this._relutionSDK.login(choosedServer);
      })
      .mergeMap((resp: any) => {
        const exec = require('child_process').exec;
        const redirect = Relution.web.resolveUrl('node-inspector', { application: this._relutionHjson.name });
        const url = `${choosedServer.serverUrl}/gofer/security-login?j_username=${
          encodeURIComponent(choosedServer.userName)
          }&j_password=${
          encodeURIComponent(choosedServer.password)
          }&redirect=${
          encodeURIComponent(redirect)
          }`;
        let cmd: string;
        if (os.platform() === 'win32') {
          cmd = `${process.env.COMSPEC || 'cmd'} /C "@start /B ${url.replace(/&/g, '^&')}"`;
        } else {
          cmd = `open --fresh "${url}"`;
        }
        return Observable.create((observer: any) => {
          return exec(cmd, (error: Error, stdout: any, stderr: any) => {
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


