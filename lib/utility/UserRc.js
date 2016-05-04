"use strict";
exports.assign = Object.assign ? Object.assign : function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return;
};
var rxjs_1 = require('@reactivex/rxjs');
var fs = require('fs');
var ServerModelRc_1 = require('./ServerModelRc');
var UserRc = (function () {
    function UserRc() {
        this.appPrefix = 'relution';
        this._rcHome = this.getUserHome() + "/." + this.appPrefix + "rc";
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
        }).map(function (config) {
            config.server.forEach(function (server, index) {
                var model = new ServerModelRc_1.ServerModelRc(server);
                config.server[index] = model;
                console.log(config.server[index].id);
            });
            return config;
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