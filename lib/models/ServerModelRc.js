"use strict";
var _ = require('lodash');
var CertModelRc_1 = require('./CertModelRc');
var chalk = require('chalk');
var figures = require('figures');
var ServerModelRc = (function () {
    function ServerModelRc(params) {
        this.fromJSON(params);
    }
    ServerModelRc.prototype.fromJSON = function (params) {
        _.assignWith(this, params, function (objValue, srcValue, key) {
            if (ServerModelRc.attributes.indexOf(key) >= 0) {
                if (key === 'clientCertificate') {
                    srcValue = new CertModelRc_1.CertModelRc(srcValue);
                }
                return srcValue;
            }
        });
        this.fixServerUrl(this.serverUrl);
    };
    ServerModelRc.prototype.toJSON = function () {
        var _this = this;
        var model = {};
        ServerModelRc.attributes.forEach(function (attr) {
            if (attr && _this[attr] !== undefined) {
                model[attr] = _this[attr];
            }
        });
        return model;
    };
    ServerModelRc.prototype.toTableRow = function () {
        return [
            chalk.magenta(this.id),
            chalk.yellow(this.serverUrl),
            this.default ? chalk.green(figures.tick) : chalk.red(figures.cross),
            chalk.yellow(this.userName)
        ];
    };
    ServerModelRc.prototype.fixServerUrl = function (serverUrl) {
        if (serverUrl.slice(-1) === '/')
            this.serverUrl = serverUrl.slice(0, -1);
        else
            this.serverUrl += '/';
    };
    ServerModelRc.attributes = ['id', 'default', 'serverUrl', 'userName', 'password', 'clientCertificate'];
    return ServerModelRc;
}());
exports.ServerModelRc = ServerModelRc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyTW9kZWxSYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvU2VydmVyTW9kZWxSYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIsNEJBQWdELGVBQWUsQ0FBQyxDQUFBO0FBRWhFLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFXbkM7SUFXRSx1QkFBWSxNQUE4QjtRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxnQ0FBUSxHQUFmLFVBQWdCLE1BQThCO1FBQzVDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFDLFFBQWEsRUFBRSxRQUFhLEVBQUUsR0FBVztZQUNuRSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxRQUFRLEdBQUcsSUFBSSx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLDhCQUFNLEdBQWI7UUFBQSxpQkFRQztRQVBDLElBQUksS0FBSyxHQUFRLEVBQUUsQ0FBQztRQUNwQixhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVk7WUFDNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sa0NBQVUsR0FBakI7UUFDRSxNQUFNLENBQUM7WUFDTCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ25FLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUM1QixDQUFDO0lBQ0osQ0FBQztJQUVNLG9DQUFZLEdBQW5CLFVBQW9CLFNBQWlCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSTtZQUFDLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDO0lBQzdCLENBQUM7SUF4Q2Msd0JBQVUsR0FBRyxDQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLENBQUUsQ0FBQztJQXlDNUcsb0JBQUM7QUFBRCxDQUFDLEFBbERELElBa0RDO0FBbERZLHFCQUFhLGdCQWtEekIsQ0FBQSJ9