"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var rxjs_1 = require('@reactivex/rxjs');
var FileApi_1 = require('./../utility/FileApi');
var Create_1 = require('./new/Create');
/**
 * create a new Baas for the Developer
 */
var New = (function (_super) {
    __extends(New, _super);
    function New() {
        _super.call(this, 'new');
        this.commands = {
            create: {
                description: this.i18n.NEW_CREATE,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: this.i18n.LIST_COMMAND('New')
            },
            quit: {
                description: this.i18n.EXIT_TO_HOME
            }
        };
        this._fsApi = new FileApi_1.FileApi();
        this._create = new Create_1.Create();
    }
    /**
     * @params name a string to create the project
     * @return Observable
     */
    New.prototype.create = function (name) {
        var _this = this;
        var files = [];
        return rxjs_1.Observable.create(function (observer) {
            _this._fsApi.fileList(process.cwd()).subscribe({
                next: function (file) {
                    files.push(file);
                },
                complete: function () {
                    if (!files.length) {
                        _this._create.publish().subscribe(function (resp) { observer.next(resp); }, function (e) { return observer.error(e); }, function () { observer.complete(); });
                    }
                    else {
                        observer.error(new Error(_this.i18n.FOLDER_NOT_EMPTY(process.cwd())));
                        observer.complete();
                    }
                }
            });
        });
    };
    return New;
}(Command_1.Command));
exports.New = New;
//# sourceMappingURL=New.js.map