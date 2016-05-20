import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class PackageJson implements TemplateInterface {
  public publishName: string = 'package.json';
  public name: string = 'app';
  public main: string = 'app.js'
  public description:string = `Auto description ${this.name}`;
  public version: string = '0.0.1';
  /**
   * ```json
   * {
      "name": "madp-simple",
      "version": "1.0.0",
      "main": "app.js",
      "dependencies": {
        "lodash": "^4.5.1",
        "q": "~1.4.1"
      },
      "devDependencies": {
        "jsdoc": "git+https://github.com/jsdoc3/jsdoc.git"
      },
      "scripts": {
        "jsdoc": "jsdoc ./ -r -c ./conf.json -d ./../jsdocs",
        "startDoc": "http-server ./../jsdoc -p 6868"
      }
    }
   * ```
   */
  get template() {
    return (html`
      {
        "name": "${this.name}",
        "version": "${this.version}",
        "main": "${this.main}",
        "description": "${this.description}",
        "dependencies": {
          "lodash": "~4.5.1",
          "q": "~1.4.1"
        },
        "devDependencies": {
          "jsdoc": "git+https://github.com/jsdoc3/jsdoc.git"
        },
        "scripts": {
          "jsdoc": "jsdoc ./ -r -c ./conf.json -d ./../jsdocs",
          "startDoc": "http-server ./../jsdoc -p 6868"
        }
      }\n
    `);
  }
}
