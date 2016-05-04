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
  private _default : boolean;
  private _serverUrl : string;
  private _userName : string;
  private _password : string;
  private _clientcertificate : CertModelRc;

  constructor(params?:any) {
    if (params) {
      Object.assign(this, params);
      console.log(this);
    }

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

  public get default() : boolean {
    return this._default;
  }
  public set default(v : boolean) {
    this._default = v;
  }
}
