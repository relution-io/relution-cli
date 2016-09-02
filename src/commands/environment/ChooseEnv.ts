import {Observable} from '@reactivex/rxjs';
import {EnvCollection} from './../../collection/EnvCollection';
import {Translation} from './../../utility/Translation';
import {orderBy, map} from 'lodash';
import * as inquirer from 'inquirer';

export class ChooseEnv {
  /**
   * @param _collection the Environment Collection
   */
  private _envCollection: EnvCollection;
  /**
   * @param promptName return the key from the prompt
   */
  public promptName: string = 'env';
  public promptType = 'checkbox';
  public message: string;

  constructor(envCollection: EnvCollection) {
    this._envCollection = envCollection;
    // console.log('this.envCollection', this.envCollection);
  }
  public prompt(choices: Array<{ name: string, checked: boolean }>): Array<any> {
    return [
      {
        type: this.promptType,
        message: this.message,
        name: this.promptName,
        choices: this.choices,
        validate: (answer: Array<string>): any => {
          if (answer.length < 1) {
            return Translation.YOU_MUST_CHOOSE('environment');
          }
          return true;
        }
      }
    ];
  }
  /**
   * @return Observable
   */
  choose(type = 'checkbox', message: string = Translation.SELECT('Environment/s')): any {
    this.promptType = type;
    this.message = message;
    return Observable.fromPromise(inquirer.prompt(this.prompt(this.choices)));
  }

  get choices(): Array<{ name: string, checked: boolean }> {
    let orderedNames: any = map(orderBy(this.envCollection.collection, ['name'], ['asc']), 'name');
    let choices: Array<{ name: string, checked: boolean }> = [];

    orderedNames.forEach((env: string) => {
      choices.push({
        name: env,
        checked: this.promptType === 'checkbox' ? true : false
      });
    });

    choices.push({
      name: Translation.CANCEL,
      checked: false
    });
    return choices;
  }
  /**
   * @return EnvCollection
   */
  public get envCollection(): EnvCollection {
    return this._envCollection;
  }

  public set envCollection(v: EnvCollection) {
    this._envCollection = v;
  }
}
