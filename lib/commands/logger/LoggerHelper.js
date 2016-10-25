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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VySGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2xvZ2dlci9Mb2dnZXJIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHFCQUFtQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JELElBQVksUUFBUSxXQUFNLGNBQWMsQ0FBQyxDQUFBO0FBRXpDLElBQWlCLEtBQUssQ0FPckI7QUFQRCxXQUFpQixLQUFLLEVBQUMsQ0FBQztJQUNULFdBQUssR0FBRyxJQUFJLENBQUM7SUFDYixXQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2QsVUFBSSxHQUFHLEtBQUssQ0FBQztJQUNiLFVBQUksR0FBRyxLQUFLLENBQUM7SUFDYixXQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2QsV0FBSyxHQUFHLEtBQUssQ0FBQztBQUM3QixDQUFDLEVBUGdCLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQU9yQjtBQUFBLENBQUM7QUFFRjtJQUtFLHNCQUFtQixPQUFlLEVBQVMsUUFBdUI7UUFBL0MsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWU7UUFGM0QsVUFBSyxHQUFHLEtBQUssQ0FBQztJQUVnRCxDQUFDO0lBRXhELHVCQUFVLEdBQXhCLFVBQXlCLElBQVk7UUFDbkMsTUFBTSxDQUFDLEtBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFNLENBQUM7SUFDekMsQ0FBQztJQUNEOztPQUVHO0lBQ0ksZ0NBQVMsR0FBaEIsVUFBaUIsSUFBWSxFQUFFLEtBQWMsRUFBRSxNQUFlO1FBQzVELHVCQUF1QjtRQUN2QixJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQzlCLEdBQUcsSUFBSSxVQUFRLElBQU0sQ0FBQztRQUN0QixHQUFHLElBQUksYUFBVSxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBRSxDQUFDO1FBQ3hDLHFDQUFxQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQ3RCO1lBQ0UsTUFBTSxFQUFFLEtBQUs7WUFDYixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRDs7T0FFRztJQUNJLHFDQUFjLEdBQXJCO1FBQ0UsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVUsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFHLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQS9CYSxtQkFBTSxHQUFHLDBCQUEwQixDQUFDO0lBQ3BDLG1CQUFNLEdBQUcsd0JBQXdCLENBQUM7SUErQmxELG1CQUFDO0FBQUQsQ0FBQyxBQWpDRCxJQWlDQztBQWpDWSxvQkFBWSxlQWlDeEIsQ0FBQSJ9