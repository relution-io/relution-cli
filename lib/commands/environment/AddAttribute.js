"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Translation_1 = require('./../../utility/Translation');
var Validator_1 = require('./../../utility/Validator');
var DebugLog_1 = require('./../../utility/DebugLog');
var inquirer = require('inquirer');
var AddAttribute = (function () {
    function AddAttribute() {
        /**
         * @param promptName return the key from the prompt
         */
        this.promptName = 'envattribute';
        /**
           * @param promptName return the key from the prompt
           */
        this.addPromptName = 'another';
    }
    /**
     * create a key value question prompt
     * @return Observable
     */
    AddAttribute.prototype.store = function () {
        var prompt = [
            {
                type: 'input',
                name: 'key',
                message: Translation_1.Translation.ENTER_SOMETHING.concat('key'),
                validate: function (value) {
                    if (value === 'name') {
                        DebugLog_1.DebugLog.error(new Error("\n Key " + value + " is a reserved key attribute and cant be overwritten."));
                        return false;
                    }
                    var pass = value.match(Validator_1.Validator.stringPattern);
                    if (pass) {
                        return true;
                    }
                    else {
                        DebugLog_1.DebugLog.error(new Error(Translation_1.Translation.NOT_ALLOWED(value, Validator_1.Validator.stringPattern)));
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'value',
                message: Translation_1.Translation.ENTER_SOMETHING.concat('value'),
                validate: function (value) {
                    var pass = value.match(Validator_1.Validator.stringNumberPattern);
                    if (pass) {
                        return true;
                    }
                    else {
                        DebugLog_1.DebugLog.error(new Error(Translation_1.Translation.NOT_ALLOWED(value, Validator_1.Validator.stringNumberPattern)));
                        return false;
                    }
                }
            }
        ];
        return rxjs_1.Observable.fromPromise(inquirer.prompt(prompt));
    };
    /**
     * add another value ? y/n
     * @return Observable
     */
    AddAttribute.prototype.addAnother = function () {
        var prompt = [
            {
                type: 'confirm',
                name: this.addPromptName,
                default: false,
                message: 'Add one more ?'
            }
        ];
        return rxjs_1.Observable.fromPromise(inquirer.prompt(prompt));
    };
    return AddAttribute;
}());
exports.AddAttribute = AddAttribute;
//# sourceMappingURL=AddAttribute.js.map