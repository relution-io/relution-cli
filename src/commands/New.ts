import {Command} from './../utility/Command';
import {Observable} from '@reactivex/rxjs';
import * as chalk from 'chalk';
import {Translation} from './../utility/Translation';
import {isArray, isString, map} from 'lodash';
import {FileApi} from './../utility/FileApi';
import {Gii} from './../gii/Gii';

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

  constructor(){
    super('new');
  }

  /**
   * @params name a string to create the project
   * @return Observable
   */
  create(name?:string): Observable<any>{
    return Observable.create((observer:any) => {

    })
  }

}
