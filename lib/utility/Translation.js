"use strict";
var credential = '';
var Translation = (function () {
    function Translation() {
    }
    Translation.SELECT = function (name) {
        return "Select " + name;
    };
    Translation.YOU_MOUST_CHOOSE = function (name) {
        return "You must choose at least one " + name + ".";
    };
    Translation.LIST_COMMAND = function (name) {
        return "List the " + name + " Command";
    };
    Translation.PRESS_ENTER = ' or press enter';
    Translation.QUIT = 'quit';
    Translation.ENTER_SOMETHING = "Please enter a ";
    Translation.TAKE_ME_OUT = 'Take me out of here';
    Translation.NOT_VALID = "Your Input is not valid";
    return Translation;
}());
exports.Translation = Translation;
//# sourceMappingURL=Translation.js.map