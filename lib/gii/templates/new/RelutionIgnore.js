"use strict";
var html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 */
var RelutionIgnore = (function () {
    function RelutionIgnore() {
        this.publishName = '.relutionignore';
        this.name = 'relutionignore';
    }
    Object.defineProperty(RelutionIgnore.prototype, "template", {
        get: function () {
            return ((_a = ["\n      client/**/*.*\n      /node_modules\n      **/*.ts\n      *.DS_STORE\n      *.git\n    "], _a.raw = ["\n      client/**/*.*\n      /node_modules\n      **/*.ts\n      *.DS_STORE\n      *.git\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return RelutionIgnore;
}());
exports.RelutionIgnore = RelutionIgnore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdXRpb25JZ25vcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ2lpL3RlbXBsYXRlcy9uZXcvUmVsdXRpb25JZ25vcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7O0dBRUc7QUFDSDtJQUFBO1FBRVMsZ0JBQVcsR0FBVyxpQkFBaUIsQ0FBQztRQUN4QyxTQUFJLEdBQVcsZ0JBQWdCLENBQUM7SUFXekMsQ0FBQztJQVRDLHNCQUFJLG9DQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsQ0FBQyxPQUFJLGdHQU1YLGdIQU5PLElBQUksS0FNWCxDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFDSCxxQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksc0JBQWMsaUJBYzFCLENBQUEifQ==