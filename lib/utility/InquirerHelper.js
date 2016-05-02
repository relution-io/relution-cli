"use strict";
var inquirer = require('inquirer');
var rxjs_1 = require('@reactivex/rxjs');
/**
 * @link https://www.npmjs.com/package/inquirer
 */
var InquHelper = (function () {
    function InquHelper() {
    }
    InquHelper.prototype.list = function (name, choices, question) {
        return rxjs_1.Observable.create(function (observer) {
            inquirer.prompt([
                {
                    type: 'list',
                    name: name,
                    message: question,
                    choices: choices
                }
            ]).then(function (answers) {
                observer.next(answers);
                observer.complete();
            });
        });
    };
    return InquHelper;
}());
exports.InquHelper = InquHelper;
//# sourceMappingURL=InquirerHelper.js.map