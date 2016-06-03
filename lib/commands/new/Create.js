"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../../utility/Validator');
var Translation_1 = require('./../../utility/Translation');
var Gii_1 = require('./../../gii/Gii');
var FileApi_1 = require('./../../utility/FileApi');
var inquirer = require('inquirer');
var npm = require('npm');
var DebugLog_1 = require('./../../utility/DebugLog');
var Create = (function () {
    function Create() {
        this._gii = new Gii_1.Gii();
        this._fsApi = new FileApi_1.FileApi();
        this.rootProjectFolder = process.cwd();
        // create in the project folder a folder with a gitkeep file
        this.emptyFolders = [
            'env',
            'routes',
            'models',
            'connections',
            'push'
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
            'pushreadme'
        ];
        npm.load();
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
        npm.commands.install();
        var installer = rxjs_1.Observable.bindNodeCallback(npm.commands.install);
        return installer();
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
                .exhaustMap(function () {
                DebugLog_1.DebugLog.info(Translation_1.Translation.FILES_WRITTEN(_this.toGenTemplatesName.toString()));
                DebugLog_1.DebugLog.info(Translation_1.Translation.NPM_INSTALL);
                return _this.npmInstall();
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
                return _this.npmInstall();
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
//# sourceMappingURL=Create.js.map