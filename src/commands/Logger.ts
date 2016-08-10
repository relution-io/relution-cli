import { Command } from './Command';
import {ServerModelRc} from './../models/ServerModelRc';
import {Deploy} from './project/Deploy';
import {find} from 'lodash';
import {FileApi} from '../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import * as os from 'os';
import * as path from 'path';
import * as Relution from 'relution-sdk';

import {Observable} from '@reactivex/rxjs';

export class Logger extends Command {

  private _deployCommand: Deploy;
  private _relutionHjson: any;
  private _fileApi: FileApi = new FileApi();

  public commands: Object = {
    log: {
      when: () => {
        return RxFs.exist(path.join(this._deployCommand.projectDir, 'relution.hjson'));
      },
      why: () => {
        return this.i18n.LOGGER_LOG_WHY;
      },
      description: this.i18n.LOGGER_LOG_DESCRIPTION,
      vars: {
        server: {
          pos: 0
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
  }
}

