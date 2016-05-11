/**
 * @class Gii
 * Gii provides a CLI-based interface for you to interactively generate the code you want.
 */
import {findIndex} from 'lodash';
import {EnvironmentTemplate} from './templates/EnvironmentTemplate';
class TemplateModel {
  private _path: string;
  private _name: string;
  public templatesFolder: string;
  private _instance : any;

  constructor(name: string, instance:any) {
    this.name = name;
    this.instance = instance;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get instance() : any {
    return this._instance;
  }

  public set instance(v : any) {
    this._instance = v;
  }
}

export class Gii {

  public templatesFolder: string = `./templates/`;

  public templates: Array<TemplateModel> = [
    new TemplateModel('env', new EnvironmentTemplate())
  ];

  public getTemplateByName(name:string) : TemplateModel {
    let templateIndex:number = findIndex(this.templates, {name: name});
    return this.templates[templateIndex];
  }
}

