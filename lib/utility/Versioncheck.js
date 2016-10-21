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
        return Observable_1.Observable.create(function (ob) {
            NpmVersionCheck._postApi().subscribe(function (resp) {
                NpmVersionCheck._pkg = resp;
                // console.log('package', resp);
                ob.next(resp);
            }, function (e) {
                ob.next({ name: pkg.name, version: pkg.version });
            });
        });
    };
    /**
     * simple yes/no
     */
    NpmVersionCheck._versionCheck = function () {
        // console.log('check version', NpmVersionCheck._pkg.version[0] !== pkg.version ? `Version is outdated please update to ${NpmVersionCheck._pkg.version}` : '');
        return NpmVersionCheck._pkg.version[0] !== pkg.version ?
            emoji.emojify(":warning: " + chalk.yellow(Translation_1.Translation.CLI_OUTDATED(NpmVersionCheck._pkg.version))) :
            emoji.emojify(":rocket: " + Translation_1.Translation.CLI_UPTODATE(pkg.version));
    };
    NpmVersionCheck.check = function () {
        // isOnline((e: any, on: any) => {
        //   console.log(e, on);
        // });
        // return Observable.empty();
        return Observable_1.Observable.create(function (ob) {
            var _isOnline = Observable_1.Observable.bindCallback(isOnline);
            var scriber = _isOnline();
            return scriber.subscribe(function (online) {
                if (online.length && !online[0] && online[2] === false) {
                    ob.next(emoji.emojify(":waxing_crescent_moon: " + Translation_1.Translation.CLI_OFFLINE));
                    return ob.complete();
                }
                // console.log('online', online);
                if (!NpmVersionCheck._pkg) {
                    // console.log(`no package ${NpmVersionCheck._pkg}`)
                    return NpmVersionCheck._package().subscribe(function (_pkg) {
                        console.log("package", NpmVersionCheck._pkg);
                        ob.next(NpmVersionCheck._versionCheck());
                        ob.complete();
                    });
                }
                ob.next(NpmVersionCheck._versionCheck());
                ob.complete();
            }, function (e) {
                // console.log('offline', e);
                ob.next(emoji.emojify(":waxing_crescent_moon: " + Translation_1.Translation.CLI_OFFLINE));
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