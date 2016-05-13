"use strict";
/**
 * @class Gii
 * Gii provides a CLI-based interface for you to interactively generate the code you want.
 */
var lodash_1 = require('lodash');
var EnvironmentTemplate_1 = require('./templates/EnvironmentTemplate');
var App_1 = require('./templates/new/App');
var PackageJson_1 = require('./templates/new/PackageJson');
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
var Gii = (function () {
    function Gii() {
        this.templatesFolder = "./templates/";
        this.templates = [
            new TemplateModel('env', new EnvironmentTemplate_1.EnvironmentTemplate()),
            new TemplateModel('app', new App_1.App()),
            new TemplateModel('package', new PackageJson_1.PackageJson())
        ];
    }
    Gii.prototype.getTemplateByName = function (name) {
        var templateIndex = lodash_1.findIndex(this.templates, { name: name });
        return this.templates[templateIndex];
    };
    return Gii;
}());
exports.Gii = Gii;
//# sourceMappingURL=Gii.js.map