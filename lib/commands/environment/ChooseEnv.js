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
        this.promptType = 'checkbox';
        this.envCollection = envCollection;
        // console.log('this.envCollection', this.envCollection);
    }
    ChooseEnv.prototype.prompt = function (choices) {
        return [
            {
                type: this.promptType,
                message: this.message,
                name: this.promptName,
                choices: this.choices,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return Translation_1.Translation.YOU_MUST_CHOOSE('environment');
                    }
                    return true;
                }
            }
        ];
    };
    /**
     * @return Observable
     */
    ChooseEnv.prototype.choose = function (type, message) {
        if (type === void 0) { type = 'checkbox'; }
        if (message === void 0) { message = Translation_1.Translation.SELECT('Environment/s'); }
        this.promptType = type;
        this.message = message;
        return rxjs_1.Observable.fromPromise(inquirer.prompt(this.prompt(this.choices)));
    };
    Object.defineProperty(ChooseEnv.prototype, "choices", {
        get: function () {
            var _this = this;
            var orderedNames = lodash_1.map(lodash_1.orderBy(this.envCollection.collection, ['name'], ['asc']), 'name');
            var choices = [];
            orderedNames.forEach(function (env) {
                choices.push({
                    name: env,
                    checked: _this.promptType === 'checkbox' ? true : false
                });
            });
            choices.push({
                name: Translation_1.Translation.CANCEL,
                checked: false
            });
            return choices;
        },
        enumerable: true,
        configurable: true
    });
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