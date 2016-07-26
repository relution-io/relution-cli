import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
import {FileApi} from './../utility/FileApi';

import {Create} from './project/Create';
import {Deploy} from './project/Deploy';

import {RxFs} from './../utility/RxFs';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

/**
 * create a new Baas for the Developer
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                    │
 * │         │          │          │                                │
 * │ new     │ create   │ <$name>  │ create a new Project in Folder │
 * │ new     │ help     │ --       │ List the New Command           │
 * │ new     │ back     │ --       │ Exit to Home                   │
 * │         │          │          │                                │
 * └─────────┴──────────┴──────────┴────────────────────────────────┘
 * ```
 */
export class Project extends Command {

  public commands: any = {
    create: {
      when: () => {
        let files = fs.readdirSync(process.cwd());
        if (_.some(files, (file) => !/(^|\/)\.[^\/\.]/g.test(file))) {
          return false;
        }
        return true;
      },
      why: () => {
        return this.i18n.FOLDER_NOT_EMPTY(process.cwd());
      },
      description: this.i18n.NEW_CREATE,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    deploy: {
      description: this.i18n.DEPLOY_PUBLISH,
      when: () => {
        return RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
      },
      why: () => {
        if (!RxFs.exist(path.join(process.cwd(), 'relution.hjson'))) {
          return this.i18n.FOLDER_IS_NOT_A_RELUTION_PROJECT(path.join(process.cwd()));
        }
      },
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.HELP_COMMAND('Project')
    },
    back: {
      description: this.i18n.EXIT_TO_HOME
    }
  };
  private _fsApi: FileApi = new FileApi();
  private _create: Create = new Create();

  constructor() {
    super('project');
  }

  /**
   * @params name a string to create the project
   * @return Observable
   */
  create(name?: [string]): Observable<any> {
    let files: Array<any> = [];
    return Observable.create((observer: any) => {
      this._fsApi.fileList(process.cwd()).subscribe({
        next: (file: any) => {
          if (!/(^|\/)\.[^\/\.]/g.test(file)) {
            console.log(file);
            files.push(file);
          }
        },
        complete: () => {
          if (!files.length) { // is empty the folder
            this._create.publish().subscribe(
              (resp: any) => { observer.next(resp); },
              (e: Error) => observer.error(e),
              () => { observer.complete(); }
            );
          } else {
            observer.error(new Error(this.i18n.FOLDER_NOT_EMPTY(process.cwd())));
            observer.complete();
          }
        }
      });
    });
  }

  deploy(args: [string]) {
    return new Deploy(this).publish(args);
  }
}
