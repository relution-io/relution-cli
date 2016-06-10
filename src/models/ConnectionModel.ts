import * as Relution from 'relution-sdk';
import {Observable} from '@reactivex/rxjs';
import * as inquirer from 'inquirer';
import {Translation} from './../utility/Translation';
import {Validator} from './../utility/Validator';
import * as chalk from 'chalk';
import {FileApi} from './../utility/FileApi';
import * as path from 'path';
const hjson = require('hjson');
const stripIndents = require('common-tags').stripIndents;
const oneLineTrim = require('common-tags').oneLineTrim;
const commaListsOr = require('common-tags').commaListsOr;
import {Call} from './CallModel';

import * as os from 'os';

export interface ConnectionInterface {
  name: string;
  description: string;
  protocol: string;
  connectorProvider: string;
  properties: any;
  calls: any;
  metaModel: MetaModel;
};
/**
 * MetaModel extends Relution.model.MetaModel
 */
export class MetaModel extends Relution.model.MetaModel {
  constructor(other?: MetaModel) {
    super(other);
  }
  public promptAlways: Array<string> = ['descriptorUrl', 'authentication'];

  private _isList(fieldDefinition: Relution.model.FieldDefinition): boolean {
    return fieldDefinition.enumDefinition ? true : false;
  }

  toHjson(): string {
    return '';
  }

  filterPrompts(fieldDefinition: Relution.model.FieldDefinition): boolean {
    return fieldDefinition.defaultValue && fieldDefinition.mandatory || this.promptAlways.indexOf(fieldDefinition.name) !== -1;
  }

  prompt(): any {
    let questions = this.fieldDefinitions
      .filter(this.filterPrompts, this);
    // console.log('this.fieldDefinitions', this.fieldDefinitions);
    let prompt: Array<{
      choices?: Array<{ name: string, value: string | number }>,
      type: string,
      default?: string,
      name: string,
      message: string,
      validate?: any
    }> = [];

    if (questions.length) {
      questions.forEach((question: Relution.model.FieldDefinition) => {
        if (this._isList(question)) {
          let choices = question.enumDefinition.items.map((item: Relution.model.Item) => {
            return { name: item.label, value: item.value };
          });
          choices.push({
            name: Translation.CANCEL,
            value: Translation.CANCEL
          });
          prompt.push({
            type: 'list',
            name: question.name,
            message: Translation.ENTER_SOMETHING_LABEL(`${chalk.magenta(question.label)} (${question.tooltip})`),
            choices: choices
          });
        } else {
          prompt.push({
            type: 'input',
            name: question.name,
            message: Translation.ENTER_SOMETHING_LABEL(`${chalk.magenta(question.label)} (${question.tooltip})`),
            default: question.defaultValue,
            validate: Validator.notEmptyValidate
          });
        }

      });
    }
    return prompt;
  }

  questions(): any | Observable<any> {
    return Observable.fromPromise(inquirer.prompt(this.prompt()));
  }
}

/**
 * The Model for the CLI Connection Command
 */
export class ConnectionModel implements ConnectionInterface {

  private _name: string = '';
  private _protocol: string = '';
  private _connectorProvider: string = '';
  private _description: string = 'Auto Generated';
  private _properties: any = {};
  private _calls: any = {};
  private _metaModel: MetaModel;
  private _fileApi: FileApi = new FileApi();

  constructor(params?: { name?: string, protocol?: string, calls?: {}, properties?: {} }) {
    if (params) {
      Object.keys(params).forEach((key) => {
        this[key] = params[key];
      });
    }
  }

  public get metaModel(): MetaModel {
    return this._metaModel;
  }

  public set metaModel(v: MetaModel) {
    this._metaModel = v;
  }

  public get calls(): {} {
    return this._calls;
  }

