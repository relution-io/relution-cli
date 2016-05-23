import {EnvModel} from './../models/EnvModel';
import {FileApi} from './../utility/FileApi';
import {Validator} from './../utility/Validator';
import {Observable} from '@reactivex/rxjs';
import {find, findIndex} from 'lodash';
import * as chalk from 'chalk';
const Hjson = require('hjson');
import {EventEmitter} from 'events';
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
  public envFolder: string = `${process.cwd()}/env/`;
  /**
   * @param fsApi file helper
   */
  public fsApi: FileApi = new FileApi();
  /**
   * after change it wil be dispatched
   */
  public changeDispatcher: EventEmitter;

  constructor(){
    this.changeDispatcher = new EventEmitter();

    this.changeDispatcher.on('changed', (self:any) => {
      if (self !== this) {
        console.log('fetch new');
        this.getEnvironments().subcribe();
      }
    })
  }
  /**
   * load all hjson file with content and add it to the collection
   * @param observer to will be completed
   * @returns Observable
   */
  public setCollection(observer:any) {
    let datas:Array<any> = [];
    let all:Array<any> = [];
    this.collection = [];
    this.fsApi.path = this.envFolder;
    this.envFiles.forEach((file:string) => {
      if (file) {
        all.push(this.fsApi.readHjson(`${this.envFolder}/${file}`));
      }
    });
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

  public validate(name:string){
    let namePass:RegExpMatchArray = name.match(Validator.stringPattern);
    return namePass;
  }

  /**
   * if match the name in the collection
   * @param name the name: "" from your hjson file
   * @returns EnvModel
   */
  public isUnique(name:string):EnvModel{
    let test = find(this.collection, {name: name});
    //console.log('test', this.collection, test);
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
        error: (e:any) => {
          return observer.complete();
        },
        next: (filePath: string) => {
          if (filePath) {
            // console.log('filePath', filePath);
            this.envFiles.push(filePath);
          }

        },
        complete: () => {
          if (!this.envFiles.length) {
            observer.next([])
            return observer.complete();
          }
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
  /**
   * copy a envModel and create the Hjson file in the envFolder
   */
  public copyByName(name:string, to:string):Observable<any>{
    if (!this.validate(name) || !this.validate(to)) {
    return Observable.create((observer:any) => {
      observer.error(chalk.red(`${name} or ${to} are not valid. only Allowed ${Validator.stringPattern}`));
      return observer.complete();
    });
    }
    return Observable.create((observer:any) => {
      let model:EnvModel = this.isUnique(name);
      if (!model) {
        observer.error(chalk.red(`environment with name "${chalk.magenta(name)}" not exist, please add it before.`));
        return observer.complete();
      }

      if (this.isUnique(to)){
        observer.error(chalk.red(`${to} already exist please remove it before.`));
        return observer.complete();
      }

      let newData:any = this.fsApi.copyHjson(model.data);
      newData.name = to;

      this.fsApi.writeHjson(Hjson.stringify(newData, this.fsApi.hjsonOptions), to).subscribe({
        complete: () => {
          this.getEnvironments().subscribe({
            next: () => {
              observer.next(`${to} are created.`);

            },
            complete: () => {
              observer.complete();
              this.changeDispatcher.emit('changed', this);
            }
          });
        }
      });
    });
  }

  public updateModelByName(name:string, attributes:Array<{key:string, value:any}>) {
    return Observable.create((observer:any) => {
      let modelIndex:number = findIndex(this.collection, {name: name});
      let model:EnvModel = this.collection[modelIndex];
      attributes.forEach((attr:any) => {
        model.data[attr.key] = attr.value;
      });
      // console.log(model);
      this.fsApi.writeHjson(Hjson.stringify(model.data, this.fsApi.hjsonOptions), model.name).subscribe(
        (answer:any) => {
          if (answer) {
            console.log(chalk.magenta(`File Environment ${model.name} are written`));
          }
          observer.next(answer);
        },
        (e:any) => observer.error(e),
        () => {
          this.changeDispatcher.emit('changed', this);
          observer.complete()
        }
      );
    });
  }

  public bulkUpdate(env:Array<string>, store:Array<{key:string, value:any}>):Observable<any>{
    return Observable.create((observer:any) => {
      if (!store.length){
        observer.error('Store can not be empty');
        return observer.complete()
      }

      let all:Array<any> = [];
      env.forEach((envName:string) => {
        all.push(this.updateModelByName(envName, store));
      });

      if (all.length) {
        Observable.forkJoin(all).subscribe(
          (answers:any) => {
            observer.next(answers);
          },
          (e:any) => observer.error(),
          () => {
            observer.complete()
            this.changeDispatcher.emit('changed', this);
          }
        )
      }
    });
  }
}
