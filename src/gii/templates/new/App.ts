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
      import {init as routesRoute} from './routes/routes';
      import {init as pushRoute} from './routes/push';
      import {init as connectorsRoute} from './routes/connectors';

      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      // global variables
      global['app'] = app;
      // install routes
      routesRoute(app);
      pushRoute(app);
      connectorsRoute(app);
      // start express server
      app.listen(app.get('port'));
    ` + '\n');
  }
}
