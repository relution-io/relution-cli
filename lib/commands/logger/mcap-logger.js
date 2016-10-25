"use strict";
var request = require('../util/request.js');
var Q = require('q');
var _ = require('lodash');
var assert = require('assert');
exports.TRACE = 5000;
exports.DEBUG = 10000;
exports.INFO = 20000;
exports.WARN = 30000;
exports.ERROR = 40000;
exports.FATAL = 50000;
var levelFromName = {
    'trace': exports.TRACE,
    'debug': exports.DEBUG,
    'info': exports.INFO,
    'warn': exports.WARN,
    'error': exports.ERROR,
    'fatal': exports.FATAL
};
var McapLogger = (function () {
    function McapLogger(options) {
        // CONST if the longpolling raises an error
        this.LONG_POLLING_ERROR = 'longpollingerror';
        // the server
        this.server = null;
        // the XHR Object for the long polling log
        this.longPollingXhr = null;
        // if is set to true every log will send a long poll call again to wait for the next log - endless loop!
        this.watching = true;
        // the current logger id
        this.loggerId = null;
        // determines if the logger is watching or not
        this._isWatching = false;
        assert(options, 'Missing parameter options');
        assert(options.server, 'Missing parameter options.server');
        if (typeof options.onError !== 'undefined') {
            assert(typeof options.onError === 'function', 'Wrong parameter type: options.onError should be a function');
        }
        if (typeof options.output !== 'undefined') {
            assert(typeof options.output === 'function', 'Wrong parameter type: options.output should be a function');
            this.output = options.output;
        }
        this.server = options.server;
        // Revers API
        this.onError = options.onError || function () { };
    }
    /**
     * The default output - set this via watch options: output
     * @param log
     */
    McapLogger.prototype.output = function (log) {
        console.log('log output', log);
        if (log) {
            Object.keys(log).forEach(function (l) {
                console.log(log[l].message);
            });
        }
    };
    ;
    /**
     * The default output - set this via watch options: output
     * @param log
     */
    McapLogger.prototype.isWatching = function () {
        return this._isWatching;
    };
    ;
    /**
     * Stop the live logger
     */
    McapLogger.prototype.unWatch = function () {
        this.watching = false;
        this._isWatching = false;
        if (this.longPollingXhr) {
            if (typeof this.longPollingXhr.abort === 'function') {
                this.longPollingXhr.abort();
            }
            else {
            }
        }
    };
    ;
    /**
     * Start watching a live logger. Will stop every other live logger before.
     * options:
     * once: only wait until the first log has a response. Do not catch further logs
     * filePath: the path to the mCAP file to watch
     * output: a function the logs are send to - default is console.log
     * name: the name of the logger: default is ''
     * @example
     *
     * McapLogger.watch({
            filePath: 'applications/A1600A9A-249A-45A4-8D02-EA17D7B70805/server/test.js',
            output: function(message){
                console.log(message);
            }
          })
     *
     * @param options
     * @returns {*}
     */
    McapLogger.prototype.watch = function (options) {
        var that = this;
        // resolve if there is already a watch task registered
        if (this.isWatching()) {
            var dfd = Q.defer();
            dfd.resolve();
            return dfd.promise;
        }
        // make sure options are available
        options = options || {};
        // make sure filePath is set
        options.filePath = options.filePath || '';
        // make sure filePath is set
        that.watching = options.once || true;
        that._isWatching = true;
        that.output = typeof options.output === 'function' ? options.output : that.output;
        // get the logger information
        return that.getLoggerInformation(options.name).then(function (loggerInformations) {
            // set the name of the logger should be the same
            var name = loggerInformations.name || options.name;
            var filter = options.filter ? '.' + options.filter : '';
            options.name = name + filter;
            // if the logger information was successful, register the logger
            return that.registerLogger(options);
        }, function (err) {
            var dfd = Q.defer();
            dfd.reject(err);
            return dfd.promise;
        }).then(function (uuid) {
            // register the logger returns the logger uuid
            that.loggerId = uuid;
            // poll for the first output
            return that.poll(uuid);
        }).then(function (log) {
            // if the poll was successfull log the response to the output
            return that._log(log);
        }).catch(function (argument) {
            that.output(argument);
        });
    };
    ;
    /**
     * Logs the response from the logger, if watching is set to true keep watching after the log
     * @param log
     * @returns {*}
     * @private
     */
    McapLogger.prototype._log = function (log) {
        var dfd = Q.defer();
        if (this.watching) {
            this.poll(this.loggerId);
        }
        this.output(log);
        dfd.resolve(log);
        return dfd.promise;
    };
    ;
    /**
     * Requests a logger output to the given logger uuid
     * @param uuid
     * @returns {*}
     */
    McapLogger.prototype.poll = function (uuid) {
        var dfd = Q.defer();
        var that = this;
        // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?uuid=b5ebfda4-54d9-4c5c-8cf7-34ba1aa8a23a
        if (!uuid) {
            dfd.reject('uuid is not set');
        }
        this.longPollingXhr = this._request({
            server: this.server,
            url: 'gofer/system/liveLog?uuid=' + uuid,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        });
        // call the longpolling
        this.longPollingXhr.then(function (log) {
            // log if everything was ok
            that._log(log);
        }).catch(function (err) {
            // call the reverse api
            this.onError(this.LONG_POLLING_ERROR, err);
        });
        dfd.resolve();
        return dfd.promise;
    };
    /**
     * Register the mCAP logger
     * once: only wait until the first log has a response. Do not catch further logs
     * filePath: the path to the mCAP file to watch
     * output: a function the logs are send to - default is console.log
     * name: the name of the logger: default is ''
     * level: the log level: default is 20000
     * Log Level Overview:
     FATAL: 50000
     ERROR: 40000
     WARN: 30000
     INFO: 20000
     DEBUG: 10000
     TRACE: 5000
     *
     * @param options
     * @returns {*}
     */
    McapLogger.prototype.registerLogger = function (options) {
        // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=20000&logger=javascript.applications.D5B31E37-0C67-4F57-BC74-98FF587C0A41.server.app.js
        // https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=undefined&logger=javascript..applications.A1600A9A-249A-45A4-8D02-EA17D7B70805.server.test.js&t=1396607548520
        // if no filePath is set reject the promise
        if (!options || typeof options.filePath === 'undefined') {
            var dfd = Q.defer();
            dfd.reject('filePath is not set');
            return dfd.promise;
        }
        // the mCAP endpoint
        var url = 'gofer/system/liveLog?';
        // the log level
        var level = typeof options.level !== 'undefined' ? McapLogger.resolveLevel(options.level) : exports.TRACE;
        url += 'level=' + level;
        // the name of the logger
        var name = typeof options.name !== 'undefined' ? options.name : '';
        // the file of the logger;
        var filePath = typeof options.filePath !== 'undefined' ? options.filePath : '';
        // build the url
        url += '&logger=' + name + filePath.replace(/\//g, '.');
        // do the register request
        return this._request({
            server: this.server,
            url: url,
            method: 'GET'
        });
    };
    /**
     * Get the logger information to the given name. Default is emptystring
     * @param name
     * @returns {*}
     */
    McapLogger.prototype.getLoggerInformation = function (name) {
        // https://core.dev4.mwaysolutions.com/gofer/loggerConfiguration/rest/logger/loggerConfigurations/javascript?computeDerived=true
        name = typeof name !== 'undefined' ? name : '';
        return this._request({
            server: this.server,
            url: 'gofer/loggerConfiguration/rest/logger/loggerConfigurations/' + name + '?computeDerived=true',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        });
    };
    McapLogger.prototype._request = function (options) {
        var dfd = Q.defer();
        options.headers = options.headers || {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        };
        if (this.auth) {
            options.auth = this.auth;
        }
        request.request(options, function (error, response, body) {
            if (error) {
                dfd.reject(error);
                return;
            }
            var data = body;
            try {
                data = JSON.parse(body);
            }
            catch (e) {
            }
            dfd.resolve(data);
        });
        return dfd.promise;
    };
    ;
    /**
   * Resolve a level number, name (upper or lowercase) to a level number value.
   */
    McapLogger.resolveLevel = function (nameOrNum) {
        if (typeof nameOrNum === 'string') {
            return levelFromName[nameOrNum.toLowerCase()] || exports.TRACE;
        }
        else {
            return nameOrNum;
        }
    };
    /**
     * Resolve a level string, name (upper or lowercase) to a level number value.
     */
    McapLogger.getNameFromLevel = function (num) {
        return _.invert(levelFromName)[num];
    };
    return McapLogger;
}());
exports.McapLogger = McapLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNhcC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvbG9nZ2VyL21jYXAtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM5QyxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVwQixhQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2IsYUFBSyxHQUFHLEtBQUssQ0FBQztBQUNkLFlBQUksR0FBRyxLQUFLLENBQUM7QUFDYixZQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2IsYUFBSyxHQUFHLEtBQUssQ0FBQztBQUNkLGFBQUssR0FBRyxLQUFLLENBQUM7QUFFM0IsSUFBTSxhQUFhLEdBQUc7SUFDcEIsT0FBTyxFQUFFLGFBQUs7SUFDZCxPQUFPLEVBQUUsYUFBSztJQUNkLE1BQU0sRUFBRSxZQUFJO0lBQ1osTUFBTSxFQUFFLFlBQUk7SUFDWixPQUFPLEVBQUUsYUFBSztJQUNkLE9BQU8sRUFBRSxhQUFLO0NBQ2YsQ0FBQztBQUdGO0lBZUUsb0JBQVksT0FBWTtRQWR4QiwyQ0FBMkM7UUFDcEMsdUJBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDL0MsYUFBYTtRQUNOLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFFMUIsMENBQTBDO1FBQ25DLG1CQUFjLEdBQVEsSUFBSSxDQUFDO1FBRWxDLHdHQUF3RztRQUNqRyxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLHdCQUF3QjtRQUNqQixhQUFRLEdBQVEsSUFBSSxDQUFDO1FBQzVCLDhDQUE4QztRQUN0QyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUVuQyxNQUFNLENBQUMsT0FB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