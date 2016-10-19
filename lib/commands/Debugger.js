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
var Debugger = (function (_super) {
    __extends(Debugger, _super);
    function Debugger() {
        var _this = this;
        _super.call(this, 'debug');
        this._fileApi = new FileApi_1.FileApi();
        this.commands = {
            open: {
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(_this._deployCommand.projectDir, 'relution.hjson'));
                },
                why: function () {
                    return _this.i18n.DEBUGGER_OPEN_WHY;
                },
                description: this.i18n.DEBUGGER_OPEN_DESCRIPTION,
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
    Debugger.prototype.open = function () {
        var _this = this;
        var choosedServer;
        /**
         * get the relution.hjson
         */
        return this._fileApi.readHjson(path.join(this._deployCommand.projectDir, 'relution.hjson'))
            .exhaustMap(function (relutionHjson) {
            _this._relutionHjson = relutionHjson.data;
            return _this._deployCommand.getServerPrompt();
        })
            .filter(function (server) {
            return server.deployserver !== _this.i18n.CANCEL;
        })
            .mergeMap(function (server) {
            if (server.deployserver.toString().trim() === _this._deployCommand.defaultServer.trim()) {
                choosedServer = lodash_1.find(_this.userRc.server, { default: true });
            }
            else {
                choosedServer = lodash_1.find(_this.userRc.server, { id: server.deployserver });
            }
            return _this.relutionSDK.login(choosedServer);
        })
            .mergeMap(function (resp) {
            var exec = require('child_process').exec;
            var redirect = Relution.web.resolveUrl('node-inspector', { application: _this._relutionHjson.name });
            var url = choosedServer.serverUrl + "/gofer/security-login?j_username=" + encodeURIComponent(choosedServer.userName) + "&j_password=" + encodeURIComponent(choosedServer.password) + "&redirect=" + encodeURIComponent(redirect);
            var cmd;
            if (os.platform() === 'win32') {
                cmd = (process.env.COMSPEC || 'cmd') + " /C \"@start /B " + url.replace(/&/g, '^&') + "\"";
            }
            else {
                cmd = "open --fresh \"" + url + "\"";
            }
            return rxjs_1.Observable.create(function (observer) {
                return exec(cmd, function (error, stdout, stderr) {
                    if (error) {
                        observer.error("exec error: " + error);
                        return;
                    }
                    observer.next("Debugger will open " + redirect + " please wait");
                    observer.complete();
                });
            });
        });
    };
    return Debugger;
}(Command_1.Command));
exports.Debugger = Debugger;
//# sourceMappingURL=Debugger.js.map