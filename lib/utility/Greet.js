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
        console.log("Relution-Cli v" + Greet.pkg.version + ": ");
        console.log("Hi " + username);
    };
    Greet.bye = function (username) {
        console.log("Have a Great Day! " + username);
    };
    Greet.pkg = require('./../../package.json');
    return Greet;
}());
exports.Greet = Greet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JlZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9HcmVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7SUFBQTtJQW9CQSxDQUFDO0lBaEJRLFdBQUssR0FBWixVQUFhLFFBQWdCO1FBQzNCLG9CQUFvQjtRQUNwQiw4REFBOEQ7UUFDOUQsNkRBQTZEO1FBQzdELCtEQUErRDtRQUMvRCwrREFBK0Q7UUFDL0QsNkRBQTZEO1FBQzdELDZEQUE2RDtRQUM3RCxVQUFVO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBaUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLE9BQUksQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBTSxRQUFVLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sU0FBRyxHQUFWLFVBQVcsUUFBZ0I7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBcUIsUUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQWpCYSxTQUFHLEdBQVEsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFrQjNELFlBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDO0FBcEJZLGFBQUssUUFvQmpCLENBQUEifQ==