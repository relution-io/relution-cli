"use strict";
var Relution = require('relution-sdk');
var rxjs_1 = require('@reactivex/rxjs');
/**
 * initializes the Relution SDK from command line options.
 */
function initFromArgs(argv) {
    if (argv === void 0) { argv = []; }
    var options = {
        application: 'studio',
        debug: false
    };
    var done = false;
    while (!done && argv.length > 0) {
        switch (argv[0]) {
            case '--debug':
                options.debug = true;
                argv.shift();
                break;
            case '--cd':
                process.chdir(argv[1]);
                argv.splice(0, 2);
                break;
            default:
                done = true;
                break;
        }
    }
    // console.log(options);
    return Relution.core.init(options);
}
exports.initFromArgs = initFromArgs;
/**
 * RelutionSdk
 */
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
                    observer.next({
                        user: currentUser_1
                    });
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