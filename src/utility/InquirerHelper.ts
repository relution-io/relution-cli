import * as inquirer from 'inquirer';
import {Observable} from '@reactivex/rxjs';

/**
 * @link https://www.npmjs.com/package/inquirer
 */
export class InquHelper {

  list(name:string, choices: Array<string | Object>, question:string): Observable<string> {
    return Observable.create((observer: any) => {
      inquirer.prompt([
        {
          type: 'list',
          name: name,
          message: question,
          choices: choices
        }
      ]).then(function (answers) {
        observer.next(answers);
        observer.complete();
      });
    });
  }
}
