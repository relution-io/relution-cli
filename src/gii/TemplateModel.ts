export class TemplateModel {
  private _name: string;
  public templatesFolder: string;
  private _instance: any;

  constructor(name: string, instance: any) {
    this.name = name;
    this.instance = instance;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get instance(): any {
    return this._instance;
  }

  public set instance(v: any) {
    this._instance = v;
  }
}
