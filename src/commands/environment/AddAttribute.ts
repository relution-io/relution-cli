import {Observable} from '@reactivex/rxjs';
import {Translation} from './../../utility/Translation';
import {Validator} from './../../utility/Validator';
import {DebugLog} from './../../utility/DebugLog';
import * as inquirer from 'inquirer';

export class AddAttribute {
  /**
   * @param promptName return the key from the prompt
   */
  public promptName: string = 'envattribute';
  /**
     * @param promptName return the key from the prompt
     */
  public addPromptName: string = 'another';
  /**
   * create a key value question prompt
   * @return Observable
   */
  store(): any {
    let prompt = [
      {
        type: 'input',
        name: 'key',
        message: Translation.ENTER_SOMETHING.concat('key'),
        validate: (value: string): boolean => {
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
        validate: (value: string): boolean => {
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
    return Observable.fromPromise(<any>inquirer.prompt(prompt));
  }
  /**
   * add another value ? y/n
   * @return Observable
   */
  addAnother(): Observable<any> {
    let prompt = [
      {
        type: 'confirm',
        name: this.addPromptName,
        default: false,
        message: 'Add one more ?'
      }
    ];
    return Observable.fromPromise(<any>inquirer.prompt(prompt));
  }
}
