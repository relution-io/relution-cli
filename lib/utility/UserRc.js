"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var fs = require('fs');
var ServerModelRc_1 = require('./ServerModelRc');
var UserRc = (function () {
    function UserRc() {
        this.appPrefix = 'relution';
        this.server = [];
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
            // console.log('this.server', this.server);
            config.server.forEach(function (server, index) {
                var model = new ServerModelRc_1.ServerModelRc(server);
                _this.server.push(model);
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
    UserRc.prototype.falseyDefaultServer = function () {
        var _this = this;
        this.server = [];
        this.config.server.forEach(function (server) {
            if (server.default) {
                server.default = false;
            }
            _this.server.push(new ServerModelRc_1.ServerModelRc(server));
        });
    };
    UserRc.prototype.isUnique = function (server) {
        var isUnique = true;
        this.config.server.forEach(function (cserver) {
            if (cserver.id === server.id) {
                isUnique = false;
            }
        });
        return isUnique;
    };
    UserRc.prototype.addServer = function (server) {
        if (this.isUnique(server)) {
            if (server.default) {
                this.falseyDefaultServer();
            }
            this.server.push(server);
            this.config.server.push(server.toJson());
            return this.updateRcFile();
        }
        throw new Error("Server " + server.id + " already exist please use update!");
    };
    UserRc.prototype.updateRcFile = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            return fs.writeFile(_this._rcHome, JSON.stringify(_this.config, null, 2), function (err) {
                if (err)
                    observer.error(err);
                console.log("." + _this.appPrefix + "rc is written");
                observer.next(true);
                observer.complete();
            });
        });
    };
    return UserRc;
}());
exports.UserRc = UserRc;
//# sourceMappingURL=UserRc.js.map