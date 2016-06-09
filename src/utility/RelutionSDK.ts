import * as Relution from 'relution-sdk';
import {Observable} from '@reactivex/rxjs';
import {ServerModelRc} from './../models/ServerModelRc';

export /**
 * RelutionSdk
 */
  class RelutionSdk {
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
