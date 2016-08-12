"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./Command');
var FileApi_1 = require('./../utility/FileApi');
var RxFs_1 = require('./../utility/RxFs');
var PushCollection_1 = require('./../collection/PushCollection');
var rxjs_1 = require('@reactivex/rxjs');
var path = require('path');
var chalk = require('chalk');
var Validator_1 = require('./../utility/Validator');
var lodash_1 = require('lodash');
/**
 * Push
 * ```bash
 * ┌─────────┬──────────┬──────────┬─────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                 │
 * │         │          │          │                             │
 * │ push    │ add      │ <$name>  │ create a push config        │
 * │ push    │ list     │ --       │ list available push configs │
 * │ push    │ help     │ --       │ List the Push Command       │
 * │ push    │ back     │ --       │ Exit to Home                │
 * │         │          │          │                             │
 * └─────────┴──────────┴──────────┴─────────────────────────────┘
 * ```
 */
var Push = (function (_super) {
    __extends(Push, _super);
    function Push() {
        var _this = this;
        _super.call(this, 'push');
        this.collection = new PushCollection_1.PushCollection();
        this.types = ['ios', 'android'];
        this.fsApi = new FileApi_1.FileApi();
        this.rootFolder = process.cwd() + "/push";
        this.commands = {
            add: {
                when: function () {
                    return RxFs_1.RxFs.exist(_this.rootFolder);
                },
                why: function () {
                    return _this.i18n.FOLDER_NOT_EXIST(_this.rootFolder);
                },
                description: 'create a push config',
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            list: {
                when: function () {
                    return RxFs_1.RxFs.exist(_this.rootFolder);
                },
                why: function () {
                    return _this.i18n.FOLDER_NOT_EXIST(_this.rootFolder);
                },
                description: this.i18n.LIST_AVAILABLE_CONFIG('Push'),
            },
            help: {
                description: this.i18n.HELP_COMMAND('Push')
            },
            back: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
    }
    /**
     * simple validation for the most cases
     */
    Push.prototype._keyValid = function (value, type, pattern) {
        if (type === void 0) { type = 'Name'; }
        if (pattern === void 0) { pattern = Validator_1.Validator.stringPattern; }
        var pass = value.match(pattern);
        if (!value.length) {
            this.debuglog.error(new Error(this.i18n.NOT_EMPTY(type)));
            return false;
        }
        if (pass) {
            return true;
        }
        else {
            this.debuglog.error(new Error(this.i18n.NOT_ALLOWED(value, pattern)));
            return false;
        }
    };
    Object.defineProperty(Push.prototype, "iosPrompt", {
        /**
         * provider IOS
         */
        get: function () {
            var _this = this;
            return [
                {
                    type: 'input',
                    name: 'type',
                    default: 'APNS',
                    message: this.i18n.ENTER_SOMETHING.concat('Type (APNS)'),
                    validate: function (value) {
                        return _this._keyValid(value, 'Type');
                    }
                },
                {
                    type: 'input',
                    name: 'certificateFile',
                    message: this.i18n.ENTER_SOMETHING.concat('Certificatefile'),
                    validate: function (value) {
                        if (value.indexOf('.p12') === -1) {
                            _this.debuglog.error(new Error('Certificatefile must end with .p12'));
                            return false;
                        }
                        return _this._keyValid(value, 'Certificatefile', Validator_1.Validator.p12Pattern);
                    }
                },
                {
                    type: 'input',
                    name: 'passphrase',
                    message: this.i18n.ENTER_SOMETHING.concat('Passphrase'),
                    validate: Validator_1.Validator.notEmptyValidate
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Push.prototype, "androidPrompt", {
        /**
         * provider Android
         */
        get: function () {
            var _this = this;
            return [
                {
                    type: 'input',
                    name: 'type',
                    default: 'GCM',
                    message: this.i18n.ENTER_SOMETHING.concat('Type (GCM)'),
                    validate: function (value) {
                        return _this._keyValid(value, 'Type');
                    }
                },
                {
                    type: 'input',
                    name: 'apiKey',
                    message: this.i18n.ENTER_SOMETHING.concat('Api Key'),
                    validate: function (value) {
                        return _this._keyValid(value, 'Api Key', Validator_1.Validator.stringNumberCharsPattern);
                    }
                }
            ];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ios or android
     */
    Push.prototype._chooseProviderType = function () {
        var prompt = {
            type: 'list',
            name: 'pushType',
            message: this.i18n.CHOOSE_LIST('Provider'),
            choices: ['ios', 'android', this.i18n.CANCEL]
        };
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * you want to add also the other one ?
     */
    Push.prototype._addAnother = function (name) {
        var prompt = {
            type: 'confirm',
            name: 'another',
            message: this.i18n.ADD_ALSO("Push Provider " + name),
            default: true
        };
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * add Provider
     */
    Push.prototype._addProvider = function (type) {
        if (!type) {
            return rxjs_1.Observable.throw(new Error('Provider need a type'));
        }
        var prompt = type === 'ios' ? this.iosPrompt : this.androidPrompt;
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * shows all available environments
     * @returns Observable
     */
    Push.prototype.list = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var content = [['']];
            _this.collection.loadModels().subscribe({
                complete: function () {
                    _this.collection.pushFiles.forEach(function (file) {
                        content.push([chalk.yellow("" + file.name)]);
                    });
                    if (content.length < 1) {
                        observer.complete();
                    }
                    observer.next(_this.table.sidebar(content, _this.i18n.PUSH_LIST_TABLEHEADERS));
                    observer.complete();
                }
            });
        });
    };
    /**
     * enter name for new push config
     */
    Push.prototype._enterName = function () {
        var _this = this;
        var prompt = {
            type: 'input',
            name: 'pushName',
            message: this.i18n.ENTER_SOMETHING.concat('Name'),
            validate: function (value) {
                var unique = lodash_1.find(_this.collection.pushFiles, { name: value });
                var pass = value.match(Validator_1.Validator.stringPattern);
                if (!value.length) {
                    _this.debuglog.error(new Error(_this.i18n.NOT_EMPTY('Name')));
                    return false;
                }
                if (unique) {
                    _this.debuglog.error(new Error(_this.i18n.ALREADY_EXIST(value, 'Pushconfig')));
                    return false;
                }
                if (pass) {
                    return true;
                }
                else {
                    _this.debuglog.error(new Error(_this.i18n.NOT_ALLOWED(value, Validator_1.Validator.stringPattern)));
                    return false;
                }
            }
        };
        return rxjs_1.Observable.fromPromise(this.inquirer.prompt(prompt));
    };
    /**
     * create a new push config
     */
    Push.prototype.add = function (name) {
        var _this = this;
        var model = new PushCollection_1.PushModel();
        var providers = [];
        var lastProvider;
        return this._enterName()
            .exhaustMap(function (answers) {
            model.name = answers.pushName;
            return _this._chooseProviderType()
                .filter(function (provider) {
                return provider.pushType !== _this.i18n.CANCEL;
            });
        })
            .exhaustMap(function (type) {
            lastProvider = type.pushType;
            return _this._addProvider(lastProvider)
                .exhaustMap(function (provider) {
                providers.push(provider);
                return _this._addAnother(lastProvider === 'ios' ? 'android' : 'ios');
            })
                .exhaustMap(function (answers) {
                // no one more set stor back
                if (answers.another) {
                    return _this._addProvider(lastProvider === 'ios' ? 'android' : 'ios');
                }
                return rxjs_1.Observable.from([null]);
            });
        })
            .exhaustMap(function (provider) {
            if (provider) {
                providers.push(provider);
            }
            model.path = path.join(_this.collection.pushRootFolder, model.name + ".hjson");
            model.providers = providers;
            return _this.collection.add(model)
                .last()
                .do(function () {
                _this.debuglog.info(_this.i18n.FILES_WRITTEN(model.name));
            });
        });
    };
    return Push;
}(Command_1.Command));
exports.Push = Push;
//# sourceMappingURL=Push.js.map