  public set calls(v: {}) {
    this._calls = v;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get protocol(): string {
    return this._protocol;
  }

  public set protocol(v: string) {
    this._protocol = v;
  }

  public get description(): string {
    return this._description;
  }

  public set description(v: string) {
    this._description = v;
  }

  public get properties(): {} {
    return this._properties;
  }

  public set properties(v: {}) {
    this._properties = v;
  }

  public get connectorProvider(): string {
    return this._connectorProvider;
  }

  public set connectorProvider(v: string) {
    this._connectorProvider = v;
  }
  public getCommentvalue(fieldDefinition: Relution.model.FieldDefinition) {
    let comment = '';
    if (fieldDefinition.enumDefinition && fieldDefinition.enumDefinition.items && fieldDefinition.enumDefinition.items.length) {
      // console.log(fieldDefinition.enumDefinition.items);
      let values = fieldDefinition.enumDefinition.items.map((item) => item.value);
      comment += commaListsOr`//${fieldDefinition.name}: ${values}`;
    } else {
      comment += `//${fieldDefinition.name}: ${fieldDefinition.defaultValue || fieldDefinition.dataType}`;
    }
    return stripIndents`${comment}`;
  }
  /**
   * create a comment for the properties in the connnection.hjson
   * and looks like
   * /**
   *  * @name oAuthProviderType
   *  * @description Type of OAuth Provider.
   *  * @dataType java.lang.String
   *  *\/
   *  //oAuthProviderType: oauth1, oauth2, saml, openID or cas
   * @return string
   */
  private _fieldDefinitionComment(fieldDefinition: Relution.model.FieldDefinition): string {
    let definition: string = oneLineTrim`${fieldDefinition.tooltip}`.replace('*/', '');
    return (stripIndents`
      /**
       * @name ${fieldDefinition.name}
       * @description ${definition}
       * @dataType ${fieldDefinition.dataType}
       */
      ${this.getCommentvalue(fieldDefinition)}
    `);
  }

  public getProperties(): any {
    let properties: any = this._fileApi.copyHjson({});
    (<Relution.model.FieldDefinition[]>this.metaModel.fieldDefinitions).forEach((fieldDefinition: Relution.model.FieldDefinition) => {
      // console.log(fieldDefinition)
      if (fieldDefinition.defaultValue && fieldDefinition.mandatory || this.metaModel.promptAlways.indexOf(fieldDefinition.name) !== -1) {
        properties[fieldDefinition.name] = fieldDefinition.defaultValue;
      } else {
        properties.__WSC__.c[''] += (`${os.EOL}${this._fieldDefinitionComment(fieldDefinition)}\n`);
      }
    });
    return properties;
  }

  public toJson(): string {
    let myJson = {
      name: path.basename(this.name),
      connectorProvider: this.connectorProvider,
      description: this.description,
      protocol: this.protocol,
      calls: this.calls || {},
      properties: this.properties
    };
    // console.log(hjson.stringify(myJson, {keepWsc: true}));

    return hjson.stringify(myJson, { keepWsc: true });
  }

  public fromJson(path: string) {
    return this._fileApi.readHjson(path)
      .map((connectionHjson: { name: String, data: ConnectionInterface }) => {
        this.name = connectionHjson.data.name;
        this.connectorProvider = connectionHjson.data.connectorProvider;
        this.description = connectionHjson.data.description;
        this.protocol = connectionHjson.data.protocol;
        this.properties = connectionHjson.data.properties;
        this.calls = connectionHjson.data.calls;
        return this;
      });
  }
  /**
   * add to the calls on the connection.hjson
   * "calls":  {
   * /**
   * * @inputModel: _KP_MOB_DEMANDORDER_GETMessage
   * * @outpuModel: MOBILE_SST_NEW/_-DK_-KP_MOB_DEMANDORDER_GET
   * *\/
   * "getAccount": "MOBILE_SST_NEWNEW/_-KP_MOB_DEMANDORDER_GET",
   */
  public getCallsForHjson(calls: Call[]) {
    let outputCalls = this._fileApi.copyHjson({});
    outputCalls['__WSC__'].c[''] = `// please add APIs in use by the backend here`;

    calls.forEach((call) => {
      outputCalls[call.name] = call.action;
      outputCalls = this._fileApi.copyHjson(outputCalls);
      // outputCalls['__WSC__'].c[call.name] =
      // `/**
      // * @inputModel: ${call.inputModel}
      // * @outpuModel: ${call.outputModel}
      // */
      // `;
    });
    return outputCalls;
  }

}
