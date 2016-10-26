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
            var fsConstants = fs.constants || fs; // node 4 (LTS) compatibility
            return fs.access(_this._rcHome, fsConstants.R_OK | fsConstants.W_OK, function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclJjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdHkvVXNlclJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUU1QixxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyxxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFFNUIsOEJBQW9ELDJCQUEyQixDQUFDLENBQUE7QUFFaEY7SUFTRTtRQUpPLFdBQU0sR0FBeUIsRUFBRSxDQUFDO1FBS3ZDLElBQUksQ0FBQyxPQUFPLEdBQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFLLE1BQU0sQ0FBQyxTQUFTLE9BQUksQ0FBQztJQUNoRSxDQUFDO0lBRU0seUJBQVEsR0FBZixVQUFnQixNQUFXO1FBQ3pCLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFDLFFBQWEsRUFBRSxRQUFhLEVBQUUsR0FBVztZQUNuRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDckIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUE4Qjt3QkFDckQsTUFBTSxDQUFDLElBQUksNkJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDbkMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2xCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSx1QkFBTSxHQUFiO1FBQUEsaUJBUUM7UUFQQyxJQUFJLEtBQUssR0FBUSxFQUFFLENBQUM7UUFDcEIsTUFB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