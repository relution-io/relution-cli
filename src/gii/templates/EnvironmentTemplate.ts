const Hjson = require('hjson');
const html = require('common-tags').html;
import {TemplateInterface} from './../TemplateInterface';

export class EnvironmentTemplate implements TemplateInterface{
  public name:string = '';
  public publishName:string;

  get template():string {
    //i know the tabs incorrect but its better for templating
    // try it before you change that
    return(html`
      {
        //all vars are usable in your hjson files
        name: ${this.name}
      }
    `);
  }

  public render(name:string){
    this.name = name;
    return this.template;
  }
}
