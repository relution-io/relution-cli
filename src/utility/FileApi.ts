import * as fs from 'fs';
import {Observable} from '@reactivex/rxjs';
const Hjson = require('hjson');

export class FileApi {
  public encode:string = 'utf8';
  public hjsonSuffix: string = 'hjson';
  public path:string = `${__dirname}/../../devtest/`;

  writeHjson(content:string, fileName:string) {
    return Observable.create((observer:any) => {
      fs.writeFile(`${this.path}${fileName}.${this.hjsonSuffix}`, Hjson.stringify(content), this.encode, (err:Error) => {
        if (err) {
          return observer.error(err);
        }
        observer.next(true);
        observer.complete();
      });
    });
  }
}
