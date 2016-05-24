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
  public zipFilePath: string = '';

  constructor(path: string = process.cwd()) {
    this.path = path;
  }
  /**
   * zip all files which not in .relutionignore and next the zip path
   * @return Observable
   */
  createBundle(zipPath?:string): Observable<any> {
    let count: number = 0;
    if (!zipPath) {
      this.zipFilePath = path.resolve(os.tmpdir() + '/relution_app_' + Date.now() + '.zip');
    } else {
      this.zipFilePath = zipPath;
    }

    let output = fs.createWriteStream(this.zipFilePath);
    /**
     * @link [archiver](https://github.com/archiverjs/node-archiver)
     */
    let archiver = archive('zip');

    //console.log(this.zipFilePath);
    return Observable.create((observer: any) => {
      /**
       * @link [fstream-ignore](https://github.com/npm/fstream-ignore)
       */
      let zipFiles = fIgnore({
        path: this.path,
        ignoreFiles: [this._relIgnore]
      });

      zipFiles.on('child', (c: any) => {
        var name = c.path.substr(c.root.path.length + 1);
        if (c.type === 'File') {
          ++count;
          archiver.append(c, { name: name });
          observer.next({ file: name })
        } else if (c.type === 'Directory') {
          archiver.append(null, { name: name + '/' });
          observer.next({ directory: name });
        }
      });

      zipFiles.on('end', () => {
        archiver.finalize();
        observer.next({ processed: `Processed ${count} files` });
      });

      output.on('finish', () => {
        /**
         * readstream for the formdata
         */
          observer.next({
            zip: this.zipFilePath,
            message: `Zip created at ${this.zipFilePath}`,
            readStream: fs.createReadStream(this.zipFilePath)
          });
          observer.complete();
      });

      output.on('error', (e: Error) => {
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
