import {Observable} from '@reactivex/rxjs';
import {EnvCollection} from './../../collection/EnvCollection';
import {Translation} from './../../utility/Translation';
import {orderBy, map} from 'lodash';
import * as inquirer from 'inquirer';

export class ChooseEnv{
  /**
   * @param _collection the Environment Collection
   */
  private _envCollection : EnvCollection;
  /**
   * @param promptName return the key from the prompt
   */
  public promptName:string = 'env';

  constructor(envCollection: EnvCollection) {
    this.envCollection = envCollection;
  }

  /**
   * @return Array<any>
   */
  prompt():any {
    let orderedNames:any = map(orderBy(this.envCollection.collection,['name'], ['asc']), 'name');
    let choices:Array<{name:string, checked:boolean}> = [];

    orderedNames.forEach((env:string) => {
      choices.push({
        name: env,
        checked: true
      });
    });

    choices.push({
      name: Translation.TAKE_ME_OUT,
      checked: false
    });

    let prompt:Array<any>  = [
      {
        type: 'checkbox',
        message: 'Select Environment/s',
        name: this.promptName,
        choices: choices,
        validate: (answer: Array<string>): any => {
          if (answer.length < 1) {
            return 'You must choose at least one environment.';
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
  choose(){
    return Observable.fromPromise(inquirer.prompt(this.prompt()));
  }
  /**
   * @return EnvCollection
   */
  public get envCollection() : EnvCollection {
    return this._envCollection;
  }

  public set envCollection(v : EnvCollection) {
    this._envCollection = v;
  }
}
