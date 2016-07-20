"use strict";
var fs = require('fs');
var _ = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var RxFs_1 = require('./RxFs');
var ServerModelRc_1 = require('./../models/ServerModelRc');
var UserRc = (function () {
    function UserRc() {
        this.server = [];
        this._rcHome = this.getUserHome() + "/." + UserRc.appPrefix + "rc";
    }
    UserRc.prototype.fromJSON = function (params) {
        _.assignWith(this, params, function (objValue, srcValue, key) {
            if (UserRc.attributes.indexOf(key) >= 0) {
                if (key === 'server') {
                    srcValue = srcValue.map(function (server) {
                        return new ServerModelRc_1.ServerModelRc(server);
                    });
                }
                return srcValue;
            }
        });
    };
    UserRc.prototype.toJSON = function () {
        var _this = this;
        var model = {};
        UserRc.attributes.forEach(function (attr) {
            if (attr && _this[attr] !== undefined) {
                model[attr] = _this[attr];
            }
        });
        return model;
    };
    UserRc.prototype.getServer = function (serverIdOrSample) {
        if (_.isString(serverIdOrSample)) {
            serverIdOrSample = {
                id: serverIdOrSample
            };
        }
        return _.find(this.server, serverIdOrSample);
    };
    /**
     * check  if the relutionrc file exist
     */
    UserRc.prototype.rcFileExist = function () {
        if (!RxFs_1.RxFs.exist(this._rcHome)) {
            return this.updateRcFile();
        }
        return rxjs_1.Observable.create(function (observer) {
            observer.next(true);
            observer.complete();
        });
    };
    /**
     * read the relutionrc file
     */
    UserRc.prototype.streamRc = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            /* tslint:disable:no-bitwise */
            return fs.access(_this._rcHome, fs.R_OK | fs.W_OK, function (err) {
                /* tslint:enable:no-bitwise */
                if (err) {
                    observer.error(err);
                }
                return fs.readFile(_this._rcHome, 'utf8', function (error, data) {
                    if (error) {
                        observer.error(error);
                    }
                    _this.fromJSON(JSON.parse(data));
                    observer.next(_this);
                    observer.complete();
                });
            });
        });
    };
    /**
     * the home path form the reluitonrc file
     */
    UserRc.prototype.getUserHome = function () {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    };
    /**
     * logger
     */
    UserRc.prototype.debug = function (line) {
        console.log(JSON.stringify(line, null, 2));
    };
    /**
     * save the config into the rc file as json
     * ```javascript
     * updateRcFile().subscribe((written:boolean) => {console.log(written)});
     * ```
     */
    UserRc.prototype.updateRcFile = function () {
        var _this = this;
        // console.log(this._rcHome, JSON.stringify(this, null, 2));
        return RxFs_1.RxFs.writeFile(this._rcHome, JSON.stringify(this, null, 2))
            .exhaustMap(function () {
            return _this.streamRc();
        });
    };
    UserRc.appPrefix = 'relution';
    UserRc.attributes = ['server'];
    return UserRc;
}());
exports.UserRc = UserRc;
//# sourceMappingURL=UserRc.js.map