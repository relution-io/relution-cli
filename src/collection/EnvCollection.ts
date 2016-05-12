import {EnvModel} from './../models/EnvModel';
import {FileApi} from './../utility/FileApi';
import {Observable} from '@reactivex/rxjs';
import {find} from 'lodash';

export class EnvCollection {
  public collection: Array<EnvModel> = [];
  public envFiles: Array<string> = [];
  public envFolder: string = `${process.cwd()}/devtest`;
  public fsApi: FileApi = new FileApi();

  public setCollection(observer:any) {
    let datas:Array<any> = [];
    let all:Array<any> = [];
    this.envFiles.forEach((file) => {
      all.push(this.fsApi.readHjson(`${this.envFolder}/${file}`));
    })
    Observable.forkJoin(all).subscribe((hjsons:any) => {
      hjsons.forEach((data:any) => {
        let model = new EnvModel(data.data.name, data.path);
        model.data = data.data;
        this.collection.push(model);
      });
      observer.next(this.collection);
    },
    () => {},
    () => {observer.complete()});
  }

  public isUnique(name:string):EnvModel{
    return find(this.collection, {name: name});
  }

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

  public flatEnvArray(){
    let flat:Array<string> = [];
    this.collection.forEach((model:EnvModel) => {
      flat.push(model.name);
    });
    return flat;
  }
}
