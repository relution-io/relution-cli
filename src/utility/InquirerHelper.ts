import * as inquirer from 'inquirer';
import {Observable} from '@reactivex/rxjs';

/**
 * @link https://www.npmjs.com/package/inquirer
 */
export class InquirerHelper {
  /**
   * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/list.js
   */
  list(name:string, choices: Array<string | Object>, question:string): any {
    return inquirer.prompt([
      {
        type: 'rawlist',
        name: name,
        message: question,
        choices: choices
      }
    ]);
  }
}
