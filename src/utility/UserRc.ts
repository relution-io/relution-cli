import * as fs from 'fs';
import * as _ from 'lodash';

import {Observable} from '@reactivex/rxjs';
import {RxFs} from './RxFs';

import {ServerModelRcInterface, ServerModelRc} from './../models/ServerModelRc';

export class UserRc {
  private _rcHome: string;

  static appPrefix: string = 'relution';

  public server: Array<ServerModelRc> = [];

  static attributes = [ 'server' ];

  constructor() {
    this._rcHome = `${this.getUserHome()}/.${UserRc.appPrefix}rc`;
  }

  public fromJSON(params: any) {
    _.assignWith(this, params, (objValue: any, srcValue: any, key: string) => {
      if (UserRc.attributes.indexOf(key) >= 0) {
        if (key === 'server') {
          srcValue = srcValue.map((server: ServerModelRcInterface) => {
            return new ServerModelRc(server);
          });
        }
        return srcValue;
      }
    });
  }

  public toJSON(): any {
    let model: any = {};
    UserRc.attributes.forEach((attr: string) => {
      if (attr && this[attr] !== undefined) {
        model[attr] = this[attr];
      }
    });
    return model;
  }

  public getServer(serverIdOrSample: string | any) {
    if (_.isString(serverIdOrSample)) {
      serverIdOrSample = {
        id: serverIdOrSample
      };
    }
    return _.find(this.server, serverIdOrSample);
  }

  /**
   * check  if the relutionrc file exist
   */
  public rcFileExist() {
    if (!RxFs.exist(this._rcHome)) {
      return this.updateRcFile();
    }

    return Observable.create((observer: any) => {
      observer.next(true);
      observer.complete();
    });
  }
  /**
   * read the relutionrc file
   */
  streamRc(): Observable<UserRc> {
    return Observable.create((observer: any) => {
      /* tslint:disable:no-bitwise */
      return fs.access(this._rcHome, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      /* tslint:enable:no-bitwise */
        if (err) {
          observer.error(err);
        }
        return fs.readFile(this._rcHome, 'utf8', (error, data) => {
          if (error) {
            observer.error(error);
          }
          this.fromJSON(JSON.parse(data));
          observer.next(this);
          observer.complete();
        });
      });
    });
  }

  /**
   * the home path form the reluitonrc file
   */
  public getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  /**
   * logger
   */
  public debug(line: any) {
    console.log(JSON.stringify(line, null, 2));
  }

  /**
   * save the config into the rc file as json
   * ```javascript
   * updateRcFile().subscribe((written:boolean) => {console.log(written)});
   * ```
   */
  public updateRcFile(): Observable<UserRc> {
    // console.log(this._rcHome, JSON.stringify(this, null, 2));
    return RxFs.writeFile(this._rcHome, JSON.stringify(this, null, 2))
      .exhaustMap(() => {
        return this.streamRc();
      });
  }
}
