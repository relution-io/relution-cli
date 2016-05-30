import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export /**
 * ConnectionGen
 */
  class ConnectionGen {
  public name: string = '';
  public path: string = 'connections';
  private _pad(num: number): string | number {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
  get template() {
    let date = new Date();
    return (html`
      'use strict';
      /**
       * @file ${this.path}/${this.name}.gen.js
       * Simple MADP Application
       *
       * Created by Relution CLI on ${this._pad(date.getDate())}.${this._pad(date.getMonth()+1)}.${date.getFullYear()}
       * Copyright (c)
       * ${date.getFullYear()}
       * All rights reserved.
       */

      // Relution APIs
      var connector = require('relution/connector.js');

      var factory = function ${this.name}_factory() {
        if (!this) {
          return new factory();
        }
      }
      factory.prototype = {
        name: '${this.name}'
      };

      factory.prototype.configureSession = function ${this.name}_configureSession(properties) {
        return connector.configureSession('${this.name}', properties);
      }

      // generated calls go here

      module.exports = factory;
    `);
  }
}
