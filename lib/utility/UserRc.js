"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var fs = require('fs');
var UserRc = (function () {
    function UserRc() {
        this.appPrefix = 'relution';
        this._rcHome = this.getUserHome() + "/." + this.appPrefix + "rc";
        this.debug(this);
    }
    Object.defineProperty(UserRc.prototype, "rc", {
        get: function () {
            return this.rc;
        },
        set: function (v) {
            this.rc = v;
        },
        enumerable: true,
        configurable: true
    });
    UserRc.prototype.rcFileExist = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            fs.exists(_this._rcHome, function (exists) {
                if (!exists) {
                    observer.next(false);
                }
                else {
                    console.log(_this._rcHome + " available");
                    observer.next(true);
                }
                observer.complete();
            });
        });
    };
    UserRc.prototype.streamRc = function () {
        var _this = this;
        var self = this;
        return rxjs_1.Observable.create(function (observer) {
            return fs.access(_this._rcHome, fs.R_OK | fs.W_OK, function (err) {
                if (err) {
                    observer.error(err);
                }
                return fs.readFile(_this._rcHome, 'utf8', function (err, data) {
                    if (err) {
                        observer.error(err);
                    }
                    _this.config = JSON.parse(data);
                    observer.next(_this.config);
                    observer.complete();
                });
            });
        });
    };
    UserRc.prototype.getUserHome = function () {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    };
    UserRc.prototype.debug = function (line) {
        console.log(JSON.stringify(line, null, 2));
    };
    return UserRc;
}());
exports.UserRc = UserRc;
//# sourceMappingURL=UserRc.js.map