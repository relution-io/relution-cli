"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Translation_1 = require('./../../utility/Translation');
var Validator_1 = require('./../../utility/Validator');
var inquirer = require('inquirer');
var chalk = require('chalk');
var AddAttribute = (function () {
    function AddAttribute() {
        this._store = [];
        /**
         * @param promptName return the key from the prompt
         */
        this.promptName = 'envattribute';
        /**
           * @param promptName return the key from the prompt
           */
        this.addPromptName = 'another';
    }
    AddAttribute.prototype.prompt = function () {
        return [
            {
                type: 'input',
                name: 'key',
                message: Translation_1.Translation.ENTER_SOMETHING.concat('key'),
                validate: function (value) {
                    if (value === 'name') {
                        console.log(chalk.red("\n Key " + value + " is a reserved key attribute and cant be overwritten."));
                        return false;
                    }
                    var pass = value.match(Validator_1.Validator.stringPattern);
                    if (pass) {
                        return true;
                    }
                    else {
                        console.log(chalk.red("\n Name " + value + " has wrong character allowed only [a-z A-Z]"));
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
                        console.log(chalk.red("\n Name " + value + " has wrong character allowed only [a-z A-Z 0-9]"));
                        return false;
                    }
                }
            }
        ];
    };
    AddAttribute.prototype.addPrompt = function () {
        var prompt = [
            {
                type: 'confirm',
                name: this.addPromptName,
                default: false,
                message: 'Add one more ?'
            }
        ];
        return prompt;
    };
    /**
     * create a key value question prompt
     */
    AddAttribute.prototype.store = function () {
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.prompt()));
    };
    /**
     * Darfs ein bischen mehr sein ?
     */
    AddAttribute.prototype.addAnother = function () {
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.addPrompt()));
    };
    return AddAttribute;
}());
exports.AddAttribute = AddAttribute;
//# sourceMappingURL=AddAttribute.js.map