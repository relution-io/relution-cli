import {TemplateInterface} from './../../TemplateInterface';
const html = require('common-tags').html;
const pascalCase = require('pascal-case');

/**
 * Connection
 */
export class Connection implements TemplateInterface {
  public name: string = '';
  public path: string = 'connections';
  public publishName: string;

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
    import {${pascalCase(this.name)}BaseConnection} from './${this.name}.gen';
    /**
     * ${pascalCase(this.name)}Connection
     */
    export class ${pascalCase(this.name)}Connection extends ${pascalCase(this.name)}BaseConnection {
      // user code goes here
    }
    ` + '\n');
  }
}
