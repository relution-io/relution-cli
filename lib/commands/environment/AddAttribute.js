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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkQXR0cmlidXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2Vudmlyb25tZW50L0FkZEF0dHJpYnV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0MsNEJBQTBCLDZCQUE2QixDQUFDLENBQUE7QUFDeEQsMEJBQXdCLDJCQUEyQixDQUFDLENBQUE7QUFDcEQseUJBQXVCLDBCQUEwQixDQUFDLENBQUE7QUFDbEQsSUFBWSxRQUFRLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFFckM7SUFBQTtRQUNFOztXQUVHO1FBQ0ksZUFBVSxHQUFXLGNBQWMsQ0FBQztRQUMzQzs7YUFFSztRQUNFLGtCQUFhLEdBQVcsU0FBUyxDQUFDO0lBeUQzQyxDQUFDO0lBeERDOzs7T0FHRztJQUNILDRCQUFLLEdBQUw7UUFDRSxJQUFJLE1BQU0sR0FBRztZQUNYO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNsRCxRQUFRLEVBQUUsVUFBQyxLQUFhO29CQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsbUJBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBVSxLQUFLLDBEQUF1RCxDQUFDLENBQUMsQ0FBQzt3QkFDbEcsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDZixDQUFDO29CQUNELElBQUksSUFBSSxHQUFxQixLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2xFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDZCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLG1CQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkYsTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDZixDQUFDO2dCQUNILENBQUM7YUFDRjtZQUNEO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNwRCxRQUFRLEVBQUUsVUFBQyxLQUFhO29CQUN0QixJQUFJLElBQUksR0FBcUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxxQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQ3hFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDZCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLG1CQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxxQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6RixNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNmLENBQUM7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQztRQUNGLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLFdBQVcsQ0FBTSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNEOzs7T0FHRztJQUNILGlDQUFVLEdBQVY7UUFDRSxJQUFJLE1BQU0sR0FBRztZQUNYO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLGdCQUFnQjthQUMxQjtTQUNGLENBQUM7UUFDRixNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFqRUQsSUFpRUM7QUFqRVksb0JBQVksZUFpRXhCLENBQUEifQ==