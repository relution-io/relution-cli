import * as fs from 'fs';
import * as path from 'path';
import {Observable, Observer} from '@reactivex/rxjs';
const Hjson = require('hjson');

export class FileApi {
  public encode: string = 'utf8';
  public hjsonSuffix: string = 'hjson';
  public path: string = `${__dirname}/../../devtest/`;
  private _hjsonOptions:any =  { keepWsc: true };

  /**
   * read a hjson file by path
   *
   */
  readHjson(path:string):any {
   let readFileAsObservable:any = Observable.bindNodeCallback(fs.readFile);
   let result = readFileAsObservable(path, 'utf8');
   return Observable.create((observer:any) => {
    result.subscribe(
     (file:any) => {
       observer.next({path: path, data: Hjson.parse(file, this._hjsonOptions)});
      },
     (e:any) => console.error(e),
     () => observer.complete()
    );
   });
  }
  /**
   * Hjson.stringify(value, options)
   */
  writeHjson(content: string, fileName: string) {
    let writeFileAsObservable:any = Observable.bindNodeCallback(fs.writeFile);
    let result = writeFileAsObservable(`${this.path}${fileName}.${this.hjsonSuffix}`, Hjson.stringify(content, this._hjsonOptions), this.encode);

    return Observable.create((observer: any) => {
      result.subscribe(
        () => {
          observer.next(true);
        },
        (err: Error) => {
        if (err) {
          observer.error(err);
          observer.complete();
        }
        },
        () => observer.complete()
      );
    });
  }

  // String -> [String]
  fileList(dir: string, ext: string): any {
    let files: Array<string> = [];
    if (!fs.existsSync(dir)) {
      return Observable.throw(`${dir} not exist or maybe not readable`);
    }
    let loadingFiles:Array<string> = fs.readdirSync(dir);
    return Observable.from(loadingFiles)
    .filter((file: any): any => {
      return path.extname(file) === ext;
    });
  }
}
