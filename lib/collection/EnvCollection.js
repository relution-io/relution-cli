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
            // console.log(envFile);
            return _this.fsApi.readHjson(_this.envFolder + "/" + envFile);
        })
            .concatAll()
            .map(function (model) {
            return new EnvModel_1.EnvModel(model.data.name, model.path, model.data);
        })
            .reduce(function (collection, model) {
            collection.push(model);
            // console.log('collection', collection);
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
            // console.log(filePath);
            _this.envFiles.push(filePath);
        }, function (e) {
            throw e;
        }, function () {
            return _this.envFiles;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52Q29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2xsZWN0aW9uL0VudkNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUF1QixzQkFBc0IsQ0FBQyxDQUFBO0FBQzlDLHdCQUFzQixzQkFBc0IsQ0FBQyxDQUFBO0FBQzdDLDBCQUF3Qix3QkFBd0IsQ0FBQyxDQUFBO0FBQ2pELHFCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLHVCQUE4QixRQUFRLENBQUMsQ0FBQTtBQUN2QyxJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUMvQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsdUJBQTJCLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDOztHQUVHO0FBQ0g7SUFzQkU7UUF0QkYsaUJBeU1DO1FBeE1DOztXQUVHO1FBQ0ksZUFBVSxHQUFvQixFQUFFLENBQUM7UUFDeEM7O1dBRUc7UUFDSSxhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUNwQzs7V0FFRztRQUNJLGNBQVMsR0FBYyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQU8sQ0FBQztRQUNuRDs7V0FFRztRQUNJLFVBQUssR0FBWSxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQU9wQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7UUFFM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxJQUFTO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixLQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7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