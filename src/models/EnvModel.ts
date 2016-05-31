/**
 * Model to the Evironment
 */
export class EnvModel {

  private _name: string;
  private _path: string;
  private _data: any;

  constructor(name: string, path: string, data: any) {
    this.name = name;
    this.path = path;
    this.data = data;
  }

  public get data(): any {
    return this._data;
  }

  public set data(v: any) {
    this._data = v;
  }

  public get path(): string {
    return this._path;
  }

  public set path(v: string) {
    this._path = v;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }
}
