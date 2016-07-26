"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Command_1 = require('./../utility/Command');
var rxjs_1 = require('@reactivex/rxjs');
var FileApi_1 = require('./../utility/FileApi');
var Create_1 = require('./project/Create');
var Deploy_1 = require('./project/Deploy');
var RxFs_1 = require('./../utility/RxFs');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
/**
 * create a new Baas for the Developer
 * ```bash
 * ┌─────────┬──────────┬──────────┬────────────────────────────────┐
 * │ Options │ Commands │ Param(s) │ Description                    │
 * │         │          │          │                                │
 * │ new     │ create   │ <$name>  │ create a new Project in Folder │
 * │ new     │ help     │ --       │ List the New Command           │
 * │ new     │ back     │ --       │ Exit to Home                   │
 * │         │          │          │                                │
 * └─────────┴──────────┴──────────┴────────────────────────────────┘
 * ```
 */
var Project = (function (_super) {
    __extends(Project, _super);
    function Project() {
        var _this = this;
        _super.call(this, 'project');
        this.commands = {
            create: {
                when: function () {
                    var files = fs.readdirSync(process.cwd());
                    if (_.some(files, function (file) { return !/(^|\/)\.[^\/\.]/g.test(file); })) {
                        return false;
                    }
                    return true;
                },
                why: function () {
                    return _this.i18n.FOLDER_NOT_EMPTY(process.cwd());
                },
                description: this.i18n.NEW_CREATE,
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            deploy: {
                description: this.i18n.DEPLOY_PUBLISH,
                when: function () {
                    return RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'));
                },
                why: function () {
                    if (!RxFs_1.RxFs.exist(path.join(process.cwd(), 'relution.hjson'))) {
                        return _this.i18n.FOLDER_IS_NOT_A_RELUTION_PROJECT(path.join(process.cwd()));
                    }
                },
                vars: {
                    name: {
                        pos: 0
                    }
                }
            },
            help: {
                description: this.i18n.HELP_COMMAND('Project')
            },
            back: {
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
    Project.prototype.create = function (name) {
        var _this = this;
        var files = [];
        return rxjs_1.Observable.create(function (observer) {
            _this._fsApi.fileList(process.cwd()).subscribe({
                next: function (file) {
                    if (!/(^|\/)\.[^\/\.]/g.test(file)) {
                        console.log(file);
                        files.push(file);
                    }
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
    Project.prototype.deploy = function (args) {
        return new Deploy_1.Deploy(this).publish(args);
    };
    return Project;
}(Command_1.Command));
exports.Project = Project;
//# sourceMappingURL=Project.js.map