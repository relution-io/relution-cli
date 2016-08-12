import { Command } from './Command';
import {ServerModelRc} from './../models/ServerModelRc';
import {Deploy} from './project/Deploy';
import {find} from 'lodash';
import {FileApi} from '../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import * as os from 'os';
import * as path from 'path';
import * as Relution from 'relution-sdk';
import {Observable, Observer} from '@reactivex/rxjs';
import { LoggerHelper, LEVEL } from './logger/LoggerHelper';

const blessed = require('blessed');
const contrib = require('blessed-contrib');

export interface LogMessage {
  id: string;
  message: string;
  logger: string;
  level: number;
  date: Date;
  extraFieldsMap?: any;
  setProperties?: Array<string>;
}
export class Logger extends Command {
  private screen: any;
  private _deployCommand: Deploy;
  private _relutionHjson: any;
  private _fileApi: FileApi = new FileApi();
  private _log: LoggerHelper;
  public termLog: any;
  public choosedServer: ServerModelRc;
  public choosedLevel: number;
  private _grid: any;
  private _state = 'cli';
  public commands: Object = {
    log: {
      label: 'log',
      when: () => {
        return RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
      },
      why: () => {
        return this.i18n.LOGGER_LOG_WHY;
      },
      description: this.i18n.LOGGER_LOG_DESCRIPTION,
      vars: {
        serverName: {
          pos: 0
        },
        level: {
          pos: 1
        }
      }
    },
    help: {
      description: this.i18n.HELP_COMMAND('Debugger')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  constructor() {
    super('logger');
    this._deployCommand = new Deploy(this);
  }

  private _openLogView() {
    this.screen = blessed.screen();
    this._grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen});
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
    this.screen.render();
  }

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
        return server.deployserver !== this.i18n.CANCEL;
      })
      /**
       * logged in on server
       */
      .mergeMap((server: { deployserver: string }) => {
        if (server.deployserver.toString().trim() === this._deployCommand.defaultServer.trim()) {
          this.choosedServer = find(this.userRc.server, { default: true });
        } else {
          this.choosedServer = find(this.userRc.server, { id: server.deployserver });
        }
        return this.relutionSDK.login(this.choosedServer);
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

  private _chooseLevel() {
    let questions = {
      name: 'level',
      message: 'Choose the log Level first',
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
    return Observable.fromPromise(this.inquirer.prompt(questions));
  }

  private _getLevelName(level: number): string {
    let name = '';
    Object.keys(LEVEL).forEach((key: string) => {
      if (LEVEL[key] === level) {
        name = key;
      }
    });
    return name;
  }

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
  private _beautifyLogMessage(log: LogMessage) {
    let bgColor = this._getLevelColor(log.level);
    const levelName = this._getLevelName(log.level);
    if (!this.color[bgColor]) {
      bgColor = 'bgBlue';
    }
    const content = [[this.color.underline[bgColor](this.color.white(levelName)), log.message, log.date, log.id]];
    return this.table.row(content);
  }

  public getlog(registerUUid: string, ob: Observer<any>): any {
    return this._log.fetchlogs(registerUUid, LEVEL.TRACE, 'test')
    .then((messages: Array<LogMessage>) => {
      if (!this.screen && os.platform() !== 'win32' && this._state === 'cli') {
        this._openLogView();
        this.screen.key(['escape', 'q', 'C-c'], function(ch: string, key: string) {
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
              console.log(this._beautifyLogMessage(log));
            } else {
              this.termLog.log(this._beautifyLogMessage(log), {height: 30});
            }
          });
        }
        return this.getlog(registerUUid, ob);
      }
    });
  }

  private _directLog(args?: Array<string>) {
    return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
      /**
       * get a server from inquirer
       */
      .mergeMap((relutionHjson: { data: any, path: string }) => {
        this._relutionHjson = relutionHjson.data;
        return this._deployCommand._getServers();
      })
      /**
       * logged in on server
       */
      .mergeMap(() => {
        if (args[0].trim() === this._deployCommand.defaultServer.trim()) {
          this.choosedServer = find(this.userRc.server, { default: true });
        } else {
          this.choosedServer = find(this.userRc.server, { id: args[0] });
        }
        return this.relutionSDK.login(this.choosedServer);
      })
      .mergeMap(() => {
        return Observable.from([{level: args[1]}]);
      })
      .mergeMap((level: any) => {
        this.choosedLevel = LEVEL[level];
        this.debuglog.info(`${this.choosedServer.userName} logged in on ${this.choosedServer.serverUrl}`);
        this._log = new LoggerHelper(this._relutionHjson.uuid, this.choosedServer);
        return this._log.registerLogger();
      });
  }

  public log(args?: Array<any>): any {
    // console.log('args', args);
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

    return Observable.create((ob: Observer<{}>) => {
      const sub = serverName ?  this._directLog(args) : this._registerLogger();
      sub.subscribe((registerUUid: string) => {
        return this.getlog(registerUUid, ob)
        .catch((e: Error) => {
          ob.error(e);
          if (os.platform() !== 'win32' && this._state === 'cli') {
            this.screen.destroy();
            this.screen = undefined;
          }
          sub().unsubcribe();
          return;
        });
      });
    });
  }
}

