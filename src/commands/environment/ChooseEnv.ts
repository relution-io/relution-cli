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
   * @return Observable
   */
  prompt():any {
    let choices:any = map(orderBy(this.envCollection.collection,['name'], ['asc']), 'name');
    choices.push(Translation.TAKE_ME_OUT);

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

  choose(){
    return Observable.fromPromise(inquirer.prompt(this.prompt()));
  }

  public get envCollection() : EnvCollection {
    return this._envCollection;
  }

  public set envCollection(v : EnvCollection) {
    this._envCollection = v;
  }
}
