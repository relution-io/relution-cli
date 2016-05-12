import {Command} from './../utility/Command';
import * as chalk from 'chalk';
import {isArray, isString, map} from 'lodash';
import {Observable} from '@reactivex/rxjs';
import {Validator} from './../utility/Validator';
import {Translation} from './../utility/Translation';
import {EnvCollection} from './../collection/EnvCollection';
import {FileApi} from './../utility/FileApi';
import {Gii} from './../gii/Gii';
import {Table} from './../utility/Table';
import {EnvModel} from './../models/EnvModel';
import {ChooseEnv} from './environment/ChooseEnv';
import {AddAttribute} from './environment/AddAttribute';

/**
 * create a autogenerated environment for the developer
 * This is a key => value Store for your server project.
 * ```bash
 *  relution env <$name>
 * ```
 */
/**
 * Environment
 */
export class Environment extends Command {
  /**
   * available commands
   */
  public commands: Object = {
    add: {
      description: 'add a new Environment',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    update: {
      description: 'Add a new key value pair to your Environment.',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    copy: {
      description: 'copy a exist Environment',
      vars: {
        from: {
          pos: 0
        },
        name: {
          pos: 1
        }
      }
    },
    list: {
      description: 'List all environments by name'
    },
    help: {
      description: 'List the Environment Command'
    },
    quit: {
      description: 'Exit To Home'
    }
  };
  /**
   * hjson file helper
   */
  public fsApi: FileApi = new FileApi();
  /**
   * code generator
   */
  public gii: Gii = new Gii();
  /**
   * the collection of the available environments
   */
  public envCollection: EnvCollection = new EnvCollection();
  /**
   * return a prompt with choosed env
   */
  public chooseEnv: ChooseEnv;
  /**
   * prompt for add key value pair
   */
  public addAttribute: AddAttribute = new AddAttribute();
  constructor() {
    super('env');
  }
  /**
   * write the hjson to the dev folder
   * @todo add process.cwd as path
   * @params name create a <$name>.hjson in the project env folder
   * @returns Observable
   */
  createEnvironment(name: string) {
    return Observable.create((observer: any) => {
      let template = this.gii.getTemplateByName(this.name);
      this.fsApi.writeHjson(template.instance.render(name), name).subscribe(
        (pipe: any) => {
          observer.next(pipe);
        },
        (e: any) => { observer.error(e) },
        () => { observer.complete() }
      );
    });
  }

  /**
   * overwrite Commnad preload and load environments before
   * @returns Observable
   */
  preload() {
    return Observable.create((observer: any) => {
      this.envCollection.getEnvironments().subscribe({
        complete: () => {
          // console.log(this.envCollection.collection);
          this.chooseEnv = new ChooseEnv(this.envCollection);
          super.preload().subscribe({ complete: () => observer.complete() });
        }
      });
    });
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
        message: Translation.ENTER_SOMETHING.concat('Environment name'),
        validate: function (value: string) {
          let done: any = this.async();
          if (self.envCollection.isUnique(value)) {
            console.log(chalk.red(`\n Name ${value} already exist please choose another one`));
            done(false);
          }

          let pass: any = value.match(Validator.stringPattern);
          if (pass) {
            done(null, true);
          } else {
            console.log(chalk.red(`\n Name ${value} has wrong character allowed only [a-z A-Z]`));
            done(false);
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
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  getAttributes(store: Array<{ key: string, value: any }>) {
    return Observable.create((observer: any) => {
      this.addAttribute.store().subscribe(
        (answers: any) => {
          // console.log('answers store', answers);
          store.push({key: answers.key.trim(), value: answers.value.trim()});
        },
        (e: any) => console.error(e),
        () => {
          this.addAttribute.addAnother().subscribe(
            (answers: any) => {
              // console.log('answers another', answers );
              if (answers[this.addAttribute.addPromptName] === false) {
                observer.next(store);
                return observer.complete();
              }
              // console.log('store', store);
              this.getAttributes(store).subscribe({
                complete: () => {
                  observer.next(store);
                  observer.complete();
                }
              });
            }
          );
        }
      );
    });
  }
  /**
   *
   */
  update(name?: string) {
    let attributes: Array<any> = [];
    let names: Array<string> = [];
    this.chooseEnv.choose().subscribe(
      (answers: any) => {
        names = answers[this.chooseEnv.promptName];
        // console.log(names);
        if (names.indexOf(Translation.TAKE_ME_OUT) !== -1) {
          return super.home();
        }
        this.getAttributes([]).subscribe(
          (attrs: any) => {
            attributes = attrs;
            // console.log('result', attributes);
            this.envCollection.bulkUpdate(names, attributes).subscribe(
              (res: any) => {
                // console.log('complete????');
                super.home();
              }
            );
          }
        );
      }
    );
  }
  /**
   * shows all available environments
   * @returns Observable
   */
  list() {
    return Observable.create((observer: any) => {
      let content: any = [['']];
      let tableHeader: Array<string> = ['Environment Name'];
      let list: Array<string> = this.envCollection.flatEnvArray();
      list.forEach((name: string) => {
        content.push([chalk.yellow(`${name}`)]);
      });
      if (content.length < 1) {
        observer.complete();
      }
      observer.next(this.table.sidebar(tableHeader, content));
      observer.complete();
    })
  }
  /**
   * add a new Environment allow attributes name as a string
   * @returns Observable
   */
  add(name?: string) {
    //['relution', 'env', 'add']
    if (!name || !name.length) {
      return Observable.create((observer: any) => {
        this.enterName().subscribe(
          (answers: any) => {
            this.createEnvironment(answers.name).subscribe({
              complete: () => observer.complete()
            });
          },
          (e: any) => console.error(e),
          () => { observer.complete(); }
        );
      });
    }
    //>relution env add bubble
    // console.log('name', name);
    if (isArray(name)) {
      // console.log('isArray(name)', isArray(name));
      let envName: string = name[0];
      // console.log('envName', envName);
      let pass: any = envName.match(Validator.stringPattern);
      // console.log('pass', pass);
      let unique: EnvModel = this.envCollection.isUnique(envName);
      // console.log('unique', unique);

      if (unique) {
        console.log(chalk.red(`\n Name ${envName} already exist please choose another one`));
        return this.init([this.name], this._parent);
      }

      if (pass) {
        return this.createEnvironment(envName).subscribe(
          () => { },
          (e: any) => { console.error(e) },
          () => { process.exit() }
        );
      }

      console.log(chalk.red(`\n Name ${envName} has wrong character allowed only [a-z A-Z]`));
      return this.init([this.name], this._parent);
    }
  }
}
