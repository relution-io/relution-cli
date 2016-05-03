"use strict";
var Validator_1 = require('./../../utility/Validator');
var ServerModelRc_1 = require('./../../utility/ServerModelRc');
/**
 *
 */
var Add = (function () {
    function Add(params, cli) {
        if (params === void 0) { params = { name: '', baseUrl: '', username: '', password: '' }; }
        if (cli === void 0) { cli = true; }
        this.config = [
            {
                type: 'input',
                name: 'name',
                message: 'Server Name',
                validate: function (value) {
                    var pass = value.match(Validator_1.Validator.stringNumberPattern);
                    if (pass) {
                        return true;
                    }
                    else {
                        return 'Please enter a valid Server name';
                    }
                }
            },
            {
                type: 'input',
                name: 'baseUrl',
                message: 'Enter the server url (http://....)',
                validate: function (value) {
                    var pass = value.match(Validator_1.Validator.urlPattern);
                    if (pass) {
                        return true;
                    }
                    else {
                        return 'Please enter a valid url';
                    }
                }
            },
            {
                type: 'input',
                name: 'username',
                message: 'Enter your username',
                validate: Validator_1.Validator.notEmptyValidate('Username')
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your Password',
                validate: Validator_1.Validator.notEmptyValidate('Password')
            }
        ];
        this.pushInqu = [];
        this.model = new ServerModelRc_1.ServerModelRc();
        //Object.assign(this.model, params);
    }
    return Add;
}());
exports.Add = Add;
//# sourceMappingURL=add.js.map