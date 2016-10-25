import * as os from 'os';
import * as path from 'path';
import * as Relution from 'relution-sdk';
import { find } from 'lodash';
import { Observable, Observer } from '@reactivex/rxjs';
import { Deploy } from './../project/Deploy';
import { FileApi } from '../../utility/FileApi';
import { LoggerHelper, LEVEL } from './../logger/LoggerHelper';
import { ServerModelRc } from './../../models/ServerModelRc';
import { Command } from './../Command';
import { UserRc } from '../../utility/UserRc';
import { DebugLog } from '../../utility/DebugLog';
import { Translation } from '../../utility/Translation';
import { RelutionSdk } from '../../utility/RelutionSDK';
import { RxFs } from './../../utility/RxFs';

const blessed = require('blessed');
const contrib = require('blessed-contrib');

export interface LogMessage {
  id: string;
  message: string;
  logger: string;
  level: number;
  date: any;
  extraFieldsMap?: any;
  setProperties?: Array<string>;
}
export class Logger {
  private _screen: any;
  private _deployCommand: Deploy;
  private _relutionHjson: any;
  private _fileApi: FileApi = new FileApi();
  private _log: LoggerHelper;
  public termLog: any;
  public choosedServer: ServerModelRc;
  public choosedLevel: number;
  private _grid: any;
  private _state = 'cli';
  private _owner: Command;
  private _userRc: UserRc;
  private _i18n: typeof Translation;
  private _relutionSDK: RelutionSdk;
  private _debuglog = DebugLog;
  private _inquirer: any;

  constructor(owner: Command) {
    this._owner = owner;
    this._userRc = owner.userRc;
    this._i18n = owner.i18n;
    this._relutionSDK = owner.relutionSDK;
    this._debuglog = owner.debuglog;
    this._inquirer = owner.inquirer;
    this._deployCommand = new Deploy(owner);
  }
  /**
   * open a screen on os sytems nice !
   */
  private _openLogView() {
    this._screen = blessed.screen();
    this._grid = new contrib.grid({ rows: 12, cols: 12, screen: this._screen });
    this.termLog = this._grid.set(0, 0, 4, 12, contrib.log, {
      fg: 'green',
      label: `Server Log ${this.choosedServer.id} ${this.choosedServer.serverUrl}`,
      height: '40%',
      tags: true,
      xLabelPadding: 3,
      xPadding: 5,
      interactive: false,
      bufferLength: 40,
      columnSpacing: 10,
      border: {
        type: 'none'
      }
    });
    this._screen.render();
  }
  /**
   * register Logger on server with the prompts
   */
  private _registerLogger() {
    return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
      /**
       * get a server from inquirer
       */
      .mergeMap((relutionHjson: { data: any, path: string }) => {
        this._relutionHjson = relutionHjson.data;
        return this._deployCommand.getServerPrompt();
      })
      .filter((server: { deployserver: string }) => {
        return server.deployserver !== this._i18n.CANCEL;
      }).mergeMap((server: { deployserver: string }) => {
        if (server.deployserver.toString().trim() === this._deployCommand.defaultServer.trim()) {
          this.choosedServer = find(this._userRc.server, { default: true });
        } else {
          this.choosedServer = find(this._userRc.server, { id: server.deployserver });
        }
        return this._relutionSDK.login(this.choosedServer);
      })
      .mergeMap(() => {
        return this._chooseLevel();
      })
      .mergeMap((level: any) => {
        this.choosedLevel = LEVEL[level];
        Relution.debug.info(`${this.choosedServer.userName} logged in on ${this.choosedServer.serverUrl}`);
        this._log = new LoggerHelper(this._relutionHjson.uuid, this.choosedServer);
        return this._log.registerLogger();
      });
  }
  /**
   * choose a level
   */
  private _chooseLevel() {
    let questions = {
      name: 'level',
      message: 'Please choose the log Level first',
      type: 'list',
      choices: Object.keys(LEVEL).map((lev) => {
        return {
          name: lev.toLowerCase(),
          value: lev
        };
      }),
      filter: function (str: Array<string>) {
        return str;
      }
    };
    return Observable.fromPromise(this._inquirer.prompt(questions));
  }
  /**
   * return the level by  number as a string
   */
  private _getLevelName(level: number): string {
    let name = '';
    Object.keys(LEVEL).forEach((key: string) => {
      if (LEVEL[key] === level) {
        name = key;
      }
    });
    return name;
  }
  /**
   * return the bgColor by level
   */
  private _getLevelColor(level: number): string {
    switch (level) {
      default:
      case LEVEL.TRACE:
        return 'bgBlue';
      case LEVEL.ERROR:
        return 'bgRed';
      case LEVEL.WARN:
        return 'bgYellow';
      case LEVEL.FATAL:
        return 'bgMagenta';
      case LEVEL.DEBUG:
        return 'bgCyan';
    }
  }
  private _getHumanDate(timeStamp: any) {
    const date = new Date(timeStamp);
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    let hour: any = date.getHours();
    let min: any = date.getMinutes();
    let sec: any = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
    return str;
  }
  /**
   * add some cosmetics on message
   */
  private _beautifyLogMessage(log: LogMessage) {
    let bgColor = this._getLevelColor(log.level);
    const levelName = this._getLevelName(log.level);
    if (!this._owner.color[bgColor]) {
      bgColor = 'bgBlue';
    }
    return [this._owner.color.underline[bgColor](this._owner.color.white(levelName)), log.message, this._getHumanDate(log.date), log.id];
  }
  /**
   * return a polling Promise with live log messages
   */
  public getlog(registerUUid: string, ob: any): any {
    return this._log.fetchlogs(registerUUid, LEVEL.TRACE, 'test')
      .then((messages: Array<LogMessage>) => {
        if (!this._screen && os.platform() !== 'win32' && this._state === 'cli') {
          this._openLogView();
          this._screen.key(['escape', 'q', 'C-c'], function (ch: string, key: string) {
            this.screen.destroy();
            this.screen = undefined;
            return ob.complete();
          });
        }
        if (!ob.isUnsubscribed) {
          if (messages.length) {
            messages.map((log) => {
              // console.log(log);
              if (os.platform() === 'win32' || this._state === 'args') {
                console.log.apply(console, this._beautifyLogMessage(log));
              } else {
                this.termLog.log(this._owner.table.row([this._beautifyLogMessage(log)]), { height: 30 });
              }
            });
          }
          return this.getlog(registerUUid, ob);
        }
      });
  }
  /**
   * ist directly used from the terminal
   */
  private _directLog(args?: Array<string>) {
    return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
      /**
       * get a server from inquirer
       */
      .mergeMap((relutionHjson: { data: any, path: string }) => {
        this._relutionHjson = relutionHjson.data;

      })
      .filter((server: { deployserver: string }) => {
        return server.deployserver !== this._i18n.CANCEL;
      })
      /**
       * logged in on server
       */
      .mergeMap((server: { deployserver: string }) => {
        if (args[0].trim() === this._deployCommand.defaultServer.trim()) {
          this.choosedServer = find(this._userRc.server, { default: true });
        } else {
          this.choosedServer = find(this._userRc.server, { id: args[0] });
        }
        return this._relutionSDK.login(this.choosedServer);
      })
      .mergeMap(() => {
        return Observable.from([{ level: LEVEL[args[1].toUpperCase()] || LEVEL.TRACE }]);
      })
      .mergeMap((level: any) => {
        this.choosedLevel = LEVEL[level];
        this._debuglog.info(`${this.choosedServer.userName} logged in on ${this.choosedServer.serverUrl}`);
        this._log = new LoggerHelper(this._relutionHjson.uuid, this.choosedServer);
        return this._log.registerLogger();
      });
  }

