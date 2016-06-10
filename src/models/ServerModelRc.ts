import * as _ from 'lodash';

import {CertModelRcInterface, CertModelRc} from './CertModelRc';

const chalk = require('chalk');
const figures = require('figures');

export interface ServerModelRcInterface {
  id: string;
  default: boolean;
  serverUrl: string;
  userName: string;
  password: string;
  clientCertificate?: CertModelRcInterface;
}

export class ServerModelRc implements ServerModelRcInterface {

  public id: string;
  public default: boolean;
  public serverUrl: string;
  public userName: string;
  public password: string;
  public clientCertificate: CertModelRc;

  private static attributes = [ 'id', 'default', 'serverUrl', 'userName', 'password', 'clientCertificate' ];

  constructor(params: ServerModelRcInterface) {
    this.fromJSON(params);
  }

  public fromJSON(params: ServerModelRcInterface) {
    _.assignWith(this, params, (objValue: any, srcValue: any, key: string) => {
      if (ServerModelRc.attributes.indexOf(key) >= 0) {
        if (key === 'clientCertificate') {
          srcValue = new CertModelRc(srcValue);
        }
        return srcValue;
      }
    });
  }

  public toJSON(): ServerModelRcInterface {
    let model: any = {};
    ServerModelRc.attributes.forEach((attr: string) => {
      if (attr && this[attr] !== undefined) {
        model[attr] = this[attr];
      }
    });
    return model;
  }

  public toTableRow(): Array<string> {
    return [
      chalk.magenta(this.id),
      chalk.yellow(this.serverUrl),
      this.default ? chalk.green(figures.tick) : chalk.red(figures.cross),
      chalk.yellow(this.userName)
    ];
  }
}
