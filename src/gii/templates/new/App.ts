
export class App {
  public name:string = 'app';

  get template(){
    return (`
/**
 * ${name}
 */
var express = require('express');
var app = express();
// Assign middlewares
app.use(express.bodyParser());
// global variables
global.app = app;
// starts express webserver
app.listen();
    `);
  }
}
