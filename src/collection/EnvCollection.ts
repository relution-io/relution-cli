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
        this.getEnvironments().subscribe();
      }
    })
  }
  /**
   * load all hjson file with content and add it to the collection
   * @param observer to will be completed
   * @returns Observable
   */
  public loadCollection(envFiles:Observable<string>) {
    this.collection = [];
    return envFiles.map((envFile) => {
      return this.fsApi.readHjson(`${this.envFolder}/${envFile}`);
    })
    .concatAll()
    .map(
      (model:{data:any, path:string}) => {
      return new EnvModel(model.data.name, model.path, model.data);
    })
    .reduce((collection:[EnvModel], model:EnvModel) => {
      collection.push(model);
      return collection;
    }, this.collection);
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
  public getEnvironments(): Observable<any>{
    this.envFiles = [];
    this.fsApi.path = this.envFolder;
    return this.loadCollection(
      this.fsApi.fileList(this.envFolder, '.hjson').do(
        (filePath: string) => {
          this.envFiles.push(filePath);
        }
      )
    );
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
              //@todo we dont need it
              this.changeDispatcher.emit('changed', this);
            }
          });
        }
      });
    });
  }
  /**
   * overwrite a existing env file with attributes
   */
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
    if(!env.length) {
      return Observable.throw(new Error('Please use env add before'));
    }

    if (!store.length){
      return Observable.throw(new Error('Store can not be empty'));
    }

    let all:Array<any> = [];
    env.forEach((envName:string) => {
      all.push(this.updateModelByName(envName, store));
    });
    return Observable.forkJoin(all);
  }
}
