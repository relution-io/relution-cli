"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var chalk = require('chalk');
var lodash_1 = require('lodash');
var rxjs_1 = require('@reactivex/rxjs');
var Validator_1 = require('./../utility/Validator');
var EnvCollection_1 = require('./../collection/EnvCollection');
var FileApi_1 = require('./../utility/FileApi');
var Gii_1 = require('./../gii/Gii');
var ChooseEnv_1 = require('./environment/ChooseEnv');
var AddAttribute_1 = require('./environment/AddAttribute');
var Environment = (function (_super) {
    __extends(Environment, _super);
    function Environment() {
        _super.call(this, 'env');
        /**
         * available commands
         */
        this.commands = {
            add: {
                description: 'add a new Environment',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            update: {
                description: 'Add a new key value pair to your Environment.',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            copy: {
                description: 'copy a exist Environment',
                vars: {
                    from: {
                        pos: 0
                    },
                    name: {
                        pos: 1
                    }
                }
            },
            list: {
                description: 'List all environments by name'
            },
            help: {
                description: this.i18n.LIST_COMMAND('Environment')
            },
            quit: {
                description: 'Exit To Home'
            }
        };
        /**
         * hjson file helper
         */
        this.fsApi = new FileApi_1.FileApi();
        /**
         * code generator
         */
        this.gii = new Gii_1.Gii();
        /**
         * the collection of the available environments
         */
        this.envCollection = new EnvCollection_1.EnvCollection();
        /**
         * prompt for add key value pair
         */
        this.addAttribute = new AddAttribute_1.AddAttribute();
        this.fsApi.path = process.cwd() + "/env/";
    }
    /**
     * write the hjson to the dev folder
     * @todo add process.cwd as path
     * @params name create a <$name>.hjson in the project env folder
     * @returns Observable
     */
    Environment.prototype.createEnvironment = function (name) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var template = _this.gii.getTemplateByName(_this.name);
            _this.fsApi.writeHjson(template.instance.render(name.toLowerCase()), name.toLowerCase()).subscribe(function (pipe) {
                observer.next("Environment " + name + " is generated");
            }, function (e) { observer.error(e); }, function () {
                _this.envCollection.getEnvironments().subscribe({
                    complete: function () { return observer.complete(); }
                });
            });
        });
    };
    /**
     * overwrite Commnad preload and load environments before
     * @returns Observable
     */
    Environment.prototype.preload = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _this.envCollection.getEnvironments().subscribe({
                error: function (e) {
                    console.log(e);
                    // observer.error('no environments available');
                    _super.prototype.preload.call(_this).subscribe({
                        complete: function () { return observer.complete(); }
                    });
                },
                complete: function () {
                    // this.log.debug(this.envCollection.collection);
                    _this.chooseEnv = new ChooseEnv_1.ChooseEnv(_this.envCollection);
                    _super.prototype.preload.call(_this).subscribe({
                        complete: function () { return observer.complete(); }
                    });
                }
            });
        });
    };
    Object.defineProperty(Environment.prototype, "_addName", {
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
                    message: this.i18n.ENTER_SOMETHING.concat('Environment name'),
                    validate: function (value) {
                        var done = this.async();
                        if (self.envCollection.isUnique(value)) {
                            self.log.error(new Error(self.i18n.ALREADY_EXIST(value)));
                            done(false);
                        }
                        var pass = value.match(Validator_1.Validator.stringPattern);
                        if (pass) {
                            done(null, true);
                        }
                        else {
                            self.log.error(new Error(self.i18n.NOT_ALLOWED(value, Validator_1.Validator.stringPattern)));
                            done(false);
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
    Environment.prototype.enterName = function () {
        var prompt = this._addName;
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * inquirer for add a key valu store
     */
    Environment.prototype.getAttributes = function (store) {
        var _this = this;
        return this.addAttribute.store()
            .exhaustMap(function (answers) {
            store.push({ key: answers.key.trim(), value: answers.value.trim() });
            return _this.addAttribute.addAnother();
        })
            .exhaustMap(function (answers) {
            // no one more set stor back
            if (!answers.another) {
                return rxjs_1.Observable.create(function (observer) {
                    observer.next(store);
                    observer.complete();
                });
            }
            return _this.getAttributes(store);
        });
    };
    /**
     * add a new key valu pair or many
     */
    Environment.prototype.update = function (name) {
        var _this = this;
        var names = [];
        return this.chooseEnv.choose()
            .filter(function (answers) {
            return answers[_this.chooseEnv.promptName].indexOf(_this.i18n.TAKE_ME_OUT) === -1;
        })
            .exhaustMap(function (answers) {
            names = answers[_this.chooseEnv.promptName];
            return _this.getAttributes([]);
        })
            .exhaustMap(function (store) {
            return _this.envCollection.bulkUpdate(names, store).map(function () {
                return "Update complete";
            });
        });
    };
    /**
     * shows all available environments
     * @returns Observable
     */
    Environment.prototype.list = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var content = [['']];
            var tableHeader = ['Environment Name'];
            _this.envCollection.getEnvironments().subscribe({
                complete: function () {
                    var list = _this.envCollection.flatEnvArray();
                    list.forEach(function (name) {
                        content.push([chalk.yellow("" + name)]);
                    });
                    if (content.length < 1) {
                        observer.complete();
                    }
                    observer.next(_this.table.sidebar(content, tableHeader));
                    observer.complete();
                }
            });
        });
    };
    /**
     * copy a exits environment and set the name
     */
    Environment.prototype.copy = function (args) {
        var _this = this;
        var tobeCopied;
        var toBeGenerate;
        if (!args || args && !args[0].length) {
            return this.chooseEnv.choose('list', this.i18n.SELECT('Environment'))
                .exhaustMap(function (answers) {
                tobeCopied = answers[_this.chooseEnv.promptName];
                return _this.enterName();
            })
                .exhaustMap(function (answers) {
                toBeGenerate = answers.name;
                return _this.envCollection.copyByName(tobeCopied, toBeGenerate);
            });
        }
        if (args && args[0].length && args[1].length) {
            tobeCopied = args[0];
            toBeGenerate = args[1];
            return this.envCollection.copyByName(tobeCopied, toBeGenerate)
                .do(function (data) {
                _this.log.info(_this.i18n.HJSON_WRITTEN(toBeGenerate));
            });
        }
    };
    /**
     * add a new Environment allow attributes name as a string
     * @returns Observable
     */
    Environment.prototype.add = function (name) {
        var _this = this;
        // ['relution', 'env', 'add']
        if (!name || !name.length) {
            return this.enterName()
                .exhaustMap(function (answers) {
                return _this.createEnvironment(answers.name);
            })
                .exhaustMap(function (log) {
                _this.log.info(log + " \n");
                return _this.list();
            });
        }
        // >relution env add bubble
        // this.log.debug('name', name);
        if (lodash_1.isArray(name)) {
            // this.log.debug('isArray(name)', isArray(name));
            var envName_1 = name[0];
            // this.log.debug('envName', envName);
            var pass = envName_1.match(Validator_1.Validator.stringPattern);
            // this.log.debug('pass', pass);
            var unique = this.envCollection.isUnique(envName_1);
            // this.log.debug('unique', unique);
            if (unique) {
                return rxjs_1.Observable.create(function (observer) {
                    observer.error(_this.i18n.ALREADY_EXIST(envName_1));
                    observer.complete();
                });
            }
            if (pass) {
                return rxjs_1.Observable.create(function (observer) {
                    _this.createEnvironment(envName_1).subscribe(function () {
                        observer.next(_this.i18n.HJSON_WRITTEN(envName_1));
                    }, function (e) {
                        observer.error(e);
                    }, function () {
                        observer.complete();
                    });
                });
            }
            return rxjs_1.Observable.create(function (observer) {
                observer.next(_this.i18n.NOT_ALLOWED(envName_1, Validator_1.Validator.stringPattern));
                observer.complete();
            });
        }
    };
    return Environment;
}(Command_1.Command));
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map