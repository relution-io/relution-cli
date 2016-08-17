const request = require('../util/request.js');
const Q = require('q');
const _ = require('lodash');
const assert = require('assert');

export const TRACE = 5000;
export const DEBUG = 10000;
export const INFO = 20000;
export const WARN = 30000;
export const ERROR = 40000;
export const FATAL = 50000;

const levelFromName = {
  'trace': TRACE,
  'debug': DEBUG,
  'info': INFO,
  'warn': WARN,
  'error': ERROR,
  'fatal': FATAL
};


export class McapLogger {
  // CONST if the longpolling raises an error
  public LONG_POLLING_ERROR = 'longpollingerror';
  // the server
  public server: any = null;
  public auth: any;
  // the XHR Object for the long polling log
  public longPollingXhr: any = null;
  public onError: () => {};
  // if is set to true every log will send a long poll call again to wait for the next log - endless loop!
  public watching = true;
  // the current logger id
  public loggerId: any = null;
  // determines if the logger is watching or not
  private _isWatching: boolean = false;
  constructor(options: any) {
    assert(options, 'Missing parameter options');
    assert(options.server, 'Missing parameter options.server');
    if (typeof options.onError !== 'undefined') {
      assert(typeof options.onError === 'function', 'Wrong parameter type: options.onError should be a function');
    }

    if (typeof options.output !== 'undefined') {
      assert(typeof options.output === 'function', 'Wrong parameter type: options.output should be a function');
      this.output = options.output;
    }
    this.server = options.server;
    // Revers API
    this.onError = options.onError || function () { };
  }

  /**
   * The default output - set this via watch options: output
   * @param log
   */
  public output(log: string) {
    console.log('log output', log);
    if (log) {
      Object.keys(log).forEach(function (l) {
        console.log(log[l].message);
      });
    }
  };

  /**
   * The default output - set this via watch options: output
   * @param log
   */
  public isWatching() {
    return this._isWatching;
  };

  /**
   * Stop the live logger
   */
  public unWatch() {
    this.watching = false;
    this._isWatching = false;
    if (this.longPollingXhr) {
      if (typeof this.longPollingXhr.abort === 'function') {
        this.longPollingXhr.abort();
      }
      else {
        //     console.info(JSON.stringify(this.longPollingXhr));
      }
    }
  };

  /**
   * Start watching a live logger. Will stop every other live logger before.
   * options:
   * once: only wait until the first log has a response. Do not catch further logs
   * filePath: the path to the mCAP file to watch
   * output: a function the logs are send to - default is console.log
   * name: the name of the logger: default is ''
   * @example
   *
   * McapLogger.watch({
          filePath: 'applications/A1600A9A-249A-45A4-8D02-EA17D7B70805/server/test.js',
          output: function(message){
              console.log(message);
          }
        })
   *
   * @param options
   * @returns {*}
   */
  public watch(options: any) {

    const that = this;

    // resolve if there is already a watch task registered
    if (this.isWatching()) {
      const dfd = Q.defer();
      dfd.resolve();
      return dfd.promise;
    }

    // make sure options are available
    options = options || {};
    // make sure filePath is set
    options.filePath = options.filePath || '';

    // make sure filePath is set
    that.watching = options.once || true;

    that._isWatching = true;

    that.output = typeof options.output === 'function' ? options.output : that.output;
    // get the logger information
    return that.getLoggerInformation(options.name).then(function (loggerInformations: any) {
      // set the name of the logger should be the same
      const name = loggerInformations.name || options.name;
      const filter = options.filter ? '.' + options.filter : '';
      options.name = name + filter;
      // if the logger information was successful, register the logger
      return that.registerLogger(options);
    }, function (err: Error) {
      const dfd = Q.defer();
      dfd.reject(err);
      return dfd.promise;
    }).then(function (uuid: string) {
      // register the logger returns the logger uuid
      that.loggerId = uuid;
      // poll for the first output
      return that.poll(uuid);
    }).then(function (log: string) {
      // if the poll was successfull log the response to the output
      return that._log(log);
    }).catch(function (argument: any) {
      that.output(argument);
    });
  };

