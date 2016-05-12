"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var fs = require('fs');
var ServerModelRc_1 = require('./../models/ServerModelRc');
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
    /**
     * check  if the relutionrc file exist
     */
    UserRc.prototype.rcFileExist = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            fs.exists(_this._rcHome, function (exists) {
                // console.log('exists', exists);
                if (exists) {
                    observer.next(true);
                    observer.complete();
                }
                else {
                    //create a empty rc file if no one exists
                    _this.config = { server: [] };
                    _this.updateRcFile().subscribe(function () {
                        observer.next(true);
                    }, function (e) {
                        observer.error(e);
                    }, function () {
                        observer.complete();
                    });
                }
            });
        });
    };
    /**
     * read the relutionrc file
     */
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
            _this.setServer();
            return config;
        });
    };
    /**
     * set a collection the server models
     *
     */
    UserRc.prototype.setServer = function () {
        var _this = this;
        this.server = [];
        this.config.server.forEach(function (server, index) {
            var model = new ServerModelRc_1.ServerModelRc(server);
            _this.server.push(model);
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
        return rxjs_1.Observable.create(function (observer) {
            return fs.writeFile(_this._rcHome, JSON.stringify(_this.config, null, 2), function (err) {
                if (err)
                    observer.error(err);
                console.log("." + _this.appPrefix + "rc is written");
                observer.next(true);
                _this.streamRc().subscribe({
                    sucess: _this.setServer,
                    complete: observer.complete()
                });
            });
        });
    };
    return UserRc;
}());
exports.UserRc = UserRc;
//# sourceMappingURL=UserRc.js.map