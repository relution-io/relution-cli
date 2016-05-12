"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Translation_1 = require('./../../utility/Translation');
var lodash_1 = require('lodash');
var inquirer = require('inquirer');
var ChooseEnv = (function () {
    function ChooseEnv(envCollection) {
        /**
         * @param promptName return the key from the prompt
         */
        this.promptName = 'env';
        this.envCollection = envCollection;
    }
    /**
     * @return Observable
     */
    ChooseEnv.prototype.prompt = function () {
        var choices = lodash_1.map(lodash_1.orderBy(this.envCollection.collection, ['name'], ['asc']), 'name');
        choices.push(Translation_1.Translation.TAKE_ME_OUT);
        var prompt = [
            {
                type: 'checkbox',
                message: 'Select Environment/s',
                name: this.promptName,
                choices: choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return 'You must choose at least one environment.';
                    }
                    return true;
                }
            }
        ];
        return prompt;
    };
    ChooseEnv.prototype.choose = function () {
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.prompt()));
    };
    Object.defineProperty(ChooseEnv.prototype, "envCollection", {
        get: function () {
            return this._envCollection;
        },
        set: function (v) {
            this._envCollection = v;
        },
        enumerable: true,
        configurable: true
    });
    return ChooseEnv;
}());
exports.ChooseEnv = ChooseEnv;
//# sourceMappingURL=ChooseEnv.js.map