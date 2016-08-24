"use strict";
var Relution = require('relution-sdk');
var chalk = require('chalk');
/**
 * DebugLog
 */
var DebugLog = (function () {
    function DebugLog() {
    }
    Object.defineProperty(DebugLog, "withStack", {
        get: function () {
            return Relution.debug.enabled; // use --debug command line switch to enable this
        },
        enumerable: true,
        configurable: true
    });
    ;
    DebugLog.badge = function (label, color) {
        if (color === void 0) { color = 'green'; }
        if (chalk.supportsColor) {
            return '';
        }
        return chalk.bgBlack(chalk[color](" " + label + " : "));
    };
    DebugLog.log = function (color, message, submessage) {
        if (submessage) {
            console.log(chalk[color](message, submessage));
        }
        else {
            console.log(chalk[color](message));
        }
    };
    DebugLog.error = function (e) {
        Relution.debug.assertIsError(e); // when e travels through observers it's all too easy to catch a string
        return DebugLog.log('red', "" + DebugLog.badge('ERROR', 'red') + chalk.red(e.message), e.stack && DebugLog.withStack ? e.stack : '');
    };
    DebugLog.info = function (message, submessage) {
        return DebugLog.log('cyan', "" + DebugLog.badge('INFO', 'cyan') + message, submessage);
    };
    DebugLog.warn = function (message, submessage) {
        return DebugLog.log('yellow', "" + DebugLog.badge('WARNING', 'yellow') + chalk.green(message), submessage);
    };
    DebugLog.debug = function (message, submessage) {
        return DebugLog.log('magenta', "" + DebugLog.badge('DEBUG', 'magenta') + chalk.green(message), submessage);
    };
    return DebugLog;
}());
exports.DebugLog = DebugLog;
//# sourceMappingURL=DebugLog.js.map