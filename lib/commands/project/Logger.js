"use strict";
var os = require('os');
var path = require('path');
var Relution = require('relution-sdk');
var lodash_1 = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var Deploy_1 = require('./../project/Deploy');
var FileApi_1 = require('../../utility/FileApi');
var LoggerHelper_1 = require('./../logger/LoggerHelper');
var DebugLog_1 = require('../../utility/DebugLog');
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var Logger = (function () {
    function Logger(owner) {
        this._fileApi = new FileApi_1.FileApi();
        this._state = 'cli';
        this._debuglog = DebugLog_1.DebugLog;
        this._owner = owner;
        this._userRc = owner.userRc;
        this._i18n = owner.i18n;
        this._relutionSDK = owner.relutionSDK;
        this._debuglog = owner.debuglog;
        this._inquirer = owner.inquirer;
        this._deployCommand = new Deploy_1.Deploy(owner);
    }
    /**
     * open a screen on os sytems nice !
     */
    Logger.prototype._openLogView = function () {
        this._screen = blessed.screen();
        this._grid = new contrib.grid({ rows: 12, cols: 12, screen: this._screen });
        this.termLog = this._grid.set(0, 0, 4, 12, contrib.log, {
            fg: 'green',
            label: "Server Log " + this.choosedServer.id + " " + this.choosedServer.serverUrl,
            height: '40%',
            tags: true,
            xLabelPadding: 3,
            xPadding: 5,
            interactive: false,
            bufferLength: 40,
            columnSpacing: 10,
            border: {
                type: 'none'
            }
        });
        this._screen.render();
    };
    /**
     * register Logger on server with the prompts
     */
    Logger.prototype._registerLogger = function () {
        var _this = this;
        return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
            .mergeMap(function (relutionHjson) {
            _this._relutionHjson = relutionHjson.data;
            return _this._deployCommand.getServerPrompt();
        })
            .filter(function (server) {
            return server.deployserver !== _this._i18n.CANCEL;
        }).mergeMap(function (server) {
            if (server.deployserver.toString().trim() === _this._deployCommand.defaultServer.trim()) {
                _this.choosedServer = lodash_1.find(_this._userRc.server, { default: true });
            }
            else {
                _this.choosedServer = lodash_1.find(_this._userRc.server, { id: server.deployserver });
            }
            return _this._relutionSDK.login(_this.choosedServer);
        })
            .mergeMap(function () {
            return _this._chooseLevel();
        })
            .mergeMap(function (level) {
            _this.choosedLevel = LoggerHelper_1.LEVEL[level];
            Relution.debug.info(_this.choosedServer.userName + " logged in on " + _this.choosedServer.serverUrl);
            _this._log = new LoggerHelper_1.LoggerHelper(_this._relutionHjson.uuid, _this.choosedServer);
            return _this._log.registerLogger();
        });
    };
    /**
     * choose a level
     */
    Logger.prototype._chooseLevel = function () {
        var questions = {
            name: 'level',
            message: 'Please choose the log Level first',
            type: 'list',
            choices: Object.keys(LoggerHelper_1.LEVEL).map(function (lev) {
                return {
                    name: lev.toLowerCase(),
                    value: lev
                };
            }),
            filter: function (str) {
                return str;
            }
        };
        return rxjs_1.Observable.fromPromise(this._inquirer.prompt(questions));
    };
    /**
     * return the level by  number as a string
     */
    Logger.prototype._getLevelName = function (level) {
        var name = '';
        Object.keys(LoggerHelper_1.LEVEL).forEach(function (key) {
            if (LoggerHelper_1.LEVEL[key] === level) {
                name = key;
            }
        });
        return name;
    };
    /**
     * return the bgColor by level
     */
    Logger.prototype._getLevelColor = function (level) {
        switch (level) {
            default:
            case LoggerHelper_1.LEVEL.TRACE:
                return 'bgBlue';
            case LoggerHelper_1.LEVEL.ERROR:
                return 'bgRed';
            case LoggerHelper_1.LEVEL.WARN:
                return 'bgYellow';
            case LoggerHelper_1.LEVEL.FATAL:
                return 'bgMagenta';
            case LoggerHelper_1.LEVEL.DEBUG:
                return 'bgCyan';
        }
    };
    Logger.prototype._getHumanDate = function (timeStamp) {
        var date = new Date(timeStamp);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;
        sec = (sec < 10 ? "0" : "") + sec;
        var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
        return str;
    };
    /**
     * add some cosmetics on message
     */
    Logger.prototype._beautifyLogMessage = function (log) {
        var bgColor = this._getLevelColor(log.level);
        var levelName = this._getLevelName(log.level);
        if (!this._owner.color[bgColor]) {
            bgColor = 'bgBlue';
        }
        return [this._owner.color.underline[bgColor](this._owner.color.white(levelName)), log.message, this._getHumanDate(log.date), log.id];
    };
    /**
     * return a polling Promise with live log messages
     */
    Logger.prototype.getlog = function (registerUUid, ob) {
        var _this = this;
        return this._log.fetchlogs(registerUUid, LoggerHelper_1.LEVEL.TRACE, 'test')
            .then(function (messages) {
            if (!_this._screen && os.platform() !== 'win32' && _this._state === 'cli') {
                _this._openLogView();
                _this._screen.key(['escape', 'q', 'C-c'], function (ch, key) {
                    this.screen.destroy();
                    this.screen = undefined;
                    return ob.complete();
                });
            }
            if (!ob.isUnsubscribed) {
                if (messages.length) {
                    messages.map(function (log) {
                        // console.log(log);
                        if (os.platform() === 'win32' || _this._state === 'args') {
                            console.log.apply(console, _this._beautifyLogMessage(log));
                        }
                        else {
                            _this.termLog.log(_this._owner.table.row([_this._beautifyLogMessage(log)]), { height: 30 });
                        }
                    });
                }
                return _this.getlog(registerUUid, ob);
            }
        });
    };
    /**
     * ist directly used from the terminal
     */
    Logger.prototype._directLog = function (args) {
        var _this = this;
        return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
            .mergeMap(function (relutionHjson) {
            _this._relutionHjson = relutionHjson.data;
        })
            .filter(function (server) {
            return server.deployserver !== _this._i18n.CANCEL;
        })
            .mergeMap(function (server) {
            if (args[0].trim() === _this._deployCommand.defaultServer.trim()) {
                _this.choosedServer = lodash_1.find(_this._userRc.server, { default: true });
            }
            else {
                _this.choosedServer = lodash_1.find(_this._userRc.server, { id: args[0] });
            }
            return _this._relutionSDK.login(_this.choosedServer);
        })
            .mergeMap(function () {
            return rxjs_1.Observable.from([{ level: LoggerHelper_1.LEVEL[args[1].toUpperCase()] || LoggerHelper_1.LEVEL.TRACE }]);
        })
            .mergeMap(function (level) {
            _this.choosedLevel = LoggerHelper_1.LEVEL[level];
            _this._debuglog.info(_this.choosedServer.userName + " logged in on " + _this.choosedServer.serverUrl);
            _this._log = new LoggerHelper_1.LoggerHelper(_this._relutionHjson.uuid, _this.choosedServer);
            return _this._log.registerLogger();
        });
    };
    /**
     * print the livelog appender from you choosen server
     */
    Logger.prototype.log = function (args) {
        var _this = this;
        var serverName;
        var level = LoggerHelper_1.LEVEL.TRACE;
        if (args && args[0]) {
            serverName = args[0];
            this._state = 'args';
        }
        else {
            this._state = 'cli';
        }
        if (args && args[1]) {
            level = args[1];
        }
        var isSuper = args && args[0] ? true : false;
        return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
            .mergeMap(function (relutionHjson) {
            _this._relutionHjson = relutionHjson.data;
            // directLog
            if (isSuper) {
                return _this._deployCommand._getServers();
            }
            else {
                return _this._deployCommand.getServerPrompt();
            }
        })
            .filter(function (server) {
            return server.deployserver !== _this._i18n.CANCEL;
        }).mergeMap(function (server) {
            // directLog
            if (isSuper) {
                if (args[0].trim() === _this._deployCommand.defaultServer.trim()) {
                    _this.choosedServer = lodash_1.find(_this._userRc.server, { default: true });
                }
                else {
                    _this.choosedServer = lodash_1.find(_this._userRc.server, { id: args[0] });
                }
            }
            else {
                if (server.deployserver.toString().trim() === _this._deployCommand.defaultServer.trim()) {
                    _this.choosedServer = lodash_1.find(_this._userRc.server, { default: true });
                }
                else {
                    _this.choosedServer = lodash_1.find(_this._userRc.server, { id: server.deployserver });
                }
            }
            return _this._relutionSDK.login(_this.choosedServer);
        })
            .mergeMap(function () {
            // directLog
            if (isSuper) {
                return rxjs_1.Observable.from([{ level: LoggerHelper_1.LEVEL[args[1].toUpperCase()] || LoggerHelper_1.LEVEL.TRACE }]);
            }
            else {
                return _this._chooseLevel();
            }
        })
            .mergeMap(function (level) {
            _this.choosedLevel = LoggerHelper_1.LEVEL[level];
            Relution.debug.info(_this.choosedServer.userName + " logged in on " + _this.choosedServer.serverUrl);
            _this._log = new LoggerHelper_1.LoggerHelper(_this._relutionHjson.uuid, _this.choosedServer);
            return _this._log.registerLogger();
        })
            .exhaustMap(function (registerUUid) {
            return rxjs_1.Observable.create(function (ob) {
                return _this.getlog(registerUUid, ob)
                    .catch(function (e) {
                    ob.error(e);
                    if (os.platform() !== 'win32' && _this._state === 'cli') {
                        _this._screen.destroy();
                        _this._screen = undefined;
                    }
                    // ob.unsubcribe();
                    return;
                });
            });
        });
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3Byb2plY3QvTG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixJQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUM3QixJQUFZLFFBQVEsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUN6Qyx1QkFBcUIsUUFBUSxDQUFDLENBQUE7QUFDOUIscUJBQXFDLGlCQUFpQixDQUFDLENBQUE7QUFDdkQsdUJBQXVCLHFCQUFxQixDQUFDLENBQUE7QUFDN0Msd0JBQXdCLHVCQUF1QixDQUFDLENBQUE7QUFDaEQsNkJBQW9DLDBCQUEwQixDQUFDLENBQUE7QUFJL0QseUJBQXlCLHdCQUF3QixDQUFDLENBQUE7QUFLbEQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBVzNDO0lBa0JFLGdCQUFZLEtBQWM7UUFkbEIsYUFBUSxHQUFZLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBTWxDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFLZixjQUFTLEdBQUcsbUJBQVEsQ0FBQztRQUkzQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxj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