"use strict";
var Validator = (function () {
    function Validator() {
    }
    /**
     * check if the string is not empty
     */
    Validator.notEmptyValidate = function (label) {
        // console.log(label);
        if (label && label.length) {
            return true;
        }
        console.log(label + " can not be empty");
        return false;
    };
    /**
     * check if the string is a valid url
     */
    Validator.url = function (url) {
        return url.match(Validator.urlPattern);
    };
    /**
     * @example 80 or 9200 min 2 ,max 4
     * @type {RegExp}
     */
    Validator.portRegex = /^(\d){2}$|(\d){4}$/;
    /**
     * url Pattern allowed
     * @example https://localkllk:9100/blubber&id=234 http://localkllk.de/blubber&id=234
     * @type {RegExp}
     */
    Validator.urlPattern = /(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    /**
     * allowed many string numbers chars
     */
    Validator.stringNumberCharsPattern = /^[\w\d]+$/;
    /**
     * allow a-Z 0-9 for the server name
     * @type {RegExp}
     */
    Validator.stringNumberPattern = /^[a-zA-Z\s]|[0-9\s]+$/;
    /**
     * allow a-Z for the given value
     * @type {RegExp}
     */
    Validator.stringPattern = /^[a-zA-Z\s]+$/;
    /**
     * allow a-Z for the given value and must have at end a .p12 extension
     * @type {RegExp}
     */
    Validator.p12Pattern = /^[a-zA-Z\s]+(\.p12)+$/;
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map