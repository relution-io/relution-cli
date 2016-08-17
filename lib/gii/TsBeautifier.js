"use strict";
var tsfmt = require("typescript-formatter");
var rxjs_1 = require('@reactivex/rxjs');
var TsBeautifier = (function () {
    function TsBeautifier() {
    }
    /**
     * fix the ts files with editorconfig and
     */
    TsBeautifier.format = function (filePaths, options) {
        if (options === void 0) { options = TsBeautifier.options; }
        return rxjs_1.Observable.fromPromise(tsfmt.processFiles(filePaths, options));
    };
    /**
     * @link [tsfmt](https://github.com/vvakame/typescript-formatter)
     */
    TsBeautifier.options = {
        dryRun: false,
        replace: true,
        verify: false,
        tslint: true,
        tsconfig: false,
        editorconfig: true,
        tsfmt: true
    };
    return TsBeautifier;
}());
exports.TsBeautifier = TsBeautifier;
//# sourceMappingURL=TsBeautifier.js.map