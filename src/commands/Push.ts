import {Command} from './../utility/Command';
import {FileApi} from './../utility/FileApi';
import {RxFs} from './../utility/RxFs';
import {PushCollection, PushModel, IOSPush, AndroidPush} from './../collection/PushCollection';
import {Observable} from '@reactivex/rxjs';
import * as path from 'path';
import * as chalk from 'chalk';
import {Validator} from './../utility/Validator';
import {find} from 'lodash';

/**
 * Push
 * ```bash
 * ┌─────────┬──────────┬──────────┬─────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                 │
 * │         │          │          │                             │
 * │ push    │ add      │ <$name>  │ create a push config        │
 * │ push    │ list     │ --       │ list available push configs │
 * │ push    │ help     │ --       │ List the Push Command       │
 * │ push    │ quit     │ --       │ Exit to Home                │
 * │         │          │          │                             │
 * └─────────┴──────────┴──────────┴─────────────────────────────┘
 * ```
 */
export class Push extends Command {
  public collection = new PushCollection();
  public types = ['ios', 'android'];
  public fsApi: FileApi = new FileApi();
  public rootFolder = `${process.cwd()}/push`;
  public commands: any = {
    add: {
      when: () => {
        return RxFs.exist(this.rootFolder);
      },
      why: () => {
        return this.i18n.FOLDER_NOT_EXIST(this.rootFolder);
      },
      description: 'create a push config',
      vars: {
        name: {
          pos: 0
        }
      }
    },
    list: {
      when: () => {
        return RxFs.exist(this.rootFolder);
      },
      why: () => {
        return this.i18n.FOLDER_NOT_EXIST(this.rootFolder);
      },
      description: this.i18n.LIST_AVAILABLE_CONFIG('push'),
    },
    help: {
      description: this.i18n.LIST_COMMAND('Push')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  constructor() {
    super('push');
  }
  /**
   * simple validation for the most cases
   */
  private _keyValid(value: string, type = 'Name', pattern = Validator.stringPattern): boolean {
    let pass: RegExpMatchArray = value.match(pattern);
    if (!value.length) {
      this.log.error(new Error(this.i18n.NOT_EMPTY(type)));
      return false;
    }

    if (pass) {
      return true;
    } else {
      this.log.error(new Error(this.i18n.NOT_ALLOWED(value, pattern)));
      return false;
    }
  }
  /**
   * provider IOS
   */
  get iosPrompt() {
    return [
      {
        type: 'input',
        name: 'type',
        default: 'APNS',
        message: this.i18n.ENTER_SOMETHING.concat('Type (APNS)'),
        validate: (value: string): boolean => {
          return this._keyValid(value, 'Type');
        }
      },
      {
        type: 'input',
        name: 'certificatFile',

        message: this.i18n.ENTER_SOMETHING.concat('Certificatfile'),
        validate: (value: string): boolean => {
          if (value.indexOf('.p12') === -1) {
            this.log.error(new Error('Certificatfile must end with .p12'));
            return false;
          }
          return this._keyValid(value, 'Certificatfile', Validator.p12Pattern);
        }
      },
      {
        type: 'input',
        name: 'passphrase',
        message: this.i18n.ENTER_SOMETHING.concat('Passphrase'),
        validate: Validator.notEmptyValidate
      }
    ];
  }
  /**
   * provider Android
   */
  get androidPrompt() {
    return [
      {
        type: 'input',
        name: 'type',
        default: 'GCM',
        message: this.i18n.ENTER_SOMETHING.concat('Type (GCM)'),
        validate: (value: string): boolean => {
          return this._keyValid(value, 'Type');
        }
      },
      {
        type: 'input',
        name: 'apiKey',
        message: this.i18n.ENTER_SOMETHING.concat('Api Key'),
        validate: (value: string): boolean => {
          return this._keyValid(value, 'Api Key', Validator.stringNumberCharsPattern);
        }
      }
    ];
  }
  /**
   * ios or android
   */
  _chooseProviderType(): Observable<any> {
    let prompt = {
      type: 'list',
      name: 'pushType',
      message: this.i18n.CHOOSE_LIST('Provider'),
      choices: ['ios', 'android', this.i18n.TAKE_ME_OUT]
    };

    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * you want to add also the other one ?
   */
  _addAnother(name: string) {
    let prompt = {
      type: 'confirm',
      name: 'another',
      message: this.i18n.ADD_ALSO(`Push Provider ${name}`),
      default: true
    };
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }
  /**
   * add Provider
   */
  _addProvider(type: string): any {
    if (!type) {
      return Observable.throw(new Error('Provider need a type'));
    }
    let prompt: Array<any> = type === 'ios' ? this.iosPrompt : this.androidPrompt;
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * shows all available environments
   * @returns Observable
   */
  list() {
    return Observable.create((observer: any) => {
      let content: any = [['']];
      let tableHeader: Array<string> = ['PushConfig Name'];
      this.collection.loadModels().subscribe({
        complete: () => {
          this.collection.pushFiles.forEach((file: { name: string, path: string }) => {
            content.push([chalk.yellow(`${file.name}`)]);
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
   * enter name for new push config
   */
  _enterName(): any {
    let prompt = {
      type: 'input',
      name: 'pushName',
      message: this.i18n.ENTER_SOMETHING.concat('Name'),
      validate: (value: string): boolean => {
        let unique = find(this.collection.pushFiles, { name: value });
        let pass: RegExpMatchArray = value.match(Validator.stringPattern);
        if (!value.length) {
          this.log.error(new Error(this.i18n.NOT_EMPTY('Name')));
          return false;
        }
        if (unique) {
          this.log.error(new Error(this.i18n.ALREADY_EXIST(value, 'Pushconfig')));
          return false;
        }

        if (pass) {
          return true;
        } else {
          this.log.error(new Error(this.i18n.NOT_ALLOWED(value, Validator.stringPattern)));
          return false;
        }
      }
    };
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * create a new push config
   */
  add(name?: string): Observable<any> {
    let model = new PushModel();
    let providers: any = [];
    let lastProvider: string;

    return this._enterName()
      .exhaustMap((answers: { pushName: string }) => {
        model.name = answers.pushName;
        return this._chooseProviderType()
          .filter((provider: { pushType: string }) => {
            return provider.pushType !== this.i18n.TAKE_ME_OUT;
          });
      })
      .exhaustMap((type: { pushType: string }) => {
        lastProvider = type.pushType;
        return this._addProvider(lastProvider)
          .exhaustMap((provider: IOSPush | AndroidPush) => {
            providers.push(provider);
            return this._addAnother(lastProvider === 'ios' ? 'android' : 'ios');
          })
          .exhaustMap((answers: { another: boolean }) => {
            // no one more set stor back
            if (answers.another) {
              return this._addProvider(lastProvider === 'ios' ? 'android' : 'ios');
            }
            return Observable.from([null]);
          });
      })
      .exhaustMap((provider: IOSPush | AndroidPush) => {
        if (provider) {
          providers.push(provider);
        }
        model.path = path.join(this.collection.pushRootFolder, `${model.name}.hjson`);
        model.providers = providers;
        return this.collection.add(model)
          .last()
          .do(() => {
            this.log.info(this.i18n.FILES_WRITTEN(model.name));
          });
      });
  }
}
