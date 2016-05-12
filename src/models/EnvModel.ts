import {FileApi as fsApi} from './../utility/FileApi';

/**
 * Model to the Evironment
 */
export class EnvModel{

  private _name : string;
  private _path : string;
  private _data : string;

  constructor(name: string, path:string){
    this.name = name;
    this.path = path;

  }

  public get data() : string {
    return this._data;
  }

  public set data(v : string) {
    this._data = v;
  }

  public get path() : string {
    return this._path;
  }

  public set path(v : string) {
    this._path = v;
  }

  public get name() : string {
    return this._name;
  }

  public set name(v : string) {
    this._name = v;
  }
}
