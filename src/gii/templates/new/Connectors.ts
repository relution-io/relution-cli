import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class Connectors implements TemplateInterface {
  public parentFolder:string = 'routes';
  public publishName:string = 'connectors.js'
  public name:string = 'connectors';

  get template(): string{
    return (html`
      'use strict';
      /**
       * @file routes/connectors.js
       * ${this.name} Backend
       */

      // Relution APIs
      var connector = require('relution/connector.js');

      module.exports = (
        /**
         * module providing direct access to connectors.
         *
         * Used by Relution SDK connectors module for direct access to backend servers. If you do not want
         * or need this functionality, the routes defined herein can be removed.
         *
         * @param app express.js application to hook into.
         */
        function connectors(app) {

          app.post('/api/v1/connectors/:connection',
            /**
             * installs session data such as credentials.
             *
             * @param req containing body JSON to pass as input.
             * @param res result of call is provided as JSON body data.
             * @param next function to invoke error handling.
             */
            function serviceCall(req, res, next) {
              connector.configureSession(req.params.connection, req.body);
              res.send(204); // success --> 204 no content
            }
          );

          app.post('/api/v1/connectors/:connection/:call',
            /**
             * calls directly into a service connection.
             *
             * @param req containing body JSON to pass as input.
             * @param res result of call is provided as JSON body data.
             * @param next function to invoke error handling.
             */
            function serviceCall(req, res, next) {
              connector.runCall(req.params.connection, req.params.call, req.body).then(res.json.bind(res), next).done();
            }
          );
        }
      )(global.app);
    `);
  }
}