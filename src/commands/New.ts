import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import {Translation} from './../utility/Translation';
import {isArray, isString, map} from 'lodash';
import {FileApi} from './../utility/FileApi';
import {Gii} from './../gii/Gii';
import {Create} from './new/Create';
const figures = require('figures');

/**
 * create a new Baas for the Developer
 */
export class New extends Command {

  public commands:any = {
    create: {
      description: 'create a new Baas Backend',
      vars:{
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: Translation.LIST_COMMAND('New')
    },
    quit: {
      description: 'Exit To Home'
    }
  };



  private _create:Create = new Create();

  constructor(){
    super('new');
  }

  /**
   * @params name a string to create the project
   * @return Observable
   */
  create(name?:string): Observable<any>{

    return Observable.create((observer:any) => {
      this._create.publish().subscribe(
        (status:any) => {
          console.log(chalk.green(`${status.name} is still generated ${chalk.green(figures.tick) }`));
        },
        (e:any) => console.error(e),
        () => {

          observer.complete()
        }
      );
    });
  }

}
