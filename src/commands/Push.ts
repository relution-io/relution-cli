import {Command} from './../utility/Command';
import {FileApi} from './../utility/FileApi';
import {PushCollection, PushModel} from './../collection/PushCollection';
import {Observable} from '@reactivex/rxjs';

export /**
 * Connection
 */
class Push extends Command {
  public collection = new PushCollection();

  public commands: any = {
    add: {
      description: 'create a push config',
      vars: {
        name: {
          pos: 0
        }
      }
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

  _chooseProviderType(): Observable<Object> {
    let prompt = {
      type: 'list',
      name: 'pushType',
      message: this.i18n.CHOOSE_LIST('Provider'),
      choices: ['ios', 'android']
    };
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  _addProvider(){

  }
  /**
   * enter name for new push config
   */
  _enterName(): Observable<Object> {
    let prompt = {
      type: 'input',
      name: 'pushName',
      message: this.i18n.ENTER_SOMETHING.concat('Name')
    };
    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  add(path?: string): Observable<any> {
    let model = new PushModel();
    return this._enterName()
      .exhaustMap((answers: {pushName: string}) => {
        console.log(answers.pushName);
        model.name = answers.pushName;
        return this._chooseProviderType();
      });
  }
}
