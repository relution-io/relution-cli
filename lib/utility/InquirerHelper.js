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
//# sourceMappingURL=InquirerHelper.js.map