import {Observable} from '@reactivex/rxjs';
import {Validator} from './../../utility/Validator';
import {Translation} from './../../utility/Translation';
import {ServerModelRc, ServerModel} from './../../utility/ServerModelRc';
import {findIndex} from 'lodash';
import {UserRc} from './../../utility/UserRc';
import * as inquirer from 'inquirer';
/**
 * add a Server to Config from the UserRc and store it
 */

export class ServerCrud {

  public userRc:UserRc;
  public inquirer:any = inquirer;

  constructor(userRc:UserRc) {
    this.userRc = userRc;
  }
  get addConfig(): Array<Object> {
    return [
      {
        type: 'input',
        name: 'id',
        message: 'Server Name',
        validate: (value: string): any => {
          var pass = value.match(Validator.stringNumberPattern);
          if (pass) {
            return true;
          } else {
            return 'Please enter a valid Server name';
          }
        }
      },
      {
        type: 'input',
        name: 'serverUrl',
        message: 'Enter the server url (http://....)',
        validate: (value: string): any => {
          var pass = value.match(Validator.urlPattern);

          if (pass) {
            return true;
          } else {
            return 'Please enter a valid url';
          }
        }
      },
      {
        type: 'input',
        name: 'userName',
        message: 'Enter your username',
        validate: (value: string) => {
          return Validator.notEmptyValidate(value);
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your Password',
        validate: (value: string) => {
          return Validator.notEmptyValidate(value);
        }
      },
      {
        type: 'confirm',
        name: 'default',
        default: false,
        message: 'Set as Default Server ?'
      }
    ];
  };

  /**
   * toggle all server to default false
   */
  public falseyDefaultServer(){
    this.userRc.server = [];
    this.userRc.config.server.forEach((server:any) => {
      if (server.default) {
        server.default = false;
      }
      this.userRc.server.push(new ServerModelRc(server));
    });
  }
  /**
   * cheack if the server id already exist
   */
  public isUnique(server:ServerModelRc) {
    let isUnique:boolean = true;
    this.userRc.config.server.forEach((cserver:any) => {
      if (cserver.id === server.id) {
        isUnique = false;
      }
    });
    return isUnique;
  }
  /**
   * remove a server from the list
   */
  public removeServer(id:string){
    let pos:number = findIndex(this.userRc.config.server, {id: id});
    if (pos !== -1) {
      this.userRc.config.server.splice(pos,1);
      return this.userRc.updateRcFile();
    }
    throw Error(`${id} not exist!`);
  }
  /**
   * add a server to the config server list.
   */
  addServer(server:ServerModelRc, update:boolean = false):any{
    if (!this.isUnique(server) && !update) {
      throw new Error(`Server ${server.id} already exist please use update!`);
    }

    if (server.default) {
      this.falseyDefaultServer();
    }

    if (update) {
      let pos:number = findIndex(this.userRc.config.server, server.id);
      if (pos) {
        this.userRc.config.server[pos] = server.toJson();
        this.userRc.server[pos] = server.toJson();
      }
    } else {
      this.userRc.server.push(server);
      this.userRc.config.server.push(server.toJson());
    }
    return this.userRc.updateRcFile();
  }


  setDefaults(defaults: ServerModel) {
    let myPrompt:any = this.addConfig;
    myPrompt.forEach((item: any) => {
      console.log(item, defaults);
      item.default = () => { return defaults[item.name] };
      item.message += Translation.PRESS_ENTER;
    });
    return myPrompt;
  }

  createNewServer(id?: string){
    //console.log('addServerPrompt');
    //for testing
    if (!id) {
      this.setDefaults({
        id: id,
        serverUrl: 'https://coredev.com:1234',
        userName: 'pascal',
        password: 'foo',
        default: this.userRc.config.server.length ? false : true
      });
    }

    //set default id
    if (id && id.length && id.match(Validator.stringNumberPattern)) {
      this.addConfig[0]['default'] = () => { return id.trim() };
    }
    return Observable.fromPromise(this.inquirer.prompt(this.addConfig));
  }

  add(params?: Array<string>):any {
    let name: string = '';
    if (params && params.length) {
      name = params[0].trim();
    }
    return Observable.create((observer:any) => {
      this.createNewServer(name).subscribe((answers: ServerModel) => {
        console.log('answers', answers);
        this.addServer(new ServerModelRc(answers)).subscribe(
          () => {
            console.log('done');
            observer.complete();
          }
        );
      });
    });
  }
}
