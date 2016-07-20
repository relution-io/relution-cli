import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class App implements TemplateInterface {
  public publishName: string = 'app.ts';
  public name: string = 'app';

  get template(): string {
    return (html`
      /**
       * @file app.js
       */
      import * as express from 'express';
      import * as bodyParser from 'body-parser';

      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      // global variables
      global['app'] = app;

      // install routes
      require('./routes/routes').init(app);
      require('./routes/connectors').init(app);
      require('./routes/push').init(app);

      //start express server
      app.listen(app.get('port'));
    ` + '\n');
  }
}
