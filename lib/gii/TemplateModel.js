"use strict";
var TemplateModel = (function () {
    function TemplateModel(name, instance) {
        this.name = name;
        this.instance = instance;
    }
    Object.defineProperty(TemplateModel.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplateModel.prototype, "instance", {
        get: function () {
            return this._instance;
        },
        set: function (v) {
            this._instance = v;
        },
        enumerable: true,
        configurable: true
    });
    return TemplateModel;
}());
exports.TemplateModel = TemplateModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVNb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9naWkvVGVtcGxhdGVNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7SUFLRSx1QkFBWSxJQUFZLEVBQUUsUUFBYTtRQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQsc0JBQVcsK0JBQUk7YUFBZjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFnQixDQUFTO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7OztPQUpBO0lBTUQsc0JBQVcsbUNBQVE7YUFBbkI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO2FBRUQsVUFBb0IsQ0FBTTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDOzs7T0FKQTtJQUtILG9CQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSxxQkFBYSxnQkF5QnpCLENBQUEifQ==