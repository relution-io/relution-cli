import {ServerModelRc} from './../../models/ServerModelRc';
import {Observable, Observer} from '@reactivex/rxjs';
import * as Relution from 'relution-sdk';

export namespace LEVEL {
  export const TRACE = 5000;
  export const DEBUG = 10000;
  export const INFO = 20000;
  export const WARN = 30000;
  export const ERROR = 40000;
  export const FATAL = 50000;
};

export class LoggerHelper {
  public static JS_APP = `javascript.applications.`;
  public static logUrl = '/gofer/system/liveLog?';
  public abort = false;

  constructor(public appUUid: string, public serverRc: ServerModelRc) {}

  public static jsAppParam(uuid: string): string {
    return `${LoggerHelper.JS_APP}${uuid}`;
  }
  /**
   * fetch live log appender from relution server
   */
  public fetchlogs(uuid: string, level?: number, filter?: string) {
    // gofer/system/liveLog
    let url = LoggerHelper.logUrl;
    url += `uuid=${uuid}`;
    url += `&level=${level || LEVEL.TRACE}`;
    // console.log('url fetchlogs', url);
    return Relution.web.ajax(
      {
        method: 'GET',
        url: url
      });
  }
  /**
   * register Logger on Relution server and get a uuid for the log session back
   */
  public registerLogger() {
    let url = LoggerHelper.logUrl;
    url.concat(`logger=${LoggerHelper.jsAppParam(this.appUUid)}`);
    return Observable.fromPromise(Relution.web.ajax({method: 'GET', url: url}));
  }
}
