export class PackageJson {
  public name:string = 'app';

  get template(){
return (`
{
  "name": "${name}",
  "version": "0.0.1",
  "main": "app.js",
  "dependencies": {
  },
  "devDependencies": {
  },
  "relution": {}
}
`);
  }
}
