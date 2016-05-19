import {TemplateInterface} from './../../TemplateInterface';
import {PackageJson} from './PackageJson';

export class Readme implements TemplateInterface{
  public name:string = 'readme';
  public publishName:string = 'README.md';
  public package: PackageJson = new PackageJson();

  constructor(){

  }
  get template(){
    return (
      `
#${this.name} ${this.package.version}

${this.package.description}
      `
    );
  }
}
