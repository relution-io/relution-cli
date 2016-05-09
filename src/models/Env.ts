// // import * as hjson from 'hjson';


export interface EnvironmentInterface{
  name: string;
}

export class Enviroment implements EnvironmentInterface {

  private _name : string;


  public get name() : string {
    return this._name;
  }

  public set name(v : string) {
    this._name = v;
  }
}
