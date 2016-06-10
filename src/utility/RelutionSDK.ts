import * as Relution from 'relution-sdk';
import {Observable} from '@reactivex/rxjs';
import {ServerModelRc} from './../models/ServerModelRc';

/**
 * initializes the Relution SDK from command line options.
 */
export function initFromArgs(argv: string[] = []) {
  let options: Relution.core.InitOptions = {
    application: 'studio',
    debug: false
  };
  while (argv.length > 0) {
    switch (argv[0]) {
      case '--debug':
        options.debug = true;
        break;
      case '--cd':
        argv.shift();
        process.chdir(argv[0]);
        break;
      default:
        break;
    }
    argv.shift();
  }
  return Relution.core.init(options);
}

/**
 * RelutionSdk
 */
export class RelutionSdk {
  /**
   * login on Relution
   * @link [relution-sdk](https://github.com/relution-io/relution-sdk)
   */
  login(serverModel: ServerModelRc, force?: boolean): Observable<{ user: Relution.security.User }> {
    Relution.init({
      serverUrl: serverModel.serverUrl,
      application: 'studio'
    });

    if (!force) {
      let currentUser:Relution.security.User = Relution.security.getCurrentUser();
      if (currentUser) {
        return Observable.create((observer:any) => {
          observer.next({user: currentUser});
          observer.complete();
        });
      }
    }

    return Observable.fromPromise(Relution.web.login(serverModel, serverModel));
  }
}
