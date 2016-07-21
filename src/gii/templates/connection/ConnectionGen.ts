import {TemplateInterface} from './../../TemplateInterface';
import {CallModel} from './../../../models/CallModel';

const html = require('common-tags').html;

/**
 * ConnectionGen
 */
export class ConnectionGen implements TemplateInterface {
  public name: string = '';
  public path: string = 'connections';
  public metaData: Array<CallModel> = [];
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
      /**
       * @file ${this.path}/${this.name}.gen.ts
       *
       * Created by Relution CLI on ${this._pad(date.getDate())}.${this._pad(date.getMonth() + 1)}.${date.getFullYear()}
       * Copyright (c)
       * ${date.getFullYear()}
       * All rights reserved.
       */

      // Relution APIs
      const connector = require('relution/connector.js');

      const factory = function ${this.name}_factory () {
        if (!this) {
          return new (<any>factory)();
        }
      };

      factory.prototype = {
        name: '${this.name}'
      };

      factory.prototype.configureSession = function ${this.name}_configureSession(properties) {
        return connector.configureSession('${this.name}', properties);
      };

      // generated calls go here

      export = factory;

    ${this.metaData.map((model: CallModel) => ` /**
      * ${this.name}['${model.name}']
      *
      * ${model.action}
      *
      * @params input "Object" ${model.inputModel}
      * @return Promise ${model.outputModel}
      */
      export ${model.name} = function(input) {
        return connector.runCall(
          '${this.name}',
          '${model.name}',
          input
        );
      };
    `)}
  ` + '\n');
  }
}
