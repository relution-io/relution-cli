"use strict";
var path = require('path');
var inquirer = require('inquirer');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var Translation_1 = require('./../../utility/Translation');
var Gii_1 = require('./../../gii/Gii');
var FileApi_1 = require('./../../utility/FileApi');
var DebugLog_1 = require('./../../utility/DebugLog');
var camelCase = require('camel-case');
var Create = (function () {
    function Create() {
        this._gii = new Gii_1.Gii();
        this._fsApi = new FileApi_1.FileApi();
        this.rootProjectFolder = process.cwd();
        // create in the project folder a folder
        this.emptyFolders = [
            'env',
            'routes',
            'models',
            'connections',
            'push',
            'www'
        ];
        // files to be generated
        this.toGenTemplatesName = [
            'app',
            'editorconfig',
            'package',
            'relutionhjson',
            'relutionignore',
            'gitignore',
            'routes',
            'readme',
            'connectors',
            'modelreadme',
            'connectionsreadme',
            'envreadme',
            'pushreadme',
            'pushroute',
            'tslint',
            'tsconfig',
            'index.html'
        ];
    }
    /**
     * write folders to the project folder
     */
    Create.prototype.addStructure = function () {
        var _this = this;
        var all = [];
        this.emptyFolders.forEach(function (folderName) {
            all.push(_this._fsApi.mkdirStructureFolder(_this.rootProjectFolder + "/" + folderName));
        });
        return rxjs_1.Observable.forkJoin(all);
    };
    Object.defineProperty(Create.prototype, "_addName", {
        /**
         * add a name for a new environment
         * @returns Array
         */
        get: function () {
            return [
                {
                    type: 'input',
                    name: 'name',
                    default: camelCase(path.basename(process.cwd())),
                    message: Translation_1.Translation.ENTER_SOMETHING.concat('Project name'),
                    validate: function (value) {
                        var pass = value.match(Validator_1.Validator.stringPattern);
                        if (pass) {
                            return true;
                        }
                        else {
                            DebugLog_1.DebugLog.error(new Error(Translation_1.Translation.NOT_ALLOWED(value, Validator_1.Validator.stringPattern)));
                            return false;
                        }
                    }
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * create a prompt to enter a name
     * @returns Observable
     */
    Create.prototype.enterName = function () {
        var prompt = this._addName;
        return rxjs_1.Observable.fromPromise(inquirer.prompt(prompt));
    };
    /**
     * create the "toGenTemplatesName" as file
     */
    Create.prototype.writeTemplates = function (name) {
        var _this = this;
        var writingFiles = [];
        this.toGenTemplatesName.forEach(function (templateName) {
            var templateGii = _this._gii.getTemplateByName(templateName);
            templateGii.instance.name = name;
            // root or in a subfolder
            var toGenPath = templateGii.instance.parentFolder ? _this.rootProjectFolder + "/" + templateGii.instance.parentFolder + "/" : _this.rootProjectFolder;
            // DebugLog.debug(toGenPath);
            writingFiles.push(_this._fsApi.writeFile(templateGii.instance.template, templateGii.instance.publishName, toGenPath));
        });
        return rxjs_1.Observable.forkJoin(writingFiles);
    };
    /**
     * npm install
     */
    Create.prototype.npmInstall = function () {
        var exec = require('child_process').exec;
        return rxjs_1.Observable.create(function (observer) {
            return exec('npm install', function (error, stdout, stderr) {
                if (error) {
                    observer.error("exec error: " + error);
                    return;
                }
                DebugLog_1.DebugLog.debug(stdout);
                exec('typings i', function (error, stdout, stderr) {
                    if (error) {
                        observer.error("exec error: " + error);
                        return;
                    }
                    DebugLog_1.DebugLog.debug(stdout);
                    observer.next();
                    observer.complete();
                });
            });
        });
    };
    Create.prototype.installTypings = function () {
        var exec = require('child_process').exec;
        return rxjs_1.Observable.create(function (observer) {
            exec("typings install dt~es6-collections env~node dt~q dt~es6-promise dt~express dt~serve-static dt~express-serve-static-core dt~multer dt~body-parser --save --global", function (e, dout, derr) {
                if (e) {
                    observer.error("exec error: " + e);
                    return;
                }
                DebugLog_1.DebugLog.debug(dout);
                exec("typings install npm~lodash npm~mime --save", function (err, ddout, dderr) {
                    if (err) {
                        observer.error("exec error: " + err);
                        return;
                    }
                    DebugLog_1.DebugLog.debug(ddout);
                    exec("tsconfig && tsc -p " + process.cwd(), function (err, ddout, dderr) {
                        if (err) {
                            observer.error("exec error: " + err);
                            return;
                        }
                        DebugLog_1.DebugLog.debug(ddout);
                    });
                });
            });
        });
    };
    /**
     * create a new project
     */
    Create.prototype.publish = function (name, test) {
        var _this = this;
        if (test === void 0) { test = false; }
        if (!name || !name.length) {
            return this.enterName()
                .exhaustMap(function (answers) {
                _this.name = answers.name;
                return _this.addStructure();
            })
                .exhaustMap(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.FOLDERS_WRITTEN(_this.emptyFolders.toString()));
                return _this.writeTemplates(_this.name);
            })
                .exhaustMap(function (err) {
                DebugLog_1.DebugLog.info(Translation_1.Translation.FILES_WRITTEN(_this.toGenTemplatesName.toString()));
                DebugLog_1.DebugLog.info(Translation_1.Translation.NPM_INSTALL);
                return _this.npmInstall();
            })
                .exhaustMap(function () {
                return rxjs_1.Observable.create(function (observer) {
                    var exec = require('child_process').exec;
                    exec("tsc -p " + process.cwd());
                    observer.complete();
                });
            })
                .do(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.WRITTEN(_this.name, 'Project'));
            });
        }
        else if (name && name.length) {
            this.name = name;
            return this.addStructure()
                .exhaustMap(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.FOLDERS_WRITTEN(_this.emptyFolders.toString()));
                return _this.writeTemplates(_this.name);
            })
                .exhaustMap(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.FILES_WRITTEN(_this.toGenTemplatesName.toString()));
                DebugLog_1.DebugLog.info(Translation_1.Translation.NPM_INSTALL);
                return _this.npmInstall().last();
            })
                .exhaustMap(function () {
                return rxjs_1.Observable.create(function (observer) {
                    var exec = require('child_process').exec;
                    exec("tsc -p " + process.cwd());
                    observer.complete();
                });
            })
                .do(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.WRITTEN(_this.name, 'Project'));
            });
        }
    };
    Object.defineProperty(Create.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    return Create;
}());
exports.Create = Create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3Byb2plY3QvQ3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUM3QixJQUFZLFFBQVEsV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUVyQyxxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQywwQkFBd0IsMkJBQTJCLENBQUMsQ0FBQTtBQUNwRCw0QkFBMEIsNkJBQTZCLENBQUMsQ0FBQTtBQUN4RCxvQkFBa0IsaUJBQWlCLENBQUMsQ0FBQTtBQUVwQyx3QkFBc0IseUJBQXlCLENBQUMsQ0FBQTtBQUNoRCx5QkFBdUIsMEJBQTBCLENBQUMsQ0FBQTtBQUVsRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFeEM7SUFxQ0U7UUFuQ1EsU0FBSSxHQUFRLElBQUksU0FBRyxFQUFFLENBQUM7UUFDdEIsV0FBTSxHQUFZLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBRWpDLHNCQUFpQixHQUFXLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqRCx3Q0FBd0M7UUFDakMsaUJBQVksR0FBa0I7WUFDbkMsS0FBSztZQUNMLFFBQVE7WUFDUixRQUFRO1lBQ1IsYUFBYTtZQUNiLE1BQU07WUFDTixLQUFLO1NBQ04sQ0FBQztRQUVGLHdCQUF3QjtRQUNqQix1QkFBa0IsR0FBa0I7WUFDekMsS0FBSztZQUNMLGNBQWM7WUFDZCxTQUFTO1lBQ1QsZUFBZTtZQUNmLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsUUFBUTtZQUNSLFFBQVE7WUFDUixZQUFZO1lBQ1osYUFBYTtZQUNiLG1CQUFtQjtZQUNuQixXQUFXO1lBQ1gsWUFBWTtZQUNaLFdBQVc7WUFDWCxRQUFRO1lBQ1IsVUFBVTtZQUNWLFlBQVk7U0FDYixDQUFDO0lBSUYsQ0FBQztJQUNEOztPQUVHO0lBQ0gsNkJB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