  /**
   * print the livelog appender from you choosen server
   */
  public log(args?: Array<any>): any {
    let serverName: string;
    let level = LEVEL.TRACE;

    if (args && args[0]) {
      serverName = args[0];
      this._state = 'args';
    } else {
      this._state = 'cli';
    }

    if (args && args[1]) {
      level = args[1];
    }

    const isSuper = args && args[0] ? true : false;

    return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
      /**
       * get a server from inquirer
       */
      .mergeMap((relutionHjson: { data: any, path: string }) => {
        this._relutionHjson = relutionHjson.data;
        // directLog
        if (isSuper) {
          return this._deployCommand._getServers();
          // registerLogger
        } else {
          return this._deployCommand.getServerPrompt();
        }
      })
      .filter((server: { deployserver: string }) => {
        return server.deployserver !== this._i18n.CANCEL;
      }).mergeMap((server: { deployserver: string }) => {
        // directLog
        if (isSuper) {
          if (args[0].trim() === this._deployCommand.defaultServer.trim()) {
            this.choosedServer = find(this._userRc.server, { default: true });
          } else {
            this.choosedServer = find(this._userRc.server, { id: args[0] });
          }
          // registerLogger
        } else {
          if (server.deployserver.toString().trim() === this._deployCommand.defaultServer.trim()) {
            this.choosedServer = find(this._userRc.server, { default: true });
          } else {
            this.choosedServer = find(this._userRc.server, { id: server.deployserver });
          }
        }
        return this._relutionSDK.login(this.choosedServer);
      })
      .mergeMap(() => {
        // directLog
        if (isSuper) {
          return Observable.from([{ level: LEVEL[args[1].toUpperCase()] || LEVEL.TRACE }]);
          // registerLogger
        } else {
          return this._chooseLevel();
        }
      })
      .mergeMap((level: any) => {
        this.choosedLevel = LEVEL[level];
        Relution.debug.info(`${this.choosedServer.userName} logged in on ${this.choosedServer.serverUrl}`);
        this._log = new LoggerHelper(this._relutionHjson.uuid, this.choosedServer);
        return this._log.registerLogger();
      })
      .exhaustMap((registerUUid: string) => {
        return Observable.create((ob: Observer<any>) => {
          return this.getlog(registerUUid, ob)
            .catch((e: Error) => {
              ob.error(e);
              if (os.platform() !== 'win32' && this._state === 'cli') {
                this._screen.destroy();
                this._screen = undefined;
              }
              // ob.unsubcribe();
              return;
            })
        });
      });
  }
}
