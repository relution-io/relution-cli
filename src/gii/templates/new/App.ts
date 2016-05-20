import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;
export class App implements TemplateInterface {
  public publishName:string = 'app.js'
  public name:string = 'app';

  get template(): string{
    return (html`
      /**
       * ${this.name}
       */
      var express = require('express');
      var app = express();
      // Assign middlewares
      app.use(express.bodyParser());
      // global variables
      global.app = app;
      // starts express webserver
      app.listen();\n
    `);
  }
}
