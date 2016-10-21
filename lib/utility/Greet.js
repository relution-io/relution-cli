"use strict";
var Greet = (function () {
    function Greet() {
    }
    Greet.hello = function (username) {
        //     console.log(`
        //  _____      ​_       _   _​                 __   __      __
        // |  __ \    | |     | | (_)              /   | |  |    |  |
        // | |__) |___| |_   ​_| |_​ _  ___  _ _    |   /  |  |    |  |
        // |  ​_  // _​ \ | | | | __| |/ _ \| '_ \  |  |   |  |    |  |
        // | | \ \  __/ | |_| | |_| | (_) | | | | |   \  |  |__  |  |
        // |_|  \_\___|_|\__,_|\__|_|\___/|_| |_|  \___| |_____| |__|
        //     `);
        // console.log(`Relution-Cli v${Greet.pkg.version}: `);
        console.log("Hi " + username);
    };
    Greet.bye = function (username) {
        console.log("Have a Great Day! " + username);
    };
    Greet.pkg = require('./../../package.json');
    return Greet;
}());
exports.Greet = Greet;
//# sourceMappingURL=Greet.js.map