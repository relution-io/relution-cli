"use strict";
var _ = require('lodash');
/**
 * @class CertModelRc
 * @description add to a server a Clientcertificate as Base64
 */
var CertModelRc = (function () {
    function CertModelRc(params) {
        this.fromJSON(params);
    }
    CertModelRc.prototype.fromJSON = function (params) {
        _.assignWith(this, params, function (objValue, srcValue, key) {
            if (CertModelRc.attributes.indexOf(key) >= 0) {
                if (key === 'pfx' && _.isString(srcValue)) {
                    srcValue = new Buffer(srcValue, 'base64');
                }
                return srcValue;
            }
        });
    };
    CertModelRc.prototype.toJSON = function () {
        var _this = this;
        var model = {};
        CertModelRc.attributes.forEach(function (attr) {
            var value = _this[attr];
            if (value !== undefined) {
                if (_.isBuffer(value)) {
                    value = value.toString('base64');
                }
                model[attr] = value;
            }
        });
        return model;
    };
    CertModelRc.attributes = ['pfx', 'passphrase'];
    return CertModelRc;
}());
exports.CertModelRc = CertModelRc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VydE1vZGVsUmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0NlcnRNb2RlbFJjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUs1Qjs7O0dBR0c7QUFDSDtJQU9FLHFCQUFZLE1BQTRCO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVNLDhCQUFRLEdBQWYsVUFBZ0IsTUFBNEI7UUFDMUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQUMsUUFBYSxFQUFFLFFBQWEsRUFBRSxHQUFXO1lBQ25FLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzVDLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNsQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sNEJBQU0sR0FBYjtRQUFBLGlCQVlDO1FBWEMsSUFBSSxLQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTtZQUMxQyxJQUFJLEtBQUssR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBN0JjLHNCQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7SUE4QnBELGtCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQW5DWSxtQkFBVyxjQW1DdkIsQ0FBQSJ9