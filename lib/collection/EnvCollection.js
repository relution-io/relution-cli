"use strict";
var EnvModel_1 = require('./../models/EnvModel');
var FileApi_1 = require('./../utility/FileApi');
var Validator_1 = require('./../utility/Validator');
var rxjs_1 = require('@reactivex/rxjs');
var lodash_1 = require('lodash');
var chalk = require('chalk');
var hjson = require('hjson');
var events_1 = require('events');
/**
 * @class EnvCollection the collection Helper Class for the environments
 */
var EnvCollection = (function () {
    function EnvCollection() {
        var _this = this;
        /**
         * @param collection a array of Environments
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
        this.changeDispatcher = new events_1.EventEmitter();
        this.changeDispatcher.on('changed', function (self) {
            if (self !== _this) {
                console.log('fetch new');
                _this.getEnvironments().subscribe();
            }
        });
    }
    /**
     * load all hjson file with content and add it to the collection
     * @param observer to will be completed
     * @returns Observable
     */
    EnvCollection.prototype.loadCollection = function (envFiles) {
        var _this = this;
        this.collection = [];
        return envFiles.map(function (envFile) {
            return _this.fsApi.readHjson(_this.envFolder + "/" + envFile);
        })
            .concatAll()
            .map(function (model) {
            return new EnvModel_1.EnvModel(model.data.name, model.path, model.data);
        })
            .reduce(function (collection, model) {
            collection.push(model);
            return collection;
        }, this.collection);
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
        this.fsApi.path = this.envFolder;
        return this.loadCollection(this.fsApi.fileList(this.envFolder, '.hjson').do(function (filePath) {
            _this.envFiles.push(filePath);
        }));
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
                observer.error(chalk.red(name + " or " + to + " are not valid.\n        Only Allowed " + Validator_1.Validator.stringPattern));
                return observer.complete();
            });
        }
        return rxjs_1.Observable.create(function (observer) {
            var model = _this.isUnique(name);
            if (!model) {
                observer.error(chalk.red("environment with name \"" + chalk.magenta(name) + "\" not exist,\n        please add it before."));
                return observer.complete();
            }
            if (_this.isUnique(to)) {
                observer.error(chalk.red(to + " already exist please remove it before."));
                return observer.complete();
            }
            var newData = _this.fsApi.copyHjson(model.data);
            newData.name = to;
            _this.fsApi.writeHjson(hjson.stringify(newData, _this.fsApi.hjsonOptions), to)
                .subscribe({
                complete: function () {
                    _this.getEnvironments().subscribe({
                        next: function () {
                            observer.next(to + " are created.");
                        },
                        complete: function () {
                            observer.complete();
                            // @todo we dont need it
                            _this.changeDispatcher.emit('changed', _this);
                        }
                    });
                }
            });
        });
    };
    /**
     * overwrite a existing env file with attributes
     */
    EnvCollection.prototype.updateModelByName = function (name, attributes) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var modelIndex = lodash_1.findIndex(_this.collection, { name: name });
            var model = _this.collection[modelIndex];
            attributes.forEach(function (attr) {
                model.data[attr.key] = attr.value;
            });
            console.log(model.data);
            _this.fsApi.writeHjson(hjson.stringify(model.data, _this.fsApi.hjsonOptions), model.name)
                .subscribe(function (answer) {
                if (answer) {
                    console.log(chalk.magenta("File Environment " + model.name + " are written"));
                }
                observer.next(answer);
            }, function (e) { return observer.error(e); }, function () {
                _this.changeDispatcher.emit('changed', _this);
                observer.complete();
            });
        });
    };
    EnvCollection.prototype.bulkUpdate = function (env, store) {
        var _this = this;
        if (!env.length) {
            return rxjs_1.Observable.throw(new Error('Please use env add before'));
        }
        if (!store.length) {
            return rxjs_1.Observable.throw(new Error('Store can not be empty'));
        }
        var all = [];
        env.forEach(function (envName) {
            all.push(_this.updateModelByName(envName, store));
        });
        return rxjs_1.Observable.forkJoin(all);
    };
    return EnvCollection;
}());
exports.EnvCollection = EnvCollection;
//# sourceMappingURL=EnvCollection.js.map