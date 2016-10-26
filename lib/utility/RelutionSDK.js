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
        return rxjs_1.Observable.fromPromise(Relution.web.login({
            userName: serverModel.userName,
            password: serverModel.password
        }, serverModel));
    };
    return RelutionSdk;
}());
exports.RelutionSdk = RelutionSdk;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdXRpb25TREsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9SZWx1dGlvblNESy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFHM0M7O0dBRUc7QUFDSCxzQkFBNkIsSUFBbUI7SUFBbkIsb0JBQW1CLEdBQW5CLFNBQW1CO0lBQzlDLElBQUksT0FBTyxHQUE4QjtRQUN2QyxXQUFXLEVBQUUsUUFBUTtRQUNyQixLQUFLLEVBQUUsS0FBSztLQUNiLENBQUM7SUFDRixJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakIsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsS0FBSyxTQUFTO2dCQUNaLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsS0FBSyxDQUFDO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixLQUFLLENBQUM7WUFDUjtnQkFDRSxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNaLEtBQUssQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBQ0Qsd0JBQXdCO0lBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBdkJlLG9CQUFZLGVBdUIzQixDQUFBO0FBRUQ7O0dBRUc7QUFDSDtJQUFBO0lBMkJBLENBQUM7SUExQkM7OztPQUdHO0lBQ0gsMkJBQUssR0FBTCxVQUFNLFdBQTBCLEVBQUUsS0FBZTtRQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ1osU0FBUyxFQUFFLFdBQVcsQ0FBQyxTQUFTO1lBQ2hDLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksYUFBVyxHQUEyQixRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzdFLEVBQUUsQ0FBQyxDQUFDLGFBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQWE7b0JBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ1osSUFBSSxFQUFFLGFBQVc7cUJBQ2xCLENBQUMsQ0FBQztvQkFDSCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDL0MsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRO1lBQzlCLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtTQUMvQixFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQztBQTNCWSxtQkFBVyxjQTJCdkIsQ0FBQSJ9