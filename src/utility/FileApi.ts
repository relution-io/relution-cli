import * as fs from 'fs';
import * as path from 'path';
import {Observable} from '@reactivex/rxjs';
import {RxFs} from './RxFs';
import * as mkdirp from 'mkdirp';
const dirTree = require('directory-tree');
const hjson = require('hjson');

export class FileApi {
  // standard file encoding
  public encode: string = 'utf8';
  // hjson extension name
  public hjsonSuffix: string = 'hjson';
  // test
  public path: string = `${__dirname}/../../devtest/`;
  // options abouthjson
  public hjsonOptions: any = { keepWsc: true };
  public rxFs = RxFs;
  /**
   * create a Folder with a .gitkeep file
   */
  mkdirStructureFolder(path: string): Observable<any> {
    let exist: any = RxFs.exist(path);
    if (exist) {
      return Observable.throw(new Error(`${path} already exist`));
    }
    return RxFs.mkdir(path);
  }

  /**
   * create a folder nested
   */
  mkdirp(path: string) {
    let writer = Observable.bindNodeCallback(mkdirp);
    return writer(path);
  }
  /**
   * read a hjson file by path
   * on next you will get following:
   * read the comments is avalaible in data.__WSC__
   * ```json
   * {
   *  path: path,
   *  data: Hjson.parse(file, this.hjsonOptions)
   * }
   * ```
   * @returns Observable
   */
  readHjson(path: string): any | Observable<{
    data: any,
    path: string
  }> {
    let readFileAsObservable: any = Observable.bindNodeCallback(fs.readFile);
    let result = readFileAsObservable(path, 'utf8');
    return Observable.create((observer: any) => {
      result.subscribe(
        (file: any) => {
          observer.next({
            path: path,
            data: hjson.parse(file, this.hjsonOptions)
          });
        },
        (e: any) => observer.error(e),
        () => observer.complete()
      );
    });
  }
  /**
   * copy a exist hjson Object
   */
  copyHjson(org: any) {
    let c: any = hjson.stringify(org, this.hjsonOptions);
    return hjson.parse(c, this.hjsonOptions);
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
  writeHjson(content: any, fileName: string, path: string = this.path) {
    return RxFs.writeFile(`${path}/${fileName}.${this.hjsonSuffix}`, this.copyHjson(content));
  }
  /**
   * write a file
   */
  writeFile(content: string, fileName: string, path: string = process.cwd()) {
    return RxFs.writeFile(`${path}/${fileName}`, content);
  }

  // String -> [String]
  fileList(dir: string, ext?: string): Observable<string> {
    if (!fs.existsSync(dir)) {
      return Observable.throw(new Error(`${dir} does not exist or may not be readable`));
    }
    let loadingFiles: Array<string> = fs.readdirSync(dir);
    // files by extension
    if (ext && ext.length) {
      return Observable.from(loadingFiles).filter(
        (file: any): any => {
          return path.extname(file) === ext;
        }
      );
    }
    // all
    return Observable.from(loadingFiles);
  }

  /**
   * read recurisv a folder and get all files by filter
   */
  dirTree(folderPath: string, filter?: Array<string>) {
    if (filter && filter.length) {
      return dirTree(folderPath, filter);
    }
    return dirTree(folderPath);
  }
}
