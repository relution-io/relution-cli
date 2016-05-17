import * as fs from 'fs';
import * as path from 'path';
import {Observable} from '@reactivex/rxjs';
import {RxFs} from './RxFs';

const Hjson = require('hjson');

export class FileApi {
  public encode: string = 'utf8';
  public hjsonSuffix: string = 'hjson';
  public path: string = `${__dirname}/../../devtest/`;
  public hjsonOptions: any = { keepWsc: true };

  mkdirStructureFolder(path:string):Observable<any> {
    let exist: any = RxFs.exist(path);

    if (exist) {
      return Observable.throw(new Error(`${path} already exist`));
    }
    return Observable.zip(RxFs.mkdir(path), RxFs.writeFile(`${path}/.gitkeep`, ''));
  }

  /**
   * read a hjson file by path
   *
   */
  readHjson(path: string): any {
    let readFileAsObservable: any = Observable.bindNodeCallback(fs.readFile);
    let result = readFileAsObservable(path, 'utf8');
    return Observable.create((observer: any) => {
      result.subscribe(
        (file: any) => {
          observer.next({ path: path, data: Hjson.parse(file, this.hjsonOptions) });
        },
        (e: any) => observer.error(e),
        () => observer.complete()
      );
    });
  }

  copyHjson(org: any) {
    let c: any = Hjson.stringify(org, this.hjsonOptions);
    return Hjson.parse(c, this.hjsonOptions);
  }

  /**
   * Hjson.stringify(value, options)
   *   Hjson.parse(text, options)
      options {
        keepWsc     boolean, keep white space and comments. This is useful
                    if you want to edit an hjson file and save it while
                    preserving comments (default false)
      }
      This method parses Hjson text to produce an object or array.
      It can throw a SyntaxError exception.
      Hjson.stringify(value, options)
   */
  writeHjson(content: string, fileName: string) {
    let writeFileAsObservable: any = Observable.bindNodeCallback(fs.writeFile);
    let result = writeFileAsObservable(`${this.path}${fileName}.${this.hjsonSuffix}`, this.copyHjson(content));

    return Observable.create((observer: any) => {
      result.subscribe(
        () => {
          observer.next(true);
        },
        (err: any) => {
          observer.error(err);
          observer.complete();
        },
        () => {observer.complete();}
      );
    });
  }

  /**
   * Hjson.stringify(value, options)
   */
  writeFile(content: string, fileName: string, path: string = process.cwd()) {
    let writeFileAsObservable: any = Observable.bindNodeCallback(fs.writeFile);
    let result = writeFileAsObservable(`${path}/${fileName}`, content);
    // console.log(content, fileName, path);
    return Observable.create((observer: any) => {
      result.subscribe(
        () => {
          observer.next(true);
        },
        (err: any) => {
          console.error(err);
          observer.error(err);
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
    let loadingFiles: Array<string> = fs.readdirSync(dir);
    return Observable.from(loadingFiles).filter(
      (file: any): any => {
        return path.extname(file) === ext;
      }
    );
  }
}
