"use strict";
/**
 * @class Gii
 * Gii provides a CLI-based interface for you to interactively generate the code you want.
 */
var lodash_1 = require('lodash');
var EnvironmentTemplate_1 = require('./templates/EnvironmentTemplate');
var App_1 = require('./templates/new/App');
var RelutionHjson_1 = require('./templates/new/RelutionHjson');
var RelutionIgnore_1 = require('./templates/new/RelutionIgnore');
var PackageJson_1 = require('./templates/new/PackageJson');
var TemplateModel_1 = require('./TemplateModel');
var Gii = (function () {
    function Gii() {
        this.templatesFolder = "./templates/";
        this.templates = [
            new TemplateModel_1.TemplateModel('env', new EnvironmentTemplate_1.EnvironmentTemplate()),
            new TemplateModel_1.TemplateModel('app', new App_1.App()),
            new TemplateModel_1.TemplateModel('relutionhjson', new RelutionHjson_1.RelutionHjson()),
            new TemplateModel_1.TemplateModel('relutionignore', new RelutionIgnore_1.RelutionIgnore()),
            new TemplateModel_1.TemplateModel('package', new PackageJson_1.PackageJson())
        ];
    }
    Gii.prototype.getTemplateByName = function (name) {
        var templateIndex = lodash_1.findIndex(this.templates, { name: name });
        if (templateIndex < 0) {
            return undefined;
        }
        return this.templates[templateIndex];
    };
    return Gii;
}());
exports.Gii = Gii;
//# sourceMappingURL=Gii.js.map