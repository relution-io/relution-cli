const Hjson = require('hjson');
export class EnvironmentTemplate {
  public name:string = '';

  get template():string {
    return Hjson.parse(`
    {
      //all vars are usable in your hjson files
      name: ${this.name}
    }`);
  }

  public render(name:string){
    this.name = name;
    console.log(this.template)
    return this.template;
  }
}
