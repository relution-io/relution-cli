"use strict";
var html = require('common-tags').html;
/**
 * Push
 */
var Push = (function () {
    function Push() {
        /**
         * filename
         */
        this.name = '';
    }
    Object.defineProperty(Push.prototype, "template", {
        get: function () {
            return ((_a = ["", ""], _a.raw = ["", ""], html(_a, JSON.stringify(this.model, null, 2))));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Push.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            this._type = v;
        },
        enumerable: true,
        configurable: true
    });
    return Push;
}());
exports.Push = Push;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9naWkvdGVtcGxhdGVzL1B1c2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFFekM7O0dBRUc7QUFDSDtJQUFBO1FBRUU7O1dBRUc7UUFDSSxTQUFJLEdBQVcsRUFBRSxDQUFDO0lBcUIzQixDQUFDO0lBWEMsc0JBQUksMEJBQVE7YUFBWjtZQUNFLE1BQU0sQ0FBQyxDQUFDLE9BQUksRUFBRyxFQUFtQyxFQUFFLHNCQUE1QyxJQUFJLEtBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7O1FBQ3hELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsc0JBQUk7YUFBZjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFnQixDQUFTO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7OztPQUpBO0lBS0gsV0FBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksWUFBSSxPQTBCaEIsQ0FBQSJ9