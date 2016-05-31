import {Observable} from '@reactivex/rxjs';
import * as fs from 'fs';
import {RxFs} from './RxFs';

import {ServerModelRc} from './../models/ServerModelRc';

export class UserRc {
  private _rcHome: string;
  public appPrefix: string = 'relution';
  public server: Array<ServerModelRc> = [];
  public config: any;

  constructor() {
    this._rcHome = `${this.getUserHome()}/.${this.appPrefix}rc`;
  }

  public get rc(): string {
    return this.rc;
  }

  public set rc(v: string) {
    this.rc = v;
  }
  /**
   * check  if the relutionrc file exist
   */
  public rcFileExist() {
    if (!RxFs.exist(this._rcHome)) {
      this.config = { server: [] };
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
  streamRc() {
    return Observable.create((observer: any) => {
      /* tslint:disable:no-bitwise */
      return fs.access(this._rcHome, fs.R_OK | fs.W_OK, (err) => {
      /* tslint:enable:no-bitwise */
        if (err) {
          observer.error(err);
        }
        return fs.readFile(this._rcHome, 'utf8', (error, data) => {
          if (error) {
            observer.error(error);
          }
          this.config = JSON.parse(data);
          observer.next(this.config);
          observer.complete();
        });
      });
    }).map((config: any) => {
      this.setServer();
      return config;
    });
  }
  /**
   * set a collection the server models
   *
   */
  public setServer() {
    this.server = [];
    this.config.server.forEach((server: any, index: number) => {
      let model: ServerModelRc = new ServerModelRc(server);
      this.server.push(model);
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
  public updateRcFile() {
    return RxFs.writeFile(this._rcHome, JSON.stringify(this.config, null, 2))
      .exhaustMap(() => {
        return this.streamRc();
      })
      .do(() => {
        // console.log('rc file written');
      });
  }
}
