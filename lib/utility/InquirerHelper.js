"use strict";
var inquirer = require('inquirer');
/**
 * @link https://www.npmjs.com/package/inquirer
 */
var InquirerHelper = (function () {
    function InquirerHelper() {
    }
    /**
     * @link https://github.com/SBoudrias/Inquirer.js/blob/master/examples/list.js
     */
    InquirerHelper.prototype.list = function (name, choices, question) {
        return inquirer.prompt([
            {
                type: 'rawlist',
                name: name,
                message: question,
                choices: choices
            }
        ]);
    };
    return InquirerHelper;
}());
exports.InquirerHelper = InquirerHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5xdWlyZXJIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9JbnF1aXJlckhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxRQUFRLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFFckM7O0dBRUc7QUFDSDtJQUFBO0lBY0EsQ0FBQztJQWJDOztPQUVHO0lBQ0gsNkJBQUksR0FBSixVQUFLLElBQVksRUFBRSxPQUErQixFQUFFLFFBQWdCO1FBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3JCO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixPQUFPLEVBQUUsT0FBTzthQUNqQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksc0JBQWMsaUJBYzFCLENBQUEifQ==