"use strict";
var rxjs_1 = require('@reactivex/rxjs');
var chalk = require('chalk');
var Validator_1 = require('./../../utility/Validator');
var Translation_1 = require('./../../utility/Translation');
var Gii_1 = require('./../../gii/Gii');
var FileApi_1 = require('./../../utility/FileApi');
var inquirer = require('inquirer');
var Create = (function () {
    function Create() {
        this._gii = new Gii_1.Gii();
        this._fsApi = new FileApi_1.FileApi();
        this.toGenTemplatesName = ['app', 'package', 'relutionhjson'];
    }
    Object.defineProperty(Create.prototype, "_addName", {
        /**
         * add a name for a new environment
         * @returns Array
         */
        get: function () {
            var self = this;
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
                            console.log(chalk.red("\n Name " + value + " has wrong character allowed only [a-z A-Z]"));
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
    Create.prototype.writeTemplates = function () {
        var _this = this;
        var attr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            attr[_i - 0] = arguments[_i];
        }
        return rxjs_1.Observable.create(function (observer) {
            var templates = [];
            var writingFiles = [];
            _this.toGenTemplatesName.forEach(function (name) {
                console.log(attr[0].name);
                var templateGii = _this._gii.getTemplateByName(name);
                templateGii.instance.name = attr[0].name.name;
                console.log(templateGii.instance.template);
                writingFiles.push(_this._fsApi.writeFile(templateGii.instance.template, templateGii.instance.publishName));
            });
            rxjs_1.Observable.forkJoin(writingFiles).subscribe({ complete: function () {
                    observer.complete();
                } });
            //console.log(JSON.stringify(templates, null, 2));
        });
    };
    Create.prototype.publish = function (name) {
        var _this = this;
        if (!name || !name.length) {
            return rxjs_1.Observable.create(function (observer) {
                _this.enterName().subscribe(function (answers) {
                    console.log(answers);
                    _this.name = answers;
                    observer.next(_this.name);
                    _this.writeTemplates({ name: _this.name }).subscribe(function (status) {
                        console.log(status);
                    });
                });
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