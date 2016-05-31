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
    RelutionSdk.prototype.login = function (serverModel) {
        Relution.init({
            serverUrl: serverModel.serverUrl,
            application: 'studio'
        });
        var currentUser = Relution.security.getCurrentUser();
        if (currentUser) {
            return rxjs_1.Observable.create(function (observer) {
                observer.next({ user: currentUser });
                observer.complete();
            });
        }
        var credentials = {
            userName: serverModel.userName,
            password: serverModel.password
        };
        return rxjs_1.Observable.fromPromise(Relution.web.login(credentials));
    };
    return RelutionSdk;
}());
exports.RelutionSdk = RelutionSdk;
//# sourceMappingURL=RelutionSDK.js.map