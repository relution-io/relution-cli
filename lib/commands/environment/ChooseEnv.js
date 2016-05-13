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
     * @return Array<any>
     */
    ChooseEnv.prototype.prompt = function (type, message) {
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = Translation_1.Translation.SELECT('Environment/s'); }
        var orderedNames = lodash_1.map(lodash_1.orderBy(this.envCollection.collection, ['name'], ['asc']), 'name');
        var choices = [];
        orderedNames.forEach(function (env) {
            choices.push({
                name: env,
                checked: type === 'checkbox' ? true : false
            });
        });
        choices.push({
            name: Translation_1.Translation.TAKE_ME_OUT,
            checked: false
        });
        var prompt = [
            {
                type: type,
                message: message,
                name: this.promptName,
                choices: choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return Translation_1.Translation.YOU_MOUST_CHOOSE('environment');
                    }
                    return true;
                }
            }
        ];
        return prompt;
    };
    /**
     * @return Observable
     */
    ChooseEnv.prototype.choose = function (type, message) {
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = Translation_1.Translation.SELECT('Environment/s'); }
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.prompt(type, message)));
    };
    Object.defineProperty(ChooseEnv.prototype, "envCollection", {
        /**
         * @return EnvCollection
         */
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