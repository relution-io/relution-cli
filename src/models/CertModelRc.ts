/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
export class CertModelRc {

  private _cert: any;
  private _passphrase : string;
  private _attributes: Array<string> = ['cert', 'passphrase'];

  constructor(cert?: any, passphrase?: string) {
    this._cert = cert;
    this._passphrase = passphrase;
  }

  public get cert() : string {
    return this._cert;
  }

  public set cert(v : string) {
    this._cert = v;
  }

  public get passphrase() : string {
    return this._passphrase;
  }

  public set passphrase(v : string) {
    this._passphrase = v;
  }

  public get attributes() : Array<string> {
    return this._attributes;
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
