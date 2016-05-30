import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

export /**
 * Connection
 */
class Connection {
  public name:string = '';
  public path:string = 'connections';
  private _pad(num: number): string | number {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  get template(){
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
    module.exports = require('./${this.name}.gen')();
    // user code goes here

    `);
  }
}
