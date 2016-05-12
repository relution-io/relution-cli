import {Observable} from '@reactivex/rxjs';
import {orderBy, map} from 'lodash';
import {Translation} from './../../utility/Translation';
import {Validator} from './../../utility/Validator';
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
        validate: function (value: string) {
          if (value === 'name') {
            console.log(chalk.red(`\n Key ${value} is a reserved key attribute and cant be overwritten.`));
            return false;
          }
          let pass: any = value.match(Validator.stringPattern);
          if (pass) {
            return true;
          } else {
            console.log(chalk.red(`\n Name ${value} has wrong character allowed only [a-z A-Z]`));
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'value',
        message: Translation.ENTER_SOMETHING.concat('value'),
        validate: function (value: string) {
          let pass: any = value.match(Validator.stringNumberPattern);
          if (pass) {
            return true;
          } else {
            console.log(chalk.red(`\n Name ${value} has wrong character allowed only [a-z A-Z 0-9]`));
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
  store() {
    return Observable.fromPromise(inquirer.prompt(this.prompt()));
  }
  /**
   * Darfs ein bischen mehr sein ?
   */
  addAnother() {
    return Observable.fromPromise(inquirer.prompt(this.addAnotherPrompt()));
  }
}
