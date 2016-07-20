import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class App implements TemplateInterface {
  public publishName: string = 'app.ts';
  public name: string = 'app';

  get template(): string {
    return (html`
      /**
       * @file app.js
       * Simple MADP Application
       */
      const http = require('http');
      const express = require('express');
      const bodyParser = require('body-parser');
      const multer = require('multer');
      const errorHandler = require('errorhandler');

      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(multer());

      // global variables
      global['app'] = app;

      // install routes
      require('./routes/routes');
      require('./routes/connectors');
      require('./routes/push');

      // error handling middleware should be loaded after the loading the routes
      if ('development' == app.get('env')) {
        app.use(errorHandler());
      }
      // starts express webserver
      const server = http.createServer(app);
      server.listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
      });\n
    `);
  }
}
