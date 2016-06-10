import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class Routes implements TemplateInterface {
  public name: string = 'routes';
  public publishName: string = 'routes.js';
  public parentFolder: string = 'routes';

  get template() {
    return (html`
      'use strict';
      /**
       * @file routes.js
       *
       */

      var about = require('../package.json');
      module.exports = (function routes(app) {

        // lists all available API.
        app.get('/index.json',
          /**
           * provides an overview of available API, state, etc.
           *
           * @param req unused.
           * @param res body is an informal JSON that can be used for health monitoring, for example.
           * @return {*} unspecified value.
           */
          function getRoutes(req, res) {
            var index = {
              name: about.name,
              version: about.version,
              description: about.description,
              routes: app.routes
            };
            return res.json(index);
          }
        );
      })(global.app);
    `);
  }
}
