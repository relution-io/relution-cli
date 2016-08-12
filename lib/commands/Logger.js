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
        this.commands = {
            log: {
                label: 'log',
                method: 'logPrinter',
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    return _this.i18n.LOGGER_LOG_WHY;
                },
                description: this.i18n.LOGGER_LOG_DESCRIPTION,
                vars: {
                    server: {
                        pos: 0
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
    Logger.prototype._openLogView = function () {
        this.screen = blessed.screen();
        this.termLog = contrib.log({
            fg: 'green',
            label: "Server Log " + this.choosedServer.id + " " + this.choosedServer.serverUrl,
            height: '40%',
            tags: true,
            xLabelPadding: 3,
            xPadding: 5,
            bufferLength: 40,
            border: {
                type: 'line',
                fg: 'cyan'
            }
        });
        this.screen.append(this.termLog);
        this.screen.render();
    };
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
    Logger.prototype._chooseLevel = function () {
        var questions = {
            name: 'level',
            message: 'Choose the log Level first',
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
    Logger.prototype._getLevelName = function (level) {
        var name = '';
        Object.keys(LoggerHelper_1.LEVEL).forEach(function (key) {
            if (LoggerHelper_1.LEVEL[key] === level) {
                name = key;
            }
        });
        return name;
    };
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
    Logger.prototype._beautifyLogMessage = function (log) {
        var bgColor = this._getLevelColor(log.level);
        var levelName = this._getLevelName(log.level);
        if (!this.color[bgColor]) {
            bgColor = 'bgBlue';
        }
        var content = [[this.color.underline[bgColor](this.color.white(levelName)), log.message, log.date, log.id]];
        return this.table.row(content);
    };
    Logger.prototype.getlog = function (registerUUid, ob) {
        var _this = this;
        return this._log.fetchlogs(registerUUid, LoggerHelper_1.LEVEL.TRACE, 'test')
            .then(function (messages) {
            if (!_this.screen) {
                _this._openLogView();
                _this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
                    this.screen.destroy();
                    this.screen = undefined;
                    return ob.complete();
                });
            }
            if (!ob.isUnsubscribed) {
                messages.map(function (log) {
                    // console.log(log);
                    _this.termLog.log(_this._beautifyLogMessage(log));
                });
                return _this.getlog(registerUUid, ob);
            }
        });
    };
    Logger.prototype.logPrinter = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (ob) {
            _this._registerLogger()
                .subscribe(function (registerUUid) {
                return _this.getlog(registerUUid, ob)
                    .catch(function (e) {
                    ob.error(e);
                    _this.screen.destroy();
                    _this.screen = undefined;
                    _this._registerLogger().unsubcribe();
                    return;
                });
            });
        });
    };
    return Logger;
}(Command_1.Command));
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map