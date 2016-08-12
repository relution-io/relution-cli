"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Relution = require('relution-sdk');
var LEVEL;
(function (LEVEL) {
    LEVEL.TRACE = 5000;
    LEVEL.DEBUG = 10000;
    LEVEL.INFO = 20000;
    LEVEL.WARN = 30000;
    LEVEL.ERROR = 40000;
    LEVEL.FATAL = 50000;
})(LEVEL = exports.LEVEL || (exports.LEVEL = {}));
;
var LoggerHelper = (function () {
    function LoggerHelper(appUUid, serverRc) {
        this.appUUid = appUUid;
        this.serverRc = serverRc;
        this.abort = false;
    }
    LoggerHelper.jsAppParam = function (uuid) {
        return "" + LoggerHelper.JS_APP + uuid;
    };
    /**
     * fetch live log appender from relution server
     */
    LoggerHelper.prototype.fetchlogs = function (uuid, level, filter) {
        // gofer/system/liveLog
        var url = LoggerHelper.logUrl;
        url += "uuid=" + uuid;
        url += "&level=" + (level || LEVEL.TRACE);
        // console.log('url fetchlogs', url);
        return Relution.web.ajax({
            method: 'GET',
            url: url
        });
    };
    /**
     * register Logger on Relution server and get a uuid for the log session back
     */
    LoggerHelper.prototype.registerLogger = function () {
        var url = LoggerHelper.logUrl;
        url.concat("logger=" + LoggerHelper.jsAppParam(this.appUUid));
        return rxjs_1.Observable.fromPromise(Relution.web.ajax({ method: 'GET', url: url }));
    };
    LoggerHelper.JS_APP = "javascript.applications.";
    LoggerHelper.logUrl = '/gofer/system/liveLog?';
    return LoggerHelper;
}());
exports.LoggerHelper = LoggerHelper;
//# sourceMappingURL=LoggerHelper.js.map