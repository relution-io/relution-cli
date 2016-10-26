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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHNCZWF1dGlmaWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dpaS9Uc0JlYXV0aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksS0FBSyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDOUMscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0M7SUFBQTtJQW9CQSxDQUFDO0lBTkM7O09BRUc7SUFDVyxtQkFBTSxHQUFwQixVQUFxQixTQUFtQixFQUFFLE9BQThCO1FBQTlCLHVCQUE4QixHQUE5QixVQUFVLFlBQVksQ0FBQyxPQUFPO1FBQ3RFLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFsQkQ7O09BRUc7SUFDVyxvQkFBTyxHQUFHO1FBQ3RCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsSUFBSTtRQUNsQixLQUFLLEVBQUUsSUFBSTtLQUNaLENBQUM7SUFRSixtQkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksb0JBQVksZUFvQnhCLENBQUEifQ==