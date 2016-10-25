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
var GitIgnore_1 = require('./templates/new/GitIgnore');
var PackageJson_1 = require('./templates/new/PackageJson');
var Routes_1 = require('./templates/new/Routes');
var EditorConfig_1 = require('./templates/new/EditorConfig');
var IndexHtml_1 = require('./templates/new/IndexHtml');
var Readme_1 = require('./templates/new/Readme');
var PushReadme_1 = require('./templates/new/PushReadme');
var PushRoute_1 = require('./templates/new/PushRoute');
var EnvReadme_1 = require('./templates/new/EnvReadme');
var ConnectionsReadme_1 = require('./templates/new/ConnectionsReadme');
var ModelReadme_1 = require('./templates/new/ModelReadme');
var Connectors_1 = require('./templates/new/Connectors');
var TslintJson_1 = require('./templates/new/TslintJson');
var TsConfigJson_1 = require('./templates/new/TsConfigJson');
var Connection_1 = require('./templates/connection/Connection');
var ConnectionGen_1 = require('./templates/connection/ConnectionGen');
var TemplateModel_1 = require('./TemplateModel');
var Gii = (function () {
    function Gii() {
        this.templatesFolder = "./templates/";
        /**
         * available Templates
         * ```javascript
         * let gii:Gii = new Gii();
         * let env:TemplateModel = gii.getTemplateByName('env');
         * env.instance.name = 'prod';
         * console.log(env.instance.template);
         * ```
         */
        this.templates = [
            new TemplateModel_1.TemplateModel('env', new EnvironmentTemplate_1.EnvironmentTemplate()),
            new TemplateModel_1.TemplateModel('app', new App_1.App()),
            new TemplateModel_1.TemplateModel('relutionhjson', new RelutionHjson_1.RelutionHjson()),
            new TemplateModel_1.TemplateModel('relutionignore', new RelutionIgnore_1.RelutionIgnore()),
            new TemplateModel_1.TemplateModel('gitignore', new GitIgnore_1.GitIgnore()),
            new TemplateModel_1.TemplateModel('package', new PackageJson_1.PackageJson()),
            new TemplateModel_1.TemplateModel('routes', new Routes_1.Routes()),
            new TemplateModel_1.TemplateModel('editorconfig', new EditorConfig_1.EditorConfig()),
            new TemplateModel_1.TemplateModel('index.html', new IndexHtml_1.IndexHtml()),
            new TemplateModel_1.TemplateModel('readme', new Readme_1.Readme()),
            new TemplateModel_1.TemplateModel('pushreadme', new PushReadme_1.PushReadme()),
            new TemplateModel_1.TemplateModel('envreadme', new EnvReadme_1.EnvReadme()),
            new TemplateModel_1.TemplateModel('modelreadme', new ModelReadme_1.ModelReadme()),
            new TemplateModel_1.TemplateModel('connectionsreadme', new ConnectionsReadme_1.ConnectionsReadme()),
            new TemplateModel_1.TemplateModel('connectors', new Connectors_1.Connectors()),
            new TemplateModel_1.TemplateModel('connection', new Connection_1.Connection()),
            new TemplateModel_1.TemplateModel('connectionGen', new ConnectionGen_1.ConnectionGen()),
            new TemplateModel_1.TemplateModel('pushroute', new PushRoute_1.PushRoute()),
            new TemplateModel_1.TemplateModel('tslint', new TslintJson_1.TslintJson()),
            new TemplateModel_1.TemplateModel('tsconfig', new TsConfigJson_1.TsConfigJson())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2lpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dpaS9HaWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBOzs7R0FHRztBQUNILHVCQUF3QixRQUFRLENBQUMsQ0FBQTtBQUVqQyxvQ0FBa0MsaUNBQWlDLENBQUMsQ0FBQTtBQUNwRSxvQkFBaUMscUJBQXFCLENBQUMsQ0FBQTtBQUN2RCw4QkFBcUQsK0JBQStCLENBQUMsQ0FBQTtBQUNyRiwrQkFBdUQsZ0NBQWdDLENBQUMsQ0FBQTtBQUN4RiwwQkFBNkMsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RSw0QkFBaUQsNkJBQTZCLENBQUMsQ0FBQTtBQUMvRSx1QkFBdUMsd0JBQXdCLENBQUMsQ0FBQTtBQUNoRSw2QkFBbUQsOEJBQThCLENBQUMsQ0FBQTtBQUNsRiwwQkFBd0IsMkJBQTJCLENBQUMsQ0FBQTtBQUNwRCx1QkFBdUMsd0JBQXdCLENBQUMsQ0FBQTtBQUNoRSwyQkFBK0MsNEJBQTRCLENBQUMsQ0FBQTtBQUM1RSwwQkFBNkMsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RSwwQkFBNkMsMkJBQTJCLENBQUMsQ0FBQTtBQUN6RSxrQ0FBNkQsbUNBQW1DLENBQUMsQ0FBQTtBQUNqRyw0QkFBaUQsNkJBQTZCLENBQUMsQ0FBQTtBQUMvRSwyQkFBK0MsNEJBQTRCLENBQUMsQ0FBQTtBQUM1RSwyQkFBK0MsNEJBQTRCLENBQUMsQ0FBQTtBQUM1RSw2QkFBbUQsOEJBQThCLENBQUMsQ0FBQTtBQUNsRiwyQkFBK0MsbUNBQW1DLENBQUMsQ0FBQTtBQUNuRiw4QkFBcUQsc0NBQXNDLENBQUMsQ0FBQTtBQUM1Riw4QkFBNEIsaUJBQWlCLENBQUMsQ0FBQTtBQUU5QztJQUFBO1FBRVMsb0JBQWUsR0FBVyxjQUFjLENBQUM7UUFFaEQ7Ozs7Ozs7O1dBUUc7UUFFSSxjQUFTLEdBQXlCO1lBQ3ZDLElBQUksNkJBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDO1lBQ25ELElBQUksNkJBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxTQUFXLEVBQUUsQ0FBQztZQUMzQyxJQUFJLDZCQUFhLENBQUMsZUFBZSxFQUFFLElBQUksNkJBQXFCLEVBQUUsQ0FBQztZQUMvRCxJQUFJLDZCQUFhLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSwrQkFBc0IsRUFBRSxDQUFDO1lBQ2pFLElBQUksNkJBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxxQkFBaUIsRUFBRSxDQUFDO1lBQ3ZELElBQUksNkJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSx5QkFBbUIsRUFBRSxDQUFDO1lBQ3ZELElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxlQUFjLEVBQUUsQ0FBQztZQUNqRCxJQUFJLDZCQUFhLENBQUMsY0FBYyxFQUFFLElBQUksMkJBQW9CLEVBQUUsQ0FBQztZQUM3RCxJQUFJLDZCQUFhLENBQUMsWUFBWSxFQUFFLElBQUkscUJBQVMsRUFBRSxDQUFDO1lBQ2hELElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxlQUFjLEVBQUUsQ0FBQztZQUNqRCxJQUFJLDZCQUFhLENBQUMsWUFBWSxFQUFFLElBQUksdUJBQWtCLEVBQUUsQ0FBQztZQUN6RCxJQUFJLDZCQUFhLENBQUMsV0FBVyxFQUFFLElBQUkscUJBQWlCLEVBQUUsQ0FBQztZQUN2RCxJQUFJLDZCQUFhLENBQUMsYUFBYSxFQUFFLElBQUkseUJBQW1CLEVBQUUsQ0FBQztZQUMzRCxJQUFJLDZCQUFhLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxxQ0FBeUIsRUFBRSxDQUFDO1lBQ3ZFLElBQUksNkJBQWEsQ0FBQyxZQUFZLEVBQUUsSUFBSSx1QkFBa0IsRUFBRSxDQUFDO1lBQ3pELElBQUksNkJBQWEsQ0FBQyxZQUFZLEVBQUUsSUFBSSx1QkFBa0IsRUFBRSxDQUFDO1lBQ3pELElBQUksNkJBQWEsQ0FBQyxlQUFlLEVBQUUsSUFBSSw2QkFBcUIsRUFBRSxDQUFDO1lBQy9ELElBQUksNkJBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxxQkFBaUIsRUFBRSxDQUFDO1lBQ3ZELElBQUksNkJBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSx1QkFBa0IsRUFBRSxDQUFDO1lBQ3JELElBQUksNkJBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSwyQkFBb0IsRUFBRSxDQUFDO1NBQzFELENBQUM7SUFTSixDQUFDO0lBUFEsK0JBQWlCLEdBQXhCLFVBQXlCLElBQVk7UUFDbkMsSUFBSSxhQUFhLEdBQVcsa0JBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNILFVBQUM7QUFBRCxDQUFDLEFBNUNELElBNENDO0FBNUNZLFdBQUcsTUE0Q2YsQ0FBQSJ9