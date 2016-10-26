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
        this._envCollection = envCollection;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hvb3NlRW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2Vudmlyb25tZW50L0Nob29zZUVudi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFFM0MsNEJBQTBCLDZCQUE2QixDQUFDLENBQUE7QUFDeEQsdUJBQTJCLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLElBQVksUUFBUSxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBRXJDO0lBWUUsbUJBQVksYUFBNEI7UUFQeEM7O1dBRUc7UUFDSSxlQUFVLEdBQVcsS0FBSyxDQUFDO1FBQzNCLGVBQVUsR0FBRyxVQUFVLENBQUM7UUFJN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMseURBQXlEO0lBQzNELENBQUM7SUFDTSwwQkFBTSxHQUFiLFVBQWMsT0FBa0Q7UUFDOUQsTUFBTSxDQUFDO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixRQUFRLEVBQUUsVUFBQyxNQUFxQjtvQkFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixNQUFNLENBQUMseUJBQVcsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVEOztPQUVHO0lBQ0gsMEJBQU0sR0FBTixVQUFPLElBQWlCLEVBQUUsT0FBcUQ7UUFBeEUsb0JBQWlCLEdBQWpCLGlCQUFpQjtRQUFFLHVCQUFxRCxHQUFyRCxVQUFrQix5QkFBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDN0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxzQkFBSSw4QkFBTzthQUFYO1lBQUEsaUJBZ0JDO1lBZkMsSUFBSSxZQUFZLEdBQVEsWUFBRyxDQUFDLGdCQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0YsSUFBSSxPQUFPLEdBQThDLEVBQUUsQ0FBQztZQUU1RCxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBVztnQkFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDWCxJQUFJLEVBQUUsR0FBRztvQkFDVCxPQUFPLEVBQUUsS0FBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLEdBQUcsSUFBSSxHQUFHLEtBQUs7aUJBQ3ZELENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDWCxJQUFJLEVBQUUseUJBQVcsQ0FBQyxNQUFNO2dCQUN4QixPQUFPLEVBQUUsS0FBSzthQUNmLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakIsQ0FBQzs7O09BQUE7SUFJRCxzQkFBVyxvQ0FBYTtRQUh4Qjs7V0FFRzthQUNIO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQzthQUVELFVBQXlCLENBQWdCO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUM7OztPQUpBO0lBS0gsZ0JBQUM7QUFBRCxDQUFDLEFBckVELElBcUVDO0FBckVZLGlCQUFTLFlBcUVyQixDQUFBIn0=