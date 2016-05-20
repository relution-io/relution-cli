import {TemplateInterface} from './../../TemplateInterface';
import {PackageJson} from './PackageJson';
const html = require('common-tags').html;

export class Readme implements TemplateInterface{
  public name:string = 'readme';
  public publishName:string = 'README.md';
  public package: PackageJson = new PackageJson();

  constructor(){

  }
  get template(){
    return (html`
      #${this.name} ${this.package.version}

      ${this.package.description}
    `);
  }
}
