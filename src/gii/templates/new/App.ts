import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export class App implements TemplateInterface {
  public publishName: string = 'app.js';
  public name: string = 'app';

  get template(): string{
    return (html`
      'use strict';
      /**
       * @file app.js
       * Simple MADP Application
       */
      var Q = require('q');
      Q.stopUnhandledRejectionTracking(); // requires use of Q's nextTick(cb)
      Q.nextTick = process.nextTick;      // Q's nextTick(cb) is not compatible with thread-locals
      //Q.longStackSupport = true;        // advanced diagnostic stack traces

      var express = require('express');
      var app = express();

      app.use(express.bodyParser());

      // global variables
      global.app = app;

      // install routes
      require('./routes/routes');
      require('./routes/connectors');

      // starts express webserver
      app.listen();
    `);
  }
}
