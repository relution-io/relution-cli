import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class PackageJson implements TemplateInterface {
  public publishName: string = 'package.json';
  public name: string = 'app';
  public main: string = 'app.js';
  public description: string = `Auto description ${this.name}`;
  public version: string = '0.0.1';
  /**
   * ```json
   * {
      "name": "madp-simple",
      "version": "1.0.0",
      "main": "app.js",
      "dependencies": {
        "lodash": "^4.5.1",
        "q": "~1.4.1",
        "body-parser": "^1.5.2",
        "errorhandler": "^1.1.1",
        "express": "^4.8.0",
        "express-session": "^1.7.2",
        "jade": "^0.1.0",
        "method-override": "^2.1.2",
        "morgan": "^1.2.2",
        "multer": "^0.1.3",
        "serve-favicon": "^2.0.1"
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
          "q": "~1.4.1",
          "body-parser": "^1.10.0",
          "errorhandler": "^1.1.1",
          "express": "^4.10.5",
          "express-session": "^1.7.2",
          "jade": "^0.1.0",
          "method-override": "^2.1.2",
          "morgan": "^1.2.2",
          "multer": "^0.1.3",
          "serve-favicon": "^2.0.1"
        },
        "engines": {
          "node": ">=4.4.0"
        },
        "devDependencies": {
          "tslint": "^3.8.1",
          "typedoc": "github:sierrasoftworks/typedoc#v1.8.10",
          "typescript": "^1.8.10"
        },
        "scripts": {
          "precommit": "npm run tslint",
          "tslint": "tslint src/**/*.ts",
          "build": "tsc -p .",
          "api": "typedoc -p . --rootDir src --out www --module commonjs --stripInternal --name ${this.name} --exclude **/*.spec.ts src typings/main.d.ts",
          "serve-api": "http-server public/docs",
          "watch": "tsc -p . -w"
        }
      }\n
    `);
  }
}
