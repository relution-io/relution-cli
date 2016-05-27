import {Observable} from '@reactivex/rxjs';
import {orderBy, map} from 'lodash';
import {Translation} from './../../utility/Translation';
import {Validator} from './../../utility/Validator';
import {DebugLog} from './../../utility/DebugLog';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';

export class AddAttribute {
  private _store: Array<any> = [];
  /**
   * @param promptName return the key from the prompt
   */
  public promptName: string = 'envattribute';
  /**
     * @param promptName return the key from the prompt
     */
  public addPromptName: string = 'another';

  prompt(): any {
    return [
      {
        type: 'input',
        name: 'key',
        message: Translation.ENTER_SOMETHING.concat('key'),
        validate: (value: string):boolean =>  {
          if (value === 'name') {
            DebugLog.error(new Error(`\n Key ${value} is a reserved key attribute and cant be overwritten.`));
            return false;
          }
          let pass: RegExpMatchArray = value.match(Validator.stringPattern);
          if (pass) {
            return true;
          } else {
            DebugLog.error(new Error(Translation.NOT_ALLOWED(value, Validator.stringPattern)));
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'value',
        message: Translation.ENTER_SOMETHING.concat('value'),
        validate: (value: string):boolean => {
          let pass: RegExpMatchArray = value.match(Validator.stringNumberPattern);
          if (pass) {
            return true;
          } else {
            DebugLog.error(new Error(Translation.NOT_ALLOWED(value, Validator.stringNumberPattern)));
            return false;
          }
        }
      }
    ];
  }

  addAnotherPrompt() {
    let prompt: Array<any> = [
      {
        type: 'confirm',
        name: this.addPromptName,
        default: false,
        message: 'Add one more ?'
      }
    ];
    return prompt;
  }
  /**
   * create a key value question prompt
   */
  store(): Observable<any> {
    return Observable.fromPromise(inquirer.prompt(this.prompt()));
  }
  /**
   * Darfs ein bischen mehr sein ?
   */
  addAnother():Observable<any> {
    return Observable.fromPromise(inquirer.prompt(this.addAnotherPrompt()));
  }
}
