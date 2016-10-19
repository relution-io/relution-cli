"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var Deploy_1 = require('./project/Deploy');
var lodash_1 = require('lodash');
var FileApi_1 = require('../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var os = require('os');
var path = require('path');
var Relution = require('relution-sdk');
var rxjs_1 = require('@reactivex/rxjs');
var LoggerHelper_1 = require('./logger/LoggerHelper');
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        var _this = this;
        _super.call(this, 'logger');
        this._fileApi = new FileApi_1.FileApi();
        this._state = 'cli';
        this.commands = {
            log: {
                label: 'log',
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    return _this.i18n.LOGGER_LOG_WHY;
                },
                description: this.i18n.LOGGER_LOG_DESCRIPTION,
                vars: {
                    serverName: {
                        pos: 0
                    },
                    level: {
                        pos: 1
                    }
                }
            },
            help: {
                description: this.i18n.HELP_COMMAND('Debugger')
            },
            back: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
        this._deployCommand = new Deploy_1.Deploy(this);
    }
    /**
     * open a screen on os sytems nice !
     */
    Logger.prototype._openLogView = function () {
        this.screen = blessed.screen();
        this._grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });
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
        this.screen.render();
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
            return server.deployserver !== _this.i18n.CANCEL;
        })
            .mergeMap(function (server) {
            if (server.deployserver.toString().trim() === _this._deployCommand.defaultServer.trim()) {
                _this.choosedServer = lodash_1.find(_this.userRc.server, { default: true });
            }
            else {
                _this.choosedServer = lodash_1.find(_this.userRc.server, { id: server.deployserver });
            }
            return _this.relutionSDK.login(_this.choosedServer);
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
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(questions));
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
        if (!this.color[bgColor]) {
            bgColor = 'bgBlue';
        }
        return [this.color.underline[bgColor](this.color.white(levelName)), log.message, this._getHumanDate(log.date), log.id];
    };
    /**
     * return a polling Promise with live log messages
     */
    Logger.prototype.getlog = function (registerUUid, ob) {
        var _this = this;
        return this._log.fetchlogs(registerUUid, LoggerHelper_1.LEVEL.TRACE, 'test')
            .then(function (messages) {
            if (!_this.screen && os.platform() !== 'win32' && _this._state === 'cli') {
                _this._openLogView();
                _this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
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
                            _this.termLog.log(_this.table.row([_this._beautifyLogMessage(log)]), { height: 30 });
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
            return _this._deployCommand._getServers();
        })
            .mergeMap(function () {
            if (args[0].trim() === _this._deployCommand.defaultServer.trim()) {
                _this.choosedServer = lodash_1.find(_this.userRc.server, { default: true });
            }
            else {
                _this.choosedServer = lodash_1.find(_this.userRc.server, { id: args[0] });
            }
            return _this.relutionSDK.login(_this.choosedServer);
        })
            .mergeMap(function () {
            return rxjs_1.Observable.from([{ level: LoggerHelper_1.LEVEL[args[1].toUpperCase()] || LoggerHelper_1.LEVEL.TRACE }]);
        })
            .mergeMap(function (level) {
            _this.choosedLevel = LoggerHelper_1.LEVEL[level];
            _this.debuglog.info(_this.choosedServer.userName + " logged in on " + _this.choosedServer.serverUrl);
            _this._log = new LoggerHelper_1.LoggerHelper(_this._relutionHjson.uuid, _this.choosedServer);
            return _this._log.registerLogger();
        });
    };
    /**
     * print the livelog appender from you choosen server
     */
    Logger.prototype.log = function (args) {
        var _this = this;
        // console.log('args', args);
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
        return rxjs_1.Observable.create(function (ob) {
            var sub = serverName ? _this._directLog(args) : _this._registerLogger();
            sub.subscribe(function (registerUUid) {
                return _this.getlog(registerUUid, ob)
                    .catch(function (e) {
                    ob.error(e);
                    if (os.platform() !== 'win32' && _this._state === 'cli') {
                        _this.screen.destroy();
                        _this.screen = undefined;
                    }
                    sub().unsubcribe();
                    return;
                });
            });
        });
    };
    return Logger;
}(Command_1.Command));
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map