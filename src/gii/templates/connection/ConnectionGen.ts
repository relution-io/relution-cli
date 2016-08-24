import {Validator} from '../../../utility/Validator';
import {TemplateInterface} from './../../TemplateInterface';
import {CallModel} from './../../../models/CallModel';
import * as Relution from 'relution-sdk';
const html = require('common-tags').html;
const camelCase = require('camel-case');
const pascalCase = require('pascal-case');
/**
 * ConnectionGen
 */
export class ConnectionGen implements TemplateInterface {
  public name: string = '';
  public path: string = 'connections';
  public metaData: Array<CallModel> = [];
  public publishName: string;
  public interfaces: any = [];
  public interfaceOn: boolean = false;
  /**
   * month helper
   */
  private _pad(num: number): string | number {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
  /**
   * check if the name
   */
  private static _isValidName(_testString: string) {
    let pass: any = _testString.match(Validator.namePattern);
    return pass;
  }
  /**
   * return a function string
   */
  private _getMethod (model: CallModel) {
    const input = this.interfaceOn ? pascalCase(model.inputModel) : 'any';
    const output = this.interfaceOn ? pascalCase(model.outputModel) : 'any';
    return (`
      /**
      * ${this.name}['${camelCase(model.name)}']
      *
      * ${model.action}
      *
      * @params input 'Object' ${input}
      * @return Promise ${output}
      */
      public ${camelCase(model.name)}(input: ${input}): Q.Promise<${output}> {
        return connector.runCall(
          this.name,
          '${model.name}',
          input
        );
      }`
    );
  }
  /**
   * map a field into a Interface
   */
  private static _mapField(fieldDefinition: Relution.model.TypeScriptFieldDefinition) {
    const relutionTypes = Object.keys(Relution.model.TypeScriptFieldDefinition.typeMapping).map((key) => {
      return Relution.model.TypeScriptFieldDefinition.typeMapping[key];
    });
    const pass = ConnectionGen._isValidName(fieldDefinition.name);
    let value = fieldDefinition.dataTypeTS;
    if (relutionTypes.indexOf(fieldDefinition.dataTypeTS) === -1) {
      if (value.indexOf('[]') !== -1) {
        value = `${pascalCase(fieldDefinition.dataTypeTS)}[]`;
      } else {
        value = pascalCase(fieldDefinition.dataTypeTS);
      }
    }

    if (pass) {
      return `${fieldDefinition.name}${fieldDefinition.mandatory ? ': ' : '?: '}${value};`;
    }
    return `'${fieldDefinition.name}'${fieldDefinition.mandatory ? ': ' : '?: '}${value};`;
  }
  /**
   * create a Interface Template
   */
  public toInterface(model: Relution.model.TypeScriptMetaModel): string {
    return (`
      /**
      * @interface ${pascalCase(model.name)}
      */
      export interface ${pascalCase(model.name)} {
        ${model.fieldDefinitions.map(ConnectionGen._mapField)}
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
    export class ${pascalCase(this.name)}BaseConnection {
      constructor(public name = '${this.name}') {}

      configureSession(properties: any) {
        return connector.configureSession(this.name, properties);
      }

      ${this.metaData.map(this._getMethod.bind(this))}
    }` + '\n');
  }
}
