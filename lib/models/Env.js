// // import * as hjson from 'hjson';
"use strict";
var Enviroment = (function () {
    function Enviroment() {
    }
    Object.defineProperty(Enviroment.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    return Enviroment;
}());
exports.Enviroment = Enviroment;
//# sourceMappingURL=Env.js.map