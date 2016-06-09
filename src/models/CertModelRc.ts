import * as _ from 'lodash';
import * as tls from 'tls';

export type CertModelRcInterface = tls.SecureContextOptions;

/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
export class CertModelRc implements CertModelRcInterface {

  public pfx: Buffer | string;
  public passphrase: string;

  private static attributes = ['pfx', 'passphrase'];

  constructor(params: CertModelRcInterface) {
    this.fromJSON(params);
  }

  public fromJSON(params: CertModelRcInterface) {
    _.assignWith(this, params, (objValue: any, srcValue: any, key: string) => {
      if (CertModelRc.attributes.indexOf(key) >= 0) {
        if (key === 'pfx' && _.isString(srcValue)) {
          srcValue = new Buffer(srcValue, 'base64');
        }
        return srcValue;
      }
    });
  }

  public toJSON() {
    let model: Object = {};
    CertModelRc.attributes.forEach((attr: string) => {
      let value = this[attr];
      if (value !== undefined) {
        if (_.isBuffer(value)) {
          value = value.toString('base64');
        }
        model[attr] = value;
      }
    });
    return model;
  }
}
