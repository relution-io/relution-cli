import {TemplateInterface} from './../../TemplateInterface';
export class PackageJson implements TemplateInterface{

  public publishName:string = 'package.json';
  public name:string = 'app';
  public version:string = '0.0.1';

  get template(){
return (`
{
  "name": "${this.name}",
  "version": "${this.version}",
  "main": "app.js",
  "dependencies": {
  },
  "devDependencies": {
  },
  "relution": {}
}\n
`).trim();
  }
}
