import {Command} from './../utility/Command';
import * as chalk from 'chalk';
import {find, findIndex} from 'lodash';
import {Observable} from '@reactivex/rxjs';
import {ServerModelRc, ServerModel} from './../models/ServerModelRc';
import * as Relution from 'relution-sdk';

/**
 * create a new Baas for the Developer
 */
export class Deploy extends Command {
  constructor(){
    super('deploy');
  }
  private _deployServer:ServerModel;
  private _promptkey:string = 'deployserver';
  private _defaultServer:string = 'default';

  public commands: any = {
    publish: {
      description: this.i18n.DEPLOY,
      vars: {
        name: {
          pos: 0
        }
      }
    },
    help: {
      description: this.i18n.LIST_COMMAND('Deploy')
    },
    quit: {
      description: this.i18n.EXIT_TO_HOME
    }
  };

  loginRelution(choosedServer:ServerModelRc) {
      Relution.init({
        serverUrl: choosedServer.serverUrl
      });
      console.log(JSON.stringify(Relution, null, 2))
  // let credentials: Relution.LoginObject = {
  //    userName: 'myusername',
  //    password: 'mypassword'
  // };
  }

  getServerPrompt():Observable<any> {
    let prompt = this._parent.staticCommands.server.crudHelper.serverListPrompt(this._promptkey, 'list', 'Select a Server');
    let indexDefault: number = findIndex(this.userRc.config.server, {default: true});
    console.log(indexDefault);
    console.log(prompt[0].choices);
    if (indexDefault > -1) {
      this._defaultServer += ` ${prompt[0].choices[indexDefault]}`
      prompt[0].choices.splice(indexDefault, 1, this._defaultServer);
      console.log(prompt[0].choices);
    }

    return Observable.fromPromise(this.inquirer.prompt(prompt));
  }

  /**
   * deploy the baas to the server
   */
  public publish():Observable<any>{
    return Observable.create(
      (observer:any) => {
        this.getServerPrompt().subscribe(
          (answers:any) => {
            let choosedServer = answers[this._promptkey];
            if (choosedServer === this.i18n.TAKE_ME_OUT) {
              return observer.complete();
            }

            if (choosedServer === this._defaultServer) {
              console.log(this.userRc.config.server);
              choosedServer = find(this.userRc.config.server, {default: true});
            }

            this.loginRelution(choosedServer);
            console.log(choosedServer);
          }
        )
      }
    );
  }
}
