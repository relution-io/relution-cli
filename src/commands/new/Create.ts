import {Observable} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {Gii} from './../../gii/Gii';
import {TemplateModel} from './../../gii/TemplateModel';
import {FileApi} from './../../utility/FileApi'
import * as inquirer from 'inquirer';
const npm = require('npm');
const figures = require('figures');

export class Create {
  private _name: string;
  private _gii: Gii = new Gii();
  private _fsApi: FileApi = new FileApi();
  //create in the project folder a folder with a gitkeep file
  public emptyFolders: Array<string> = ['env', 'routes', 'models', 'connections', 'providers', 'editorconfig'];
  //files to be generated
  public toGenTemplatesName: Array<string> = ['app', 'package', 'relutionhjson', 'relutionignore', 'routes', 'readme'];

  constructor() {
    npm.load();
  }
  /**
   * write folders to the project folder
   */
  addStructure() {
    let all: Array<any> = [];
    this.emptyFolders.forEach((folderName: string) => {
      all.push(this._fsApi.mkdirStructureFolder(`${process.cwd()}/${folderName}`));
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
            console.log(chalk.red(`\n Name ${value} has wrong character allowed only [a-z A-Z]`));
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

  writeTemplates(name: string): Observable<any> {
    return Observable.create((observer: any) => {
      let templates: Array<any> = [];
      let writingFiles: Array<any> = [];

      this.toGenTemplatesName.forEach((templateName: string) => {
        let templateGii: TemplateModel = this._gii.getTemplateByName(templateName);
        templateGii.instance.name = name;
        //root or in a subfolder
        let toGenPath: string = templateGii.instance.parentFolder ? `${process.cwd()}/${templateGii.instance.parentFolder}/` : process.cwd();
        // console.log(toGenPath);
        writingFiles.push(this._fsApi.writeFile(templateGii.instance.template, templateGii.instance.publishName, toGenPath));
      });

      Observable.forkJoin(writingFiles).subscribe({
        complete: () => {
          observer.complete();
        }
      });
    });
  }

  npmInstall(): Observable<any> {
    npm.commands.install();
    let installer: any = Observable.bindNodeCallback(npm.commands.install);
    return installer();
  }

  publish(name?: string): Observable<any> {

    if (!name || !name.length) {

      return Observable.create((observer: any) => {
        this.enterName().subscribe(
          (answers: any) => {

            this.name = answers.name;
          },
          (e) => { console.error(e) },
          () => {
            this.addStructure().subscribe({
              complete: () => {
                observer.next(chalk.magenta(`${this.emptyFolders.toString()} folders are written`));
                this.writeTemplates(this.name).subscribe({
                  complete: () => {
                    observer.next(chalk.magenta(`${this.toGenTemplatesName.toString()} files are written`));
                    this.npmInstall().subscribe({
                      complete: () => {
                        observer.next(chalk.magenta(`Project ${this.name} are generated!\n`));
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
    }
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }
}
