"use strict";
var Welcome = (function () {
    function Welcome() {
    }
    Welcome.greets = function (username) {
        //     console.log(`
        //  _____      ​_       _   _​                 __   __      __
        // |  __ \    | |     | | (_)              /   | |  |    |  |
        // | |__) |___| |_   ​_| |_​ _  ___  _ _    |   /  |  |    |  |
        // |  ​_  // _​ \ | | | | __| |/ _ \| '_ \  |  |   |  |    |  |
        // | | \ \  __/ | |_| | |_| | (_) | | | | |   \  |  |__  |  |
        // |_|  \_\___|_|\__,_|\__|_|\___/|_| |_|  \___| |_____| |__|
        //     `);
        console.log("Relution-Cli v" + Welcome.pkg.version + ": ");
        console.log("Hi " + username);
    };
    Welcome.bye = function (username) {
        console.log("Have a Great Day! " + username);
    };
    Welcome.pkg = require('./../../package.json');
    return Welcome;
}());
exports.Welcome = Welcome;
//# sourceMappingURL=Welcome.js.map