interface ObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
declare var Object: ObjectCtor;
export let assign = Object.assign ? Object.assign : function(target: any, ...sources: any[]): any {
        return;
};
import {Observable} from '@reactivex/rxjs';
import * as fs from 'fs';
import * as path from 'path';

import {ServerModelRc} from './ServerModelRc';

export class UserRc {
  private _rcHome: string;
  public appPrefix: string = 'relution';
  public server:Array<ServerModelRc>;
  public config: Object;

  constructor() {
    this._rcHome = `${this.getUserHome()}/.${this.appPrefix}rc`
  }

  public get rc(): string {
    return this.rc;
  }

  public set rc(v: string) {
    this.rc = v;
  }

  public rcFileExist() {

    return Observable.create((observer: any) => {
      fs.exists(this._rcHome, (exists) => {
        if (!exists) {
          observer.next(false);

        } else {
          observer.next(true);
        }
        observer.complete();
      });
    })
  }

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
      config.server.forEach((server: any, index:number) => {
        let model:ServerModelRc = new ServerModelRc(server);
        config.server[index] = model;
        console.log(config.server[index].id);
      });
      return config;
    });
  }

  public getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  public debug(line: any) {
    console.log(JSON.stringify(line, null, 2));
  }
}
