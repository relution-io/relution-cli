/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
export class CertModelRc {

  private _cert: any;
  private _passphrase : string;

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
}
