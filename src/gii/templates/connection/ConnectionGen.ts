import {TemplateInterface} from './../../TemplateInterface';
import {CallModel} from './../../../models/CallModel';
import * as Relution from 'relution-sdk';
const html = require('common-tags').html;

/**
 * ConnectionGen
 */
export class ConnectionGen implements TemplateInterface {
  public name: string = '';
  public path: string = 'connections';
  public metaData: Array<CallModel> = [];
  public publishName: string;
  public interfaces: any = [];

  private _pad(num: number): string | number {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  private capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private _getMethod (model: CallModel) {
    return (html`
    /**
      * ${this.name}['${model.name}']
      *
      * ${model.action}
      *
      * @params input 'Object' ${model.inputModel}
      * @return Promise ${model.outputModel}
      */
      public ${model.name}(input: ${model.inputModel || 'any'}): Q.Promise<${model.outputModel || `any`}> {
        return connector.runCall(
          this.name,
          '${model.name}',
          input
        );
      }`
    );
  }

  private static mapField(fieldDefinition: Relution.model.TypeScriptFieldDefinition) {
    return `${fieldDefinition.name}${fieldDefinition.mandatory ? ': ' : '?: '}${fieldDefinition.dataTypeTS};`;
  }

  public toInterface(model: Relution.model.TypeScriptMetaModel): string {
    return (html`
      /**
      * @interface ${model.name}
      */
      export interface ${model.name} {
        ${model.fieldDefinitions.map(ConnectionGen.mapField)}
      }` + '\n');
  }

  get template() {
    let date = new Date();
    return (html`
    /**
    * @file ${this.path}/${this.name}.gen.ts
    * Created by Relution CLI on ${this._pad(date.getDate())}.${this._pad(date.getMonth() + 1)}.${date.getFullYear()}
    * Copyright (c)
    * ${date.getFullYear()}
    * All rights reserved.
    */
    import * as Q from 'q';
    // Relution APIs
    const connector = require('relution/connector.js');
    ${this.interfaces ? this.interfaces.map(this.toInterface.bind(this)) : ''}
    export class ${this.capitalizeFirstLetter(this.name)}BaseConnection {
      constructor(public name = '${this.name}') {}

      configureSession(properties: any) {
        return connector.configureSession(this.name, properties);
      }

      ${this.metaData.map(this._getMethod.bind(this))}
    }` + '\n');
  }
}
