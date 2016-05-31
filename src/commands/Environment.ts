import {Command} from './../utility/Command';
import * as chalk from 'chalk';
import {isArray} from 'lodash';
import {Observable} from '@reactivex/rxjs';
import {Validator} from './../utility/Validator';
import {EnvCollection} from './../collection/EnvCollection';
import {FileApi} from './../utility/FileApi';
import {Gii} from './../gii/Gii';
import {EnvModel} from './../models/EnvModel';
import {ChooseEnv} from './environment/ChooseEnv';
import {AddAttribute} from './environment/AddAttribute';

export
  /**
   * Environment
   * create a autogenerated environment for the developer
   * This is a key => value Store for your server project.
   * ```bash
   *  relution env <$name>
   * ```
   */
  class Environment extends Command {
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
      description: this.i18n.LIST_COMMAND('Environment')
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
    this.fsApi.path = `${process.cwd()}/env/`;
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
      this.fsApi.writeHjson(template.instance.render(name.toLowerCase()), name.toLowerCase()).subscribe(
        (pipe: any) => {
          observer.next(`Environment ${name} is generated`);
        },
        (e: any) => { observer.error(e); },
        () => {
          this.envCollection.getEnvironments().subscribe({
            complete: () => observer.complete()
          });
        }
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
        error: (e: Error) => {
          console.log(e);
          // observer.error('no environments available');
          super.preload().subscribe({
            complete: () => observer.complete()
          });
        },
        complete: () => {
          // this.log.debug(this.envCollection.collection);
          this.chooseEnv = new ChooseEnv(this.envCollection);
          super.preload().subscribe({
            complete: () => observer.complete()
          });
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
        message: this.i18n.ENTER_SOMETHING.concat('Environment name'),
        validate: function (value: string) {
          let done: any = this.async();
          if (self.envCollection.isUnique(value)) {
            self.log.error(new Error(self.i18n.ALREADY_EXIST(value)));
            done(false);
          }

          let pass: any = value.match(Validator.stringPattern);
          if (pass) {
            done(null, true);
          } else {
            self.log.error(new Error(self.i18n.NOT_ALLOWED(value, Validator.stringPattern)));
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
  enterName(): any {
    let prompt = this._addName;
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * inquirer for add a key valu store
   */
  getAttributes(store: Array<{ key: string, value: any }>): any {
    return this.addAttribute.store()
      .exhaustMap((answers: { key: string, value: any }) => {
        store.push({ key: answers.key.trim(), value: answers.value.trim() });
        return this.addAttribute.addAnother();
      })
      .exhaustMap((answers: { another: boolean }) => {
        // no one more set stor back
        if (!answers.another) {
          return Observable.create((observer: any) => {
            observer.next(store);
            observer.complete();
          });
        }
        return this.getAttributes(store);
      })
      ;
  }

  /**
   * add a new key valu pair or many
   */
  update(name?: string): Observable<any> {
    let names: Array<string> = [];
    return this.chooseEnv.choose()
      .filter((answers: { env: [string] }) => {
        return answers[this.chooseEnv.promptName].indexOf(this.i18n.TAKE_ME_OUT) === -1;
      })
      /**
       * get the attributes which one generated
       */
      .exhaustMap((answers: { env: [string] }) => {
        names = answers[this.chooseEnv.promptName];
        return this.getAttributes([]);
      })
      .exhaustMap((store: Array<{ key: string, value: any }>) => {
        return this.envCollection.bulkUpdate(names, store).map(() => {
          return `Update complete`;
        });
      });
  }

  /**
   * shows all available environments
   * @returns Observable
   */
  list() {
    return Observable.create((observer: any) => {
      let content: any = [['']];
      let tableHeader: Array<string> = ['Environment Name'];
      this.envCollection.getEnvironments().subscribe({
        complete: () => {
          let list: Array<string> = this.envCollection.flatEnvArray();
          list.forEach((name: string) => {
            content.push([chalk.yellow(`${name}`)]);
          });
          if (content.length < 1) {
            observer.complete();
          }
          observer.next(this.table.sidebar(content, tableHeader));
          observer.complete();
        }
      });
    });
  }
  /**
   * copy a exits environment and set the name
   */
  copy(args?: Array<string>): Observable<any> {
    let tobeCopied: string;
    let toBeGenerate: string;

    if (!args || args && !args[0].length) {
      return this.chooseEnv.choose('list', this.i18n.SELECT('Environment'))
        .exhaustMap((answers: { env: string }) => {
          tobeCopied = answers[this.chooseEnv.promptName];
          return this.enterName();
        })
        .exhaustMap((answers: { name: string }) => {
          toBeGenerate = answers.name;
          return this.envCollection.copyByName(tobeCopied, toBeGenerate);
        });
    }

    if (args && args[0].length && args[1].length) {
      tobeCopied = args[0];
      toBeGenerate = args[1];
      return this.envCollection.copyByName(tobeCopied, toBeGenerate)
        .do((data: any) => {
          this.log.info(this.i18n.HJSON_WRITTEN(toBeGenerate));
        });
    }
  }
  /**
   * add a new Environment allow attributes name as a string
   * @returns Observable
   */
  add(name?: string | Array<string>) {
    // ['relution', 'env', 'add']
    if (!name || !name.length) {
      return this.enterName()
        .exhaustMap((answers: { name: string }) => {
          return this.createEnvironment(answers.name);
        })
        .exhaustMap((log: string) => {
          this.log.info(`${log} \n`);
          return this.list();
        });
    }
    // >relution env add bubble
    // this.log.debug('name', name);
    if (isArray(name)) {
      // this.log.debug('isArray(name)', isArray(name));
      let envName: string = name[0];
      // this.log.debug('envName', envName);
      let pass: any = envName.match(Validator.stringPattern);
      // this.log.debug('pass', pass);
      let unique: EnvModel = this.envCollection.isUnique(envName);
      // this.log.debug('unique', unique);

      if (unique) {

        return Observable.create((observer: any) => {
          observer.error(this.i18n.ALREADY_EXIST(envName));
          observer.complete();
        });
      }

      if (pass) {
        return Observable.create((observer: any) => {
          this.createEnvironment(envName).subscribe(
            () => {
              observer.next(this.i18n.HJSON_WRITTEN(envName));
            },
            (e: any) => {
              observer.error(e);
            },
            () => {
              observer.complete();
            }
          );
        });
      }

      return Observable.create((observer: any) => {
        observer.next(this.i18n.NOT_ALLOWED(envName, Validator.stringPattern));
        observer.complete();
      });
    }
  }
}
