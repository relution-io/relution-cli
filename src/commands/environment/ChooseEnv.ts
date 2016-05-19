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

  constructor(envCollection: EnvCollection) {
    this.envCollection = envCollection;
  }

  /**
   * @return Array<any>
   */
  prompt(type: string = 'checkbox', message: string = Translation.SELECT('Environment/s')): any {
    let orderedNames: any = map(orderBy(this.envCollection.collection, ['name'], ['asc']), 'name');
    let choices: Array<{ name: string, checked: boolean }> = [];

    orderedNames.forEach((env: string) => {
      choices.push({
        name: env,
        checked: type === 'checkbox' ? true : false
      });
    });

    choices.push({
      name: Translation.TAKE_ME_OUT,
      checked: false
    });

    let prompt: Array<any> = [
      {
        type: type,
        message: message,
        name: this.promptName,
        choices: choices,
        validate: (answer: Array<string>): any => {
          if (answer.length < 1) {
            return Translation.YOU_MOUST_CHOOSE('environment');
          }
          return true;
        }
      }
    ];
    return prompt;
  }
  /**
   * @return Observable
   */
  choose(type: string = 'checkbox', message: string = Translation.SELECT('Environment/s')) {
    return Observable.fromPromise(inquirer.prompt(this.prompt(type, message)));
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
