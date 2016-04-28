"use strict";
var fs = require('fs');
var UserRc = (function () {
    function UserRc() {
        this.appPrefix = 'relution';
        this._rcHome = UserRc.getUserHome() + "/." + this.appPrefix + "rc";
        UserRc.debug(this);
    }
    Object.defineProperty(UserRc.prototype, "rc", {
        get: function () {
            return this.rc;
        },
        set: function (v) {
            this.rc = v;
        },
        enumerable: true,
        configurable: true
    });
    UserRc.prototype.rcFileExist = function () {
        var _this = this;
        var self = this;
        fs.exists(this._rcHome, function (exists) {
            if (!exists) {
                UserRc.debug('no rec file');
            }
            console.log(_this._rcHome + " available");
        });
    };
    UserRc.getUserHome = function () {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    };
    UserRc.debug = function (line) {
        console.log(JSON.stringify(line, null, 2));
    };
    return UserRc;
}());
exports.UserRc = UserRc;
//# sourceMappingURL=UserRc.js.map