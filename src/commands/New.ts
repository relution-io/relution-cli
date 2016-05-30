import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
import {FileApi} from './../utility/FileApi';
import {Create} from './new/Create';

/**
 * create a new Baas for the Developer
 */
export class New extends Command {

  public commands: any = {
    create: {
      description: this.i18n.NEW_CREATE,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.LIST_COMMAND('New')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };
  private _fsApi: FileApi = new FileApi();
  private _create: Create = new Create();

  constructor() {
    super('new');
  }

  /**
   * @params name a string to create the project
   * @return Observable
   */
  create(name?: string): Observable<any> {
    let files: Array<any> = [];
    return Observable.create((observer: any) => {
      this._fsApi.fileList(process.cwd()).subscribe({
        next: (file: any) => {
          files.push(file);
        },
        complete: () => {
          if (!files.length) {
            this._create.publish().subscribe(
              (resp: any) => { observer.next(resp); },
              (e: Error) => observer.error(e),
              () => { observer.complete(); }
            );
          } else {
            observer.error(new Error(this.i18n.FOLDER_NOT_EMPTY(process.cwd())));
            observer.complete();
          }
        }
      });
    });
  }

}
