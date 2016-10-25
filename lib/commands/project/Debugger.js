"use strict";
var os = require('os');
var path = require('path');
var Relution = require('relution-sdk');
var lodash_1 = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var Deploy_1 = require('./../project/Deploy');
var FileApi_1 = require('../../utility/FileApi');
var DebugLog_1 = require('../../utility/DebugLog');
var Debugger = (function () {
    function Debugger(owner) {
        this._fileApi = new FileApi_1.FileApi();
        this._debuglog = DebugLog_1.DebugLog;
        this._owner = owner;
        this._userRc = owner.userRc;
        this._i18n = owner.i18n;
        this._relutionSDK = owner.relutionSDK;
        this._debuglog = owner.debuglog;
        this._inquirer = owner.inquirer;
        this._deployCommand = new Deploy_1.Deploy(owner);
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
            return server.deployserver !== _this._i18n.CANCEL;
        })
            .mergeMap(function (server) {
            if (server.deployserver.toString().trim() === _this._deployCommand.defaultServer.trim()) {
                choosedServer = lodash_1.find(_this._userRc.server, { default: true });
            }
            else {
                choosedServer = lodash_1.find(_this._userRc.server, { id: server.deployserver });
            }
            return _this._relutionSDK.login(choosedServer);
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
}());
exports.Debugger = Debugger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvcHJvamVjdC9EZWJ1Z2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFDekIsSUFBWSxJQUFJLFdBQU0sTUFBTSxDQUFDLENBQUE7QUFDN0IsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMsdUJBQXFCLFFBQVEsQ0FBQyxDQUFBO0FBQzlCLHFCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLHVCQUF1QixxQkFBcUIsQ0FBQyxDQUFBO0FBQzdDLHdCQUF3Qix1QkFBdUIsQ0FBQyxDQUFBO0FBSWhELHlCQUF5Qix3QkFBd0IsQ0FBQyxDQUFBO0FBS2xEO0lBWUUsa0JBQVksS0FBYztRQVJsQixhQUFRLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFLbEMsY0FBUyxHQUFHLG1CQUFRLENBQUM7UUFJM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTSx1QkFBSSxHQUFYO1FBQUEsaUJBc0RDO1FBckRDLElBQUksYUFBNEIsQ0FBQztRQUNqQzs7V0FFRztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFD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