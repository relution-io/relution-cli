import {Validator} from './Validator';
import {CertModelRc} from './CertModelRc';

interface ObjectCtor extends ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
declare var Object: ObjectCtor;
export let assign = Object.assign ? Object.assign : function(target: any, ...sources: any[]): any {
        return;
};

export class ServerModelRc {

  private _id : string;
  private _asDefault : boolean;
  private _serverUrl : string;
  private _userName : string;
  private _password : string;
  private _clientcertificate : CertModelRc;

  private _attributes : Array<string>;

  constructor(params?:any) {
    if (params) {
      Object.assign(this, params);
      this.attributes = Object.keys(params);
      console.log('params', this.attributes);
    }
  }

  public get attributes() : Array<string> {
    return this._attributes;
  }

  public set attributes(v : Array<string>) {
    this._attributes = v;
  }

  public get id() : string {
    return this._id;
  }

  public set id(v : string) {
    this._id = v;
  }

  public get serverUrl() : string {
    return this._serverUrl;
  }

  public set serverUrl(v : string) {
    this._serverUrl = v;
  }

  public get userName() : string {
    return this._userName;
  }
  public set userName(v : string) {
    this._userName = v;
  }

  public get password() : string {
    return this._password;
  }
  public set password(v : string) {
    this._password = v;
  }

  public get clientcertificate() : CertModelRc {
    return this._clientcertificate;
  }

  public set clientcertificate(v : CertModelRc) {
    this._clientcertificate = v;
  }

  public get asDefault() : boolean {
    return this._asDefault;
  }

  public set asDefault(v : boolean) {
    this._asDefault = v;
  }

  public toJson(){
    let model:Object = {};
    this.attributes.forEach((attr:string) => {
      if (attr && this[attr] !== undefined) {
        model[attr] = this[attr];
      }
    });
    return model;
  }
}
