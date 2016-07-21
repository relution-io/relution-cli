import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;

/**
 * Connection
 */
export class Connection implements TemplateInterface {
  public name: string = '';
  public path: string = 'connections';
  public publishName: string;

  private capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

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
     * @file ${this.path}/${this.name}.gen.ts
     * Simple MADP Application
     *
     * Created by Relution CLI on ${this._pad(date.getDate())}.${this._pad(date.getMonth() + 1)}.${date.getFullYear()}
     * Copyright (c)
     * ${date.getFullYear()}
     * All rights reserved.
     */
    import {${this.capitalizeFirstLetter(this.name)}BaseConnection} from './${this.name}.gen';
    /**
     * ${this.capitalizeFirstLetter(this.name)}Connection
     */
    export class ${this.capitalizeFirstLetter(this.name)}Connection extends ${this.capitalizeFirstLetter(this.name)}BaseConnection {
      // user code goes here
    }
    ` + '\n');
  }
}
