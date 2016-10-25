"use strict";
var PackageJson_1 = require('./PackageJson');
var html = require('common-tags').html;
var Readme = (function () {
    function Readme() {
        this.name = 'readme';
        this.publishName = 'README.md';
        this.package = new PackageJson_1.PackageJson();
    }
    Object.defineProperty(Readme.prototype, "template", {
        get: function () {
            return ((_a = ["\n      #", " ", "\n\n      ", "\n    "], _a.raw = ["\n      #", " ", "\n\n      ", "\n    "], html(_a, this.name, this.package.version, this.package.description)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return Readme;
}());
exports.Readme = Readme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhZG1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L1JlYWRtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNEJBQTBCLGVBQWUsQ0FBQyxDQUFBO0FBQzFDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7SUFBQTtRQUNTLFNBQUksR0FBVyxRQUFRLENBQUM7UUFDeEIsZ0JBQVcsR0FBVyxXQUFXLENBQUM7UUFDbEMsWUFBTyxHQUFnQixJQUFJLHlCQUFXLEVBQUUsQ0FBQztJQVNsRCxDQUFDO0lBUEMsc0JBQUksNEJBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQUksV0FDUCxFQUFTLEdBQUksRUFBb0IsWUFFbEMsRUFBd0IsUUFDM0Isd0RBSk8sSUFBSSxLQUNQLElBQUksQ0FBQyxJQUFJLEVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMzQixDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxjQUFNLFNBWWxCLENBQUEifQ==