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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdMb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9EZWJ1Z0xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxRQUFRLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFDekMsSUFBWSxLQUFLLFdBQU0sT0FBTyxDQUFDLENBQUE7QUFFL0I7O0dBRUc7QUFDSDtJQUFBO0lBbUNBLENBQUM7SUFsQ0Msc0JBQVcscUJBQVM7YUFBcEI7WUFDRSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxpREFBaUQ7UUFDbEYsQ0FBQzs7O09BQUE7O0lBRU0sY0FBSyxHQUFaLFVBQWEsS0FBYSxFQUFFLEtBQWU7UUFBZixxQkFBZSxHQUFmLGVBQWU7UUFDekMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBSSxLQUFLLFFBQUssQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNNLFlBQUcsR0FBVixVQUFXLEtBQWEsRUFBRSxPQUFlLEVBQUUsVUFBZ0I7UUFDekQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNILENBQUM7SUFFTSxjQUFLLEdBQVosVUFBYSxDQUFRO1FBQ25CLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUVBQXVFO1FBQ3hHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUFFTSxhQUFJLEdBQVgsVUFBWSxPQUFlLEVBQUUsVUFBZ0I7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSxhQUFJLEdBQVgsVUFBWSxPQUFlLEVBQUUsVUFBZ0I7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBRU0sY0FBSyxHQUFaLFVBQWEsT0FBZSxFQUFFLFVBQWdCO1FBQzVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDN0csQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDO0FBbkNZLGdCQUFRLFdBbUNwQixDQUFBIn0=