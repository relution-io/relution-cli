import {Validator} from './Validator';
import {CertModelRc} from './CertModelRc';
const chalk = require('chalk');
const figures = require('figures');

export interface ServerModel {
  id: string;
  default: boolean;
  serverUrl: string;
  userName: string;
  password: string;
  clientcertificate?: CertModelRc;
}

export class ServerModelRc implements ServerModel{

  private _id: string;
  private _default: boolean;
  private _serverUrl: string;
  private _userName: string;
  private _password: string;
  private _clientcertificate: CertModelRc;

  private _attributes: Array<string>;

  constructor(params?: ServerModel) {
    if (params) {
      (<any>Object).assign(this, params);
      this.attributes = Object.keys(params);
      // console.log('params', this.attributes);
    }
  }

  public get attributes(): Array<string> {
    return this._attributes;
  }

  public set attributes(v: Array<string>) {
    this._attributes = v;
  }

  public get id(): string {
    return this._id;
  }

  public set id(v: string) {
    this._id = v;
  }

  public get serverUrl(): string {
    return this._serverUrl;
  }

  public set serverUrl(v: string) {
    this._serverUrl = v;
  }

  public get userName(): string {
    return this._userName;
  }
  public set userName(v: string) {
    this._userName = v;
  }

  public get password(): string {
    return this._password;
  }

  public set password(v: string) {
    this._password = v;
  }

  public get clientcertificate(): CertModelRc {
    return this._clientcertificate;
  }

  public set clientcertificate(v: CertModelRc) {
    this._clientcertificate = v;
  }

  public get default(): boolean {
    return this._default;
  }

  public set default(v: boolean) {
    this._default = v;
  }

  public toTableRow(): Array<string>{
    return [
      chalk.magenta(this.id),
      chalk.yellow(this.serverUrl),
      this.default ? chalk.green(figures.tick) : chalk.red(figures.cross),
      chalk.yellow(this.userName)
    ];
  }

  public toJson() {
    let model: Object = {};
    this.attributes.forEach((attr: string) => {
      if (attr && this[attr] !== undefined) {
        model[attr] = this[attr];
      }
    });
    return model;
  }
}
