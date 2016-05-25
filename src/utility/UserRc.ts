import {Observable} from '@reactivex/rxjs';
import * as fs from 'fs';
import * as path from 'path';
import {findIndex} from 'lodash';
import {ServerModelRc} from './../models/ServerModelRc';

export class UserRc {
  private _rcHome: string;
  public appPrefix: string = 'relution';
  public server:Array<ServerModelRc> = [];
  public config: any;

  constructor() {
    this._rcHome = `${this.getUserHome()}/.${this.appPrefix}rc`
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
    return Observable.create((observer: any) => {
      fs.exists(this._rcHome, (exists) => {
        // console.log('exists', exists);
        if (exists) {
          observer.next(true);
          observer.complete();
        } else {
          //create a empty rc file if no one exists
          this.config = {server:[]};
          this.updateRcFile().subscribe(
            () => {
              observer.next(true);
            },(e:any) => {
              observer.error(e);
            }, () => {
              observer.complete();
            }
          )
        }
      });
    });
  }
  /**
   * read the relutionrc file
   */
  streamRc() {
    let self = this;
    return Observable.create((observer: any) => {
      return fs.access(this._rcHome, fs.R_OK | fs.W_OK, (err) => {
        if (err) {
          observer.error(err);
        }
        return fs.readFile(this._rcHome, 'utf8', (err, data) => {
          if (err) {
            observer.error(err);
          }
          this.config = JSON.parse(data);
          observer.next(this.config);
          observer.complete();
        });
      });
    }).map((config:any) => {
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
    this.config.server.forEach((server: any, index:number) => {
      let model:ServerModelRc = new ServerModelRc(server);
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
    return Observable.create((observer:any) => {
      return fs.writeFile(this._rcHome, JSON.stringify(this.config, null, 2), (err) => {
        if (err) observer.error(err);
        console.log(`.${this.appPrefix}rc is written`);
        observer.next(true);

        this.streamRc().subscribe({
          sucess: this.setServer,
          complete: observer.complete()
        });
      });
    });
  }
}
