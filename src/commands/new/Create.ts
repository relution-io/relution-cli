import {Observable} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {Gii} from './../../gii/Gii';
import {TemplateModel} from './../../gii/TemplateModel';
import {FileApi} from './../../utility/FileApi'
import * as inquirer from 'inquirer';

export class Create{
  private _name : string;
  private _gii:Gii = new Gii();
  private _fsApi:FileApi  = new FileApi();

  public emptyFolders:Array<string> = ['env', 'routes', 'models', 'connections', 'providers'];
  public toGenTemplatesName:Array<string> = ['app', 'package', 'relutionhjson', 'relutionignore'];

  addStructure(){
    let all:Array<any> = [];

    this.emptyFolders.forEach((folderName:string) => {

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
        validate: (value: string):boolean => {
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

  writeTemplates(...attr:Array<any>):Observable<any> {
    return Observable.create((observer:any) => {
      let templates: Array<any> = [];
      let writingFiles:Array<any> = [];
      this.toGenTemplatesName.forEach((name:string) => {
        //console.log(attr[0].name);
        let templateGii:TemplateModel = this._gii.getTemplateByName(name);
        templateGii.instance.name = attr[0].name.name;
        //console.log(templateGii.instance.template);
        writingFiles.push(this._fsApi.writeFile(templateGii.instance.template, templateGii.instance.publishName));
      });
      Observable.forkJoin(writingFiles).subscribe({complete: () => {
        observer.complete();
      }});
      //console.log(JSON.stringify(templates, null, 2));
    });
  }

  publish(name?:string):Observable<any> {
    if (!name || !name.length) {
      return Observable.create((observer:any) => {
        this.enterName().subscribe(
          (answers:any) => {
            // console.log(answers);
            this.name = answers;
            observer.next(this.name);
            this.writeTemplates({name: this.name}).subscribe(
              (status:any) => {
                console.log(status);
              },
              () => {},
              () => observer.complete()
            );
          }
        )
      })
    }
  }

  public get name() : string {
    return this._name;
  }

  public set name(v : string) {
    this._name = v;
  }
}
