"use strict";
var Relution = require('relution-sdk');
var rxjs_1 = require('@reactivex/rxjs');
var RelutionSdk = (function () {
    function RelutionSdk() {
    }
    /**
     * login on Relution
     * @link [relution-sdk](https://github.com/relution-io/relution-sdk)
     */
    RelutionSdk.prototype.login = function (serverModel, force) {
        Relution.init({
            serverUrl: serverModel.serverUrl,
            application: 'studio'
        });
        if (!force) {
            var currentUser_1 = Relution.security.getCurrentUser();
            if (currentUser_1) {
                return rxjs_1.Observable.create(function (observer) {
                    observer.next({ user: currentUser_1 });
                    observer.complete();
                });
            }
        }
        return rxjs_1.Observable.fromPromise(Relution.web.login(serverModel, serverModel));
    };
    return RelutionSdk;
}());
exports.RelutionSdk = RelutionSdk;
//# sourceMappingURL=RelutionSDK.js.map