  /**
   * Logs the response from the logger, if watching is set to true keep watching after the log
   * @param log
   * @returns {*}
   * @private
   */
  public _log(log: any) {
    let dfd = Q.defer();
    if (this.watching) {
      this.poll(this.loggerId);
    }
    this.output(log);
    dfd.resolve(log);
    return dfd.promise;
  };

  /**
   * Requests a logger output to the given logger uuid
   * @param uuid
   * @returns {*}
   */
  public poll(uuid: string) {
    let dfd = Q.defer();
    let that = this;
    // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?uuid=b5ebfda4-54d9-4c5c-8cf7-34ba1aa8a23a
    if (!uuid) {
      dfd.reject('uuid is not set');
    }
    this.longPollingXhr = this._request({
      server: this.server,
      url: 'gofer/system/liveLog?uuid=' + uuid,
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json'
    });

    // call the longpolling
    this.longPollingXhr.then(function (log: string) {
      // log if everything was ok
      that._log(log);
    }).catch(function (err: Error) {
      // call the reverse api
      this.onError(this.LONG_POLLING_ERROR, err);
    });

    dfd.resolve();
    return dfd.promise;
  }
  /**
   * Register the mCAP logger
   * once: only wait until the first log has a response. Do not catch further logs
   * filePath: the path to the mCAP file to watch
   * output: a function the logs are send to - default is console.log
   * name: the name of the logger: default is ''
   * level: the log level: default is 20000
   * Log Level Overview:
   FATAL: 50000
   ERROR: 40000
   WARN: 30000
   INFO: 20000
   DEBUG: 10000
   TRACE: 5000
   *
   * @param options
   * @returns {*}
   */
  public registerLogger(options: any) {
    // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=20000&logger=javascript.applications.D5B31E37-0C67-4F57-BC74-98FF587C0A41.server.app.js
    // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=undefined&logger=javascript..applications.A1600A9A-249A-45A4-8D02-EA17D7B70805.server.test.js&t=1396607548520

    // if no filePath is set reject the promise
    if (!options || typeof options.filePath === 'undefined') {
      let dfd = Q.defer();
      dfd.reject('filePath is not set');
      return dfd.promise;
    }

    // the mCAP endpoint
    let url = 'gofer/system/liveLog?';
    // the log level
    let level = typeof options.level !== 'undefined' ? McapLogger.resolveLevel(options.level) : TRACE;
    url += 'level=' + level;
    // the name of the logger
    let name = typeof options.name !== 'undefined' ? options.name : '';
    // the file of the logger;
    let filePath = typeof options.filePath !== 'undefined' ? options.filePath : '';

    // build the url
    url += '&logger=' + name + filePath.replace(/\//g, '.');

    // do the register request
    return this._request({
      server: this.server,
      url: url,
      method: 'GET'
    });
  }

  /**
   * Get the logger information to the given name. Default is emptystring
   * @param name
   * @returns {*}
   */
  public getLoggerInformation(name: string) {
    // https://core.dev4.mwaysolutions.com/gofer/loggerConfiguration/rest/logger/loggerConfigurations/javascript?computeDerived=true
    name = typeof name !== 'undefined' ? name : '';
    return this._request({
      server: this.server,
      url: 'gofer/loggerConfiguration/rest/logger/loggerConfigurations/' + name + '?computeDerived=true',
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json'
    });
  }

  private _request(options: any) {
    let dfd = Q.defer();
    options.headers = options.headers || {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    };

    if (this.auth) {
      options.auth = this.auth;
    }

    request.request(options, function (error: Error, response: XMLHttpRequest, body: any) {
      if (error) {
        dfd.reject(error);
        return;
      }
      let data = body;
      try {
        data = JSON.parse(body);
      } catch (e) {

      }
      dfd.resolve(data);
    });
    return dfd.promise;
  };

  /**
 * Resolve a level number, name (upper or lowercase) to a level number value.
 */
  public static resolveLevel(nameOrNum: any) {
    if (typeof nameOrNum === 'string') {
      return levelFromName[nameOrNum.toLowerCase()] || TRACE;
    } else {
      return nameOrNum;
    }
  }

  /**
   * Resolve a level string, name (upper or lowercase) to a level number value.
   */
  public static getNameFromLevel(num: string) {
    return _.invert(levelFromName)[num];
  }
}
