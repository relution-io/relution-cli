"use strict";
var EnvModel_1 = require('./../models/EnvModel');
var FileApi_1 = require('./../utility/FileApi');
var Validator_1 = require('./../utility/Validator');
var rxjs_1 = require('@reactivex/rxjs');
var lodash_1 = require('lodash');
var chalk = require('chalk');
var Hjson = require('hjson');
/**
 * @class EnvCollection the collection Helper Class for the environments
 */
var EnvCollection = (function () {
    function EnvCollection() {
        /**
         * @param collection a array off Environments
         */
        this.collection = [];
        /**
         * @param envFiles available files from the envFolder Path
         */
        this.envFiles = [];
        /**
         * @param envFolder root folder from the env/<name>.hjson
         */
        this.envFolder = process.cwd() + "/env/";
        /**
         * @param fsApi file helper
         */
        this.fsApi = new FileApi_1.FileApi();
    }
    /**
     * load all hjson file with content and add it to the collection
     * @param observer to will be completed
     * @returns Observable
     */
    EnvCollection.prototype.setCollection = function (observer) {
        var _this = this;
        var datas = [];
        var all = [];
        this.collection = [];
        this.fsApi.path = this.envFolder;
        this.envFiles.forEach(function (file) {
            if (file) {
                all.push(_this.fsApi.readHjson(_this.envFolder + "/" + file));
            }
        });
        rxjs_1.Observable.forkJoin(all).subscribe(function (hjsons) {
            hjsons.forEach(function (data) {
                var model = new EnvModel_1.EnvModel(data.data.name, data.path, data.data);
                _this.collection.push(model);
            });
            observer.next(_this.collection);
        }, function () { }, function () { observer.complete(); });
    };
    EnvCollection.prototype.validate = function (name) {
        var namePass = name.match(Validator_1.Validator.stringPattern);
        return namePass;
    };
    /**
     * if match the name in the collection
     * @param name the name: "" from your hjson file
     * @returns EnvModel
     */
    EnvCollection.prototype.isUnique = function (name) {
        var test = lodash_1.find(this.collection, { name: name });
        //console.log('test', this.collection, test);
        return test;
    };
    /**
     * load all available hjson file from the envFolder and preload the collection
     * @param name the name: "" from your hjson file
     * @returns Observable
     */
    EnvCollection.prototype.getEnvironments = function () {
        var _this = this;
        this.envFiles = [];
        this.collection = [];
        return rxjs_1.Observable.create(function (observer) {
            _this.fsApi.fileList(_this.envFolder, '.hjson')
                .subscribe({
                error: function (e) {
                    return observer.complete();
                },
                next: function (filePath) {
                    if (filePath) {
                        // console.log('filePath', filePath);
                        _this.envFiles.push(filePath);
                    }
                },
                complete: function () {
                    if (!_this.envFiles.length) {
                        observer.next([]);
                        return observer.complete();
                    }
                    return _this.setCollection(observer);
                }
            });
        });
    };
    /**
     * return available names from the hjson files
     * @returns Array
     */
    EnvCollection.prototype.flatEnvArray = function () {
        var flat = [];
        this.collection.forEach(function (model) {
            flat.push(model.name);
        });
        return flat;
    };
    /**
     * copy a envModel and create the Hjson file in the envFolder
     */
    EnvCollection.prototype.copyByName = function (name, to) {
        var _this = this;
        if (!this.validate(name) || !this.validate(to)) {
            return rxjs_1.Observable.create(function (observer) {
                observer.error(chalk.red(name + " or " + to + " are not valid. only Allowed " + Validator_1.Validator.stringPattern));
                return observer.complete();
            });
        }
        return rxjs_1.Observable.create(function (observer) {
            var model = _this.isUnique(name);
            if (!model) {
                observer.error(chalk.red("environment with name \"" + chalk.magenta(name) + "\" not exist, please add it before."));
                return observer.complete();
            }
            if (_this.isUnique(to)) {
                observer.error(chalk.red(to + " already exist please remove it before."));
                return observer.complete();
            }
            var newData = _this.fsApi.copyHjson(model.data);
            newData.name = to;
            _this.fsApi.writeHjson(Hjson.stringify(newData, _this.fsApi.hjsonOptions), to).subscribe({
                complete: function () {
                    _this.getEnvironments().subscribe({
                        next: function () {
                            observer.next(to + " are created.");
                        },
                        complete: function () {
                            observer.complete();
                        }
                    });
                }
            });
        });
    };
    EnvCollection.prototype.updateModelByName = function (name, attributes) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var modelIndex = lodash_1.findIndex(_this.collection, { name: name });
            var model = _this.collection[modelIndex];
            attributes.forEach(function (attr) {
                model.data[attr.key] = attr.value;
            });
            // console.log(model);
            _this.fsApi.writeHjson(Hjson.stringify(model.data, _this.fsApi.hjsonOptions), model.name).subscribe(function (answer) {
                if (answer) {
                    console.log(chalk.magenta("File Environment " + model.name + " are written"));
                }
                observer.next(answer);
            }, function (e) { return observer.error(e); }, function () { return observer.complete(); });
        });
    };
    EnvCollection.prototype.bulkUpdate = function (env, store) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            if (!store.length) {
                observer.error('Store can not be empty');
                return observer.complete();
            }
            var all = [];
            env.forEach(function (envName) {
                all.push(_this.updateModelByName(envName, store));
            });
            if (all.length) {
                rxjs_1.Observable.forkJoin(all).subscribe(function (answers) {
                    observer.next(answers);
                }, function (e) { return observer.error(); }, function () { return observer.complete(); });
            }
        });
    };
    return EnvCollection;
}());
exports.EnvCollection = EnvCollection;
//# sourceMappingURL=EnvCollection.js.map