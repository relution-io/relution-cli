"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var FileApi_1 = require('../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var path = require('path');
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        var _this = this;
        _super.call(this, 'logger');
        this._fileApi = new FileApi_1.FileApi();
        this.commands = {
            log: {
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(_this._deployCommand.projectDir, 'relution.hjson'));
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
    }
    return Logger;
}(Command_1.Command));
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map