import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {Gii} from './../../gii/Gii';
import {TemplateModel} from './../../gii/TemplateModel';
import {FileApi} from './../../utility/FileApi'
import * as inquirer from 'inquirer';
const npm = require('npm');
const figures = require('figures');
import {DebugLog} from './../../utility/DebugLog';

export class Create {
  private _name: string;
  private _gii: Gii = new Gii();
  private _fsApi: FileApi = new FileApi();

  public rootProjectFolder:string = process.cwd();
  //create in the project folder a folder with a gitkeep file
  public emptyFolders: Array<string> = [
    'env',
    'routes',
    'models',
    'connections',
    'push'
  ];

  //files to be generated
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
    'pushreadme'
  ];

  constructor() {
    npm.load();
  }
  /**
   * write folders to the project folder
   */
  addStructure() {
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
    let self = this;
    return [
      {
        type: 'input',
        name: 'name',
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
  enterName() {
    let prompt = this._addName;
    return Observable.fromPromise(inquirer.prompt(prompt));
  }
  /**
   * create the "toGenTemplatesName" as file
   */
  writeTemplates(name: string): Observable<any> {
    let templates: Array<any> = [];
    let writingFiles: Array<any> = [];

    this.toGenTemplatesName.forEach((templateName: string) => {
      let templateGii: TemplateModel = this._gii.getTemplateByName(templateName);
      templateGii.instance.name = name;
      //root or in a subfolder
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
    npm.commands.install();
    let installer: any = Observable.bindNodeCallback(npm.commands.install);
    return installer();
  }
  /**
   * create a new project
   */
  publish(name?: string, test:boolean = false): Observable<any> {

    if (!name || !name.length) {
      return Observable.create((observer: any) => {
        this.enterName().subscribe(
          (answers: any) => {
            this.name = answers.name;
            DebugLog.debug(answers.name);
          },
          (e) => { console.error(e) },
          () => {
            this.addStructure().subscribe({
              complete: () => {
                observer.next(Translation.FOLDERS_WRITTEN(this.emptyFolders.toString()));
                this.writeTemplates(this.name).subscribe({
                  complete: () => {
                    observer.next(Translation.FILES_WRITTEN(this.toGenTemplatesName.toString()));

                    this.npmInstall().subscribe({
                      complete: () => {
                        observer.next(Translation.WRITTEN(this.name, 'Project'));
                        observer.complete();
                      }
                    });
                  }
                });
              }
            });
          }
        )
      });
    } else if(name && name.length) {
      this.name = name;
      return Observable.create((observer: any) => {
        this.addStructure().subscribe({
          complete: () => {
            observer.next(Translation.FOLDERS_WRITTEN(this.emptyFolders.toString()));
            this.writeTemplates(this.name).subscribe({
              complete: () => {
                observer.next(Translation.FILES_WRITTEN(this.toGenTemplatesName.toString()));
                if(!test) {
                  npm.load(() => {
                    this.npmInstall().subscribe({
                      complete: () => {
                        observer.next(Translation.WRITTEN(this.name, 'Project'));
                        observer.complete();
                      }
                    });
                  });
                } else {
                  observer.next(Translation.WRITTEN(this.name, 'Project'));
                  observer.complete();
                }
              }
            });
          }
        });
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
