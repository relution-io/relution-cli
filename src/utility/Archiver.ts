const fIgnore = require('fstream-ignore');
import {Observable} from '@reactivex/rxjs';
const archive = require('archiver');
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export /**
 * Archiver
 */
  class Archiver {
  private _path: string;
  private _relIgnore: string = '.relutionignore';

  private _files: Array<any> = [];
  public zipFilePath:string = '';

  constructor(path: string = process.cwd()) {
    this.path = path;
  }
  /**
   * zip all files which not in .relutionignore and next the zip path
   * @return Observable
   */
  createBundle(): Observable<any> {
    let count: number = 0;
    this.zipFilePath = path.resolve(os.tmpdir() + '/relution_app_' + Date.now() + '.zip');
    let output = fs.createWriteStream(this.zipFilePath);
    let archiver = archive('zip');

    //console.log(this.zipFilePath);
    return Observable.create((observer: any) => {
      fIgnore({
        path: this.path,
        ignoreFiles: [this._relIgnore]
      })
        .on('child', (c: any) => {
          var name = c.path.substr(c.root.path.length + 1);
          if (c.type === 'File') {
            ++count;
            archiver.append(c, { name: name });
            observer.next({ file: name })
          } else if (c.type === 'Directory') {
            archiver.append(null, { name: name + '/' });
            observer.next({ directory: name });
          }
        })
        .on('end', () => {
          archiver.finalize();
          observer.next({processed: `Processed ${count} files`});
        });

      output.on('finish', () => {
        Observable.fromEvent(fs.createReadStream(this.zipFilePath), 'data')
        .subscribe((stream:any) => {
          observer.next({
            zip: this.zipFilePath,
            message: `Zip created at ${this.zipFilePath}`,
            readStream:  stream
          });
          observer.complete();
        });
      })
      .on('error', (e:Error) => {
        observer.error(e);
      });

      archiver.pipe(output);
    });
  }

  public get path(): string {
    return this._path;
  }

  public set path(v: string) {
    this._path = v;
  }
}
