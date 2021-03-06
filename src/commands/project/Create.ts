import * as path from 'path';
import * as inquirer from 'inquirer';

import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {Gii} from './../../gii/Gii';
import {TemplateModel} from './../../gii/TemplateModel';
import {FileApi} from './../../utility/FileApi';
import {DebugLog} from './../../utility/DebugLog';

const camelCase = require('camel-case');

export class Create {
  private _name: string;
  private _gii: Gii = new Gii();
  private _fsApi: FileApi = new FileApi();

  public rootProjectFolder: string = process.cwd();
  // create in the project folder a folder
  public emptyFolders: Array<string> = [
    'env',
    'routes',
    'models',
    'connections',
    'push',
    'www'
  ];

  // files to be generated
  public toGenTemplatesName: Array<string> = [
    'app',
    'editorconfig',
    'package',
    'relutionhjson',
    'relutionignore',
    'gitignore',
    'routes',
    'readme',
    'connectors',
    'modelreadme',
    'connectionsreadme',
    'envreadme',
    'pushreadme',
    'pushroute',
    'tslint',
    'tsconfig',
    'index.html'
  ];

  constructor() {

  }
  /**
   * write folders to the project folder
   */
  addStructure(): any {
    let all: Array<any> = [];
    this.emptyFolders.forEach((folderName: string) => {
      all.push(this._fsApi.mkdirStructureFolder(`${this.rootProjectFolder}/${folderName}`));
    });
    return Observable.forkJoin(all);
  }

  /**
   * add a name for a new environment
   * @returns Array
   */
  get _addName(): Array<Object> {
    return [
      {
        type: 'input',
        name: 'name',
        default: camelCase(path.basename(process.cwd())),
        message: Translation.ENTER_SOMETHING.concat('Project name'),
        validate: (value: string): boolean => {
          let pass: any = value.match(Validator.stringPattern);
          if (pass) {
            return true;
          } else {
            DebugLog.error(new Error(Translation.NOT_ALLOWED(value, Validator.stringPattern)));
            return false;
          }
        }
      }
    ];
  }

  /**
   * create a prompt to enter a name
   * @returns Observable
   */
  enterName(): any {
    let prompt = this._addName;
    return Observable.fromPromise(<any>inquirer.prompt(prompt));
  }
  /**
   * create the "toGenTemplatesName" as file
   */
  writeTemplates(name: string): Observable<any> {
    let writingFiles: Array<any> = [];

    this.toGenTemplatesName.forEach((templateName: string) => {
      let templateGii: TemplateModel = this._gii.getTemplateByName(templateName);
      templateGii.instance.name = name;
      // root or in a subfolder
      let toGenPath: string = templateGii.instance.parentFolder ? `${this.rootProjectFolder}/${templateGii.instance.parentFolder}/` : this.rootProjectFolder;
      // DebugLog.debug(toGenPath);
      writingFiles.push(this._fsApi.writeFile(templateGii.instance.template, templateGii.instance.publishName, toGenPath));
    });

    return Observable.forkJoin(writingFiles);
  }
  /**
   * npm install
   */
  npmInstall(): Observable<any> {
    const exec = require('child_process').exec;
    return Observable.create((observer: any) => {
      return exec('npm install', (error: Error, stdout: any, stderr: any) => {
        if (error) {
          observer.error(`exec error: ${error}`);
          return;
        }

        DebugLog.debug(stdout);
        exec('typings i', (error: Error, stdout: any, stderr: any) => {
          if (error) {
            observer.error(`exec error: ${error}`);
            return;
          }
          DebugLog.debug(stdout);
          observer.next();
          observer.complete();
        });
      });
    });
  }

  public installTypings() {
    const exec = require('child_process').exec;
    return Observable.create((observer: any) => {
      exec(`typings install dt~es6-collections env~node dt~q dt~es6-promise dt~express dt~serve-static dt~express-serve-static-core dt~multer dt~body-parser --save --global`, (e: Error, dout: any, derr: any) => {
        if (e) {
          observer.error(`exec error: ${e}`);
          return;
        }
        DebugLog.debug(dout);
        exec(`typings install npm~lodash npm~mime --save`, (err: Error, ddout: any, dderr: any) => {
          if (err) {
            observer.error(`exec error: ${err}`);
            return;
          }

          DebugLog.debug(ddout);
          exec(`tsconfig && tsc -p ${process.cwd()}`, (err: Error, ddout: any, dderr: any) => {
            if (err) {
              observer.error(`exec error: ${err}`);
              return;
            }
            DebugLog.debug(ddout);

          });
        });
      });
    });
  }
  /**
   * create a new project
   */
  publish(name?: string, test = false): Observable<any> {
    if (!name || !name.length) {
      return this.enterName()
        /**
         * choose name
         */
        .exhaustMap((answers: { name: string }) => {
          this.name = answers.name;
          return this.addStructure();
        })
        /**
         * write templates to folder
         */
        .exhaustMap(() => {
          DebugLog.info(Translation.FOLDERS_WRITTEN(this.emptyFolders.toString()));
          return this.writeTemplates(this.name);
        })
        /**
         * npm i
         */
        .exhaustMap((err: any) => {
          DebugLog.info(Translation.FILES_WRITTEN(this.toGenTemplatesName.toString()));
          DebugLog.info(Translation.NPM_INSTALL);
          return this.npmInstall();
        })
        .exhaustMap(() => {
          return Observable.create((observer: any) => {
            const exec = require('child_process').exec;
            exec(`tsc -p ${process.cwd()}`);
            observer.complete();
          });
        })
        /**
         * done
         */
        .do(() => {
          DebugLog.info(Translation.WRITTEN(this.name, 'Project'));
        });
    } else if (name && name.length) {
      this.name = name;
      return this.addStructure()
        /**
         * write templates to folder
         */
        .exhaustMap(() => {
          DebugLog.info(Translation.FOLDERS_WRITTEN(this.emptyFolders.toString()));
          return this.writeTemplates(this.name);
        })
        /**
         * npm i
         */
        .exhaustMap(() => {
          DebugLog.info(Translation.FILES_WRITTEN(this.toGenTemplatesName.toString()));
          DebugLog.info(Translation.NPM_INSTALL);
          return this.npmInstall().last();
        })
        .exhaustMap(() => {
          return Observable.create((observer: any) => {
            const exec = require('child_process').exec;
            exec(`tsc -p ${process.cwd()}`);
            observer.complete();
          });
        })
        /**
         * done
         */
        .do(() => {
          DebugLog.info(Translation.WRITTEN(this.name, 'Project'));
        });
    }
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }
}
