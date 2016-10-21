"use strict";
var Translation_1 = require('./Translation');
var lodash_1 = require('lodash');
var Observable_1 = require('@reactivex/rxjs/dist/cjs/Observable');
var Relution = require('relution-sdk');
var chalk = require('chalk');
var pkg = require(__dirname + "/../../package.json");
var isOnline = require('is-online');
var emoji = require('node-emoji');
/**
 *
 */
var NpmVersionCheck = (function () {
    function NpmVersionCheck() {
    }
    /**
     * fetch the APi url http://npmsearch.com/query?q=relution-cli&fields=version,name
     * and filter the version
     */
    NpmVersionCheck._postApi = function () {
        return Observable_1.Observable
            .fromPromise(NpmVersionCheck._web.post(NpmVersionCheck._uri))
            .map(function (resp) {
            // console.log(resp.results, pkg);
            NpmVersionCheck._res = resp;
            return lodash_1.find(resp.results, function (item) {
                return item.name.indexOf(pkg.name) !== -1;
            });
        });
    };
    /**
     * get this package from the search looks like
     */
    NpmVersionCheck._package = function () {
        return NpmVersionCheck._postApi();
    };
    /**
     * simple yes/no
     */
    NpmVersionCheck._versionCheck = function () {
        if (!NpmVersionCheck._pkg) {
            return emoji.emojify(":interrobang: " + Translation_1.Translation.CLI_VERSION_CHECK_FAILED);
        }
        return NpmVersionCheck._pkg.version[0] !== pkg.version ?
            emoji.emojify(":warning: " + chalk.yellow(Translation_1.Translation.CLI_OUTOFDATE(NpmVersionCheck._pkg.version))) :
            emoji.emojify(":clap: " + Translation_1.Translation.CLI_UPTODATE(pkg.version));
    };
    NpmVersionCheck.offline = function () {
        return emoji.emojify(":waxing_crescent_moon: " + Translation_1.Translation.CLI_OFFLINE);
    };
    NpmVersionCheck.check = function () {
        return Observable_1.Observable.create(function (ob) {
            return isOnline(function (e, on) {
                // console.log('wtf', e, on);
                if (!on) {
                    ob.next(NpmVersionCheck.offline());
                    ob.complete();
                }
                if (!NpmVersionCheck._pkg) {
                    // console.log(`no package ${NpmVersionCheck._pkg}`)
                    return NpmVersionCheck._package()
                        .subscribe(function (_pkg) {
                        ob.next(NpmVersionCheck._versionCheck());
                        ob.complete();
                    }, function () {
                        if (!on) {
                            ob.next(NpmVersionCheck.offline()); // https.js throws bad errors
                            ob.complete();
                        }
                        ob.complete();
                    });
                }
                ob.next(NpmVersionCheck._versionCheck());
                ob.complete();
            });
        });
    };
    NpmVersionCheck._web = Relution.web;
    NpmVersionCheck._uri = 'http://npmsearch.com/query?q=relution-cli&fields=version,name';
    NpmVersionCheck._res = { results: [] };
    NpmVersionCheck._pkg = null;
    return NpmVersionCheck;
}());
exports.NpmVersionCheck = NpmVersionCheck;
//# sourceMappingURL=Versioncheck.js.map