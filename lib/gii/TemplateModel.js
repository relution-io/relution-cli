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
//# sourceMappingURL=TemplateModel.js.map