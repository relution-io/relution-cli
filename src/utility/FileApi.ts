import * as fs from 'fs';
import * as path from 'path';
import {Observable} from '@reactivex/rxjs';
const Hjson = require('hjson');

export class FileApi {
  public encode: string = 'utf8';
  public hjsonSuffix: string = 'hjson';
  public path: string = `${__dirname}/../../devtest/`;
  /**
   * Hjson.stringify(value, options)
   */
  writeHjson(content: string, fileName: string) {
    return Observable.create((observer: any) => {
      fs.writeFile(`${this.path}${fileName}.${this.hjsonSuffix}`, Hjson.stringify(content, { keepWsc: true }), this.encode, (err: Error) => {
        if (err) {
          return observer.error(err);
        }
        observer.next(true);
        observer.complete();
      });
    });
  }

  // String -> [String]
  fileList(dir: string, ext: string): any {
    let files: Array<string> = [];
    return Observable.create(
      (observer: any): any => {
        if (!fs.existsSync(dir)) {
          return observer.error(`${dir} not exist or maybe not readable`);
        }
        let loadingFiles:Array<string> = fs.readdirSync(dir);
        Observable.from(loadingFiles)
        .filter(
          (file: any): any => {
            return path.extname(file) === ext;
          })
        .subscribe(
          (file: string) => {
            files.push(file);
          },
          (e: any) => {observer.error(e)},
          () => {
            observer.next(files);
            observer.complete();
          }
        );
      }
    );
  }
}
