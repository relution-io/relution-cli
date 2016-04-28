import {Observable} from '@reactivex/rxjs';
import * as fs from 'fs';
import * as path from 'path';

export class UserRc {
  private _rcHome:string;
  public appPrefix:string = 'relution';

  constructor() {
    this._rcHome = `${UserRc.getUserHome()}/.${this.appPrefix}rc`
    UserRc.debug(this);
  }

  public get rc() : string {
    return this.rc;
  }

  public set rc(v : string) {
    this.rc = v;
  }

  public rcFileExist(){
    var self = this;
    fs.exists(this._rcHome, (exists) => {
      if (!exists) {
        UserRc.debug('no rec file');
        // return self.createRcFile();
      }
      console.log(`${this._rcHome} available` )
    });
  }

  public static getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  public static debug(line:any){
    console.log(JSON.stringify(line, null, 2));
  }
}
