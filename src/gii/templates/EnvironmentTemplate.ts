const Hjson = require('hjson');
export class EnvironmentTemplate {
  public name:string = '';
  get template():string {
    //i know the tabs incorrect but its better for templating
    // try it before you change that
    return(`
{
  //all vars are usable in your hjson files
  name: ${this.name}
}`);
  }

  public render(name:string){
    this.name = name;
    return this.template;
  }
}
