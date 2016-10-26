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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9QdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdCQUFzQixXQUFXLENBQUMsQ0FBQTtBQUNsQyx3QkFBc0Isc0JBQXNCLENBQUMsQ0FBQTtBQUM3QyxxQkFBbUIsbUJBQW1CLENBQUMsQ0FBQTtBQUN2QywrQkFBOEQsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRixxQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyxJQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUM3QixJQUFZLEtBQUssV0FBTSxPQUFPLENBQUMsQ0FBQTtBQUMvQiwwQkFBd0Isd0JBQXdCLENBQUMsQ0FBQTtBQUNqRCx1QkFBbUIsUUFBUSxDQUFDLENBQUE7QUFFNUI7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNIO0lBQTBCLHdCQUFPO0lBcUMvQjtRQXJDRixpQkF5UEM7UUFuTkcsa0JBQU0sTUFBTSxDQUFDLENBQUM7UUFyQ1QsZUFBVSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2xDLFVBQUssR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQixVQUFLLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDL0IsZUFBVSxHQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBTyxDQUFDO1FBQ3JDLGFBQVEsR0FBUTtZQUNyQixHQUFHLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFO29CQUNKLE1BQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFDRCxHQUFHLEVBQUU7b0JBQ0gsTUFBTSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUNELFdBQVcsRUFBRSxzQkFBc0I7Z0JBQ25DLElB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