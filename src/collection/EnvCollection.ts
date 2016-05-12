import {EnvModel} from './../models/EnvModel';
import {FileApi} from './../utility/FileApi';
import {Observable} from '@reactivex/rxjs';
import {find} from 'lodash';
/**
 * @class EnvCollection the collection Helper Class for the environments
 */
export class EnvCollection {
  /**
   * @param collection a array off Environments
   */
  public collection: Array<EnvModel> = [];
  /**
   * @param envFiles available files from the envFolder Path
   */
  public envFiles: Array<string> = [];
  /**
   * @param envFolder root folder from the env/<name>.hjson
   */
  public envFolder: string = `${process.cwd()}/devtest`;
  /**
   * @param fsApi file helper
   */
  public fsApi: FileApi = new FileApi();

  /**
   * load all hjson file with content and add it to the collection
   * @param observer to will be completed
   * @returns Observable
   */
  public setCollection(observer:any) {
    let datas:Array<any> = [];
    let all:Array<any> = [];
    this.collection = [];
    this.envFiles.forEach((file) => {
      all.push(this.fsApi.readHjson(`${this.envFolder}/${file}`));
    })
    Observable.forkJoin(all).subscribe((hjsons:any) => {
      hjsons.forEach((data:any) => {
        let model = new EnvModel(data.data.name, data.path, data.data);
        this.collection.push(model);
      });
      observer.next(this.collection);
    },
    () => {},
    () => {observer.complete()});
  }
  /**
   * if match the name in the collection
   * @param name the name: "" from your hjson file
   * @returns EnvModel
   */
  public isUnique(name:string):EnvModel{
    let test = find(this.collection, {name: name});
    console.log('test', this.collection, test);
    return test;
  }
  /**
   * load all available hjson file from the envFolder and preload the collection
   * @param name the name: "" from your hjson file
   * @returns Observable
   */
  public getEnvironments() {
    this.envFiles = [];
    this.collection = [];

    return Observable.create((observer: any) => {
      this.fsApi.fileList(this.envFolder, '.hjson')
      .subscribe({
        next: (filePath: string) => {
          this.envFiles.push(filePath);
        },
        complete: () => {
          return this.setCollection(observer);
        }
      });
    });
  }
  /**
   * return available names from the hjson files
   * @returns Array
   */
  public flatEnvArray():Array<string>{
    let flat:Array<string> = [];
    this.collection.forEach((model:EnvModel) => {
      flat.push(model.name);
    });
    return flat;
  }
}
