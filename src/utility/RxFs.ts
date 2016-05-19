import * as fs from 'fs';
import {Observable} from '@reactivex/rxjs';
const rimraf = require('rimraf');

export class RxFs {

  /**
   * get stats
   * @link [fs.statSync](https://nodejs.org/api/fs.html#fs_fs_statsync_path)
   * @return boolean
   */
  static exist(path: string): boolean {
    return fs.existsSync(path);
  }

  /**
   * create a Folder
   * @link [fs.mkdirSync](https://nodejs.org/api/fs.html#fs_fs_mkdirsync_path_mode)
   * @params path: string
   * @params mode?: string
   * @return Observable
   */
  static mkdir(path: string, mode: any = '0777'): Observable<any> {
    let write: any = Observable.bindNodeCallback(fs.mkdir);
    return write(path, mode);
  }

  /**
   * @link [rimraf](https://github.com/isaacs/rimraf)
   * @params dir the dir path which one has to be deleted
   */
  static rmDir(dir: string): Observable<any>{
    if (!RxFs.exist(dir)) {
      return Observable.throw(new Error(`${dir} not exists.`));
    }
    return Observable.create((observer: any) => {
      rimraf(dir, (e: Error, data: any) => {
        console.log(e, data);
        if (e) {
          observer.error(e);
          observer.complete();
        }
        observer.next(data);
        observer.complete();
      });
    });
  }
  /**
   * create a Folder
   * @link [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options)
   * @params filename, data, options
   */
  static writeFile(filename: string, data: any): Observable<any> {
    let write: any = Observable.bindNodeCallback(fs.writeFile);
    return write(filename, data);
  }
}
